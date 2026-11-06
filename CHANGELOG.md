# Changelog

## 1.0.0-rc1 — 2026-11-07

Release candidate deployed to production: `https://monolith-navy.vercel.app`

### Added
- Ember Obsidian v2 UI system: Fraunces editorial display, Syne workspace
  display/numerals, single metadata style, solid Panel primitive, dark-only
  tokens.
- Full-page 3D monolith journey on the landing page (Three.js/R3F):
  keyframed hero → workflow → tour → CTA payoff, shards and dust, pointer
  parallax, WebGL/reduced-motion/load-time guards.
- Health endpoint (`GET /api/health`).
- Account deletion with full database cascade.
- Privacy Policy and Terms of Service.
- Production deployment on Vercel (free tier) with a provisioned Supabase
  PostgreSQL project (Mumbai, free tier), migrations applied, RLS verified.

### QA
- Playwright e2e: 25/25 local, 3/3 production smoke (signup, core loop,
  account deletion).
- Vitest 40/40, pgTAP 36/36, lint/typecheck/build/CI green.
- Responsive sweep: 10 routes × 7 viewports, zero overflow.
- WCAG 2.2 AA automated audit: 0 critical/serious violations.
- Lighthouse: performance 98, accessibility 100, best practices 100,
  SEO 90; LCP 1.3s, TBT 20ms, CLS 0.

### Fixed
- Stale server-side reads immediately after create (no-store on Supabase
  fetches).
- IntersectionObserver starvation fallback for scroll reveals.
- Service-role admin operations use the legacy JWT key (GoTrue admin routes
  reject asymmetric secret keys).

### Known limitations
- Live AI planner generation requires a production `OPENAI_API_KEY`.
- Password-reset emails require SMTP; accounts use auto-confirm until
  configured.
- Cross-browser verification is Chromium-based; WebKit/Firefox queued.
