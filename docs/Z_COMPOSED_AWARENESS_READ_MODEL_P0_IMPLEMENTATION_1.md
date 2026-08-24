# Z-COMPOSED-AWARENESS-READ-MODEL-P0-IMPLEMENTATION-1

**Status:** P0 Project World deterministic projection · **not** dashboard · **not** production
**Date:** 2026-08-24
**Baseline HEAD:** `7cee400`
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`

## Baseline

| Field | Value |
| ----- | ----- |
| START HEAD | `7cee400` |
| Specification | `docs/Z_COMPOSED_AWARENESS_READ_MODEL_SPEC_1.md` (seal `7cee400`) |
| Charter | `docs/Z_COMPOSED_MULTI_PROJECT_AWARENESS_VIEW_CHARTER_1.md` |
| F5B | Not opened |
| F5A / F4 | Unchanged |

## Specification Authority

P0 implements the spec’s **first implementable slice**: Project World only (identity + sovereignty + capsule when present + ecosystem awareness row when present + provenance + missing/conflict).

## P0 Scope

In: PC-root project enumeration, sealed identity facts, hub-folder explicit join, capsules listed on **joined** awareness rows.

Out: Business, comms, services, Crystal DNA, AI Ecosphere, capacity, C360/MMM/Shadow/Z Logic, dashboard, APIs, databases.

## Sources Resolved

| Source role | Exact path | Exists | Shape understood | P0 use |
| ----------- | ---------- | ------ | ---------------- | ------ |
| Project identity | `data/z_pc_root_projects.json` | YES | `projects[].id/name/path/role/hosting` | Primary enumeration |
| Identity reconciliation | `docs/PROJECT_IDENTITY_RECONCILIATION.md` | YES | `SEPARATE_PROJECT` / `SAME_PROJECT` / `SUBSYSTEM` / `UNRESOLVED` | Sealed facts, no auto-merge |
| Ecosystem awareness | `data/z_ecosystem_awareness_registry.json` | YES | `projects[].project_id`, hub fields | Explicit joins only |
| Hub capsule | `data/z_sanctuary_universe_awareness_capsule.json` | YES | `z_project_awareness_capsule_v1` | Attached via hub-folder join |
| Sibling capsule (unmatched) | `z-questra/data/z_project_awareness_capsule.json` | YES | same schema | **Not** attached (no explicit pc_root id match) |

No required source unresolved.

## Source Hashes

Recorded in `data/reports/z_composed_awareness_project_world_p0.json` `sources[]` (SHA-256 of bytes at generation). Verifier requires before = after.

## Runtime / Dependencies

- Language: Node.js ESM (`.mjs`)
- New dependencies: **0**
- Network / database / AI: **none**

## Files Added

- `scripts/z_composed_awareness_read_model/*.mjs`
- `scripts/z_composed_awareness_read_model_p0.mjs`
- `scripts/z_composed_awareness_read_model_p0_verify.mjs`
- `data/reports/z_composed_awareness_project_world_p0.json`
- this document

## Files Modified

- `package.json` — two scripts only; lockfile unchanged

## Project Identity Adapter

Enumerates `projects[]` only. Preserves source ids (`z-sanctuary-universe` is **not** rewritten to `ZSanctuary_Universe`). Namespaced ids: `pc_root::<id>`.

## Sovereignty Overlay

| Source `role` | Composed overlay |
| ------------- | ---------------- |
| `hub` | INTERNAL |
| `member` | MEMBER |
| `external` (roulette id) | SEPARATE |
| other `external` | EXTERNAL_LINKED |
| `continuation_active` / `hub_backup_slice` | UNKNOWN (no sealed overlay) |

Source `role` always retained. Overlay includes mapping rule + source reference.

## Capsule Adapter

Loads capsule only when a **joined** awareness row has a non-empty `capsule_path`. No synthetic capsules. `growth_percent` / `current_signal` remain `SOURCE_DECLARED`.

## Ecosystem Awareness Adapter

Joins allowed:

1. exact `pc_root.id === awareness.project_id`
2. explicit hub-folder relation: `role=hub` AND `path === canonical_hub_folder` AND awareness `project_type=hub` AND `project_id === canonical_hub_name`

No case-fold, substring, or display-name matching. Unmatched awareness rows retained (`NO_EXPLICIT_IDENTITY_MATCH`).

P0 result: **1** explicit join (hub), **9** unmatched awareness rows, **0** ambiguous.

## Project World Projection

22 records, sorted by `project_id` UTF-16 lexical order. Record origin `DERIVED_REAL`. Projection posture `DERIVED_READ_MODEL`.

## Provenance

Each project lists contributing relative paths and source ids. Hub capsule hash attached when present.

## Missing / Unknown Handling

Absent capsule / awareness row: `posture: MISSING` and `present: "MISSING"` (string, not boolean false). Not coerced to `0`, `false`, or `GREEN`.

## Conflict Handling

Hub identifiers disagree (`z-sanctuary-universe` vs `ZSanctuary_Universe`). One conflict, `resolution: UNRESOLVED`. No winner.

## Identity Ambiguity Handling

Multiple hits → `P0_IDENTITY_AMBIGUITY_REQUIRES_STEWARD_RECONCILIATION` (hard stop). Not observed.

## Roulette / Sovereign Product Regression

`replit-roulette-z-amk-goku-mdcp`: source `external`, composed `SEPARATE`, sealed `SEPARATE_PROJECT`. `ROULETTE_MERGED_INTO_HUB = false`.

## Determinism

3× in-memory `deepStrictEqual`. No wall-clock field in semantic payload. Keys stably sorted on write.

## Source Non-Mutation

Deep-frozen clones compared after projection. SHA-256 of consumed sources unchanged.

## Machine Output

`data/reports/z_composed_awareness_project_world_p0.json` — derived report only, not a system of record.

## Derived Summary

Counts labeled `origin: DERIVED`. No overall health score.

## Unmatched Source Records

Nine ecosystem-awareness rows without explicit pc_root id match (including `z-questra`, `at_princess_blackie`, `eirmind`, hub modules, placeholders).

## F5A Regression

`npm run z:foundation:verify` — 26/26 PASS  
`npm run z:foundation:tevv` — PASS  
`npm run z:formula:semantic-goldens` — 11/11 PASS

## Security / Authority Boundary

Read-only sources. Generator writes only the authorized report. No command bus, no write-back, authority **NONE**.

## Limitations

- Capsules not listed on a joined awareness row are not loaded onto pc_root projects.
- ID schemes remain unmerged (by design).
- Capacity / Crystal DNA / AI Ecosphere not in P0.
- Overlay for non hub/member/external roles is UNKNOWN.

## Maturity Verdict

**COMPOSED AWARENESS READ MODEL — P0 PROJECT-WORLD DETERMINISTIC PROJECTION**

Not: full composed runtime, dashboard, business/AI/system/governance worlds, or production readiness.

`COMPOSED_AWARENESS_PROJECT_WORLD_P0 = PASS`

## ONE Recommended Next Gate

**Z-SANCTUARY-COMPOSED-AWARENESS-P0-TEVV-AUDIT-1**
