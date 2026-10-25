# Design sources and reuse record

This document records the reference-first research and the libraries, components, and code reused in the Monolith interface. It distinguishes directly reused implementations from patterns that were only studied.

## 1. Directly reused code

### Launch UI — structural marketing primitives

- **Source:** https://github.com/launch-ui/launch-ui
- **License:** MIT
- **Copyright:** Copyright (c) 2024 Mikolaj Dobrucki
- **Used in:** `src/components/marketing/foundation.tsx` and `src/app/globals.css` (`max-w-container` utility) in earlier revisions. The Ember Obsidian landing no longer imports the Launch UI primitives; they remain in the repository as part of the audit trail.
- **What was reused:** the `Section`, `LayoutLines`, `Navbar`/`NavbarLeft`/`NavbarRight`, and footer primitive composition, plus the structural layout-line idea. These were adapted for Monolith's dark surface, spacing, and content.
- **What was not reused:** Launch UI screenshots, dashboard images, logos, the glow/beam effects, its centered gradient hero, and its demo copy. Monolith's hero, product dossier, workflow rail, AI section, security section, and previews are original compositions using shared product components.
- **Changes:** light-only branches and gradient/glass helpers were not used. The primitives were reduced to the parts needed for Monolith's dark layout and spacing system.

### shadcn/ui — application shell and command surfaces

- **Source:** https://github.com/shadcn-ui/ui and https://ui.shadcn.com
- **License:** MIT
- **Copyright:** Copyright (c) 2023 shadcn
- **Installed components:** `sidebar`, `command`, `sheet`, `tooltip`, `input-group`, `skeleton`, plus existing `dialog`, `dropdown-menu`, `alert-dialog`, `button`, `badge`, `card`, `input`, `label`, `progress`, `select`, `separator`, `sonner`, `tabs`, `textarea`.
- **Used in:** `src/components/ui/*`, `src/components/shell/app-sidebar.tsx`, `src/components/shell/command-palette.tsx`, `src/components/shell/account-menu.tsx`, `src/app/(workspace)/app/layout.tsx`.
- **Reuse method:** copied through the official shadcn CLI. The source remains in the repository under `src/components/ui` and is modified for Monolith's tokens, layout, and behavior.
- **Changes:** the mobile detection hook was rewritten with `useSyncExternalStore` to satisfy the repository's React lint rules and avoid setting state synchronously inside an effect. The command palette composition wraps the shadcn command primitives in `Command` explicitly because the installed dialog does not provide that context itself.

### shadcn-sidebar hook pattern

- **Source:** the `use-mobile` hook distributed with shadcn/ui's sidebar.
- **License:** MIT.
- **Used in:** `src/hooks/use-mobile.ts`.
- **Changes:** reimplemented with `useSyncExternalStore`; the media-query contract is unchanged.

## 2. Dependencies with reusable UI code

| Package | Version | License | Role |
| --- | --- | --- | --- |
| `cmdk` | 1.1.1 | MIT (Copyright (c) 2022 Paco Coursey) | Command palette engine used by the shadcn command component |
| `radix-ui` | 1.8.1 | MIT | Dialog, dropdown, tooltip, progress, select, and other accessible primitives |
| `@dnd-kit/core` | 6.3.1 | MIT (Copyright (c) 2021 Claudéric Demers) | Kanban drag-and-drop |
| `@dnd-kit/utilities` | 3.2.2 | MIT | Drag transforms |
| `lucide-react` | 1.61.0 | ISC | Icons |
| `sonner` | 2.0.8 | MIT (Copyright (c) 2023 Emil Kowalski) | Toast feedback |
| `motion` | 14.6.0 | MIT | Shared animation system (`motion/react`) |
| `gsap` / `@gsap/react` | 3.15.0 / 2.1.2 | GSAP standard "no charge" | Pinned scroll, SplitText, hero/workflow choreography |
| `lenis` | 1.3.27 | MIT | Public smooth scrolling |
| `animejs` | 4.2.2 | MIT | Milestone completion pulse only |
| `class-variance-authority` | 0.7.1 | Apache-2.0 | Component variants |
| `cn` | 0.5.0 | MIT (shadcn) | Class-name merge utility used by shadcn components |
| `tw-animate-css` | 1.4.0 | MIT (Copyright (c) 2025 Wombosvideo) | Radix enter/exit animation utilities |
| `@supabase/ssr`, `@supabase/supabase-js` | 0.12.7, 2.118.0 | MIT | Authentication and data access |
| `openai` | 7.43.0 | Apache-2.0 | Server-only planner client |
| `next`, `react`, `react-dom` | 16.4.3, 19.3.0 | MIT | Application runtime |
| `tailwindcss` | 4.3.3 | MIT | Styling engine |
| `zod` | 4.6.7 | MIT | Runtime validation |

