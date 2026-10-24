"use client";

import { CalendarDays, Pencil } from "lucide-react";

import { DeleteTaskButton } from "@/components/tasks/delete-task-button";
import { TaskDialog } from "@/components/tasks/task-dialog";
import {
  OverdueBadge,
  TaskPriorityBadge,
} from "@/components/tasks/task-badges";
import { TaskStatusSelect } from "@/components/tasks/task-status-select";
import { Button } from "@/components/ui/button";
import { formatDate, isOverdue } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/database";

export function TaskItem({ task, projectId }: { task: Task; projectId: string }) {
  const dueDate = formatDate(task.due_date);
  const overdue = isOverdue(task.due_date, task.status);

  return (
    <li key={`${task.id}-${task.status}`} className="flex flex-col gap-3 rounded-lg border border-border/60 bg-card/30 p-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1 space-y-1.5">
        <p
          className={cn(
            "text-sm font-medium",
            task.status === "done" && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </p>
        {task.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {task.description}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <TaskPriorityBadge priority={task.priority} />
          {dueDate ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs",
                overdue ? "text-rose-300" : "text-muted-foreground",
              )}
            >
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {dueDate}
            </span>
          ) : null}
          {overdue ? <OverdueBadge /> : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 self-start">
        <TaskStatusSelect
          taskId={task.id}
          status={task.status}
          taskTitle={task.title}
        />
        <TaskDialog
          projectId={projectId}
          task={task}
          trigger={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Edit ${task.title}`}
              className="size-8 text-muted-foreground"
            >
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          }
        />
        <DeleteTaskButton taskId={task.id} taskTitle={task.title} />
      </div>
    </li>
  );
}
