"use server";

import { listPresets, getPreset } from "@/services/preset.service";
import type { PresetSummary, Preset } from "@/types";

export async function listPresetsAction(): Promise<PresetSummary[]> {
  return listPresets();
}

export async function getPresetAction(slug: string): Promise<Preset> {
  return getPreset(slug);
}
