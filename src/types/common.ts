export interface ResourceFile {
  path: string;      // relative path: "examples/api.md"
  content: string;   // text content of the file
}

export interface FileTreeNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileTreeNode[];
}

export interface LibraryStats {
  totalSkills: number;
  totalAgents: number;
  totalPresets: number;
}

export type LibraryItemType = "skill" | "agent" | "preset";

export interface SearchResult {
  type: LibraryItemType;
  slug: string;
  name: string;
  description: string;
  matchContext?: string;
}
