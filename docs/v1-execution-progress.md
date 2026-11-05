# v1.0 execution progress

Living tracker for the v1.0 release directive. Status vocabulary:
`Not started` / `In progress` / `Implemented` / `Verified (local)` /
`Verified (production)` / `Blocked`.

IMPLEMENTED ≠ VERIFIED. VERIFIED LOCALLY ≠ VERIFIED IN PRODUCTION.

| Feature | Status | Implementation | Tests | Results | Defects | Evidence | Blockers |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Marketing landing (Ember Obsidian v2 + 3D journey) | Verified (local) | `src/app/page.tsx`, `src/components/marketing/*`, `src/components/motion/monolith-scene.tsx` | e2e 15/15, contrast spec updated for dark-only | Pass | None open | Playwright run 2026-11-06 | — |
| Auth: signup / signin / signout / session refresh | Verified (local) | `src/lib/auth/*`, `src/app/(public)/*`, `src/app/auth/callback` | e2e workspace suite (signup → empty state → signout), pgTAP grants | Pass | None open | Playwright 15/15 local | Production Supabase project |
| Password recovery / reset | In progress | Supabase hosted flow; allowlist must be set on production project | e2e pending | Not run in production | — | — | Production project + SMTP config |
| Command Center metrics | Verified (local) | `src/lib/data/projects.ts`, `src/components/dashboard/*` | e2e + vitest planner/data suites | Pass | Date-boundary UTC nuance documented in release notes | Playwright 15/15 | — |
| Projects CRUD + archive/restore/delete | Verified (local) | `src/app/api/projects/*`, `src/components/projects/*` | e2e + pgTAP | Pass | None open | Playwright 15/15 | — |
| Tasks CRUD + statuses + board DnD | Verified (local) | `src/app/api/tasks/*`, `src/components/board/board.tsx` | e2e drag/persistence spec, keyboard fallback | Pass | None open | Playwright 15/15 | — |
| Milestones | Verified (local) | `src/components/milestones/*`, API routes | e2e + pgTAP | Pass | None open | Playwright 15/15 | — |
| AI planner (generate → review → confirm) | Implemented | `src/lib/planner/*`, `src/lib/ai/*`, `src/components/planner/*` | vitest transform/data suites; e2e persistence gate | Pass (mock provider) | Live-provider run pending | vitest 40/40 | `OPENAI_API_KEY` in production |
| Dark-only theme (product decision) | Verified (local) | `globals.css`, `layout.tsx`, switchers deleted | contrast e2e (dark + hover) | Pass | None | Playwright | — |
| CI green on main | Verified | `tests/e2e/contrast.spec.ts` fixed for dark-only | Full CI run | Pass (run 42118438700) | None | gh run list | — |
| Production Supabase provisioning | Verified (production) | Org `monolith-org`, project `monolith-prod` (`tzdkxjiluwfyshwurtcj`, Mumbai, free tier) | 4 migrations pushed, RLS + 15 owner-scoped policies queried via Management API | ACTIVE_HEALTHY, all RLS on | — | CLI + API output 2026-11-06 | — |
| Production env wiring (Vercel) | Verified (production) | 4 env vars set (project scope) | Redeploy + live check | 200s on landing/login | — | vercel deploy logs | — |
| Production smoke (auth + core loop) | Verified (production) | `tests/e2e/production-smoke.spec.ts` | signup → workspace → sign out; sign in → project → task → status change → reload persistence → sign back in | 2/2 pass on `monolith-navy.vercel.app` | None | Playwright output 2026-11-06 | — |
| Auth auto-confirm decision | Decided + documented | `mailer_autoconfirm=true` — built-in mailer rate limit (2/h) blocks confirmation emails without SMTP | signup e2e | Pass | Password-reset emails unavailable until SMTP is configured | Management API config read | Optional SMTP for email flows |
| Disposable test data cleanup | Verified | Deleted all `prod-smoke-*`/`raw-probe-*` users via SQL cascade | users 0, projects 0, profiles 0 after | Clean | — | Management API output | — |
| AI planner (generate → review → confirm) | Implemented | `src/lib/planner/*`, `src/lib/ai/*` | vitest transform/data suites; e2e persistence gate | Pass (mock provider) | Live-provider run pending | vitest 40/40 | `OPENAI_API_KEY` in production |
| UAT (5 independent testers) | Not started | — | — | — | — | — | Manual coordination |
| v1.0.0 tag + GitHub release | Not started | — | — | — | — | — | Remaining directive phases |
