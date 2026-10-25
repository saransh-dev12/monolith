# Motion toolkit

Phase 2 addendum: GSAP, Lenis, and selected React Bits components. This document records ownership, licenses, integrations, fallbacks, and verification. The backend, auth, data model, and persistence were not changed.

## Ownership

| Layer | Owns | Does not own |
| --- | --- | --- |
| GSAP + ScrollTrigger + SplitText | Marketing hero typography, pinned scroll sequences, scroll progress, concept motion studies | Dialogs, menus, board drag state, ordinary hover/press feedback |
| Lenis | Smooth wheel scrolling on public marketing and concept previews only | Workspace scrolling, dialogs, nested scroll areas, touch scrolling |
| Motion for React | Route transitions, reveals, dialogs, menus, board drag/lift, chart state transitions, studio demo step changes | Scroll progress or pinned choreography |
| CSS/Tailwind | Hover/press/focus states, reduced-motion resets, spotlight surface, simple state transitions | Anything already owned by GSAP, Lenis, or Motion |
| React Bits (adapted) | Pointer spotlight on the studio preview; click spark on primary marketing CTAs | Page layout, scroll, or product state |
| Aceternity Spotlight | One-shot hero light beam | Layout, scroll, product state |
| Magic UI | Number counting in metrics; shine border on hero/CTA | Layout, scroll, product state |
| Anime.js | One scoped milestone-completion pulse | Scroll, layout, dialogs, charts, or general UI |
| Motion Primitives Text Shimmer | AI-draft and planner-generating labels | Scroll, layout, or general UI |

No two layers animate the same property on the same element. The one deliberate composition is the StudioHero: Motion owns the panel entrance/tilt, SpotlightSurface owns only a background overlay, and ClickSpark owns only its canvas.

## GSAP

Installed: `gsap@3.15.0`, `@gsap/react@2.1.2`.

Registered plugins: `ScrollTrigger`, `SplitText`, `useGSAP`. No other GSAP plugins are used.

### Timelines and triggers

- **`src/components/motion/split-heading.tsx`** — GSAP SplitText, lines + words with line masks. Animates word `yPercent`, opacity, and a 1.5° rotation on the production hero and all three concept heroes. Waits for `document.fonts.ready`, reverts the split and context on unmount, and skips entirely under reduced motion.
- **`src/components/marketing/workflow-story.tsx`** — desktop-only ScrollTrigger with `pin: true`, `scrub: true`, `start: "top 64px"`, `end: "+=190%"`, and `anticipatePin`. Scroll progress drives the active Describe/Review/Confirm/Execute step and the progress rail. Mobile and tablet use the existing stacked story with no pin.
- **`src/components/concepts/motion-study.tsx`** — one section per concept, pinned only at `min-width: 1024px` (`end: "+=170%"`). Each concept has a different timeline:
  - A · Brutalism: hard `clipPath` wipes and x-offsets on ledger rows, linear scrub, no easing theatre.
  - B · Atelier: layered cards rise, rotate, and scale into the stack with a slow scrub.
  - C · Editorial: columns slide horizontally like a turned spread.
  - The first item stays visible at progress 0; later items animate in. Reduced motion shows every step and detail.

Cleanup: `useGSAP` contexts own the timeline and pin; `gsap.matchMedia()` scopes desktop/mobile behavior and is reverted on unmount. `ScrollTrigger.refresh()` runs after Lenis initializes, on window load, and after fonts load.

## Lenis

Installed: `lenis@1.3.27` (MIT). Integration follows the current official GSAP ScrollTrigger pattern:

```ts
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

Only one Lenis instance exists at a time. `src/components/motion/smooth-scroll.tsx` initializes it with `autoRaf: false`, `syncTouch: false`, and `stopInertiaOnNavigate: true`, then destroys it and removes the ticker/listeners on unmount.

| Surface | Lerp | Notes |
| --- | --- | --- |
| Production marketing `/` | 0.085 | Cinematic but restrained |
| Concept A · Brutalism | 0.16 | Snappier, harder |
| Concept B · Atelier | 0.075 | Slowest, most layered |
| Concept C · Editorial | 0.12 | Measured, editorial |

Lenis is **not** used in `/app`, `/login`, `/signup`, or the concept comparison index. Native scrolling remains in the workspace. Touch uses native scrolling (`syncTouch: false`); wheel smoothing is desktop-first. Anchor links, direct `/#story` loads, and browser back/forward were verified. Reduced motion skips Lenis entirely, so native scrolling is immediate.

## React Bits

Selected from `https://github.com/DavidHDev/react-bits` (MIT + Commons Clause). Both components are adapted, not copied wholesale, and are used only in the chosen Atelier direction.

| Component | Source | Use | Adaptation |
| --- | --- | --- | --- |
| SpotlightCard | `src/content/Components/SpotlightCard` | Atelier concept hero panel; production StudioHero panel | Replaced the requestAnimationFrame pointer loop with CSS variables; added reduced-motion opt-out; kept pointer-tracked radial light and border glow |
| ClickSpark | `src/content/Animations/ClickSpark` | Production hero primary CTA; Atelier/Brutalism/Editorial primary CTAs | Reduced to one canvas, 12-burst cap, no continuous loop; honors reduced motion; cleans up animation frames |

