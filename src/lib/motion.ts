import type { Transition, Variants } from "motion/react";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const motionDurations = {
  micro: 0.14,
  fast: 0.2,
  base: 0.28,
  reveal: 0.55,
  page: 0.24,
} as const;

export const springLift = {
  type: "spring",
  stiffness: 420,
  damping: 30,
  mass: 0.7,
} satisfies Transition;

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.reveal, ease: EASE_OUT },
  },
};
