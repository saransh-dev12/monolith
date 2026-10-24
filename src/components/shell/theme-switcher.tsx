"use client";

import { motion } from "motion/react";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Laptop },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const active = mounted ? (theme ?? "system") : "system";

  return (
    <div
      role="group"
      aria-label="Appearance"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-border/70 bg-muted/50 p-0.5",
        compact && "p-0.5",
      )}
    >
      {options.map((option) => {
        const selected = active === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            aria-pressed={selected}
            title={`${option.label}${option.value === "system" ? ` (currently ${resolvedTheme ?? "unknown"})` : ""}`}
            className={cn(
              "relative flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium transition-colors",
              selected
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
              compact && "px-1.5",
            )}
          >
            {selected ? (
              <motion.span
                layoutId="theme-switcher-pill"
                transition={{ type: "spring", stiffness: 500, damping: 36 }}
                className="absolute inset-0 rounded-full bg-card shadow-sm ring-1 ring-border/60"
                aria-hidden="true"
              />
            ) : null}
            <option.icon className="relative size-3.5" aria-hidden="true" />
            {!compact ? (
              <span className="relative">{option.label}</span>
            ) : (
              <span className="sr-only">{option.label}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
