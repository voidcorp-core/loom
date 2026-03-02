"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";
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

interface ResourceEditButtonProps {
  resourceId: string;
  isForked: boolean;
  type: "agent" | "skill" | "preset";
  slug: string;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
}

export function ResourceEditButton({
  resourceId,
  isForked,
  type,
  slug,
  title,
  content,
  metadata,
}: ResourceEditButtonProps) {
  const [showForkConfirm, setShowForkConfirm] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);
  const [isPending, startTransition] = useTransition();

  function handleEditClick() {
    setEditTitle(title);
    setEditContent(content);

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
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
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
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
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
