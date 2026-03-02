import { eq, isNull, and, or, ilike, sql } from "drizzle-orm";
import { db } from "../db";
import { resources } from "../db/schema";
import type { SearchResult, LibraryItemType } from "../types";

export async function searchLibrary(
  query: string,
  type?: LibraryItemType
): Promise<SearchResult[]> {
  const pattern = `%${query}%`;

  const conditions = [
    isNull(resources.ownerId),
    or(
      ilike(resources.title, pattern),
      ilike(resources.content, pattern),
      sql`${resources.metadata}->>'description' ILIKE ${pattern}`
    ),
  ];

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
