"use server";

import { listAgents, getAgent } from "@/services/agent.service";
import type { AgentSummary, Agent } from "@/types";

export async function listAgentsAction(): Promise<AgentSummary[]> {
  return listAgents();
}

export async function getAgentAction(slug: string): Promise<Agent> {
  return getAgent(slug);
}
