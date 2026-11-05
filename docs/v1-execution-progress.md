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
| CI green on main | In progress | `tests/e2e/contrast.spec.ts` fixed for dark-only | Local e2e 15/15 | Pending CI run | CI red pre-fix | run 42114959054 | — |
| Production Supabase provisioning | **Blocked** | — | — | — | — | — | Needs `supabase login` (user account authorization) |
| Production env wiring (Vercel) | Blocked | — | — | — | — | — | Supabase project URL + keys |
| Production smoke test (27 steps) | Not started | — | — | — | — | — | Supabase + OpenAI credentials |
| Live OpenAI generation test | Not started | — | — | — | — | — | `OPENAI_API_KEY` |
| UAT (5 independent testers) | Not started | — | — | — | — | — | Production deployment |
| v1.0.0 tag + GitHub release | Not started | — | — | — | — | — | All gates green |
