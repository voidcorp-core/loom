import Link from "next/link";
import { Sparkles, Bot, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Skills</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSkills}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Presets</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPresets}</div>
          </CardContent>
        </Card>
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
