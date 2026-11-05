# v1.0 execution audit

Phase 0 baseline for the v1.0 release directive. Evidence comes from direct
source inspection and executed local test runs on commit `061c8d4` — not from
README claims.

## Implemented functionality (verified locally)

- **Auth:** email/password signup, sign-in, sign-out, session refresh via
  `src/proxy.ts`, protected `/app` routes, auth callback exchange. e2e covers
  signup → empty workspace → sign-out and cross-user denial.
- **Projects:** create/edit/archive/restore/delete with confirmation dialogs,
  owner-scoped RLS, cascade deletes (pgTAP: 36 tests).
- **Tasks:** full CRUD, statuses (todo/in-progress/done), priorities, due
  dates, overdue derivation, milestone association, pagination below a
  200-row API cap.
- **Kanban:** dnd-kit drag with spring feedback, accessible status-select
  fallback, optimistic persistence with rollback on failure.
- **Milestones:** CRUD, completion pulse, project progress integration.
- **Command Center:** metrics, execution chart (7/14/30-day), focus week,
  next-up queue — all derived from owner-scoped rows.
- **AI planner:** prompt → structured draft → full review/edit surface →
  explicit confirm; atomic transactional save; per-user Postgres-enforced
  daily quota; Zod validation at both boundaries; honest disabled state when
  the provider is unconfigured.
- **UI (Ember Obsidian v2):** Fraunces/Syne/JetBrains Mono type system,
  dark-only tokens, Panel primitive, effect budget, full-page 3D monolith
  journey with reduced-motion/WebGL/no-IO fallbacks, grain + marquee +
  magnetic CTA + scroll progress.
- **Tests:** Vitest 40/40, Playwright 15/15, pgTAP 36/36 (local supabase),
  lint + typecheck + production build green.

## Partially implemented

- **Password recovery/reset:** Supabase hosted flow; requires production
  project + SMTP/allowlist configuration to verify end-to-end.
- **Account settings/deletion:** account menu exists (sign out); account
  deletion with data cleanup is **not** implemented — see Missing.

## Missing functionality (v1 directive gaps)

1. **Account deletion + data cleanup** (§4.2) — needs UI + API + RLS-safe
   cascade verification.
2. **Privacy policy and terms of service pages** (§4.1) — not present.
3. **First-run guided experience** — empty states exist and are useful, but
   there is no guided first-project creation flow (§4.1). Assess scope: the
   empty states may satisfy "useful" if reviewed; decide deliberately.
4. **Health check endpoint** (§8) — no `/api/health` route.
5. **Production error monitoring** (§8) — no Sentry/equivalent wired.
6. **Search/filter/sort on tasks** (§4.5) — work table has status/priority
   filters; full-text search and sorting are partial.

## Existing defects

- **CI red on main (fixed this commit):** the dark-only product decision
  broke `contrast.spec.ts`, which clicked the removed theme switcher.
  Updated to verify dark-only contrast; local e2e 15/15.
- **UTC date-only overdue nuance:** overdue derivation uses UTC day
  boundaries; documented in release notes as intended date semantics. No
  code change without a deliberate product decision.
- **Reveal IO starvation (fixed):** embedded/rAF-saturated environments
  could stall scroll reveals; hardened with fallback in this branch.

## Security concerns

- No secrets in client bundles (publishable URL/key only; service-role and
  OpenAI keys are server-only, verified in code paths).
- Same-origin checks on mutation routes; CSRF rejection tested.
- RLS on every exposed table, owner-scoped policies, explicit grants,
  pgTAP-verified.
- Rate limiting exists for planner (Postgres-enforced quota). General API
  rate limiting is not implemented — acceptable for v1 launch scale,
  documented.

## Production blockers

1. **Production Supabase project** — provisioning requires account
   authorization (`supabase login` or `SUPABASE_ACCESS_TOKEN`). Everything
   downstream (migrations, RLS verify, auth allowlist, env wiring, smoke
   test) depends on this.
2. **`OPENAI_API_KEY`** — live planner verification.
3. **Green CI on main** — fixed locally, pending the CI run for `061c8d4`.

## Required external configuration

- Vercel env vars: `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
  `NEXT_PUBLIC_SITE_URL`, optional `OPENAI_API_KEY`/`OPENAI_MODEL`/
  `PLANNER_DAILY_LIMIT`.
- Supabase auth: Site URL + `/auth/callback` redirect allowlist.

## Recommended implementation sequence

1. Provision production Supabase (unblocked by `supabase login`) → push
   migrations (review destructive ops; never seed) → verify schema/RLS →
   configure auth URLs → wire Vercel env vars → redeploy.
2. CI green confirmation on main.
3. Production smoke test with disposable account (27 steps in the
   directive).
4. Gap completion: privacy/terms pages, account deletion, health endpoint.
5. Live OpenAI planner verification.
6. Responsive sweep (320→1920) + cross-browser via Playwright.
7. Performance pass (Lighthouse + field data) and accessibility audit
   against WCAG 2.2 AA.
8. UAT with 5 independent testers.
9. Release documentation set + v1.0.0 tag + GitHub release.
