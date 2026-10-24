# Monolith

Monolith is a project-execution workspace for students, solo developers, indie hackers, and small teams. It turns an idea into milestones and tasks, keeps the work visible on a board, and shows progress derived from stored records. AI can draft a plan, but nothing is saved until the user reviews and confirms it.

**Current status:** v1 core is implemented and verified locally. Authentication, owner-scoped data, project/task/milestone CRUD, drag-and-drop Kanban, dashboard metrics, the reviewed AI-planning workflow, the dark interface, revised typography, and the motion system are in place. Production deployment is not configured; the OpenAI key in this environment is a placeholder, so live model output has not been verified here.

The public repository is [github.com/saransh-dev12/monolith](https://github.com/saransh-dev12/monolith). Work is tracked in the **MVP v1.0** milestone.

## Product scope

### Implemented

- Email/password sign-up, sign-in, sign-out, callback exchange, cookie-backed sessions, and protected `/app` routes.
- Profiles, projects, tasks, and milestones with constraints, indexes, `updated_at` triggers, explicit grants, and owner-scoped RLS.
- Project create, edit, archive, restore, and permanent delete (cascades to tasks and milestones).
- Task create, edit, delete, priority, due date, and status changes.
- Milestones with create, edit, complete/reopen, target dates, and delete. Project progress combines completed tasks and milestones.
- Kanban board with drag-and-drop between columns, a status-select fallback for keyboard users, optimistic movement, and persistence after reload.
- Command Center with real active/open/completed/overdue metrics, project progress, and a due-ordered “Next up” list.
- AI planner: server-only generation, per-user daily quota, editable preview, explicit confirmation, and atomic persistence in one Postgres transaction.
- Responsive dark interface with layered graphite surfaces, a collapsible shadcn sidebar, mobile sheet, keyboard command palette, visible focus, reduced-motion support, skip links, empty/loading/error states, and confirmation dialogs.
- Runtime Zod validation, same-origin checks on mutations, safe error mapping, and no secret exposure to the browser.
- 20 Vitest unit tests, 36 pgTAP database tests, and 10 Playwright browser flows. A GitHub Actions workflow runs lint, typecheck, unit tests, build, database tests, and browser tests.

### Not included in v1

- Teams, collaboration, permissions, notifications, billing, recurring tasks, calendars, mobile apps, or advanced analytics.
- Drag-to-reorder inside a column. Dragging changes status; the select control remains the accessible fallback.
- Streaming AI responses, planner history, social login, or a task-detail side panel.
- A production deployment. Vercel/Supabase production credentials are not available in this environment.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.4.3 (App Router, Turbopack), React 19.3.0, TypeScript 5.9.3 |
| Styling | Tailwind CSS 4.3.3, shadcn/ui primitives, Lucide icons |
| Typography | Fraunces display, Plus Jakarta Sans UI, JetBrains Mono metadata |
| Motion | Motion for React 14.6.0 with shared variants and reduced-motion fallbacks |
| Data and auth | Supabase Postgres, Supabase Auth, `@supabase/ssr` 0.12.7 |
| Validation | Zod 4.6.7 |
| DnD | `@dnd-kit/core` 6.3.1 |
| AI | OpenAI SDK 7.43.0, Responses API with structured output |
| Navigation | shadcn/ui sidebar and command palette (`cmdk` 1.1.1) |
| Tests | Vitest 5.0.5, pgTAP via Supabase CLI, Playwright 1.64.1 |
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
PLANNER_DAILY_LIMIT=5
```

Apply migrations and seed data, then start the app:

```bash
supabase db reset
npm run dev
```

Open <http://localhost:3000>. The local seed creates two fictional accounts:

| Account | Password | Data |
| --- | --- | --- |
| `demo@monolith.local` | `monolith-demo` | Two projects with tasks and milestones |
| `second@monolith.local` | `monolith-demo` | One private project |

`supabase/seed.sql` runs only on local reset. Never apply it to production.

### AI planning configuration

AI planning is optional. To enable generation, set these **server-side** variables:

- `OPENAI_API_KEY`: an API key with access to the chosen model.
- `OPENAI_MODEL`: the exact model id enabled for that key.
- `PLANNER_DAILY_LIMIT`: optional integer from 1 to 50; defaults to 5.

Never prefix the OpenAI key with `NEXT_PUBLIC_`. With a missing key or the `placeholder` value, `/app/planner` clearly reports that AI is unconfigured and the rest of the product continues to work.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable/anon key; RLS still enforces access |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used for auth redirects and metadata |
| `OPENAI_API_KEY` | Server-only key for plan generation |
| `OPENAI_MODEL` | Server-only model identifier |
| `PLANNER_DAILY_LIMIT` | Per-user daily generation limit enforced in Postgres |

## Design and reuse

The interface direction is documented in [`docs/design-direction.md`](docs/design-direction.md). Reused code, reference research, licenses, and attribution requirements are recorded in [`docs/design-sources.md`](docs/design-sources.md).

- The final direction is a sophisticated dark workspace: deep charcoal surfaces, layered graphite panels, bone typography, and an electric cobalt accent. The marketing site and product share the same tokens and motion language.
- Typography uses Fraunces for editorial display, Plus Jakarta Sans for interface text, and JetBrains Mono for technical metadata.
- Motion for React drives hero and section reveals, hover lift, route transitions, planner draft entrance, and board feedback. Reduced-motion users get static layouts and no hover lift.
- Marketing structure adapts Launch UI (MIT), with an original Monolith hero, product dossier, workflow, AI section, and security section.
- Application primitives and the app shell use shadcn/ui (MIT), including the official sidebar and command palette.
- No proprietary assets, screenshots, customer logos, or testimonials are included.

## Security and data model

- Migrations: `supabase/migrations/`
- Local seed: `supabase/seed.sql` (fictional data only)
- Database tests: `supabase/tests/rls.test.sql`, `supabase/tests/planner.test.sql`

Every exposed table has RLS enabled and explicit grants. `anon` has no application table access. Project ownership is enforced directly; task and milestone policies use an `EXISTS` check against the owning project. Updates check both the existing row and the resulting row, so ownership cannot be transferred.

A trigger on `auth.users` creates the matching `profiles` row through a `SECURITY DEFINER` function with an empty search path. Server handlers derive the user from verified Supabase claims and never trust a client-supplied owner ID.

Planner security:

- Quota is reserved atomically in Postgres per user and UTC day.
- Generation routes validate input, enforce the quota, and never write project data.
- A failed provider call releases the reservation.
- Model output is parsed against an explicit Zod schema; malformed output returns a safe error.
- Confirmation revalidates the edited preview and calls `create_project_plan`, which takes ownership from `auth.uid()` and writes the project, milestones, and tasks in one transaction.

Known limitation: overdue calculations compare date-only values against the current UTC date. Timezone-aware due-date rules are not part of v1.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Product overview |
| `/login`, `/signup` | Public | Email/password auth |
| `/auth/callback` | Public | Supabase code/token exchange |
| `/app` | Authenticated | Command Center |
| `/app/projects` | Authenticated | Active/archived project list |
| `/app/projects/[projectId]` | Authenticated, owner only | Tasks, milestones, progress, project controls |
| `/app/board` | Authenticated | Kanban board with drag-and-drop and status controls |
| `/app/planner` | Authenticated | AI draft, edit, and confirmation flow |
| `/api/projects/*` | Authenticated | Validated project mutations |
| `/api/tasks/*` | Authenticated | Validated task mutations and status moves |
| `/api/milestones/*` | Authenticated | Validated milestone mutations |
| `/api/planner/generate` | Authenticated | Quota-limited plan generation; never writes |
| `/api/planner/confirm` | Authenticated | Validated atomic plan persistence |

`src/proxy.ts` refreshes sessions and performs an optimistic redirect for `/app` and auth pages. Layout guards are navigation behavior only; handlers and RLS remain the security boundary.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
supabase db reset
npm run test:db
npm run test:e2e
```

- `npm test` runs Vitest unit tests for schemas, planner transforms, date helpers, and provider parsing.
- `npm run test:db` runs pgTAP against a freshly reset local database. It covers owner-scoped reads, cross-user denial, grants, constraints, archival, cascade behavior, planner quota, atomic plan persistence, and rollback.
- `npm run test:e2e` runs Playwright against the local app and requires the Supabase stack plus seeded users. It covers auth, project/task/milestone flows, board persistence (including pointer drag), archive/restore/delete, cross-user denial, CSRF rejection, planner confirmation, command-palette navigation, reduced-motion hover behavior, sign-out, and mobile overflow.

The AI preview, edit, and confirm flow was also exercised locally against a mock OpenAI-compatible Responses endpoint. That mock is not committed, and live provider output remains unverified without a real key.

The CI workflow in `.github/workflows/ci.yml` runs lint, typecheck, unit tests, build, pgTAP, and Playwright on GitHub-hosted runners. It has been written but not yet observed running on GitHub.

## Deployment

Production deployment is pending credentials. The intended path:

1. Create a Supabase project, link it with `supabase link`, and push migrations with `supabase db push`. Do not run the seed.
2. Configure the production Site URL and redirect allowlist in Supabase Auth.
3. Set the environment variables above in Vercel. Keep the OpenAI key server-side and set a provider usage limit.
4. Deploy the Next.js app to Vercel and run the smoke flow: sign up, create a project, add a task, move it, add a milestone, open the planner, and confirm a fixture plan.

No production URL is claimed because no deployment has been verified.

## Project structure

```text
src/
  app/
    (public)/              # login, signup, shared auth layout
    (workspace)/app/       # protected shell, dashboard, projects, board, planner
    api/                   # validated route handlers
    auth/callback/         # Supabase session exchange
  components/
    auth/ board/ brand/ dashboard/ marketing/ milestones/ motion/ planner/
    projects/ shared/ shell/ tasks/ ui/
  hooks/                   # media-query store for the sidebar
  lib/
    ai/ api/ auth/ client/ data/ planner/ supabase/ validation/
    motion.ts              # shared timing, easing, and variants
  proxy.ts                 # session refresh and optimistic route protection
supabase/
  config.toml
  migrations/
  seed.sql
  tests/
tests/
  e2e/                     # Playwright flows
docs/
  design-direction.md
  design-sources.md
  architecture.md
  implementation-plan.md
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
- [OpenAI structured outputs](https://platform.openai.com/docs/guides/structured-outputs)
- [Vercel environments](https://vercel.com/docs/deployments/environments)
