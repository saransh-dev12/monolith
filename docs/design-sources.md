# Design sources and reuse record

This document records the reference-first research and the libraries, components, and code reused in the Monolith interface. It distinguishes directly reused implementations from patterns that were only studied.

## 1. Directly reused code

### Launch UI — structural marketing primitives

- **Source:** https://github.com/launch-ui/launch-ui
- **License:** MIT
- **Copyright:** Copyright (c) 2024 Mikolaj Dobrucki
- **Used in:** `src/components/marketing/foundation.tsx`, `src/app/page.tsx`, `src/app/globals.css` (`max-w-container` utility).
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

- **Fraunces** — SIL Open Font License 1.1. Editorial display face, loaded through `next/font/google`; no font files are committed.
- **Plus Jakarta Sans** — SIL Open Font License 1.1. Interface face, loaded through `next/font/google`; no font files are committed.
- **JetBrains Mono** — SIL Open Font License 1.1. Metadata face, loaded through `next/font/google`; no font files are committed.
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
- No animation dependency was added. The selected interactions use CSS transitions plus Radix/tw-animate-css.
- No third-party dashboard screenshots were used as product previews. The landing preview is assembled from Monolith's own `Progress`, `TaskStatusBadge`, `ProjectStatusBadge`, `Button`, and typography.
- No customer logos, testimonials, usage numbers, or fake integrations are shown.
