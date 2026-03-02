"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/current-user";
import {
  forkResource,
  updateOwnResource,
  createResource,
} from "@/services/resource.service";

interface SaveResourceInput {
  resourceId: string;
  isForked: boolean;
  type: "agent" | "skill" | "preset";
  slug: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export async function saveResourceAction(input: SaveResourceInput) {
  const user = await requireCurrentUser();

  const updates = {
    title: input.title,
    content: input.content,
    ...(input.metadata && { metadata: input.metadata }),
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

  await createResource(input.type, user.id!, {
    slug,
    title: input.title.trim(),
    content: input.content.trim(),
    ...(input.metadata && { metadata: input.metadata }),
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
