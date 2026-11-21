"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

/** A single, non-interactive line links the product's stages as the reader scrolls. */
export function ExecutionPath() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const length = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  const route = "M 900 0 C 900 200 950 350 900 500 S 150 800 150 1100 S 820 1400 820 1700 S 180 2000 180 2300 S 500 2700 500 3000";

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg className="hidden h-full w-full lg:block" viewBox="0 0 1000 3000" preserveAspectRatio="none" fill="none">
        <path d={route} stroke="var(--color-primary)" strokeOpacity="0.08" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <motion.path d={route} stroke="var(--color-primary)" strokeOpacity="0.38" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ pathLength: reduce ? 1 : length }} />
      </svg>
      <svg className="h-full w-full lg:hidden" viewBox="0 0 1000 3000" preserveAspectRatio="none" fill="none">
        <path d="M 20 0 V 3000" stroke="var(--color-primary)" strokeOpacity="0.08" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <motion.path d="M 20 0 V 3000" stroke="var(--color-primary)" strokeOpacity="0.32" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ pathLength: reduce ? 1 : length }} />
      </svg>
    </div>
  );
}
