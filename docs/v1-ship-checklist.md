# Monolith V1 — ship checklist

Use this checklist for the exact commit and production environment being released. A checked item requires a link to evidence, the commit or deployment tested, the date, and the person who verified it. Earlier reports describe older commits and are not evidence that the current redesign is ready.

**Release decision:** NOT YET ASSESSED

**Release commit:** __________  **Production deployment:** __________

**Date / verifier:** __________  **Open release blockers:** __________

V1 can ship when all applicable release gates below pass. Mark an item N/A only with a reason and a documented product decision; do not silently skip a promised capability. This checklist does not itself assert that any test or production configuration has passed.

## 1. Product scope and experience

- [ ] Confirm V1 scope and intended users; distinguish implemented features from deferred work in the [feature matrix](v1-feature-matrix.md).
- [ ] Review the landing page and authentication experience for accurate claims, clear calls to action, and no fabricated proof or data.
- [ ] Finish and review the Command Center against the agreed reference: visual hierarchy, navigation, readable project state, next action, milestones, and activity. Explicitly approve the final rendered design rather than relying on a passing build.
- [ ] Check that the dashboard uses real data, identifies overdue work correctly, explains prioritization, and does not imply unsupported relationships or AI recommendations.
- [ ] Review project index and detail, board, planner, milestones, forms, dialogs, menus, and empty/error/loading states for clarity and consistency.
- [ ] Test new users, no active projects, a project with no description/tasks/milestones, completed work, overdue work, multiple projects, and a large account.
- [ ] Document known limitations, including date-only overdue behavior in UTC, and confirm they are acceptable for V1.

## 2. Core workflow

- [ ] Sign up, confirm email when required, sign in, refresh a session, sign out, and verify protected routes and safe redirects.
- [ ] Decide whether password recovery is required for launch; if included, configure email delivery and verify the complete reset flow. Record any accepted limitation.
- [ ] Create, edit, archive, restore, and delete a project; verify related data and navigation update correctly.
- [ ] Create, edit, complete, and delete tasks and milestones; check priority, due date, overdue state, counts, and project progress.
- [ ] Move tasks on the board by pointer and keyboard/status control; reload and verify persistence.
- [ ] Generate a plan with the real configured provider; review and edit it, then confirm once. Verify generation alone does not persist records and confirmation is atomic.
- [ ] Check planner validation, quota exhaustion and reset, provider failure, retries, and duplicate confirmation behavior.
- [ ] Verify account deletion and associated data cleanup with a disposable account; confirm the resulting sign-out behavior.

## 3. Security and data

- [ ] Review production migrations, grants, RLS policies, server-side authorization, and ownership checks against the intended production database.
- [ ] Verify that two disposable users cannot read or mutate each other's projects, tasks, milestones, or planner data.
- [ ] Confirm cross-origin mutation protection, input validation, safe redirects, and protected API and page behavior.
- [ ] Verify server-only keys remain out of browser bundles, public environment variables, logs, and repository history.
- [ ] Review dependencies and resolve release-blocking vulnerabilities; record accepted findings and license attributions.
- [ ] Verify backup, restoration, and migration rollback procedures; coordinate incompatible schema and application changes. Never run the development seed on production.

## 4. Accessibility, responsive behavior and quality

- [ ] Inspect desktop, laptop, tablet, and mobile at 320–1920 px; verify no page overflow, clipped controls, or unusable layouts.
- [ ] Complete the core workflow with keyboard only; verify focus order, visible focus, dialogs, menus, board controls, and mobile navigation.
- [ ] Check contrast, labels, semantic structure, screen-reader announcements, and reduced-motion behavior; resolve serious accessibility failures.
- [ ] Test loading, empty, error, success, disabled, and slow-network states without hiding important actions.
- [ ] Check browser console and network errors; test current Chrome, Safari/WebKit, and Firefox, including a mobile browser.
- [ ] Measure production-like landing and workspace performance, including initial loading, large accounts, and animation smoothness; record results and accepted limits.
- [ ] Have independent users complete the core workflow; record findings and resolve launch-blocking confusion.

## 5. Automated verification on the release commit

