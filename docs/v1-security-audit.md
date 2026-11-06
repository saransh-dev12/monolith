# v1.0 security audit

Scope: repository `main` at release-candidate commit, production deployment
`monolith-navy.vercel.app`, production project `tzdkxjiluwfyshwurtcj`.

## Database and authorization — PASS

- RLS enabled on every application table (`milestones`, `planner_usage`,
  `profiles`, `projects`, `tasks`) — verified by direct query against
  production, not by code inspection.
- 15 owner-scoped policies verified on production; isolation behavior is
  covered by 36 pgTAP tests locally (grants, cross-user denial, archive
  retention, cascade).
- Migrations applied in order on production; **no development seed executed
  against production** (verified: 0 users before launch smoke).
- Cascade deletes verified live during the account-deletion smoke.

## Authentication — PASS

- Sessions via `@supabase/ssr` httpOnly chunked cookies; refresh handled in
  `src/proxy.ts`; protected routes redirect unauthenticated requests.
- Server actions verify identity via `auth.getUser()` on every call.
- Account deletion uses the session-verified user id only — the admin client
  never accepts an identity from the request body.
- Duplicate email, invalid credentials, and unconfirmed-email paths return
  mapped, non-leaky messages.
- Email auto-confirm is enabled (product decision, documented); password
  reset requires SMTP and is currently unavailable — accounts are password
  + email only.

## Secrets — PASS

- Client bundle: only `NEXT_PUBLIC_*` values (project URL + publishable
  key). Verified by grep over the built output for `sb_secret` /
  `SERVICE_ROLE` / `OPENAI_API_KEY` — no matches.
- `SUPABASE_SERVICE_ROLE_KEY` (legacy service_role JWT) and
  `OPENAI_API_KEY` are server-only, read via `process.env` in
  `server-only` modules.
- Personal access tokens exist only in the local CLI session and were never
  committed. `.gitignore` covers `.env*` and `.vercel`.

## Input handling and API — PASS

- Zod schemas at every mutation boundary (auth, projects, tasks,
  milestones, planner).
- Route handlers return mapped, consistent error contracts; no stack traces
  in responses.
- Same-origin checks on state-changing routes; CSRF rejection covered by
  e2e.
- Planner: per-user Postgres-enforced daily quota, input length limits,
  structured-output validation, no database writes before explicit user
  confirmation.

## Known gaps (documented, acceptable for v1.0 launch scale)

- No generic API rate limiting beyond the planner quota (auth endpoints are
  rate-limited by Supabase).
- No runtime error monitoring service wired (Vercel logs accessible).
- Dependency audit run at install time; schedule a `npm audit` pass before
  tag.
