# V1 engineering backlog

Snapshot: 2026-11-27; base commit `18c5549bb0d5c383ca2eb2eb502dbe09a199180f` with a pre-existing uncommitted workspace redesign. Priorities reflect current audit evidence, not a release sign-off. See [evidence](V1_EVIDENCE_REGISTER.md) and [release blockers](v1-release-readiness.md).

## P0 — workflow correctness and security

- **IN PROGRESS — board status consistency.** Local regression cases for drag, status selection, failed saves and a subsequent server update pass. Reconciliation uses server timestamps for clearly newer snapshots, but timestamp ordering is not a concurrency guarantee; release-candidate verification remains open. `src/components/board/board.tsx`, `src/components/tasks/task-status-select.tsx`.
- **NOT ASSESSED — remaining security/data integrity.** Cross-user local tests exist, but production RLS, credentials, backup restoration and release-candidate security have not been independently verified.

## P1 — V1 completion

- **IN PROGRESS — duplicate planner confirmation.** Keyed confirmations are transactional and tested locally; recovery across reloads retains the key in same-tab session storage. Legacy unkeyed calls, cleared storage and cross-device retries remain limitations; production migration and compatibility rollout remain unverified. `src/app/api/planner/confirm/route.ts`, `src/lib/data/planner.ts`, planner SQL.
- **IN PROGRESS — safe production smoke harness.** Opt-in guards and local disposable-account cleanup have been exercised; production use requires explicit approval, verified target and disposable accounts. `tests/e2e/production-smoke.spec.ts`.
- **NOT ASSESSED — live AI and production configuration.** Real-provider planner generation, reviewed confirmation, quota behavior, production RLS, mail and auth configuration need separate evidence.
- **NOT ASSESSED — password recovery decision.** Current source lacks a recovery request/reset UI; previous documentation incorrectly suggests SMTP alone is sufficient. Decide whether to implement or explicitly exclude it.
- **IN PROGRESS — responsive 320px regression.** The execution scene has overflowing descendants in the browser sweep; a candidate grid sizing fix needs isolated verification.
- **IN PROGRESS — health probe accuracy.** The Auth-only probe now reports database status as unverified; a genuine database readiness probe and monitoring compatibility remain to be assessed.
- **NOT ASSESSED — dashboard information semantics.** Next action is global even when another project is selected; overview/timeline and focus use different active-project scopes. Clarify scope and verify with multiple/completed projects. Do not infer dependencies.
- **IN PROGRESS — approved dashboard design.** The local project-led layout removes nested panels and moves next action up on mobile; independent design approval and release-commit verification remain open.
- **IN PROGRESS — Firefox/WebKit, keyboard and manual accessibility.** Local WebKit and Chromium keyboard/axe checks passed in isolated runs after targeted fixes. Firefox did not launch in this environment; full manual accessibility remains open.

## P2 — portfolio quality

- **NOT ASSESSED — documentation accuracy.** README, feature matrix, architecture and historical QA claims describe old commits or earlier UI. Reconcile against the final candidate; distinguish release evidence from historical results.
- **NOT ASSESSED — CI reproducibility and artifacts.** Review unpinned Supabase CLI and failure artifact paths.
- **NOT ASSESSED — portfolio assets and evidence.** Create a truthful architecture/data-flow explanation, current screenshots, independent UAT and an end-to-end demonstration; do not fabricate results.

## Deferred

Autonomous agents, advanced dependency or critical-path engines, adaptive replanning, team collaboration, billing and distributed execution infrastructure remain outside V1 unless separately authorized.

## Integrated candidate updates

- **IN PROGRESS — health probe accuracy:** auth-only probe now reports `database: unverified` rather than claiming database health; three targeted tests pass. This is a response-semantics change requiring monitoring compatibility review. A genuine database readiness probe remains a release decision.

## Verification update — 2026-11-27

The integrated local working tree passes lint, typecheck, 48 unit tests, 63 pgTAP tests, 41 Chromium tests (four opt-in smoke tests skipped), a separate four-test local disposable-account smoke run, and a production build. [Evidence and limitations](V1_EVIDENCE_REGISTER.md). Board status regression and 320px overflow are locally verified, not yet verified on a release commit. Planner protection remains partial: unkeyed requests and a remounted draft do not provide the same retry guarantee. The production migration, health-monitoring compatibility, independent design approval, real-provider verification, cross-browser/manual accessibility, backup recovery and production smoke remain open.

Independent review identified a rollback override that could mask a later update. A fix and four local board regressions are recorded in the evidence register; investigate out-of-order server snapshots and concurrent external changes before declaring the broader concurrency gate passed. The later local dashboard redesign addresses the previously observed nested panels and mobile action placement; independent design approval remains open.
