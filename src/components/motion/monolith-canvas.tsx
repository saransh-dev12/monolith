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
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    let idle: number;
    if (typeof w.requestIdleCallback === "function") {
      idle = w.requestIdleCallback(() => setReady(true), { timeout: 2500 });
    } else {
      idle = window.setTimeout(() => setReady(true), 1200);
    }
    return () => {
      if (typeof w.cancelIdleCallback === "function" && idle) {
        w.cancelIdleCallback(idle);
      } else {
        window.clearTimeout(idle);
      }
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
