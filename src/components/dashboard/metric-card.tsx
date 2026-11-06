import type { LucideIcon } from "lucide-react";

import { MetricLift } from "@/components/dashboard/metric-lift";
import { NumberTicker } from "@/components/ui/number-ticker";
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
        <p className="eyebrow text-muted-foreground">
          {label}
        </p>
        <span
          className={cn(
            "grid size-9 place-items-center rounded-xl border",
            tone === "warning"
              ? "border-primary/40 bg-primary/12 text-primary"
              : "border-border bg-muted text-muted-foreground",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 font-brand text-4xl font-bold leading-none tracking-[-0.02em] text-foreground sm:text-5xl">
        <span className="sr-only">{`${label}: ${value}`}</span>
        <NumberTicker
          value={value}
          className="font-brand text-4xl font-bold leading-none tracking-[-0.02em] text-foreground sm:text-5xl"
          aria-hidden="true"
        />
      </p>
      <p
        className={cn(
          "mt-2 flex items-center gap-1.5 text-sm",
          tone === "warning"
            ? "text-primary"
            : "text-muted-foreground",
        )}
      >
        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
        {hint}
      </p>
    </MetricLift>
  );
}
