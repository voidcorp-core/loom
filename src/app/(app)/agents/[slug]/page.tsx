import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { getAgentForUser } from "@/services/agent.service";
import { AgentDetail } from "./agent-detail";

export default async function AgentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();

  try {
    const agent = await getAgentForUser(slug, user?.id ?? null);
    return <AgentDetail agent={agent} isAuthenticated={!!user} />;
  } catch {
    notFound();
  }
}
