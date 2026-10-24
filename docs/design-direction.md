# Monolith design direction

**Status:** revision 4, reference-dashboard fidelity pass. Revision 3's dark editorial system ("signal in the dark": Fraunces + Plus Jakarta Sans + JetBrains Mono, deep charcoal + electric cobalt) is retained as the identity foundation; revision 4 evolves the dashboard composition and card physics toward the supplied StatsCard benchmark instead of replacing the palette or type system wholesale. See `docs/design-sources.md` for licenses and exact reuse.

## 1. Repository audit summary

### Confirmed stack and architecture

- Next.js 16.4.3 App Router with React 19.3.0 and TypeScript 5.9.3, npm lockfile committed.
- Tailwind CSS 4.3.3 with Turbopack, shadcn/ui primitives (radix-nova preset), Lucide icons.
- Supabase Postgres + Auth through `@supabase/ssr` 0.12.7, with cookie sessions and a `src/proxy.ts` session refresh.
- Server Components for reads, Route Handlers for mutations, Zod validation at boundaries.
- SQL migrations under `supabase/migrations`, local seed in `supabase/seed.sql`, pgTAP tests in `supabase/tests`.
- No deployment credentials or production project are configured locally.

### Verified functionality

- Email/password sign-up, sign-in, sign-out, callback exchange, and protected `/app` routes.
- Owner-scoped projects, tasks, and milestones with RLS, explicit grants, cascade delete, archive/restore.
- Project/task CRUD, task status changes, board status persistence, Command Center metrics.
- 21 pgTAP tests pass for isolation, constraints, grants, archive retention, and cascade behavior.
- Lint, typecheck, and production build pass. Browser checks previously verified auth, CRUD, status persistence, cross-user denial, CSRF rejection, and mobile layout.

### Gaps and weaknesses found

- Milestones could only be viewed, not created, edited, completed, or deleted.
- No AI planning workflow, no planner quota, no atomic plan persistence.
- No drag-and-drop; status movement relied on a select control only.
- No committed unit or browser test suite; verification was ad hoc.
- No CI workflow and no deployment validation.
- Visual language still read as a polished starter: shadcn defaults, repeated cards, no distinctive typographic voice, and a marketing page that explained the product more than it demonstrated it.
- No explicit empty states for a first-run planner or milestone list.
- OpenAI credentials are placeholders; live generation cannot be verified in this environment.
- Refero.design content is client-rendered and returned only its document shell to this environment, so no specific Refero screens were claimed as observed.

## 2. Reference findings

### Details.so — editorial pacing and public storytelling

**Examined:** landing page, inspiration taxonomy, featured grid, footer and FAQ.

**Observed principles**

- A short declarative promise carries the page: “The details behind the world's best websites.” Supporting copy stays concrete.
- Small uppercase metadata, large display type, and generous vertical spacing create rhythm without decorative backgrounds.
- Dense content is made calm by a strict grid, thin separators, and restrained interaction chrome.
- The page moves from promise to demonstration to taxonomy to proof, rather than stacking feature cards.

**Application in Monolith**

- Rewrite the marketing page around one promise and one product demonstration. Use compact uppercase labels for context and a display serif for headlines.
- Replace the three identical feature cards with numbered editorial sections: plan, execute, review.
- Show a real HTML reconstruction of the workspace rather than an abstract illustration.

**Difference:** Monolith uses a sophisticated dark graphite surface with electric cobalt and does not use a gallery, search, or member-count proof.

**Fidelity:** approximate principle, original layout and assets.

### Refero.design — product experience

**Attempted:** home, `/apps`, sitemap, and an app route. All returned only a client-rendered document shell with no inspectable interface content in this environment.

**Limitation documented.** No specific screen, flow, or visual detail from Refero is claimed as an observation. Product navigation and interaction decisions below are grounded in the existing repository, the product scope, and direct browser verification rather than fabricated Refero study.

### Design Spells — motion with a reason

**Examined:** the index and the X bookmark-sheet transition, Transit profile-menu animation, Things delete confirmation, and Granola sidebar-icon entries.

**Observed principles**

- Motion clarifies origin and state change: sheets rise from their trigger; menus animate from the control that opened them.
- Short, ease-out transitions dominate. Longer motion is reserved for spatial or celebratory changes.
- Small feedback details matter when they confirm an action, not when they decorate an idle screen.

**Application in Monolith**

- Dialogs and menus keep Radix origin-aware transforms at roughly 150–200 ms.
- Board pickup lifts the card with a slight scale and shadow; the target column gains a quiet accent border. The drop then settles immediately.
- Progress and milestone completion animate only when a stored value changes.
- Every animation has a `prefers-reduced-motion` fallback. No parallax, fake physics, or ambient loops.

**Fidelity:** approximate behavior, original implementation.

### Spline — product as the hero

**Examined:** landing narrative, interactive example categories, product-demo embedding, and closing CTA.

