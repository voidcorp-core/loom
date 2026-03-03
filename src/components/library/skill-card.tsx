import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OriginBadge } from "./origin-badge";
import type { SkillSummary } from "@/types";

export function SkillCard({ skill }: { skill: SkillSummary }) {
  return (
    <Link href={`/skills/${skill.slug}`}>
      <Card className="hover:bg-accent/50 transition-colors h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{skill.name}</CardTitle>
            <OriginBadge origin={skill.origin} isPublic={skill.isPublic} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {skill.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
