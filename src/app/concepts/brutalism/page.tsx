"use client";

import { useMemo, useState } from "react";
import {motion} from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { ArrowDownRight, ArrowUpRight, Asterisk } from "lucide-react";

import {
  demoProjects,
  demoSeries,
  demoStatusLabels,
  demoStatusOrder,
  demoTasks,
} from "@/components/concepts/demo";
import { ConceptMotionStudy } from "@/components/concepts/motion-study";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SplitHeading } from "@/components/motion/split-heading";
import { ClickSpark } from "@/components/reactbits/click-spark";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/database";

const palette = {
  "--b-ink": "#0b0b0b",
  "--b-paper": "#f5f3ec",
  "--b-acid": "#d8ff00",
  "--b-blue": "#2b4bff",
  "--b-verm": "#ff3b1f",
} as React.CSSProperties;

const filters = ["All work", "High priority", "This week"] as const;

const ease = [0.16, 1, 0.3, 1] as const;

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-[family-name:var(--font-brutal-mono)] text-[10px] font-bold uppercase tracking-[0.22em]">
      {children}
    </span>
  );
}

export default function BrutalismPage() {
  const reduce = useReducedMotion();
  const [statuses, setStatuses] = useState<Record<string, TaskStatus>>(() =>
    Object.fromEntries(demoTasks.map((task) => [task.id, task.status])),
  );
  const [filter, setFilter] = useState<(typeof filters)[number]>("All work");
  const [range, setRange] = useState<7 | 14 | 30>(14);
  const series = demoSeries.slice(-range);

  const tasks = useMemo(
    () =>
      demoTasks
        .map((task) => ({ ...task, status: statuses[task.id] ?? task.status }))
        .filter((task) =>
          filter === "High priority"
            ? task.priority === "high"
            : filter === "This week"
              ? ["Oct 27", "Oct 29", "Oct 30", "Nov 01"].includes(task.due)
              : true,
        ),
    [statuses, filter],
  );

  const done = Object.values(statuses).filter((status) => status === "done").length;

  function advance(id: string) {
    setStatuses((current) => {
      const now = current[id] ?? "todo";
      const next = demoStatusOrder[(demoStatusOrder.indexOf(now) + 1) % demoStatusOrder.length];
      return { ...current, [id]: next };
    });
  }

  const reveal = reduce
    ? {}
    : {
        initial: { y: 28, opacity: 0 },
        whileInView: { y: 0, opacity: 1 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease },
      };

  return (
    <SmoothScroll lerp={0.16}>
    <div
      style={palette}
      className="bg-[var(--b-paper)] font-[family-name:var(--font-brutal-mono)] text-[var(--b-ink)]"
    >
      {/* HERO */}
      <section className="relative overflow-hidden border-b-2 border-[var(--b-ink)]">
        <div className="mx-auto grid w-full max-w-[1500px] gap-0 px-3 pt-8 sm:px-5 lg:grid-cols-[1.25fr_0.75fr] lg:pt-12">
          <div className="relative z-10 border-[var(--b-ink)] pb-10 lg:border-r-2 lg:pr-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="border-2 border-[var(--b-ink)] bg-[var(--b-acid)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em]">
                Monolith © Vol. 01
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] opacity-60">
                Concept A / Chromatic Brutalism
              </span>
            </div>

            <SplitHeading
              label="Plan less. Ship more."
              className="mt-6 font-[family-name:var(--font-brutal-display)] text-[19vw] leading-[0.8] tracking-[-0.045em] sm:text-[13vw] lg:text-[8.6rem]"
            >
              PLAN
              <br />
              <span className="relative inline-block">
                LESS.
                <span className="absolute -right-3 top-1 hidden size-[0.32em] bg-[var(--b-verm)] lg:block" />
              </span>
              <br />
              <span className="inline-block bg-[var(--b-ink)] px-2 text-[var(--b-acid)]">
                SHIP
              </span>{" "}
              MORE.
            </SplitHeading>

            <motion.p
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="mt-7 max-w-xl border-l-4 border-[var(--b-blue)] pl-4 text-sm leading-6 sm:text-base"
            >
              An idea becomes a plan. A plan becomes milestones and tasks. Tasks
              become a board you can actually run. Monolith keeps all four in the
              same building.
            </motion.p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ClickSpark color="var(--b-verm)">
                <a
                  href="/signup"
                  className="group inline-flex items-center gap-2 border-2 border-[var(--b-ink)] bg-[var(--b-acid)] px-5 py-3 text-xs font-bold uppercase tracking-[0.17em] transition-transform hover:translate-x-1 hover:translate-y-1 active:translate-x-2 active:translate-y-2"
                >
                  Start a project
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </ClickSpark>
              <a
                href="/login"
                className="inline-flex items-center gap-2 border-2 border-[var(--b-ink)] bg-transparent px-5 py-3 text-xs font-bold uppercase tracking-[0.17em] transition-colors hover:bg-[var(--b-ink)] hover:text-[var(--b-paper)]"
              >
                Sign in
              </a>
            </div>
          </div>

          <div className="relative flex flex-col justify-between gap-3 py-10 lg:pl-8">
            <div className="flex items-center justify-between">
              <Label>Live command panel</Label>
              <Asterisk className="size-5" aria-hidden="true" />
            </div>

            <motion.div
              initial={reduce ? false : { rotate: -3, y: 30, opacity: 0 }}
              animate={{ rotate: -1.5, y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.15 }}
              className="border-2 border-[var(--b-ink)] bg-white shadow-[8px_8px_0_var(--b-ink)]"
            >
              <div className="flex items-center justify-between border-b-2 border-[var(--b-ink)] bg-[var(--b-blue)] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                <span>Command center</span>
                <span>Week 43</span>
              </div>
              <div className="grid grid-cols-2 divide-x-2 divide-[var(--b-ink)]">
                <div className="p-3">
                  <p className="text-[9px] uppercase tracking-[0.16em] opacity-55">
                    Active projects
                  </p>
                  <p className="font-[family-name:var(--font-brutal-display)] text-4xl leading-none">
                    03
                  </p>
                </div>
                <div className="p-3">
                  <p className="text-[9px] uppercase tracking-[0.16em] opacity-55">
                    Tasks done
                  </p>
                  <p className="font-[family-name:var(--font-brutal-display)] text-4xl leading-none text-[var(--b-verm)]">
                    {String(done).padStart(2, "0")}
                  </p>
                </div>
              </div>
              <div className="flex h-24 items-end gap-1 border-t-2 border-[var(--b-ink)] p-2">
                {demoSeries.slice(-10).map((value, index) => (
                  <motion.span
                    key={index}
                    initial={reduce ? false : { scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.3 + index * 0.03, duration: 0.35, ease }}
                    style={{ height: `${(value / 19) * 100}%` }}
                    className={cn(
                      "flex-1 origin-bottom border border-[var(--b-ink)]",
                      index % 3 === 1
                        ? "bg-[var(--b-blue)]"
                        : index % 4 === 0
                          ? "bg-[var(--b-verm)]"
                          : "bg-[var(--b-acid)]",
                    )}
                  />
                ))}
              </div>
              <div className="border-t-2 border-[var(--b-ink)] px-3 py-2 text-[9px] uppercase tracking-[0.14em] opacity-60">
                Completions / 14 days · illustrative
              </div>
            </motion.div>

            <div className="flex items-center justify-between border-t-2 border-[var(--b-ink)] pt-2 text-[9px] uppercase tracking-[0.14em] opacity-55">
              <span>RLS on</span>
              <span>Atomic plan writes</span>
              <span>Own rows only</span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden border-t-2 border-[var(--b-ink)] bg-[var(--b-acid)] py-2">
          <motion.div
            aria-hidden="true"
            className="flex w-max gap-6 whitespace-nowrap text-xs font-bold uppercase tracking-[0.18em]"
            animate={reduce ? undefined : { x: ["0%", "-50%"] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 2 }).map((_, copy) => (
              <span key={copy} className="flex gap-6">
                {[
                  "Describe",
                  "Review the proposal",
                  "Confirm",
                  "Execute",
                  "Read progress from records",
                  "No silent AI writes",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-6">
                    {item}
                    <Asterisk className="size-3.5" aria-hidden="true" />
                  </span>
                ))}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* TYPE + COLOR SYSTEM */}
      <ConceptMotionStudy variant="brutalism" />

      <section className="border-b-2 border-[var(--b-ink)]">
        <div className="mx-auto grid w-full max-w-[1500px] divide-y-2 divide-[var(--b-ink)] px-3 sm:px-5 lg:grid-cols-[0.9fr_1.1fr] lg:divide-x-2 lg:divide-y-0">
          <div className="py-8 lg:pr-8">
            <Label>Type specimen</Label>
            <p className="mt-3 font-[family-name:var(--font-brutal-display)] text-6xl leading-[0.85] tracking-[-0.04em] sm:text-7xl">
              Aa Bb
              <br />
              0123
            </p>
            <div className="mt-5 space-y-1 text-[11px] uppercase tracking-[0.12em] opacity-70">
              <p>Display — Archivo Black</p>
              <p>Interface + data — Space Mono</p>
              <p>Scale 1.25 · Tracking -0.04em display / +0.16em labels</p>
            </div>
          </div>
          <div className="py-8 lg:pl-8">
            <Label>Signal stack</Label>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                ["Acid", "var(--b-acid)", "Primary action / done"],
                ["Blue", "var(--b-blue)", "Focus / in progress"],
                ["Vermilion", "var(--b-verm)", "Overdue / alert"],
                ["Ink", "var(--b-ink)", "Structure / text"],
              ].map(([name, color, usage]) => (
                <div key={name} className="border-2 border-[var(--b-ink)]">
                  <div className="h-16" style={{ backgroundColor: color }} />
                  <div className="border-t-2 border-[var(--b-ink)] p-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em]">{name}</p>
                    <p className="mt-0.5 text-[9px] uppercase tracking-[0.08em] opacity-55">
                      {usage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 max-w-lg text-[11px] leading-5 opacity-65">
              Two-pixel rules, zero-radius panels, and offset solid shadows replace
              elevation. Accent is functional: acid for action, blue for movement,
              vermilion for risk.
            </p>
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <motion.section {...reveal} className="border-b-2 border-[var(--b-ink)]">
        <div className="mx-auto w-full max-w-[1500px] px-3 py-10 sm:px-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Label>Screen 01 / Command center</Label>
              <h2 className="mt-2 font-[family-name:var(--font-brutal-display)] text-4xl uppercase leading-none tracking-[-0.03em] sm:text-5xl">
                Everything, one wall.
              </h2>
            </div>
            <span className="border-2 border-[var(--b-ink)] px-2 py-1 text-[9px] uppercase tracking-[0.14em]">
              Demo data
            </span>
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="border-2 border-[var(--b-ink)] bg-white">
              <div className="flex items-center justify-between border-b-2 border-[var(--b-ink)] px-3 py-2">
                <Label>Throughput</Label>
                <div role="group" aria-label="Demo range" className="flex border-2 border-[var(--b-ink)] text-[9px] font-bold uppercase">
                  {([7, 14, 30] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setRange(option)}
                      aria-pressed={range === option}
                      className={cn(
                        "px-2 py-1 transition-colors",
                        range === option
                          ? "bg-[var(--b-ink)] text-[var(--b-acid)]"
                          : "hover:bg-[var(--b-acid)]",
                        option !== 7 && "border-l-2 border-[var(--b-ink)]",
                      )}
                    >
                      {option}d
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex h-52 items-end gap-1.5 p-3 sm:gap-2">
                {series.map((value, index) => (
                  <div key={`${range}-${index}`} className="group flex h-full flex-1 flex-col justify-end">
                    <motion.div
                      initial={reduce ? false : { scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.03, duration: 0.4, ease }}
                      style={{ height: `${(value / 19) * 100}%` }}
                      className={cn(
                        "origin-bottom border-2 border-[var(--b-ink)] transition-transform group-hover:-translate-y-1",
                        index === series.length - 1
                          ? "bg-[var(--b-acid)]"
                          : index % 3 === 0
                            ? "bg-[var(--b-blue)]"
                            : "bg-[var(--b-paper)]",
                      )}
                    />
                    <span className="mt-1 hidden text-center text-[8px] tabular-nums sm:block">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              {[
                ["Active", "03", "var(--b-acid)"],
                ["Open tasks", "26", "white"],
                ["Overdue", "02", "var(--b-verm)"],
              ].map(([label, value, bg]) => (
                <div
                  key={label}
                  className="border-2 border-[var(--b-ink)] p-3"
                  style={{ backgroundColor: bg }}
                >
                  <p className="text-[9px] uppercase tracking-[0.16em] opacity-60">{label}</p>
                  <p className="font-[family-name:var(--font-brutal-display)] text-5xl leading-none">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[0.6fr_1.4fr]">
            <div className="border-2 border-[var(--b-ink)] bg-[var(--b-ink)] p-4 text-[var(--b-paper)]">
              <Label>Next milestone</Label>
              <p className="mt-3 text-lg font-bold uppercase leading-tight">
                Guided checklist shipped
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] opacity-55">
                Harbor onboarding · Nov 01
              </p>
              <div className="mt-4 h-2 w-full border border-[var(--b-paper)]">
                <div className="h-full w-[68%] bg-[var(--b-acid)]" />
              </div>
              <p className="mt-2 text-[9px] uppercase tracking-[0.12em] opacity-60">
                68% from stored task state
              </p>
            </div>

            <div className="border-2 border-[var(--b-ink)] bg-white">
              <div className="flex items-center justify-between border-b-2 border-[var(--b-ink)] px-3 py-2">
                <Label>Project ledger</Label>
                <span className="text-[9px] uppercase tracking-[0.12em] opacity-55">
                  4 projects
                </span>
              </div>
              <ul className="divide-y-2 divide-[var(--b-ink)]">
                {demoProjects.map((project) => (
                  <li key={project.id} className="flex items-center gap-3 px-3 py-2.5">
                    <span
                      className="size-2.5 shrink-0 border border-[var(--b-ink)]"
                      style={{
                        backgroundColor:
                          project.status === "completed" ? "var(--b-blue)" : "var(--b-acid)",
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold uppercase tracking-[0.04em]">
                        {project.name}
                      </p>
                      <p className="truncate text-[9px] uppercase tracking-[0.08em] opacity-50">
                        {project.summary}
                      </p>
                    </div>
                    <span className="font-[family-name:var(--font-brutal-display)] text-lg tabular-nums">
                      {project.progress}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* KANBAN */}
      <motion.section {...reveal} className="border-b-2 border-[var(--b-ink)] bg-[var(--b-ink)] text-[var(--b-paper)]">
        <div className="mx-auto w-full max-w-[1500px] px-3 py-10 sm:px-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Label>Screen 02 / Board</Label>
              <h2 className="mt-2 font-[family-name:var(--font-brutal-display)] text-4xl uppercase leading-none tracking-[-0.03em] sm:text-5xl">
                Move work, not pixels.
              </h2>
            </div>
            <p className="max-w-sm text-[10px] uppercase leading-4 tracking-[0.1em] text-[var(--b-paper)]/55">
              Click any card to advance its status. This preview keeps state in the
              browser only.
            </p>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {demoStatusOrder.map((status) => {
              const column = tasks.filter((task) => task.status === status);
              return (
                <section
                  key={status}
                  aria-label={demoStatusLabels[status]}
                  className="border-2 border-[var(--b-paper)] bg-[var(--b-paper)] text-[var(--b-ink)]"
                >
                  <header
                    className={cn(
                      "flex items-center justify-between border-b-2 border-[var(--b-ink)] px-3 py-2",
                      status === "todo"
                        ? "bg-[var(--b-paper)]"
                        : status === "in_progress"
                          ? "bg-[var(--b-blue)] text-white"
                          : "bg-[var(--b-acid)]",
                    )}
                  >
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.16em]">
                      {demoStatusLabels[status]}
                    </h3>
                    <span className="text-[11px] font-bold tabular-nums">
                      {String(column.length).padStart(2, "0")}
                    </span>
                  </header>
                  <div className="flex min-h-48 flex-col gap-2 p-2">
                    {column.map((task) => (
                      <motion.button
                        key={task.id}
                        type="button"
                        layout
                        onClick={() => advance(task.id)}
                        whileTap={reduce ? undefined : { scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 700, damping: 42 }}
                        className="group w-full border-2 border-[var(--b-ink)] bg-white p-2.5 text-left transition-colors hover:bg-[var(--b-acid)] focus-visible:bg-[var(--b-acid)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--b-blue)]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[11px] font-bold uppercase leading-4 tracking-[0.03em]">
                            {task.title}
                          </p>
                          <ArrowDownRight className="size-3.5 shrink-0 opacity-30 transition-opacity group-hover:opacity-100" />
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.1em] opacity-60">
                          <span>{task.project}</span>
                          <span aria-hidden="true">/</span>
                          <span
                            className={cn(
                              "px-1",
                              task.priority === "high"
                                ? "bg-[var(--b-verm)] text-white"
                                : "border border-[var(--b-ink)]",
                            )}
                          >
                            {task.priority}
                          </span>
                          <span className="ml-auto tabular-nums">{task.due}</span>
                        </div>
                      </motion.button>
                    ))}
                    {column.length === 0 ? (
                      <p className="border-2 border-dashed border-[var(--b-ink)]/40 p-3 text-center text-[9px] uppercase tracking-[0.12em] opacity-45">
                        Empty column
                      </p>
                    ) : null}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* INTERACTIVE FILTER */}
      <motion.section {...reveal}>
        <div className="mx-auto grid w-full max-w-[1500px] gap-6 px-3 py-10 sm:px-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Label>Screen 03 / Interaction</Label>
            <h2 className="mt-2 font-[family-name:var(--font-brutal-display)] text-4xl uppercase leading-none tracking-[-0.03em]">
              Filter with a thud.
            </h2>
            <p className="mt-3 max-w-sm text-[11px] leading-5 opacity-65">
              The active filter is a physical block, not a highlight. Cards enter with
              a short clip wipe; nothing bounces for longer than 220ms.
            </p>
            <div className="mt-5 inline-flex border-2 border-[var(--b-ink)]">
              {filters.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  aria-pressed={filter === option}
                  className={cn(
                    "relative px-3 py-2 text-[10px] font-bold uppercase tracking-[0.13em] transition-colors",
                    filter === option ? "text-[var(--b-acid)]" : "hover:bg-[var(--b-acid)]",
                  )}
                >
                  {filter === option ? (
                    <motion.span
                      layoutId="brutal-filter-block"
                      className="absolute inset-0 bg-[var(--b-ink)]"
                      transition={{ type: "spring", stiffness: 620, damping: 40 }}
                    />
                  ) : null}
                  <span className="relative">{option}</span>
                </button>
              ))}
            </div>
          </div>

          <ul className="border-2 border-[var(--b-ink)] bg-white">
            {tasks.slice(0, 6).map((task) => (
              <motion.li
                key={task.id}
                layout
                initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0 0 0)" }}
                transition={{ duration: 0.28, ease }}
                className="flex items-center gap-3 border-b-2 border-[var(--b-ink)] px-3 py-2.5 last:border-b-0"
              >
                <span
                  className={cn(
                    "size-2.5 shrink-0 border border-[var(--b-ink)]",
                    task.status === "done"
                      ? "bg-[var(--b-blue)]"
                      : task.status === "in_progress"
                        ? "bg-[var(--b-acid)]"
                        : "bg-white",
                  )}
                />
                <p className="min-w-0 flex-1 truncate text-[11px] font-bold uppercase tracking-[0.04em]">
                  {task.title}
                </p>
                <span className="text-[9px] uppercase tracking-[0.1em] opacity-55">
                  {task.project}
                </span>
                <span className="w-14 text-right text-[9px] tabular-nums opacity-55">
                  {task.due}
                </span>
              </motion.li>
            ))}
            {tasks.length === 0 ? (
              <li className="p-4 text-[10px] uppercase tracking-[0.12em] opacity-50">
                Nothing matches this filter.
              </li>
            ) : null}
          </ul>
        </div>
      </motion.section>

      <footer className="border-t-2 border-[var(--b-ink)] bg-[var(--b-ink)] px-3 py-6 text-[var(--b-paper)] sm:px-5">
        <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center justify-between gap-3">
          <p className="font-[family-name:var(--font-brutal-display)] text-xl uppercase tracking-[-0.02em]">
            Monolith / Concept A
          </p>
          <p className="text-[9px] uppercase tracking-[0.16em] opacity-45">
            Illustrative preview · no database writes
          </p>
        </div>
      </footer>
    </div>
    </SmoothScroll>
  );
}