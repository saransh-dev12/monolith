import { Badge } from "@/components/ui/badge";
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  PROJECT_STATUS_LABELS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { ProjectStatus, TaskPriority, TaskStatus } from "@/types/database";

const statusStyles: Record<TaskStatus, string> = {
  todo: "border-border bg-muted/40 text-muted-foreground",
  in_progress: "border-amber-600/30 bg-amber-500/10 text-amber-300",
  done: "border-emerald-600/30 bg-emerald-500/10 text-emerald-300",
};

const priorityStyles: Record<TaskPriority, string> = {
  low: "border-border bg-transparent text-muted-foreground",
  medium: "border-sky-600/30 bg-sky-500/10 text-sky-300",
  high: "border-rose-600/30 bg-rose-500/10 text-rose-300",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full font-normal", statusStyles[status])}
    >
      {TASK_STATUS_LABELS[status]}
    </Badge>
  );
}

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full font-normal", priorityStyles[priority])}
    >
      {TASK_PRIORITY_LABELS[priority]}
    </Badge>
  );
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full font-normal",
        status === "completed"
          ? "border-emerald-600/30 bg-emerald-500/10 text-emerald-300"
          : "border-primary/30 bg-primary/10 text-primary",
      )}
    >
      {PROJECT_STATUS_LABELS[status]}
    </Badge>
  );
}

export function OverdueBadge() {
  return (
    <Badge
      variant="outline"
      className="rounded-full border-rose-600/30 bg-rose-500/10 font-normal text-rose-300"
    >
      Overdue
    </Badge>
  );
}
