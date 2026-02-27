"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkdownEditor } from "@/components/editor/markdown-editor";
import { FileTree } from "@/components/editor/file-tree";
import { updateSkillAction, deleteSkillAction } from "@/actions/skill.actions";
import type { Skill } from "@/types";

export function SkillDetail({ skill }: { skill: Skill }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(skill.frontmatter.name);
  const [description, setDescription] = useState(skill.frontmatter.description);
  const [allowedTools, setAllowedTools] = useState(
    skill.frontmatter["allowed-tools"] || ""
  );
  const [content, setContent] = useState(skill.content);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSkillAction(skill.slug, {
        frontmatter: {
          name,
          description,
          ...(allowedTools ? { "allowed-tools": allowedTools } : {}),
        },
        content,
      });
      router.refresh();
    } catch (err) {
      alert(`Error: ${err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete skill "${skill.frontmatter.name}"?`)) return;
    await deleteSkillAction(skill.slug);
    router.push("/skills");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{skill.frontmatter.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{skill.slug}</Badge>
          </div>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Frontmatter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Allowed Tools</label>
              <Input
                value={allowedTools}
                onChange={(e) => setAllowedTools(e.target.value)}
                placeholder="Bash(npm run *), Read, Write, Edit"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownEditor value={content} onChange={setContent} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Files</CardTitle>
          </CardHeader>
          <CardContent>
            <FileTree files={skill.files} />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/skills")}>
            Back to Skills
          </Button>
        </div>
      </div>
    </div>
  );
}