Attribution is kept in the component headers. The Commons Clause forbids selling, sublicensing, or redistributing the components themselves; Monolith uses them inside its own application and does not redistribute them as a component library. No React Bits background, shader, or asset was used.

## Retained instead of duplicated

- Board drag, drop targets, and drag overlay: `@dnd-kit` + Motion.
- Project/task/milestone dialogs and menus: Radix + Motion/CSS.
- Execution chart range change and path draw: Motion.
- Focus-week bars and metric reveals: Motion with `whileInView`.
- Route transitions and section reveals: Motion + CSS.
- Theme switching and toasts: `next-themes` and Sonner.

GSAP was not added to the workspace because the existing Motion/dnd-kit system already covers fast, repeated interactions without a second scroll controller.

## Reduced motion

- `useReducedMotion` is now hydration-safe (`useSyncExternalStore` with a server snapshot of `false`). This fixed a hydration mismatch where Motion's client initial styles disagreed with SSR in reduced-motion contexts.
- Lenis is not initialized.
- GSAP SplitText and ScrollTrigger are skipped; headings remain un-split text.
- The workflow story shows every step body instead of only the active one.
- Concept motion studies show every step detail; no pin.
- The global `prefers-reduced-motion` CSS still forces reveals visible, removes transforms, and disables smooth scrolling.
- All content remains in the DOM and readable with JavaScript animation disabled.

## Verification

Tested against the running dev server in Chromium.

- **Desktop 1440×1000:** Lenis active, pinned workflow advances Describe → Review → Confirm → Execute, stage pins at 64px, zero horizontal overflow, zero console/page errors.
- **Tablet 768×900:** no pin (stacked story), Lenis active, zero overflow, zero errors.
- **Mobile 390×844:** no pin, stage hidden, stacked story, native touch scrolling, zero overflow, zero errors.
- **Reduced motion:** Lenis absent, GSAP skipped, all workflow/concept details visible, zero hydration/console errors.
- **Concepts:** all three routes at 1440 and 390; Lenis active; motion study counters advance to `03 / 03`; zero overflow/errors. Reduced-motion concept details computed at `0.6` opacity (visible).
- **Navigation:** landing → Workflow anchor (`#story`) updates the hash and scrolls; direct `/#story` lands at the story; back returns to `/`; workspace routes have no Lenis class; concept A → B → C → A leaves one Lenis instance and no errors.
- **Performance (production build, headless Chromium, 1440):** CLS `0.0044`, no long tasks recorded during a full scroll, ~10 MB JS heap after load/scroll. No shader or pointer RAF loop was added. ShineBorder and TextShimmer are cheap CSS/Motion loops and are disabled or replaced under reduced motion.
- **Known trade-offs:** pinning is desktop-only to protect small-screen layouts; ClickSpark is limited to primary CTAs rather than every click; the spotlight is a single composited gradient rather than a full pointer simulation.
- **Checks:** lint, typecheck, Vitest 20/20, Playwright 12/12, production build pass.

## Licenses

- **GSAP** — Standard "no charge" license, https://gsap.com/standard-license. GSAP states it is free for everyone, including commercial use, under that license. Copyright GreenSock/Webflow.
- **Lenis** — MIT, Copyright (c) 2024 darkroom.engineering, https://github.com/darkroomengineering/lenis/blob/main/LICENSE.
- **React Bits** — MIT + Commons Clause, Copyright (c) 2026 David Haz, https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md. Adapted components retain the notice in their headers. Not redistributed as a standalone component library.


## Ember Obsidian update

The visual system was replaced after the motion pass. The ownership above still applies; the tokens, typefaces, and surfaces changed.

- **GSAP** retains the hero SplitText, the five-step pinned workflow (`+=150%`), and concept studies. The production hero now uses Syne and an obsidian/ember surface.
- **Lenis** remains public-only at `0.08` on the landing page and concept-specific lerps.
- **React Bits** SpotlightSurface remains on the StudioHero preview; ClickSpark remains on primary CTAs.
- **Anime.js 4.2.2** (MIT) is now used only for the milestone completion pulse in `src/components/milestones/milestone-item.tsx`. It is skipped under reduced motion and owns no other properties.
- **Motion Primitives Text Shimmer** (MIT, `src/components/motion-primitives/text-shimmer.tsx`) marks the AI-draft label in the workflow and the planner generating label. The planner path is conditionally disabled because OpenAI is not configured in this environment; the landing label is exercised in the browser.
- **Magic UI Number Ticker** (MIT) owns metric-number counting in the Command Center; **Shine Border** owns the hero/CTA border; **Aceternity Spotlight** owns the hero beam.
- **3dicons** folder asset is used in the shared empty state.
- Retained: Motion for route/tab/dialog/board/chart transitions; dnd-kit for drag; CSS for hover/press/focus.

Reduced-motion checks were rerun after the Ember change: Lenis is absent, GSAP is skipped, all workflow details remain visible, the static labels replace shimmer, and Anime.js does not run.
