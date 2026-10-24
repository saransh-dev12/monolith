# Monolith design direction

**Status:** revision 2, reference-first rebuild. The original dark graphite direction was rejected. The shipped direction is a warm paper surface with ink typography and a cobalt accent, supported by reused shadcn/ui application primitives and adapted Launch UI marketing structure. See `docs/design-sources.md` for licenses and exact reuse.

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

**Difference:** Monolith uses a warm paper and cobalt product surface and does not use a gallery, search, or member-count proof. (The original dark direction was superseded in revision 2.)

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

### Revision 2 — reuse research and selection

The rebuild was preceded by a second search for actual reusable implementations, not just visual references.

- **Launch UI (MIT, Copyright (c) 2024 Mikolaj Dobrucki):** selected for its Next.js 16 / Tailwind 4 / React 19 compatibility and copy-in structural primitives. Reused `Section`, `LayoutLines`, navbar/footer primitives, and the layout-line concept. Its visual hero, screenshots, glows, and copy were not reused.
- **shadcn/ui (MIT):** selected as the single component system. Added the official `sidebar`, `command`, `sheet`, `tooltip`, and `input-group` components. This replaces the hand-built shell rather than layering another library on top.
- **cmdk (MIT):** the command engine behind the shadcn palette, used for keyboard-first navigation.
- **dnd-kit (MIT):** retained for the Kanban move interaction.
- **Details.so / Design Spells / Spline / Manus / Skiper / Componentry:** studied for composition, motion, prompt-first hierarchy, and restraint. No proprietary code or assets were copied.
- **Refero.design:** still returns only a client-rendered document shell here. No specific Refero screen is claimed as observed.
- **21st.dev, Watermelon UI, Ruixen UI, Arc UI, Parable, UI Beats:** reviewed for discovery. Their previews were not treated as permission to copy source, and their API-key-gated registries were not added.

## 3. Visual direction

### Concept: cobalt blueprint on paper

The interface reads like a working project dossier rather than a dark SaaS dashboard. Warm paper surfaces, ink-black type, cobalt annotations, fine rules, and mono metadata create the identity. The product previews use the same surface and component language as the application.

### Type

- **Display:** Instrument Serif for marketing headlines, page titles, and large numeric statements. Italic is reserved for one emphasized phrase, not scattered decoration.
- **UI:** Geist for controls, body copy, tables, and forms.
- **Metadata:** Geist Mono for section numbers, timestamps, IDs, progress values, and small uppercase labels.
- **Scale:** 10 / 11 / 12 / 13 / 14 / 16 / 20 / 24 / 32 / 40 / 56 / 72 px. Display leading is 0.92–1.02; body leading is 1.55–1.7.

### Color and surfaces

| Role | Value | Use |
| --- | --- | --- |
| Background | warm paper `oklch(0.972 0.008 85)` | Page and marketing surface |
| Foreground | ink `oklch(0.205 0.012 75)` | Primary text |
| Card | near-white paper `oklch(0.992 0.004 85)` | Dossiers, forms, panels |
| Primary | cobalt `oklch(0.43 0.2 264)` | Primary actions, active nav, focus |
| Accent | pale cobalt `oklch(0.93 0.02 255)` | Selected navigation, soft emphasis |
| Muted | warm grey `oklch(0.49 0.012 75)` | Secondary labels and metadata |
| Border | ink at 14% | Hairlines and structure |
| Success | emerald 700 | Completion |
| Warning | amber 700 | In progress, configuration notice |
| Destructive | rose 600/700 | Overdue, delete |

No purple-grey gradients, glow fields, glassmorphism, decorative blobs, or mock charts. The cobalt band is the only large color field and is used once, for the AI planner story.

### Geometry and spacing

- Radius: 6 px for controls, nodes, and panels; 8 px only for a few large contained surfaces; pill shapes only for status labels.
- Layout: 4 px base unit; 8/12/16/24/32/48/64 rhythm.
- Marketing: centered 80 rem frame with visible dashed side rules on large screens; asymmetric hero; editorial section rules.
- Application: 16 rem collapsible sidebar, 6rem top bar, 72rem content cap, 24–40 px gutters.
- Borders carry hierarchy; shadows are rare and shallow.

