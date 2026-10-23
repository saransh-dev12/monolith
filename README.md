# Monolith

Monolith is an AI-assisted project execution workspace for students, individual developers, indie hackers, and small teams. It turns a project idea into milestones and tasks, keeps the work visible, and shows progress derived from real records.

**Current status: MVP v1.0 in progress.** The Day 1 foundation is implemented and verified locally: application scaffold, database schema with row level security, email/password authentication, protected routes, project and task CRUD, an accessible Kanban board, and basic Command Center metrics. The AI planner, milestone editing, CI, and production deployment are not shipped yet.

The public repository is [github.com/saransh-dev12/monolith](https://github.com/saransh-dev12/monolith). Work is tracked in the **MVP v1.0** milestone (issues #1–#10).

## What works now

- Email/password sign up, sign in, sign out, email callback handling, and cookie-backed Supabase sessions.
- Protected `/app` routes plus identity checks repeated in every API handler and data module.
- Profiles, projects, tasks, and milestones with constraints, indexes, `updated_at` triggers, explicit grants, and owner-scoped RLS.
- Project create, edit, archive, restore, and permanent delete (cascade to tasks and milestones).
- Task create, edit, delete, and status changes. Board and task-list status moves persist after reload and work with a keyboard.
- Command Center metrics for active projects, open tasks, completed tasks, and overdue tasks, all derived from the signed-in user's rows.
- Responsive dark shell with desktop/mobile navigation, empty/loading/error states, visible focus, and reduced-motion handling.
- Runtime validation with Zod, same-origin checks on mutation handlers, and safe error responses that do not leak database details.
- pgTAP database tests for ownership, RLS denial, grants, constraints, archival, and cascade behavior.

## Not shipped yet

- AI plan generation and confirmed persistence (issue #8, Day 2).
- Milestone create/edit/complete flows. Milestones are currently displayed read-only on the project page (issue #6).
- CI pipeline, production Supabase/Vercel setup, screenshots, and release notes (issues #9–#10, Day 3).
- Pointer drag-and-drop, social sign-in, planner history, and richer dashboard charts.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.4.3 (App Router, Turbopack), React 19.3.0, TypeScript 5.9.3 |
| Styling | Tailwind CSS 4.3.3, shadcn/ui primitives, Lucide icons |
| Data and auth | Supabase Postgres, Supabase Auth, `@supabase/ssr` 0.12.7 |
| Validation | Zod 4.6.7 |
| Runtime | Node.js 22+ (verified on Node 26.5.0), npm 11 |

Direct dependency versions are pinned in `package.json`; `package-lock.json` is committed.

## Local setup

Prerequisites: Node.js 22+, npm, Docker (for the Supabase local stack), and the Supabase CLI.

```bash
npm install
supabase start
```

Copy `.env.example` to `.env.local` and use the values printed by `supabase start`:

```bash
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<local publishable key>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
OPENAI_API_KEY=placeholder
OPENAI_MODEL=placeholder
```

Then reset the database (applies migrations and the local seed) and start the app:

```bash
supabase db reset
npm run dev
```

Open <http://localhost:3000>. The local seed creates two fictional accounts:

| Account | Password | Data |
| --- | --- | --- |
| `demo@monolith.local` | `monolith-demo` | Two projects with tasks and milestones |
| `second@monolith.local` | `monolith-demo` | One private project |

`supabase/seed.sql` runs only on local reset. Never apply it to a production project.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable/anon key; RLS still enforces access |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used for auth redirects and metadata |
| `OPENAI_API_KEY` | Server-only key for the planned planner; unused today |
| `OPENAI_MODEL` | Server-only model identifier; unused today |

Never prefix the OpenAI key with `NEXT_PUBLIC_`.

## Database and security model

- Migrations: `supabase/migrations/20261024000000_initial_schema.sql`
- Local seed: `supabase/seed.sql` (fictional data only)
- RLS tests: `supabase/tests/rls.test.sql`

Every exposed table has RLS enabled and explicit grants. `anon` has no application table access. `authenticated` gets only the operations it needs. Project ownership is enforced directly; task and milestone policies use an `EXISTS` check against the owning project. Updates check both the existing row and the resulting row, so ownership cannot be transferred.

A trigger on `auth.users` creates the matching `profiles` row using a `SECURITY DEFINER` function with an empty search path. Server handlers derive the user from verified Supabase claims and never trust a client-supplied owner ID. Database constraints reject blank names, invalid status/priority values, negative positions, and target dates before start dates.

Known limitation: overdue calculations compare date-only values against the current UTC date. Timezone-aware overdue rules are a Day 2 refinement.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Product overview |
| `/login`, `/signup` | Public | Email/password auth |
| `/auth/callback` | Public | Supabase code/token exchange |
| `/app` | Authenticated | Command Center |
| `/app/projects` | Authenticated | Active/archived project list |
| `/app/projects/[projectId]` | Authenticated, owner only | Tasks, milestones, project controls |
| `/app/board` | Authenticated | Kanban board with persistent status moves |
| `/api/projects/*`, `/api/tasks/*` | Authenticated | Validated JSON mutations |

`src/proxy.ts` refreshes sessions and performs an optimistic redirect for `/app` and auth pages. Layout guards are navigation behavior only; handlers and RLS remain the security boundary.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
supabase db reset
supabase test db
```

The database tests assume a freshly reset local database. They cover:

- Owner-scoped reads for projects, tasks, milestones, and profiles.
- Cross-user update/delete attempts affecting zero rows.
- Cross-user inserts rejected by RLS.
- Direct profile inserts denied; own profile updates allowed.
- Date constraint enforcement, archive retention, cascade delete, and grant matrix.

End-to-end browser checks were run against the local stack for login, signup, project/task creation, status persistence, archive/restore, cross-user denial, CSRF origin rejection, sign-out, and mobile layouts. Those checks are not yet committed as a CI suite; that is issue #9.

## Project structure

```text
src/
  app/
    (public)/            # login, signup, shared auth layout
    (workspace)/app/     # protected shell, dashboard, projects, board
    api/                 # validated route handlers
    auth/callback/       # Supabase session exchange
  components/
    auth/ board/ dashboard/ projects/ shared/ shell/ tasks/ ui/
  lib/
    api/ auth/ client/ data/ supabase/ validation/
  proxy.ts               # session refresh and optimistic route protection
supabase/
  config.toml
  migrations/
  seed.sql
  tests/
```

## Official references

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js Proxy](https://nextjs.org/docs/app/getting-started/proxy)
- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [shadcn/ui with Next.js](https://ui.shadcn.com/docs/installation/next)
- [Supabase SSR authentication](https://supabase.com/docs/guides/auth/server-side)
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase testing with pgTAP](https://supabase.com/docs/guides/database/testing)
- [OpenAI text generation and Responses API](https://developers.openai.com/api/docs/guides/text)
- [Vercel environments](https://vercel.com/docs/deployments/environments)
