import matter from "gray-matter";

export function parseFrontmatter<T>(raw: string): {
  data: T;
  content: string;
} {
  const { data, content } = matter(raw);
  return { data: data as T, content: content.trim() };
}

export function serializeFrontmatter<T extends Record<string, unknown>>(
  data: T,
  content: string
): string {
  return matter.stringify(content, data);
}