**Observed principles**

- The product demonstration is the visual centerpiece, not an abstract graphic.
- Dark surfaces and large type carry the composition; color is concentrated in the work itself.
- Section transitions are deliberate and roomy.

**Application in Monolith**

- The landing hero pairs a large editorial statement with a functional-looking board/plan reconstruction built from the same tokens as the app.
- No 3D, WebGL, or copied assets. Product clarity over spectacle.

**Fidelity:** principle only.

### Skiper UI — interaction restraint

**Examined:** component index, command palette, dynamic island, drag/scroll treatments, and hover examples.

**Observed principles**

- Small, precise interactions create perceived quality: pressed states, cursor-aware reveals, menu transitions.
- A command palette works when it removes navigation friction; it is not decoration.

**Application in Monolith**

- Tighten hover/press/focus states on nav, cards, and icon buttons.
- Do not add a command palette to v1; the product is small enough that a visible rail is faster and more learnable.

**Fidelity:** principle only.

### Manus — prompt-first focus

**Examined:** landing hero and prompt composer.

**Observed principles**

- One dominant input and a small set of obvious next actions.
- The interface frames AI as a starting point, not the whole product.

**Application in Monolith**

- The planner page is prompt-first: a single idea field, three optional context controls, and one primary action.
- The generated plan is always a review surface with explicit confirmation. AI never writes directly from generation.

**Fidelity:** approximate interaction pattern.

### Componentry — component quality without a circus

**Examined:** landing, component taxonomy, motion-oriented previews.

**Observed principles**

- A restrained page with one strong statement and a visible install action feels more credible than a wall of effects.
- Motion is a component property, not a page-wide theme.

**Application in Monolith**

- Keep effects library-free where CSS is sufficient. Use the existing Radix enter/exit utilities and `tw-animate-css`.
- No new animation dependency for v1; motion is implemented at the control and board level.

**Fidelity:** principle only.

### Revision 3 — typography, dark surfaces, and motion

Revision 2 kept the reference-led structure but was rejected on visual quality. Revision 3 preserves the reused application shell and marketing structure, then replaces the visual system and interaction layer:

- **Typography:** Fraunces for editorial display, Plus Jakarta Sans for interface text, JetBrains Mono for technical metadata. All are loaded through `next/font/google` (SIL OFL 1.1).
- **Theme:** a complete dark token system with deep charcoal foundations, layered graphite surfaces, bone text, and an electric cobalt accent. The unused light token set was removed.
- **Motion:** Motion for React 14.6.0 (`motion/react`) with shared duration, easing, spring, reveal, and hover variants. `MotionConfig reducedMotion="user"` plus explicit reduced-motion CSS covers hover lift, reveals, route transitions, and animated content.
- **Reuse:** Launch UI (MIT) structural primitives and shadcn/ui (MIT) sidebar, command palette, sheet, tooltip, and form primitives remain. No additional design system was introduced.

## 3. Visual direction

### Concept: signal in the dark

Monolith reads like a precise technical instrument: near-black work surfaces, graphite panels that lift through tonal contrast, bone typography, and a single electric cobalt signal. Editorial serif headlines give the marketing site and page titles a recognizable voice; compact geometric sans text keeps the workspace fast to scan.

### Type

- **Display:** Fraunces, variable. Marketing headlines, workspace page titles, project names, and large metrics. Italic is used for one emphasized phrase; weight stays in the 400–600 range.
- **Interface:** Plus Jakarta Sans. Body copy, navigation, labels, buttons, task titles, table content, and forms. Optimized for 12–16 px legibility.
- **Metadata:** JetBrains Mono. Section numbers, IDs, timestamps, progress values, keyboard hints, and short annotations.
- **Scale:** 10 / 11 / 12 / 13 / 14 / 16 / 20 / 24 / 32 / 40 / 56 / 72 px. Display leading 0.95–1.02, body leading 1.5–1.65. Tight negative tracking only on display sizes.
- **Rules:** Editorial type is not used for task names, menu items, table cells, or compact controls. Dense workspace rows stay in the interface face.

### Color and surfaces

| Role | Value | Use |
| --- | --- | --- |
| Background | `oklch(0.145 0.012 265)` | App canvas and marketing base |
| Card | `oklch(0.185 0.014 265)` | Primary panels, cards, dossier |
| Popover | `oklch(0.205 0.015 265)` | Menus, dialogs, command palette |
| Foreground | `oklch(0.96 0.006 90)` | Primary text |
| Muted foreground | `oklch(0.70 0.014 265)` | Secondary text and metadata |
| Primary | `oklch(0.64 0.19 264)` | Actions, active navigation, focus, accent |
| Primary foreground | `oklch(0.12 0.01 265)` | Text on cobalt |
| Accent panel | `oklch(0.235 0.075 264)` | AI planner band and auth panel |
| Border | bone at 12% | Separators and surface edges |
| Success | emerald 300/400 | Completion |
| Warning | amber 300/400 | In progress and setup notices |
| Destructive | rose 300/400 | Overdue and delete actions |

