"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createResourceAction } from "@/actions/resource.actions";

interface ResourceCreateButtonProps {
  type: "agent" | "skill" | "preset";
  label: string;
}

const TEMPLATES: Record<string, string> = {
  agent: `---
name:
description:
role: general
model: inherit
---

# Instructions

`,
  skill: `---
name:
description:
---

# Conventions

`,
  preset: `name:
description:
agents: []
skills: []
constitution:
  principles: []
  conventions: []
context:
  projectDescription: ""
`,
};

export function ResourceCreateButton({
  type,
  label,
}: ResourceCreateButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(TEMPLATES[type] ?? "");
  const [isPending, startTransition] = useTransition();

  function handleOpen() {
    setTitle("");
    setContent(TEMPLATES[type] ?? "");
    setOpen(true);
  }

  function handleCreate() {
    startTransition(async () => {
      try {
        const result = await createResourceAction({
          type,
          title,
          content,
        });
        setOpen(false);
        toast.success(`${label} created`);
        const typePlural =
          type === "agent"
            ? "agents"
            : type === "skill"
              ? "skills"
              : "presets";
        router.push(`/${typePlural}/${result.slug}`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to create"
        );
      }
    });
  }

  return (
    <>
      <Button size="sm" onClick={handleOpen}>
        <Plus className="h-4 w-4 mr-2" />
        New {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create new {label.toLowerCase()}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`My custom ${label.toLowerCase()}`}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isPending || !title.trim() || !content.trim()}
            >
              {isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
