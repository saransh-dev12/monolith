"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";

import {
  OverdueBadge,
  TaskPriorityBadge,
} from "@/components/tasks/task-badges";
import { TaskStatusSelect } from "@/components/tasks/task-status-select";
import { TASK_STATUS_LABELS, TASK_STATUS_ORDER } from "@/lib/constants";
import { formatShortDate, isOverdue } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Task } from "@/types/database";

type BoardTask = Task & { projectName: string };

export function Board({ tasks }: { tasks: BoardTask[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TASK_STATUS_ORDER.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status);

        return (
          <section
            key={status}
            aria-labelledby={`column-${status}`}
            className="flex min-h-40 flex-col rounded-lg border border-border/60 bg-card/20"
          >
            <header className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <h2 id={`column-${status}`} className="text-sm font-medium">
                {TASK_STATUS_LABELS[status]}
              </h2>
              <span className="rounded-full border border-border px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                {columnTasks.length}
              </span>
            </header>

            <div className="flex flex-1 flex-col gap-3 p-3">
              {columnTasks.length === 0 ? (
                <p className="rounded-md border border-dashed border-border/60 px-3 py-6 text-center text-xs text-muted-foreground">
                  Nothing here.
                </p>
              ) : (
                columnTasks.map((task) => {
                  const dueDate = formatShortDate(task.due_date);
                  const overdue = isOverdue(task.due_date, task.status);

                  return (
                    <article
                      key={`${task.id}-${task.status}`}
                      className="space-y-3 rounded-md border border-border/60 bg-card/60 p-3"
                    >
                      <div className="space-y-1.5">
                        <Link
                          href={`/app/projects/${task.project_id}`}
                          className="text-[11px] uppercase tracking-wide text-muted-foreground hover:text-foreground"
                        >
                          {task.projectName}
                        </Link>
                        <p
                          className={cn(
                            "text-sm font-medium leading-5",
                            task.status === "done" && "text-muted-foreground line-through",
                          )}
                        >
                          {task.title}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
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

                      <TaskStatusSelect
                        taskId={task.id}
                        status={task.status}
                        taskTitle={task.title}
                      />
                    </article>
                  );
                })
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
