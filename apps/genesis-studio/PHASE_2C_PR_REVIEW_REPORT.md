# Genesis Studio — Phase 2C PR Review Report

**Branch:** `cursor/zsanctuary/genesis-studio-omnai-shell`
**Base:** `main`
**Review date:** 2026-05-16
**Reviewer:** Cursor (read-only merge readiness pass — no new features)

---

## Scope

Review-only hardening pass for merge readiness. No packages installed, no provider calls, no runtime UI automation in browser.

**Commits on branch (4):**

| SHA       | Message                                                               |
| --------- | --------------------------------------------------------------------- |
| `a90e03c` | feat(genesis-studio): add OMNAI creative engine shell                 |
| `aeb5a0b` | feat(genesis-studio): add OMNAI creative profile and script DNA UI    |
| `360ce4f` | feat(genesis-studio): add governed storyboard provider shell          |
| `a2b672a` | feat(genesis-studio): add Phase 2B narrative audio intelligence shell |

---

## Commands run

| Command                                                                                                         | Result                                                |
| --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `npm run build` (from `apps/genesis-studio`)                                                                    | **PASS** — compile, lint, typecheck, 12 static routes |
| `git diff --name-only origin/main...origin/cursor/zsanctuary/genesis-studio-omnai-shell -- apps/genesis-studio` | 49 paths (new app)                                    |
| Static grep: provider SDKs, `process.env` provider keys, external `fetch`                                       | **PASS** — no violations                              |
| Static review: API routes, schema, README, UI pages                                                             | **PASS** with minor doc nits                          |

**Not run:** `npm install`, browser E2E, Supabase live migration apply, hub `verify:full`.

---

## Files reviewed (representative)

- `package.json`, `.env.example`, `README.md`
- `app/api/generate-script/route.ts`
- `app/api/generate-storyboard/route.ts`
- `app/api/generate-audio-plan/route.ts`
- `app/page.tsx`, `app/script/page.tsx`, `app/storyboard/page.tsx`, `app/audio/page.tsx`, `app/edit/page.tsx`, `app/publish/page.tsx`
- `lib/creative-profile.ts`, `lib/storyboard-profile.ts`, `lib/audio-profile.ts`, `lib/provider-boundaries.ts`, `lib/genesis-core-registry.ts`, `lib/supabase.ts`
- `supabase/schema.sql`, `supabase/migrations/001_*.sql` … `003_*.sql`
- Studio shell, sidebar, receipt/DNA/frame/plan card components

---

## Pass / fail table

| #   | Check                                    | Result            | Notes                                                                                      |
| --- | ---------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------ |
| 1.1 | `npm run build`                          | **PASS**          | All routes build; API routes dynamic                                                       |
| 1.2 | No provider SDKs in dependencies         | **PASS**          | Only Next, React, Tailwind, Radix slot/tabs, Supabase JS, Zod, Framer Motion, Lucide       |
| 1.3 | No accidental provider packages          | **PASS**          | No `openai`, `replicate`, `elevenlabs`, `@runwayml`, etc.                                  |
| 1.4 | Unused dependencies                      | **WARN**          | `@radix-ui/react-tabs` + `components/ui/tabs.tsx` not imported by any page (scaffold only) |
| 2.1 | Provider routes stub-only                | **PASS**          | All three API routes return mock JSON only; comments for future adapters                   |
| 2.2 | No API keys required to run              | **PASS**          | Supabase env optional; client returns `null` without URL/key                               |
| 2.3 | No external provider calls               | **PASS**          | UI `fetch` only to same-origin `/api/generate-*`                                           |
| 2.4 | `humanReviewRequired` in responses       | **PASS**          | Script: `governance.humanReviewRequired`; storyboard/audio: top-level fields               |
| 2.5 | `providerStatus: "stub-only"`            | **PASS**          | All three lanes                                                                            |
| 2.6 | `drpSafe: true`                          | **PASS**          | Script via `governance`; storyboard/audio flat                                             |
| 3.1 | RLS enabled                              | **PASS**          | `projects`, `scenes`, `assets`                                                             |
| 3.2 | User-owned rows (`auth.uid() = user_id`) | **PASS**          | SELECT/INSERT/UPDATE/DELETE policies on all three tables                                   |
| 3.3 | Future media via `assets`                | **PASS**          | `assets` table; `scenes.storyboard_asset_id`, `scenes.audio_asset_id` FKs in migrations    |
| 3.4 | Scenes lack direct external media URLs   | **PASS**          | No `image_url` / `audio_url` on `scenes`; storyboard stub uses `imageUrl: ""` in API only  |
| 4.1 | Dashboard route exists                   | **PASS**          | `/` — mock projects, static build OK                                                       |
| 4.2 | Script page                              | **PASS**          | Dropdowns, generate script, DNA card, editable scenes (code review)                        |
| 4.3 | Storyboard mock                          | **PASS**          | Style preset + generate mock → `/api/generate-storyboard`                                  |
| 4.4 | Audio mock                               | **PASS**          | Narration/mood + generate plan → `/api/generate-audio-plan`                                |
| 4.5 | Edit / publish placeholders              | **PASS**          | Timeline mock; export warning + disabled platform actions                                  |
| 4.6 | Responsive layout                        | **PASS** (static) | `lg:grid-cols`, collapsible sidebar, `flex-wrap`; no browser regression test               |
| 5.1 | README scripts/routes                    | **PASS**          | Documents script, storyboard, and audio stub APIs                                          |
| 5.2 | PR body vs scope                         | **PASS**          | Matches shell + creative profile + storyboard + audio phases                               |
| 5.3 | Safety notes                             | **PASS**          | README + provider-boundaries + publish warning                                             |

