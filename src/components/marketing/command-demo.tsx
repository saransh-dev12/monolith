"use client";

import { useMemo, useState } from "react";
import {motion} from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

import { cn } from "@/lib/utils";

const series = [
  4, 6, 3, 5, 7, 4, 8, 6, 9, 5, 7, 10, 8, 12, 9, 11, 13, 10, 12, 15, 11, 14, 16, 13,
  15, 18, 14, 17, 19, 16,
];
const ranges = [7, 14, 30] as const;

const week = [
  { day: "M", value: 3 },
  { day: "T", value: 5 },
  { day: "W", value: 2 },
  { day: "T", value: 6 },
  { day: "F", value: 4 },
  { day: "S", value: 1 },
  { day: "S", value: 0 },
];

function smooth(values: number[], width: number, height: number) {
  const pad = 8;
  const max = Math.max(...values, 1);
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
  return { d, area: `${d} L ${points[points.length - 1].x},${height - pad} L ${points[0].x},${height - pad} Z` };
}

export function CommandDemo() {
  const [range, setRange] = useState<(typeof ranges)[number]>(14);
  const reduce = useReducedMotion();
  const values = useMemo(() => series.slice(-range), [range]);
  const total = values.reduce((sum, value) => sum + value, 0);
  const { d, area } = smooth(values, 620, 180);

  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-card/70 p-4 shadow-[0_40px_100px_-60px_rgba(0,0,0,0.9)] backdrop-blur-xl">
      <div className="flex flex-wrap items-start justify-between gap-3 px-1">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
            Completion pulse · illustrative
          </p>
          <p className="mt-1 font-display text-4xl leading-none tabular-nums">
            {total}
            <span className="ml-2 align-middle font-sans text-[11px] font-normal text-muted-foreground">
              tasks done · {range} days
            </span>
          </p>
        </div>
        <div
          role="group"
          aria-label="Demo range"
          className="inline-flex rounded-full border border-border/70 bg-muted/40 p-0.5"
        >
          {ranges.map((option) => {
            const selected = range === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setRange(option)}
                aria-pressed={selected}
                className={cn(
                  "relative rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] transition-colors",
                  selected ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {selected ? (
                  <motion.span
                    layoutId="command-demo-range"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                ) : null}
                <span className="relative">{option}d</span>
              </button>
            );
          })}
        </div>
      </div>

      <svg
        key={range}
        viewBox="0 0 620 180"
        role="img"
        aria-label={`Illustrative completion trend for the last ${range} days, ${total} tasks`}
        className="mt-2 block w-full"
      >
        <defs>
          <linearGradient id="command-demo-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((fraction) => (
          <line
            key={fraction}
            x1="8"
            x2="612"
            y1={180 * fraction}
            y2={180 * fraction}
            stroke="var(--border)"
            strokeDasharray="3 5"
          />
        ))}
        <motion.path
          d={area}
          fill="url(#command-demo-fill)"
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        />
        <motion.path
          d={d}
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      <div className="mt-2 grid gap-2 border-t border-border/60 pt-3 sm:grid-cols-[1fr_1.1fr]">
        <div className="grid grid-cols-3 gap-2">
          {[
            ["Active", "03", "text-foreground"],
            ["Open", "26", "text-foreground"],
            ["Overdue", "02", "text-primary"],
          ].map(([label, value, tone]) => (
            <div key={label} className="rounded-xl border border-border/60 bg-background/40 p-2.5">
              <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
                {label}
              </p>
              <p className={cn("mt-1 font-display text-2xl leading-none", tone)}>{value}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-border/60 bg-background/40 p-2.5">
          <div className="flex items-center justify-between">
            <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground">
              Focus week
            </p>
            <p className="font-mono text-[8px] text-muted-foreground/70">Mon–Sun</p>
          </div>
          <div className="mt-2 flex h-12 items-end gap-1.5">
            {week.map((day, index) => (
              <div key={`${day.day}-${index}`} className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  initial={reduce ? false : { height: 0 }}
                  whileInView={{ height: Math.max(4, (day.value / 6) * 32) }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.04 }}
                  className={cn(
                    "w-full rounded-full",
                    index === 3 ? "bg-chart-1" : "bg-chart-2/35",
                  )}
                />
                <span className="font-mono text-[8px] text-muted-foreground/60">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
