import Link from "next/link";
import { Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AgentSummary } from "@/types";

export function AgentCard({ agent }: { agent: AgentSummary }) {
  return (
    <Link href={`/agents/${agent.slug}`}>
      <Card className="hover:bg-accent/50 transition-colors h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{agent.name}</CardTitle>
            <Badge variant="secondary" className="ml-auto text-xs">
              {agent.role}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {agent.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
