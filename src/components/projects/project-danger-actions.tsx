"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/client/api";

export function ProjectDangerActions({
  projectId,
  projectName,
  archived,
}: {
  projectId: string;
  projectName: string;
  archived: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function toggleArchive() {
    setPending(true);
    const result = await apiRequest(`/api/projects/${projectId}/archive`, "POST", {
      archived: !archived,
    });
    setPending(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(archived ? "Project restored." : "Project archived.");
    if (archived) {
      router.refresh();
    } else {
      router.push("/app/projects");
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const result = await apiRequest<{ deleted: boolean }>(
      `/api/projects/${projectId}`,
      "DELETE",
    );
    setDeleting(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("Project deleted.");
    router.push("/app/projects");
  }

  return (
    <div className="rounded-lg border border-border/60 bg-card/20 p-5">
      <h2 className="text-sm font-medium">Project controls</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Archiving keeps the project and its tasks. Deleting removes everything
        permanently.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={toggleArchive}
          disabled={pending || deleting}
        >
          {pending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : archived ? (
            <ArchiveRestore className="size-4" aria-hidden="true" />
          ) : (
            <Archive className="size-4" aria-hidden="true" />
          )}
          {archived ? "Restore project" : "Archive project"}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={pending || deleting}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Delete project
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this project?</AlertDialogTitle>
              <AlertDialogDescription>
                &ldquo;{projectName}&rdquo; and every task and milestone inside it
                will be removed permanently. Archive it instead if you may need
                it later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(event) => {
                  event.preventDefault();
                  void handleDelete();
                }}
                disabled={deleting}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                {deleting ? (
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : null}
                Delete permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
