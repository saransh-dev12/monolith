"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

import {
  EASE_OUT,
  fadeUp,
  motionDurations,
  staggerContainer,
} from "@/lib/motion";

/**
 * Reveal on scroll. Uses its own IntersectionObserver plus a fallback:
 * some embedded/rendering-starved environments never deliver IO callbacks
 * while a continuous rAF loop (the 3D scene) saturates the frame budget —
 * there the timeout reveals anything already on screen.
 */
function useRevealed(ref: React.RefObject<HTMLElement | null>) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let observer: IntersectionObserver | undefined;
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer?.disconnect();
          }
        },
        { rootMargin: "-80px" },
      );
      observer.observe(el);
    } catch {
      // IO unavailable — the fallback below carries it.
    }

    const fallback = window.setTimeout(() => {
      if (el.getBoundingClientRect().top < window.innerHeight * 1.1) {
        setShown(true);
      }
    }, 1100);

    return () => {
      observer?.disconnect();
      window.clearTimeout(fallback);
    };
  }, [ref]);

  return shown;
}

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useRevealed(ref);

  return (
    <motion.div
      ref={ref}
      data-motion-reveal
      className={className}
      initial="hidden"
      animate={shown ? "show" : "hidden"}
      variants={fadeUp}
      transition={{ duration: motionDurations.reveal, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useRevealed(ref);

  return (
    <motion.div
      ref={ref}
      data-motion-reveal
      className={className}
      initial="hidden"
      animate={shown ? "show" : "hidden"}
      variants={staggerContainer}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div data-motion-reveal className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
