# Phase 1 — Three concept directions

Three working previews were built under `/concepts` with isolated, illustrative demo data. They do not read from or write to Supabase, do not use the authenticated layout, and are marked `noindex`. Each route includes a landing hero, type and color specimens, a Command Center, a board, an interactive component, and a motion treatment.

| Concept | Route | Screenshot |
| --- | --- | --- |
| A · Chromatic Brutalism | `/concepts/brutalism` | `docs/concepts/a-desktop-full.png`, `a-mobile-full.png` |
| B · Kinetic Digital Atelier | `/concepts/atelier` | `docs/concepts/b-desktop-full.png`, `b-mobile-full.png` |
| C · Neo-Editorial Control Room | `/concepts/editorial` | `docs/concepts/c-desktop-full.png`, `c-mobile-full.png` |
| Gallery + comparison | `/concepts` | `docs/concepts/gallery-desktop.png` |

## A · Chromatic Brutalism

- **Palette:** acid `#D8FF00`, electric blue `#2B4BFF`, vermilion `#FF3B1F`, ink `#0B0B0B`, paper `#F5F3EC`.
- **Type:** Archivo Black (display), Space Mono (interface, data, metadata).
- **Composition:** asymmetric editorial split, 2px rules, zero radius, offset solid shadows, oversized numerals, marquee workflow ticker.
- **Dashboard:** solid-block throughput chart with 7/14/30 range, large status blocks, project ledger.
- **Board:** thick-ruled columns, priority tabs, click-to-advance cards, hard filter block.
- **Motion:** clip wipes, stiff springs (700/42), linear marquee, color swaps instead of elevation. Reduced motion removes marquee and springs.
- **Trade-offs:** highest contrast and fastest to build; motion must stay short to avoid noise. Dense data remains legible because accents are functional.

## B · Kinetic Digital Atelier

- **Palette:** coral `#FF7A59`, lilac `#B49CFF`, mint `#6FF2C4`, void `#08060F`, panels `#120C24` / `#171034`.
- **Type:** Instrument Serif (display), Manrope (interface), JetBrains Mono (metadata).
- **Composition:** layered rounded panels, ambient radial light, pointer-parallax hero panel, floating confirmation chip, deep surfaces.
- **Dashboard:** completion area chart with path draw, focus-week bars, ring progress, upcoming milestones.
- **Board:** three glass-free layered columns; cards morph between columns with shared layout, footer progress.
- **Motion:** slow springs (120/20), blur-in, depth, layout morphs, plan/execute crossfade. Reduced motion disables parallax, blur, and layout drift.
- **Trade-offs:** most immersive; contrast on deep surfaces requires care, blur and transforms carry the highest performance risk, and the layered composition must be simplified on mobile.

## C · Neo-Editorial Control Room

- **Palette:** bone `#F1ECE2`, ink `#14110D`, oxblood `#8A2B22`, ultramarine `#1F35C4`, field green `#2F6B4F`, rule `#CDC2AF`.
- **Type:** Bodoni Moda (display), Inter Tight (interface), IBM Plex Mono (metadata).
- **Composition:** masthead and edition line, oversized editorial headline, execution ledger, numbered sections, hairline rules, dense tables, margin notes.
- **Dashboard:** lead-project story, metric strip, project index, throughput, dated notes, next action.
- **Board:** three-column spread with numbered cards, rule filters, click-to-advance, footer progress.
- **Motion:** crisp eased reveals, underline layout transitions, tick and bar growth, horizon crossfade. No bounce; reduced motion removes all transforms.
- **Trade-offs:** strongest dense-data legibility and lowest accessibility/performance risk; the editorial voice is distinctive but requires disciplined spacing so it does not read as a magazine template.

## Comparison

