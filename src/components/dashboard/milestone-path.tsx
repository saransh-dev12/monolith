"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

interface MilestoneItem {
  id: string;
  title: string;
  date: string;
}

export function MilestonePath({
  milestones,
  projectId,
}: {
  milestones: MilestoneItem[];
  projectId: string;
}) {
  const [selectedId, setSelectedId] = useState(milestones[0]?.id);
  const reduceMotion = useReducedMotion();
  const selected =
    milestones.find((item) => item.id === selectedId) ?? milestones[0];

  if (!selected) return null;

  return (
    <div className="mt-5">
      <div className="relative grid gap-1 sm:grid-cols-2 xl:grid-cols-3">
        {milestones.map((item) => {
          const active = item.id === selected.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={active}
              onClick={() => setSelectedId(item.id)}
              className="group relative min-w-0 border-l border-border py-3 pl-5 text-left outline-none transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:border-l-0 sm:border-t sm:pb-2 sm:pl-0 sm:pr-5 sm:pt-5"
            >
              <span
                aria-hidden="true"
                className={`absolute -left-[5px] top-5 size-2.5 rounded-full border sm:-top-[5px] sm:left-0 ${active ? "border-primary bg-primary" : "border-muted-foreground bg-card"}`}
              />
              {active && (
                <motion.span
                  layoutId="milestone-selection"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 34 }
                  }
                  className="absolute inset-y-0 -left-px w-px bg-primary sm:inset-y-auto sm:left-0 sm:right-0 sm:top-0 sm:h-px sm:w-auto"
                />
              )}
              <span className="block text-xs tabular-nums text-muted-foreground">
                {item.date}
              </span>
              <span
                className={`mt-2 block break-words text-sm font-medium leading-5 ${active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}
              >
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
      <div
        className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm"
        aria-live="polite"
      >
        <p className="text-muted-foreground">
          <span className="text-foreground">{selected.title}</span> ·{" "}
          {selected.date}
        </p>
        <Link
          href={`/app/projects/${projectId}`}
          className="text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          View project <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
}
