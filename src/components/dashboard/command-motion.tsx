"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, useGSAP } from "@/lib/gsap";

export function CommandMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-command-progress]", {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.65,
          ease: "power2.out",
          clearProps: "transform",
        });
      });
      return () => media.revert();
    },
    { scope },
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    const sync = () => {
      lenis?.destroy();
      lenis = undefined;
      if (!media.matches) {
        lenis = new Lenis({
          autoRaf: true,
          smoothWheel: true,
          syncTouch: false,
          allowNestedScroll: true,
          prevent: (node) =>
            Boolean(node.closest('[role="dialog"], [data-lenis-prevent]')),
        });
      }
    };
    sync();
    media.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      lenis?.destroy();
    };
  }, []);

  return <div ref={scope}>{children}</div>;
}
