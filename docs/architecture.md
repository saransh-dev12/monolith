# Monolith architecture proposal

**Status:** implemented for the v1 scope, verified locally. Scaffold, auth, schema/RLS, project/task/milestone CRUD, sidebar shell, command palette, board, dashboard, and the reviewed AI planner are in place. Production deployment and live AI-provider verification remain outstanding. Reviewed against current official documentation on 2026-10-24.

## Architecture decision

Use one Next.js App Router application with TypeScript and Tailwind CSS. Use Supabase for managed PostgreSQL and Auth, OpenAI Responses API for server-side plan generation, and Vercel for hosting. This keeps the MVP in one deployable application with one database and no extra service to operate.

The installed Node.js version is 26.5.0, above the Next.js installation guide's documented 20.9 minimum. npm 11.17.0 is available. Use `create-next-app`'s current recommended TypeScript, App Router, Tailwind, ESLint, and import-alias defaults when scaffolding. The current Tailwind guide documents the v4 PostCSS setup. Select exact compatible package versions at implementation time and commit the npm lockfile; do not rely on floating versions after installation. The current Supabase guide recommends `@supabase/ssr` for cookie-backed sessions in SSR frameworks and describes that package as beta, so pin and verify the API at setup time.

Use shadcn/ui's Next.js setup for accessible base primitives, Lucide for icons, and Motion for React only where an interaction gains clarity from motion. CSS transitions are sufficient for ordinary hover and focus changes. Honor `prefers-reduced-motion` and keep keyboard and touch operation equivalent.

## Runtime boundaries

- **Server Components** render route shells and read user-scoped data close to the database. They keep secrets out of the browser and are the default.
- **Client Components** are limited to interactive controls: forms, board moves, menus, dialogs, tabs, toasts, and planner review/editing. They receive only the data needed for that interaction.
- **Route Handlers** define authenticated mutation and AI-generation boundaries. They validate inputs, resolve the current user, call server-only data/AI modules, and return typed responses.
- **Data-access modules** centralize Supabase queries and ownership-aware operations. They use the cookie-aware server client and never accept an owner ID from an untrusted client as authority.
- **Validation schemas** (Zod planned) validate route params, request bodies, and AI output at runtime. Shared TypeScript types are inferred from those schemas where practical.
- **Database migrations** are checked-in SQL under `supabase/migrations/`; development seed data belongs in `supabase/seed.sql` and must be clearly fictional.
- **AI module** is server-only. It calls the OpenAI Responses API and returns a validated plan preview. The generation endpoint must not write project data.

Do not add a separate API service, Redis, a vector database, a job queue, or an activity stream for the MVP.

## Proposed route and directory map

Next.js route groups below organize layouts without changing public URLs.

```text
app/
  page.tsx                              # /
  (public)/login/page.tsx               # /login
  (public)/signup/page.tsx              # /signup
  (public)/auth/callback/route.ts        # auth callback
  (workspace)/app/layout.tsx            # protected application shell
  (workspace)/app/page.tsx              # /app, Command Center
  (workspace)/app/projects/page.tsx     # /app/projects
  (workspace)/app/projects/new/page.tsx # /app/projects/new
  (workspace)/app/projects/[projectId]/page.tsx
  (workspace)/app/board/page.tsx        # /app/board
  (workspace)/app/planner/page.tsx      # /app/planner
  (workspace)/app/settings/page.tsx     # /app/settings
  api/                                  # validated Route Handlers
components/
  shell/                                # nav, header, responsive layout
  dashboard/                            # metric cards and summaries
  projects/                             # cards and project form
  tasks/                                # task card and task form
  board/                                # columns, cards, status controls
  milestones/                           # milestone list and progress
  planner/                              # prompt and editable plan review
  ui/                                   # shadcn/ui primitives and wrappers
lib/
  supabase/                             # browser and cookie-aware server clients
  auth/                                 # verified-user and route helpers
  data/                                 # server-only query and mutation modules
  schemas/                              # Zod request and response schemas
  ai/                                   # OpenAI client and plan generation
  utils/
types/                                  # shared domain types
supabase/
  migrations/
  seed.sql
```

