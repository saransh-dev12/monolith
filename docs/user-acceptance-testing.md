# User acceptance testing — protocol

Goal: five people who did not build Monolith complete the core journey
unassisted, and we record where they struggle.

## Setup

- Tester uses their own device and browser (variety requested: at least two
  mobile phones, at least one Safari).
- Facilitator stays silent except: "try to plan and run a small real
  project you actually have."
- Session recorded (screen + audio) with consent.
- Production URL: `https://monolith-navy.vercel.app`

## Tasks (no guidance)

1. Understand what Monolith is from the landing page.
2. Create an account (note: confirmation email — currently auto-confirmed).
3. Enter the workspace.
4. Create a real project.
5. Open the AI planner and generate a draft (requires `OPENAI_API_KEY`).
6. Edit the draft.
7. Confirm and save it.
8. Move tasks through the board (drag and/or status menu).
9. Complete a milestone.
10. Read the dashboard — ask: "do you trust these numbers?"
11. Sign out, sign back in, confirm work survived.
12. Delete the account (confirm data removal intent) — final task.

## Observe and record

Confusion points, mis-navigation, terminology misunderstandings, failed
actions, excessive friction, visual inconsistencies, mobile-specific
breakage, trust in metrics.

## Acceptance

All five testers complete tasks 1–4 and 8–11 without developer help. Any
recurring friction (≥3 of 5) is fixed and retested before release.

## Results

| Tester | Device | Completed core journey | Findings | Fixed |
| --- | --- | --- | --- | --- |
| — | — | — | — | — |

(Pending: requires the production OpenAI key for task 5 and five volunteers.)
