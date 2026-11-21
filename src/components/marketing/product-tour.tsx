"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRight } from "lucide-react";

import { BoardDemo } from "@/components/marketing/board-demo";
import { CommandDemo } from "@/components/marketing/command-demo";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { value: "command", label: "Command" },
  { value: "board", label: "Board" },
  { value: "planner", label: "Planner" },
] as const;

function PlannerPreview() {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-4 shadow-[0_40px_100px_-60px_rgba(0,0,0,0.9)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <p className="eyebrow text-muted-foreground">
            Draft · Community run club
          </p>
        </div>
        <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 eyebrow text-primary">
          Not saved
        </span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-background/50 p-3">
          <p className="eyebrow text-muted-foreground">
            Project
          </p>
          <p className="mt-1 text-sm">Community run club</p>
          <p className="mt-4 eyebrow text-muted-foreground">
            Horizon
          </p>
          <p className="mt-1 text-sm">4 weeks</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/50 p-3">
          <p className="eyebrow text-muted-foreground">
            Milestones
          </p>
          <ul className="mt-2 space-y-2">
            {["Route library live", "Weekly schedule live"].map((title, index) => (
              <li key={title} className="flex items-center justify-between gap-2 text-xs">
                <span>{title}</span>
                <span className="num text-[10px] text-muted-foreground">W{index + 1}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-3 rounded-lg border border-border/60 bg-background/50 p-3">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-muted-foreground">
            Tasks
          </p>
          <span className="num text-[10px] text-muted-foreground">03</span>
        </div>
        <ul className="mt-2 divide-y divide-border/50">
          {[
            ["Draft three route pages", "High"],
            ["Build the weekly schedule", "Medium"],
            ["Write the club introduction", "Low"],
          ].map(([title, priority]) => (
            <li key={title} className="flex items-center justify-between gap-3 py-2 text-xs">
              <span className="truncate">{title}</span>
              <span className="num text-[10px] uppercase text-muted-foreground">
                {priority}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
        <span className="eyebrow text-muted-foreground">
          Review before saving
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[10px] font-medium text-primary-foreground">
          Confirm and save
          <ArrowRight className="size-3" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

export function ProductTour() {
  const [tab, setTab] = useState<(typeof tabs)[number]["value"]>("command");
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const lastScrollStep = useRef(-1);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reduce) return;
    const step = Math.min(tabs.length - 1, Math.floor(progress * tabs.length));
    if (step !== lastScrollStep.current) {
      lastScrollStep.current = step;
      setTab(tabs[step].value);
    }
  });

  return (
    <section ref={sectionRef} id="product" className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 lg:py-24 motion-safe:min-h-[190svh] motion-safe:lg:py-0">
      <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr] lg:items-center lg:gap-14 motion-safe:max-lg:min-h-[175svh] motion-safe:max-lg:grid-rows-[auto_1fr] motion-safe:lg:sticky motion-safe:lg:top-16 motion-safe:lg:min-h-[calc(100svh-4rem)]">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow text-primary">
            The workspace
          </p>
          <h2 className="mt-4 max-w-md display-lg">
            One plan. Three ways to move.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            Review the plan, move tasks on the board, and see progress in the
            command center. Your work stays connected.
          </p>
          <ul className="mt-7 space-y-3 text-sm">
            {[
              "See what needs attention",
              "Move tasks as work progresses",
              "Review a plan before saving it",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="min-w-0 motion-safe:max-lg:sticky motion-safe:max-lg:top-20 motion-safe:max-lg:self-start">
          <Tabs value={tab} onValueChange={(value) => setTab(value as typeof tab)}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <TabsList className="rounded-full border border-border/70 bg-card p-1">
                {tabs.map((item) => (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className="rounded-full px-3 eyebrow data-active:bg-primary data-active:text-primary-foreground"
                  >
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <span className="hidden eyebrow text-muted-foreground sm:inline-flex">
                Illustrative data
              </span>
            </div>
            <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
              {tabs.map((item) => (
                <TabsContent
                  key={item.value}
                  value={item.value}
                  forceMount
                  className="data-[state=inactive]:invisible"
                >
                  <motion.div
                    className="h-full"
                    initial={false}
                    animate={{ opacity: tab === item.value ? 1 : 0, y: tab === item.value || reduce ? 0 : 8 }}
                    transition={{ duration: reduce ? 0 : 0.24 }}
                  >
                    {item.value === "command" ? <CommandDemo /> : item.value === "board" ? <BoardDemo /> : <PlannerPreview />}
                  </motion.div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
