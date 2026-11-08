# Monolith

**A project execution workspace.** Describe an idea, get an AI-drafted plan you review and edit, run the work on a Kanban board, and read progress derived from your own records — never fabricated.

**Live:** [monolith-navy.vercel.app](https://monolith-navy.vercel.app) · **Status:** v1.0 release candidate — CI green, production smoke-tested.

## Features

- **Auth** — email/password, cookie sessions, protected routes, account deletion with full data cascade
- **Projects** — create, edit, archive/restore, delete; progress computed from completed work
- **Tasks** — CRUD, priorities, due dates, overdue tracking; Kanban drag-and-drop with keyboard fallback and optimistic updates
- **Milestones** — full lifecycle, rolled into project progress
- **AI planner** — idea → structured draft (milestones + tasks) → edit → confirm; atomic save in one Postgres transaction; per-user daily quota; never writes before you confirm
- **Command Center** — the Voyage (GSAP path-follow completion signature), live metrics, execution chart, overdue/deadline attention panel, recent activity
- **Security** — Row Level Security on every table, owner-scoped at the database level; Zod validation at every boundary; server-only secrets
- **Craft** — dark-only Ember Obsidian design, full-page 3D monolith journey, ⌘K command palette, ⌘1–4 navigation, WCAG 2.2 AA automated pass, reduced-motion support

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
supabase db reset && npm run test:db     # 36 pgTAP tests
npm run test:e2e                          # 27 Playwright tests
```

Covers: auth flows, CRUD, board persistence, cross-user denial, CSRF rejection, planner quota + atomicity, 1,000+ task large accounts, responsive sweep (10 routes × 7 viewports), WCAG 2.2 AA axe audit. CI runs all of it — see [docs/v1-qa-report.md](docs/v1-qa-report.md).

## Security model

- RLS on every table; `anon` has zero application-table access; ownership can't be transferred (update policies check both existing and resulting rows)
- Server actions derive identity from verified Supabase claims — client-supplied owner IDs are never trusted
- Planner quota reserved atomically in Postgres; failed provider calls release it; model output validated against Zod before use
- No secrets in client bundles; service-role and OpenAI keys are server-only

Known limitation: overdue checks compare date-only values against UTC — timezone-aware rules are out of v1 scope.

## Deployment

Full runbook: [docs/deployment.md](docs/deployment.md). Short version: create a Supabase project → `supabase db push` (never run the seed on production) → set the env vars in Vercel → deploy. Live instance runs on Vercel (free tier) + Supabase (free tier).

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
