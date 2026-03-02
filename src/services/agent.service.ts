import { eq, isNull, and, asc } from "drizzle-orm";
import { db } from "../db";
import { resources } from "../db/schema";
import { parseFrontmatter } from "../lib/frontmatter";
import { NotFoundError } from "../lib/errors";
import {
  getResourceForUser,
  listResourcesForUser,
} from "./resource.service";
import type { Agent, AgentSummary, AgentFrontmatter } from "../types";

export async function listAgents(): Promise<AgentSummary[]> {
  const rows = await db
    .select()
    .from(resources)
    .where(and(eq(resources.type, "agent"), isNull(resources.ownerId)))
    .orderBy(asc(resources.title));

  return rows.map((row) => {
    const meta = row.metadata as Record<string, unknown> | null;
    return {
      slug: row.slug,
      name: (meta?.name as string) || row.title,
      description: (meta?.description as string) || "",
      role: (meta?.role as string) || "general",
      color: meta?.color as string | undefined,
    };
  });
}

export async function listAgentsForUser(
  userId: string | null
): Promise<AgentSummary[]> {
  const rows = await listResourcesForUser("agent", userId);
  return rows.map((row) => {
    const meta = row.metadata;
    return {
      slug: row.slug,
      name: (meta?.name as string) || row.title,
      description: (meta?.description as string) || "",
      role: (meta?.role as string) || "general",
      color: meta?.color as string | undefined,
      isForked: row.isForked,
      resourceId: row.id,
    };
  });
}

export async function getAgent(slug: string): Promise<Agent> {
  const row = await db
    .select()
    .from(resources)
    .where(
      and(
        eq(resources.type, "agent"),
        eq(resources.slug, slug),
        isNull(resources.ownerId)
      )
    )
    .then((rows) => rows[0]);

  if (!row) {
    throw new NotFoundError("Agent", slug);
  }

  const { data, content } = parseFrontmatter<AgentFrontmatter>(row.content);

  return {
    slug,
    frontmatter: data,
    content,
    rawContent: row.content,
    path: `library/agents/${slug}/AGENT.md`,
    directoryPath: `library/agents/${slug}`,
    files: [],
    sha: row.id,
  };
}

export async function getAgentForUser(
  slug: string,
  userId: string | null
): Promise<Agent> {
  const row = await getResourceForUser("agent", slug, userId);

  if (!row) {
    throw new NotFoundError("Agent", slug);
  }

  const { data, content } = parseFrontmatter<AgentFrontmatter>(row.content);

  return {
    slug,
    frontmatter: data,
    content,
    rawContent: row.content,
    path: `library/agents/${slug}/AGENT.md`,
    directoryPath: `library/agents/${slug}`,
    files: [],
    sha: row.id,
    resourceId: row.id,
    isForked: row.isForked,
    isPublic: row.isPublic,
  };
}
