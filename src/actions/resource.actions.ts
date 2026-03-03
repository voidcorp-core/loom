"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/current-user";
import {
  forkResource,
  updateOwnResource,
  createResource,
  deleteOwnResource,
} from "@/services/resource.service";
import { parseFrontmatter } from "@/lib/frontmatter";
import type { ResourceFile } from "@/types/common";

/**
 * Extract name & description from content frontmatter and merge into metadata.
 * This ensures list pages always show the correct description.
 */
function extractMetadata(
  content: string,
  existingMetadata?: Record<string, unknown>
): Record<string, unknown> {
  try {
    const { data } = parseFrontmatter<Record<string, unknown>>(content);
    const merged: Record<string, unknown> = { ...existingMetadata };
    if (data.name) merged.name = data.name;
    if (data.description) merged.description = data.description;
    return merged;
  } catch {
    return existingMetadata ?? {};
  }
}

interface SaveResourceInput {
  resourceId: string;
  isForked: boolean;
  type: "agent" | "skill" | "preset";
  slug: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
  files?: ResourceFile[];
}

export async function saveResourceAction(input: SaveResourceInput) {
  const user = await requireCurrentUser();

  const metadata = extractMetadata(input.content, input.metadata);

  const updates = {
    title: input.title,
    content: input.content,
    metadata,
    ...(input.files !== undefined && { files: input.files }),
  };

  if (input.isForked) {
    await updateOwnResource(input.resourceId, user.id!, updates);
  } else {
    await forkResource(input.resourceId, user.id!, updates);
  }

  const typePlural =
    input.type === "agent"
      ? "agents"
      : input.type === "skill"
        ? "skills"
        : "presets";

  revalidatePath(`/${typePlural}`);
  revalidatePath(`/${typePlural}/${input.slug}`);
}

interface CreateResourceInput {
  type: "agent" | "skill" | "preset";
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
  files?: ResourceFile[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createResourceAction(input: CreateResourceInput) {
  const user = await requireCurrentUser();

  if (!input.title.trim()) {
    throw new Error("Title is required");
  }
  if (!input.content.trim()) {
    throw new Error("Content is required");
  }

  const slug = slugify(input.title);
  if (!slug) {
    throw new Error("Title must contain at least one alphanumeric character");
  }

  const metadata = extractMetadata(input.content.trim(), input.metadata);

  await createResource(input.type, user.id!, {
    slug,
    title: input.title.trim(),
    content: input.content.trim(),
    metadata,
    ...(input.files !== undefined && { files: input.files }),
  });

  const typePlural =
    input.type === "agent"
      ? "agents"
      : input.type === "skill"
        ? "skills"
        : "presets";

  revalidatePath(`/${typePlural}`);

  return { slug };
}

interface DeleteResourceInput {
  resourceId: string;
  type: "agent" | "skill" | "preset";
  slug: string;
}

export async function deleteResourceAction(input: DeleteResourceInput) {
  const user = await requireCurrentUser();

  await deleteOwnResource(input.resourceId, user.id!);

  const typePlural =
    input.type === "agent"
      ? "agents"
      : input.type === "skill"
        ? "skills"
        : "presets";

  revalidatePath(`/${typePlural}`);
  revalidatePath(`/${typePlural}/${input.slug}`);
  revalidatePath("/marketplace");
}
