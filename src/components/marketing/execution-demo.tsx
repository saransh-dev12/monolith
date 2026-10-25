"use client";

import { useMemo, useState } from "react";
import {motion} from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

import { cn } from "@/lib/utils";

const full: number[] = [1, 2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 4, 6, 7];
const ranges = [7, 14] as const;

export function MarketingExecutionDemo() {
  const [range, setRange] = useState<(typeof ranges)[number]>(14);
  const reduceMotion = useReducedMotion();
  const groupId = "marketing-execution";

  const values = useMemo(() => full.slice(-range), [range]);
  const total = values.reduce((sum, value) => sum + value, 0);
  const max = Math.max(...values);

  const width = 560;
  const height = 150;
  const pad = 8;
  const points = values.map((value, index) => ({
    x: pad + (index / Math.max(1, values.length - 1)) * (width - pad * 2),
    y: height - pad - (value / max) * (height - pad * 2 - 12),
  }));
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    d += ` C ${p1.x + (p2.x - p0.x) / 6},${p1.y + (p2.y - p0.y) / 6} ${p2.x - (p3.x - p1.x) / 6},${p2.y - (p3.y - p1.y) / 6} ${p2.x},${p2.y}`;
  }
  const area = `${d} L ${points[points.length - 1].x},${height - pad} L ${points[0].x},${height - pad} Z`;

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Execution · illustrative
          </p>
          <p className="mt-2 font-heading text-4xl leading-none tabular-nums">
            {total}
            <span className="ml-2 align-middle font-sans text-xs font-normal text-muted-foreground">
              tasks done in view
            </span>
          </p>
        </div>
        <div
          role="group"
          aria-label="Demo range"
          className="inline-flex items-center gap-0.5 rounded-full border border-border/70 bg-muted/50 p-0.5"
        >
          {ranges.map((value) => {
            const selected = range === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRange(value)}
                aria-pressed={selected}
                className={cn(
                  "relative rounded-full px-3 py-1 font-mono text-[11px] transition-colors",
                  selected
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {selected ? (
                  <motion.span
                    layoutId={`${groupId}-pill`}
                    transition={{ type: "spring", stiffness: 500, damping: 36 }}
                    className="absolute inset-0 rounded-full bg-card shadow-sm ring-1 ring-border/60"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="relative">{value} days</span>
              </button>
            );
          })}
        </div>
      </div>
      <motion.svg
        key={range}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Illustrative chart of tasks completed per day"
        className="mt-4 block w-full"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <defs>
          <linearGradient id={`${groupId}-fill`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <motion.path
          d={area}
          fill={`url(#${groupId}-fill)`}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        />
        <motion.path
          d={d}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.svg>
      <p className="mt-3 font-mono text-[10px] text-muted-foreground">
        Illustrative preview · the workspace chart reads your real task rows
      </p>
    </div>
  );
}