Record command output or CI links, date, and commit for each item.

- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm test`
- [ ] `npm run test:db` against the local test database, including RLS and planner tests.
- [ ] `npm run test:e2e` against the intended local or CI test stack; document skipped tests and run applicable production smoke tests separately.
- [ ] `npm run build`
- [ ] Review CI results for the exact release commit and resolve failures; verify any test fixtures are isolated and cleaned up.

## 6. Production readiness and release

- [ ] Confirm the Vercel project, production branch, canonical domain, and intended Supabase project; review the [deployment guide](deployment.md).
- [ ] Verify production environment variables, server-only secrets, model and quota settings, site URL, and authentication redirect allowlist without exposing their values.
- [ ] Apply and verify reviewed migrations; confirm backups, monitoring, error visibility, health endpoint, and rollback ownership before rollout.
- [ ] Deploy the release commit and verify the deployment is ready and the intended domain serves it.
- [ ] Run production smoke checks with disposable accounts: authentication, isolation, project/task/milestone CRUD, board persistence, dashboard totals, and live planner generation and confirmation. Remove test data afterward.
- [ ] Verify production email delivery and recovery if in scope, plus provider-failure and quota handling.
- [ ] Review open issues, security findings, release notes, third-party attributions, and the privacy policy/terms; document accepted risks and owners.
- [ ] Record final evidence and ship decision; create the V1 tag/release only after the applicable gates pass.
- [ ] After release, check deployment health and errors, confirm the core workflow still works, and monitor the agreed observation period.

## Evidence and decisions

| Gate or issue | Evidence / deployment | Date and verifier | Result or accepted decision |
| --- | --- | --- | --- |
| | | | |

Related records: [release readiness](v1-release-readiness.md), [QA report](v1-qa-report.md), [security audit](v1-security-audit.md), [performance report](v1-performance-report.md), and [deployment guide](deployment.md). Reconcile contradictions and stale claims before signing off.

## 7. Portfolio and engineering presentation readiness

Portfolio readiness does not replace production readiness. It establishes whether the released product and its engineering can be inspected and evaluated accurately. Each item remains unchecked until supported by evidence for the release candidate.

### Repository presentation

- [ ] Verify the repository is public and accessible; finalize a technically accurate README and V1 value proposition.
- [ ] Document the stack, dependencies, installation, environment variable names, database setup, migrations, test commands and deployment without exposing secrets.
- [ ] Remove outdated instructions, inaccurate feature claims, unnecessary generated files and credentials; make the repository structure understandable.

### Architecture and AI engineering

- [ ] Create a system architecture diagram covering frontend, backend, database, authentication, provider and deployment boundaries.
- [ ] Document request/data flows, the project/task/milestone data model, relationships, constraints, RLS, server-side authorization and validation.
- [ ] Explain transactional operations, consistency decisions, the AI planner lifecycle, structured-output validation, human review, atomic persistence, duplicate confirmation, quota and failure handling.
- [ ] Distinguish implemented capabilities from future plans; document architecture decisions, tradeoffs, testing limits, known limitations and accepted technical debt.

### Visual assets and demonstration

- [ ] Capture genuine release-version production screenshots of landing, Command Center, project execution, board, planner review and mobile; remove personal and private information.
- [ ] Record and edit a concise end-to-end demonstration showing project creation, live AI generation, plan review/edit/confirm, persistence, tasks, milestones, board interaction and dashboard progress.
- [ ] Confirm the recording uses a stable documented environment and contains no secrets, private data or fabricated functionality.

### Portfolio and resume claims

- [ ] Prepare a concise resume-ready description and identify verified engineering contributions.
- [ ] Support all performance, scale, reliability and AI claims with current evidence; avoid presenting future capabilities as shipped.
- [ ] Prepare an interview explanation of architecture and tradeoffs and verify that the live deployment and public repository are accessible.

## 8. Release decisions

**NOT YET ASSESSED:** use until evaluated against the exact release candidate. **BLOCKED:** one or more release-critical gates fail or lack evidence. **READY FOR RELEASE:** all applicable gates pass and accepted risks have owners. **RELEASED:** approved commit deployed and production verification complete. **PORTFOLIO READY:** released application is demonstrably functional, documented, publicly presentable and accompanied by an accurate demonstration. A release may precede optional portfolio assets, but must not be described as portfolio-ready until those gates are met.

The authoritative supplied V1 directive additionally requires explicit product positioning, session and expiry checks, stale reference and concurrency checks, rollback ownership, independent UAT, cross-browser testing and an evidence record for every completed checklist item. These are release gates, not claims that the capabilities have been verified.

## Detailed gates from the supplied V1 checklist

These individual gates supplement the condensed sections above. They remain unchecked until the evidence register identifies the exact release commit, deployment where applicable, date, verifier and result; do not infer a pass from an earlier report.

### Product definition and experience

- [ ] Document the intended users, problem, value proposition, differentiation, V1 boundaries and deferred V2 work; check descriptions against implemented behavior.
- [ ] Confirm Ember Obsidian and visual cohesion across landing, auth, Command Center, projects, board and planner; explicitly approve the final desktop and mobile Command Center.
- [ ] Verify primary workflows are understandable without developer assistance; review all loading, empty, error and success states.
- [ ] Confirm project progress, milestones, next-action prioritisation and overdue state match underlying records; document and accept the UTC date-only limitation.

### Workflow and account lifecycle

- [ ] Check session persistence and expiry, protected pages and APIs, email confirmation where required and safe redirects.
- [ ] Verify project ownership, related task and milestone behavior, persistence across refresh and sign-in, and archive/restore/delete transitions.
- [ ] Verify task and milestone relationships, status transitions, counts and consistency after deletion or restoration.
- [ ] Verify board pointer and keyboard/status controls, optimistic updates and failure recovery, persistence, empty columns and large task lists.
- [ ] Verify realistic live-provider plan quality, editable review, no persistence before approval, atomic confirmation, invalid output, provider failure, quota reset, retries and duplicate confirmation.
- [ ] Verify disposable-account deletion, cascading data cleanup, sign-out and denial of subsequent protected access.

### Security, integrity and operations

- [ ] Verify production migrations, grants, RLS, ownership and database constraints, including two-user isolation via pages and APIs and resistance to supplied owner IDs.
- [ ] Check invalid, missing and stale references, repeated or concurrent updates, duplicate requests, multi-step failures and date/time boundaries for integrity.
- [ ] Review origin protection, validation, redirects, session handling, error responses, dependency vulnerabilities, licenses and secret exposure including repository history and browser bundles.
- [ ] Document and test backup, restoration, migration rollback, coordination of incompatible changes, and responsible ownership; never seed production.

### Accessibility, reliability and release

- [ ] Verify keyboard-only workflows, focus visibility/order, semantic labels and announcements, contrast, reduced motion, touch targets and layouts from 320–1920 px.
- [ ] Check slow networks, console/network errors, loading/disabled states, Chrome, Firefox, Safari/WebKit and mobile browsers; measure performance and document limits.
- [ ] Have independent users complete the workflow and address release-blocking findings; confirm visualizations use genuine records and no unfinished placeholders remain.
- [ ] Review CI for the exact candidate, test isolation and cleanup, critical coverage and failure paths; reconcile conflicting README, QA and matrix claims.
- [ ] Verify production environment, auth redirect allowlist, provider and quota settings, migrations, backup and monitoring ownership, domain, logs, rollback and smoke cleanup.
- [ ] Record accepted risks, owners, release notes, privacy/terms, final decision and post-release observation; create a tag and GitHub release only after approval and applicable gates pass.

### Portfolio evidence

- [ ] Verify public repository access and accuracy of setup, stack, environment, migration, deployment and test documentation; inspect for secrets and generated files.
- [ ] Document architecture, data model, RLS, server authorization, AI lifecycle, validation, quota, transactions, failure modes, trade-offs, testing limitations and future roadmap.
- [ ] Capture genuine release-version screenshots for landing, Command Center, projects, board, planner and mobile, and produce an accurate end-to-end demonstration with no private data.
- [ ] Prepare evidence-backed resume and interview descriptions; verify the public repository, live deployment and demo describe the same released product.
