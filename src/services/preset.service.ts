import { presetsPath } from "./library.service";
import { getFile, listDirectory } from "../lib/github";
import { parseYaml } from "../lib/yaml";
import { NotFoundError } from "../lib/errors";
import type { Preset, PresetSummary } from "../types";

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
