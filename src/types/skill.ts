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
  resourceId?: string;
  isForked?: boolean;
}

export interface SkillSummary {
  slug: string;
  name: string;
  description: string;
  isForked?: boolean;
  resourceId?: string;
}

