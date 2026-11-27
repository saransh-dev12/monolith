# v1.0 feature matrix

> Historical assessment: the statuses and counts below describe earlier verification, not the current working tree or a release candidate. Reassess against the [ship checklist](v1-ship-checklist.md) and [evidence register](V1_EVIDENCE_REGISTER.md) before sign-off. Password recovery currently has no request/reset UI; SMTP configuration alone does not implement it. The live AI provider and current production configuration remain unverified.

Statuses: PASS (implemented and verified) · FAIL · BLOCKED (needs external
credentials/access) · NOT STARTED · DEFERRED (intentionally excluded).

Verification evidence sources: Playwright (local 25/25, production smoke 3/3),
Vitest 40/40, pgTAP 36/36, axe WCAG 2.2 AA audit (4/4 suites), Lighthouse
(perf 98 / a11y 100 / best-practices 100 / seo 90), CI run on `main`.

| Feature | Status | Verification |
| --- | --- | --- |
| Marketing landing — Ember Obsidian v2 + 3D monolith journey | PASS | e2e + visual review at 7 viewports |
| Sign-up / sign-in / sign-out / session refresh | PASS | e2e + production smoke |
| Protected `/app` routes, session cookies (httpOnly, chunked) | PASS | e2e + proxy tests |
| Password recovery / reset | NOT IMPLEMENTED | No recovery request/reset UI; launch scope and email configuration require a product decision and end-to-end verification |
| Project create / edit / archive / restore / delete | PASS | e2e + pgTAP |
| Task CRUD, priorities, due dates, overdue derivation | PASS | e2e + pgTAP |
| Kanban drag-and-drop + accessible status fallback | PASS | e2e drag + status-select tests |
| Milestone CRUD + completion + progress integration | PASS | e2e + pgTAP |
| Command Center metrics, execution chart, focus week, next-up | PASS | e2e (incl. 1,000+ task large-account spec) |
| AI planner draft → review → edit → confirm (atomic save) | PASS (mock provider, local) | vitest + e2e persistence gate |
| Live AI planner generation in production | BLOCKED | Needs `OPENAI_API_KEY` in Vercel env |
| Planner daily quota (Postgres-enforced) | PASS | pgTAP + API tests |
| Account deletion with full data cleanup | PASS | e2e + production smoke (cascade verified live) |
| Health endpoint `/api/health` | PASS | curl on production (200/503 paths) |
| Privacy Policy + Terms of Service | PASS | e2e + axe audit |
| Command palette (⌘K) | PASS | e2e |
| Dark-only Ember Obsidian theme | PASS | contrast e2e |
| Responsive layout (320→1920px, 10 routes × 7 viewports) | PASS | responsive e2e sweep |
| WCAG 2.2 AA (automated axe, critical+serious = 0) | PASS | accessibility e2e suite |
| Performance (Lighthouse: perf 98, LCP 1.3s, TBT 20ms, CLS 0) | PASS | Lighthouse on production |
| Production smoke (signup → core loop → persistence) | PASS | production-smoke.spec vs live site |
| Cross-browser (Safari/Firefox/Chrome mobile) | NOT STARTED | Playwright covers Chromium; WebKit/Firefox runs pending |
| UAT with 5 independent testers | NOT STARTED | Protocol in docs/user-acceptance-testing.md |
| Live-provider planner verification | BLOCKED | `OPENAI_API_KEY` |
| v1.0.0 tag + GitHub release | NOT STARTED | Gated on the two items above |

Deferred (§14 of the directive): teams/collaboration, billing, notifications,
recurring tasks, calendars, native apps, autonomous agents, planner history,
streaming, advanced analytics, social login, intra-column reordering.
