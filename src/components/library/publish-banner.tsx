"use client";

import { useTransition } from "react";
import { Globe } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { publishResourceAction } from "@/actions/marketplace.actions";

interface PublishBannerProps {
  resourceId: string;
}

export function PublishBanner({ resourceId }: PublishBannerProps) {
  const [isPending, startTransition] = useTransition();

  function handlePublish() {
    startTransition(async () => {
      try {
        await publishResourceAction(resourceId);
        toast.success("Published to marketplace!");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to publish"
        );
      }
    });
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-dashed border-muted-foreground/25 bg-muted/50 px-4 py-3">
      <div className="flex items-center gap-3">
        <Globe className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Share with the community</p>
          <p className="text-xs text-muted-foreground">
            Publish this resource to the marketplace so others can install it.
          </p>
        </div>
      </div>
      <Button
        size="sm"
        onClick={handlePublish}
        disabled={isPending}
      >
        {isPending ? "Publishing..." : "Publish to Marketplace"}
      </Button>
    </div>
  );
}
