import { FileTreeNode, ResourceFile } from "./common";
import type { ResourceOrigin } from "./agent";

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
  supportingFiles: ResourceFile[];
  files: FileTreeNode[];
  sha: string;
  resourceId?: string;
  isForked?: boolean;
  origin?: ResourceOrigin;
  isPublic?: boolean;
}

export interface SkillSummary {
  slug: string;
  name: string;
  description: string;
  isForked?: boolean;
  origin?: ResourceOrigin;
  resourceId?: string;
  isPublic?: boolean;
}