The license files for installed dependencies remain in `node_modules` as distributed and are not removed or modified.

## 3. Fonts and assets

- **Syne** — SIL Open Font License 1.1. Production display face for Ember Obsidian, loaded through `next/font/google`; no font files are committed.
- **Inter Tight** — SIL Open Font License 1.1. Production interface face, loaded through `next/font/google`; no font files are committed.
- **JetBrains Mono** — SIL Open Font License 1.1. Production metadata face, loaded through `next/font/google`; no font files are committed.
- **Concept preview fonts** — Archivo Black, Space Mono, Instrument Serif, Manrope, JetBrains Mono, Bodoni Moda, and Inter Tight, all SIL Open Font License 1.1, loaded only in `src/app/concepts/layout.tsx` through `next/font/google`. No font files are committed.
- No stock photos, proprietary illustrations, Launch UI screenshots, or third-party brand assets are included. The Monolith mark is original SVG geometry.

## 4. License notices for copied code

The following notices apply to the directly adapted code listed above.

### Launch UI

```text
MIT License

Copyright (c) 2024 Mikolaj Dobrucki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### shadcn/ui

```text
MIT License

Copyright (c) 2023 shadcn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 4.1 Supplied motion reference

The user-provided animated-card example (React + Framer Motion, `whileHover={{ y: -5 }}`) was used as the quality benchmark for Monolith's hover lift and spring behavior. No code or assets from that example were copied into the repository; Monolith implements its own shared variants in `src/lib/motion.ts` using Motion for React.

### Supplied StatsCard code still (Image 1, inspected 2026-10-24)

- **Observed:** `StatsCard = ({ title, value, change, icon: Icon, gradient })` rendering `motion.div whileHover={{ y: -5 }}` with `className="glass-card p-6 rounded-2xl"`, title `text-sm text-white/60`, value `text-2xl font-bold text-white`, change row `flex items-center gap-1 text-sm text-emerald-400` with `ArrowUpRight size={16}` and `{change}%`.
- **Reused pattern (independent implementation, no copied code):** Monolith's `src/components/dashboard/metric-card.tsx` now follows the same composition — motion lift `y: -5` on hover with the shared `springLift`, `glass-card rounded-2xl p-6` surface, muted title, large tabular value, icon tile, and tone-aware meta row. The `gradient` prop and fabricated `% change` were deliberately not reproduced: Monolith has no historical analytics source, so the meta row shows only trustworthy derived state ("Not archived", "Todo and in progress", "Needs attention today" / "Nothing past due").
- **Utility:** `glass-card` added in `src/app/globals.css` as an original restrained implementation (layered card gradient, hairline highlight, deep soft shadow, 10px blur). Applied only to stats, project cards, board drop-targets, and dashboard panels — not as a page-wide glassmorphism treatment.

### Supplied motion videos (Images 2–3, MP4 placeholders)

- **Limitation:** the two additional supplied references arrived as MP4 file placeholders with no playable video content accessible in this environment. No specific layout, timing, easing, or interaction from those videos is claimed as observed. Motion decisions for this iteration remain grounded in Image 1, the previously studied Design Spells / Skiper / Componentry principles, and direct browser verification.

