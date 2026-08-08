# AMK-Goku Control Panel — Full Project & Workflow Reconciliation

**Posture:** Read-only · evidence-first · **no registry mutations applied**
**Audit date:** 2026-08-08 (operator local)
**Hub repo:** `Z_Sanctuary_Universe`
**Branch (artifact):** `cursor/zsanctuary/amk-goku-control-panel-reconciliation`
**Identity map:** [PROJECT_IDENTITY_RECONCILIATION.md](PROJECT_IDENTITY_RECONCILIATION.md)
**Stewardship axiom:** The Control Panel must describe reality, not manufacture completeness.

---

## Executive Result

| Metric                                                               | Evidence-backed count / note                                                                                                                                                        |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PC-root projects registered                                          | **22** active (+ 1 retired slot in file structure) — `data/z_pc_root_projects.json` (`updated_at` 2026-07-10)                                                                       |
| On-disk under `C:/Cursor Projects Organiser` matching registry paths | **18** present · **4** empty-path / missing (`amk-goku-dashboards-2`, `eirmind-ireland-projects-missing`, `replit-roulette-z-amk-goku-mdcp`, `z-sanctuary-browser-z-saiyan-lumina`) |
| AMK Main Control indicator rows                                      | **55** — `dashboard/data/amk_project_indicators.json` (hub systems / governance — **not** PC-root 1:1)                                                                              |
| Project Doorway rows                                                 | **7** — `data/amk_project_doorway_registry.json`                                                                                                                                    |
| Projects invented this audit                                         | **0**                                                                                                                                                                               |
| Registry rows deleted/merged this audit                              | **0** (none applied)                                                                                                                                                                |
| Duplicate/alias candidates (priority)                                | Dashboards 2 vs hub MC · Aisling ↔ ÉirMind · Replit local vs Replit URL                                                                                                             |
| Status corrections applied                                           | **0** — proposals only                                                                                                                                                              |
| Workflow gaps                                                        | Most PC-root members lack indicator + doorway + documented hub verify lane                                                                                                          |

**Primary structural finding:** “Missing from the AMK-Goku Control Panel” often means **absent from indicators / canvas / doorway**, not “absent from the universe registry.” PC-root and Main Control are **different layers**.

---

## Discovery table (priority entities)

| Candidate name           | Canonical (provisional) | Aliases          | Project ID                         | Repository                | Directory                        | Docs                       | Dashboard record                                  | GitHub             | Runtime                             | Workflow                      | Last activity              | Dash status                  | Evidence                   | Duplicate?              | Action                | Evidence refs                                                                 |
| ------------------------ | ----------------------- | ---------------- | ---------------------------------- | ------------------------- | -------------------------------- | -------------------------- | ------------------------------------------------- | ------------------ | ----------------------------------- | ----------------------------- | -------------------------- | ---------------------------- | -------------------------- | ----------------------- | --------------------- | ----------------------------------------------------------------------------- |
| Amk-Goku Dashboards 2    | UNKNOWN / HOLD          | Dashboard 2      | `amk-goku-dashboards-2`            | —                         | empty                            | Weak (matrices)            | PC-root YES · indicators NO · map NO · doorway NO | NO                 | NO                                  | NO                            | notes 2026-04-26           | Frozen / path_unregistered   | PARTIAL                    | YES candidate vs hub MC | HOLD / MERGE REVIEW   | `z_pc_root_projects.json`; maturity matrix; disk probe False                  |
| Sister Aisling Sol       | Sister Aisling Sol      | Aisling-Sol      | `sister-aisling-sol`               | local (no `.git` at root) | `Z-Sister Aisling Sol`           | Family AI + alignment docs | PC-root YES · indicators NO · doorway NO          | NO                 | local package YES                   | PARTIAL                       | folder present 2026-08-08  | member                       | VERIFIED disk              | NO                      | RECONCILE display     | path; `package.json` name `z-sister-aisling-sol`; `z_family_ai_registry.json` |
| ÉirMind (brand)          | HOLD — see Aisling      | Eirmind          | `eirmind` (indicator)              | nested under Aisling      | `…/Z-Sister Aisling Sol/eirmind` | README monorepo            | indicator YES · map YES (dashed)                  | NO this audit      | nested monorepo tools               | PARTIAL                       | nested README present      | PURPLE / NO_GO               | VERIFIED nested            | YES vs Aisling          | MERGE REVIEW          | `eirmind/README.md`; indicators; EIRMIND\_\* docs                             |
| ÉirMind Ireland Projects | stub                    | Ireland Projects | `eirmind-ireland-projects-missing` | —                         | empty                            | alignment docs             | PC-root YES                                       | NO                 | NO                                  | NO                            | 2026-06-11 absent          | path_missing                 | PARTIAL                    | lineage YES             | HOLD                  | pc_root notes; EIRMIND_ALIGNMENT_DECISION.md                                  |
| Z-Sanctuary Replit       | Z-Sanctuary Replit      | —                | `z-sanctuary-replit`               | `.git` empty history      | `Z-Sanctuary_Replit`             | README                     | PC-root YES · indicators NO                       | NO remote verified | Vite :5190 claimed, not probed live | PARTIAL (`npm run verify:md`) | files + export tar present | often “UNKNOWN” in narrative | CONFLICT narrative vs disk | related to roulette URL | RECONCILE status text | README; package name; disk; deployment readiness JSON                         |
| Roulette Replit (hosted) | separate                | Z-Amk-Goku MD/CP | `replit-roulette-z-amk-goku-mdcp`  | Replit URL                | empty pc_root                    | notes                      | PC-root YES                                       | Replit link        | EXTERNAL                            | link-only                     | URL in registry            | registered_linked            | PARTIAL                    | related to local Replit | HOLD external         | pc_root; maturity matrix                                                      |

