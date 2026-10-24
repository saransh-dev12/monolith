import type { LucideIcon } from "lucide-react";

import { MetricLift } from "@/components/dashboard/metric-lift";
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
    <MetricLift>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span
          className={cn(
            "grid size-9 place-items-center rounded-xl border",
            tone === "warning"
              ? "border-amber-600/30 bg-amber-500/10 text-amber-600 dark:text-amber-300"
              : "border-primary/30 bg-primary/10 text-primary",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 font-heading text-4xl leading-none font-semibold tracking-[-0.01em] text-foreground tabular-nums">
        {value}
      </p>
      <p
        className={cn(
          "mt-2 flex items-center gap-1.5 text-sm",
          tone === "warning"
            ? "text-amber-700 dark:text-amber-300"
            : "text-muted-foreground",
        )}
      >
        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
        {hint}
      </p>
    </MetricLift>
  );
}
