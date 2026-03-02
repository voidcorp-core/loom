import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileTree } from "@/components/editor/file-tree";
import { ResourceEditButton } from "@/components/library/resource-edit-button";
import { PublishToggle } from "@/components/library/publish-toggle";
import type { Agent } from "@/types";

interface AgentDetailProps {
  agent: Agent;
  isAuthenticated?: boolean;
}

export function AgentDetail({ agent, isAuthenticated }: AgentDetailProps) {
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
            {agent.isForked && (
              <Badge variant="outline">Your fork</Badge>
            )}
          </div>
        </div>
        {isAuthenticated && agent.resourceId && (
          <div className="flex items-center gap-2">
            {agent.isForked && (
              <PublishToggle
                resourceId={agent.resourceId}
                isPublic={!!agent.isPublic}
              />
            )}
            <ResourceEditButton
              resourceId={agent.resourceId}
              isForked={!!agent.isForked}
              type="agent"
              slug={agent.slug}
              title={agent.frontmatter.name}
              content={agent.rawContent}
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
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-sm">{agent.frontmatter.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="text-sm">{agent.frontmatter.role}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-sm">{agent.frontmatter.description}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {agent.frontmatter.color && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Color</p>
                  <p className="text-sm">{agent.frontmatter.color}</p>
                </div>
              )}
              {agent.frontmatter.model && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Model</p>
                  <p className="text-sm">{agent.frontmatter.model}</p>
                </div>
              )}
              {agent.frontmatter.tools && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Tools</p>
                  <p className="text-sm">{agent.frontmatter.tools}</p>
                </div>
              )}
            </div>
            {agent.frontmatter["delegates-to"] &&
              agent.frontmatter["delegates-to"].length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Delegates To</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.frontmatter["delegates-to"].map((d) => (
                      <Badge key={d} variant="outline">{d}</Badge>
                    ))}
                  </div>
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
              {agent.content || "No content"}
            </pre>
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

        <Button variant="outline" asChild>
          <Link href="/agents">Back to Agents</Link>
        </Button>
      </div>
    </div>
  );
}
