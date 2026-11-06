import type { Transition, Variants } from "motion/react";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Dashboard 2.0 interaction system. Durations follow the interaction spec:
 * buttons 100–120ms (CSS only), hover 150ms, menus 180ms, dialogs 240ms,
 * pages 300ms. Every overlay exits faster than it enters.
 */
export const motionDurations = {
  press: 0.1,
  hover: 0.15,
  menu: 0.18,
  dialog: 0.24,
  panel: 0.28,
  page: 0.3,
  reveal: 0.55,
} as const;

export const springLift = {
  type: "spring",
  stiffness: 420,
  damping: 30,
  mass: 0.7,
} satisfies Transition;

export const springPress = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.6,
} satisfies Transition;

export const pressFeedback = {
  whileTap: { scale: 0.97 },
} as const;

export const cardEntrance: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.panel, ease: EASE_OUT },
  },
};

export const overlayPop: Variants = {
  hidden: { opacity: 0, scale: 0.98, y: 6 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: motionDurations.menu, ease: EASE_OUT },
  },
};

/** Staggered list item: mount entrance + layout transitions on reorder. */
export const listItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: motionDurations.panel, ease: EASE_OUT },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
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
