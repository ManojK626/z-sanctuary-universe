# Z-Autonomous Quality Command Audit

**Mode:** Read-only audit (no code changes as part of this report).
**Golden law:** Audit first → choose one fix → verify → stop. No autonomous self-editing, no silent agents, no deploy.

**Goal:** Map where the Z-Sanctuary AI workflow is strong, where it is weak, where repeated mini-bugs may originate, and which IDE or task links are missing — **recommendations only** until you pick a single next step.

**Evidence window:** Repository inspection at audit time (`package.json`, `.vscode/tasks.json`, `.eslintrc.json`, `.eslintignore`, `.cursor/commands`, `.cursor/agents`, `AGENTS.md`, selected scripts/docs). Not a live run of the full verify chain.

---

## 1. Current verification map

| Lane | Primary entry | Role |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CI-style hub signal | `npm run verify:ci` | Execution enforcer gate, then cursor folders verify, sanctuary structure, registry omni, GitHub + Cloudflare comms sync, freshness, system status, guardian, workspace drift |
| Deep technical (no enforcer first in chain definition) | `npm run verify:full:technical` | Folders, hygiene autofix, **lint workspaces + root**, tests, policy lint, timeguard, storage, alias or placeholder or layout audits, security sentinel, data leak, autorun, folder manager status, Python audits, Zuno state, freshness, system status, guardian, **dashboard registry verify** |
| Full with governance bridge | `npm run verify:full` | Wrapper (`z_verify_full_with_bridge_log.mjs`) — see `AGENTS.md` for enforcer posture |
| Daily gate | `npm run verify:daily-gate` | Octave artifact refresh, then conditional **`verify:full`** path and dashboard registry verify — timeboxed “full” pressure |
| Lighter hub signal (documented in slash `/z-full-verify`) | `npm run verify:hub-signal` | When enforcer blocks `verify:ci` — structure-adjacent checks without release gate (per slash doc) |
| Cross-project | `npm run monitor:cross-project` | Health probe; feeds observer JSON (`z-ai-observer-pass`) |
| Comm-flow | `npm run ecosystem:commflow:verify`, `npm run ide:commflow:guard`, `npm run ide:commflow:diagnosis` | Ecosystem verifier JSON + IDE routing guard |
| Connection tree | `npm run z:connection-tree:verify` | Declared tree consistency |
| Twin Roots | `npm run twin-roots:status` | Status artefact |
| Z-CAR² | `npm run z:car2`, `npm run z:car2-plan` | Scan or refactor plan |
| Z-HOAI (tooling) | `npm run hoai:pilot-triage-template` | Template generator — triage docs live under `docs/ai-hand/` |
| Dashboard tiles or paths | `npm run dashboard:registry-verify` | MDGEV or Q&A&RP href → filesystem existence under hub root |
| HTML or security | Tasks **Z: HTML Security Audit**, hygiene or privacy scans | Static or scripted audits |

**Strength:** Many overlapping safety nets exist (structure, registry, lint, tests, guardian, comm-flow, dashboard href resolution).

**Weakness:** The **same concerns** appear under several names (`verify:ci` vs `verify:full:technical` vs daily gate). Operators can lose track of which chain catches which class of bug.

---

## 2. IDE task map

`.vscode/tasks.json` exposes a **large** surface (lenses, AAFRTC variants, sanctuary structure, registry omni, guardian, ARRBCE, Super Chat, folder manager family, privacy or security tools, dashboard openers, **npm: lint:root**, **npm run verify:full:technical**, **npm run lint:md**, **npm run ecosystem:commflow:verify**, **Z: Communication health**, daily verify gate, MDGEV discover, registry verify, cross-project probe, workspace lint, ecosystem drift, mini-bots, etc.).

**Overlap:** Multiple paths open the main dashboard HTML (`index-skk-rkpk.html`) with different profiles — good for ergonomics, risk of **task sprawl** (hard to know the three tasks an operator should memorize).

**Gap:** No task named for **Z-Critical Bug Hunter** (intentionally manual — could still add a **documentation-only** task that opens the brief, not an agent).

**Gap:** **Z-MAOS** has npm scripts (`z:maos-status`, `z:maos-open`, `z:maos-route`) documented in `AGENTS.md` but **no** `.cursor/commands` slash file — IDE tasks not verified exhaustively in this audit for every MAOS script.

---

## 3. AI or overseer capability map

| Capability | Where it lives | Linked to IDE or slash? |
| -------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Hierarchy Chief | `docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md`, `/z-chief` | Slash yes |
| Registry omni | Script plus tasks | Yes |
| AAFRTC | `aafrtc:*`, `/z-aafrtc` | Yes |
| Turtle Mode agents | `.cursor/rules/z-turtle-mode-cursor-agents.mdc` | Rule always-on |
| AGENTS.md hub index | Paths to GitHub, Cloudflare, verify intents | Entry doc |
| Observer pass | `/z-ai-observer-pass` | Yes |
| Z-Critical Bug Hunter | `docs/Z-CRITICAL-BUG-HUNTER-BRIEF.md`, agent `z-critical-bug-hunter`, `/z-critical-bug-hunter` | Slash plus agent; **not** a verify npm script (correct) |
| Z-SAGE | Schema v1, Commander bridge, stub JSON | Dashboard fetch only; **no** automated signal producer in audit scope |
| Z-EDII / Shadow / RPWC / Doorway | Doctrine docs | No automation (by design) |
| Z-UCCR | `docs/universal-canvas/` | Docs plus cursor-ops prompts |
| Z-ANIMA | Register plus module docs | Doctrine or registry |
| Z-Connection Tree | Philosophy doc plus `z:connection-tree:verify` | Partial (verify script) |
| Z-HOAI | `docs/ai-hand/*`, HOAI template script | Docs strong; script link from slash map weak |
| Z-SIVA | Referenced as verifier in `Z-SAGE-CORE-OBSERVATION-PROTOCOL.md` | **No** dedicated npm task found in sampled grep — treat as **doctrine or future verifier**, not a wired gate |
| Z-MAOS | Charter under `docs/z-maos/`, npm scripts | **No** dedicated slash command |

