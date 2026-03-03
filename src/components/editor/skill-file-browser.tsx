"use client";

import { useState } from "react";
import { File, Folder } from "lucide-react";
import type { FileTreeNode, ResourceFile } from "@/types";

interface TreeNodeProps {
  node: FileTreeNode;
  depth?: number;
  selectedPath: string | null;
  onSelect: (path: string) => void;
}

function TreeNode({ node, depth = 0, selectedPath, onSelect }: TreeNodeProps) {
  return (
    <div>
      <button
        type="button"
        className={`flex items-center gap-1.5 py-0.5 text-sm rounded px-1 w-full text-left ${
          node.type === "file" ? "cursor-pointer hover:bg-accent/50" : ""
        } ${selectedPath === node.path ? "bg-accent" : ""}`}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}
        onClick={() => node.type === "file" && onSelect(node.path)}
        disabled={node.type === "directory"}
      >
        {node.type === "directory" ? (
          <Folder className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        ) : (
          <File className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        )}
        <span className="truncate">{node.name}</span>
      </button>
      {node.children?.map((child) => (
        <TreeNode
          key={child.path}
          node={child}
          depth={depth + 1}
          selectedPath={selectedPath}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

interface SkillFileBrowserProps {
  files: FileTreeNode[];
  supportingFiles: ResourceFile[];
}

export function SkillFileBrowser({ files, supportingFiles }: SkillFileBrowserProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  if (files.length === 0) {
    return (
      <p className="text-sm text-muted-foreground p-2">No additional files</p>
    );
  }

  const selectedFile = selectedPath
    ? supportingFiles.find((f) => f.path === selectedPath)
    : null;

  return (
    <div className="flex gap-4 min-h-[200px]">
      <div className="rounded-md border p-2 w-48 shrink-0 overflow-auto">
        {files.map((node) => (
          <TreeNode
            key={node.path}
            node={node}
            selectedPath={selectedPath}
            onSelect={setSelectedPath}
          />
        ))}
      </div>
      <div className="flex-1 min-w-0">
        {selectedFile ? (
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-foreground">{selectedFile.path}</p>
            <pre className="whitespace-pre-wrap text-sm font-mono rounded-md border p-4 bg-muted/50 max-h-[400px] overflow-auto">
              {selectedFile.content}
            </pre>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            Select a file to view its content
          </div>
        )}
      </div>
    </div>
  );
}
