import { notFound } from "next/navigation";
import { getSkill } from "@/services/skill.service";
import { SkillDetail } from "./skill-detail";

export default async function SkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const skill = await getSkill(slug);
    return <SkillDetail skill={skill} />;
  } catch {
    notFound();
  }
}
