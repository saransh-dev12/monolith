"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight, CircleDashed, Layers, Sparkles } from "lucide-react";

import {
  demoProjects,
  demoStatusLabels,
  demoStatusOrder,
  demoTasks,
  demoWeek,
} from "@/components/concepts/demo";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/database";

const palette = {
  "--t-void": "#08060f",
  "--t-panel": "#120c24",
  "--t-panel-2": "#171034",
  "--t-line": "rgba(243,238,255,0.12)",
  "--t-text": "#f3eeff",
  "--t-coral": "#ff7a59",
  "--t-lilac": "#b49cff",
  "--t-mint": "#6ff2c4",
} as React.CSSProperties;

const spring = { type: "spring", stiffness: 120, damping: 20 } as const;

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "font-[family-name:var(--font-atelier-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--t-text)]/45",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Ring({ value }: { value: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative grid size-24 place-items-center">
      <svg viewBox="0 0 80 80" className="size-24 -rotate-90" aria-hidden="true">
        <circle cx="40" cy="40" r={radius} fill="none" stroke="rgba(243,238,255,0.1)" strokeWidth="6" />
        <motion.circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="var(--t-coral)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference * (1 - value / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <span className="absolute font-[family-name:var(--font-atelier-mono)] text-sm tabular-nums">
        {value}%
      </span>
    </div>
  );
}

