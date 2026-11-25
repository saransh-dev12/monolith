"use client";

import { animate, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

// Adapted from React Bits Count Up. See docs/third-party-attributions.md.
// Render the true value immediately; only animate a subsequent data change.
export function ProgressValue({ value }: { value: number }) {
  const number = useRef<HTMLSpanElement>(null);
  const previous = useRef(value);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const from = previous.current;
    previous.current = value;
    const element = number.current;
    if (!element) return;
    if (from === value || reducedMotion) {
      element.textContent = `${value}%`;
      return;
    }
    const controls = animate(from, value, {
      duration: 0.45,
      ease: "easeOut",
      onUpdate: (current) => {
        element.textContent = `${Math.round(current)}%`;
      },
      onComplete: () => {
        element.textContent = `${value}%`;
      },
    });
    return () => controls.stop();
  }, [value, reducedMotion]);

  return (
    <>
      <span className="sr-only">{value}%</span>
      <span ref={number} aria-hidden="true">
        {value}%
      </span>
    </>
  );
}
