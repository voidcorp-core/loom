"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { saveResourceAction } from "@/actions/resource.actions";
import type { ResourceFile } from "@/types/common";

interface ResourceEditButtonProps {
  resourceId: string;
  isForked: boolean;
  type: "agent" | "skill" | "preset";
  slug: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
  files?: ResourceFile[];
}

export function ResourceEditButton({
  resourceId,
  isForked,
  type,
  slug,
  title,
  content,
  metadata,
  files: initialFiles,
}: ResourceEditButtonProps) {
  const [showForkConfirm, setShowForkConfirm] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [editFiles, setEditFiles] = useState<ResourceFile[]>(initialFiles ?? []);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);
  const [newFilePath, setNewFilePath] = useState("");
  const [isPending, startTransition] = useTransition();

  const hasFiles = type === "skill";

  function handleEditClick() {
    setEditTitle(title);
    setEditContent(content);
    setEditFiles(initialFiles ?? []);
    setSelectedFileIndex(null);
    setNewFilePath("");

    if (isForked) {
      setShowEditor(true);
    } else {
      setShowForkConfirm(true);
    }
  }

  function handleForkConfirm() {
    setShowForkConfirm(false);
    setShowEditor(true);
  }

  function handleAddFile() {
    const trimmed = newFilePath.trim();
    if (!trimmed) return;
    if (editFiles.some((f) => f.path === trimmed)) {
      toast.error("A file with this path already exists");
      return;
    }
    setEditFiles([...editFiles, { path: trimmed, content: "" }]);
    setSelectedFileIndex(editFiles.length);
    setNewFilePath("");
  }

  function handleRemoveFile(index: number) {
    const next = editFiles.filter((_, i) => i !== index);
    setEditFiles(next);
    setSelectedFileIndex(null);
  }

  function handleFileContentChange(index: number, newContent: string) {
    setEditFiles(
      editFiles.map((f, i) => (i === index ? { ...f, content: newContent } : f))
    );
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await saveResourceAction({
          resourceId,
          isForked,
          type,
          slug,
          title: editTitle,
          content: editContent,
          metadata,
          ...(hasFiles && { files: editFiles }),
        });
        setShowEditor(false);
        toast.success(
          isForked ? "Resource updated" : "Fork created successfully"
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save"
        );
      }
    });
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleEditClick}>
        <Pencil className="h-4 w-4 mr-2" />
        Edit
      </Button>

      <Dialog open={showForkConfirm} onOpenChange={setShowForkConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create your own copy</DialogTitle>
            <DialogDescription>
              This is a base catalog resource. Editing it will create your own
              personal copy (fork). The original will remain unchanged.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowForkConfirm(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleForkConfirm}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditor} onOpenChange={setShowEditor}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {isForked ? "Edit resource" : "Edit fork"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content (SKILL.md)</label>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            {hasFiles && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Supporting files</label>
                </div>

                {editFiles.length > 0 && (
                  <div className="space-y-1">
                    {editFiles.map((file, index) => (
                      <div
                        key={file.path}
                        className={`flex items-center gap-2 text-sm rounded px-2 py-1 cursor-pointer ${
                          selectedFileIndex === index
                            ? "bg-accent"
                            : "hover:bg-accent/50"
                        }`}
                        onClick={() =>
                          setSelectedFileIndex(
                            selectedFileIndex === index ? null : index
                          )
                        }
                      >
                        <span className="font-mono text-xs flex-1 truncate">
                          {file.path}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile(index);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedFileIndex !== null && editFiles[selectedFileIndex] && (
                  <div className="space-y-2">
                    <p className="text-xs font-mono text-muted-foreground">
                      {editFiles[selectedFileIndex].path}
                    </p>
                    <Textarea
                      value={editFiles[selectedFileIndex].content}
                      onChange={(e) =>
                        handleFileContentChange(selectedFileIndex, e.target.value)
                      }
                      className="min-h-[150px] font-mono text-sm"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder="path/to/file.md"
                    value={newFilePath}
                    onChange={(e) => setNewFilePath(e.target.value)}
                    className="font-mono text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFile();
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddFile}
                    disabled={!newFilePath.trim()}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditor(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
