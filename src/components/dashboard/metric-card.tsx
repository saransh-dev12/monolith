import type { LucideIcon } from "lucide-react";

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
    <div className="bg-background p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
        <Icon
          className={
            tone === "warning"
              ? "size-3.5 text-amber-400"
              : "size-3.5 text-primary"
          }
          aria-hidden="true"
        />
      </div>
      <p className="mt-4 font-heading text-4xl leading-none tabular-nums tracking-[-0.01em]">
        {value}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
