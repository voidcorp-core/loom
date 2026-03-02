import Link from "next/link";
import { Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PresetSummary } from "@/types";

export function PresetCard({ preset }: { preset: PresetSummary }) {
  return (
    <Link href={`/presets/${preset.slug}`}>
      <Card className="hover:bg-accent/50 transition-colors h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">{preset.name}</CardTitle>
            {preset.isForked && (
              <Badge variant="outline" className="text-xs">Forked</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {preset.description}
          </p>
          <div className="flex gap-2">
            <Badge variant="outline">{preset.agentCount} agents</Badge>
            <Badge variant="outline">{preset.skillCount} skills</Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
