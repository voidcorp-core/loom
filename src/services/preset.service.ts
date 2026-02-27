import { presetsPath } from "./library.service";
import { getFile, listDirectory, exists, putFile, deleteFile } from "../lib/github";
import { parseYaml, serializeYaml } from "../lib/yaml";
import { NotFoundError, ValidationError } from "../lib/errors";
import {
  Preset,
  PresetSummary,
  CreatePresetInput,
  UpdatePresetInput,
} from "../types";

export async function listPresets(): Promise<PresetSummary[]> {
  const files = await listDirectory(presetsPath());
  const summaries: PresetSummary[] = [];

  for (const fileName of files) {
    if (!fileName.endsWith(".yaml")) continue;

    try {
      const file = await getFile(presetsPath(fileName));
      const data = parseYaml<Preset>(file.content);
      const slug = fileName.replace(/\.yaml$/, "");
      summaries.push({
        slug,
        name: data.name || slug,
        description: data.description || "",
        agentCount: data.agents?.length || 0,
        skillCount: data.skills?.length || 0,
      });
    } catch {
      // skip malformed
    }
  }

  return summaries.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getPreset(slug: string): Promise<Preset> {
  const filePath = presetsPath(`${slug}.yaml`);

  let file;
  try {
    file = await getFile(filePath);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError("Preset", slug);
    }
    throw error;
  }

  const data = parseYaml<Omit<Preset, "slug" | "sha">>(file.content);
  return { slug, ...data, sha: file.sha };
}

export async function createPreset(
  input: CreatePresetInput
): Promise<Preset> {
  const filePath = presetsPath(`${input.slug}.yaml`);

  if (await exists(filePath)) {
    throw new ValidationError(`Preset already exists: ${input.slug}`);
  }

  const { slug, ...data } = input;
  await putFile(filePath, serializeYaml(data), `Create preset: ${slug}`);

  return getPreset(slug);
}

export async function updatePreset(
  slug: string,
  input: UpdatePresetInput
): Promise<Preset> {
  const existing = await getPreset(slug);
  const { slug: _, sha: __, ...existingData } = existing;
  const merged = { ...existingData, ...input };

  const filePath = presetsPath(`${slug}.yaml`);
  await putFile(
    filePath,
    serializeYaml(merged),
    `Update preset: ${slug}`,
    existing.sha
  );

  return getPreset(slug);
}

export async function deletePreset(slug: string): Promise<void> {
  const filePath = presetsPath(`${slug}.yaml`);

  let file;
  try {
    file = await getFile(filePath);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError("Preset", slug);
    }
    throw error;
  }

  await deleteFile(filePath, file.sha, `Delete preset: ${slug}`);
}