Full PC-root roster remains authoritative for enumeration; this table focuses Steward attention on the three named inquiries.

---

## Specific Findings

### 1. AMK-Goku Dashboard 2

**Observation under test:** «AMK-Goku Dashboard 2 is missing from the AMK-Goku Control Panel.»

| Hypothesis                                  | Result                                                               |
| ------------------------------------------- | -------------------------------------------------------------------- |
| A. Separate live project                    | **Not proven** — no directory, no dashboard_url, no indicator        |
| B. Second dashboard UI for existing project | **Possible** — unproven                                              |
| C. Successor/version of Main Control        | **Possible** — maturity matrix: “Unknown lineage vs current hub MC”  |
| D. Alias only                               | **Operator speech** maps to registry id; not a second citizen proven |
| E. Archived dashboard                       | **Compatible** with Frozen / Archive future_path — not signed        |
| F. Repo exists but absent from registry     | **Opposite:** registry **has** row; **disk missing**                 |
| G. Documentation-only                       | **Closest today** — registries + reports only                        |
| H. Unresolved identity                      | **YES — HOLD**                                                       |

**Evidence:**

1. `data/z_pc_root_projects.json` → id `amk-goku-dashboards-2`, `path=""`, `hosting=link-only`, `migration_status=path_unregistered`, notes no folder since **2026-04-26**.
2. Disk probe: `Amk-Goku Dashboards 2` / `amk-goku-dashboards-2` under PC root → **absent**.
3. `dashboard/data/amk_project_indicators.json` → **no** id `amk-goku-dashboards-2`.
4. Grep of `dashboard/` HTML/JSON for “Dashboards 2” / that id → **no** Control Panel tile.
5. `data/reports/z_universe_project_maturity_matrix.json` → `current_state: Frozen`, `confidence: Inferred`, blocker `empty path`.

**Conclusion:** Dashboard 2 is a **registered PC-root citizen without a restored path**, and it is **not wired into Main Control indicators/canvas**. That explains the operator observation without inventing a new project.

**Proposed registry entry:** **None** (row already exists).
**Proposed relationship:** record `identity_relation = UNRESOLVED` vs Main Control until Steward picks D2-\* decision.
**Do not** add a duplicate “Dashboard 2” project.

---

### 2. Sister Aisling-Sol / Eirmind

**Observation under test:** apparent duplication of «Sister Aisling-Sol» and «Eirmind».

| Question                       | Evidence-based answer                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Same underlying system?        | **Same lineage**; ÉirMind **lives on disk as a nested monorepo** under Sister Aisling Sol                           |
| Project vs persona?            | Aisling = **PC-root / Family AI project**; ÉirMind = **product/brand + nested workspace + hub reference indicator** |
| Earlier name?                  | Ireland Projects path was prior home (**missing**); Aisling carries lineage per notes                               |
| Subsystem?                     | **Yes** — `Z-Sister Aisling Sol/eirmind/` with its own `package.json` / pnpm workspace                              |
| Independent separate projects? | **Not as two equal PC folders today** — only one on-disk root + one missing stub + one hub indicator                |

**Prior Steward docs (still active):**

- [docs/root-discovery-audit/EIRMIND_ALIGNMENT_DECISION.md](root-discovery-audit/EIRMIND_ALIGNMENT_DECISION.md) — default **EMK-HOLD**; working recommendation **EMK-REHOME** under Aisling (**not executed**).
- [docs/root-discovery-audit/EIRMIND_REALITY_CHECK.md](root-discovery-audit/EIRMIND_REALITY_CHECK.md) — no ÉirMind backend in hub; magical canvas reference-only.

