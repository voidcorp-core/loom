"use server";

import {
  listSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/services/skill.service";
import type {
  SkillSummary,
  Skill,
  CreateSkillInput,
  UpdateSkillInput,
} from "@/types";
import { revalidatePath } from "next/cache";

export async function listSkillsAction(): Promise<SkillSummary[]> {
  return listSkills();
}

export async function getSkillAction(slug: string): Promise<Skill> {
  return getSkill(slug);
}

export async function createSkillAction(
  input: CreateSkillInput
): Promise<Skill> {
  const skill = await createSkill(input);
  revalidatePath("/skills");
  return skill;
}

export async function updateSkillAction(
  slug: string,
  input: UpdateSkillInput
): Promise<Skill> {
  const skill = await updateSkill(slug, input);
  revalidatePath(`/skills/${slug}`);
  revalidatePath("/skills");
  return skill;
}

export async function deleteSkillAction(slug: string): Promise<void> {
  await deleteSkill(slug);
  revalidatePath("/skills");
}
