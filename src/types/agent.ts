import { FileTreeNode } from "./common";

export interface AgentFrontmatter {
  name: string;
  description: string;
  role: string;
  color?: string;
  tools?: string;
  skills?: string[];
  "delegates-to"?: string[];
  model?: string;
}

export interface Agent {
  slug: string;
  frontmatter: AgentFrontmatter;
  content: string;
  rawContent: string;
  path: string;
  directoryPath: string;
  files: FileTreeNode[];
  sha: string;
}

export interface AgentSummary {
  slug: string;
  name: string;
  description: string;
  role: string;
  color?: string;
}

