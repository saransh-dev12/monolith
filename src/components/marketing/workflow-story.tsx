"use client";

import { useEffect, useRef, useState } from "react";
import {motion} from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { Check, CornerDownLeft, Database, Sparkles } from "lucide-react";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const story = [
  {
    number: "01",
    label: "Describe",
    title: "Start with a sentence.",
    body: "Write the idea in plain language and add a horizon if it matters. No template, no wizard, no required fields beyond the thing you actually want to make.",
  },
  {
    number: "02",
    label: "Review",
    title: "Read the plan before it exists.",
    body: "The planner proposes milestones and tasks as structured data. Every title, date, and priority is editable. Nothing is written while you review.",
  },
  {
    number: "03",
    label: "Confirm",
    title: "One explicit save.",
    body: "Confirmation writes the project, milestones, and tasks in a single Postgres transaction. A failed insert saves nothing — there is no half-created project.",
  },
  {
    number: "04",
    label: "Execute",
    title: "Work moves; progress follows.",
    body: "Drag or use the status menu. Each change persists first, then the board, charts, and project progress update from the same records.",
  },
] as const;

function IdeaVisual() {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
        New project · idea
      </p>
      <p className="mt-3 text-sm leading-6">
        Launch a guided onboarding flow for new accounts — a short checklist, a
        first-run email sequence, and a clear empty state. Four weeks.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-border/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
          4 weeks
        </span>
        <span className="rounded-full border border-border/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
          Small team
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-medium text-primary-foreground">
          Draft with planner
          <CornerDownLeft className="size-3" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

function PlanVisual() {
  const milestones = [
    ["Activation map approved", "4 tasks"],
    ["Guided checklist shipped", "6 tasks"],
    ["Invite sequence live", "3 tasks"],
  ];
  return (
    <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          <Sparkles className="size-3 text-chart-2" aria-hidden="true" />
          AI draft
        </span>
        <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-primary">
          Not saved
        </span>
      </div>
      <p className="mt-3 font-display text-2xl leading-tight">Activation onboarding</p>
      <ul className="mt-3 space-y-2">
        {milestones.map(([title, tasks], index) => (
          <li
            key={title}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 px-3 py-2.5"
          >
            <span className="grid size-5 place-items-center rounded-full border border-chart-2/40 font-mono text-[8px] text-chart-2">
              {index + 1}
            </span>
            <span className="flex-1 text-xs">{title}</span>
            <span className="font-mono text-[9px] text-muted-foreground">{tasks}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConfirmVisual() {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
      <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
        Confirmation
      </p>
      <p className="mt-3 text-sm leading-6">
        Save <strong className="font-semibold">Activation onboarding</strong> with 3
        milestones and 13 tasks?
      </p>
      <ul className="mt-3 space-y-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        <li className="flex items-center gap-2">
          <Database className="size-3 text-chart-2" aria-hidden="true" />
          Single transaction
        </li>
        <li className="flex items-center gap-2">
          <Check className="size-3 text-chart-3" aria-hidden="true" />
          Owner from verified claims
        </li>
      </ul>
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <span className="text-[10px] text-muted-foreground">You can cancel here</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-medium text-primary-foreground">
          Confirm &amp; save
        </span>
      </div>
    </div>
  );
}

function ExecuteVisual() {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/50 p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
          Board · live
        </p>
        <span className="font-mono text-[9px] tabular-nums text-chart-3">
          54% complete
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { label: "To do", tone: "bg-foreground/60", cards: ["Draft invite sequence"] },
          {
            label: "In progress",
            tone: "bg-primary",
            cards: ["Wire empty-state checklist", "Map activation moments"],
          },
          {
            label: "Done",
            tone: "bg-chart-3",
            cards: ["Instrument step completion"],
          },
        ].map((column) => (
          <div key={column.label} className="rounded-xl border border-border/60 bg-card/40 p-2">
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
                  className="rounded-lg border border-border/50 bg-background/70 px-2 py-1.5 text-[9px] leading-4"
                >
                  {card}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-[54%] rounded-full bg-gradient-to-r from-chart-2 to-chart-3" />
      </div>
    </div>
  );
}

const visuals = [IdeaVisual, PlanVisual, ConfirmVisual, ExecuteVisual];

export function WorkflowStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const mmRef = useRef<ReturnType<typeof gsap.matchMedia> | null>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useEffect(
    () => () => {
      mmRef.current?.revert();
      mmRef.current = null;
    },
    [],
  );

  useGSAP(
    () => {
      if (reduce || !sectionRef.current || !stageRef.current) return;

      const mm = gsap.matchMedia();
      mmRef.current = mm;
      mm.add("(min-width: 1024px)", () => {
        const trigger = ScrollTrigger.create({
          trigger: stageRef.current,
          start: "top 64px",
          end: "+=190%",
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(
              story.length - 1,
              Math.floor(self.progress * story.length),
            );
            setActive(next);
            if (railRef.current) {
              gsap.set(railRef.current, { scaleX: self.progress });
            }
          },
        });
        return () => trigger.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reduce] },
  );

  const ActiveVisual = visuals[active];

  return (
    <section ref={sectionRef} id="story" className="border-y border-border/60">
      <div className="mx-auto w-full max-w-[1240px] px-4 pt-16 sm:px-6 lg:pt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
              The workflow
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-5xl leading-[0.9] tracking-[-0.02em] sm:text-6xl">
              Idea to shipped work,{" "}
              <span className="italic text-chart-2">without the handoff.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Four states, one object. The plan you review is the board you run,
            and the progress you read is the same data.
          </p>
        </div>
      </div>

      {/* Desktop: GSAP-pinned stage */}
      <div
        ref={stageRef}
        data-gsap-stage
        className="relative hidden h-[calc(100dvh-4rem)] items-center lg:flex"
      >
          <div className="mx-auto grid w-full max-w-[1240px] grid-cols-[0.9fr_1.1fr] gap-14 px-6">
            <div className="flex flex-col justify-center">
              <ol className="space-y-1">
                {story.map((item, index) => {
                  const isActive = index === active;
                  return (
                    <li key={item.number}>
                      <div
                        className={cn(
                          "border-l-2 py-3 pl-5 transition-colors duration-300",
                          isActive ? "border-primary" : "border-border/50",
                        )}
                      >
                        <div className="flex items-baseline gap-3">
                          <span
                            className={cn(
                              "font-mono text-[10px] tabular-nums transition-colors",
                              isActive ? "text-primary" : "text-muted-foreground/60",
                            )}
                          >
                            {item.number}
                          </span>
                          <h3
                            className={cn(
                              "font-display text-3xl leading-none transition-colors",
                              isActive ? "text-foreground" : "text-muted-foreground/50",
                            )}
                          >
                            {item.title}
                          </h3>
                        </div>
                        {reduce ? (
                          <p className="max-w-md pt-2 text-sm leading-6 text-muted-foreground">
                            {item.body}
                          </p>
                        ) : (
                          <motion.div
                            initial={false}
                            animate={{
                              height: isActive ? "auto" : 0,
                              opacity: isActive ? 1 : 0,
                            }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="max-w-md pt-2 text-sm leading-6 text-muted-foreground">
                              {item.body}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-6 flex items-center gap-3 pl-5">
                <div className="h-px flex-1 bg-border/60">
                  <span
                    ref={railRef}
                    className="block h-px origin-left bg-primary"
                    style={{ transform: reduce ? "scaleX(1)" : "scaleX(0)" }}
                  />
                </div>
                <span
                  data-step-label
                  className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground"
                >
                  {story[active].label}
                </span>
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-chart-1/10 via-transparent to-chart-2/15 blur-2xl"
              />
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[1.75rem] border border-border/70 bg-card/80 p-3 shadow-[0_40px_100px_-60px_rgba(0,0,0,0.9)] backdrop-blur-xl"
              >
                <div className="mb-3 flex items-center justify-between px-2 pt-1">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                    {story[active].label} · illustrative
                  </span>
                  <span className="font-mono text-[9px] tabular-nums text-muted-foreground/70">
                    {active + 1} / {story.length}
                  </span>
                </div>
                <ActiveVisual />
              </motion.div>
            </div>
          </div>
      </div>

      {/* Mobile/tablet: stacked steps */}
      <div className="mx-auto grid w-full max-w-[1240px] gap-4 px-4 py-10 sm:px-6 lg:hidden">
        {story.map((item, index) => {
          const Visual = visuals[index];
          return (
            <article
              key={item.number}
              className="rounded-[1.5rem] border border-border/60 bg-card/50 p-4"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[10px] text-primary">{item.number}</span>
                <h3 className="font-display text-2xl leading-none">{item.title}</h3>
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
              <div className="mt-4">
                <Visual />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
