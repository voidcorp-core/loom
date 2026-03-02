import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileTree } from "@/components/editor/file-tree";
import { ResourceEditButton } from "@/components/library/resource-edit-button";
import { PublishToggle } from "@/components/library/publish-toggle";
import type { Skill } from "@/types";

interface SkillDetailProps {
  skill: Skill;
  isAuthenticated?: boolean;
}

export function SkillDetail({ skill, isAuthenticated }: SkillDetailProps) {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{skill.frontmatter.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{skill.slug}</Badge>
            {skill.isForked && (
              <Badge variant="outline">Your fork</Badge>
            )}
          </div>
        </div>
        {isAuthenticated && skill.resourceId && (
          <div className="flex items-center gap-2">
            {skill.isForked && (
              <PublishToggle
                resourceId={skill.resourceId}
                isPublic={!!skill.isPublic}
              />
            )}
            <ResourceEditButton
              resourceId={skill.resourceId}
              isForked={!!skill.isForked}
              type="skill"
              slug={skill.slug}
              title={skill.frontmatter.name}
              content={skill.rawContent}
            />
          </div>
        )}
      </div>

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
            <FileTree files={skill.files} />
          </CardContent>
        </Card>

        <Button variant="outline" asChild>
          <Link href="/skills">Back to Skills</Link>
        </Button>
      </div>
    </div>
  );
}
