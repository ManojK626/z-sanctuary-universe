# Project Identity Reconciliation Map

**Posture:** Audit artifact only · **no registry mutations**
**Audit date:** 2026-08-08
**Hub branch (writing):** `cursor/zsanctuary/amk-goku-control-panel-reconciliation`
**Authority:** Repository evidence over model memory
**Companion report:** [AMK_GOKU_CONTROL_PANEL_RECONCILIATION.md](AMK_GOKU_CONTROL_PANEL_RECONCILIATION.md)

---

## How to read this map

Every alias resolves to exactly one of:

| Relation                    | Meaning                                              |
| --------------------------- | ---------------------------------------------------- |
| `SAME_PROJECT`              | Two names for one citizen                            |
| `SUBSYSTEM`                 | Nested capability / monorepo inside a parent project |
| `VERSION`                   | Same line, numbered surface                          |
| `SUCCESSOR` / `PREDECESSOR` | Ordered replacement                                  |
| `SEPARATE_PROJECT`          | Distinct citizen with own evidence                   |
| `UNRESOLVED`                | Insufficient or conflicting evidence — **HOLD**      |

Statuses in this map are **evidence labels**, not dashboard paint.

---

## 1. Amk-Goku Dashboards 2

```text
Canonical Project (provisional registry id)
└── id: amk-goku-dashboards-2
    ├── display: Amk-Goku Dashboards 2
    ├── aliases: ["Dashboard 2", "AMK-Goku Dashboard 2"]  ← operator speech only
    ├── repository: UNRESOLVED (no local path; no verified GitHub URL in pc_root row)
    ├── directory: EMPTY in data/z_pc_root_projects.json (notes: absent since 2026-04-26)
    ├── dashboard records:
    │   ├── PC-root registry: YES
    │   ├── amk_project_indicators.json: NO (id absent)
    │   ├── amk_control_dashboard_map.json ecosystem node: NO
    │   └── amk_project_doorway_registry.json: NO
    ├── documentation: maturity/memory matrices + pc_root notes only (Weak)
    ├── workflow: UNRESOLVED — no runnable path, no verify command tied to this id
    ├── status evidence: path_unregistered · maturity current_state=Frozen (Inferred)
    ├── linked systems: possible relation to hub Main Control / Replit MD/CP — UNRESOLVED
    └── stewardship state: HOLD · MERGE REVIEW · do not invent GREEN
```

| Field                                  | Value                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| identity_relation (vs Main Control)    | `UNRESOLVED` — may be VERSION / PREDECESSOR / SEPARATE / archived export        |
| identity_relation (vs Replit roulette) | `UNRESOLVED` — maturity matrix does **not** assert Dashboards 2 = Replit        |
| confidence                             | `PARTIAL` (registry row verified; disk/GitHub absent)                           |
| recommended_action                     | `HOLD` — Steward decides Restore path / Archive / Alias-to-hub / Link to Replit |

---

## 2. Sister Aisling Sol ↔ ÉirMind

```text
Canonical disk / PC-root citizen
└── Sister Aisling Sol
    ├── id: sister-aisling-sol
    ├── path: C:/Cursor Projects Organiser/Z-Sister Aisling Sol  (PRESENT)
    ├── package.json name: z-sister-aisling-sol
    ├── Family AI registry: data/z_family_ai_registry.json (role: Family / ÉirMind lineage companion)
    ├── aliases / related names:
    │   ├── Sister Aisling-Sol / Sister Aisling Sol  → SAME_PROJECT (spelling)
    │   └── ÉirMind                                  → SUBSYSTEM + lineage brand (see below)
    ├── nested evidence:
    │   └── eirmind/ monorepo under Aisling (README: “ÉirMind — Ireland Moving as One”, pnpm workspace)
    ├── dashboard records:
    │   ├── PC-root: YES
    │   ├── indicators: NO row for sister-aisling-sol
    │   ├── control map: eirmind node (dashed reference) — YES for brand, not for folder id
    │   └── doorway: NO
    ├── documentation: EIRMIND_ALIGNMENT_DECISION.md · EIRMIND_REALITY_CHECK.md
    ├── workflow: Aisling package/scripts locally; ÉirMind nested `pnpm -r dev` (not hub runtime)
    └── stewardship state: EMK-HOLD (default) — AMK must sign EMK-REHOME / RESTORE / ARCHIVE
```

```text
Related PC-root stub (missing folder)
└── ÉirMind (Ireland Projects)
    ├── id: eirmind-ireland-projects-missing
    ├── path: EMPTY · former Ireland Projects ABSENT (2026-06-11+)
    ├── relation to Aisling: SAME_PROJECT lineage / PREDECESSOR path candidate
    ├── relation to nested eirmind/: likely SUCCESSOR home under Aisling if EMK-REHOME signed
    └── stewardship state: HOLD — do not delete stub; do not invent restore
```

```text
Hub indicator / canvas brand
└── ÉirMind (indicator id: eirmind)
    ├── signal: PURPLE · NO_GO_FOR_DEPLOY · sibling_reference
    ├── identity_relation to Sister Aisling Sol: SUBSYSTEM / lineage brand (not a second PC folder)
    └── confidence: VERIFIED for “reference-only in hub”; PARTIAL for commercial product identity
```

