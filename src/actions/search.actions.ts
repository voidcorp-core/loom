"use server";

import { searchLibrary } from "@/services/search.service";
import type { SearchResult, LibraryItemType } from "@/types";

export async function searchLibraryAction(
  query: string,
  type?: LibraryItemType
): Promise<SearchResult[]> {
  return searchLibrary(query, type);
}
