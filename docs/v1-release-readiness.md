# v1.0 release readiness

This document records the release gates still to be verified. It does not assert that a production deployment exists or that v1.0 is released.

## Evidence and scope

- The `main` commit `3fbb484cb61694339222b696fec6735d719e98c2` passed the [CI workflow](https://github.com/saransh-dev12/monolith/actions/runs/41092835207), including lint, typecheck, unit tests, build, local Supabase database tests, and Playwright.
- [Integration PR #16](https://github.com/saransh-dev12/monolith/pull/16) combines draft PRs #11–#15 and contains follow-up fixes for auth redirects, quota rollover, and API limits below the requested page size. These changes are not part of `main` until approved and merged. Verify CI on the exact release commit before release.
- Local and CI results use test configuration; they do not verify the production services or live AI provider.

## Release blockers

- [ ] Review and approve the combined changes, including the auth redirect, quota rollover, and pagination regression tests. Configure the server-only Supabase service-role key and coordinate the database migration and application rollout. The migration removes the old quota RPC signatures, so an uncoordinated rollout can temporarily interrupt plan generation.
- [ ] Identify and configure the production Supabase project. Apply and verify all migrations, grants, and RLS policies against the intended production database without running the development seed.
- [ ] Configure the production site URL and auth redirect allowlist. Verify signup, email confirmation if enabled, sign-in, sign-out, session refresh, and protected routes using real production configuration.
- [ ] Configure production server-only OpenAI credentials and model, the server-only Supabase service-role key, public Supabase values, site URL, and quota. Verify that no secret is exposed in client assets or logs.
- [ ] Exercise a live AI generation, edit and review the proposal, and confirm it once. Verify provider failure and quota handling, and verify that generation does not persist projects or tasks before confirmation.
- [ ] Run production smoke tests for user isolation, project/task/milestone CRUD, board status persistence, dashboard accuracy, and planner confirmation. Use explicitly disposable test data and remove it after verification.
- [ ] Verify large-account lists, totals, and charts against production after the pagination and aggregation changes are approved and applied. The combined CI integration job exercises a 200-row local API cap; production remains unverified.
- [ ] Verify the execution chart in production. Its updated wording states that it uses a currently done task’s last update, which can change after an edit.
- [ ] Complete the actual rendered visual audit at mobile, tablet, and desktop sizes, including focus, keyboard interactions, contrast, reduced motion, and loading/error states. The targeted light primary pair was adjusted and has a CI contrast check; other states and surfaces still need review.
- [ ] Re-run the complete CI and local checks for the release commit; reconcile open issues against their acceptance criteria and update release notes with verified results.
- [ ] Create a v1.0 tag only after every applicable release gate has passed.

## Deferred ideas

Team collaboration and roles, billing, notifications, recurring tasks, calendar integration, native apps, autonomous agents, planner history or streaming, advanced analytics, social login, and intra-column reordering are outside the frozen v1.0 scope unless already implemented and stable.