## 4.2 October reference videos (directly inspected via local files)

Both videos were accessed at `~/Downloads` and inspected through `ffmpeg`-extracted frames (3 frames each); no code, assets, or footage were copied.

### Reference 1 — Inventory Management Dashboard (`ScreenRecording_10-19-2026`, 36s, `_code_and_chill_`)

- **Observed frames:** (1) revenue area chart `$292,520 +29.7% vs the 90 days before` with 7/30/90-day toggle, tooltip `$3.5k Mon, Sep 21`, caption "Three ranges, one line that re-draws"; (2) Wharf stock table — sidebar taxonomy, header blocks (Products 14, Below par 3, Out of stock 1, Stock value $38,391), filters All/Running low/Out of stock/All categories, rows with SKU/category/level-against-par bars/status pills/Receive actions; (3) appearance picker with Light/System/Dark segmented control and yellow/mint/pink/blue accent swatches.
- **Adapted (independent implementation):** `ExecutionChart` range-toggle/redraw/tooltip composition and honest captioning; `WorkTable` header blocks, filter tabs, proximity bars, status pills; `ThemeSwitcher` Light/System/Dark segmented control. Accent swatches, inventory domain, SKU/stock values, and revenue figures were not reproduced — Monolith shows only its own project-execution rows.
- **Reuse:** none; patterns only.

### Reference 2 — code.xr Dashboard V18 (`ScreenRecording_10-24-2026`, 9s)

- **Observed frames:** "Dashboard V18 — Modern & Minimal UI" title; the StatsCard `whileHover={{ y: -5 }}` glass-card code (same as Image 1); light profile dashboard (Hannah Brooks, Available badge, Projects-shipped / 107 / 2,027 / 315 metric cards, About, Focus-this-week Mon–Sun bars 30.7h, Recent activity, dark icon rail); alternate team layout (lavender banner, members, 3.2h, May 2023 calendar, statistics, notifications).
- **Adapted (independent implementation):** `MetricCard` hover-lift/icon-tile composition; `WeekStrip` Mon–Sun completion bars; lavender banners, profile identity, avatars, calendar, and team modules were not reproduced — Monolith is a project-execution workspace, not a profile app.
- **Reuse:** none; patterns only.

## 4.3 Revision 5 type and theme provenance

- **Space Grotesk, Inter, IBM Plex Mono** — all SIL Open Font License 1.1, loaded through `next/font/google`; no font files committed. Chosen from the reference set's operational grotesk/tabletnumeric voice (inventory table density, V18 geometric sans) to replace Fraunces/Plus Jakarta Sans/JetBrains Mono meaningfully.
- **Theme engine** — `next-themes` 0.4.6 (MIT), already a dependency; now wired through `ThemeProvider` with `attribute="class"`, system default, and a segmented Light/System/Dark switcher adapted from the inventory appearance frame. Single amber signal replaces cobalt; no multi-accent theming (unsupported by the product).

## 5. References studied without code reuse

### details.so

- **Examined:** landing page, inspiration taxonomy, featured grid, FAQ, footer.
- **Findings used:** short declarative promise, editorial pacing, small uppercase metadata, large display type, thin separators, and product demonstration over feature-card repetition.
- **Reuse:** none. Monolith's copy, layout, and visuals are original.

### designspells.com

- **Examined:** index, X bookmark-sheet transition, Transit profile-menu animation, Things delete confirmation, Granola sidebar icon entry.
- **Findings used:** origin-aware menus and sheets, short ease-out transitions, drag pickup feedback, and confirmation feedback with reduced-motion fallbacks.
- **Reuse:** none; implemented with CSS and Radix/shadcn motion utilities.

### Spline

- **Examined:** landing composition, product demo embedding, category presentation.
- **Findings used:** product-as-hero and generous section rhythm.
- **Reuse:** none; no 3D, media, or assets from Spline.

### Manus

- **Examined:** prompt-first landing surface and composer.
- **Findings used:** one dominant planner input with optional context and one primary action.
- **Reuse:** none.

