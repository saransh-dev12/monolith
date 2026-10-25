# Design source implementation matrix

This matrix records the required source investigation for the Ember Obsidian redesign. A source is marked **implemented** only when its actual source or asset was incorporated and verified. Galleries and prompt libraries are reference-only; no screenshot or prompt was treated as licensed source code.

## Matrix

| Source | URL | Access | Candidate | License | Decision | Implementation | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Minimal Gallery | https://minimal.gallery/ | Accessible (browse) | Minimal editorial pacing, thin rules, restrained page rhythm | No reuse license stated for screenshots/sites | Reference only | None | Used as a visual benchmark; no asset or code copied |
| Kage | https://kage.design/ | Accessible (browse) | Dark/product UI references, component taxonomy | No code license for captured designs | Reference only | None | Browsed dark/product categories; no design copied |
| AppShot Gallery | https://www.appshot.gallery/ | Accessible (browse) | Mobile/App Store screenshot composition | No reuse license stated | Rejected | None | Not applicable to a desktop execution workspace |
| Component Gallery | https://component.gallery/ | Accessible | Tabs, dialogs, navigation and progress examples | MIT for the site repository; linked systems have their own licenses | Reference only | shadcn tabs/dialog remain the implementation | Compared tab/empty-state conventions; no code copied |
| Design.md files (`VoltAgent/awesome-design-md`) | https://github.com/VoltAgent/awesome-design-md | Accessible | `design-md/linear.app/DESIGN.md` | MIT (repository) | Selected as a structural reference | `docs/design-direction.md` (Ember Obsidian tokens and density) | Read the actual DESIGN.md; near-black canvas, hairlines, one accent, dense technical display were adapted, not copied |
| Refero | https://refero.design/ | Landing accessible; app requires sign-in | UI/UX screens | No source license available without account | Blocked / not used | None | Landing shell inspected only; no specific gated screen claimed |
| Jiro | https://jiro.build/ | Accessible (prompt library) | AI-ready landing prompts | Prompts are product content; no code license | Reference only | None | Browsed library; no prompt or template copied |
| vibePrompt | https://vibeprompts.dev/ | Accessible | Layout prompts for heroes, auth, dashboards | Prompts are product content; no code license | Reference only | None | Browsed categories; no prompt copied |
| 21st.dev | https://21st.dev/ | Accessible index; installs require 21st API key/membership | Registry components | Per-component; registry access gated | Blocked for installation | None | Confirmed registry/API-key requirement; no component installed |
| shadcn/ui | https://ui.shadcn.com/ | Accessible | Tabs, dialogs, sidebar, command, forms | MIT | Implemented (existing foundation) | `src/components/ui/*`, `src/components/shell/*` | Used in landing product tabs and workspace; keyboard/focus and mobile checked |
| Aceternity UI | https://ui.aceternity.com/components/spotlight | Accessible | Spotlight SVG light beam | Free commercial use; no resale/redistribution (Aceternity license) | Implemented | `src/components/ui/spotlight.tsx`; `src/app/page.tsx` | Rendered behind the hero, animation and ember tint verified in Chromium |
| Magic UI | https://magicui.design/docs/components/number-ticker | Accessible | Number Ticker; Shine Border | MIT | Implemented | `src/components/ui/number-ticker.tsx`, `src/components/ui/shine-border.tsx`; `src/components/dashboard/metric-card.tsx`, `src/app/page.tsx` | Metric values animate; shine border renders around hero preview and CTA |
| Anime.js | https://animejs.com/ | Accessible | Milestone completion pulse | MIT | Implemented (scoped) | `src/components/milestones/milestone-item.tsx` | Milestone completion animation runs; reduced motion skips it |
| Motion Primitives | https://motion-primitives.com/docs/text-shimmer | Accessible | Text Shimmer | MIT | Implemented | `src/components/motion-primitives/text-shimmer.tsx`; planner generating label and landing AI-draft label | Shimmer renders; reduced motion falls back to static text |
| Kinetics | https://kinetics.colorion.co/ | Accessible | CSS/React Spring motion examples | MIT repository linked on site | Rejected | None | Existing GSAP/Motion ownership covers the need; adding React Spring would duplicate engines |
| MicroKit UI | (no verified live source) | Unavailable / not verified | — | Unresolved | Blocked | None | Candidate URLs did not resolve to a relevant component library; not claimed as reviewed |
| mapcn | https://mapcn.dev/ | Accessible | MapLibre map components | MIT; CARTO/OSM terms apply | Rejected | None | Monolith has no geographic data or map use case; MapLibre would add weight without product value |
| Uiverse | https://uiverse.io/ | Blocked (Cloudflare 403) | Buttons/loaders | Per-submission, unverified | Blocked | None | Could not inspect or verify source terms; no unverified copy used |
| Liquid Glass | https://github.com/rdev/liquid-glass-react | Accessible (library repo) | Refraction/glass surfaces | MIT | Rejected | None | Conflicts with obsidian/ember art direction and adds displacement/filter cost for no product benefit |
| Kitbitz | https://kitbitz.art/ | Accessible (browse) | Hand-drawn illustration assets | Assets CC0; platform code proprietary | Rejected | None | Hand-drawn style does not fit the serious product brief; no asset copied |
| 3dicons | https://3dicons.co/ | Accessible | Folder and rocket 3D icons | CC0 1.0 | Implemented | `public/assets/3dicons/folder-color.png`; `src/components/shared/empty-state.tsx` | Empty-state folder image renders from the local asset; provenance recorded |
| Details.so | Previously documented | Accessible previously | Editorial pacing | Reference only | Retained | `docs/design-sources.md` | No new copy; existing conclusions remain |
| Design Spells | Previously documented | Accessible previously | Purposeful interaction | Reference only | Retained | `docs/design-sources.md` | No new copy; existing conclusions remain |
| Spline | Previously documented | Accessible previously | Product-as-hero | Reference only | Retained | `docs/design-sources.md` | No 3D/WebGL added; performance decision retained |
| Manus | Previously documented | Accessible previously | Prompt-first planner | Reference only | Retained | `docs/design-sources.md` | Existing planner flow retained |
| Skiper UI | Previously documented | Accessible previously | Restrained interaction | Reference only | Retained | `docs/design-sources.md` | No new code copied |
| Componentry | Previously documented | Accessible previously | Motion-as-property | Reference only | Retained | `docs/design-sources.md` | No new code copied |
| GSAP | https://github.com/greensock/GSAP | Accessible | ScrollTrigger, SplitText | GSAP standard "no charge" license | Implemented (existing) | `src/lib/gsap.ts`, `src/components/motion/split-heading.tsx`, `src/components/marketing/workflow-story.tsx`, `src/components/concepts/motion-study.tsx` | Hero split, pinned workflow, concept studies, reduced motion, desktop/mobile checked |
| Lenis | https://github.com/darkroomengineering/lenis | Accessible | Smooth public scroll | MIT | Implemented (existing) | `src/components/motion/smooth-scroll.tsx`; landing and concept routes | Lenis/ScrollTrigger sync, anchors, history, touch and reduced-motion behavior checked |
| React Bits | https://github.com/DavidHDev/react-bits | Accessible | SpotlightCard, ClickSpark | MIT + Commons Clause | Implemented (existing, adapted) | `src/components/reactbits/spotlight-surface.tsx`, `click-spark.tsx` | Studio preview spotlight and CTA click sparks verified |

