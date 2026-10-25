# Ember Obsidian delivery report

## Routes changed

- `/` — rebuilt as a concise obsidian/ember landing page: hero with large product preview, five-step Idea → Plan → Tasks → Execution → Progress pinned sequence, three-view product tour, closing CTA, compact footer.
- `/login`, `/signup` — Ember tokens, Syne display, Inter Tight interface.
- `/app` — Command Center: Syne page title, ember sidebar, animated metrics, ember chart and focus bars, tighter next-up/project panels.
- `/app/projects` and `/app/projects/[projectId]` — Syne project titles, ember progress, work table, milestone list, archive/delete controls.
- `/app/board` — ember board columns/cards, drop states, status controls, tab/board feedback.
- `/app/planner` — ember planner surface, preserved generation/review/confirm flow, Text Shimmer generation label.
- `/concepts` — retained as comparison artifacts; not part of production navigation.

## Visual decisions

- Obsidian `#080808` canvas, `#111111` card, `#191919` raised surface, `#F4F0E8` type, `#A5A09A` secondary text, `#FF5429` primary, `#A92316` deep ember, `#30302E` hairlines.
- Syne 700–800 display for hero/page/project titles; Inter Tight for interface/body; JetBrains Mono for metadata.
- Uppercase, tightly tracked display; sharp 8px base radius; tonal panels instead of generic glass.
- No purple/blue gradients in production. Concept previews keep their own exploration palettes.

## Actual sources integrated

| Source | File(s) | Behavior |
| --- | --- | --- |
| Aceternity UI Spotlight | `src/components/ui/spotlight.tsx`, `src/app/page.tsx` | Animated ember beam behind the hero |
| Magic UI Number Ticker | `src/components/ui/number-ticker.tsx`, `src/components/dashboard/metric-card.tsx` | Real metric values count in on view |
| Magic UI Shine Border | `src/components/ui/shine-border.tsx`, `src/app/page.tsx` | Animated ember border on hero preview and CTA |
| Motion Primitives Text Shimmer | `src/components/motion-primitives/text-shimmer.tsx`, `src/components/marketing/workflow-story.tsx`, `src/components/planner/planner-workspace.tsx` | AI-draft and generating labels |
| Anime.js | `src/components/milestones/milestone-item.tsx` | Scoped milestone completion pulse |
| 3dicons | `public/assets/3dicons/folder-color.png`, `src/components/shared/empty-state.tsx` | Actual CC0 3D folder asset in empty states |
| shadcn/ui | `src/components/ui/tabs.tsx`, product tour | Real tab behavior for Command/Board/Planner |
| GSAP | `src/lib/gsap.ts`, `src/components/motion/split-heading.tsx`, `src/components/marketing/workflow-story.tsx` | Split heading + pinned five-step sequence |
| Lenis | `src/components/motion/smooth-scroll.tsx` | Public-only smooth scroll, GSAP ticker sync |
| React Bits | `src/components/reactbits/*` | Studio spotlight surface, CTA click sparks |

Every other mandatory source and its access/decision status is recorded in `docs/design-source-implementation-matrix.md`. Blocked sources are not counted as implemented.

## Preserved

Authentication, protected routes, Supabase schema/RLS, API contracts, project/task/milestone CRUD, status persistence, archive/restore/delete, planner generation/review/confirm flow, tests, and environment conventions.

## Verification

- **Browser:** 1440, 1024, 768, 390 px; landing, login, `/app`, `/app/projects`, project detail, `/app/board`, `/app/planner`.
- Zero horizontal overflow after fixing the tablet PageHeader action row.
- Zero console/page errors in normal and reduced-motion contexts.
- Lenis public-only; anchor links (`#story`, `#product`, `#start`), hash history, keyboard tab order checked.
- Product tour tabs switch Command/Board/Planner and remain keyboard operable.
- Number Ticker, Shine Border, Spotlight, Text Shimmer, Anime.js milestone pulse, and 3dicons empty-state image verified in the running app.
- Reduced motion: Lenis off, GSAP skipped, all workflow details visible, Text Shimmer static, Anime.js skipped, no hydration errors.
- **Lint, typecheck, Vitest 20/20, Playwright 12/12, production build pass.**
- Production performance sample: CLS `0.0044`, no long tasks during scroll, ~10 MB JS heap.

## Blockers and exclusions

- OpenAI is not configured, so live planner generation remains disabled; the API correctly returns its configured error and the UI states it honestly.
- Refero authenticated screens are gated; not reviewed.
- 21st.dev registry installs require an API key/membership; not used.
- Uiverse is Cloudflare-blocked; MicroKit has no verified live component source.
- mapcn, Liquid Glass, Kitbitz, Kinetics were investigated and rejected for product fit/style/duplication; no source copied.
- No customer logos, testimonials, fabricated analytics, or AI output were added.
