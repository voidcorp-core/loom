import { skillsPath } from "./library.service";
import { getFile, listDirectory, getTree } from "../lib/github";
import { parseFrontmatter } from "../lib/frontmatter";
import { NotFoundError } from "../lib/errors";
import type { Skill, SkillSummary, SkillFrontmatter } from "../types";

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
