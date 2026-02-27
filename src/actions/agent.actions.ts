"use server";

import {
  listAgents,
  getAgent,
  createAgent,
  updateAgent,
  deleteAgent,
} from "@/services/agent.service";
import type {
  AgentSummary,
  Agent,
  CreateAgentInput,
  UpdateAgentInput,
} from "@/types";
import { revalidatePath } from "next/cache";

export async function listAgentsAction(): Promise<AgentSummary[]> {
  return listAgents();
}

export async function getAgentAction(slug: string): Promise<Agent> {
  return getAgent(slug);
}

export async function createAgentAction(
  input: CreateAgentInput
): Promise<Agent> {
  const agent = await createAgent(input);
  revalidatePath("/agents");
  return agent;
}

export async function updateAgentAction(
  slug: string,
  input: UpdateAgentInput
): Promise<Agent> {
  const agent = await updateAgent(slug, input);
  revalidatePath(`/agents/${slug}`);
  revalidatePath("/agents");
  return agent;
}

export async function deleteAgentAction(slug: string): Promise<void> {
  await deleteAgent(slug);
  revalidatePath("/agents");
}
