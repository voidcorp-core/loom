"use client";

import { useTransition } from "react";
import { Globe, GlobeLock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  publishResourceAction,
  unpublishResourceAction,
} from "@/actions/marketplace.actions";

interface PublishToggleProps {
  resourceId: string;
  isPublic: boolean;
}

export function PublishToggle({ resourceId, isPublic }: PublishToggleProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      try {
        if (isPublic) {
          await unpublishResourceAction(resourceId);
          toast.success("Resource unpublished");
        } else {
          await publishResourceAction(resourceId);
          toast.success("Resource published to marketplace");
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update"
        );
      }
    });
  }

  return (
    <Button
      variant={isPublic ? "secondary" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPublic ? (
        <>
          <GlobeLock className="h-4 w-4 mr-2" />
          {isPending ? "Unpublishing..." : "Unpublish"}
        </>
      ) : (
        <>
          <Globe className="h-4 w-4 mr-2" />
          {isPending ? "Publishing..." : "Publish"}
        </>
      )}
    </Button>
  );
}
