import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillCard } from "@/components/library/skill-card";
import { listSkills } from "@/services/skill.service";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const skills = await listSkills();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground mt-1">
            Reusable skill definitions for Claude Code
          </p>
        </div>
        <Button asChild>
          <Link href="/skills/new">
            <Plus className="mr-2 h-4 w-4" />
            New Skill
          </Link>
        </Button>
      </div>

      {skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground mb-4">No skills in your library yet</p>
          <Button asChild>
            <Link href="/skills/new">Create your first skill</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
}
