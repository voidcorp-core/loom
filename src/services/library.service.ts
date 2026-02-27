import { listDirectory, libraryPath } from "../lib/github";
import { LibraryStats } from "../types";

export function agentsPath(...segments: string[]): string {
  return libraryPath("agents", ...segments);
}

export function skillsPath(...segments: string[]): string {
  return libraryPath("skills", ...segments);
}

export function presetsPath(...segments: string[]): string {
  return libraryPath("presets", ...segments);
}

export async function getLibraryStats(): Promise<LibraryStats> {
  const [agentDirs, skillDirs, presetFiles] = await Promise.all([
    listDirectory(agentsPath()),
    listDirectory(skillsPath()),
    listDirectory(presetsPath()),
  ]);

  return {
    totalAgents: agentDirs.length,
    totalSkills: skillDirs.length,
    totalPresets: presetFiles.filter((f) => f.endsWith(".yaml")).length,
  };
}
