import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { getSkillForUser } from "@/services/skill.service";
import { SkillDetail } from "./skill-detail";

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();

  try {
    const skill = await getSkillForUser(slug, user?.id ?? null);
    return <SkillDetail skill={skill} isAuthenticated={!!user} />;
  } catch {
    notFound();
  }
}
