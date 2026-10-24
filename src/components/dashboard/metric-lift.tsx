"use client";

import { motion } from "motion/react";

import { springLift } from "@/lib/motion";

export function MetricLift({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      data-motion-lift
      whileHover={{ y: -5 }}
      transition={springLift}
      className="glass-card h-full rounded-2xl p-6"
    >
      {children}
    </motion.div>
  );
}
