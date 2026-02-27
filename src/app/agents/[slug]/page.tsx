import { notFound } from "next/navigation";
import { getAgent } from "@/services/agent.service";
import { AgentDetail } from "./agent-detail";

export default async function AgentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const agent = await getAgent(slug);
    return <AgentDetail agent={agent} />;
  } catch {
    notFound();
  }
}
