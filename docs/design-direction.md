# Monolith design direction

**Status:** reference study and design decisions for the v1 build. Revised 2026-10-24.

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

**Difference:** Monolith keeps a dark graphite product surface and does not use a gallery, search, or member-count proof.

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

## 3. Visual direction

### Type

- **Display:** Instrument Serif for marketing headlines, page titles, and large empty-state statements. Loaded through `next/font`; no third-party asset hosting.
- **UI:** Geist for controls, labels, body copy, and tables.
- **Data:** Geist Mono for counts, percentages, dates in dense contexts, and the wordmark suffix.
- **Scale:** 12 / 13 / 14 / 16 / 18 / 22 / 28 / 36 / 56 / 72 px, tight leading on display type, 1.5–1.6 on body.

### Color and surfaces

- Graphite base: near-black with a faint cool cast, not pure black.
- Bone text: warm off-white rather than pure white.
- Violet is a single accent for focus, primary actions, and selected nav; it is not used as a background wash.
- Semantic colors: amber for in progress and warnings, emerald for completion, rose for overdue and destructive actions.
- Borders are 10–14% white. Shadows are rare and short. No glassmorphism, floating blobs, or gradient hero.

### Geometry and spacing

- Radius: 6 px for controls and cards, 999 px only for status dots/pills where meaning requires it.
- Spacing base: 4 px; layout rhythm 8/12/16/24/32/48/64.
- App rail: 248 px desktop; content max-width 1120 px.
- Marketing: 12-column grid, wide margins, section numbers, thin rules.
- Density: project/task surfaces are deliberately compact; marketing is roomy.

### Motion

- Micro feedback: 120–160 ms.
- Menus/popovers/dialogs: 160–200 ms ease-out; origin-aware.
- Board pickup: 140 ms lift; drop settles in 160 ms. No spring overshoot.
- Reduced motion: all durations collapse to 0.01 ms; no transform-based entrance is required to understand content.

### Component rules

- Primary button: solid violet, one per view where possible.
- Secondary: bordered graphite surface.
- Destructive: rose text/border with confirmation dialog.
- Status uses both color and text; color is never the only signal.
- Empty states state what is missing and give one next action.
- Loading uses skeletons shaped like the content, not spinners over blank pages.
- Errors name the failed action and preserve entered data.
- Focus is visible on every interactive element with a 2 px ring and offset.

## 4. Information architecture decisions

- Keep the existing rail: Command Center, Projects, Board, plus **Planner**.
- Milestones live on the project detail page, close to tasks and progress.
- Project settings (archive, delete) remain at the bottom of the detail page, visually separated.
- The planner is a two-state page: compose, then review/edit/confirm. It is never a chat transcript.
- AI configuration and quota are surfaced honestly. If the provider is not configured, the page explains which environment variables are missing and links back to manual project creation.

## 5. Implementation decisions

- Preserve the existing Next.js/Supabase architecture and shadcn primitives.
- Add `@dnd-kit` only for board dragging; keep the status select as the keyboard-accessible fallback.
- Add the OpenAI SDK only on the server. The key never enters a client bundle.
- Validate model output with Zod, then validate the edited plan again before persistence.
- Persist a confirmed plan atomically through a Postgres function; generation never writes.
- Add a per-user daily planner quota enforced in Postgres.
- Use Vitest for schema/domain tests and Playwright for committed browser flows.
- Do not add a general-purpose animation library for v1; CSS and Radix transitions cover the interaction needs without extra JavaScript.

## 6. Delivered in this build

- Instrument Serif display type with Geist UI type and mono data labels.
- A rebuilt public landing page built around one promise, a real HTML product preview, numbered editorial sections, and an AI-preview demonstration.
- A shared monolith mark, graphite surfaces, 6 px radii, hairline borders, and a single violet accent.
- Project detail with editable milestones and a milestone timeline.
- Planner compose/review/confirm surfaces with honest unconfigured and quota states.
- Drag-and-drop board with pickup lift, target-column emphasis, a status-select fallback, and an SSR-stable DndContext id.
- Dashboard metrics as one hairline ledger, a due-ordered next-up rail, and a planner entry point.
- Mobile navigation tightened to fit four destinations without clipping.

## 7. What is intentionally not in v1

- Collaboration, teams, billing, notifications, calendars, recurring tasks, mobile apps, autonomous agents, and analytics dashboards.
- Command palette, social login, and drag-to-reorder inside a column beyond status movement.
- Decorative 3D, custom cursor trails, and page-wide scroll effects.