Planned route access:

- `/`, `/login`, and `/signup` are public.
- The `/app` layout verifies the signed-in user's identity server-side and redirects unauthenticated requests. Every Route Handler and data operation repeats authorization; a layout guard is only navigation behavior, not the security boundary.
- The planner uses `POST /api/planner/generate` for a non-persistent preview and a separate authenticated confirmation mutation for persistence.

### Reusable UI

- Application shell: responsive navigation, page header, account menu, and mobile navigation.
- Projects: project card/list, create/edit form, archive/delete confirmation.
- Tasks and board: task card/form, status and priority controls, Kanban columns, accessible move controls, and optional pointer drag-and-drop if time permits.
- Milestones: milestone list, completion control, target-date display, project progress indicator.
- Dashboard: metric cards derived from queries, overdue tasks, and current project summaries.
- Planner: goal input, generated-plan loading/error state, editable project/milestone/task review, and explicit save confirmation.
- Shared interaction states: buttons, tabs, dialogs, dropdowns, toast feedback, skeletons, empty states, and inline validation.

Keep UI wrappers small and based on shadcn/ui primitives; do not build a broad design system before the MVP needs it.

## Minimum data model

All IDs are UUIDs. Timestamps use `timestamptz` in UTC. Add `created_at` and `updated_at` consistently; maintain `updated_at` with a database trigger.

| Table | Main fields and relationships |
| --- | --- |
| `profiles` | `id` is the primary key and references `auth.users(id)` with cascade delete; `display_name`; timestamps. Avoid preferences until a real MVP setting requires them. |
| `projects` | `id`; `owner_id` references `profiles(id)` with cascade delete (`profiles.id` references `auth.users(id)`); `name`; nullable `description`; `status` (`active` or `completed`); nullable `start_date`, `target_date`, `archived_at`; timestamps. Archiving sets `archived_at`; it does not delete records. |
| `tasks` | `id`; `project_id` references `projects(id)` with cascade delete; `title`; nullable `description`; `status` (`todo`, `in_progress`, `done`); `priority` (`low`, `medium`, `high`); nullable `due_date`; integer `position`; timestamps. The parent project determines ownership. |
| `milestones` | `id`; `project_id` references `projects(id)` with cascade delete; `title`; nullable `description`, `target_date`, `completed_at`; timestamps. `completed_at IS NOT NULL` means complete. |

Do not add activity entries to the MVP. The dashboard can derive its metrics from projects, tasks, and milestones; a separate activity log adds writes and retention questions without a core feature dependency.

If the per-user AI quota needs a persistent counter across Vercel instances, add one small `planner_usage` table keyed by `(user_id, period_start)` with an atomic increment function. The function must verify `auth.uid()`, use a fixed search path, expose only the narrow increment operation, and reject requests at the configured limit. Do not add a separate rate-limit service.

### Constraints and indexes

- Use `NOT NULL` and `CHECK` constraints for required names/titles and enum-like status/priority fields; reject blank names after trimming in request validation.
- Require `target_date >= start_date` when both project dates are present.
- Add indexes for `projects(owner_id, archived_at, updated_at DESC)`, `tasks(project_id, status, position)`, `tasks(project_id, due_date)`, and `milestones(project_id, target_date)`.
- Foreign keys from tasks and milestones cascade when a project is permanently deleted. Archive is reversible and retains all child data.
- Project progress is derived from completed tasks and milestones, not stored as a duplicate percentage.

## Ownership, RLS, and deletion behavior

- Enable RLS on every table in an exposed schema and explicitly grant only needed operations to `authenticated`; do not grant application table access to `anon`.
- Profiles: select/update only where `id = auth.uid()`; inserts are created through a trusted auth/profile flow or constrained to the caller.
- Projects: select/insert/update/delete only when `owner_id = auth.uid()`. Updates must retain the same owner.
- Tasks and milestones: policies use an `EXISTS` check against the referenced project where `owner_id = auth.uid()`. Apply separate policies for select, insert, update, and delete; update checks both the existing row and resulting project relationship.
- Server requests derive the user from verified Supabase claims, then perform ownership-scoped queries. RLS remains active as defense in depth.
- No service-role or secret database key is required for normal application traffic; never send one to a browser. If a privileged maintenance key becomes necessary later, it is server-only and not part of the client runtime.
- Permanent project deletion requires a confirmation dialog and cascades through tasks and milestones. Archiving hides a project from active views but preserves it and its children.

