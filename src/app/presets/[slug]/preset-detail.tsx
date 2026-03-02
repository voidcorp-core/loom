import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResourceEditButton } from "@/components/library/resource-edit-button";
import { PublishToggle } from "@/components/library/publish-toggle";
import type { Preset } from "@/types";

interface PresetDetailProps {
  preset: Preset;
  isAuthenticated?: boolean;
}

export function PresetDetail({ preset, isAuthenticated }: PresetDetailProps) {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{preset.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{preset.slug}</Badge>
            {preset.isForked && (
              <Badge variant="outline">Your fork</Badge>
            )}
          </div>
        </div>
        {isAuthenticated && preset.resourceId && (
          <div className="flex items-center gap-2">
            {preset.isForked && (
              <PublishToggle
                resourceId={preset.resourceId}
                isPublic={!!preset.isPublic}
              />
            )}
            <ResourceEditButton
              resourceId={preset.resourceId}
              isForked={!!preset.isForked}
              type="preset"
              slug={preset.slug}
              title={preset.name}
              content={preset.rawContent ?? ""}
            />
          </div>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-sm">{preset.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm">{preset.description}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {preset.agents.length > 0 ? (
                preset.agents.map((a) => (
                  <Badge key={a} variant="default">{a}</Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No agents</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {preset.skills.length > 0 ? (
                preset.skills.map((s) => (
                  <Badge key={s} variant="default">{s}</Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No skills</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Constitution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Principles</p>
              {preset.constitution.principles.length > 0 ? (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {preset.constitution.principles.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">None</p>
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Conventions</p>
              {preset.constitution.conventions.length > 0 ? (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {preset.constitution.conventions.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">None</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Project Description</p>
              <p className="text-sm">{preset.context.projectDescription || "None"}</p>
            </div>
          </CardContent>
        </Card>

        <Button variant="outline" asChild>
          <Link href="/presets">Back to Presets</Link>
        </Button>
      </div>
    </div>
  );
}
