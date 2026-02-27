"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  updatePresetAction,
  deletePresetAction,
} from "@/actions/preset.actions";
import { listSkillsAction } from "@/actions/skill.actions";
import { listAgentsAction } from "@/actions/agent.actions";
import type { Preset, SkillSummary, AgentSummary } from "@/types";

export function PresetDetail({ preset }: { preset: Preset }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<SkillSummary[]>([]);
  const [availableAgents, setAvailableAgents] = useState<AgentSummary[]>([]);

  const [name, setName] = useState(preset.name);
  const [description, setDescription] = useState(preset.description);
  const [repo, setRepo] = useState(preset.boilerplate.repo);
  const [branch, setBranch] = useState(preset.boilerplate.branch || "");
  const [selectedAgents, setSelectedAgents] = useState<string[]>(preset.agents);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(preset.skills);
  const [principles, setPrinciples] = useState(
    preset.constitution.principles.join("\n")
  );
  const [stack, setStack] = useState(preset.constitution.stack.join("\n"));
  const [conventions, setConventions] = useState(
    preset.constitution.conventions.join("\n")
  );
  const [projectDescription, setProjectDescription] = useState(
    preset.claudemd.projectDescription
  );
  const [orchestratorRef, setOrchestratorRef] = useState(
    preset.claudemd.orchestratorRef
  );

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

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePresetAction(preset.slug, {
        name,
        description,
        boilerplate: {
          repo,
          ...(branch ? { branch } : {}),
          shallow: true,
        },
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
        claudemd: { projectDescription, orchestratorRef },
      });
      router.refresh();
    } catch (err) {
      alert(`Error: ${err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete preset "${preset.name}"?`)) return;
    await deletePresetAction(preset.slug);
    router.push("/presets");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{preset.name}</h1>
          <Badge variant="secondary" className="mt-1">
            {preset.slug}
          </Badge>
        </div>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Boilerplate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Git Repository</label>
              <Input value={repo} onChange={(e) => setRepo(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Branch</label>
              <Input
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agents</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Constitution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Principles</label>
              <Textarea
                value={principles}
                onChange={(e) => setPrinciples(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stack</label>
              <Textarea
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Conventions</label>
              <Textarea
                value={conventions}
                onChange={(e) => setConventions(e.target.value)}
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
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Orchestrator Reference
              </label>
              <Input
                value={orchestratorRef}
                onChange={(e) => setOrchestratorRef(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/presets")}>
            Back to Presets
          </Button>
        </div>
      </div>
    </div>
  );
}
