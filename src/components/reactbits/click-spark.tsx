"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Adapted from React Bits "ClickSpark" (MIT + Commons Clause).
 * Copyright (c) 2026 David Haz. https://github.com/DavidHDev/react-bits
 * Reduced to a single composited canvas with reduced-motion opt-out.
 */
export function ClickSpark({
  children,
  className,
  color = "var(--color-primary)",
  count = 8,
  radius = 30,
  duration = 480,
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
  count?: number;
  radius?: number;
  duration?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const burstsRef = useRef<Array<{ x: number; y: number; start: number }>>([]);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  function draw() {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const rect = wrap.getBoundingClientRect();
    if (canvas.width !== Math.round(rect.width * ratio) || canvas.height !== Math.round(rect.height * ratio)) {
      canvas.width = Math.round(rect.width * ratio);
      canvas.height = Math.round(rect.height * ratio);
    }
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, rect.width, rect.height);

    const now = performance.now();
    const live: typeof burstsRef.current = [];
    for (const burst of burstsRef.current) {
      const elapsed = now - burst.start;
      if (elapsed >= duration) continue;
      live.push(burst);
      const progress = elapsed / duration;
      const fade = (1 - progress) ** 2;
      context.globalAlpha = fade;
      context.strokeStyle = color;
      context.lineWidth = 1.25;
      context.lineCap = "round";
      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count;
        const reach = radius * (0.35 + 0.65 * Math.min(1, elapsed / (duration * 0.45)));
        const x = burst.x + Math.cos(angle) * reach;
        const y = burst.y + Math.sin(angle) * reach;
        context.beginPath();
        context.moveTo(burst.x, burst.y);
        context.lineTo(x, y);
        context.stroke();
      }
    }
    burstsRef.current = live;
    if (live.length > 0) {
      rafRef.current = requestAnimationFrame(draw);
    }
  }

  function spawn(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    burstsRef.current.push({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      start: performance.now(),
    });
    if (burstsRef.current.length > 12) burstsRef.current.shift();
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);
  }

  return (
    <div
      ref={wrapRef}
      className={cn("relative inline-flex", className)}
      onPointerDown={spawn}
    >
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 size-full"
      />
    </div>
  );
}
