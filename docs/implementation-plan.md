# Monolith implementation plan

**Status:** in progress. The Day 1 foundation is implemented and verified locally; Day 2 and Day 3 work is outstanding. This schedule remains a target rather than a guarantee and assumes one focused developer with Supabase, OpenAI, and Vercel access configured when needed.

**Verified so far (2026-10-24):** public repository at `https://github.com/saransh-dev12/monolith`, `MVP v1.0` milestone, issues #1–#10, clean migration reset and seed, 21 passing pgTAP RLS/constraint tests, lint, typecheck, production build, and local browser checks for auth, CRUD, board persistence, cross-user denial, CSRF origin rejection, and mobile layouts. Milestone editing, AI planning, CI, and deployment are not implemented.

## Three-day delivery sequence

### Day 1 — Foundation, auth, shell, core work

**Deliverables**

- Pin the Next.js/React/TypeScript/Tailwind/tooling versions and commit the npm lockfile.
- Create initial migrations for profiles, projects, tasks, milestones, constraints, indexes, grants, and RLS; set up fictional local seed data.
- Implement Supabase cookie-backed auth and protected application routes.
- Establish the dark responsive shell and shared UI primitives.
- Deliver project/task create, read, update, archive/delete flows and initial Kanban status movement.

**Dependencies:** GitHub authentication and private repo; Supabase dev project or local stack; npm and Docker are available. Supabase CLI must be installed.

**Acceptance criteria**

- A new user can sign up, sign in, sign out, and reach protected routes only with a verified session.
- An authenticated user can create and edit a project and its tasks; board status changes persist after reload.
- A second user cannot view or mutate the first user's rows, including through direct handler requests.
- Each exposed table has explicit grants and RLS policies, and migrations reset cleanly.
- Shell works at mobile and desktop widths with visible keyboard focus and useful empty/loading/error states.

**Checks:** typecheck, lint, migration reset/RLS tests, auth and CRUD integration tests, and a production build for the foundation.

**Likely blockers:** Supabase callback/email configuration; policy errors discovered only through authenticated tests; time spent tuning UI before CRUD works.

**Cut first if delayed:** extra auth providers, profile preferences, advanced animation, and pointer drag-and-drop (retain keyboard-accessible status moves).

### Day 2 — Milestones, dashboard, AI planner

**Deliverables**

- Add milestone create/edit/complete and project progress derived from records.
- Add Command Center metrics for active projects, open/completed tasks, and overdue tasks.
- Add OpenAI plan generation with bounded input, typed/structured output, runtime validation, and per-user request quota.
- Add editable plan review and an explicit confirmation step that persists the reviewed plan atomically.
- Test end-to-end flows across project, board, milestone, dashboard, and planner views.

**Dependencies:** Day 1 migrations, verified auth, scoped data access, and an OpenAI API key/model configured only on the server.

**Acceptance criteria**

- Metrics reflect database state for the signed-in user and update after task/project mutations.
- Milestones and task completion produce consistent progress without a separately stored percentage.
- Generation returns a preview and creates no database records. Editing the preview changes the saved values; only explicit confirmation persists it.
- Malformed model output, oversized input, quota exhaustion, provider failure, and unauthenticated requests return safe, useful errors.
- The create-plan operation either saves all related rows or saves none.

**Checks:** schema/unit tests, planner route tests using a mocked provider, persistence/rollback tests, and multi-user authorization tests.

**Likely blockers:** structured output shape drift, AI latency/cost, transaction boundary for related inserts, and date/timezone edge cases.

**Cut first if delayed:** planner history, streaming generation, extra metrics, and milestone-specific analytics. Keep generation, review, confirmation, and safe persistence.

### Day 3 — Verification, accessibility, deployment, release notes

**Deliverables**

- Regression and ownership/RLS checks for every read and mutation path.
- Responsive and accessibility review: keyboard-only operation, labels, contrast, focus, reduced motion, and mobile board use.
- Production build, production environment setup, migration apply, and Vercel deployment.
- README setup/deployment instructions, screenshots, demo flow, and release verification.

**Dependencies:** working MVP flows and stable migrations; configured Supabase/OpenAI/Vercel environments; GitHub repository access.

**Acceptance criteria**