## Migration and seed approach

Commit ordered SQL migrations to `supabase/migrations/`; review schema, grants, RLS, and indexes in each migration. Use Supabase CLI with a local Supabase stack (Docker is installed) for local reset and migration validation, then apply the same reviewed migrations to the hosted project. The CLI itself is not installed and must be added during the tooling issue. Seed only clearly synthetic projects/tasks in local development; do not seed production or commit personal data.

## Authentication and request security

- Use Supabase Auth with email/password for the first release. Configure the app's canonical Site URL, callback/redirect allowlist, and email confirmation behavior in Supabase before deployment.
- Create a profile row for each Auth user through a reviewed signup trigger or trusted server flow so project foreign keys remain valid; never take `owner_id` authority from client input.
- Store SSR sessions in secure, HTTP-only cookies through `@supabase/ssr`; use the current documented identity-verification method (`getClaims()` for verified claims or `getUser()` when a fresh Auth-server user record is needed). Do not authorize based on an unverified `getSession()` user object.
- Protect the `/app` layout and verify identity again in every mutation and AI Route Handler. Return no data for a mismatched project owner.
- Validate all params and bodies server-side; do not trust client-provided ownership, statuses, timestamps, or model output.
- Keep OpenAI API credentials server-only. Bound planner input size and output size, set provider usage limits, and enforce a modest per-user generation quota before calling the provider. Do not log prompts or generated content by default.
- Generate an editable plan preview only. On explicit confirmation, validate the edited payload again and persist the project, milestones, and tasks atomically; never persist directly from the generation request.
- Use same-origin requests, secure cookie settings in production, and standard CSRF protections for cookie-authenticated mutation handlers (origin checks and framework-supported protections where applicable).
- Add request IDs and safe error logging without tokens, cookies, or user prompt contents.

## Environment and external services

`.env.example` contains placeholders only:

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — publishable key; RLS is still mandatory.
- `OPENAI_API_KEY` — secret used only by server code.
- `OPENAI_MODEL` — model identifier selected and verified during implementation.
- `NEXT_PUBLIC_SITE_URL` — canonical app origin for auth redirects.

External setup needed for a deployed MVP: a Supabase project with Auth and Postgres configured, a Supabase CLI login/project link for migration work (database passwords remain local secrets), an OpenAI API project/key with billing and usage limits configured, a Vercel project with per-environment variables, and an authenticated private GitHub repository. No credentials or provider connection are currently verified.

## Design direction

The references were reviewed for broad interaction and composition ideas only: Spline's confident hero composition; Skiper UI's command-palette pattern; Manus's focused prompt-first workspace; and Componentry's polished component states. Monolith should use a dark editorial surface, graphite layering, generous spacing, restrained violet or cobalt accents, clear focus, and purposeful motion. It should avoid decorative 3D and gradient-heavy dashboard patterns. No reference assets, branding, or code are to be copied.

References: [Spline](https://spline.design/), [Skiper UI](https://skiper-ui.com/), [Manus](https://manus.im/), [Componentry](https://componentry.dev/).

## Documentation sources

- [Next.js installation and requirements](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Tailwind CSS Next.js guide](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
- [shadcn/ui Next.js guide](https://ui.shadcn.com/docs/installation/next)
- [Motion for React installation](https://motion.dev/docs/react-installation)
- [Supabase SSR](https://supabase.com/docs/guides/auth/server-side)
- [Supabase choosing a server package](https://supabase.com/docs/guides/auth/choosing-a-server-package)
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [OpenAI Responses API text generation](https://developers.openai.com/api/docs/guides/text)
- [Vercel deployment environments](https://vercel.com/docs/deployments/environments)
