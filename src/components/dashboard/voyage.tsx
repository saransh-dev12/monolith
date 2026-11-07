"use client";

import { useEffect, useRef, useState } from "react";

import { NumberTicker } from "@/components/ui/number-ticker";
import { gsap } from "@/lib/gsap";

export type VoyageStage = {
  label: string;
  count: number;
  /** Position along the path, 0..1 (by path length). */
  at: number;
};

/**
 * The voyage: your work's route from first to-do to done. The marker glides
 * along a curved path to the workspace's real completion percentage —
 * GSAP getPointAtLength + stroke-dasharray reveal, re-rating fluidly as
 * task states change (server data → new percent → glide).
 */
export function Voyage({
  percent,
  stages,
}: {
  percent: number;
  stages: VoyageStage[];
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const proxy = useRef({ L: 0 });
  const totalRef = useRef(0);
  const [nodes, setNodes] = useState<
    Array<{ label: string; count: number; left: number; top: number }>
  >(() => stages.map((stage) => ({ ...stage, left: 0, top: 0 })));

  useEffect(() => {
    const path = pathRef.current;
    const progress = progressRef.current;
    if (!path || !progress) return;
    totalRef.current = path.getTotalLength();

    setNodes(
      stages.map((stage) => {
        const point = path.getPointAtLength(totalRef.current * stage.at);
        return {
          ...stage,
          left: (point.x / 1000) * 100,
          top: (point.y / 140) * 100,
        };
      }),
    );

    const place = (L: number) => {
      const total = totalRef.current || 1;
      const point = path.getPointAtLength(L);
      const left = `${(point.x / 1000) * 100}%`;
      const top = `${(point.y / 140) * 100}%`;
      if (markerRef.current) {
        markerRef.current.style.left = left;
        markerRef.current.style.top = top;
      }
      if (chipRef.current) {
        // Keep the readable chip inside the panel at the extremes.
        chipRef.current.style.left =
          "clamp(3.5rem, " + left + ", calc(100% - 3.5rem))";
      }
      progress.style.strokeDasharray = `${L} ${total}`;
    };

    place((totalRef.current * percent) / 100);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = () => (totalRef.current * percent) / 100;

    if (reduce) {
      place(target());
      return () => {
        gsap.killTweensOf(proxy.current);
      };
    }

    const proxyObj = proxy.current;
    const tween = gsap.to(proxyObj, {
      L: target(),
      duration: 1.25,
      ease: "power2.inOut",
      onUpdate: () => place(proxyObj.L),
    });

    const onResize = () => place(proxyObj.L);
    window.addEventListener("resize", onResize);

    return () => {
      tween.kill();
      window.removeEventListener("resize", onResize);
    };
    // stages is server-provided per navigation; recompute nodes when it changes.
  }, [percent, stages]);

  return (
    <div
      className="relative h-[168px] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[inset_0_1px_0_0_rgb(255_255_255/4%)]"
      data-overflow-clip
      role="img"
      aria-label={`Workspace voyage: ${percent}% of your work is complete`}
    >
      <svg
        viewBox="0 0 1000 140"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="voyage-progress" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a92316" />
            <stop offset="100%" stopColor="#ff5429" />
          </linearGradient>
        </defs>
        {/* The route ahead: dashed ember hairline */}
        <path
          ref={pathRef}
          d="M -8 96 C 120 40, 240 108, 380 78 S 640 26, 760 64 S 950 118, 1008 60"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="2"
          strokeDasharray="3 7"
          strokeLinecap="round"
        />
        {/* The route traveled: solid ember gradient reveal */}
        <path
          ref={progressRef}
          d="M -8 96 C 120 40, 240 108, 380 78 S 640 26, 760 64 S 950 118, 1008 60"
          fill="none"
          stroke="url(#voyage-progress)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Stage nodes */}
      {/* Stage nodes on the path */}
      {nodes.map((node) => (
        <div
          key={node.label + "-dot"}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${node.left}%`, top: `${node.top}%` }}
        >
          <span className="block size-2.5 rounded-full border border-border bg-background shadow-[0_0_0_3px_var(--color-card)]" />
        </div>
      ))}

      {/* Stage labels: clamped so edge stages stay readable */}
      {nodes.map((node) => (
        <div
          key={node.label + "-label"}
          className="absolute -translate-x-1/2 text-center"
          style={{ left: `clamp(3rem, ${node.left}%, calc(100% - 3rem))`, top: "72%" }}
        >
          <p className="eyebrow whitespace-nowrap text-muted-foreground">
            {node.label}
          </p>
          <p className="num whitespace-nowrap text-[11px] text-foreground">
            {node.count}
          </p>
        </div>
      ))}

      {/* The marker + completion chip */}
      <div
        ref={markerRef}
        data-slot="voyage-marker"
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <span className="grid size-7 place-items-center rounded-full border border-primary/50 bg-card shadow-[0_0_0_4px_var(--color-card),0_8px_24px_-8px_var(--color-primary)]">
          <span className="size-2 rotate-45 rounded-[2px] bg-primary" />
        </span>
      </div>
      <div
        ref={chipRef}
        className="absolute z-10 -translate-x-1/2"
        style={{ top: "6%" }}
      >
        <div className="flex items-baseline gap-1 rounded-full border border-primary/40 bg-card/90 px-2.5 py-1 shadow-[0_8px_24px_-12px_var(--color-primary)] backdrop-blur-sm">
          <NumberTicker
            value={percent}
            key={percent}
            className="font-brand text-sm font-bold leading-none text-primary"
          />
          <span className="text-[10px] font-medium leading-none text-muted-foreground">
            % done
          </span>
        </div>
      </div>
    </div>
  );
}

