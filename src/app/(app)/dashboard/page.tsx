import Link from "next/link";
import { Sparkles, Bot, Layers, Terminal, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyCommand } from "@/components/ui/copy-command";
import { getLibraryStats } from "@/services/library.service";
import { listSkills } from "@/services/skill.service";
import { listAgents } from "@/services/agent.service";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [stats, skills, agents] = await Promise.all([
    getLibraryStats(),
    listSkills(),
    listAgents(),
  ]);

  const recentSkills = skills.slice(0, 5);
  const recentAgents = agents.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Your agent, skill & preset library for Claude Code
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/skills">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Skills</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSkills}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/agents">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Agents</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAgents}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/presets">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Presets</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPresets}</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="flex items-center gap-4 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/50 px-4 py-4">
        <Terminal className="h-5 w-5 shrink-0 text-muted-foreground" />
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-sm font-medium">Use Loom from your terminal</p>
            <p className="text-xs text-muted-foreground">
              Install the CLI to scaffold agents, skills & presets into any project.{" "}
              <a
                href="https://www.npmjs.com/package/@folpe/loom"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-foreground"
              >
                View on npm
                <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>
          <CopyCommand command="npm install -g @folpe/loom" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent Skills</h2>
          {recentSkills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skills yet</p>
          ) : (
            <div className="space-y-2">
              {recentSkills.map((s) => (
                <Link key={s.slug} href={`/skills/${s.slug}`} className="block">
                  <Card className="p-3 hover:bg-accent transition-colors">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {s.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">Recent Agents</h2>
          {recentAgents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No agents yet</p>
          ) : (
            <div className="space-y-2">
              {recentAgents.map((a) => (
                <Link key={a.slug} href={`/agents/${a.slug}`} className="block">
                  <Card className="p-3 hover:bg-accent transition-colors">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{a.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {a.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