| Criterion | A · Brutalism | B · Atelier | C · Control Room |
| --- | --- | --- | --- |
| Visual distinctiveness | High | High | High |
| Reference affinity | Strong: bold data blocks, stat cards | Strong: motion, depth, focus-week bars | Strong: chart + table density, light/system/dark awareness |
| Landing impact | Loud, memorable | Immersive, cinematic | Editorial, confident |
| Dashboard usability | Good, high contrast | Refined but needs restraint | Strongest, dense and legible |
| Typography | Graphic, blunt | Expressive serif | Exacting, editorial |
| Color system | Acid / electric / vermilion | Coral / lilac / mint on void | Oxblood / ultramarine on bone |
| Animation potential | Snappy cuts | Slow spatial morphs | Precise reveals |
| Accessibility risk | Contrast good; motion must be tamed | Low-contrast risk on deep surfaces | Lowest risk |
| Mobile behavior | Strong, stacked blocks | Needs simplification | Strong, reflows as columns |
| Performance risk | Low | Medium (blur, transforms) | Low |
| Product compatibility | High | Medium | High |
| Build complexity | Low | High | Medium |

## Reference mapping

- **October 19 inventory dashboard:** the 7/30/90 range control became 7/14/30 in A and a 7/14/30 horizon in C; the area chart informed B's completion pulse and C's ledger; the stock-level table informed C's project index and A's ledger rows. No inventory concepts were carried over.
- **October 24 code.xr dashboard:** animated statistic cards informed A's hard stat blocks and C's metric strip; the focus-week bars informed B's hero week panel; the icon rail and profile-app composition were not adopted. Glass treatment was limited to B's layered hero panel and not applied globally.
- **Details.so / Manus / Spline / Skiper / Componentry / Refero.design:** prior research recorded in `docs/design-sources.md` was used for composition and interaction judgement only. No code or assets were copied in Phase 1; all three previews are original implementations.

## Verification performed

- Rendered all four routes at 1440×900 and 390×844 in Chromium.
- No horizontal overflow at either width (`scrollWidth - clientWidth === 0`).
- No console errors, page errors, or hydration warnings on any concept route.
- Exercised: A range + filter + card advance; B plan/execute toggle + card advance + week bars; C board filter + horizon scrub + card advance.
- Re-ran all routes with `prefers-reduced-motion: reduce`; no errors.
- Lint and typecheck pass.

## Recommendation

**C · Neo-Editorial Control Room** is the recommended direction. It moves furthest from the rejected amber-on-cream system while giving the product a memorable voice and the best legibility in dense operational screens. Its bone/ink/oxblood palette with an ultramarine focus signal is distinctive without being decorative, and it adapts the supplied chart, table, and range patterns most naturally. A is the boldest and cheapest to ship; B is the most immersive but carries the highest contrast and performance risk for daily task work.

**Selection:** **B · Kinetic Digital Atelier** was selected. Phase 2 implemented it across the landing page and authenticated product. All three previews remain available at `/concepts` (noindex, unlinked, static demo data only) as comparison artifacts; the production interface now uses the Atelier system. See `docs/design-direction.md` and `docs/design-sources.md` §8 for the production record.

## Motion personalities (addendum)

Each concept now includes a live GSAP scroll study, Lenis with a distinct lerp, and a GSAP SplitText hero; all three respect reduced motion and keep content visible.

| Concept | Lenis | Scroll sequence | Additional motion |
| --- | --- | --- | --- |
| A · Brutalism | 0.16, snappy | Pinned ledger with hard `clipPath` wipes and linear scrub | ClickSpark on the primary CTA |
| B · Atelier | 0.075, cinematic | Pinned layered idea → plan → board stack | SpotlightCard surface + ClickSpark |
| C · Editorial | 0.12, measured | Pinned columns sliding like a turned spread | ClickSpark on the primary CTA |

The production site uses B's motion language: 0.085 Lenis, a GSAP-pinned 190% workflow, SplitText hero, SpotlightCard studio preview, and ClickSpark CTA. Details and verification are in `docs/motion-toolkit.md`.