export default function AtelierPage() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-7, 7]), spring);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [6, -6]), spring);

  const [mode, setMode] = useState<"plan" | "execute">("plan");
  const [statuses, setStatuses] = useState<Record<string, TaskStatus>>(() =>
    Object.fromEntries(demoTasks.map((task) => [task.id, task.status])),
  );
  const [stage, setStage] = useState(1);

  function advance(id: string) {
    setStatuses((current) => {
      const now = current[id] ?? "todo";
      const next = demoStatusOrder[(demoStatusOrder.indexOf(now) + 1) % demoStatusOrder.length];
      return { ...current, [id]: next };
    });
  }

  function handlePointer(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  const done = Object.values(statuses).filter((status) => status === "done").length;
  const progress = Math.round((done / demoTasks.length) * 100);

  return (
    <div
      style={palette}
      className="bg-[var(--t-void)] font-[family-name:var(--font-atelier-sans)] text-[var(--t-text)]"
    >
      {/* HERO */}
      <section
        ref={heroRef}
        onPointerMove={handlePointer}
        onPointerLeave={() => {
          pointerX.set(0);
          pointerY.set(0);
        }}
        className="relative overflow-hidden px-3 pb-10 pt-12 sm:px-5 lg:pb-16 lg:pt-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-0 size-[28rem] rounded-full bg-[var(--t-lilac)]/20 blur-[110px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-40 size-[26rem] rounded-full bg-[var(--t-coral)]/20 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/3 size-[22rem] rounded-full bg-[var(--t-mint)]/10 blur-[110px]"
        />

        <div className="mx-auto grid w-full max-w-[1400px] gap-12 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div className="relative z-10">
            <motion.div
              initial={reduce ? false : { y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...spring, delay: 0.05 }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--t-line)] bg-white/[0.04] px-3 py-1.5"
            >
              <Sparkles className="size-3.5 text-[var(--t-mint)]" aria-hidden="true" />
              <span className="font-[family-name:var(--font-atelier-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--t-text)]/60">
                Concept B / Kinetic digital atelier
              </span>
            </motion.div>

            <motion.h1
              initial={reduce ? false : { y: 40, opacity: 0, filter: "blur(8px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="mt-7 font-[family-name:var(--font-atelier-display)] text-[18vw] leading-[0.82] tracking-[-0.02em] sm:text-[13vw] lg:text-[7.4rem]"
            >
              Ideas,
              <br />
              <span className="italic text-[var(--t-lilac)]">given form.</span>
            </motion.h1>

            <motion.p
              initial={reduce ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...spring, delay: 0.28 }}
              className="mt-6 max-w-lg text-sm leading-6 text-[var(--t-text)]/60 sm:text-base"
            >
              Monolith is a studio for the whole arc: a sentence becomes a reviewed
              plan, the plan becomes milestones and tasks, and the board becomes the
              place work actually moves.
            </motion.p>

            <motion.div
              initial={reduce ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...spring, delay: 0.38 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <a
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--t-coral)] px-5 py-3 text-xs font-semibold tracking-[0.02em] text-[#1a0d09] transition-transform hover:-translate-y-0.5"
              >
                Start a project
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--t-line)] px-5 py-3 text-xs font-medium text-[var(--t-text)]/80 transition-colors hover:border-[var(--t-lilac)]/60 hover:text-[var(--t-text)]"
              >
                Sign in
              </a>
            </motion.div>

            <div className="mt-10 flex items-center gap-5 font-[family-name:var(--font-atelier-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--t-text)]/35">
              <span className="flex items-center gap-2">
                <CircleDashed className="size-3" aria-hidden="true" /> RLS scoped
              </span>
              <span className="flex items-center gap-2">
                <Layers className="size-3" aria-hidden="true" /> Atomic saves
              </span>
            </div>
          </div>

          {/* Layered hero panel */}
          <div className="relative z-10 [perspective:1400px]">
            <motion.div
              style={
                reduce
                  ? undefined
                  : { rotateX, rotateY, transformStyle: "preserve-3d" }
              }
              initial={reduce ? false : { y: 50, opacity: 0, rotate: 2 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ ...spring, delay: 0.2 }}
              className="relative rounded-[28px] border border-[var(--t-line)] bg-[var(--t-panel)]/80 p-4 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between px-1 pb-3">
                <Label>Command center</Label>
                <span className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[var(--t-mint)]" />
                  <span className="font-[family-name:var(--font-atelier-mono)] text-[9px] uppercase tracking-[0.14em] text-[var(--t-text)]/40">
                    live data
                  </span>
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--t-line)] bg-[var(--t-panel-2)]/70 p-4">
                  <Label>This week</Label>
                  <div className="mt-4 flex h-28 items-end gap-1.5">
                    {demoWeek.map((day, index) => (
                      <div key={day.day + index} className="flex flex-1 flex-col items-center gap-2">
                        <motion.div
                          initial={reduce ? false : { height: 0 }}
                          animate={{ height: Math.max(5, (day.value / 6) * 88) }}
                          transition={{ ...spring, delay: 0.5 + index * 0.06 }}
                          className={cn(
                            "w-full rounded-full",
                            index === 3
                              ? "bg-[var(--t-coral)]"
                              : "bg-[var(--t-lilac)]/35",
                          )}
                        />
                        <span className="font-[family-name:var(--font-atelier-mono)] text-[9px] text-[var(--t-text)]/35">
                          {day.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-2xl border border-[var(--t-line)] bg-gradient-to-br from-[var(--t-panel-2)] to-[var(--t-panel)] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Label>Harbor onboarding</Label>
                      <p className="mt-2 text-sm leading-5 text-[var(--t-text)]/75">
                        6 open · next milestone Nov 01
                      </p>
                    </div>
                    <Ring value={68} />
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-[var(--t-line)] pt-3">
                    <span className="font-[family-name:var(--font-atelier-mono)] text-[9px] uppercase tracking-[0.12em] text-[var(--t-text)]/40">
                      Derived from tasks
                    </span>
                    <span className="text-[10px] text-[var(--t-mint)]">On track</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-[var(--t-line)] bg-white/[0.03] p-4">
                <div className="flex items-center justify-between">
                  <Label>Plan proposal</Label>
                  <span className="rounded-full border border-[var(--t-coral)]/40 bg-[var(--t-coral)]/10 px-2 py-0.5 font-[family-name:var(--font-atelier-mono)] text-[9px] uppercase tracking-[0.1em] text-[var(--t-coral)]">
                    awaiting review
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {["Activation map approved", "Guided checklist shipped", "Invite sequence live"].map(
                    (item, index) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "grid size-4 place-items-center rounded-full border text-[8px]",
                            index === 0
                              ? "border-[var(--t-mint)]/50 bg-[var(--t-mint)]/15 text-[var(--t-mint)]"
                              : "border-[var(--t-line)] text-[var(--t-text)]/30",
                          )}
                        >
                          {index === 0 ? "✓" : index + 1}
                        </span>
                        <span className="text-xs text-[var(--t-text)]/65">{item}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              aria-hidden="true"
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...spring, delay: 0.7 }}
              className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-[var(--t-mint)]/30 bg-[var(--t-panel)] px-3 py-2 shadow-xl sm:block"
            >
              <p className="font-[family-name:var(--font-atelier-mono)] text-[9px] uppercase tracking-[0.12em] text-[var(--t-text)]/45">
                Confirmed plan
              </p>
              <p className="mt-0.5 text-xs text-[var(--t-mint)]">14 tasks written atomically</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SYSTEM */}
      <section className="border-y border-[var(--t-line)] bg-[var(--t-panel)]/40 px-3 py-10 sm:px-5">
        <div className="mx-auto grid w-full max-w-[1400px] gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Label>Type &amp; surface</Label>
            <p className="mt-3 font-[family-name:var(--font-atelier-display)] text-6xl leading-[0.85] sm:text-7xl">
              Soft <span className="italic text-[var(--t-coral)]">edges</span>,
              <br />
              hard records.
            </p>
            <p className="mt-4 max-w-md text-sm leading-6 text-[var(--t-text)]/50">
              Instrument Serif carries voice; Manrope carries work. Every panel is a
              layer with a job, not a floating card for decoration.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 font-[family-name:var(--font-atelier-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--t-text)]/55">
              {[
                ["Instrument Serif", "Display"],
                ["Manrope", "Interface"],
                ["JetBrains Mono", "Metadata"],
              ].map(([font, role]) => (
                <span
                  key={font}
                  className="rounded-full border border-[var(--t-line)] px-3 py-1.5"
                >
                  {font} · {role}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {[
              ["Coral", "var(--t-coral)", "Momentum"],
              ["Lilac", "var(--t-lilac)", "Structure"],
              ["Mint", "var(--t-mint)", "Confirmed"],
              ["Void", "var(--t-void)", "Canvas"],
              ["Panel", "var(--t-panel-2)", "Surface"],
              ["Line", "var(--t-line)", "Divider"],
            ].map(([name, color, usage]) => (
              <div
                key={name}
                className="overflow-hidden rounded-xl border border-[var(--t-line)] bg-[var(--t-panel)]"
              >
                <div className="h-14" style={{ backgroundColor: color }} />
                <div className="p-2.5">
                  <p className="text-[10px] font-semibold">{name}</p>
                  <p className="font-[family-name:var(--font-atelier-mono)] text-[9px] uppercase tracking-[0.1em] text-[var(--t-text)]/35">
                    {usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="px-3 py-12 sm:px-5">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Label>Screen 01 / Command center</Label>
              <h2 className="mt-2 font-[family-name:var(--font-atelier-display)] text-4xl leading-none sm:text-5xl">
                Read the room at a glance.
              </h2>
            </div>
            <span className="rounded-full border border-[var(--t-line)] px-3 py-1 font-[family-name:var(--font-atelier-mono)] text-[9px] uppercase tracking-[0.14em] text-[var(--t-text)]/40">
              Illustrative data
            </span>
          </div>

          <div className="mt-7 grid gap-3 lg:grid-cols-[1.5fr_0.85fr]">
            <motion.div
              initial={reduce ? false : { y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={spring}
              className="relative overflow-hidden rounded-[24px] border border-[var(--t-line)] bg-gradient-to-br from-[var(--t-panel-2)] via-[var(--t-panel)] to-[var(--t-void)] p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Label>Completion pulse</Label>
                  <p className="mt-2 font-[family-name:var(--font-atelier-display)] text-5xl leading-none">
                    136
                  </p>
                  <p className="mt-1 text-xs text-[var(--t-text)]/40">tasks done · 14 days</p>
                </div>
                <div className="rounded-full border border-[var(--t-line)] p-0.5">
                  {[7, 14, 30].map((range) => (
                    <button
                      key={range}
                      type="button"
                      aria-pressed={range === 14}
                      className={cn(
                        "rounded-full px-2.5 py-1 font-[family-name:var(--font-atelier-mono)] text-[9px] transition-colors",
                        range === 14
                          ? "bg-[var(--t-text)] text-[var(--t-void)]"
                          : "text-[var(--t-text)]/45 hover:text-[var(--t-text)]",
                      )}
                    >
                      {range}d
                    </button>
                  ))}
                </div>
              </div>

              <svg viewBox="0 0 560 170" className="mt-4 w-full" role="img" aria-label="Illustrative completion trend">
                <defs>
                  <linearGradient id="atelier-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff7a59" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#ff7a59" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3].map((line) => (
                  <line
                    key={line}
                    x1="8"
                    x2="552"
                    y1={20 + line * 40}
                    y2={20 + line * 40}
                    stroke="rgba(243,238,255,0.07)"
                  />
                ))}
                <motion.path
                  d="M8,140 C50,132 70,110 110,112 C150,114 170,88 210,84 C250,80 270,96 310,78 C350,60 370,52 410,44 C450,36 470,42 510,26 L552,20 L552,160 L8,160 Z"
                  fill="url(#atelier-area)"
                  initial={reduce ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
                <motion.path
                  d="M8,140 C50,132 70,110 110,112 C150,114 170,88 210,84 C250,80 270,96 310,78 C350,60 370,52 410,44 C450,36 470,42 510,26 L552,20"
                  fill="none"
                  stroke="var(--t-coral)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </svg>

              <div className="mt-2 grid grid-cols-3 gap-2 border-t border-[var(--t-line)] pt-3">
                {[
                  ["Velocity", "9.7 / day"],
                  ["Longest streak", "6 days"],
                  ["Overdue", "2 tasks"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="font-[family-name:var(--font-atelier-mono)] text-[9px] uppercase tracking-[0.12em] text-[var(--t-text)]/35">
                      {label}
                    </p>
                    <p className="mt-0.5 text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-3">
              <div className="rounded-[24px] border border-[var(--t-line)] bg-[var(--t-panel)] p-5">
                <div className="flex items-center justify-between">
                  <Label>Focus</Label>
                  <span className="text-[10px] text-[var(--t-mint)]">68% complete</span>
                </div>
                <p className="mt-2 text-lg leading-tight">Harbor onboarding</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={reduce ? false : { width: 0 }}
                    whileInView={{ width: "68%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-[var(--t-lilac)] to-[var(--t-coral)]"
                  />
                </div>
                <p className="mt-2 font-[family-name:var(--font-atelier-mono)] text-[9px] uppercase tracking-[0.12em] text-[var(--t-text)]/35">
                  From stored task states
                </p>
              </div>

              <div className="rounded-[24px] border border-[var(--t-line)] bg-[var(--t-panel)] p-5">
                <Label>Upcoming</Label>
                <ul className="mt-3 space-y-2.5">
                  {[
                    ["Guided checklist shipped", "Nov 01"],
                    ["Cutover rehearsal", "Nov 18"],
                    ["Ledger parity", "Dec 12"],
                  ].map(([name, date]) => (
                    <li key={name} className="flex items-baseline justify-between gap-3">
                      <span className="text-xs text-[var(--t-text)]/70">{name}</span>
                      <span className="font-[family-name:var(--font-atelier-mono)] text-[9px] uppercase tracking-[0.1em] text-[var(--t-text)]/35">
                        {date}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {demoProjects.slice(0, 3).map((project, index) => (
              <motion.div
                key={project.id}
                initial={reduce ? false : { y: 24, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ ...spring, delay: index * 0.08 }}
                className="group rounded-2xl border border-[var(--t-line)] bg-[var(--t-panel)]/60 p-4 transition-colors hover:border-[var(--t-lilac)]/40"
              >
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-atelier-mono)] text-[9px] uppercase tracking-[0.12em] text-[var(--t-text)]/35">
                    {project.open} open
                  </span>
                  <span className="size-1.5 rounded-full bg-[var(--t-lilac)]" />
                </div>
                <p className="mt-2 text-sm">{project.name}</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[var(--t-lilac)]/70"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="font-[family-name:var(--font-atelier-mono)] text-[9px] tabular-nums text-[var(--t-text)]/40">
                    {project.progress}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BOARD */}
      <section className="border-y border-[var(--t-line)] bg-[var(--t-panel)]/30 px-3 py-12 sm:px-5">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Label>Screen 02 / Board</Label>
              <h2 className="mt-2 font-[family-name:var(--font-atelier-display)] text-4xl leading-none sm:text-5xl">
                Flow, with weight.
              </h2>
            </div>
            <p className="max-w-sm text-xs leading-5 text-[var(--t-text)]/40">
              Cards drift between columns with a shared layout transition. Drag on the
              real board; click here to advance the demo.
            </p>
          </div>

          <div className="relative mt-8 grid gap-3 md:grid-cols-3">
            {demoStatusOrder.map((status, index) => {
              const column = demoTasks.filter(
                (task) => (statuses[task.id] ?? task.status) === status,
              );
              return (
                <div
                  key={status}
                  className="rounded-[24px] border border-[var(--t-line)] bg-[var(--t-void)]/50 p-3"
                >
                  <div className="flex items-center justify-between px-1 pb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="size-2 rounded-full"
                        style={{
                          backgroundColor:
                            index === 0
                              ? "var(--t-text)"
                              : index === 1
                                ? "var(--t-coral)"
                                : "var(--t-mint)",
                        }}
                      />
                      <h3 className="text-xs font-semibold">{demoStatusLabels[status]}</h3>
                    </div>
                    <span className="font-[family-name:var(--font-atelier-mono)] text-[10px] tabular-nums text-[var(--t-text)]/35">
                      {String(column.length).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex min-h-52 flex-col gap-2">
                    {column.map((task) => (
                      <motion.button
                        key={task.id}
                        type="button"
                        layout
                        layoutId={`atelier-task-${task.id}`}
                        onClick={() => advance(task.id)}
                        whileHover={reduce ? undefined : { y: -3 }}
                        whileTap={reduce ? undefined : { scale: 0.98 }}
                        transition={spring}
                        className="w-full rounded-xl border border-[var(--t-line)] bg-[var(--t-panel-2)] p-3 text-left shadow-[0_12px_30px_-18px_rgba(0,0,0,0.9)] transition-colors hover:border-[var(--t-lilac)]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--t-lilac)]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs leading-5 text-[var(--t-text)]/85">{task.title}</p>
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-1.5 py-0.5 font-[family-name:var(--font-atelier-mono)] text-[8px] uppercase tracking-[0.08em]",
                              task.priority === "high"
                                ? "bg-[var(--t-coral)]/15 text-[var(--t-coral)]"
                                : "bg-white/[0.06] text-[var(--t-text)]/45",
                            )}
                          >
                            {task.priority}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="font-[family-name:var(--font-atelier-mono)] text-[9px] uppercase tracking-[0.1em] text-[var(--t-text)]/30">
                            {task.project}
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="font-[family-name:var(--font-atelier-mono)] text-[9px] text-[var(--t-text)]/35">
                              {task.due}
                            </span>
                            <span className="grid size-5 place-items-center rounded-full bg-gradient-to-br from-[var(--t-lilac)]/40 to-[var(--t-coral)]/40 font-[family-name:var(--font-atelier-mono)] text-[8px]">
                              {task.assignee}
                            </span>
                          </span>
                        </div>
                      </motion.button>
                    ))}
                    {column.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-[var(--t-line)] p-4 text-center text-[10px] text-[var(--t-text)]/25">
                        Drop a card here
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--t-line)] bg-[var(--t-panel)] px-4 py-3">
            <p className="font-[family-name:var(--font-atelier-mono)] text-[10px] uppercase tracking-[0.12em] text-[var(--t-text)]/40">
              Board progress · {progress}% complete
            </p>
            <div className="flex w-full max-w-xs items-center gap-2">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  layout
                  className="h-full rounded-full bg-[var(--t-mint)]"
                  style={{ width: `${progress}%` }}
                  transition={spring}
                />
              </div>
              <span className="font-[family-name:var(--font-atelier-mono)] text-[9px] tabular-nums text-[var(--t-mint)]">
                {done}/{demoTasks.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* MOTION STUDY */}
      <section className="px-3 py-12 sm:px-5">
        <div className="mx-auto grid w-full max-w-[1400px] gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <Label>Screen 03 / Motion study</Label>
            <h2 className="mt-2 font-[family-name:var(--font-atelier-display)] text-4xl leading-none sm:text-5xl">
              One workspace, two states.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[var(--t-text)]/50">
              Planning and execution are the same object seen from two depths. The
              transition preserves position, so the user never loses the thread.
            </p>

            <div className="mt-6 inline-flex rounded-full border border-[var(--t-line)] bg-[var(--t-panel)] p-1">
              {(["plan", "execute"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMode(option)}
                  aria-pressed={mode === option}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 font-[family-name:var(--font-atelier-mono)] text-[10px] uppercase tracking-[0.12em] transition-colors",
                    mode === option ? "text-[#140d1e]" : "text-[var(--t-text)]/45",
                  )}
                >
                  {mode === option ? (
                    <motion.span
                      layoutId="atelier-mode-pill"
                      className="absolute inset-0 rounded-full bg-[var(--t-lilac)]"
                      transition={spring}
                    />
                  ) : null}
                  <span className="relative">{option}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              {[0, 1, 2].map((node) => (
                <button
                  key={node}
                  type="button"
                  onClick={() => setStage(node)}
                  aria-pressed={stage === node}
                  aria-label={`Stage ${node + 1}`}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    node <= stage ? "bg-[var(--t-coral)]" : "bg-white/10",
                  )}
                />
              ))}
            </div>
            <p className="mt-2 font-[family-name:var(--font-atelier-mono)] text-[9px] uppercase tracking-[0.12em] text-[var(--t-text)]/30">
              Stage {stage + 1} of 3 · select to scrub
            </p>
          </div>

          <div className="relative min-h-[22rem] overflow-hidden rounded-[28px] border border-[var(--t-line)] bg-gradient-to-br from-[var(--t-panel-2)] to-[var(--t-void)] p-5">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-10 -top-10 size-56 rounded-full bg-[var(--t-lilac)]/15 blur-3xl"
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mode}
                initial={reduce ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={reduce ? undefined : { opacity: 0, y: -16, filter: "blur(6px)" }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {mode === "plan" ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Label>Proposed plan</Label>
                      <span className="rounded-full border border-[var(--t-coral)]/40 bg-[var(--t-coral)]/10 px-2 py-0.5 font-[family-name:var(--font-atelier-mono)] text-[9px] uppercase tracking-[0.1em] text-[var(--t-coral)]">
                        not saved
                      </span>
                    </div>
                    <p className="mt-4 font-[family-name:var(--font-atelier-display)] text-3xl leading-tight">
                      Activation onboarding
                    </p>
                    <ul className="mt-5 space-y-2">
                      {demoMilestonesPreview.map((milestone, index) => (
                        <motion.li
                          key={milestone}
                          initial={reduce ? false : { opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.08 + index * 0.08 }}
                          className="flex items-center gap-3 rounded-xl border border-[var(--t-line)] bg-white/[0.03] px-3 py-2.5"
                        >
                          <span className="font-[family-name:var(--font-atelier-mono)] text-[9px] text-[var(--t-lilac)]">
                            M{index + 1}
                          </span>
                          <span className="flex-1 text-xs text-[var(--t-text)]/70">
                            {milestone}
                          </span>
                          <span className="font-[family-name:var(--font-atelier-mono)] text-[9px] text-[var(--t-text)]/30">
                            {14 + index * 12} tasks
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                    <div className="mt-5 flex items-center gap-2">
                      <span className="rounded-full bg-[var(--t-text)] px-3 py-1.5 text-[10px] font-semibold text-[var(--t-void)]">
                        Confirm &amp; save
                      </span>
                      <span className="text-[10px] text-[var(--t-text)]/35">
                        Nothing is written until this action
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Label>Live execution</Label>
                    <p className="mt-4 font-[family-name:var(--font-atelier-display)] text-3xl leading-tight">
                      Activation onboarding
                    </p>
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {[
                        ["Open", "6"],
                        ["Doing", "3"],
                        ["Done", "9"],
                      ].map(([label, value], index) => (
                        <div
                          key={label}
                          className="rounded-xl border border-[var(--t-line)] bg-white/[0.03] p-3"
                        >
                          <p className="font-[family-name:var(--font-atelier-mono)] text-[9px] uppercase tracking-[0.1em] text-[var(--t-text)]/35">
                            {label}
                          </p>
                          <p
                            className="mt-1 font-[family-name:var(--font-atelier-display)] text-3xl"
                            style={{
                              color:
                                index === 2
                                  ? "var(--t-mint)"
                                  : index === 1
                                    ? "var(--t-coral)"
                                    : "var(--t-text)",
                            }}
                          >
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <ul className="mt-4 space-y-2">
                      {demoTasks.slice(0, 3).map((task, index) => (
                        <li
                          key={task.id}
                          className="flex items-center gap-3 rounded-xl border border-[var(--t-line)] px-3 py-2"
                        >
                          <span
                            className="size-1.5 rounded-full"
                            style={{
                              backgroundColor:
                                index === 0 ? "var(--t-mint)" : "var(--t-coral)",
                            }}
                          />
                          <span className="flex-1 text-xs text-[var(--t-text)]/70">
                            {task.title}
                          </span>
                          <span className="font-[family-name:var(--font-atelier-mono)] text-[9px] text-[var(--t-text)]/30">
                            {index === 0 ? "Done" : "In progress"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--t-line)] px-3 py-6 sm:px-5">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between">
          <p className="font-[family-name:var(--font-atelier-display)] text-xl">
            Monolith / Concept B
          </p>
          <p className="font-[family-name:var(--font-atelier-mono)] text-[9px] uppercase tracking-[0.14em] text-[var(--t-text)]/30">
            Illustrative preview · no database writes
          </p>
        </div>
      </footer>
    </div>
  );
}

const demoMilestonesPreview = [
  "Activation map approved",
  "Guided checklist shipped",
  "Invite sequence live",
  "First-week report",
];