**Canonical from strongest evidence (disk + package + Family AI):**

```text
identity_relation = SUBSYSTEM (+ SAME_PROJECT lineage for missing Ireland Projects — pending Steward)
canonical_name    = Sister Aisling Sol
aliases           = [ÉirMind, Eirmind, Sister Aisling-Sol, Ireland Projects (former path)]
confidence        = VERIFIED (nested monorepo) · HOLD (final EMK-* product home)
```

**Do not** auto-merge `sister-aisling-sol` and `eirmind-ireland-projects-missing` rows.
**Do not** delete the missing Ireland Projects stub (history).
**Do not** treat indicator `eirmind` as proof of a second Organiser root folder.

---

### 3. Z-Sanctuary Replit (`status = UNKNOWN`)

**Do not replace UNKNOWN with GREEN.**

| Candidate state | Supported?                                                                      | Why                                                                                                             |
| --------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| ACTIVE          | **PARTIAL**                                                                     | Folder + package + README + export artifacts exist; **Vite :5190 not verified running**; git has **no commits** |
| INACTIVE        | possible                                                                        | empty git history suggests incomplete localization                                                              |
| ARCHIVED        | unproven                                                                        | export tar present but not labeled archive by Steward                                                           |
| PLANNED         | no                                                                              | more than a plan — files exist                                                                                  |
| MIGRATED        | **PARTIAL candidate**                                                           | related to external `replit-roulette-…`; `.replit` config **absent** locally                                    |
| DEPRECATED      | unproven                                                                        |                                                                                                                 |
| EXTERNAL        | applies to **sibling** `replit-roulette-z-amk-goku-mdcp`, not this folder alone |
| UNKNOWN         | **still valid for cloud/live**                                                  | historical Replit link + local mirror without live proof                                                        |

**Refined stewardship state (recommended wording — not applied to registries):**

```text
status = UNKNOWN
reason = historical Replit lineage + local mirror folder verified; live Replit workspace / :5190 process / GitHub remote not verified
last_evidence = 2026-08-08 disk + README + package.json name z-sanctuary-replit; git "No commits yet on main"
next_verification =
  1) confirm whether Vite on 127.0.0.1:5190 is intended and startable
  2) confirm relationship to https://replit.com/@manojkeerpal/Roulette-Data-Analyzer
  3) AMK signs ACTIVE local vs MIGRATED vs EXTERNAL-only vs ARCHIVE
```

Deployment readiness report already lists this id as **OBSERVE_ONLY_NOT_DEPLOYABLE** / seed — consistent with non-GREEN.

---

## Workflow recall (priority projects)

| Project            | Purpose                     | Identity                | Repo              | Branch          | Build       | Runtime               | Deploy           | Secrets                                     | Gates   | Verify              | Receipts               | Phase             | Next approved       | Blocked              | Steward |
| ------------------ | --------------------------- | ----------------------- | ----------------- | --------------- | ----------- | --------------------- | ---------------- | ------------------------------------------- | ------- | ------------------- | ---------------------- | ----------------- | ------------------- | -------------------- | ------- |
| Dashboards 2       | Unclear (legacy dashboard?) | `amk-goku-dashboards-2` | —                 | —               | —           | —                     | —                | —                                           | human   | —                   | path_unregistered note | Frozen            | D2 Steward decision | invent path / GREEN  | AMK     |
| Sister Aisling     | Family / ÉirMind lineage    | `sister-aisling-sol`    | local no root git | —               | npm/package | local HTML/apps       | NO_GO hub bridge | unknown                                     | EMK-\*  | per project scripts | Family AI row          | Turtle            | EMK decision        | silent hub merge     | AMK     |
| ÉirMind nested     | Living Island monorepo      | under Aisling           | nested            | —               | pnpm        | docker compose + apps | NO_GO from hub   | payment services in tree — **do not touch** | charter | `pnpm -r` docs      | alignment docs         | Hold              | EMK-REHOME review   | deploy/billing       | AMK     |
| Z-Sanctuary Replit | Roulette Vite artifacts     | `z-sanctuary-replit`    | empty git         | main empty      | npm         | claimed :5190         | observe-only     | —                                           | Turtle  | `npm run verify:md` | README                 | seed              | REP-STATUS          | deploy               | AMK     |
| Hub Main Control   | Read-only compass           | HTML + map JSON         | hub               | Turtle branches | static      | http-server :5502     | n/a              | none                                        | sacred  | fetch JSON only     | phase receipts         | sealed map phases | none for this audit | execute from browser | AMK     |

