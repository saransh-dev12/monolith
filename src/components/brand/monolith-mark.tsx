import { cn } from "@/lib/utils";

export function MonolithMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-4", className)}
    >
      <rect x="3" y="3" width="4.5" height="18" rx="0.75" fill="currentColor" />
      <rect x="10" y="7.5" width="4.5" height="13.5" rx="0.75" fill="currentColor" />
      <rect
        x="17"
        y="12"
        width="4.5"
        height="9"
        rx="0.75"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  );
}

export function Wordmark({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "grid size-8 place-items-center rounded-md",
          inverted
            ? "bg-background text-primary"
            : "bg-primary text-primary-foreground",
        )}
      >
        <MonolithMark />
      </span>
      <span className="text-sm font-semibold tracking-[0.14em] uppercase">
        Monolith
      </span>
    </span>
  );
}
