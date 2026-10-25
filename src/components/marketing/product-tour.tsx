"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";

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
    <div className="rounded-[1.5rem] border border-border/70 bg-card p-4 shadow-[0_40px_100px_-60px_rgba(0,0,0,0.9)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Draft · Community run club
          </p>
        </div>
        <span className="rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-primary">
          Not saved
        </span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-background/50 p-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            Project
          </p>
          <p className="mt-1 text-sm">Community run club</p>
          <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            Horizon
          </p>
          <p className="mt-1 text-sm">4 weeks</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-background/50 p-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            Milestones
          </p>
          <ul className="mt-2 space-y-2">
            {["Route library live", "Weekly schedule live"].map((title, index) => (
              <li key={title} className="flex items-center justify-between gap-2 text-xs">
                <span>{title}</span>
                <span className="font-mono text-[9px] text-muted-foreground">W{index + 1}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-3 rounded-lg border border-border/60 bg-background/50 p-3">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
            Tasks
          </p>
          <span className="font-mono text-[9px] text-muted-foreground">03</span>
        </div>
        <ul className="mt-2 divide-y divide-border/50">
          {[
            ["Draft three route pages", "High"],
            ["Build the weekly schedule", "Medium"],
            ["Write the club introduction", "Low"],
          ].map(([title, priority]) => (
            <li key={title} className="flex items-center justify-between gap-3 py-2 text-xs">
              <span className="truncate">{title}</span>
              <span className="font-mono text-[9px] uppercase text-muted-foreground">
                {priority}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3">
        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
          Generation never writes
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

  return (
    <section id="product" className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-12">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-primary">
            The workspace
          </p>
          <h2 className="mt-3 max-w-md font-display text-5xl leading-[0.9] tracking-[-0.04em] sm:text-6xl">
            One plan. Three honest views.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
            The command center, board, and planner read the same records. Switch
            the view; the work does not fork into a second system.
          </p>
          <ul className="mt-7 space-y-3 text-sm">
            {[
              "Metrics derived from your task rows",
              "Drag and keyboard status changes",
              "Draft only until you confirm the save",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <Tabs value={tab} onValueChange={(value) => setTab(value as typeof tab)}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <TabsList className="rounded-full border border-border/70 bg-card p-1">
                {tabs.map((item) => (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className="rounded-full px-3 font-mono text-[9px] uppercase tracking-[0.12em] data-active:bg-primary data-active:text-primary-foreground"
                  >
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
                Illustrative data
              </span>
            </div>
            <TabsContent value="command">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key="command"
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.24 }}
                  role="tabpanel"
                >
                  <CommandDemo />
                </motion.div>
              </AnimatePresence>
            </TabsContent>
            <TabsContent value="board">
              <motion.div
                key="board"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24 }}
                role="tabpanel"
              >
                <BoardDemo />
              </motion.div>
            </TabsContent>
            <TabsContent value="planner">
              <motion.div
                key="planner"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.24 }}
                role="tabpanel"
              >
                <PlannerPreview />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