---

## Cross-reference matrix

| Project             | Registry (pc_root) | Main Control / indicators | “Dashboard 2” surface | GitHub         | Docs   | Workflow  | Status note           |
| ------------------- | ------------------ | ------------------------- | --------------------- | -------------- | ------ | --------- | --------------------- |
| Dashboards 2        | YES                | NO                        | itself missing path   | NO             | weak   | none      | Frozen / UNKNOWN live |
| Sister Aisling      | YES                | NO (ÉirMind brand YES)    | n/a                   | NO             | YES    | PARTIAL   | on disk               |
| ÉirMind indicator   | stub + nested      | YES (PURPLE)              | n/a                   | NO             | YES    | PARTIAL   | NO_GO                 |
| Z-Sanctuary Replit  | YES                | NO                        | n/a                   | NO (empty git) | README | PARTIAL   | refine UNKNOWN        |
| Roulette Replit URL | YES                | NO                        | n/a                   | Replit         | notes  | link-only | external              |
| Hub Main Control    | hub itself         | YES                       | n/a                   | hub remote     | YES    | YES       | read-only             |

**Inconsistency flags:**

1. PC-root citizens generally **not** mirrored as indicator ids (by design of Main Control — but easy to misread as “missing”).
2. ÉirMind **visible** on Control Panel; Sister Aisling **folder** not listed as its own indicator.
3. Dashboards 2 registered but **invisible** on Control Panel and **absent** on disk.
4. Replit **on disk** while some narrative surfaces still say vague UNKNOWN without the refined reason.

---

## Orphans (A–G)

| Class                                                       | Finding                                                                                                                     |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **A** Documented / registered but absent from Control Panel | Most PC-root members (incl. Dashboards 2, Sister Aisling, Z-Sanctuary Replit) — Doorway only lists 7                        |
| **B** Control Panel without supporting repo                 | Indicator `eirmind` is intentional reference-only (documented NO_GO) — not a false invent; still not a runnable hub service |
| **C** Repos without project identity                        | Nested `eirmind/` is identified via parent Aisling + README; Replit folder identified via pc_root                           |
| **D** Aliases as separate projects                          | Risk: treating ÉirMind indicator + Ireland stub + Aisling as three peers — **HOLD / MERGE REVIEW**                          |
| **E** Contradictory statuses                                | Replit: disk present vs narrative UNKNOWN vs readiness OBSERVE_ONLY — reconcile **wording**, not paint GREEN                |
| **F** UNKNOWN where evidence exists                         | Z-Sanctuary Replit — refine UNKNOWN with reason (above)                                                                     |
| **G** Evidence but no recorded workflow                     | Dashboards 2; several PC-root members without hub verify lane                                                               |

---

## Status reconciliation model (applied to findings)

| Status  | Use here                                                                                                               |
| ------- | ---------------------------------------------------------------------------------------------------------------------- |
| GREEN   | **Not assigned** to Dashboards 2, ÉirMind deploy, or Replit live                                                       |
| YELLOW  | Optional advisory for “visible brand / missing path” (ÉirMind capsule) — existing reports already use YELLOW in places |
| BLUE    | EMK-_ and D2-_ Steward decisions                                                                                       |
| RED     | Not asserted without unsafe/block evidence                                                                             |
| UNKNOWN | Dashboards 2 live identity; Replit cloud/live process                                                                  |

---

## Registry Changes — **PROPOSALS ONLY** (not applied)

### ADDED

- _(none required for Dashboards 2 — row exists)_
- Optional **future** (Steward-gated): indicator or Doorway row for `sister-aisling-sol` and/or `z-sanctuary-replit` if Main Control should show PC-root citizens — **separate UI domain PR**

### RENAMED

- _(none)_

### ALIASES (documentary)

| Alias                              | Canonical / parent                                       |
| ---------------------------------- | -------------------------------------------------------- |
| Dashboard 2 / AMK-Goku Dashboard 2 | `amk-goku-dashboards-2`                                  |
| Sister Aisling-Sol                 | `sister-aisling-sol`                                     |
| ÉirMind / Eirmind                  | SUBSYSTEM under Sister Aisling Sol + indicator `eirmind` |
| Ireland Projects                   | stub `eirmind-ireland-projects-missing`                  |

### MERGED

- **None applied.** Candidate: Ireland Projects stub → Aisling after **EMK-REHOME** only.

### STATUS UPDATED (proposed text only)

