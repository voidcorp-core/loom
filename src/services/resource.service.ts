"use server";

import { eq, isNull, and, asc, desc, isNotNull, ilike, sql } from "drizzle-orm";
import { db } from "../db";
import { resources, users } from "../db/schema";

type ResourceType = "agent" | "skill" | "preset";

export interface ResourceRow {
  id: string;
  type: string;
  slug: string;
  title: string;
  content: string;
  metadata: Record<string, unknown> | null;
  ownerId: string | null;
  sourceId: string | null;
  isPublic: boolean;
}

export interface ResourceRowWithForkFlag extends ResourceRow {
  isForked: boolean;
}

/**
 * Get a resource for a specific user: returns the user's fork if it exists,
 * otherwise falls back to the base resource.
 */
export async function getResourceForUser(
  type: ResourceType,
  slug: string,
  userId: string | null
): Promise<(ResourceRow & { isForked: boolean }) | null> {
  if (userId) {
    const fork = await db
      .select()
      .from(resources)
      .where(
        and(
          eq(resources.type, type),
          eq(resources.slug, slug),
          eq(resources.ownerId, userId)
        )
      )
      .then((rows) => rows[0]);

    if (fork) {
      return { ...fork, metadata: fork.metadata as Record<string, unknown> | null, isForked: true };
    }
  }

  const base = await db
    .select()
    .from(resources)
    .where(
      and(
        eq(resources.type, type),
        eq(resources.slug, slug),
        isNull(resources.ownerId)
      )
    )
    .then((rows) => rows[0]);

  if (!base) return null;

  return { ...base, metadata: base.metadata as Record<string, unknown> | null, isForked: false };
}

/**
 * List resources for a user: merges base catalog with user's forks.
 * Forks replace their base counterpart by slug.
 */
export async function listResourcesForUser(
  type: ResourceType,
  userId: string | null
): Promise<ResourceRowWithForkFlag[]> {
  const baseRows = await db
    .select()
    .from(resources)
    .where(and(eq(resources.type, type), isNull(resources.ownerId)))
    .orderBy(asc(resources.title));

  if (!userId) {
    return baseRows.map((row) => ({
      ...row,
      metadata: row.metadata as Record<string, unknown> | null,
      isForked: false,
    }));
  }

  const forkRows = await db
    .select()
    .from(resources)
    .where(and(eq(resources.type, type), eq(resources.ownerId, userId)));

  const forkBySlug = new Map(forkRows.map((r) => [r.slug, r]));

  const merged: ResourceRowWithForkFlag[] = baseRows.map((base) => {
    const fork = forkBySlug.get(base.slug);
    if (fork) {
      forkBySlug.delete(base.slug);
      return {
        ...fork,
        metadata: fork.metadata as Record<string, unknown> | null,
        isForked: true,
      };
    }
    return {
      ...base,
      metadata: base.metadata as Record<string, unknown> | null,
      isForked: false,
    };
  });

  // Add user-created resources that don't override a base slug
  for (const fork of forkBySlug.values()) {
    merged.push({
      ...fork,
      metadata: fork.metadata as Record<string, unknown> | null,
      isForked: true,
    });
  }

  return merged.sort((a, b) => a.title.localeCompare(b.title));
}

/**
 * Fork a base resource for a user: creates a copy with ownerId = userId.
 */
export async function forkResource(
  baseResourceId: string,
  userId: string,
  updates: { title?: string; content?: string; metadata?: Record<string, unknown> }
): Promise<ResourceRow> {
  const base = await db
    .select()
    .from(resources)
    .where(eq(resources.id, baseResourceId))
    .then((rows) => rows[0]);

  if (!base) {
    throw new Error("Base resource not found");
  }

  // Check if user already has a fork of this slug+type
  const existing = await db
    .select()
    .from(resources)
    .where(
      and(
        eq(resources.type, base.type as ResourceType),
        eq(resources.slug, base.slug),
        eq(resources.ownerId, userId)
      )
    )
    .then((rows) => rows[0]);

  if (existing) {
    throw new Error("You already have a fork of this resource");
  }

  const [created] = await db
    .insert(resources)
    .values({
      type: base.type as ResourceType,
      slug: base.slug,
      title: updates.title ?? base.title,
      content: updates.content ?? base.content,
      metadata: updates.metadata ?? (base.metadata as Record<string, unknown> | null),
      ownerId: userId,
      sourceId: base.id,
      isPublic: false,
    })
    .returning();

  return created as ResourceRow;
}

/**
 * Create a brand-new resource owned by the user (not a fork).
 */
export async function createResource(
  type: ResourceType,
  userId: string,
  data: { slug: string; title: string; content: string; metadata?: Record<string, unknown> }
): Promise<ResourceRow> {
  // Check slug uniqueness for this user
  const existing = await db
    .select()
    .from(resources)
    .where(
      and(
        eq(resources.type, type),
        eq(resources.slug, data.slug),
        eq(resources.ownerId, userId)
      )
    )
    .then((rows) => rows[0]);

  if (existing) {
    throw new Error("You already have a resource with this slug");
  }

  const [created] = await db
    .insert(resources)
    .values({
      type,
      slug: data.slug,
      title: data.title,
      content: data.content,
      metadata: data.metadata ?? null,
      ownerId: userId,
      sourceId: null,
      isPublic: false,
    })
    .returning();

  return created as ResourceRow;
}

