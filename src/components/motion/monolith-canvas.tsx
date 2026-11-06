"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Client-only entry for the page journey scene. Keeps three.js out of the
 * server payload, and defers mounting until the page has settled so WebGL
 * shader compilation never competes with first paint and reveals.
 */
const Scene = dynamic(() => import("./monolith-scene"), {
  ssr: false,
  loading: () => null,
});

export function MonolithCanvas() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Mount strictly AFTER the browser load event plus a settle period:
    // three.js module evaluation + shader compilation are long tasks that
    // would otherwise collide with LCP and inflate total blocking time.
    let timer: number | undefined;
    const start = () => {
      timer = window.setTimeout(() => setReady(true), 2500);
    };
    if (document.readyState === "complete") {
      start();
    } else {
      window.addEventListener("load", start, { once: true });
    }
    return () => {
      window.removeEventListener("load", start);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      id="site-3d"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-[1400ms] ease-out"
      style={{ opacity: ready ? 1 : 0 }}
    >
      {ready ? <Scene /> : null}
    </div>
  );
}
