import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillFileBrowser } from "@/components/editor/skill-file-browser";
import { ResourceEditButton } from "@/components/library/resource-edit-button";
import { PublishToggle } from "@/components/library/publish-toggle";
import { PublishBanner } from "@/components/library/publish-banner";
import { DeleteResourceButton } from "@/components/library/delete-resource-button";
import { OriginBadge } from "@/components/library/origin-badge";
import { CopyCommand } from "@/components/ui/copy-command";
import type { Skill } from "@/types";

interface SkillDetailProps {
  skill: Skill;
  isAuthenticated?: boolean;
}

export function SkillDetail({ skill, isAuthenticated }: SkillDetailProps) {
  const isOwned = skill.origin && skill.origin !== "bundled";

  return (
    <div className="max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/skills">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Skills
        </Link>
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{skill.frontmatter.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{skill.slug}</Badge>
            <OriginBadge origin={skill.origin} isPublic={skill.isPublic} />
          </div>
        </div>
        {isAuthenticated && skill.resourceId && (
          <div className="flex items-center gap-2">
            {isOwned && (
              <>
                <PublishToggle
                  resourceId={skill.resourceId}
                  isPublic={!!skill.isPublic}
                />
                <DeleteResourceButton
                  resourceId={skill.resourceId}
                  type="skill"
                  slug={skill.slug}
                  title={skill.frontmatter.name}
                  isPublic={!!skill.isPublic}
                />
              </>
            )}
            <ResourceEditButton
              resourceId={skill.resourceId}
              isForked={!!skill.isForked}
              type="skill"
              slug={skill.slug}
              title={skill.frontmatter.name}
              content={skill.rawContent}
              files={skill.supportingFiles}
            />
          </div>
        )}
      </div>

      <CopyCommand
        command={
          !isOwned || isAuthenticated
            ? `npx @folpe/loom add skill ${skill.slug}`
            : `npx @folpe/loom marketplace install ${skill.slug}`
        }
      />

      {isAuthenticated && isOwned && !skill.isPublic && skill.resourceId && (
        <PublishBanner resourceId={skill.resourceId} />
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Frontmatter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-sm">{skill.frontmatter.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm">{skill.frontmatter.description}</p>
            </div>
            {skill.frontmatter["allowed-tools"] && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Allowed Tools</p>
                <p className="text-sm">{skill.frontmatter["allowed-tools"]}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm font-mono rounded-md border p-4 bg-muted/50">
              {skill.content || "No content"}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Files</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillFileBrowser files={skill.files} supportingFiles={skill.supportingFiles} />
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