- CI runs lint, typecheck, unit/integration/security checks, and production build on pushes and pull requests.
- Cross-user access attempts fail; no secret appears in browser bundles or repository history; RLS tests cover projects and child rows.
- Main flows are operable by keyboard and remain usable at narrow viewport sizes; reduced-motion preference is respected.
- Production deployment has correct auth redirects and environment variables; smoke tests cover sign-in, project/task CRUD, board move, and plan confirmation.
- Documentation labels all functionality accurately and a short demo can be completed with seeded/demo data.

**Checks:** full CI suite, migration validation, production build, manual browser smoke test, dependency/security scan, and accessibility pass.

**Likely blockers:** provider account/billing setup, incorrect production redirect URLs, migration drift, or last-minute visual rework.

**Cut first if delayed:** non-critical animation, optional profile settings, extra dashboard visualizations, and polished marketing-page sections. Do not cut ownership/RLS verification, safe AI persistence, or a functioning core workflow.

## Minimum release and optional work

The minimum credible release is email/password auth; private project/task CRUD; persistent Kanban status changes; milestones/progress; real user-scoped dashboard metrics; AI preview/edit/confirm with atomic persistence; RLS and server authorization; responsive accessible core screens; automated checks; and a working production deploy with setup documentation.

Optional work after that release includes social sign-in, project templates, planner history, richer board gestures, extra dashboard charts, and activity history. Do not expand the schema or infrastructure for these before their need is demonstrated.

## Quality gates by workstream

- **Database/security:** migration from clean state; constraints; RLS/grants; cross-user denial tests; cascade/archive behavior.
- **Authentication:** verified server session, cookie handling, redirects, sign-out, protected routes and handlers.
- **Projects/tasks/board:** CRUD validation, due-date behavior, status movement persistence, empty/loading/error states.
- **Dashboard/milestones:** metrics from real scoped rows; completion and progress consistency.
- **AI planner:** input/output schema validation, no-write generation path, edited review payload, explicit confirmation, atomic persistence, request quota and failure handling.
- **Release:** lint, typecheck, unit/integration checks, production build, responsive/accessibility review, deployment smoke test.

## GitHub repository and issue tracking status

The public repository is `https://github.com/saransh-dev12/monolith`, with `origin` configured over HTTPS on `main`. The `MVP v1.0` milestone contains ten open issues. Labels `setup`, `feature`, `backend`, `frontend`, `security`, `testing`, `documentation`, `P0`, and `P1` are in place.

Current issue status:

- **#1 Project foundation and tooling:** implemented. Next.js App Router, TypeScript, Tailwind, shadcn/ui, Lucide, environment handling, lint/typecheck scripts, and the committed lockfile are in place. CI is still part of #9.
- **#2 Database schema, migrations, and authorization policies:** implemented. Migrations, grants, RLS, triggers, indexes, local seed, and pgTAP tests are in place.
- **#3 Authentication and protected routes:** implemented for email/password, including callback handling and server-side identity checks.
- **#4 Application shell and design system:** implemented, including responsive navigation, dialogs, empty/loading/error states, focus styles, and reduced motion.
- **#5 Projects and task CRUD:** implemented with server validation, archive/restore, cascade delete, and owner scoping.
- **#6 Kanban board and milestone tracking:** partially implemented. Persistent accessible status movement and project progress exist; milestone create/edit/complete is still pending.
- **#7 Command Center dashboard:** core metrics implemented. Additional summaries and refinements remain.
- **#8 AI planner and safe persistence:** not started.
- **#9 Automated tests, security checks, and accessibility:** database tests and local browser verification exist; committed CI and automated end-to-end suites are pending.
- **#10 Deployment, documentation, and release readiness:** local setup documentation is current; production deployment and release verification are pending.

### Proposed issue 1 — Project foundation and tooling

**Labels:** `setup`, `P0` · **Milestone:** MVP v1.0 · **Dependencies:** none.

Set up the Next.js App Router, TypeScript, Tailwind, lint/typecheck scripts, shadcn/ui primitives, Lucide, environment handling, and CI baseline. Commit the lockfile and document local Supabase setup.

**Acceptance:** clean install succeeds; lint, typecheck, and production build run; `.env.example` contains placeholders only; secret/local files are ignored; local migration workflow is documented.

### Proposed issue 2 — Database schema, migrations, and authorization policies

**Labels:** `backend`, `security`, `P0` · **Milestone:** MVP v1.0 · **Dependencies:** issue 1.

