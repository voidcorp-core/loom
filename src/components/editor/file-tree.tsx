"use client";

import { File, Folder } from "lucide-react";
import type { FileTreeNode } from "@/types";

function TreeNode({ node, depth = 0 }: { node: FileTreeNode; depth?: number }) {
  return (
    <div>
      <div
        className="flex items-center gap-1.5 py-0.5 text-sm hover:bg-accent/50 rounded px-1"
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
      >
        {node.type === "directory" ? (
          <Folder className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <File className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span className="truncate">{node.name}</span>
      </div>
      {node.children?.map((child) => (
        <TreeNode key={child.path} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export function FileTree({ files }: { files: FileTreeNode[] }) {
  if (files.length === 0) {
    return (
      <p className="text-sm text-muted-foreground p-2">No additional files</p>
    );
  }

  return (
    <div className="rounded-md border p-2">
      {files.map((node) => (
        <TreeNode key={node.path} node={node} />
      ))}
    </div>
  );
}
