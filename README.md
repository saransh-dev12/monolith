# Monolith

**A project execution workspace.** Describe an idea, get an AI-drafted plan you review and edit, run the work on a Kanban board, and read progress derived from your own records — never fabricated.

**Live:** [monolith-navy.vercel.app](https://monolith-navy.vercel.app) · **Status:** V1 verification in progress. The live site may run an earlier commit; the current working tree has not been released or production-verified.

## Features

- **Auth** — email/password, cookie sessions, protected routes, account deletion with full data cascade
- **Projects** — create, edit, archive/restore, delete; progress computed from completed work
- **Tasks** — CRUD, priorities, due dates, overdue tracking; Kanban drag-and-drop with keyboard fallback and optimistic updates
- **Milestones** — full lifecycle, rolled into project progress
- **AI planner** — idea → structured draft (milestones + tasks) → edit → confirm; atomic save in one Postgres transaction; per-user daily quota; never writes before you confirm
- **Command Center** — project execution, upcoming work and activity derived from the account’s records
- **Security** — Row Level Security on every table, owner-scoped at the database level; Zod validation at every boundary; server-only secrets
- **Craft** — Ember Obsidian styling, command palette, keyboard navigation and reduced-motion support

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 + shadcn/ui · Supabase (Postgres + Auth) · Motion for React + GSAP · Three.js (landing journey) · dnd-kit · Zod · OpenAI SDK

Fonts: Fraunces (editorial display) · Syne (workspace) · Inter Tight (interface) · JetBrains Mono (metadata)

## Quickstart

Requires Node 22+, npm, Docker, and the [Supabase CLI](https://supabase.com/docs/guides/cli).

```bash
npm install
supabase start
cp .env.example .env.local   # fill values from `supabase start`
supabase db reset            # migrations + seed (local only)
npm run dev
```

Open `localhost:3000` and sign in with the seed account `demo@monolith.local` / `monolith-demo`.

### Environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | client | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | client | Publishable key (RLS enforces access) |
| `NEXT_PUBLIC_SITE_URL` | client | Canonical origin for auth redirects |
| `SUPABASE_SERVICE_ROLE_KEY` | **server** | Planner quota + account admin |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | **server** | AI plan generation (optional) |
| `PLANNER_DAILY_LIMIT` | server | Daily generations per user (default 5) |

Without OpenAI keys the planner states it's unconfigured — everything else works.

## Testing

```bash
npm run lint && npm run typecheck && npm test
supabase db reset && npm run test:db     # resets local database; never run against production
npm run test:e2e
```

The suites cover auth, CRUD, board persistence, user isolation, planner quota and atomicity, responsive behavior and automated accessibility checks. Coverage and historical reports do not establish release readiness: see the [evidence register](docs/V1_EVIDENCE_REGISTER.md) for results tied to a specific candidate and the [ship checklist](docs/v1-ship-checklist.md) for outstanding checks.

## Security model

- RLS on every table; `anon` has zero application-table access; ownership can't be transferred (update policies check both existing and resulting rows)
- Server actions derive identity from verified Supabase claims — client-supplied owner IDs are never trusted
- Planner quota reserved atomically in Postgres; failed provider calls release it; model output validated against Zod before use
- Service-role and OpenAI keys are intended for server-only use; verify the release bundle and deployment configuration before release

Known limitation: overdue checks compare date-only values against UTC — timezone-aware rules are out of v1 scope.

## Deployment

Full runbook: [docs/deployment.md](docs/deployment.md). Short version: create a Supabase project → `supabase db push` (never run the seed on production) → set the env vars in Vercel → deploy. Production configuration and the deployed commit must be verified separately for each release.

## Docs

[Design direction](docs/design-direction.md) · [architecture](docs/architecture.md) · [security audit](docs/v1-security-audit.md) · [QA report](docs/v1-qa-report.md) · [performance report](docs/v1-performance-report.md) · [feature matrix](docs/v1-feature-matrix.md) · [deployment](docs/deployment.md) · [changelog](CHANGELOG.md)

## Project structure

```text
src/
  app/            # public + (workspace) routes, API handlers, auth callback
  components/     # ui, shell, dashboard, board, planner, projects, motion, 3D
  lib/            # auth, data, planner, ai, supabase clients, motion tokens
  proxy.ts        # session refresh + route protection
supabase/         # migrations, tests (pgTAP), seed (local only)
tests/e2e/        # Playwright: workspace, responsive, a11y, production smoke
docs/             # design, audits, QA, performance, deployment
```

## License note

Third-party design sources and their licenses are catalogued in [docs/design-sources.md](docs/design-sources.md).
