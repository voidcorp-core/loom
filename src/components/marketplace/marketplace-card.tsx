"use client";

import { useTransition } from "react";
import { Download, Bot, Sparkles, Layers, Terminal } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { installResourceAction } from "@/actions/marketplace.actions";
import type { MarketplaceItem } from "@/services/resource.service";

const typeIcons: Record<string, typeof Bot> = {
  agent: Bot,
  skill: Sparkles,
  preset: Layers,
};

interface MarketplaceCardProps {
  item: MarketplaceItem;
  isAuthenticated: boolean;
}

export function MarketplaceCard({ item, isAuthenticated }: MarketplaceCardProps) {
  const [isPending, startTransition] = useTransition();
  const Icon = typeIcons[item.type] ?? Bot;

  function handleCopyCli(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const command = `npx @folpe/loom marketplace install ${item.slug}`;
    navigator.clipboard.writeText(command);
    toast.success("Copied to clipboard");
  }

  function handleInstall(e: React.MouseEvent) {
    e.preventDefault();
    startTransition(async () => {
      try {
        await installResourceAction(item.id);
        toast.success("Installed successfully");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to install"
        );
      }
    });
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base flex-1">{item.title}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {item.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3">
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
          {item.description || "No description"}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={item.authorImage ?? undefined} />
              <AvatarFallback className="text-[10px]">
                {item.authorName?.[0]?.toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {item.authorName ?? "Anonymous"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              <Download className="h-3 w-3 inline mr-1" />
              {item.installCount}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={handleCopyCli}
                  >
                    <Terminal className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy CLI command</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {isAuthenticated && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleInstall}
                disabled={isPending}
              >
                {isPending ? "Installing..." : "Install"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
