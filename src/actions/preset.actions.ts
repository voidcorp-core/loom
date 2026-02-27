"use server";

import {
  listPresets,
  getPreset,
  createPreset,
  updatePreset,
  deletePreset,
} from "@/services/preset.service";
import type {
  PresetSummary,
  Preset,
  CreatePresetInput,
  UpdatePresetInput,
} from "@/types";
import { revalidatePath } from "next/cache";

export async function listPresetsAction(): Promise<PresetSummary[]> {
  return listPresets();
}

export async function getPresetAction(slug: string): Promise<Preset> {
  return getPreset(slug);
}

export async function createPresetAction(
  input: CreatePresetInput
): Promise<Preset> {
  const preset = await createPreset(input);
  revalidatePath("/presets");
  return preset;
}

export async function updatePresetAction(
  slug: string,
  input: UpdatePresetInput
): Promise<Preset> {
  const preset = await updatePreset(slug, input);
  revalidatePath(`/presets/${slug}`);
  revalidatePath("/presets");
  return preset;
}

export async function deletePresetAction(slug: string): Promise<void> {
  await deletePreset(slug);
  revalidatePath("/presets");
}
