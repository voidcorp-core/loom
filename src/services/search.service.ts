import { eq, isNull, and, or, ilike, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { db } from "../db";
import { resources } from "../db/schema";
import type { SearchResult, LibraryItemType } from "../types";

export async function searchLibrary(
  query: string,
  type?: LibraryItemType
): Promise<SearchResult[]> {
  // Split query into individual words so "front end" matches "frontend"
  const words = query
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);

  if (words.length === 0) return [];

  // Each word must match at least one searchable field
  const wordConditions: SQL[] = words.map((word) => {
    const pattern = `%${word}%`;
    return or(
      ilike(resources.title, pattern),
      ilike(resources.slug, pattern),
      ilike(resources.content, pattern),
      sql`${resources.metadata}->>'name' ILIKE ${pattern}`,
      sql`${resources.metadata}->>'description' ILIKE ${pattern}`,
      sql`${resources.metadata}->>'role' ILIKE ${pattern}`
    )!;
  });

  const conditions: SQL[] = [isNull(resources.ownerId), ...wordConditions];

  if (type) {
    conditions.push(eq(resources.type, type));
  }

  const rows = await db
    .select()
    .from(resources)
    .where(and(...conditions));

  return rows.map((row) => {
    const meta = row.metadata as Record<string, unknown> | null;
    return {
      type: row.type as LibraryItemType,
      slug: row.slug,
      name: (meta?.name as string) || row.title,
      description: (meta?.description as string) || "",
    };
  });
}
