# Dashboard 2.0 — interaction & motion specification

Phase B deliverable. Governs the Command Center rebuild and the workspace
interaction system. Motion library: Motion for React only. Identity:
Ember Obsidian v2 (obsidian surfaces, ember accent, Fraunces/Syne type) —
unchanged.

## A. Audit findings

- The shell is already persistent (sidebar + sticky header + route
  transition), but the Command Center reads as a report, not a workspace:
  metrics first, "what am I working on" buried.
- `pressFeedback` and `HoverLift` exist but are applied inconsistently.
- Radix dialogs/menus animate at ~100ms — below the perceptible-fluid band.
- No keyboard shortcuts beyond ⌘K. No recent-activity or deadline surfacing.
- Loading skeleton does not match the new structure (after redesign).

## B. Information architecture (answers the three questions)

1. **What am I working on?** — "Working on now" strip: live in-progress
   tasks with project and last-touch time. Real records only
   (`tasks.status = 'in-progress'` ordered by `updated_at desc`).
2. **What needs my attention?** — Attention panel: overdue tasks first,
   then deadlines due within 7 days; each row links to its project.
3. **What should I do next?** — Next up (due-ordered open tasks, existing),
   projects overview with progress, quick actions in the header
   (New project, Open planner).

Structure (single column of sections, restrained):

```
PageHeader (title + description + quick actions)
[Working on now — horizontal task cards, stagger entrance]
[Metrics row — 4 cards, count-up, overdue card emphasized when > 0]
[Execution chart (2/3) | Attention (1/3): overdue → deadlines]
[Recent activity — real trail from tasks.updated_at]
[Projects overview — rows with progress, hover lift]
```

Empty states: "No projects yet" (existing), "Nothing in progress" (hint to
open the board), "Nothing needs attention" (calm confirmation). Loading
skeleton mirrors this structure. All numbers from owner-scoped rows.

## C. Motion system (tokens + rules)

| Interaction | Duration | Notes |
| --- | --- | --- |
| Button press | 100–120ms | CSS `active:scale-[0.97]`, instant, no JS |
| Hover/focus | 150ms | surface/translate transitions |
| Dropdown/popover | 180–200ms | Radix data-open/out + slide |
| Dialog/overlay | 240–280ms | fade + zoom-96, backdrop fade |
| Page/panel | 240–300ms | existing RouteTransition (240ms) |
| Drag/list reorder | spring | springLift (420/30/0.7) |

New tokens in `src/lib/motion.ts`: `springPress`, `listItemVariants`
(staggered entrance + layout), `overlayContentVariants`. Rules:
- Every overlay animates in AND out; exits are always faster than entrances.
- Buttons never animate via JS (CSS only = instant).
- Lists animate once on mount (stagger ≤ 60ms/item); value changes animate
  only when the value actually changes (NumberTicker keyed by value).
- `prefers-reduced-motion`: MotionConfig `reducedMotion="user"` + CSS
  overrides already cover transforms/opacity; drag keeps its fallback.

## D. OS-like behaviors

- Keyboard: `⌘1`–`⌘4` jump to Command Center / Projects / Board / Planner
  (announced in the command palette footer).
- Persistent shell stays mounted; route changes animate content only.
- Optimistic board/status updates keep their rollback behavior (unchanged
  and re-verified).
- Toasts (Sonner) keep position; no new notification system in v1.

## E. Verification

- Existing e2e selectors preserved (labels, headings, empty-state texts).
- New e2e: keyboard shortcut navigation; deletion/status flows re-run.
- Gates: lint, typecheck, vitest, build, full e2e, axe audit, responsive
  sweep, Lighthouse, reduced-motion pass.
