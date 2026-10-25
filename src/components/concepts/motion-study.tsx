"use client";

import { useEffect, useRef, useState } from "react";

import {
  demoProjects,
  demoSeries,
  demoStatusLabels,
  demoTasks,
} from "@/components/concepts/demo";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { useGSAP } from "@/lib/gsap";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Variant = "brutalism" | "atelier" | "editorial";

const copy: Record<
  Variant,
  {
    eyebrow: string;
    title: string;
    body: string;
    steps: Array<{ label: string; detail: string }>;
  }
> = {
  brutalism: {
    eyebrow: "Motion study / A",
    title: "Hard cuts. Zero drift.",
    body: "Scroll advances the ledger in deliberate blocks. No easing theatre, no parallax fog. Each row arrives, settles, and stays readable.",
    steps: [
      { label: "Index", detail: "A stack of work, one row at a time." },
      { label: "Commit", detail: "Hard clips expose the next record." },
      { label: "Run", detail: "The ledger stays legible while it moves." },
    ],
  },
  atelier: {
    eyebrow: "Motion study / B",
    title: "A sequence, not a slideshow.",
    body: "The idea, the plan, and the board share one scroll timeline. Layers settle into place as the story moves from draft to execution.",
    steps: [
      { label: "Compose", detail: "The idea card leads the sequence." },
      { label: "Focus", detail: "The plan rises through the stack." },
      { label: "Flow", detail: "The board closes the loop." },
    ],
  },
  editorial: {
    eyebrow: "Motion study / C",
    title: "Read across the edition.",
    body: "Columns move like a spread being turned: measured, horizontal, and quiet. The data stays in view while the argument advances.",
    steps: [
      { label: "Read", detail: "Projects open the spread." },
      { label: "Compare", detail: "Series and tasks line up beside them." },
      { label: "Decide", detail: "The edition resolves to one action." },
    ],
  },
};

const shell: Record<Variant, string> = {
  brutalism:
    "border-y-2 border-[var(--b-ink)] bg-[var(--b-paper)] text-[var(--b-ink)]",
  atelier:
    "border-y border-[var(--t-line)] bg-[var(--t-void)] text-[var(--t-text)]",
  editorial:
    "border-y-2 border-[var(--e-ink)] bg-[var(--e-paper)] text-[var(--e-ink)]",
};

const display: Record<Variant, string> = {
  brutalism:
    "font-[family-name:var(--font-brutal-display)] uppercase tracking-[-0.04em]",
  atelier:
    "font-[family-name:var(--font-atelier-display)] italic tracking-[-0.02em]",
  editorial:
    "font-[family-name:var(--font-editorial-display)] tracking-[-0.02em]",
};

const mono: Record<Variant, string> = {
  brutalism: "font-[family-name:var(--font-brutal-mono)]",
  atelier: "font-[family-name:var(--font-atelier-mono)]",
  editorial: "font-[family-name:var(--font-editorial-sans)]",
};

const accent: Record<Variant, string> = {
  brutalism: "text-[var(--b-blue)]",
  atelier: "text-[var(--t-coral)]",
  editorial: "text-[var(--e-oxblood)]",
};

