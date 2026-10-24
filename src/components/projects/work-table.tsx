"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { CalendarDays, Pencil, Plus } from "lucide-react";

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

type Filter = "all" | "open" | "overdue" | "high";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "overdue", label: "Overdue" },
  { value: "high", label: "High priority" },
];

function dueProximity(dueDate: string | null, status: Task["status"]): number | null {
  if (!dueDate || status === "done") return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dueDate}T00:00:00`);
  const diff = Math.round((due.getTime() - today.getTime()) / 86_400_000);
  // 0 (due today or past) → full bar; 30+ days out → near-empty bar.
  return Math.max(4, Math.min(100, ((30 - diff) / 30) * 100));
}

export function WorkTable({
  tasks,
  projectId,
  archived,
}: {
  tasks: Task[];
  projectId: string;
  archived: boolean;
}) {
  const [filter, setFilter] = useState<Filter>("all");

  const stats = useMemo(
    () => ({
      total: tasks.length,
      open: tasks.filter((task) => task.status !== "done").length,
      overdue: tasks.filter((task) =>
        isOverdue(task.due_date, task.status),
      ).length,
      done: tasks.filter((task) => task.status === "done").length,
    }),
    [tasks],
  );

  const visible = tasks.filter((task) => {
    if (filter === "open") return task.status !== "done";
    if (filter === "overdue")
      return isOverdue(task.due_date, task.status);
    if (filter === "high")
      return task.priority === "high" && task.status !== "done";
    return true;
  });

  return (
    <section aria-labelledby="work-table-heading" className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Total tasks", String(stats.total)],
          ["Open", String(stats.open)],
          ["Overdue", String(stats.overdue)],
          ["Done", String(stats.done)],
        ].map(([label, value]) => (
          <div
            key={label}
            className="glass-card rounded-2xl px-4 py-3"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-1 font-heading text-2xl leading-none tabular-nums">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="glass-card overflow-hidden rounded-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-3">
          <h2 id="work-table-heading" className="text-sm font-medium">
            Work items
            <span className="ml-2 font-mono text-[10px] text-muted-foreground">
              {visible.length} of {tasks.length}
            </span>
          </h2>
          <div
            role="group"
            aria-label="Task filter"
            className="inline-flex items-center gap-0.5 rounded-full border border-border/70 bg-muted/50 p-0.5"
          >
            {filters.map((option) => {
              const selected = filter === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                  aria-pressed={selected}
                  className={cn(
                    "relative rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                    selected
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {selected ? (
                    <motion.span
                      layoutId="work-table-filter"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 36,
                      }}
                      className="absolute inset-0 rounded-full bg-card shadow-sm ring-1 ring-border/60"
                      aria-hidden="true"
                    />
                  ) : null}
                  <span className="relative">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="hidden grid-cols-[1fr_8rem_10rem_9rem_7rem] gap-3 border-b border-border/60 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground lg:grid">
          <span>Task</span>
          <span>Priority</span>
          <span>Due proximity</span>
          <span>Status</span>
          <span className="text-right">Edit</span>
        </div>

        {visible.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Nothing matches this filter.
            </p>
            {!archived ? (
              <TaskDialog
                projectId={projectId}
                trigger={
                  <Button variant="outline" size="sm" className="mt-4">
                    <Plus className="size-4" aria-hidden="true" />
                    Add task
                  </Button>
                }
              />
            ) : null}
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {visible.map((task) => {
              const due = formatDate(task.due_date);
              const overdue = isOverdue(task.due_date, task.status);
              const proximity = dueProximity(task.due_date, task.status);
              return (
                <li
                  key={task.id}
                  className="grid gap-3 px-4 py-3 transition-colors hover:bg-muted/20 lg:grid-cols-[1fr_8rem_10rem_9rem_7rem] lg:items-center"
                >
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "truncate text-sm font-medium",
                        task.status === "done" &&
                          "text-muted-foreground line-through",
                      )}
                    >
                      {task.title}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <CalendarDays className="size-3" aria-hidden="true" />
                      {due ?? "No date"}
                      {overdue ? (
                        <span className="ml-1">
                          <OverdueBadge />
                        </span>
                      ) : null}
                    </p>
                  </div>
                  <div>
                    <TaskPriorityBadge priority={task.priority} />
                  </div>
                  <div
                    className="flex items-center gap-2"
                    title={
                      proximity === null
                        ? "No due pressure"
                        : "How close the due date is"
                    }
                  >
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <motion.span
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${proximity ?? 0}%`,
                        }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className={cn(
                          "block h-full rounded-full",
                          overdue
                            ? "bg-rose-400"
                            : "bg-[var(--chart-1)]",
                        )}
                      />
                    </span>
                  </div>
                  <div>
                    <TaskStatusSelect
                      taskId={task.id}
                      status={task.status}
                      taskTitle={task.title}
                    />
                  </div>
                  <div className="flex items-center gap-1 lg:justify-end">
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
                    <DeleteTaskButton
                      taskId={task.id}
                      taskTitle={task.title}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
