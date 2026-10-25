"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { gsap, ScrollTrigger } from "@/lib/gsap";

type SmoothScrollProps = {
  children: React.ReactNode;
  lerp?: number;
};

export function SmoothScroll({ children, lerp = 0.1 }: SmoothScrollProps) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ScrollTrigger.refresh();
      return;
    }

    let active = true;
    const lenis = new Lenis({
      lerp,
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
      stopInertiaOnNavigate: true,
    });

    const onScroll = () => ScrollTrigger.update();
    const onTick = (time: number) => lenis.raf(time * 1000);
    const refresh = () => {
      if (active) ScrollTrigger.refresh();
    };
    const resize = () => lenis.resize();

    lenis.on("scroll", onScroll);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.addEventListener("refresh", resize);
    window.addEventListener("load", refresh);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    document.fonts?.ready.then(refresh).catch(() => {});

    return () => {
      active = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
      ScrollTrigger.removeEventListener("refresh", resize);
      gsap.ticker.remove(onTick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [lerp]);

  return <>{children}</>;
}