---

## Governance detail

### API routes

| Route                           | Provider call        | Governance fields                                              |
| ------------------------------- | -------------------- | -------------------------------------------------------------- |
| `POST /api/generate-script`     | None (mock)          | `governance: { providerStatus, humanReviewRequired, drpSafe }` |
| `POST /api/generate-storyboard` | None; `imageUrl: ""` | Flat `providerStatus`, `humanReviewRequired`, `drpSafe`        |
| `POST /api/generate-audio-plan` | None (cue list only) | Flat `providerStatus`, `humanReviewRequired`, `drpSafe`        |

### Client network

- `app/script/page.tsx` → `fetch('/api/generate-script')`
- `app/storyboard/page.tsx` → `fetch('/api/generate-storyboard')`
- `app/audio/page.tsx` → `fetch('/api/generate-audio-plan')`

No other `fetch(` to external hosts found in `apps/genesis-studio`.

### Environment

`.env.example` lists only Supabase public vars; provider keys commented as future-only.

---

## Supabase detail

- **RLS:** Enabled on `projects`, `scenes`, `assets` with per-user policies.
- **Scenes columns:** `storyboard_style`, `storyboard_prompt`, `storyboard_asset_id`, `narration_style`, `soundtrack_mood`, `audio_plan`, `audio_asset_id` — metadata and FKs only.
- **Migrations:** `001` projects profile; `002` storyboard scene columns + FK; `003` audio plan columns + FK.
- **`assets.url`:** Exists on `assets` for future governed storage paths — **not** duplicated on `scenes` (aligned with design).

**Operator note:** Apply `schema.sql` or migrations `001`–`003` in order on fresh or existing Supabase projects before persistence phases.

---

## Risks found

| Severity | Risk                                                               | Mitigation                                                    |
| -------- | ------------------------------------------------------------------ | ------------------------------------------------------------- |
| Low      | README storyboard section                                          | **Resolved** in Phase 2C docs commit                          |
| Low      | Unused `@radix-ui/react-tabs` dependency                           | Remove dep + `tabs.tsx` later, or document as UI scaffold     |
| Low      | No live browser/E2E verification in this pass                      | Operator smoke-test `npm run dev` on port 3010 before merge   |
| Low      | `assets.url` could hold external URLs in future phases             | Enforce charter: local/NAS paths or signed internal refs only |
| Info     | Script governance nested under `governance`; storyboard/audio flat | Acceptable; document in API consumer notes                    |
| Info     | Supabase not wired in UI yet (local state only)                    | Expected for stub phases                                      |

**No blocking security or governance failures identified.**

---

## Recommended fixes (optional, non-blocking)

1. **Dependencies:** Drop unused `@radix-ui/react-tabs` if tabs are not planned for next PR; otherwise add one-line README note (“tabs scaffold included”).
2. **Operator checklist:** After merge, run manual smoke on `/`, `/script`, `/storyboard`, `/audio` with `npm run dev`.

---

## Final merge readiness verdict

### **MERGE READY**

The branch meets Z-Sanctuary Turtle Mode expectations for a **stub-only OMNAI Creative Engine shell**:

- Build passes.
- No provider SDKs or live provider integration.
- Governance fields present on all generator APIs.
- Supabase RLS and asset-FK pattern are sound.
- Edit/publish remain clearly placeholder.
- Scope matches the stacked PR narrative (shell → profile → storyboard → audio).

**Recommended action:** Approve and merge after a quick local `npm run dev` smoke by the operator. Pause feature growth until post-merge hardening on `main` as planned.

---

_Generated for Phase 2C review — read-only; no code changes were made in this pass except this report._
