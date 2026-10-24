"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";

import { EASE_OUT, motionDurations } from "@/lib/motion";

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      data-motion-route
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDurations.page, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
