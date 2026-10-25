"use client";

import { useId, useMemo, useState } from "react";
import {motion} from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

import { cn } from "@/lib/utils";
import type { ExecutionDay } from "@/lib/data/projects";

const ranges = [7, 14, 30] as const;

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

export function ExecutionChart({ series }: { series: ExecutionDay[] }) {
  const [range, setRange] = useState<(typeof ranges)[number]>(14);
  const [active, setActive] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const tooltipId = useId();
  const groupId = useId();

  const days = useMemo(() => series.slice(-range), [series, range]);
  const completedTotal = days.reduce((sum, day) => sum + day.completed, 0);
  const createdTotal = days.reduce((sum, day) => sum + day.created, 0);
  const max = Math.max(4, ...days.map((day) => day.completed));

  const width = 640;
  const height = 180;
  const pad = 8;
  const points = days.map((day, index) => ({
    x: pad + (index / Math.max(1, days.length - 1)) * (width - pad * 2),
    y:
      height -
      pad -
      (day.completed / max) * (height - pad * 2 - 14),
  }));
  const line = smoothPath(points);
  const area = `${line} L ${points[points.length - 1]?.x ?? pad},${height - pad} L ${points[0]?.x ?? pad},${height - pad} Z`;
  const activePoint = active !== null ? points[active] : null;

  return (
    <section
      aria-labelledby={`${groupId}-heading`}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            id={`${groupId}-heading`}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
          >
            Execution · last {range} days
          </h2>
          <p className="mt-2 font-display text-5xl leading-none tabular-nums">
            {completedTotal}
            <span className="ml-2 align-middle font-sans text-xs font-normal text-muted-foreground">
              tasks done · {createdTotal} created
            </span>
          </p>
        </div>
        <div
          role="group"
          aria-label="Chart range"
          className="inline-flex items-center gap-0.5 rounded-full border border-border/70 bg-muted/50 p-0.5"
        >
          {ranges.map((value) => {
            const selected = range === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setRange(value);
                  setActive(null);
                }}
                aria-pressed={selected}
                className={cn(
                  "relative rounded-full px-3 py-1 font-mono text-[11px] transition-colors",
                  selected
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {selected ? (
                  <motion.span
                    layoutId={`${groupId}-range-pill`}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 36,
                    }}
                    className="absolute inset-0 rounded-full bg-primary shadow-sm"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="relative">
                  {value === 30 ? "30 days" : `${value} days`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="relative mt-4"
        onMouseLeave={() => setActive(null)}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const ratio = (event.clientX - rect.left) / rect.width;
          const index = Math.round(ratio * (days.length - 1));
          setActive(Math.max(0, Math.min(days.length - 1, index)));
        }}
      >
        <motion.svg
          key={range}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Tasks completed per day over the last ${range} days. Total ${completedTotal}.`}
          className="block w-full"
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
          {[0.25, 0.5, 0.75].map((fraction) => (
            <line
              key={fraction}
              x1={pad}
              x2={width - pad}
              y1={height * fraction}
              y2={height * fraction}
              stroke="var(--border)"
              strokeDasharray="3 5"
              strokeWidth="1"
            />
          ))}
          <motion.path
            d={area}
            fill={`url(#${groupId}-fill)`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke="var(--chart-1)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          {activePoint ? (
            <g>
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="4.5"
                fill="var(--chart-1)"
                stroke="var(--background)"
                strokeWidth="2"
              />
            </g>
          ) : null}
        </motion.svg>
        {active !== null && activePoint ? (
          <p
            id={tooltipId}
            role="status"
            className="pointer-events-none absolute -top-1 rounded-md border border-border/70 bg-popover px-2 py-1 font-mono text-[10px] whitespace-nowrap text-popover-foreground shadow-lg"
            style={{
              left: `${(activePoint.x / width) * 100}%`,
              transform: "translate(-50%, -100%)",
            }}
          >
            {days[active].date} · {days[active].completed} done ·{" "}
            {days[active].created} new
          </p>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] text-muted-foreground">
          Done dated by last update · from your own task rows
        </p>
        <details className="font-mono text-[10px] text-muted-foreground">
          <summary className="cursor-pointer hover:text-foreground">
            Daily numbers
          </summary>
          <ul className="mt-2 max-h-28 space-y-1 overflow-auto pr-2">
            {days.map((day) => (
              <li key={day.date} className="tabular-nums">
                {day.date}: {day.completed} done, {day.created} created
              </li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}

export function WeekStrip({ series }: { series: ExecutionDay[] }) {
  const days = series.slice(-7);
  const max = Math.max(1, ...days.map((day) => day.completed));
  const total = days.reduce((sum, day) => sum + day.completed, 0);

  return (
    <section
      aria-label="Focus this week"
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Focus this week
        </h2>
        <p className="font-display text-3xl leading-none tabular-nums">
          {total}
          <span className="ml-1 font-sans text-[11px] font-normal text-muted-foreground">
            done
          </span>
        </p>
      </div>
      <div className="mt-4 flex items-end gap-2" role="img" aria-label={`${total} tasks completed in the last 7 days`}>
        {days.map((day, index) => {
          const height = Math.max(8, (day.completed / max) * 96);
          const isToday = index === days.length - 1;
          return (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
              <motion.span
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ height, transformOrigin: "bottom" }}
                title={`${day.date}: ${day.completed} done`}
                className={cn(
                  "block w-full rounded-full",
                  isToday
                    ? "bg-gradient-to-t from-[var(--chart-1)] to-[var(--chart-2)]"
                    : "bg-[var(--chart-2)]/30",
                )}
              />
              <span className="font-mono text-[9px] text-muted-foreground">
                {day.label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 font-mono text-[10px] text-muted-foreground">
        Done per day · your rows only
      </p>
    </section>
  );
}
