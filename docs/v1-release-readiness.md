# v1.0 release readiness

This document records the release gates still to be verified. It does not assert that a production deployment exists or that v1.0 is released.

## Evidence and scope

- The `main` commit `3fbb484cb61694339222b696fec6735d719e98c2` passed the [CI workflow](https://github.com/saransh-dev12/monolith/actions/runs/41092835207), including lint, typecheck, unit tests, build, local Supabase database tests, and Playwright.
- The planner quota security fix is proposed in [PR #11](https://github.com/saransh-dev12/monolith/pull/11). Its [CI run](https://github.com/saransh-dev12/monolith/actions/runs/41207007539) passed the same categories, including the new database authorization tests. It is not part of `main` until merged.
- Local and CI results use test configuration; they do not verify the production services or live AI provider.

## Release blockers

- [ ] Review and merge the planner quota fix; configure its server-only Supabase service-role key and coordinate the database migration and application rollout. The migration removes the old quota RPC signatures, so an uncoordinated rollout can temporarily interrupt plan generation.
- [ ] Identify and configure the production Supabase project. Apply and verify all migrations, grants, and RLS policies against the intended production database without running the development seed.
- [ ] Configure the production site URL and auth redirect allowlist. Verify signup, email confirmation if enabled, sign-in, sign-out, session refresh, and protected routes using real production configuration.
- [ ] Configure production server-only OpenAI credentials and model, the server-only Supabase service-role key, public Supabase values, site URL, and quota. Verify that no secret is exposed in client assets or logs.
- [ ] Exercise a live AI generation, edit and review the proposal, and confirm it once. Verify provider failure and quota handling, and verify that generation does not persist projects or tasks before confirmation.
- [ ] Run production smoke tests for user isolation, project/task/milestone CRUD, board status persistence, dashboard accuracy, and planner confirmation. Use explicitly disposable test data and remove it after verification.
- [ ] Resolve and test truncated results for larger accounts: the local Supabase API is configured with a 1,000-row maximum, while project, board, dashboard, and execution-series queries do not paginate. Verify counts and lists beyond that boundary against the production API configuration.
- [ ] Review the execution chart wording and data: it uses a done task’s last update as a completion-date proxy, so later edits can move the apparent completion date.
- [ ] Complete the actual rendered visual audit at mobile, tablet, and desktop sizes, including focus, keyboard interactions, contrast, reduced motion, and loading/error states. The light primary token pair was calculated at 4.19:1 for normal text and needs a rendered usage audit and correction where applicable.
- [ ] Re-run the complete CI and local checks for the release commit; reconcile open issues against their acceptance criteria and update release notes with verified results.
- [ ] Create a v1.0 tag only after every applicable release gate has passed.

## Deferred ideas

Team collaboration and roles, billing, notifications, recurring tasks, calendar integration, native apps, autonomous agents, planner history or streaming, advanced analytics, social login, and intra-column reordering are outside the frozen v1.0 scope unless already implemented and stable.
