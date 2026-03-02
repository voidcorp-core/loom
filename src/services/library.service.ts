import { eq, isNull, and, count } from "drizzle-orm";
import { db } from "../db";
import { resources } from "../db/schema";
import type { LibraryStats } from "../types";

export async function getLibraryStats(): Promise<LibraryStats> {
  const baseFilter = isNull(resources.ownerId);

  const [agents, skills, presets] = await Promise.all([
    db
      .select({ count: count() })
      .from(resources)
      .where(and(eq(resources.type, "agent"), baseFilter)),
    db
      .select({ count: count() })
      .from(resources)
      .where(and(eq(resources.type, "skill"), baseFilter)),
    db
      .select({ count: count() })
      .from(resources)
      .where(and(eq(resources.type, "preset"), baseFilter)),
  ]);

  return {
    totalAgents: agents[0].count,
    totalSkills: skills[0].count,
    totalPresets: presets[0].count,
  };
}
