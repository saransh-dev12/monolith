> **Current execution update — 2026-11-27:** Release is NOT YET ASSESSED for the current uncommitted tree. Board reconciliation and keyed planner retry recovery have local regression coverage; legacy unkeyed requests remain non-idempotent. The opt-in smoke harness passed locally but has not been run on production. The health endpoint checks Auth and reports database status as unverified. Live AI, production data isolation, backups and final design approval remain unverified. No production migrations, settings changes or data writes are authorized without explicit user approval. See [current backlog](V1_ENGINEERING_BACKLOG.md) and [evidence register](V1_EVIDENCE_REGISTER.md). Older evidence below applies only to the named commits.

# v1.0 release readiness

This document records the release gates still to be verified. It does not assert that a production deployment exists or that v1.0 is released.

## Evidence and scope

- The `main` commit `3fbb484cb61694339222b696fec6735d719e98c2` passed the [CI workflow](https://github.com/saransh-dev12/monolith/actions/runs/41092835207), including lint, typecheck, unit tests, build, local Supabase database tests, and Playwright.
- [Integration PR #16](https://github.com/saransh-dev12/monolith/pull/16) combines PRs #11–#15 and their follow-up fixes for auth redirects, quota rollover, and API limits below the requested page size. Verify CI on the exact release commit before release.
- Local and CI results use test configuration; they do not verify the production services or live AI provider.

## Release blockers

- [ ] Configure the server-only Supabase service-role key and coordinate the database migration and application rollout. The migration removes the old quota RPC signatures, so an uncoordinated rollout can temporarily interrupt plan generation.
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

### Candidate rollout dependency — planner confirmation

The current uncommitted candidate calls `create_project_plan_idempotent` for keyed planner confirmations. The reviewed migration `20261127000000_idempotent_plan_confirmation.sql` must be applied and verified before deploying application code that calls it. Keep the legacy RPC available while older clients may be active, and plan rollback accordingly. Legacy unkeyed requests remain non-idempotent; keyed retry recovery is scoped to the same browser tab and its session storage, including reloads. No migration or candidate deployment has been applied to production as part of this work. Review monitoring before deploying the `/api/health` response change: its database field now says `unverified`, because the probe only checks Auth.
