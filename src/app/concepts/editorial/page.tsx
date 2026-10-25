"use client";

import { useMemo, useState } from "react";
import {motion} from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import {
  demoMilestones,
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
  "--e-paper": "#f1ece2",
  "--e-paper-2": "#e8e1d4",
  "--e-ink": "#14110d",
  "--e-ink-2": "#453d32",
  "--e-rule": "#cdc2af",
  "--e-oxblood": "#8a2b22",
  "--e-blue": "#1f35c4",
  "--e-green": "#2f6b4f",
} as React.CSSProperties;

const ease = [0.22, 1, 0.36, 1] as const;

const filters = [
  { id: "all", label: "All work" },
  { id: "open", label: "Open" },
  { id: "high", label: "High priority" },
] as const;

function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "font-[family-name:var(--font-plex)] text-[10px] uppercase tracking-[0.22em] text-[var(--e-ink)]/50",
        className,
      )}
    >
      {children}
    </span>
  );
}

function SectionHead({
  index,
  title,
  note,
}: {
  index: string;
  title: string;
  note: string;
}) {
  return (
    <div className="grid gap-3 border-t-2 border-[var(--e-ink)] pt-3 md:grid-cols-[3rem_1fr_auto] md:items-end">
      <Eyebrow>{index}</Eyebrow>
      <h2 className="font-[family-name:var(--font-editorial-display)] text-4xl leading-none tracking-[-0.015em] sm:text-5xl">
        {title}
      </h2>
      <p className="max-w-xs text-xs leading-5 text-[var(--e-ink)]/55">{note}</p>
    </div>
  );
}

