"use client";

import { MotionConfig } from "motion/react";

import { EASE_OUT, motionDurations } from "@/lib/motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: motionDurations.panel, ease: EASE_OUT }}
    >
      {children}
    </MotionConfig>
  );
}
