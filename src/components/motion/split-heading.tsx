"use client";

import { useEffect, useRef } from "react";

import { gsap, SplitText } from "@/lib/gsap";

type SplitHeadingProps = {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
  stagger?: number;
  label?: string;
};

export function SplitHeading({
  children,
  className,
  as = "h1",
  delay = 0.12,
  stagger = 0.028,
  label,
}: SplitHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let split: SplitText | null = null;
    let context: gsap.Context | null = null;

    const run = () => {
      if (cancelled || !node.isConnected) return;
      split = new SplitText(node, {
        type: "lines,words",
        mask: "lines",
        aria: label ? "none" : "auto",
      });
      context = gsap.context(() => {
        gsap.from(split?.words ?? [], {
          yPercent: 118,
          opacity: 0,
          rotate: 1.5,
          duration: 0.95,
          ease: "power4.out",
          stagger,
          delay,
        });
      }, node);
    };

    if (document.fonts?.status === "loaded") {
      run();
    } else {
      document.fonts?.ready.then(run).catch(run);
    }

    return () => {
      cancelled = true;
      context?.revert();
      split?.revert();
    };
  }, [delay, stagger, label]);

  const props = { ref, className, "aria-label": label };

  if (as === "h2") return <h2 {...props}>{children}</h2>;
  if (as === "h3") return <h3 {...props}>{children}</h3>;
  return <h1 {...props}>{children}</h1>;
}
