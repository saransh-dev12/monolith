"use client";

import { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Adapted from React Bits "SpotlightCard" (MIT + Commons Clause).
 * Copyright (c) 2026 David Haz. https://github.com/DavidHDev/react-bits
 * The pointer loop is replaced with CSS variables so routine surfaces stay
 * on the compositor and respect reduced motion.
 */
export function SpotlightSurface({
  children,
  className,
  color = "var(--color-chart-1)",
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePointer(event: React.PointerEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node || disabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    node.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    node.style.setProperty("--spot-opacity", "0.8");
  }

  function handleLeave() {
    ref.current?.style.setProperty("--spot-opacity", "0");
  }

  return (
    <div
      ref={ref}
      className={cn("spotlight-surface", className)}
      style={{ "--spot-color": color } as React.CSSProperties}
      onPointerMove={handlePointer}
      onPointerLeave={handleLeave}
      onBlurCapture={handleLeave}
    >
      {children}
    </div>
  );
}
