"use client";

import { useEffect, useState } from "react";
import {AnimatePresence, motion} from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { ArrowRight, Check, CornerDownLeft, Sparkles } from "lucide-react";

import { SpotlightSurface } from "@/components/reactbits/spotlight-surface";
import { cn } from "@/lib/utils";

const steps = [
  { id: "idea", label: "Describe" },
  { id: "plan", label: "Review" },
  { id: "execute", label: "Execute" },
] as const;

type StepId = (typeof steps)[number]["id"];

const plan = [
  { title: "Activation map approved", tasks: 4 },
  { title: "Guided checklist shipped", tasks: 6 },
  { title: "Invite sequence live", tasks: 3 },
];

const columns = [
  {
    label: "To do",
    tone: "bg-foreground/70",
    cards: ["Draft invite sequence", "Map activation moments"],
  },
  {
    label: "In progress",
    tone: "bg-primary",
    cards: ["Wire empty-state checklist"],
  },
  {
    label: "Done",
    tone: "bg-chart-3",
    cards: ["Instrument step completion", "Audit first-run events"],
  },
];

export function StudioHero() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState<StepId>("idea");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const index = steps.findIndex((item) => item.id === step);
    const timer = window.setTimeout(() => {
      setStep(steps[(index + 1) % steps.length].id);
    }, 4600);
    return () => window.clearTimeout(timer);
  }, [step, paused, reduce]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-chart-1/20 via-transparent to-chart-2/20 blur-2xl"
      />
      <SpotlightSurface className="rounded-[1.75rem]" color="var(--color-chart-2)">
      <motion.div
        initial={reduce ? false : { y: 28, opacity: 0, rotate: 1.5 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 110, damping: 20, delay: 0.15 }}
        className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/85 shadow-[0_48px_120px_-56px_rgba(0,0,0,0.9)] backdrop-blur-xl"
      >
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex gap-1" aria-hidden="true">
              <span className="size-1.5 rounded-full bg-primary" />
              <span className="size-1.5 rounded-full bg-chart-2" />
              <span className="size-1.5 rounded-full bg-chart-3" />
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
              Monolith studio
            </span>
          </div>
          <span className="rounded-full border border-border/70 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
            Illustrative
          </span>
        </div>

        <div className="flex gap-1 border-b border-border/60 px-3 py-2">
          {steps.map((item) => {
            const active = step === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setStep(item.id)}
                aria-pressed={active}
                className={cn(
                  "relative flex-1 rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] transition-colors",
                  active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="studio-hero-step"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                ) : null}
                <span className="relative">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="min-h-[19.5rem] p-4">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={reduce ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? undefined : { opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              {step === "idea" ? (
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                    Project idea
                  </p>
                  <div className="mt-3 rounded-2xl border border-border/70 bg-background/60 p-4">
                    <p className="text-sm leading-6">
                      Launch a guided onboarding flow for new accounts — a short
                      checklist, a first-run email sequence, and a clear empty
                      state. Four weeks.
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="rounded-full bg-muted px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
                        Horizon · 4 weeks
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-medium text-primary-foreground">
                        Draft a plan
                        <CornerDownLeft className="size-3" aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      ["Milestones", "3"],
                      ["Tasks", "13"],
                      ["Saved yet", "No"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-border/60 bg-card/60 p-2.5"
                      >
                        <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
                          {label}
                        </p>
                        <p className="mt-1 font-display text-xl leading-none">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {step === "plan" ? (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                      Proposed plan
                    </p>
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-primary">
                      Not saved
                    </span>
                  </div>
                  <p className="mt-2 font-display text-2xl leading-tight">
                    Activation onboarding
                  </p>
                  <ul className="mt-3 space-y-2">
                    {plan.map((milestone, index) => (
                      <motion.li
                        key={milestone.title}
                        initial={reduce ? false : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + index * 0.08 }}
                        className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-2.5"
                      >
                        <span className="grid size-5 place-items-center rounded-full border border-chart-2/40 font-mono text-[8px] text-chart-2">
                          {index + 1}
                        </span>
                        <span className="flex-1 text-xs">{milestone.title}</span>
                        <span className="font-mono text-[9px] text-muted-foreground">
                          {milestone.tasks} tasks
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
                    <span className="text-[10px] text-muted-foreground">
                      Edit any field before saving
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep("execute")}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                    >
                      Confirm &amp; save
                      <ArrowRight className="size-3" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ) : null}

              {step === "execute" ? (
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                      Board · saved plan
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full border border-chart-3/40 bg-chart-3/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-chart-3">
                      <Check className="size-2.5" aria-hidden="true" />
                      Confirmed
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {columns.map((column) => (
                      <div
                        key={column.label}
                        className="rounded-xl border border-border/60 bg-background/40 p-2"
                      >
                        <div className="flex items-center gap-1.5 px-0.5">
                          <span className={cn("size-1.5 rounded-full", column.tone)} />
                          <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-muted-foreground">
                            {column.label}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1.5">
                          {column.cards.map((card) => (
                            <div
                              key={card}
                              className="rounded-lg border border-border/50 bg-card px-2 py-1.5 text-[9px] leading-4"
                            >
                              {card}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl border border-border/60 bg-card/60 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
                        Progress from records
                      </span>
                      <span className="font-mono text-[9px] tabular-nums text-chart-3">
                        54%
                      </span>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        initial={reduce ? false : { width: 0 }}
                        animate={{ width: "54%" }}
                        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-chart-2 to-chart-3"
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5">
          <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
            <Sparkles className="size-3 text-chart-2" aria-hidden="true" />
            Demo walkthrough · no writes
          </span>
          <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground/70">
            {paused ? "Paused" : "Auto-playing"}
          </span>
        </div>
      </motion.div>
      </SpotlightSurface>
    </div>
  );
}
