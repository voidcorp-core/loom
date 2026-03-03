"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { deleteResourceAction } from "@/actions/resource.actions";

interface DeleteResourceButtonProps {
  resourceId: string;
  type: "agent" | "skill" | "preset";
  slug: string;
  title: string;
  isPublic: boolean;
}

export function DeleteResourceButton({
  resourceId,
  type,
  slug,
  title,
  isPublic,
}: DeleteResourceButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteResourceAction({ resourceId, type, slug });
        toast.success(`"${title}" deleted`);
        const typePlural =
          type === "agent" ? "agents" : type === "skill" ? "skills" : "presets";
        router.push(`/${typePlural}`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete"
        );
      }
      setOpen(false);
    });
  }

  if (isPublic) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="text-muted-foreground"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Unpublish from the marketplace before deleting</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &ldquo;{title}&rdquo;?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this {type} from your library.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Deleting..." : "Delete permanently"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
