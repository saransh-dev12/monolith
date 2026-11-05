# Deployment guide

Target: any Next.js host (Vercel is the reference path). The UI branch
(`ui/ember-obsidian-v2`) ships the finalized Ember Obsidian v2 design —
dark-only, Fraunces/Syne type, hero 3D journey. No new environment
variables were introduced by the UI work.

## 0. Preflight (all done locally)

- `npm run lint`, `npm run typecheck`, `npm test` (40 unit tests),
  `npm run build` — all green on this branch.
- Production build output verified; three.js is lazy-loaded and only
  fetched on the marketing route.

## 1. Production Supabase project

1. Create a dedicated production project (do **not** reuse local/staging).
2. Apply migrations with the Supabase CLI against production:
   `supabase db push --linked` (review the plan first — the latest
   migration drops the old planner-quota RPC signatures, so coordinate
   with the app rollout; see `docs/v1-release-readiness.md`).
3. **Never** run `supabase/seed.sql` against production — it contains the
   demo accounts (`demo@monolith.local` / `second@monolith.local`).
4. Verify RLS: the pgTAP suite (`supabase/tests`) is the reference for
   expected policies; smoke-test cross-user denial with two real accounts.

## 2. Environment variables (host dashboard)

| Variable | Notes |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Production project URL (public). |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable anon/publishable key (public; RLS is the guard). |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only. Planner quota + atomic saves. Never expose. |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | Server-only. Leave empty to disable AI planning (UI states it honestly). |
| `OPENAI_BASE_URL` | Optional (OpenAI-compatible endpoints). |
| `PLANNER_DAILY_LIMIT` | Per-user daily generations, 1–50. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin, e.g. `https://monolith.example.com` — used for auth redirects and metadata. |

Local reference: `.env.example`.

## 3. Auth allowlist

In the Supabase dashboard → Auth → URL configuration: set Site URL to
`NEXT_PUBLIC_SITE_URL` and add `<site>/auth/callback` to redirect URLs.
Then verify signup → (email confirm if enabled) → sign-in → session
refresh → sign-out on production.

## 4. Deploy (Vercel reference path)

1. Import the repo, framework auto-detects Next.js. Build command
   `npm run build`, no custom output dir.
2. Add every variable from §2 (production scope).
3. Deploy, then run the release smoke tests from
   `docs/v1-release-readiness.md`: user isolation, project/task/milestone
   CRUD, board status persistence, dashboard accuracy, planner quota +
   provider-failure paths (with disposable data, cleaned afterwards).
4. Performance/UX spot checks: landing 3D journey (WebGL + reduced-motion
   fallback), dashboard, board drag, mobile 390 px, zero console errors.

## 5. Still open before tagging v1.0

- Live AI generation exercised once against production OpenAI keys.
- Large-account list/chart verification (200-row API cap exercised only
  in CI).
- Reconcile remaining checkboxes in `docs/v1-release-readiness.md`, then
  tag.