### Skiper UI

- **Examined:** component index and interaction examples.
- **Findings used:** restrained hover/press feedback and command-palette discoverability.
- **Reuse:** none; Monolith uses shadcn's command component and its own palette content.

### Componentry

- **Examined:** landing, component taxonomy, hover/preview behavior.
- **Findings used:** one strong statement, restrained effects, and interaction as a component property.
- **Reuse:** none.

### Refero.design

- **Attempted:** home, `/apps`, sitemap, and an app route.
- **Limitation:** the site returned only a client-rendered document shell in this environment, so no specific screen or interaction is claimed as observed. Monolith's product IA was validated against the running application and the repository's existing workflows, not fabricated Refero study.

### Additional discovery

- **21st.dev:** reviewed hero listings and license metadata. The useful components commonly require a 21st API key and often add a motion dependency; not selected.
- **Watermelon UI / Ruixen UI / Arc UI / Parable / UI Beats:** reviewed as discovery sources for section patterns. None were installed; their demos alone are not treated as permission to copy source or assets.
- **Launch UI:** selected after verifying the MIT license and Next.js 16 / Tailwind 4 compatibility.

## 6. Deliberate exclusions

- No Aceternity/Magic UI-style glow or gradient effects were added; they would intensify the generic AI aesthetic the rebuild is meant to avoid.
- Earlier revisions added no animation dependency; the Phase 2 motion addendum now adds GSAP 3.15.0 and Lenis 1.3.27 with explicit ownership and cleanup rules. Motion for React remains the ordinary UI animation layer. See `docs/motion-toolkit.md`.
- No third-party dashboard screenshots were used as product previews. The landing preview is assembled from Monolith's own `Progress`, `TaskStatusBadge`, `ProjectStatusBadge`, `Button`, and typography.
- No customer logos, testimonials, usage numbers, or fake integrations are shown.

## 7. Phase 1 concept exploration (isolated previews)

Three preview routes were added under `src/app/concepts` with static demo data in `src/components/concepts/demo.ts`. They are not linked from the product, are marked `noindex` in `src/app/concepts/layout.tsx`, and contain no Supabase calls or mutations. Details and screenshots are in `docs/concepts.md` and `docs/concepts/`.

### Reuse in Phase 1

- **None.** No component source, screenshot, illustration, or asset was copied from Details.so, Refero.design, Design Spells, Skiper UI, Componentry, Spline, Manus, the two supplied dashboard recordings, or any component marketplace.
- The previews reuse only Monolith's own dependencies: `motion` (MIT), `lucide-react` (ISC), Tailwind CSS, and React/Next.js.
- The supplied recordings were used as visual benchmarks for range controls, area charts, stat cards, focus-week bars, table density, and theme selection. The October 19 and October 24 patterns are adapted to project data; no inventory or profile-app features were introduced.

### Concept fonts

Concept typefaces are loaded through `next/font/google` inside `src/app/concepts/layout.tsx`. Production now uses Syne, Inter Tight, and JetBrains Mono from the root layout; Archivo Black, Space Mono, Instrument Serif, Manrope, Bodoni Moda, and Inter Tight remain available only to the concept previews:

| Face | License | Role in previews |
| --- | --- | --- |
| Archivo Black | SIL OFL 1.1 | Concept A display |
| Space Mono | SIL OFL 1.1 | Concept A interface/data |
| Instrument Serif | SIL OFL 1.1 | Concept B display |
| Manrope | SIL OFL 1.1 | Concept B interface |
| JetBrains Mono | SIL OFL 1.1 | Concept B metadata |
| Bodoni Moda | SIL OFL 1.1 | Concept C display |
| Inter Tight | SIL OFL 1.1 | Concept C interface |

### Removal before release

The concept routes are internal comparison artifacts. If the chosen direction is implemented, `/concepts` should either be deleted or kept behind an authenticated, non-indexed review flag. It currently exposes only illustrative demo data and no user records.

