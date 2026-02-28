"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createPresetAction } from "@/actions/preset.actions";
import { listSkillsAction } from "@/actions/skill.actions";
import { listAgentsAction } from "@/actions/agent.actions";
import { toast } from "sonner";
import type { SkillSummary, AgentSummary } from "@/types";

export default function NewPresetPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<SkillSummary[]>([]);
  const [availableAgents, setAvailableAgents] = useState<AgentSummary[]>([]);

  // Form state
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [principles, setPrinciples] = useState("");
  const [stack, setStack] = useState("");
  const [conventions, setConventions] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [orchestratorRef, setOrchestratorRef] = useState("");

  useEffect(() => {
    listSkillsAction().then(setAvailableSkills);
    listAgentsAction().then(setAvailableAgents);
  }, []);

  const toggleAgent = (slug: string) =>
    setSelectedAgents((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );

  const toggleSkill = (slug: string) =>
    setSelectedSkills((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createPresetAction({
        slug:
          slug ||
          name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        name,
        description,
        agents: selectedAgents,
        skills: selectedSkills,
        constitution: {
          principles: principles
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          stack: stack
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          conventions: conventions
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
        },
        claudemd: {
          projectDescription,
          orchestratorRef:
            orchestratorRef ||
            "Use the orchestrator agent as the main coordinator.",
        },
      });
      toast.success("Preset created");
      router.push("/presets");
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Preset</h1>
        <p className="text-muted-foreground mt-1">
          Create a project scaffolding preset
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="saas-default (auto-generated)"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="SaaS Default"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What this preset scaffolds"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agents</CardTitle>
          </CardHeader>
          <CardContent>
            {availableAgents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No agents available. Create some first.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableAgents.map((a) => (
                  <Badge
                    key={a.slug}
                    variant={
                      selectedAgents.includes(a.slug) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleAgent(a.slug)}
                  >
                    {a.name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {availableSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No skills available. Create some first.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableSkills.map((s) => (
                  <Badge
                    key={s.slug}
                    variant={
                      selectedSkills.includes(s.slug) ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleSkill(s.slug)}
                  >
                    {s.name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Constitution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Principles (one per line)
              </label>
              <Textarea
                value={principles}
                onChange={(e) => setPrinciples(e.target.value)}
                placeholder="Ship fast, iterate often&#10;User-first design"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Stack (one per line)
              </label>
              <Textarea
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                placeholder="Next.js 15&#10;Tailwind CSS&#10;Supabase"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Conventions (one per line)
              </label>
              <Textarea
                value={conventions}
                onChange={(e) => setConventions(e.target.value)}
                placeholder="Use TypeScript strict mode&#10;Prefer server components"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CLAUDE.md</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Project Description
              </label>
              <Textarea
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Description to include in the generated CLAUDE.md"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Orchestrator Reference
              </label>
              <Input
                value={orchestratorRef}
                onChange={(e) => setOrchestratorRef(e.target.value)}
                placeholder="Use the orchestrator agent..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving || !name || !description}>
            {saving ? "Creating..." : "Create Preset"}
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