## Access notes

- **Not reviewed:** MicroKit UI, because no verified live component source was found. Refero's authenticated product screens were not reviewed.
- **Blocked:** 21st.dev registry installs require an API key/membership; Uiverse returned Cloudflare 403. Neither is counted as implemented.
- **Reference-only:** Minimal Gallery, Kage, AppShot, Component Gallery, Jiro, vibePrompt, Details.so, Design Spells, Spline, Manus, Skiper UI, Componentry. Their screenshots/prompts were not treated as licensed code.
- **No copy of proprietary source:** Refero and Aceternity premium assets were not accessed or copied. Only the free Aceternity Spotlight component was installed from its public registry.

## Attribution

- Aceternity UI components — free commercial use under the Aceternity license; no resale or redistribution of the component source. Source: https://ui.aceternity.com/licence.
- Magic UI Number Ticker and Shine Border — MIT, Copyright (c) Magic UI.
- Motion Primitives Text Shimmer — MIT, Copyright (c) 2024 ibelick.
- Anime.js — MIT, Copyright (c) Julian Garnier.
- React Bits SpotlightCard/ClickSpark — MIT + Commons Clause, Copyright (c) 2026 David Haz; adapted and used inside the application, not redistributed.
- 3dicons folder — CC0 1.0 Universal; no attribution required, credited here.
- shadcn/ui — MIT.
- GSAP — Standard "no charge" license, https://gsap.com/standard-license.
- Lenis — MIT, Copyright (c) 2024 darkroom.engineering.