Elevation is carried by tonal surface steps and hairlines, not heavy shadows. Shadows are used only for floating menus, dialogs, the product dossier, and drag overlays. No purple gradients, green-tinted charcoal, glassmorphism on routine surfaces, or decorative glow fields.

### Geometry and spacing

- Radius: 8 px base; 12–14 px for large panels and dialogs; pills only for status and counts.
- Spacing: 4 px base; 8/12/16/24/32/48/64 rhythm.
- Marketing frame: 80 rem max width, 24–40 px gutters, dashed vertical layout rules on desktop.
- Workspace: 16 rem collapsible sidebar, 56 px sticky header, 72 rem content cap.
- Borders are 1 px at 10–14% bone; stronger borders are reserved for focus, drag targets, and destructive actions.

### Motion

- **Library:** Motion for React 14.6.0.
- **Durations:** micro 140 ms, fast 200 ms, base 280 ms, reveal 550 ms, route 240 ms.
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` for entrances; springs (`stiffness 420`, `damping 30`, `mass 0.7`) for hover lift.
- **Shared variants:** hero/section reveal, stagger container, route fade/slide, planner draft entrance, auth card entrance, card hover lift, board card lift, drag overlay scale/fade.
- **Reference behavior:** interactive cards lift by 5 px on hover, matching the supplied animated-card benchmark. Completed work is not animated as if it were still loading.
- **Reduced motion:** `MotionConfig reducedMotion="user"` plus `data-motion-*` CSS overrides set transforms to none and reveal/route opacity to 1. Hover lift, reveals, and route motion become static; content never stays hidden.
- **Performance:** transform and opacity only, no layout animation on dense lists, no perpetual decorative motion.

### Component rules

- One cobalt primary action per view where practical.
- Secondary actions use graphite surfaces with bone borders.
- Destructive actions use rose outline plus confirmation.
- Status uses text plus color.
- Focus rings are cobalt and visible on every interactive element.
- Empty states name the missing object and offer one next action.
- Loading uses shape-matched skeletons.
- Marketing previews are labeled as illustrative; application data comes from Supabase.
- All overlays render in portals above the sticky header.

## 4. Information architecture decisions

- Keep the existing rail: Command Center, Projects, Board, plus **Planner**.
- Milestones live on the project detail page, close to tasks and progress.
- Project settings (archive, delete) remain at the bottom of the detail page, visually separated.
- The planner is a two-state page: compose, then review/edit/confirm. It is never a chat transcript.
- AI configuration and quota are surfaced honestly. If the provider is not configured, the page explains which environment variables are missing and links back to manual project creation.

## 5. Implementation decisions

- Preserve the existing Next.js/Supabase architecture, APIs, database schema, authentication, RLS, planner quota, and atomic plan persistence. This redesign changes presentation and interaction only.
- Keep shadcn/ui as the single primitive layer and retain the official sidebar and command palette.
- Keep the MIT Launch UI structural primitives for marketing rhythm, with original Monolith content and product previews.
- Use one motion system: `src/lib/motion.ts` plus `src/components/motion/*`.
- Respect reduced motion through both MotionConfig and CSS overrides; reduced-motion initial markup matches the server to avoid hydration mismatches.
- Remove the unused light token set so every active component resolves against the dark system.
- Retain dnd-kit and the accessible status-select fallback.

## 6. Delivered in this build

- Dark visual system across marketing, auth, shell, dashboard, projects, project detail, milestones, board, planner, dialogs, menus, toasts, loading, and error states.
- New type system: Fraunces, Plus Jakarta Sans, JetBrains Mono, with display/interface/metadata roles and a tuned scale.
- Marketing hero and section reveals, interactive product dossier and planner preview lift, hover/press states, and a deep cobalt AI band.
- Shared route transition, reveal, and hover-lift components; planner draft and auth card entrances.
- Kanban drag feedback retained with animated hover and drag overlay; pointer drag covered by an end-to-end test.
- Reduced-motion verification: no hover lift, reveals resolve to visible, no hydration errors.
- Browser review at 1440, 1024, 768, and 390 px; no horizontal overflow.
- Automated checks: 20 Vitest tests, 36 pgTAP tests, 10 Playwright flows, lint, typecheck, and production build.
- Accessibility: axe-core WCAG 2.0/2.1 A/AA audit reported zero violations across 12 page/viewport combinations and four overlays (command palette, project dialog, account menu, mobile sidebar) after animations settled.

## 7. What is intentionally not in v1

- Collaboration, teams, billing, notifications, calendars, recurring tasks, mobile apps, autonomous agents, and analytics dashboards.
- Command palette, social login, and drag-to-reorder inside a column beyond status movement.
- Decorative 3D, custom cursor trails, and page-wide scroll effects.