---

## 4. Repeated bug prevention gaps

Observed patterns that commonly produce **small, repeated** issues in large hubs like this:

1. **HTML or dashboard JS edited without matching verify:** Commander or panel scripts can drift until someone runs **`verify:full:technical`** or opens the dashboard on a static server. **`dashboard:registry-verify`** checks registry hrefs, not every script load path or runtime console error.

2. **Markdown or tables:** Contributors fix prose locally; **`lint:md`** catches much but must be run deliberately.

3. **Cross-project comm-flow:** Routing conventions drift; **`ecosystem:commflow:verify`** and IDE guard exist but are easy to skip on “small” edits.

4. **Schema-shaped JSON (e.g. Z-SAGE v1):** Consumer guards help Commander, but **producers** can still emit invalid JSON if no CI step validates against schema (no schema validator script in this audit’s scope).

5. **Task or script duplication:** Similar outcomes from `verify:ci`, `verify:full:technical`, and daily gate — confusion leads to **skipped** runs or double runs.

6. **Multi-root workspaces:** Emit or lint tasks help (`workspace:lint`, `ecosystem:workspace-drift`); mis-synced roots still cause path bugs.

---

## 5. Daily checks vs serious checks

**Suggested mental model (audit recommendation, not policy change):**

| Tier | Examples | Intent |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Daily or pre-push light** | Structure verify, registry omni, report freshness, `lint:root` on touched JS, `lint:md` on touched docs, `dashboard:registry-verify` when dashboard registry changed | Fast feedback, syntax or link breakage |
| **Serious or pre-merge** | `verify:full:technical` or AAFRTC-aligned full core when governance allows | Breadth plus tests plus Python plus dashboard registry |
| **Governance gated** | `verify:ci` / `verify:full` when execution enforcer expects manual release | Release truth — do not bypass |

**Note:** `verify:daily-gate` can invoke **`verify:full`**, which is **heavy** — “daily” in name is a gate discipline, not necessarily “quick.”

---

## 6. Missing links

1. **Slash command for Z-MAOS** — scripts exist; no `/z-maos-*` mirror in `.cursor/commands/` (operators rely on npm or memory).

2. **Z-HOAI** — rich docs under `docs/ai-hand/`; weak single-entry slash or task alias for “start HOAI triage here.”

3. **Z-Critical Bug Hunter** — documented and linked in `AGENTS.md`; still **optional** for operators who never read `AGENTS.md`.

4. **Z-SAGE signal producer** — Commander consumes `data/reports/z_sage_signals.json`; **who** updates it and when is not wired as a named npm ritual (by doctrine: avoid silent automation).

5. **SIVA** — named in SAGE protocol but no single script surfaced in quick repo search; verifier story incomplete for newcomers.

6. **“Workspace health” one-glance ritual** — `/z-full-verify` helps; no single task titled **Open workspace health** aggregating structure plus freshness plus comm-flow chip.

---

## 7. Recommended safe improvements

All **documentation or single small additions** — pick **one** before implementing anything:

1. Add **one** slash command file `.cursor/commands/z-maos.md` that points to `docs/z-maos/README.md` and lists `npm run z:maos-status`, `z:maos-open`, `z:maos-route` (no new automation).

2. Add a **Workspace health** checklist section to `AGENTS.md` or `/z-full-verify` with three bullets: structure + registry + freshness (already partly there — tighten).

3. Document **when** to run `dashboard:registry-verify` vs opening the dashboard manually (already implied — make explicit in Creator Manual or dashboard README).

4. Optional **read-only** JSON schema check script for `z_sage_signals.json` (future) — explicitly **manual or CI opt-in**, not background.

5. Ensure **new** dashboard scripts are mentioned beside **`lint:root`** in contributor notes (eslint already includes `dashboard/scripts` unless ignored — confirmed `.eslintignore` does not exclude them).

---

## 8. Forbidden automation

Do **not**, without explicit governance approval:

- Background agents that edit repos or open PRs autonomously
- Automatic cross-project fixes
- Silent scheduled “self-upgrade” of prompts or rules
- Deploy or merge hooks driven by AI audit output
- Registry or execution-enforcer changes triggered by this audit report

The safe pattern remains: **human chooses one fix → verify → stop.**

---

## 9. Suggested next 3 small fixes

Smallest, lowest-risk actions **after** you approve **one** at a time:

1. **Add `/z-maos` slash command** — markdown only, links to charter and npm scripts (mirrors pattern of `/z-registry`).

2. **Extend `/z-full-verify` or `AGENTS.md`** with a single **three-step daily ritual** line: structure verify, registry omni, report freshness (avoid duplicating long prose).

3. **Dashboard contributor note:** one sentence in `dashboard/` README or existing doc — “After editing `dashboard/scripts/*.js`, run `npm run lint:root` from hub root.”

---

## 10. Rollback or safety note

This file is **audit documentation only**. Removing it has **no** runtime effect. Any follow-up change (slash command, doc edit) should use normal git revert or Turtle Mode branch practice.

**Confidence:** Medium-high on maps derived from static files; **low** for “which bugs repeat most” without mining issue history — section 4 is informed judgment, not metrics.

---

## Audit closure

**No automated fixes were applied.**
Next operator move: choose **one** item from section 9 (or section 7), implement, run the appropriate verify tier from section 5, then stop.
