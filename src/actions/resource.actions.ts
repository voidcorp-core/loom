"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/current-user";
import { forkResource, updateOwnResource } from "@/services/resource.service";

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
