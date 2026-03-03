import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResourceEditButton } from "@/components/library/resource-edit-button";
import { PublishToggle } from "@/components/library/publish-toggle";
import { PublishBanner } from "@/components/library/publish-banner";
import { DeleteResourceButton } from "@/components/library/delete-resource-button";
import { OriginBadge } from "@/components/library/origin-badge";
import type { Preset } from "@/types";

interface PresetDetailProps {
  preset: Preset;
  isAuthenticated?: boolean;
}

export function PresetDetail({ preset, isAuthenticated }: PresetDetailProps) {
  const isOwned = preset.origin && preset.origin !== "bundled";

  return (
    <div className="max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/presets">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Presets
        </Link>
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{preset.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{preset.slug}</Badge>
            <OriginBadge origin={preset.origin} isPublic={preset.isPublic} />
          </div>
        </div>
        {isAuthenticated && preset.resourceId && (
          <div className="flex items-center gap-2">
            {isOwned && (
              <>
                <PublishToggle
                  resourceId={preset.resourceId}
                  isPublic={!!preset.isPublic}
                />
                <DeleteResourceButton
                  resourceId={preset.resourceId}
                  type="preset"
                  slug={preset.slug}
                  title={preset.name}
                  isPublic={!!preset.isPublic}
                />
              </>
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

      {isAuthenticated && isOwned && !preset.isPublic && preset.resourceId && (
        <PublishBanner resourceId={preset.resourceId} />
      )}

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

      </div>
    </div>
  );
}