Create versioned migrations and seed data for profiles, projects, tasks, and milestones. Add constraints, indexes, timestamps, grants, and owner-scoped RLS policies for each operation.

**Acceptance:** clean reset and seed succeed; every exposed table has least-privilege grants and RLS; task/milestone access follows project ownership; cross-user tests deny reads/writes; project delete cascades while archive preserves children.

### Proposed issue 3 — Authentication and protected routes

**Labels:** `backend`, `security`, `P0` · **Milestone:** MVP v1.0 · **Dependencies:** issues 1–2.

Implement Supabase email/password sign-up, sign-in, sign-out, callback/session handling, and protected application routes with verified server-side identity.

**Acceptance:** unauthenticated users cannot access `/app` or protected handlers; every request verifies identity; cookies and redirect URLs work locally; auth errors are handled without exposing tokens.

### Proposed issue 4 — Application shell and design system

**Labels:** `frontend`, `P0` · **Milestone:** MVP v1.0 · **Dependencies:** issue 1.

Build the responsive dark shell, navigation, page header, account menu, typography/color tokens, and reusable dialogs, menus, tabs, toasts, skeletons, and empty states.

**Acceptance:** public and authenticated layouts are distinct; primary navigation works on mobile and desktop; focus/contrast/reduced-motion behavior is usable; visual language is restrained and consistent.

### Proposed issue 5 — Projects and task CRUD

**Labels:** `feature`, `frontend`, `backend`, `P0` · **Milestone:** MVP v1.0 · **Dependencies:** issues 2–4.

Implement project creation/edit/archive/delete and task creation/edit/delete with project association, status, priority, due date, and ordering. Validate on the server and scope all operations to the owner.

**Acceptance:** valid CRUD persists; invalid data is rejected; archive retains records; confirmed deletion cascades; user A cannot access user B's projects or tasks.

### Proposed issue 6 — Kanban board and milestone tracking

**Labels:** `feature`, `frontend`, `backend`, `P1` · **Milestone:** MVP v1.0 · **Dependencies:** issues 2, 4, and 5.

Implement status columns with persistent accessible task movement and milestone CRUD/completion/target dates. Derive project progress from completion records.

**Acceptance:** board reflects persisted task status/order after reload; status can be changed without a pointer; milestones remain project-scoped; progress updates consistently; mobile layout is usable.

### Proposed issue 7 — Command Center dashboard

**Labels:** `feature`, `frontend`, `backend`, `P1` · **Milestone:** MVP v1.0 · **Dependencies:** issues 2, 5, and 6.

Build the dashboard with active project, open/completed task, and overdue task metrics plus useful project summaries, all derived from current-user data.

**Acceptance:** numbers match database fixtures and update after mutations; overdue rules use due dates consistently; empty and loading states are clear; another user's rows never affect metrics.

### Proposed issue 8 — AI planner and safe persistence

**Labels:** `feature`, `backend`, `security`, `P1` · **Milestone:** MVP v1.0 · **Dependencies:** issues 2, 3, and 5.

Generate structured project/milestone/task suggestions through a server-only OpenAI integration. Let users edit the preview and explicitly confirm before an atomic database write.

**Acceptance:** generation endpoint never writes; output and edited payload are schema-validated; unauthenticated, oversized, quota-exceeded, malformed, and provider-error cases are handled; only explicit confirmation creates records; partial persistence is impossible.

### Proposed issue 9 — Automated tests, security checks, and accessibility

**Labels:** `testing`, `security`, `P0` · **Milestone:** MVP v1.0 · **Dependencies:** issues 2–8.

Add CI checks for lint, typecheck, unit/integration flows, authorization/RLS, planner safety, keyboard navigation, reduced motion, and key responsive states.

**Acceptance:** required checks run in CI; cross-user access and AI no-write-before-confirm are tested; main flows are keyboard-operable; no secret is bundled or committed; production build passes.

### Proposed issue 10 — Deployment, documentation, and release readiness

**Labels:** `documentation`, `setup`, `P1` · **Milestone:** MVP v1.0 · **Dependencies:** issues 1–9.

Configure Vercel and Supabase production settings, apply migrations, document setup and deployment, capture screenshots, and prepare a demo/release checklist.

**Acceptance:** production deployment is reachable; auth redirects and environment variables are verified; smoke tests cover key workflows; README matches shipped behavior; release limitations are documented.
