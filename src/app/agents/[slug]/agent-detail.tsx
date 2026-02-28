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
import { updateAgentAction, deleteAgentAction } from "@/actions/agent.actions";
import type { Agent } from "@/types";

export function AgentDetail({ agent }: { agent: Agent }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(agent.frontmatter.name);
  const [description, setDescription] = useState(agent.frontmatter.description);
  const [role, setRole] = useState(agent.frontmatter.role);
  const [color, setColor] = useState(agent.frontmatter.color || "");
  const [tools, setTools] = useState(agent.frontmatter.tools || "");
  const [model, setModel] = useState(agent.frontmatter.model || "");
  const [delegatesTo, setDelegatesTo] = useState(
    agent.frontmatter["delegates-to"]?.join(", ") || ""
  );
  const [content, setContent] = useState(agent.content);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAgentAction(agent.slug, {
        frontmatter: {
          name,
          description,
          role,
          ...(color ? { color } : {}),
          ...(tools ? { tools } : {}),
          ...(model ? { model } : {}),
          ...(delegatesTo
            ? { "delegates-to": delegatesTo.split(",").map((s) => s.trim()) }
            : {}),
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
    if (!confirm(`Delete agent "${agent.frontmatter.name}"?`)) return;
    await deleteAgentAction(agent.slug);
    router.push("/agents");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {agent.frontmatter.name}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{agent.slug}</Badge>
            <Badge>{agent.frontmatter.role}</Badge>
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
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tools</label>
                <Input
                  value={tools}
                  onChange={(e) => setTools(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Delegates To</label>
              <Input
                value={delegatesTo}
                onChange={(e) => setDelegatesTo(e.target.value)}
                placeholder="Comma-separated agent slugs"
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
            <FileTree files={agent.files} />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="button" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/agents")}>
            Back to Agents
          </Button>
        </div>
      </div>
    </div>
  );
}
