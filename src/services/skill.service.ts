import { eq, isNull, and, asc } from "drizzle-orm";
import { db } from "../db";
import { resources } from "../db/schema";
import { parseFrontmatter } from "../lib/frontmatter";
import { NotFoundError } from "../lib/errors";
import { buildFileTree } from "../lib/file-tree-utils";
import {
  getResourceForUser,
  listResourcesForUser,
} from "./resource.service";
import type { Skill, SkillSummary, SkillFrontmatter, ResourceFile } from "../types";

export async function listSkills(): Promise<SkillSummary[]> {
  const rows = await db
    .select()
    .from(resources)
    .where(and(eq(resources.type, "skill"), isNull(resources.ownerId)))
    .orderBy(asc(resources.title));

  return rows.map((row) => {
    const meta = row.metadata as Record<string, unknown> | null;
    const name = (meta?.name as string) || row.title;
    let description = (meta?.description as string) || "";
    if (!description) {
      try {
        const fm = parseFrontmatter<Record<string, unknown>>(row.content).data;
        description = (fm.description as string) || "";
      } catch { /* unparseable frontmatter */ }
    }
    return { slug: row.slug, name, description };
  });
}

export async function listSkillsForUser(
  userId: string | null
): Promise<SkillSummary[]> {
  const rows = await listResourcesForUser("skill", userId);
  return rows.map((row) => {
    const meta = row.metadata;
    const name = (meta?.name as string) || row.title;
    let description = (meta?.description as string) || "";
    if (!description) {
      try {
        const fm = parseFrontmatter<Record<string, unknown>>(row.content).data;
        description = (fm.description as string) || "";
      } catch { /* unparseable frontmatter */ }
    }
    return {
      slug: row.slug,
      name,
      description,
      isForked: row.isForked,
      origin: row.origin,
      resourceId: row.id,
      isPublic: row.isPublic,
    };
  });
}

export async function getSkill(slug: string): Promise<Skill> {
  const row = await db
    .select()
    .from(resources)
    .where(
      and(
        eq(resources.type, "skill"),
        eq(resources.slug, slug),
        isNull(resources.ownerId)
      )
    )
    .then((rows) => rows[0]);

  if (!row) {
    throw new NotFoundError("Skill", slug);
  }

  const { data, content } = parseFrontmatter<SkillFrontmatter>(row.content);
  const supportingFiles = (row.files as ResourceFile[] | null) ?? [];

  return {
    slug,
    frontmatter: data,
    content,
    rawContent: row.content,
    path: `library/skills/${slug}/SKILL.md`,
    directoryPath: `library/skills/${slug}`,
    supportingFiles,
    files: buildFileTree(supportingFiles),
    sha: row.id,
  };
}

export async function getSkillForUser(
  slug: string,
  userId: string | null
): Promise<Skill> {
  const row = await getResourceForUser("skill", slug, userId);

  if (!row) {
    throw new NotFoundError("Skill", slug);
  }

  const { data, content } = parseFrontmatter<SkillFrontmatter>(row.content);
  const supportingFiles = (row.files as ResourceFile[] | null) ?? [];

  return {
    slug,
    frontmatter: data,
    content,
    rawContent: row.content,
    path: `library/skills/${slug}/SKILL.md`,
    directoryPath: `library/skills/${slug}`,
    supportingFiles,
    files: buildFileTree(supportingFiles),
    sha: row.id,
    resourceId: row.id,
    isForked: row.isForked,
    origin: row.origin,
    isPublic: row.isPublic,
  };
}
