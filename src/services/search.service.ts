import { listSkills } from "./skill.service";
import { listAgents } from "./agent.service";
import { listPresets } from "./preset.service";
import { SearchResult, LibraryItemType } from "../types";

export async function searchLibrary(
  query: string,
  type?: LibraryItemType
): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  const q = query.toLowerCase();

  if (!type || type === "skill") {
    const skills = await listSkills();
    for (const s of skills) {
      if (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      ) {
        results.push({
          type: "skill",
          slug: s.slug,
          name: s.name,
          description: s.description,
        });
      }
    }
  }

  if (!type || type === "agent") {
    const agents = await listAgents();
    for (const a of agents) {
      if (
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q)
      ) {
        results.push({
          type: "agent",
          slug: a.slug,
          name: a.name,
          description: a.description,
        });
      }
    }
  }

  if (!type || type === "preset") {
    const presets = await listPresets();
    for (const p of presets) {
      if (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      ) {
        results.push({
          type: "preset",
          slug: p.slug,
          name: p.name,
          description: p.description,
        });
      }
    }
  }

  return results;
}