export function ConceptMotionStudy({ variant }: { variant: Variant }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const mmRef = useRef<ReturnType<typeof gsap.matchMedia> | null>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const content = copy[variant];

  useEffect(
    () => () => {
      mmRef.current?.revert();
      mmRef.current = null;
    },
    [],
  );

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!sectionRef.current || !stageRef.current) return;

      const mm = gsap.matchMedia();
      mmRef.current = mm;

      mm.add("(min-width: 1024px)", () => {
        const trigger = {
          trigger: stageRef.current,
          start: "top 72px",
          end: "+=170%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self: { progress: number }) => {
            setActive(Math.min(2, Math.floor(self.progress * 2.999)));
            if (railRef.current) {
              gsap.set(railRef.current, { scaleX: self.progress });
            }
          },
        };

        const tl = gsap.timeline({ scrollTrigger: trigger });

        if (variant === "brutalism") {
          tl.fromTo(
            "[data-row]:nth-child(n+2)",
            { clipPath: "inset(0 100% 0 0)", x: -24, opacity: 0.3 },
            {
              clipPath: "inset(0 0% 0 0)",
              x: 0,
              opacity: 1,
              stagger: 0.16,
              ease: "none",
            },
            0,
          );
        } else if (variant === "atelier") {
          tl.fromTo(
            "[data-layer]:nth-child(n+2)",
            { y: 70, rotate: -2.5, opacity: 0.15, scale: 0.94 },
            {
              y: 0,
              rotate: 0,
              opacity: 1,
              scale: 1,
              stagger: 0.18,
              ease: "none",
            },
            0,
          );
        } else {
          tl.fromTo(
            "[data-column]:nth-child(n+2)",
            { xPercent: 24, opacity: 0.35 },
            {
              xPercent: 0,
              opacity: 1,
              stagger: 0.18,
              ease: "none",
            },
            0,
          );
        }

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add("(max-width: 1023px)", () => {
        const targets = sectionRef.current?.querySelectorAll(
          "[data-row], [data-layer], [data-column]",
        );
        if (!targets?.length) return;
        gsap.from(targets, {
          y: 22,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stageRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [variant] },
  );

  return (
    <section
      ref={sectionRef}
      className={cn("relative overflow-x-clip", shell[variant])}
    >
      <div
        ref={stageRef}
        className="mx-auto grid w-full max-w-[1440px] gap-8 px-3 py-14 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-12 lg:py-20"
      >
        <div>
          <p
            className={cn(
              "text-[10px] uppercase tracking-[0.22em]",
              mono[variant],
              accent[variant],
            )}
          >
            {content.eyebrow}
          </p>
          <h2
            className={cn(
              "mt-3 max-w-md text-4xl leading-[0.92] sm:text-5xl",
              display[variant],
            )}
          >
            {content.title}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 opacity-65">
            {content.body}
          </p>
          <ol className="mt-7 space-y-1">
            {content.steps.map((step, index) => {
              const current = index === active;
              return (
                <li
                  key={step.label}
                  className={cn(
                    "border-l-2 py-2.5 pl-4 transition-colors duration-300",
                    current ? "border-current" : "border-current/20",
                  )}
                >
                  <div className="flex items-baseline gap-3">
                    <span
                      className={cn(
                        "text-[9px] tabular-nums opacity-55",
                        mono[variant],
                      )}
                    >
                      0{index + 1}
                    </span>
                    <span
                      className={cn(
                        "text-sm uppercase tracking-[0.12em]",
                        mono[variant],
                        current ? "opacity-100" : "opacity-40",
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "mt-1 max-w-xs text-xs leading-5 transition-opacity",
                      reduce || current ? "opacity-60" : "opacity-60 lg:opacity-0",
                    )}
                  >
                    {step.detail}
                  </p>
                </li>
              );
            })}
          </ol>
          <div className="mt-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-current/15">
              <span
                ref={railRef}
                className="block h-px origin-left scale-x-0 bg-current"
              />
            </span>
            <span
              className={cn(
                "text-[9px] uppercase tracking-[0.16em] opacity-50",
                mono[variant],
              )}
            >
              {String(active + 1).padStart(2, "0")} / 03
            </span>
          </div>
        </div>

        <div className="flex min-h-[24rem] items-center lg:min-h-[34rem]">
          {variant === "brutalism" ? (
            <div className="w-full space-y-2">
              {demoTasks.slice(0, 3).map((task, index) => (
                <div
                  key={task.id}
                  data-row
                  className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 border-2 border-[var(--b-ink)] bg-white px-4 py-5 shadow-[5px_5px_0_var(--b-ink)]"
                >
                  <span
                    className={cn(
                      "text-[10px] tabular-nums opacity-45",
                      mono[variant],
                    )}
                  >
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.04em]">
                      {task.title}
                    </p>
                    <p className={cn("mt-1 text-[10px] uppercase opacity-50", mono[variant])}>
                      {task.project} · {demoStatusLabels[task.status]}
                    </p>
                  </div>
                  <span className="bg-[var(--b-acid)] px-2 py-1 text-[10px] font-bold uppercase">
                    {String(demoSeries[index + 12]).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          ) : null}

          {variant === "atelier" ? (
            <div className="relative w-full space-y-3 lg:h-[30rem] lg:space-y-0">
              <div
                data-layer
                className="rounded-[1.5rem] border border-[var(--t-line)] bg-[var(--t-panel)] p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] lg:absolute lg:left-0 lg:top-14 lg:w-[72%]"
              >
                <p className={cn("text-[9px] uppercase tracking-[0.18em] opacity-45", mono[variant])}>
                  Describe · raw idea
                </p>
                <p className="mt-3 text-sm leading-6">
                  A guided onboarding flow for new accounts: checklist, first-run
                  email, empty state. Four weeks.
                </p>
              </div>
              <div
                data-layer
                className="rounded-[1.5rem] border border-[var(--t-line)] bg-[var(--t-panel-2)] p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] lg:absolute lg:right-0 lg:top-40 lg:w-[70%]"
              >
                <div className="flex items-center justify-between">
                  <p className={cn("text-[9px] uppercase tracking-[0.18em] opacity-45", mono[variant])}>
                    Review · proposed plan
                  </p>
                  <span className="rounded-full border border-[var(--t-coral)]/40 px-2 py-0.5 text-[8px] uppercase text-[var(--t-coral)]">
                    Not saved
                  </span>
                </div>
                <p className="mt-3 text-sm">
                  {demoProjects[0].name} · {demoProjects[0].total} tasks
                </p>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                  <span className="block h-full w-[68%] rounded-full bg-gradient-to-r from-[var(--t-coral)] to-[var(--t-lilac)]" />
                </div>
              </div>
              <div
                data-layer
                className="rounded-[1.5rem] border border-[var(--t-line)] bg-[var(--t-panel)] p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] lg:absolute lg:bottom-0 lg:left-[14%] lg:w-[68%]"
              >
                <p className={cn("text-[9px] uppercase tracking-[0.18em] opacity-45", mono[variant])}>
                  Execute · board
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {(["todo", "in_progress", "done"] as const).map((status) => (
                    <div
                      key={status}
                      className="rounded-xl border border-[var(--t-line)] bg-white/[0.03] p-2"
                    >
                      <p className="text-[8px] uppercase tracking-[0.08em] opacity-50">
                        {demoStatusLabels[status]}
                      </p>
                      <p className="mt-2 font-[family-name:var(--font-atelier-display)] text-2xl">
                        {String(demoTasks.filter((task) => task.status === status).length).padStart(2, "0")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {variant === "editorial" ? (
            <div className="grid w-full gap-2 sm:grid-cols-3">
              {demoProjects.slice(0, 3).map((project, index) => (
                <div
                  key={project.id}
                  data-column
                  className="border-t-2 border-[var(--e-ink)] bg-[var(--e-paper-2)] p-4"
                >
                  <p className={cn("text-[9px] uppercase tracking-[0.16em] opacity-50", mono[variant])}>
                    0{index + 1} · Project
                  </p>
                  <p className="mt-2 font-[family-name:var(--font-editorial-display)] text-2xl leading-none">
                    {project.name}
                  </p>
                  <p className="mt-3 text-[11px] leading-5 opacity-60">
                    {project.summary}
                  </p>
                  <div className="mt-4 flex items-end justify-between">
                    <span className={cn("text-[9px] uppercase tracking-[0.12em] opacity-50", mono[variant])}>
                      {project.open} open
                    </span>
                    <span className="font-[family-name:var(--font-editorial-display)] text-3xl">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
