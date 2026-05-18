# Phase 3A.1 — Smoke + Merge Readiness

**Branch:** `cursor/zsanctuary/genesis-studio-omnai-shell`  
**Base:** `main`  
**Date:** 2026-05-16  
**Scope:** Merge readiness after Phase 3A persistence — **no new features** (3B held)

---

## Verdict

| Gate              | Status        |
| ----------------- | ------------- |
| Build             | **PASS**      |
| Static safety     | **PASS**      |
| Phase 3A scope    | **PASS**      |
| Operator smoke    | **PENDING**   | AMK runs checklist below |
| **Merge posture** | **MERGE READY** | After operator smoke signs off |

**Overall:** **GREEN** for technical merge readiness — **YELLOW** until operator completes browser smoke (expected).

---

## Branch commits (Genesis Studio)

| SHA       | Message                                                        |
| --------- | -------------------------------------------------------------- |
| `a90e03c` | feat(genesis-studio): add OMNAI creative engine shell          |
| `aeb5a0b` | feat(genesis-studio): add OMNAI creative profile and script DNA UI |
| `360ce4f` | feat(genesis-studio): add governed storyboard provider shell   |
| `a2b672a` | feat(genesis-studio): add Phase 2B narrative audio intelligence shell |
| `f167d15` | docs(genesis-studio): add Phase 2C PR review report            |
| `644dd0c` | docs(genesis-studio): add OMNAI roadmap and continuation law   |
| `e686502` | feat(genesis-studio): add Phase 3A project persistence shell   |

---

## Automated checks (Cursor)

| Check | Command / method | Result |
| ----- | ---------------- | ------ |
| Production build | `cd apps/genesis-studio && npm run build` | **PASS** — compile, lint, types, 12 routes |
| Provider SDKs in `package.json` | Static review | **PASS** — none added |
| External `fetch` | Grep `apps/genesis-studio` | **PASS** — only `/api/generate-*` same-origin stubs |
| Autosave / `setInterval` persistence | Grep | **PASS** — no background save loops |
| Phase 3A files present | `lib/projects.ts`, `lib/scenes.ts`, receipt card | **PASS** |

**Not run:** `npm install`, live Supabase migration apply, hub `verify:full`, browser automation.

---

## Phase 3A merge criteria

| # | Criterion | Status |
| - | --------- | ------ |
| 1 | Project create / list / load / update helpers exist | **PASS** |
| 2 | Scene save / load on explicit user action | **PASS** |
| 3 | Mock fallback when Supabase env missing | **PASS** |
| 4 | Mock fallback when env set but no auth session | **PASS** |
| 5 | Persistence receipt visible (storage, save status, provider `none`) | **PASS** |
| 6 | No media uploads | **PASS** |
| 7 | No real providers / billing / deployment | **PASS** |
| 8 | No background sync | **PASS** |
| 9 | RLS documented (`auth.uid() = user_id`) | **PASS** |
| 10 | `PHASE_3A_PROJECT_PERSISTENCE_REPORT.md` GREEN | **PASS** |

---

## Operator smoke checklist (required before merge)

Run from repo:

```bash
cd apps/genesis-studio
npm run dev
```

Open [http://localhost:3010](http://localhost:3010).

### A — Dashboard (`/`)

- [ ] Storage label visible (mock fallback or Supabase signed-in).
- [ ] Project cards render.
- [ ] **New Project** creates a draft and navigates to Script with `?projectId=`.
- [ ] Clicking an existing project opens Script with correct id.

### B — Script (`/script?projectId=…`)

- [ ] Project title / description / status fields visible.
- [ ] Generate Script produces mock scenes (stub API).
- [ ] Edit a scene title or body locally.
- [ ] **Save to Project** updates persistence receipt (`Saved`, timestamp, project id).
- [ ] Reload page — scenes and project fields restore (mock localStorage or Supabase).

### C — Governance surfaces (unchanged lanes)

- [ ] `/storyboard` — mock frames only, no external image URLs.
- [ ] `/audio` — mock audio plan only.
- [ ] `/publish` — human-review warning still visible.

### D — Optional Supabase path (only if env + auth configured)

- [ ] Sign in via Supabase Auth (dashboard / app — no in-app UI in 3A).
- [ ] Storage label shows Supabase signed-in.
- [ ] Create + save persists rows under RLS.

**Sign-off:** AMK initials/date when A–C pass (D optional).

---

## Risks (merge blockers vs notes)

| Severity | Item | Merge impact |
| -------- | ---- | ------------ |
| Low | No in-app Supabase Auth UI | Mock fallback covers local dev; document for operators |
| Low | `@radix-ui/react-tabs` unused | Scaffold only — same as Phase 2C |
| Info | Scene save = delete all + re-insert | Acceptable for 3A; not a merge blocker |
| **None** | Provider leakage, autosave, uploads | No blockers found |

---

## PR body snippet (append)

```md
## Phase 3A.1 — Smoke + Merge Readiness

- Build PASS
- Phase 3A persistence criteria PASS
- Operator browser smoke checklist included
- MERGE READY after AMK smoke sign-off
- Phase 3B not started
```

---

## After merge

1. Pull `main` locally.
2. **Do not** start Phase 3B until AMK reviews 3A smoke sign-off.
3. Next build lane: **Phase 3B** — Creative Timeline Intelligence (per roadmap).

---

## Rollback

Revert merge commit on `main` or reset branch to pre-3A tag; remove Phase 3A files per `PHASE_3A_PROJECT_PERSISTENCE_REPORT.md` rollback section.