## 8. Phase 2 production delivery — Kinetic Digital Atelier

Concept B was selected and implemented across production. The preview routes remain isolated and unlinked.

### Fonts now used in production

| Face | License | Role |
| --- | --- | --- |
| Instrument Serif | SIL OFL 1.1 | Display headlines, page titles, project names, metric totals |
| Manrope | SIL OFL 1.1 | Interface, headings, body, dense rows |
| JetBrains Mono | SIL OFL 1.1 | Eyebrows, metadata, counts, keyboard hints |

All three load through `next/font/google` in `src/app/layout.tsx`. Concept-only faces (Archivo Black, Space Mono, Bodoni Moda, Inter Tight) load only in `src/app/concepts/layout.tsx`.

### Phase 2 reuse

- **None.** No third-party component source, illustration, screenshot, or asset was copied. The landing demos, workflow stage, board preview, planner preview, and all product surfaces are original implementations using Monolith's own tokens and data shapes.
- The supplied October 19 and October 24 recordings informed range controls, area-chart redraw, focus-week bars, stat cards, table density, and theme selection only. No inventory, profile, or unrelated app features were imported.
- Illustrative landing sections are explicitly labelled; product surfaces continue to read only owner-scoped Supabase rows. No fabricated analytics, customers, or AI output were added.

### Phase 2 verification

- Authenticated routes checked at 1440, 1024, 768, and 390 px: `/app`, `/app/projects`, `/app/projects/[projectId]`, `/app/board`, `/app/planner`; public `/` and `/login`.
- Zero horizontal overflow and zero console/page errors in Chromium; no hydration warnings after the theme-switcher mount gate.
- Light and dark themes checked; reduced-motion checked on the board and landing.
- Lint, typecheck, Vitest 20/20, Playwright 12/12, and production build pass.
- Playwright drag coverage now uses a real board card so the drag handle and target column are visible together; the moved card is returned to Todo after the assertion to keep the demo seed stable.


## 9. Motion toolkit addendum

GSAP, Lenis, and selected React Bits components were researched, licensed, and integrated after Phase 2. Full ownership, source links, licenses, reduced-motion behavior, and verification are recorded in `docs/motion-toolkit.md`.

- **GSAP 3.15.0** — Standard "no charge" license; ScrollTrigger, SplitText, and the React `useGSAP` integration. Used for hero typography, the pinned marketing workflow, and three concept motion studies.
- **Lenis 1.3.27** — MIT; public marketing and concept previews only, synced to GSAP's ticker using the official integration. Not used in the authenticated workspace.
- **React Bits** — MIT + Commons Clause; adapted `SpotlightCard` and `ClickSpark` for the Atelier surface and CTAs. Attribution remains in the component headers; no standalone redistribution.


## 10. Ember Obsidian source pass

The mandatory catalog was investigated and recorded in `docs/design-source-implementation-matrix.md`. New actual implementations:

- **Aceternity UI Spotlight** — installed from the public Aceternity registry; `src/components/ui/spotlight.tsx`, used in the hero. Free commercial use under the Aceternity license; no redistribution.
- **Magic UI Number Ticker / Shine Border** — installed from the Magic UI registry; metric animation and hero/CTA border. MIT.
- **Motion Primitives Text Shimmer** — installed through its CLI and adapted; planner generation and landing AI-draft labels. MIT.
- **Anime.js** — milestone completion pulse only; MIT.
- **3dicons folder/rocket** — CC0 assets in `public/assets/3dicons/`, used in the empty state.
- **shadcn/ui Tabs** — the real tab primitive behind the landing product tour.
- **GSAP / Lenis / React Bits** — retained from the prior motion pass with the ownership documented in `docs/motion-toolkit.md`.

Blocked or rejected sources are recorded honestly in the matrix: Refero's gated screens, 21st.dev's API-key registry, Uiverse's Cloudflare block, MicroKit's unavailable source, mapcn's lack of product fit, Liquid Glass's conflict with the art direction, and Kitbitz's illustration style mismatch.
