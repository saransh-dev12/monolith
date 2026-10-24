"use client";

import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

import { springLift } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: {
  label: string;
  value: number;
  hint: string;
  icon: LucideIcon;
  tone?: "default" | "warning";
}) {
  return (
    <motion.div
      data-motion-lift
      whileHover={{ y: -5 }}
      transition={springLift}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-white/60">{label}</p>
        <span
          className={cn(
            "grid size-9 place-items-center rounded-xl border",
            tone === "warning"
              ? "border-amber-400/25 bg-amber-400/10 text-amber-300"
              : "border-primary/25 bg-primary/10 text-primary",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 font-heading text-4xl leading-none font-semibold tracking-[-0.01em] text-white tabular-nums">
        {value}
      </p>
      <p
        className={cn(
          "mt-2 flex items-center gap-1.5 text-sm",
          tone === "warning" ? "text-amber-300" : "text-muted-foreground",
        )}
      >
        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
        {hint}
      </p>
    </motion.div>
  );
}
