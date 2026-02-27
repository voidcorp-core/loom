"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarkdownEditor } from "@/components/editor/markdown-editor";
import { createAgentAction } from "@/actions/agent.actions";

export default function NewAgentPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("");
  const [color, setColor] = useState("");
  const [tools, setTools] = useState("");
  const [model, setModel] = useState("");
  const [delegatesTo, setDelegatesTo] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createAgentAction({
        slug:
          slug ||
          name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
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
      router.push("/agents");
    } catch (err) {
      alert(`Error: ${err}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Agent</h1>
        <p className="text-muted-foreground mt-1">
          Create a new agent for your library
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Frontmatter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="my-agent (auto-generated if empty)"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Agent"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What this agent does"
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Role *</label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="frontend, backend, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Color</label>
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#3B82F6"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="claude-sonnet-4-6"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tools</label>
              <Input
                value={tools}
                onChange={(e) => setTools(e.target.value)}
                placeholder="Bash, Read, Write, Edit, Glob, Grep"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Delegates To</label>
              <Input
                value={delegatesTo}
                onChange={(e) => setDelegatesTo(e.target.value)}
                placeholder="frontend, backend (comma-separated)"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="Write the agent instructions in markdown..."
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={saving || !name || !description || !role}
          >
            {saving ? "Creating..." : "Create Agent"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
