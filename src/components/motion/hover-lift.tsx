"use client";

import { motion } from "motion/react";

import { springLift } from "@/lib/motion";

export function HoverLift({
  children,
  className,
  disabled = false,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <motion.div
      data-motion-lift
      className={className}
      whileHover={disabled ? undefined : { y: -5 }}
      transition={springLift}
    >
      {children}
    </motion.div>
  );
}