| Field                 | Value                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| identity_relation     | `SUBSYSTEM` (ÉirMind monorepo inside Aisling) + `SAME_PROJECT` lineage with missing Ireland Projects **pending Steward** |
| canonical_name (disk) | **Sister Aisling Sol** (strongest path + package + Family AI row)                                                        |
| aliases               | ÉirMind (brand / nested monorepo / indicator); Ireland Projects (former path)                                            |
| confidence            | `VERIFIED` for nested folder evidence; `HOLD` for final EMK-\* decision                                                  |
| recommended_action    | `MERGE REVIEW` / Steward **EMK-REHOME** — **do not auto-merge registry rows**                                            |

---

## 3. Z-Sanctuary Replit

```text
Canonical Project
└── Z-Sanctuary Replit
    ├── id: z-sanctuary-replit
    ├── path: C:/Cursor Projects Organiser/Z-Sanctuary_Replit  (PRESENT)
    ├── package.json name: z-sanctuary-replit
    ├── repository: local .git with NO commits yet on main (operational PARTIAL)
    ├── artifacts: Roulette-Data-Analyzer/, ReplitExport-manojkeerpal.tar.gz, README, z_sanctuary_link.json
    ├── .replit / replit.nix: ABSENT on disk (export/mirror, not live Replit workspace config)
    ├── dashboard_url (registry): http://127.0.0.1:5190  (Vite when running — not verified running this audit)
    ├── dashboard records:
    │   ├── PC-root: YES
    │   ├── indicators: NO
    │   ├── control map: NO dedicated node
    │   └── doorway: NO
    ├── linked SEPARATE_PROJECT:
    │   └── replit-roulette-z-amk-goku-mdcp (external Replit URL; no pc_root folder)
    │       identity_relation: SEPARATE_PROJECT (hosting link) · related as local mirror candidate
    ├── status evidence:
    │   ├── disk + package + README: VERIFIED present
    │   ├── live Replit cloud / :5190 process: NOT verified this audit
    │   └── deployment readiness report: OBSERVE_ONLY_NOT_DEPLOYABLE · seed/concept
    └── stewardship state: UNKNOWN refined (see companion report) — not GREEN
```

| Field                                      | Value                                                                                                     |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| identity_relation (vs `replit-roulette-…`) | `SEPARATE_PROJECT` (local mirror vs external hosting link) with documented relatedness                    |
| recommended_action                         | `RECONCILE` status wording only — keep UNKNOWN/EXTERNAL/MIGRATED nuance; never paint GREEN without verify |

---

## 4. Hub Control surfaces (not projects)

| Surface               | Path / id                                         | Role                                                  |
| --------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| AMK-Goku Main Control | `dashboard/Html/amk-goku-main-control.html`       | Read-only hub compass (indicators + map)              |
| Unified dashboard     | `dashboard/Html/index-skk-rkpk.html`              | Hub SKK/RKPK surface                                  |
| Project Doorway       | `data/amk_project_doorway_registry.json` (7 rows) | Open folders only — not full universe                 |
| PC-root roster        | `data/z_pc_root_projects.json` (22 active)        | Canonical **member/external** list for Organiser root |

**Semantic rule:** Main Control **describes hub governance citizens** (indicators). It is **not** a 1:1 rendering of all PC-root projects. Expecting every PC-root id on Main Control without an indicator row will look like “missing.”

---

## 5. Alias resolution index (priority targets)

| Spoken / written name               | Resolves to                                                                     | Relation                      |
| ----------------------------------- | ------------------------------------------------------------------------------- | ----------------------------- |
| AMK-Goku Dashboard 2 / Dashboards 2 | `amk-goku-dashboards-2`                                                         | `UNRESOLVED` citizen          |
| Sister Aisling-Sol                  | `sister-aisling-sol`                                                            | `SAME_PROJECT`                |
| ÉirMind / Eirmind                   | Nested monorepo + indicator `eirmind` + stub `eirmind-ireland-projects-missing` | `SUBSYSTEM` / lineage `HOLD`  |
| Z-Sanctuary Replit                  | `z-sanctuary-replit`                                                            | Canonical local folder        |
| Roulette on Replit / MD/CP Replit   | `replit-roulette-z-amk-goku-mdcp`                                               | `SEPARATE_PROJECT` (external) |

---

## 6. Steward decisions still required

| Code                                                              | Decision                                                                                     |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **D2-RESTORE** / **D2-ARCHIVE** / **D2-ALIAS-HUB**                | Fate of Dashboards 2 empty path                                                              |
| **EMK-REHOME** / **EMK-RESTORE** / **EMK-ARCHIVE** / **EMK-HOLD** | ÉirMind vs Aisling canonical product home (see existing alignment doc)                       |
| **REP-STATUS**                                                    | Whether Replit citizen is ACTIVE local / MIGRATED / EXTERNAL-only / remain UNKNOWN for cloud |

No auto-merge. No destructive row deletion in this audit.
