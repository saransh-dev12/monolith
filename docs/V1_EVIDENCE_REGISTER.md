# V1 evidence register

Status vocabulary: NOT ASSESSED, IN PROGRESS, PASS, FAIL, BLOCKED, N/A with reason. The working tree contains pre-existing uncommitted changes; no release candidate commit exists yet. Results below apply only to the observed working tree and cannot establish production readiness or a clean commit's status. Verifier: Codex, 2026-11-27 UTC.

| Reference | Evidence and scope | Commit / deployment | Result |
| --- | --- | --- | --- |
| Baseline repository | `git status -sb`: `main`, modified dashboard/shell/tests and untracked checklist/artwork/navigation; user work preserved | Base `18c5549bb0d5c383ca2eb2eb502dbe09a199180f` + dirty tree | IN PROGRESS |
| Historical CI | [GitHub Actions run](https://github.com/saransh-dev12/monolith/actions/runs/45672119613), successful on pushed commit | `18c5549bb0d5c383ca2eb2eb502dbe09a199180f`; not current dirty tree | PASS for that historical commit only |
| Production availability | `vercel ls monolith --prod`: deployment `monolith-ltlxadtka-saransh-pandey-s-projects52.vercel.app` ready; `curl` on canonical domain HTTP 200 | [Production deployment](https://monolith-ltlxadtka-saransh-pandey-s-projects52.vercel.app), prior pushed commit | PASS for availability only; production workflows NOT ASSESSED |
| Local lint, typecheck, units | `npm run lint`, `npm run typecheck`, `npm test`: success, 9 unit files / 45 tests | Dirty tree on base `18c5549` | PASS locally; rerun on integrated candidate |
| Local database | `npm run test:db`: 3 files / 53 pgTAP tests passed | Local Supabase, dirty tree on base `18c5549` | PASS locally; not production evidence |
| Local production build | `npm run build` passed | Dirty tree on base `18c5549` | PASS locally; rerun after integration |
| Local Playwright | 35 passed, 2 failed, 3 skipped; responsive `/app` 320px overflow and a trace artifact ENOENT. Agents concurrently ran tests/edited smoke harness, so this run is contaminated and not a clean baseline. | Dirty tree, local Chromium | FAIL / rerun in isolation |
| Board status | Specialist reproduced drag-then-select mismatch and enabled selector during delayed drag save | Dirty tree, local fixture; see `tests/e2e/board-status-consistency.spec.ts` when integrated | FAIL; fix IN PROGRESS |
| Planner retry | Code inspection: confirm route sends no idempotency key and existing RPC creates a project per invocation | Base `18c5549` + dirty tree | FAIL against duplicate-confirmation gate; fix IN PROGRESS |
| Production release gates | Live provider, production RLS, actual backup/restore and disposable smoke checks not yet verified | [Canonical site](https://monolith-navy.vercel.app) | NOT ASSESSED |

Append a new row for each completed gate with exact commit or explicitly identified uncommitted snapshot, command or evidence link, date, verifier and outcome. Do not copy historical PASS claims forward.

| Health endpoint truthfulness | `npx vitest run src/app/api/health/route.test.ts`: 3 tests passed; auth success, HTTP failure and network failure all report database `unverified`. A database outage is not detected by this endpoint. | Uncommitted fix on base `18c5549` | PASS for truthful auth-only reporting; database readiness remains NOT ASSESSED |

Compatibility note: the `/api/health` `database` field changes from the previously misleading `reachable`/`unreachable` values to `unverified`, and adds `auth`. Review any external monitoring expectations before deployment. HTTP 200 still means the Auth probe succeeded, not that the database was checked.

## Integrated working-tree checks — 2026-11-27

Verifier: Codex. Base commit `18c5549bb0d5c383ca2eb2eb502dbe09a199180f` plus uncommitted changes; there is no candidate SHA, so these results do not pass the release-commit gates. All browser/database checks below used local services and disposable or local test data; they are not production evidence.

| Check | Evidence | Result and limitations |
| --- | --- | --- |
| Lint and typecheck | [lint](evidence/v1-local-2026-11-27/monolith-v1-lint.txt), [typecheck](evidence/v1-local-2026-11-27/monolith-v1-typecheck.txt) | Both commands exited 0 on the working tree. |
| Unit and database | [Vitest](evidence/v1-local-2026-11-27/monolith-v1-unit.txt), [pgTAP](evidence/v1-local-2026-11-27/monolith-v1-db.txt) | 48 unit tests and 63 local pgTAP tests passed. The local database has the new planner migration applied. |
| Targeted integration | [Chromium targeted output](evidence/v1-local-2026-11-27/monolith-v1-targeted.txt) | Five passed: three board consistency cases, concurrent keyed planner confirmation and responsive workspace overflow sweep. |
| Full local browser suite | [Chromium output](evidence/v1-local-2026-11-27/monolith-v1-full-e2e.txt) | 41 passed; 4 guarded production-smoke cases skipped. Firefox, WebKit and manual accessibility are not established by this run. |
| Smoke harness against local stack | [Local disposable-account run](evidence/v1-local-2026-11-27/local-smoke.txt) | 4 passed, including signup and cleanup using the local auto-confirm configuration. This does not verify production configuration, mail, planner, isolation or backups. |
| Production build | [build output](evidence/v1-local-2026-11-27/monolith-v1-build.txt) | `npm run build` exited 0 locally. |

The tests above were run at different times against the same uncommitted implementation; documentation-only edits and evidence collection continued afterward. Repeat against an identified release commit and production deployment before any release decision. Planner duplicate protection does not cover legacy unkeyed confirmations or a draft after remount, and the new migration must precede deployment of code using it.

After the integrated run, a rendered local desktop/mobile review found that the next action falls below the first mobile viewport and that nested panels still dominate the composition; design approval remains open. A duplicated visible overdue count was simplified. [Follow-up accessibility and large-account tests](evidence/v1-local-2026-11-27/dashboard-followup.txt): five passed locally.

An independent static board review found an optimistic rollback that could mask a later server update. The effect now rechecks overrides after rollback as well as server updates. [Four local board regressions](evidence/v1-local-2026-11-27/board-review.txt) passed, including failure followed by an external update and refresh. Out-of-order server snapshots after rapid external changes still warrant further concurrency review; none of these checks replaces release-commit verification.

After the board-review and overdue-label fixes, `npm run lint && npm run typecheck && npm test && npm run build` exited 0; 48 unit tests passed and [the final local build output](evidence/v1-local-2026-11-27/final-build.txt) was retained. The complete browser suite above predates those two follow-up changes; the specific board and dashboard follow-up runs cover them, but the full suite should be rerun for the release commit.

## Production configuration review — 2026-11-27

Verifier: Codex. `vercel inspect https://monolith-navy.vercel.app` reports the existing production deployment `dpl_BhJVNi3DYLh18cSKQQoq4AMiUMTJ` Ready; this is an older deployment, not the uncommitted candidate. `vercel env ls --project monolith --environment production` lists the Supabase URL, publishable key, service-role key and site URL, but no `OPENAI_API_KEY` or `OPENAI_MODEL` in the production environment. The planner source requires both; live generation is therefore blocked until the intended provider configuration is supplied and tested. No values were recorded. `supabase projects list` failed because no management access token was available, so the production project, migrations, backup and recovery configuration remain unverified. Do not deploy the new planner-dependent code until the migration and rollout are reviewed.

### Production inspection boundary and accidental Vercel project

The user requested no production writes, migrations, settings changes, or destructive actions without explicit approval; release status remains NOT YET ASSESSED. A local attempt to identify the configured Supabase host via the Vercel CLI unexpectedly created a separate Vercel project named `monolith-app` and connected it to the GitHub repository; the attempted deployment failed. This did not modify the existing `monolith` production project. The accidentally created project's local `.vercel` link was moved out of the checkout to avoid selecting it later. At that point the separate remote project remained present pending the user's explicit approval. The exact production Supabase project ID remains unverified.

Follow-up: after the user explicitly approved removal, `vercel project rm monolith-app --yes --scope saransh-pandey-s-projects52` reported the accidental project deleted. A subsequent scoped project listing showed `monolith` still present with `https://monolith-navy.vercel.app` and no `monolith-app`. The approval applied only to that separate project's deletion, not to production migrations, data writes, settings changes or deployment.

### Continued local work — 2026-11-27

Verifier: Codex and specialized frontend/QA agents. The Command Center was recomposed around the project with an earlier mobile next action; populated desktop, tablet and mobile screens and a disposable empty account were rendered locally. Visual sign-off and production screenshots remain outstanding. Planner recovery was extended to reloads in the same tab; legacy unkeyed calls, tab closure and cross-device retry remain limitations. Board reconciliation now considers a clearly newer server timestamp as well as matching status; timestamp ordering is not a transactional concurrency guarantee.

WebKit's [first accessibility and keyboard run](evidence/v1-local-2026-11-27/webkit-initial.txt) passed six tests and timed out in workspace sign-in during concurrent development activity; the [isolated workspace rerun](evidence/v1-local-2026-11-27/webkit-workspace-rerun.txt) passed. [Chromium keyboard navigation](evidence/v1-local-2026-11-27/keyboard-chromium.txt) passed. Firefox did not launch because its profile folder could not be found, so Firefox remains unverified. Two landing accessibility defects identified in WebKit were fixed before these reruns. These are local working-tree observations, not release-commit evidence.

The [first integrated Chromium suite](evidence/v1-local-2026-11-27/integrated-first-failed.txt) ran 44 passing, four skipped production smoke cases, and one failure caused by an incorrect new test expecting the generation form while a draft hides it. The assertion was removed; repeat results are recorded separately. Release status remains NOT YET ASSESSED.

After correcting the test assertion, the [integrated Chromium rerun](evidence/v1-local-2026-11-27/integrated-chromium-rerun.txt) passed 45 tests with four production-smoke cases skipped. The [local unit suite](evidence/v1-local-2026-11-27/integrated-unit.txt) passed 52 tests, [local database suite](evidence/v1-local-2026-11-27/integrated-db.txt) passed 63 tests and [lint](evidence/v1-local-2026-11-27/integrated-lint.txt) passed. These results apply to the uncommitted working tree based on `18c5549bb0d5c383ca2eb2eb502dbe09a199180f`; the earlier failed run remains recorded above. Production release status is NOT YET ASSESSED.

A subsequent [isolated WebKit rerun](evidence/v1-local-2026-11-27/webkit-integrated.txt) against the integrated working tree passed all seven selected accessibility, auth-dialog and keyboard tests. Firefox remains unverified because the local browser process cannot locate its profile directory; this is not evidence of a Firefox pass.

After the integrated Chromium and WebKit runs, [typecheck](evidence/v1-local-2026-11-27/integrated-typecheck.txt) and the [production build](evidence/v1-local-2026-11-27/integrated-build.txt) exited successfully on the local working tree. They do not establish the state of the existing production deployment.

### Command Center visual refinement — 2026-11-27

On the uncommitted local tree, the featured project was placed over existing architectural artwork, with restrained translucent focus and summary surfaces. Project selection now shows record-derived open tasks, progress and target dates. Desktop, tablet and mobile renders were inspected locally; this is not a production screenshot or design sign-off. The [dashboard, accessibility and responsive run](evidence/v1-local-2026-11-27/dashboard-redesign-check.txt) passed 14 tests; a subsequent hover-only interaction adjustment was followed by three passing targeted dashboard/accessibility tests. Lint and typecheck passed. Production release remains NOT YET ASSESSED.

## Reference-led redesign — 2026-11-28

Verifier: Codex and coordinated read-only/design/QA agents. Scope: uncommitted working tree based on `18c5549bb0d5c383ca2eb2eb502dbe09a199180f`. No release commit or production deployment was tested. See [reference analysis](command-center-reference-analysis.md) for mapping and the limitation that the video is a portrait crop of a landscape interface, not a mobile breakpoint.

- [Lint](evidence/v1-reference-2026-11-28/lint.txt), [typecheck](evidence/v1-reference-2026-11-28/typecheck.txt), [unit tests](evidence/v1-reference-2026-11-28/unit.txt) (52), [local pgTAP](evidence/v1-reference-2026-11-28/database.txt) (63), and [build](evidence/v1-reference-2026-11-28/build.txt) passed.
- [Full Chromium](evidence/v1-reference-2026-11-28/chromium-full.txt): 47 passed, four production smoke tests skipped. This run preceded a narrow-screen CSS-only change; [six targeted dashboard/canvas tests](evidence/v1-reference-2026-11-28/dashboard-followup.txt) passed after it.
- [WebKit initial](evidence/v1-reference-2026-11-28/webkit-first.txt): keyboard test passed, workspace audit timed out at login. [Isolated workspace retry](evidence/v1-reference-2026-11-28/webkit-retry.txt) passed. Firefox remains unverified.
- An [earlier targeted run](evidence/v1-reference-2026-11-28/initial-interrupted.txt) had two ambiguous-locator failures and was interrupted; the selectors were made precise, and the [targeted rerun](evidence/v1-reference-2026-11-28/targeted-rerun.txt) passed ten tests. An interrupted disposable local account was identified and removed locally.
- Local seed-data screenshots: [desktop Command Center](evidence/v1-reference-2026-11-28/screens/command-desktop.png), [tablet](evidence/v1-reference-2026-11-28/screens/command-tablet.png), [mobile](evidence/v1-reference-2026-11-28/screens/command-mobile.png), [320px](evidence/v1-reference-2026-11-28/screens/command-small.png), [projects](evidence/v1-reference-2026-11-28/screens/projects.png), [project detail](evidence/v1-reference-2026-11-28/screens/project-detail.png), [board](evidence/v1-reference-2026-11-28/screens/board.png), [planner](evidence/v1-reference-2026-11-28/screens/planner.png), and [archive](evidence/v1-reference-2026-11-28/screens/archive.png). These are local illustrations of the implementation, not production release assets or user approval.

The canvas uses the existing architectural image as a decorative background; its project, milestone and progress content comes from stored records. It does not implement a geographic map, fabricated dependencies or the video's hoverable historical charts. The remaining workspace screens received coordinated shared-surface updates rather than a complete reproduction of the reference composition. User visual approval, Firefox, production configuration, live AI, security and backup verification remain open. Production release status remains **NOT YET ASSESSED**; no production changes were made.
