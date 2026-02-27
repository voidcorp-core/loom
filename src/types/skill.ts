import { FileTreeNode } from "./common";

export interface SkillFrontmatter {
  name: string;
  description: string;
  "allowed-tools"?: string;
  metadata?: Record<string, unknown>;
}

export interface Skill {
  slug: string;
  frontmatter: SkillFrontmatter;
  content: string;
  rawContent: string;
  path: string;
  directoryPath: string;
  files: FileTreeNode[];
  sha: string;
}

export interface SkillSummary {
  slug: string;
  name: string;
  description: string;
}

export interface CreateSkillInput {
  slug: string;
  frontmatter: SkillFrontmatter;
  content: string;
}

export interface UpdateSkillInput {
  frontmatter?: Partial<SkillFrontmatter>;
  content?: string;
}
