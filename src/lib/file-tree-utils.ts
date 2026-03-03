import type { ResourceFile, FileTreeNode } from "@/types/common";

/**
 * Converts flat ResourceFile paths into a nested FileTreeNode hierarchy.
 * e.g. ["SKILL.md", "examples/api.md", "examples/advanced/deep.md"]
 * → tree with directories and files properly nested.
 */
export function buildFileTree(files: ResourceFile[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];

  for (const file of files) {
    const parts = file.path.split("/");
    let currentLevel = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      const currentPath = parts.slice(0, i + 1).join("/");

      const existing = currentLevel.find((n) => n.name === part);

      if (isFile) {
        if (!existing) {
          currentLevel.push({ name: part, path: currentPath, type: "file" });
        }
      } else {
        if (existing && existing.type === "directory") {
          currentLevel = existing.children!;
        } else {
          const dir: FileTreeNode = {
            name: part,
            path: currentPath,
            type: "directory",
            children: [],
          };
          currentLevel.push(dir);
          currentLevel = dir.children!;
        }
      }
    }
  }

  // Sort: directories first, then files, alphabetically
  function sortTree(nodes: FileTreeNode[]): void {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    for (const node of nodes) {
      if (node.children) sortTree(node.children);
    }
  }

  sortTree(root);
  return root;
}
