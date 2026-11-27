# Command Center reference study

Reference: supplied 20-second recording dated 2026-11-27, inspected at multiple points across the clip. The 362×608 recording is a portrait crop of a landscape interface, not a demonstrated mobile breakpoint.

The reference presents a rounded, dark application frame containing a dominant visual field (roughly two thirds of the width) and a narrower information rail (roughly one third). A compact wordmark/search and account controls sit across the top. An icon rail floats on the left of the field, labels expanding on interaction; markers and a vertical control group occupy the field. Compact progress and chart panels overlap its lower edge. The right rail stacks a dense overview, progress detail and recent messages. Selecting a marker reveals a contextual panel; numeric values and chart hover states animate. Camera zooms are edited presentation, not evidence of a particular application's route transitions.

## Translation to Monolith

| Reference responsibility | Monolith representation | Existing source |
| --- | --- | --- |
| Immersive map and selectable plots | Project execution canvas, with project selection and actual milestone checkpoints | `getDashboardData`: projects and milestones |
| Floating map controls | Existing top workspace navigation, project selector and direct project/board/planner links | Workspace shell and existing routes |
| Map detail overlay | Next action and project context; identify workspace-wide scope | ranked `focusTasks`, selected project |
| Bottom charts | Compact task state and milestone completion; values must reconcile with displayed data | `stageCounts`, project progress counts |
| Overview and progress rail | Active projects, open/completed/overdue work, selected-project progress | `dashboard_totals`, selected project |
| Recent messages | Latest task-row updates, explicitly not an audit/event history | `recentActivity` |

Selected project progress counts tasks and milestones together. Workspace totals and task stage counts include unarchived projects; next-action ranking is limited to active projects. These scopes must be labeled. Milestone order or dates do not imply dependencies. No satellite imagery, fictitious chart history, customer data or unsupported interactions are introduced.

## Implementation and fidelity checks

1. Preserve current auth, server-side queries, data model, existing top navigation, actions and keyboard access.
2. Replace the page-first dashboard layout with a dominant execution field, anchored controls, compact lower data panels and a secondary right rail. Keep the Ember Obsidian tokens and established fonts.
3. Adapt the same hierarchy for small screens: project context and next action first, then execution and secondary panels. The recording does not establish a phone layout.
4. Apply shared surface, spacing and interaction treatments to existing workspace screens without replacing their forms, mutations or navigation.
5. Verify empty and populated workspaces, real-data reconciliation, project switching, focus, reduced motion, responsive overflow and regression tests. Actual visual approval remains the user's; production release remains NOT YET ASSESSED.
