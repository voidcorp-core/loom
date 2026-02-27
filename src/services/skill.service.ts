import { skillsPath } from "./library.service";
import {
  getFile,
  listDirectory,
  exists,
  putFile,
  getTree,
  deleteDirectory,
} from "../lib/github";
import { parseFrontmatter, serializeFrontmatter } from "../lib/frontmatter";
import { NotFoundError, ValidationError } from "../lib/errors";
import {
  Skill,
  SkillSummary,
  SkillFrontmatter,
  CreateSkillInput,
  UpdateSkillInput,
} from "../types";

const SKILL_FILE = "SKILL.md";

export async function listSkills(): Promise<SkillSummary[]> {
  const dirs = await listDirectory(skillsPath());
  const summaries: SkillSummary[] = [];

  for (const dir of dirs) {
    const filePath = skillsPath(dir, SKILL_FILE);
    try {
      const file = await getFile(filePath);
      const { data } = parseFrontmatter<SkillFrontmatter>(file.content);
      summaries.push({
        slug: dir,
        name: data.name || dir,
        description: data.description || "",
      });
    } catch {
      // skip malformed or missing entries
    }
  }

  return summaries.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getSkill(slug: string): Promise<Skill> {
  const filePath = skillsPath(slug, SKILL_FILE);
  const dirPath = skillsPath(slug);

  let file;
  try {
    file = await getFile(filePath);
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError("Skill", slug);
    }
    throw error;
  }

  const { data, content } = parseFrontmatter<SkillFrontmatter>(file.content);
  const files = await getTree(dirPath);

  return {
    slug,
    frontmatter: data,
    content,
    rawContent: file.content,
    path: filePath,
    directoryPath: dirPath,
    files,
    sha: file.sha,
  };
}

export async function createSkill(input: CreateSkillInput): Promise<Skill> {
  const dirPath = skillsPath(input.slug);

  if (await exists(dirPath)) {
    throw new ValidationError(`Skill already exists: ${input.slug}`);
  }

  const raw = serializeFrontmatter(
    input.frontmatter as unknown as Record<string, unknown>,
    input.content
  );
  const filePath = skillsPath(input.slug, SKILL_FILE);
  await putFile(filePath, raw, `Create skill: ${input.slug}`);

  return getSkill(input.slug);
}

export async function updateSkill(
  slug: string,
  input: UpdateSkillInput
): Promise<Skill> {
  const existing = await getSkill(slug);

  const newFrontmatter = {
    ...existing.frontmatter,
    ...input.frontmatter,
  };
  const newContent =
    input.content !== undefined ? input.content : existing.content;

  const raw = serializeFrontmatter(
    newFrontmatter as unknown as Record<string, unknown>,
    newContent
  );
  await putFile(existing.path, raw, `Update skill: ${slug}`, existing.sha);

  return getSkill(slug);
}

export async function deleteSkill(slug: string): Promise<void> {
  const dirPath = skillsPath(slug);
  if (!(await exists(dirPath))) {
    throw new NotFoundError("Skill", slug);
  }
  await deleteDirectory(dirPath, `Delete skill: ${slug}`);
}
