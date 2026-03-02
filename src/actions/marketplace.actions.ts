"use server";

import { revalidatePath } from "next/cache";
import { requireCurrentUser } from "@/lib/current-user";
import {
  publishResource,
  unpublishResource,
  installResource,
} from "@/services/resource.service";

export async function publishResourceAction(resourceId: string) {
  const user = await requireCurrentUser();
  await publishResource(resourceId, user.id!);
  revalidatePath("/marketplace");
}

export async function unpublishResourceAction(resourceId: string) {
  const user = await requireCurrentUser();
  await unpublishResource(resourceId, user.id!);
  revalidatePath("/marketplace");
}

export async function installResourceAction(resourceId: string) {
  const user = await requireCurrentUser();
  await installResource(resourceId, user.id!);
  revalidatePath("/marketplace");
  revalidatePath("/agents");
  revalidatePath("/skills");
  revalidatePath("/presets");
}