| Id                      | From              | To (proposal)                                |
| ----------------------- | ----------------- | -------------------------------------------- |
| `z-sanctuary-replit`    | vague UNKNOWN     | UNKNOWN + reason + next_verification (above) |
| `amk-goku-dashboards-2` | path_unregistered | keep; add Steward D2-\* queue — do not GREEN |

### HELD

- All merges touching history
- Any GREEN for Dashboards 2 / ÉirMind deploy / Replit live
- External Replit URL checks requiring network credentials
- Payment/services inside nested ÉirMind tree

---

## Remaining Unknowns

1. Where did **Amk-Goku Dashboards 2** folder / repo last live (NAS, other PC, Replit export)?
2. Is Dashboards 2 a **predecessor** of `amk-goku-main-control.html` or a **sibling product**?
3. Will AMK sign **EMK-REHOME** so ÉirMind nested path becomes the declared product home?
4. Is **Roulette-Data-Analyzer** on Replit still the live host for MD/CP, with local folder only a mirror?
5. Should Main Control gain an explicit **PC-root roster panel**, or stay governance-indicators-only?
6. Empty git on `Z-Sanctuary_Replit` — intentional quarantine or incomplete import?

---

## Triple-check

| Pass              | Result                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1 Structural**  | PC-root ids, paths, disk probes, indicator id absence, doorway count, nested `eirmind/` — **agree**                                               |
| **2 Semantic**    | Aisling vs ÉirMind naming; Main Control ≠ PC roster; Dashboards 2 ≠ proven new project — **agree**                                                |
| **3 Operational** | README/package/verify strings read; Vite/Replit live **not** claimed; no secrets touched — **agree** that VERIFIED is limited to structural facts |

Items marked VERIFIED above passed all three for **existence/identity structure** only. Live runtime GREEN did **not** pass Pass 3.

---

## Verification Receipt

| Field                         | Value                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Audit date                    | 2026-08-08                                                                                                                                                                                                                                                                                                                                                                        |
| Repository / branch           | `Z_Sanctuary_Universe` · `cursor/zsanctuary/amk-goku-control-panel-reconciliation`                                                                                                                                                                                                                                                                                                |
| Evidence sources              | `data/z_pc_root_projects.json`; `dashboard/data/amk_project_indicators.json`; `dashboard/data/amk_control_dashboard_map.json`; `data/amk_project_doorway_registry.json`; `data/z_family_ai_registry.json`; `docs/root-discovery-audit/EIRMIND_*.md`; `docs/AMK_GOKU_MAIN_CONTROL_DASHBOARD.md`; on-disk `Z-Sister Aisling Sol`, `Z-Sanctuary_Replit`; maturity/deployment reports |
| Triple-check                  | Structural + semantic + operational **aligned** for HOLD/PARTIAL conclusions                                                                                                                                                                                                                                                                                                      |
| Files changed                 | `docs/AMK_GOKU_CONTROL_PANEL_RECONCILIATION.md` (this file); `docs/PROJECT_IDENTITY_RECONCILIATION.md`                                                                                                                                                                                                                                                                            |
| Files **not** changed         | All registries, indicators, doorway JSON, runtime, secrets, deploy config                                                                                                                                                                                                                                                                                                         |
| Commands executed             | Disk probes; `git` status in Replit folder; Node reads of JSON registries; content reads of READMEs / alignment docs                                                                                                                                                                                                                                                              |
| Final registry state          | **Unchanged**                                                                                                                                                                                                                                                                                                                                                                     |
| Outstanding Steward decisions | **D2-\*** · **EMK-\*** · **REP-STATUS** · optional Control Panel PC-root visibility charter                                                                                                                                                                                                                                                                                       |

---

## Safety Stop (honored)

Stopped before merge/delete/status paint because:

- Dashboards 2 vs Main Control lineage **conflicts / insufficient**
- ÉirMind ↔ Aisling needs **signed EMK-\*** (auto-merge would risk history)
- Live Replit / :5190 would need **external/runtime** verification

```text
STATUS = HOLD (for those decisions)
REASON = evidence incomplete or Steward gate required
REQUIRED STEWARD DECISION = see D2-*, EMK-*, REP-STATUS above
```

---

## Next safe actions (suggestions only — AMK chooses)

1. Review this report + [PROJECT_IDENTITY_RECONCILIATION.md](PROJECT_IDENTITY_RECONCILIATION.md).
2. Sign one **EMK-\*** and one **D2-\*** option.
3. If Control Panel should list PC-root citizens: charter a **docs+UI** Turtle branch (separate domain) to add a read-only roster fed by `z_pc_root_projects.json` — without inventing GREEN.
4. Optionally refresh `npm run z:pc:activation` for a session receipt (human-run).

**No auto-merge. No auto-deploy. No invented completeness.**