export default function EditorialPage() {
  const reduce = useReducedMotion();
  const [statuses, setStatuses] = useState<Record<string, TaskStatus>>(() =>
    Object.fromEntries(demoTasks.map((task) => [task.id, task.status])),
  );
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [horizon, setHorizon] = useState(2);

  const tasks = useMemo(
    () =>
      demoTasks
        .map((task) => ({ ...task, status: statuses[task.id] ?? task.status }))
        .filter((task) =>
          filter === "open"
            ? task.status !== "done"
            : filter === "high"
              ? task.priority === "high"
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
        initial: { y: 18, opacity: 0 },
        whileInView: { y: 0, opacity: 1 },
        viewport: { once: true, margin: "-70px" },
        transition: { duration: 0.6, ease },
      };

  const horizons = ["This week", "Two weeks", "This month"];
  const windows = [7, 14, 30] as const;
  const windowDays = windows[horizon];
  const windowSeries = demoSeries.slice(-windowDays);

  return (
    <SmoothScroll lerp={0.12}>
    <div style={palette} className="bg-[var(--e-paper)] font-[family-name:var(--font-editorial-sans)] text-[var(--e-ink)]">
      {/* MASTHEAD */}
      <header className="border-b-2 border-[var(--e-ink)] bg-[var(--e-paper)]">
        <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--e-rule)] py-2">
            <Eyebrow>Vol. 04 · Issue 43 · Concept C</Eyebrow>
            <div className="flex items-center gap-4">
              <a
                href="/login"
                className="font-[family-name:var(--font-plex)] text-[10px] uppercase tracking-[0.18em] underline-offset-4 hover:underline"
              >
                Sign in
              </a>
              <a
                href="/signup"
                className="bg-[var(--e-ink)] px-3 py-1.5 font-[family-name:var(--font-plex)] text-[10px] uppercase tracking-[0.16em] text-[var(--e-paper)] transition-colors hover:bg-[var(--e-oxblood)]"
              >
                Start a project
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-2 py-3">
            <a href="/concepts/editorial" className="flex items-baseline gap-2">
              <span className="font-[family-name:var(--font-editorial-display)] text-4xl leading-none tracking-[-0.02em] sm:text-5xl">
                Monolith
              </span>
              <span className="mb-1 hidden h-2 w-2 bg-[var(--e-oxblood)] sm:block" />
            </a>
            <nav aria-label="Concept sections" className="flex flex-wrap gap-x-5 gap-y-1">
              {["Command center", "Projects", "Board", "Planner"].map((item) => (
                <a
                  key={item}
                  href="#preview"
                  className="font-[family-name:var(--font-plex)] text-[10px] uppercase tracking-[0.16em] text-[var(--e-ink)]/60 underline-offset-4 hover:text-[var(--e-ink)] hover:underline"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto w-full max-w-[1440px] px-3 pb-10 pt-8 sm:px-6 lg:pb-14 lg:pt-12">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
          <div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="flex items-center gap-3"
            >
              <span className="bg-[var(--e-oxblood)] px-2 py-1 font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.18em] text-[var(--e-paper)]">
                Project execution
              </span>
              <Eyebrow>Planning, review, and the board</Eyebrow>
            </motion.div>

            <SplitHeading
              label="A control room for work that matters."
              className="mt-5 max-w-3xl text-balance font-[family-name:var(--font-editorial-display)] text-[15vw] leading-[0.84] tracking-[-0.035em] sm:text-[11vw] lg:text-[7.5rem]"
            >
              A control room for{" "}
              <span className="italic text-[var(--e-oxblood)]">work that matters.</span>
            </SplitHeading>

            <div className="mt-7 grid gap-5 border-t border-[var(--e-rule)] pt-5 sm:grid-cols-[1.2fr_0.8fr]">
              <motion.p
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-xl text-sm leading-6 text-[var(--e-ink)]/70 sm:text-base sm:leading-7"
              >
                Monolith takes a sentence, drafts a plan you can edit, writes only
                after you confirm, and then runs the work on a board that reports
                progress from the records themselves.
              </motion.p>
              <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-start gap-3 sm:justify-end"
              >
                <ClickSpark color="var(--e-oxblood)">
                  <a
                    href="/signup"
                    className="group inline-flex items-center gap-2 border border-[var(--e-ink)] bg-[var(--e-ink)] px-4 py-2.5 text-xs font-medium text-[var(--e-paper)] transition-colors hover:bg-[var(--e-oxblood)]"
                  >
                    Start a project
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </ClickSpark>
                <a
                  href="#preview"
                  className="inline-flex items-center gap-2 border border-[var(--e-ink)]/30 px-4 py-2.5 text-xs transition-colors hover:border-[var(--e-ink)]"
                >
                  See the workspace
                  <ArrowRight className="size-4" />
                </a>
              </motion.div>
            </div>
          </div>

          {/* Ledger preview */}
          <motion.aside
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
            aria-label="Illustrative execution ledger"
            className="self-start border border-[var(--e-ink)] bg-[var(--e-paper-2)]"
          >
            <div className="flex items-center justify-between border-b border-[var(--e-ink)] px-3 py-2">
              <Eyebrow className="text-[var(--e-ink)]/70">Execution ledger</Eyebrow>
              <span className="font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.12em]">
                Demo
              </span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-[var(--e-ink)]">
              <div className="p-3">
                <p className="font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.14em] opacity-55">
                  Active
                </p>
                <p className="font-[family-name:var(--font-editorial-display)] text-5xl leading-none">
                  03
                </p>
              </div>
              <div className="p-3">
                <p className="font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.14em] opacity-55">
                  Done this wk
                </p>
                <p className="font-[family-name:var(--font-editorial-display)] text-5xl leading-none text-[var(--e-oxblood)]">
                  {String(done + 9).padStart(2, "0")}
                </p>
              </div>
            </div>
            <div className="border-t border-[var(--e-ink)] px-3 py-3">
              <div className="flex items-end justify-between">
                <Eyebrow>14-day completions</Eyebrow>
                <span className="font-[family-name:var(--font-plex)] text-[9px] tabular-nums">
                  {demoSeries.reduce((sum, value) => sum + value, 0)} total
                </span>
              </div>
              <div className="mt-3 flex h-24 items-end gap-1">
                {demoSeries.map((value, index) => (
                  <motion.span
                    key={index}
                    initial={reduce ? false : { height: 0 }}
                    animate={{ height: `${(value / 19) * 100}%` }}
                    transition={{ duration: 0.5, ease, delay: 0.4 + index * 0.025 }}
                    className={cn(
                      "flex-1",
                      index === demoSeries.length - 1
                        ? "bg-[var(--e-oxblood)]"
                        : "bg-[var(--e-ink)]/25",
                    )}
                  />
                ))}
              </div>
            </div>
            <div className="border-t border-[var(--e-ink)] px-3 py-3">
              <div className="flex items-baseline justify-between">
                <p className="text-xs">Harbor onboarding</p>
                <span className="font-[family-name:var(--font-plex)] text-[10px] tabular-nums">
                  68%
                </span>
              </div>
              <div className="mt-2 h-1 w-full bg-[var(--e-ink)]/15">
                <motion.div
                  initial={reduce ? false : { width: 0 }}
                  animate={{ width: "68%" }}
                  transition={{ duration: 0.9, ease, delay: 0.5 }}
                  className="h-full bg-[var(--e-oxblood)]"
                />
              </div>
              <p className="mt-2 font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.1em] opacity-45">
                Progress derived from task state
              </p>
            </div>
          </motion.aside>
        </div>
      </section>

      {/* TYPE + COLOR */}
      <ConceptMotionStudy variant="editorial" />

      <section className="border-y border-[var(--e-rule)] bg-[var(--e-paper-2)]">
        <div className="mx-auto grid w-full max-w-[1440px] gap-8 px-3 py-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <Eyebrow>Type &amp; color</Eyebrow>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-4">
              <span className="font-[family-name:var(--font-editorial-display)] text-7xl leading-none sm:text-8xl">
                Aa
              </span>
              <span className="font-[family-name:var(--font-editorial-display)] text-3xl italic sm:text-4xl">
                Aa
              </span>
              <span className="text-2xl font-medium">Aa</span>
              <span className="font-[family-name:var(--font-plex)] text-base">Aa 0123</span>
            </div>
            <div className="mt-4 grid gap-1 font-[family-name:var(--font-plex)] text-[10px] uppercase tracking-[0.12em] text-[var(--e-ink)]/55 sm:grid-cols-2">
              <p>Bodoni Moda — display</p>
              <p>Inter Tight — interface</p>
              <p>IBM Plex Mono — metadata</p>
              <p>Hairline rules · 0–2px radii</p>
            </div>
          </div>
          <div>
            <Eyebrow>Signal</Eyebrow>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[
                ["Bone", "var(--e-paper)", "Ground"],
                ["Ink", "var(--e-ink)", "Structure"],
                ["Oxblood", "var(--e-oxblood)", "Accent / active"],
                ["Ultramarine", "var(--e-blue)", "Focus / links"],
                ["Field green", "var(--e-green)", "Done"],
                ["Rule", "var(--e-rule)", "Divisions"],
              ].map(([name, color, usage]) => (
                <div key={name} className="border border-[var(--e-ink)]/20">
                  <div className="h-10" style={{ backgroundColor: color }} />
                  <div className="border-t border-[var(--e-ink)]/20 p-2">
                    <p className="text-[10px] font-medium">{name}</p>
                    <p className="font-[family-name:var(--font-plex)] text-[8px] uppercase tracking-[0.08em] opacity-50">
                      {usage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMMAND CENTER */}
      <motion.section id="preview" {...reveal} className="mx-auto w-full max-w-[1440px] px-3 py-10 sm:px-6 lg:py-14">
        <SectionHead
          index="01"
          title="The desk, not a dashboard."
          note="A lead story, a metric strip, a work table, and a dated margin. Everything is a record, not a decoration."
        />

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.45fr_0.55fr]">
          <div className="border border-[var(--e-ink)] bg-[var(--e-paper)]">
            <div className="grid gap-0 sm:grid-cols-[1fr_auto] sm:divide-x sm:divide-[var(--e-rule)]">
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <Eyebrow>Lead project</Eyebrow>
                  <span className="border border-[var(--e-green)]/40 bg-[var(--e-green)]/10 px-2 py-0.5 font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.12em] text-[var(--e-green)]">
                    On track
                  </span>
                </div>
                <h3 className="mt-3 font-[family-name:var(--font-editorial-display)] text-4xl leading-none tracking-[-0.02em] sm:text-5xl">
                  Harbor onboarding
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-6 text-[var(--e-ink)]/60">
                  Guided setup for first-week activation. Six tasks remain before the
                  Nov 01 milestone; the checklist is the current constraint.
                </p>
                <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-3">
                  {[
                    ["Progress", "68%"],
                    ["Open", "06"],
                    ["Overdue", "01"],
                    ["Tasks", "18"],
                  ].map(([label, value], index) => (
                    <div key={label}>
                      <p className="font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.14em] opacity-50">
                        {label}
                      </p>
                      <p
                        className={cn(
                          "font-[family-name:var(--font-editorial-display)] text-4xl leading-none tabular-nums",
                          index === 2 && "text-[var(--e-oxblood)]",
                        )}
                      >
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--e-rule)] p-5 sm:border-t-0 sm:w-52">
                <Eyebrow>Next milestones</Eyebrow>
                <ol className="mt-3 space-y-3">
                  {demoMilestones.slice(0, 3).map((milestone, index) => (
                    <li key={milestone.name} className="grid grid-cols-[1.5rem_1fr] gap-2">
                      <span className="font-[family-name:var(--font-plex)] text-[9px] leading-5 opacity-40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="border-b border-[var(--e-rule)] pb-2">
                        <p className="text-xs leading-5">{milestone.name}</p>
                        <p className="font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.1em] opacity-45">
                          {milestone.project} · {milestone.due}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="border-t border-[var(--e-ink)]">
              <div className="flex items-center justify-between px-4 py-2">
                <Eyebrow>Project index</Eyebrow>
                <Eyebrow>Progress / state</Eyebrow>
              </div>
              <ul>
                {demoProjects.map((project) => (
                  <li
                    key={project.id}
                    className="grid grid-cols-[1fr_7rem_4rem] items-center gap-3 border-t border-[var(--e-rule)] px-4 py-2.5 transition-colors hover:bg-[var(--e-paper-2)]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm">{project.name}</p>
                      <p className="truncate font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.08em] opacity-40">
                        {project.summary}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1 flex-1 bg-[var(--e-ink)]/15">
                        <div
                          className={cn(
                            "h-full",
                            project.status === "completed"
                              ? "bg-[var(--e-green)]"
                              : "bg-[var(--e-oxblood)]",
                          )}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="w-8 text-right font-[family-name:var(--font-plex)] text-[10px] tabular-nums">
                        {project.progress}%
                      </span>
                    </div>
                    <span className="text-right font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.08em] opacity-55">
                      {project.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="border border-[var(--e-ink)] p-4">
              <div className="flex items-center justify-between">
                <Eyebrow>Throughput</Eyebrow>
                <span className="font-[family-name:var(--font-plex)] text-[9px]">14d</span>
              </div>
              <div className="mt-4 flex h-28 items-end gap-1 border-b border-[var(--e-ink)] pb-px">
                {demoSeries.map((value, index) => (
                  <div key={index} className="flex-1">
                    <div
                      className={cn(
                        "w-full",
                        index === demoSeries.length - 1
                          ? "bg-[var(--e-oxblood)]"
                          : "bg-[var(--e-ink)]/25",
                      )}
                      style={{ height: `${(value / 19) * 100}px` }}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.1em] opacity-45">
                Completions by last update
              </p>
            </div>

            <div className="border border-[var(--e-ink)] p-4">
              <Eyebrow>Margin notes</Eyebrow>
              <ul className="mt-3 space-y-2.5">
                {[
                  ["Overdue", "Reconcile tax tables", "var(--e-oxblood)"],
                  ["Due soon", "Freeze legacy write paths", "var(--e-blue)"],
                  ["Stale", "Review proration rules", "var(--e-ink-2)"],
                ].map(([tag, task, color]) => (
                  <li key={task} className="border-b border-[var(--e-rule)] pb-2 last:border-0">
                    <p
                      className="font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.12em]"
                      style={{ color }}
                    >
                      {tag}
                    </p>
                    <p className="mt-0.5 text-xs leading-4">{task}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[var(--e-ink)] p-4 text-[var(--e-paper)]">
              <Eyebrow className="text-[var(--e-paper)]/50">Next action</Eyebrow>
              <p className="mt-2 font-[family-name:var(--font-editorial-display)] text-2xl leading-tight">
                Finish the activation map, then unblock the checklist.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 border-b border-[var(--e-paper)]/40 pb-0.5 font-[family-name:var(--font-plex)] text-[10px] uppercase tracking-[0.12em]">
                Open project <ArrowRight className="size-3" />
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* BOARD */}
      <motion.section {...reveal} className="border-y border-[var(--e-rule)] bg-[var(--e-paper-2)]">
        <div className="mx-auto w-full max-w-[1440px] px-3 py-10 sm:px-6 lg:py-14">
          <SectionHead
            index="02"
            title="The board as a spread."
            note="Three columns, one rule weight, numbered cards. Click a card to advance its demo status; the footer count updates."
          />

          <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {filters.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFilter(option.id)}
                  aria-pressed={filter === option.id}
                  className={cn(
                    "relative pb-1 font-[family-name:var(--font-plex)] text-[10px] uppercase tracking-[0.14em] transition-colors",
                    filter === option.id
                      ? "text-[var(--e-ink)]"
                      : "text-[var(--e-ink)]/45 hover:text-[var(--e-ink)]",
                  )}
                >
                  {option.label}
                  {filter === option.id ? (
                    <motion.span
                      layoutId="editorial-filter-rule"
                      className="absolute inset-x-0 -bottom-px h-0.5 bg-[var(--e-oxblood)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                </button>
              ))}
            </div>
            <p className="font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.12em] opacity-45">
              {tasks.length} shown · {done}/{demoTasks.length} done in demo
            </p>
          </div>

          <div className="mt-4 grid gap-0 border-y border-[var(--e-ink)] md:grid-cols-3 md:divide-x md:divide-[var(--e-ink)]">
            {demoStatusOrder.map((status, columnIndex) => {
              const column = tasks.filter((task) => task.status === status);
              return (
                <section
                  key={status}
                  aria-label={demoStatusLabels[status]}
                  className={cn(
                    "flex flex-col",
                    columnIndex > 0 && "border-t border-[var(--e-ink)] md:border-t-0",
                  )}
                >
                  <header className="flex items-baseline justify-between border-b border-[var(--e-ink)] px-3 py-2">
                    <h3 className="font-[family-name:var(--font-editorial-display)] text-xl leading-none">
                      {demoStatusLabels[status]}
                    </h3>
                    <span className="font-[family-name:var(--font-plex)] text-[10px] tabular-nums opacity-45">
                      {String(column.length).padStart(2, "0")}
                    </span>
                  </header>
                  <div className="flex min-h-56 flex-1 flex-col gap-0">
                    {column.map((task, index) => (
                      <motion.button
                        key={task.id}
                        type="button"
                        layout
                        onClick={() => advance(task.id)}
                        whileHover={reduce ? undefined : { backgroundColor: "rgba(20,17,13,0.045)" }}
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                        className="group grid w-full grid-cols-[1.6rem_1fr] gap-2 border-b border-[var(--e-rule)] px-3 py-3 text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--e-blue)]"
                      >
                        <span className="pt-0.5 font-[family-name:var(--font-plex)] text-[9px] tabular-nums opacity-35">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <span className="flex items-start justify-between gap-2">
                            <span className="text-xs leading-5">{task.title}</span>
                            <span
                              className={cn(
                                "shrink-0 font-[family-name:var(--font-plex)] text-[8px] uppercase tracking-[0.1em]",
                                task.priority === "high"
                                  ? "text-[var(--e-oxblood)]"
                                  : "opacity-40",
                              )}
                            >
                              {task.priority}
                            </span>
                          </span>
                          <span className="mt-1 flex items-center justify-between font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.08em] opacity-45">
                            <span>{task.project}</span>
                            <span className="tabular-nums">{task.due}</span>
                          </span>
                        </span>
                      </motion.button>
                    ))}
                    {column.length === 0 ? (
                      <p className="px-3 py-6 text-center font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.12em] opacity-35">
                        Nothing here
                      </p>
                    ) : null}
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="font-[family-name:var(--font-plex)] text-[10px] uppercase tracking-[0.12em] opacity-50">
              Demo board · click to advance · keyboard operable
            </p>
            <div className="flex items-center gap-2">
              <div className="h-1 w-40 bg-[var(--e-ink)]/15">
                <motion.div
                  className="h-full bg-[var(--e-green)]"
                  animate={{ width: `${Math.round((done / demoTasks.length) * 100)}%` }}
                  transition={{ type: "spring", stiffness: 260, damping: 32 }}
                />
              </div>
              <span className="font-[family-name:var(--font-plex)] text-[9px] tabular-nums">
                {Math.round((done / demoTasks.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* INTERACTIVE: horizon scrub */}
      <motion.section {...reveal} className="mx-auto w-full max-w-[1440px] px-3 py-10 sm:px-6 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionHead
              index="03"
              title="Time, handled honestly."
              note="The scrubber changes the review horizon only. It never invents completions outside the stored series."
            />
            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-[family-name:var(--font-editorial-display)] text-3xl">
                {horizons[horizon]}
              </p>
              <span className="font-[family-name:var(--font-plex)] text-[10px] tabular-nums opacity-50">
                {windowDays} days
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={2}
              step={1}
              value={horizon}
              onChange={(event) => setHorizon(Number(event.target.value))}
              aria-label="Review horizon"
              className="mt-3 h-1 w-full cursor-pointer appearance-none bg-[var(--e-rule)] accent-[var(--e-oxblood)]"
            />
            <div className="mt-2 flex justify-between font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.1em] opacity-45">
              {horizons.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
            <p className="mt-5 max-w-md text-xs leading-5 text-[var(--e-ink)]/55">
              On the live product this control reads the same task rows the board
              writes. A shortening horizon removes days from view, not records from
              the database.
            </p>
          </div>

          <div className="border border-[var(--e-ink)] bg-[var(--e-paper)]">
            <div className="flex items-center justify-between border-b border-[var(--e-ink)] px-4 py-2">
              <Eyebrow>Completions · {horizons[horizon]}</Eyebrow>
              <span className="font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.1em] opacity-45">
                Illustrative
              </span>
            </div>
            <div className="p-5">
              <motion.p
                key={horizon}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="font-[family-name:var(--font-editorial-display)] text-6xl leading-none tabular-nums"
              >
                {windowSeries.reduce((sum, value) => sum + value, 0)}
                <span className="ml-2 align-middle font-[family-name:var(--font-plex)] text-[10px] uppercase tracking-[0.12em] opacity-45">
                  tasks done
                </span>
              </motion.p>
              <div className="mt-5 flex h-32 items-end gap-1.5 border-b border-[var(--e-ink)]">
                {windowSeries.map((value, index) => (
                    <motion.div
                      key={`${horizon}-${index}`}
                      initial={reduce ? false : { height: 0 }}
                      animate={{ height: `${(value / 19) * 100}%` }}
                      transition={{ duration: 0.4, ease, delay: index * 0.02 }}
                      className={cn(
                        "flex-1",
                        index === 0
                          ? "bg-[var(--e-oxblood)]"
                          : "bg-[var(--e-ink)]/30",
                      )}
                    />
                ))}
              </div>
              <div className="mt-2 flex justify-between font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.1em] opacity-40">
                <span>oldest</span>
                <span>today</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <footer className="border-t-2 border-[var(--e-ink)]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-2 px-3 py-5 sm:px-6">
          <p className="font-[family-name:var(--font-editorial-display)] text-2xl">
            Monolith / Concept C
          </p>
          <p className="font-[family-name:var(--font-plex)] text-[9px] uppercase tracking-[0.14em] opacity-40">
            Illustrative preview · no database writes
          </p>
        </div>
      </footer>
    </div>
    </SmoothScroll>
  );
}