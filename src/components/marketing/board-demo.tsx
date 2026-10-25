"use client";

import { useState } from "react";
import {motion} from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { ArrowDownRight, GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

type Status = "todo" | "in_progress" | "done";

const order: Status[] = ["todo", "in_progress", "done"];
const labels: Record<Status, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

const initial: Array<{ id: string; title: string; project: string; status: Status }> = [
  { id: "a", title: "Map activation moments", project: "Harbor", status: "in_progress" },
  { id: "b", title: "Draft invite sequence", project: "Harbor", status: "todo" },
  { id: "c", title: "Wire empty-state checklist", project: "Harbor", status: "in_progress" },
  { id: "d", title: "Audit export parity", project: "Northwind", status: "todo" },
  { id: "e", title: "Instrument step completion", project: "Harbor", status: "done" },
  { id: "f", title: "Publish token docs", project: "Orbit", status: "done" },
];

export function BoardDemo() {
  const reduce = useReducedMotion();
  const [tasks, setTasks] = useState(initial);

  function advance(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              status: order[(order.indexOf(task.status) + 1) % order.length],
            }
          : task,
      ),
    );
  }

  const done = tasks.filter((task) => task.status === "done").length;

  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-card/60 p-4 shadow-[0_40px_100px_-60px_rgba(0,0,0,0.9)]">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 pb-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          Board preview · illustrative
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
          Click a card to advance · {done}/{tasks.length} done
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-3">
        {order.map((status, index) => {
          const column = tasks.filter((task) => task.status === status);
          return (
            <section
              key={status}
              aria-label={`${labels[status]} demo column`}
              className="rounded-2xl border border-border/60 bg-background/40 p-2"
            >
              <header className="flex items-center justify-between px-1 pb-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      index === 0 ? "bg-foreground/60" : index === 1 ? "bg-primary" : "bg-chart-3",
                    )}
                  />
                  <h3 className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                    {labels[status]}
                  </h3>
                </div>
                <span className="font-mono text-[9px] tabular-nums text-muted-foreground/70">
                  {String(column.length).padStart(2, "0")}
                </span>
              </header>
              <div className="flex min-h-40 flex-col gap-1.5">
                {column.map((task) => (
                  <motion.button
                    key={task.id}
                    type="button"
                    layout
                    onClick={() => advance(task.id)}
                    whileHover={reduce ? undefined : { y: -2 }}
                    whileTap={reduce ? undefined : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="group w-full rounded-xl border border-border/60 bg-card px-2.5 py-2 text-left transition-colors hover:border-chart-2/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span
                        className={cn(
                          "text-[10px] leading-4",
                          status === "done" && "text-muted-foreground line-through",
                        )}
                      >
                        {task.title}
                      </span>
                      <ArrowDownRight className="mt-0.5 size-3 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-foreground" />
                    </span>
                    <span className="mt-1.5 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.08em] text-muted-foreground/60">
                      {task.project}
                      <GripVertical className="size-3 opacity-40" aria-hidden="true" />
                    </span>
                  </motion.button>
                ))}
                {column.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-border/60 px-2 py-4 text-center font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground/50">
                    Empty
                  </p>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/60 px-1 pt-3">
        <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
          Demo state stays in this preview
        </p>
        <div className="flex w-32 items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-chart-3"
              animate={{ width: `${Math.round((done / tasks.length) * 100)}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            />
          </div>
          <span className="font-mono text-[8px] tabular-nums text-chart-3">
            {Math.round((done / tasks.length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