/**
 * Update a resource owned by the user.
 */
export async function updateOwnResource(
  resourceId: string,
  userId: string,
  updates: { title?: string; content?: string; metadata?: Record<string, unknown> }
): Promise<ResourceRow> {
  const row = await db
    .select()
    .from(resources)
    .where(and(eq(resources.id, resourceId), eq(resources.ownerId, userId)))
    .then((rows) => rows[0]);

  if (!row) {
    throw new Error("Resource not found or not owned by you");
  }

  const [updated] = await db
    .update(resources)
    .set({
      ...(updates.title !== undefined && { title: updates.title }),
      ...(updates.content !== undefined && { content: updates.content }),
      ...(updates.metadata !== undefined && { metadata: updates.metadata }),
    })
    .where(eq(resources.id, resourceId))
    .returning();

  return updated as ResourceRow;
}

// ---------------------------------------------------------------------------
// Marketplace
// ---------------------------------------------------------------------------

export interface MarketplaceItem {
  id: string;
  type: string;
  slug: string;
  title: string;
  description: string;
  authorName: string | null;
  authorImage: string | null;
  installCount: number;
  publishedAt: Date | null;
}

export interface MarketplaceFilters {
  type?: ResourceType;
  search?: string;
  sort?: "popular" | "recent";
}

/**
 * List public marketplace resources with optional filters.
 */
export async function listMarketplaceResources(
  filters: MarketplaceFilters = {}
): Promise<MarketplaceItem[]> {
  const conditions = [
    eq(resources.isPublic, true),
    isNotNull(resources.ownerId),
  ];

  if (filters.type) {
    conditions.push(eq(resources.type, filters.type));
  }

  if (filters.search) {
    conditions.push(ilike(resources.title, `%${filters.search}%`));
  }

  const orderBy =
    filters.sort === "recent"
      ? desc(resources.publishedAt)
      : desc(resources.installCount);

  const rows = await db
    .select({
      id: resources.id,
      type: resources.type,
      slug: resources.slug,
      title: resources.title,
      metadata: resources.metadata,
      installCount: resources.installCount,
      publishedAt: resources.publishedAt,
      authorName: users.name,
      authorImage: users.image,
    })
    .from(resources)
    .leftJoin(users, eq(resources.ownerId, users.id))
    .where(and(...conditions))
    .orderBy(orderBy);

  return rows.map((row) => {
    const meta = row.metadata as Record<string, unknown> | null;
    return {
      id: row.id,
      type: row.type,
      slug: row.slug,
      title: row.title,
      description: (meta?.description as string) || "",
      authorName: row.authorName,
      authorImage: row.authorImage,
      installCount: row.installCount,
      publishedAt: row.publishedAt,
    };
  });
}

/**
 * Publish a user's resource to the marketplace.
 */
export async function publishResource(
  resourceId: string,
  userId: string
): Promise<void> {
  const row = await db
    .select()
    .from(resources)
    .where(and(eq(resources.id, resourceId), eq(resources.ownerId, userId)))
    .then((rows) => rows[0]);

  if (!row) {
    throw new Error("Resource not found or not owned by you");
  }

  await db
    .update(resources)
    .set({ isPublic: true, publishedAt: new Date() })
    .where(eq(resources.id, resourceId));
}

/**
 * Unpublish a user's resource from the marketplace.
 */
export async function unpublishResource(
  resourceId: string,
  userId: string
): Promise<void> {
  const row = await db
    .select()
    .from(resources)
    .where(and(eq(resources.id, resourceId), eq(resources.ownerId, userId)))
    .then((rows) => rows[0]);

  if (!row) {
    throw new Error("Resource not found or not owned by you");
  }

  await db
    .update(resources)
    .set({ isPublic: false, publishedAt: null })
    .where(eq(resources.id, resourceId));
}

/**
 * Install a marketplace resource: creates a copy for the user
 * and increments installCount on the source.
 */
export async function installResource(
  resourceId: string,
  userId: string
): Promise<ResourceRow> {
  const source = await db
    .select()
    .from(resources)
    .where(and(eq(resources.id, resourceId), eq(resources.isPublic, true)))
    .then((rows) => rows[0]);

  if (!source) {
    throw new Error("Resource not found or not public");
  }

  // Check if user already has this slug+type
  const existing = await db
    .select()
    .from(resources)
    .where(
      and(
        eq(resources.type, source.type as ResourceType),
        eq(resources.slug, source.slug),
        eq(resources.ownerId, userId)
      )
    )
    .then((rows) => rows[0]);

  if (existing) {
    throw new Error("You already have a resource with this slug");
  }

  const [copy] = await db
    .insert(resources)
    .values({
      type: source.type as ResourceType,
      slug: source.slug,
      title: source.title,
      content: source.content,
      metadata: source.metadata as Record<string, unknown> | null,
      ownerId: userId,
      sourceId: source.id,
      isPublic: false,
    })
    .returning();

  await db
    .update(resources)
    .set({ installCount: sql`${resources.installCount} + 1` })
    .where(eq(resources.id, resourceId));

  return copy as ResourceRow;
}
