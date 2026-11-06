# v1.0 QA report

All results below are from executed runs on release-candidate commit
`20e9c38` (local) and the production deployment `monolith-navy.vercel.app`.

## Automated test results

| Suite | Command | Result |
| --- | --- | --- |
| Lint | `npm run lint` | PASS (0 errors) |
| Types | `npm run typecheck` | PASS |
| Unit | `npm test` | PASS — 40/40 |
| Production build | `npm run build` | PASS |
| Database (pgTAP, local stack) | `supabase test db` | PASS — 36/36 |
| E2E — Chromium (local stack) | `npm run test:e2e` | PASS — 25/25 (3 production-only skipped) |
| E2E — production smoke | `SMOKE_EMAIL=… playwright test production-smoke` vs live site | PASS — 3/3 (signup, account deletion, core loop) |
| CI on `main` | GitHub Actions | PASS — run `42275662834` |

## E2E coverage summary

- **Auth:** signup → empty workspace → sign out; invalid credentials;
  duplicate signup; account deletion (credentials die afterward); protected
  routes redirect; command palette navigation.
- **Projects:** create (dashboard + index), project detail rendering.
- **Tasks:** create via dialog, status change via accessible select, toast
  feedback, reload persistence, drag-and-drop movement with persistence,
  reduced-motion drag fallback.
- **Milestones:** rendered on project detail with completion state.
- **Planner:** renders; persistence only after explicit confirmation.
- **Large accounts:** 1,000+ tasks — dashboard totals, project row, board
  column, chart remain correct (local fixture, cleaned up).
- **Production (live):** signup → core loop → status persistence → sign
  back in; account deletion with cascade verified against the live database.

## Responsive sweep

10 routes (/, /login, /signup, /privacy, /terms, /app, /app/projects,
/app/projects/[id], /app/board, /app/planner) × 7 viewports
(320, 375, 430, 768, 1366, 1440, 1920): zero horizontal page overflow, zero
clipped/trapped elements. Fixes made during the sweep: header CTA collapse
below 400px, `min-w-0` on workflow-story cards, decorative beam/marquee
marked as intentional overflow, long eyebrow labels hidden below `sm`.

## Accessibility audit (axe-core, WCAG 2.0–2.2 A/AA tags)

Result after fixes: **0 critical/serious violations** across landing, auth,
legal, and all five workspace routes.

Fixed during the audit:
- `color-contrast` — faded text opacities (`/40–/70`) raised to passing
  values (muted→/80, foreground→/70) across production surfaces.
- `aria-prohibited-attr` — metric value `aria-label` on `<p>` replaced with
  visually-hidden text.
- `label-content-name-mismatch` — command palette trigger and account menu
  trigger accessible names now include/derive from visible text; decorative
  ⌘K hint hidden from assistive technology.

Manual keyboard checks: tab order, focus rings visible, dialog focus traps
(Radix), drag-and-drop has a keyboard-accessible status select alternative.
Screen-reader pass pending as part of UAT.

## Known limitations

- Password-reset emails require SMTP configuration (see deployment guide);
  until then, sign-ins rely on auto-confirm.
- Cross-browser runs are Chromium-based; WebKit/Firefox runs are queued.
- axe automated checks do not cover cognitive accessibility; the UAT pass
  observes real users for that.
