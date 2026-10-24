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
  in_progress: "border-chart-2/40 bg-chart-2/12 text-chart-2",
  done: "border-chart-3/40 bg-chart-3/12 text-chart-3",
};

const priorityStyles: Record<TaskPriority, string> = {
  low: "border-border bg-transparent text-muted-foreground",
  medium: "border-chart-2/35 bg-chart-2/10 text-chart-2",
  high: "border-primary/40 bg-primary/12 text-primary",
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
          ? "border-chart-3/40 bg-chart-3/12 text-chart-3"
          : "border-primary/35 bg-primary/10 text-primary",
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
      className="rounded-full border-primary/40 bg-primary/10 font-normal text-primary"
    >
      Overdue
    </Badge>
  );
}
