"use server";

import { listSkills, getSkill } from "@/services/skill.service";
import type { SkillSummary, Skill } from "@/types";

export async function listSkillsAction(): Promise<SkillSummary[]> {
  return listSkills();
}

export async function getSkillAction(slug: string): Promise<Skill> {
  return getSkill(slug);
}