### Navigation and responsive behavior

- Application shell: shadcn `Sidebar` with icon collapse, cookie-backed state, mobile sheet, tooltips, and a keyboard trigger. The old custom mobile nav row is removed.
- Header: sidebar trigger, brand on mobile, command-palette trigger, and one global New project action.
- Command palette: `⌘K`/`Ctrl+K`, keyboard navigation, real route destinations, Radix dialog portal.
- Marketing: sticky paper header; anchor navigation on desktop; account CTAs remain visible on mobile.
- Breakpoints reviewed at 1440, 1024, 768, and 390 px.

### Motion

- Control feedback 120–160 ms; dialogs/menus/sheets 160–200 ms with origin-aware transforms.
- Board pickup lifts with a 140 ms shadow and opacity shift; the target column gains a cobalt border; drop settles without bounce.
- Progress only animates when a stored value changes.
- Reduced motion collapses all durations to 0.01 ms.
- No animation library added; CSS transitions, Radix state animations, and `tw-animate-css` are sufficient.

### Component rules

- Primary cobalt button: one per view where possible.
- Secondary: paper surface with ink border.
- Destructive: rose outline plus confirmation dialog.
- Status uses text and color; color is never the only signal.
- Empty states name the missing object and offer one action.
- Loading uses content-shaped skeletons.
- Errors preserve entered data and name the failed action.
- Illustrative marketing data is labeled; application data comes from Supabase.
- All menus, dialogs, and the command palette render in portals above the sticky header.

## 4. Information architecture decisions

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

- Preserve the existing Next.js/Supabase architecture, APIs, database schema, authentication, RLS, and AI-plan persistence contract. The rebuild changes presentation and navigation only.
- Use shadcn/ui as the single primitive layer. The official sidebar and command components replace the previous hand-built shell and add a keyboard-first navigation surface.
- Reuse Launch UI's MIT structural primitives for marketing rhythm, with original Monolith content and product previews.
- Keep dnd-kit for status movement and the select control as the keyboard fallback.
- Keep Zod validation, server-only OpenAI calls, planner quota, and atomic plan confirmation unchanged.
- Add no animation library and no second design system.
- Ship a light paper-and-cobalt interface; retain the dark token block only as unused future groundwork, not as a hidden active theme.

## 6. Delivered in this build

- Rebuilt marketing page: sticky header, asymmetric serif hero, project dossier preview built from Monolith badges and progress, four-step workflow rail, cobalt AI-planner section, security ledger, final CTA, and editorial footer.
- Replaced the application shell with the shadcn collapsible sidebar, mobile sheet, account menu, header command trigger, and global New project action.
- Added a keyboard command palette with real workspace destinations and the archived-projects view.
- Rethemed every application surface to warm paper with ink borders and cobalt accents, including dashboard metrics, project list/detail, milestones, board, planner, auth, dialogs, menus, toasts, loading, and error states.
- Removed duplicate primary actions, fixed the 1024 px dashboard overflow, corrected status color contrast for light surfaces, and added an SSR-stable DnD context id.
- Browser-reviewed at 1440, 1024, 768, and 390 px. No horizontal overflow on marketing or workspace routes.
- Automated checks: 20 Vitest tests, 36 pgTAP tests, 8 Playwright flows, lint, typecheck, and production build.
- Accessibility: an axe-core WCAG 2.0/2.1 A/AA scan reported zero violations across 12 page/viewport combinations and four overlays (command palette, project dialog, account menu, mobile sidebar).

## 7. What is intentionally not in v1

- Collaboration, teams, billing, notifications, calendars, recurring tasks, mobile apps, autonomous agents, and analytics dashboards.
- Command palette, social login, and drag-to-reorder inside a column beyond status movement.
- Decorative 3D, custom cursor trails, and page-wide scroll effects.
