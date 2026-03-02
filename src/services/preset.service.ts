import { eq, isNull, and, asc } from "drizzle-orm";
import { db } from "../db";
import { resources } from "../db/schema";
import { parseYaml } from "../lib/yaml";
import { NotFoundError } from "../lib/errors";
import type { Preset, PresetSummary } from "../types";

export async function listPresets(): Promise<PresetSummary[]> {
  const rows = await db
    .select()
    .from(resources)
    .where(and(eq(resources.type, "preset"), isNull(resources.ownerId)))
    .orderBy(asc(resources.title));

  return rows.map((row) => {
    const meta = row.metadata as Record<string, unknown> | null;
    return {
      slug: row.slug,
      name: (meta?.name as string) || row.title,
      description: (meta?.description as string) || "",
      agentCount: (meta?.agentCount as number) || 0,
      skillCount: (meta?.skillCount as number) || 0,
    };
  });
}

export async function getPreset(slug: string): Promise<Preset> {
  const row = await db
    .select()
    .from(resources)
    .where(
      and(
        eq(resources.type, "preset"),
        eq(resources.slug, slug),
        isNull(resources.ownerId)
      )
    )
    .then((rows) => rows[0]);

  if (!row) {
    throw new NotFoundError("Preset", slug);
  }

  const data = parseYaml<Omit<Preset, "slug" | "sha">>(row.content);
  return { slug, ...data, sha: row.id };
}
