# v1.0 performance report

Production URL: `https://monolith-navy.vercel.app` — Lighthouse 13
(mobile emulation: 4× CPU throttle, slow 4G), landing page.

## Scores and Core Web Vitals

| Metric | Before optimization | After | Target |
| --- | --- | --- | --- |
| Performance score | 45 | **98** | — |
| Largest Contentful Paint | 4.5 s | **1.3 s** | ≤ 2.5 s ✅ |
| Total Blocking Time | 9,810 ms | **20 ms** | (INP ≤ 200 ms ✅) |
| Cumulative Layout Shift | 0 | **0** | ≤ 0.1 ✅ |
| Accessibility / Best practices | 100 / 100 | 100 / 100 | ✅ |
| SEO | 90 | 90 | ✅ |

## What was fixed

1. **3D scene initialization collided with LCP.** The Three.js mount used
   `requestIdleCallback` with a 2.5 s timeout — on a busy main thread it
   fired mid-load, and module evaluation (≈600 KB) + WebGL shader compile
   became long tasks inside the measurement window (TBT 9.8 s).
   Fix: mount strictly after the `load` event plus a settle delay, with a
   1.4 s opacity fade-in. The 3D now decorates the page after it is
   interactive.
2. **Unused font weights.** Syne loaded 5 weights (UI uses 600–800 only)
   and JetBrains Mono 3 (uses 400/500). Trimmed — fewer font files, less
   competition for bandwidth during LCP.
3. **Fetch caching.** Server-side Supabase reads use `cache: "no-store"`
   after a production incident where an immediately-following project read
   intermittently returned stale emptiness.

## Remaining notes

- The performance score is measured on the landing page (the heaviest
  route). Workspace routes are function-driven and lighter; the 3D bundle
  is never loaded outside the marketing route.
- Lighthouse synthetic runs are not field data; real-user CWV should be
  collected from Vercel Speed Insights after launch traffic accrues.
- INP is approximated by TBT in lab runs; the constant rAF loop keeps
  frames well under 50 ms after the fixes.
