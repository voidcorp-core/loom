import { SkillCard } from "@/components/library/skill-card";
import { ResourceCreateButton } from "@/components/library/resource-create-button";
import { getCurrentUser } from "@/lib/current-user";
import { listSkillsForUser } from "@/services/skill.service";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const user = await getCurrentUser();
  const skills = await listSkillsForUser(user?.id ?? null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground mt-1">
            Reusable skill definitions for Claude Code
          </p>
        </div>
        {user && <ResourceCreateButton type="skill" label="Skill" />}
      </div>

      {skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No skills in your library yet</p>
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
