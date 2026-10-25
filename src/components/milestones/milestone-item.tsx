"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  LoaderCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { animate } from "animejs";
import { toast } from "sonner";

import { MilestoneDialog } from "@/components/milestones/milestone-dialog";
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
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Milestone } from "@/types/database";

export function MilestoneItem({
  milestone,
  projectId,
}: {
  milestone: Milestone;
  projectId: string;
}) {
  const [pending, setPending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const completed = Boolean(milestone.completed_at);
  const targetDate = formatDate(milestone.target_date);
  const rowRef = useRef<HTMLLIElement>(null);
  const wasCompleted = useRef(completed);

  useEffect(() => {
    if (
      completed &&
      !wasCompleted.current &&
      rowRef.current &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      animate(rowRef.current, {
        backgroundColor: ["rgba(255,84,41,0.14)", "rgba(255,84,41,0)"],
        duration: 900,
        ease: "out(3)",
      });
      const dot = rowRef.current.querySelector("[data-milestone-dot]");
      if (dot) {
        animate(dot, {
          scale: [1, 1.35, 1],
          rotate: [0, 12, 0],
          duration: 620,
          ease: "out(3)",
        });
      }
    }
    wasCompleted.current = completed;
  }, [completed]);

  async function toggleCompleted() {
    setPending(true);
    const result = await apiRequest(`/api/milestones/${milestone.id}`, "PATCH", {
      completed: !completed,
    });
    setPending(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(completed ? "Milestone reopened." : "Milestone completed.");
    router.refresh();
  }

  async function handleDelete() {
    setDeleting(true);
    const result = await apiRequest(`/api/milestones/${milestone.id}`, "DELETE");
    setDeleting(false);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("Milestone deleted.");
    router.refresh();
  }

  return (
    <li ref={rowRef} className="flex items-start gap-3 px-4 py-3">
      <button
        type="button"
        data-milestone-dot
        onClick={toggleCompleted}
        disabled={pending || deleting}
        aria-label={
          completed
            ? `Mark ${milestone.title} incomplete`
            : `Mark ${milestone.title} complete`
        }
        className="mt-0.5 shrink-0 rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        {pending ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : completed ? (
          <CheckCircle2 className="size-4 text-chart-3" aria-hidden="true" />
        ) : (
          <Circle className="size-4" aria-hidden="true" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm",
            completed && "text-muted-foreground line-through",
          )}
        >
          {milestone.title}
        </p>
        {milestone.description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {milestone.description}
          </p>
        ) : null}
      </div>

      {targetDate ? (
        <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          {targetDate}
        </span>
      ) : null}

      <div className="flex shrink-0 items-center gap-1">
        <MilestoneDialog
          projectId={projectId}
          milestone={milestone}
          trigger={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Edit ${milestone.title}`}
              className="size-8 text-muted-foreground"
            >
              <Pencil className="size-3.5" aria-hidden="true" />
            </Button>
          }
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Delete ${milestone.title}`}
              className="size-8 text-muted-foreground hover:text-destructive"
              disabled={deleting}
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this milestone?</AlertDialogTitle>
              <AlertDialogDescription>
                &ldquo;{milestone.title}&rdquo; will be removed permanently. The
                rest of the project is unchanged.
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
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                ) : null}
                Delete milestone
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  );
}
