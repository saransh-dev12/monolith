"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";

import { EASE_OUT, motionDurations } from "@/lib/motion";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-motion-route
      key={pathname}
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDurations.page, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
