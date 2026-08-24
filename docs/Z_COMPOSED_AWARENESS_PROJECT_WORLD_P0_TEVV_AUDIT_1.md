# Z-COMPOSED-AWARENESS-PROJECT-WORLD-P0-TEVV-AUDIT-1

**Status:** Internal TEVV · **not** independent certification · **not** production
**Date:** 2026-08-24
**Baseline HEAD:** `dc916d0`
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`

## Baseline

| Field | Value |
| ----- | ----- |
| START HEAD | `dc916d0` |
| P0 claim under test | `COMPOSED_AWARENESS_PROJECT_WORLD_P0 = PASS` |
| Generator / verifier | **not modified** |
| Tracked report | **not rewritten** |
| F5B | Not opened |

## Audit Purpose

Try to **falsify** the Project World P0 claim: identity, sovereignty, missing data, conflicts, provenance, mutation, determinism, rebuildability.

## Internal TEVV Boundary

This is **internal TEVV** only. It is not external validation, security certification, formal verification, or production certification.

## P0 Standing

| Metric | Source-derived / verified |
| ------ | ------------------------- |
| Projects | 22 (`data/z_pc_root_projects.json` `projects[]`) |
| Capsules present / missing | 1 / 21 |
| Awareness present / missing | 1 / 21 |
| Unmatched awareness rows | 9 |
| Conflicts | 1 UNRESOLVED |
| Explicit joins | 1 |

## Runtime Under Test

`scripts/z_composed_awareness_read_model/**` · `scripts/z_composed_awareness_read_model_p0.mjs` · `scripts/z_composed_awareness_read_model_p0_verify.mjs` (read-only)

Harness: `scripts/z_composed_awareness_read_model_p0_tevv.mjs` — **not** a verifier wrapper.

## Real Sources Under Test

`data/z_pc_root_projects.json` · `docs/PROJECT_IDENTITY_RECONCILIATION.md` · `data/z_ecosystem_awareness_registry.json` · `data/z_sanctuary_universe_awareness_capsule.json` · unmatched sibling `z-questra/data/z_project_awareness_capsule.json`

## Source Integrity Snapshot

SHA-256 of consumed sources hashed before and after all probes. **Equal.**

## Runtime Integrity Snapshot

P0 runtime files and P0 verifier hashed before and after. **Equal.** Tracked report hashed. **Equal** (TEVV writes **0** temp files).

## Baseline Regression

`npm run z:awareness:read-model:p0:verify` PASS (generator not re-run, to keep tracked report bytes unchanged). In-memory projection matches tracked report.

## Oracle-Coupling Review

**ORACLE_COUPLING_RISK: MEDIUM**

Evidence:

- The **normal verifier** imports `runProjection`, `projectWorldP0`, `ROULETTE_PC_ROOT_ID`, and `negativeIdentityAudit` from the same modules that implement behavior. Shared `constants.mjs` is both config and oracle for that verifier.
- This TEVV harness **does not import** `z_composed_awareness_read_model_p0_verify.mjs`. Source paths are independently listed as `AUDIT_SOURCES`. Project count is taken from `pc_root.projects.length`, not hard-coded 22.
- Residual coupling: TEVV must import SUT adapters (`projectWorldP0`, `joinAwarenessRows`, `loadJsonSource`) to attack them. That is subject-under-test import, not a copied expected-result registry.

No repair in this gate.

## Probe Inventory

34 probes · 33 PASS · 0 FAIL · 1 EXPECTED_BOUNDARY

Categories A–Q covered (source resolution through negative controls).

## Source Resolution Probes

Required JSON sources exist and parse. Synthetic missing path → `SOURCE_MISSING`. Markdown fed to JSON loader → `SOURCE_INVALID`. No source files renamed.

## Project Enumeration Probes

Enumeration is `data/z_pc_root_projects.json`. Count is source-derived (**22**).

## Identity Collision Probes

Duplicate pc_root ids (synthetic): P0 emits two derived rows and does **not** hard-stop. Classified **EXPECTED_BOUNDARY** / observation (unique ids assumed; not present in real source).

## Case / Alias Probes

`z-sanctuary-universe` vs `ZSanctuary_Universe` without hub-folder fields → **no exact join**. Display-name collision → no merge. `z-questra` / `zquestra` / `z_questra` → no fuzzy join.

## Unresolved Identity Probes

`amk-goku-dashboards-2` remains `UNRESOLVED`, join_rule `NONE`, not `SAME_PROJECT`.

## Sovereignty Probes

Synthetic hub/member/external/continuation_active overlay: INTERNAL / MEMBER / EXTERNAL_LINKED / UNKNOWN. `external ≠ INTERNAL`. `UNKNOWN ≠ EXTERNAL` and `≠ INTERNAL` and `≠ false`.

## Roulette / Z-Wheel Probes

`replit-roulette-z-amk-goku-mdcp`: source `external`, composed `SEPARATE`, relation `SEPARATE_PROJECT`. Not merged into hub.

## Capsule Sparsity Probes

Missing capsules stay `present: "MISSING"`. No default `growth_percent` / GREEN fill.

## Ecosystem Awareness Sparsity Probes

1 attached, 21 missing, matches summary.

## Unmatched Source Probes

Nine unmatched rows retained (`NO_EXPLICIT_IDENTITY_MATCH`). `z-questra`, `at_princess_blackie`, `eirmind` not attached.

## Missing / Unknown Probes

MISSING ≠ 0 / false / GREEN. UNKNOWN ≠ false / EXTERNAL / INTERNAL.

## Conflict Probes

Hub identifier conflict remains; `resolution: UNRESOLVED`; both source ids intact.

## Deployment-Status Collision Probe

Hub `deployment_status` HOLD kept as `source_domain: PROJECT_DEPLOYMENT` with note that it is not Z Logic HOLD.

## Derived / Source Separation

Project records `origin: DERIVED_REAL`. Summary `origin: DERIVED`. Not reclassified as `REAL_SOURCE`.

## Mock / Real Separation

No MOCK / DEMO / fake investor / manufacturer / BusinessEntity records.

## Provenance Probes

Every project lists pc_root. Awareness/capsule provenance listed only when present.

## Relative Path Probe

No `C:/Cursor Projects Organiser` leak in projection or tracked report.

## Deep-Freeze Probes

Frozen clones equal snapshots after projection.

## Shared-Alias Probes

Shared nested `notes` object unchanged after projection.

## Output-Mutation Backflow Probe

Mutating derived `display_name` did not change source `name` (real-domain strings).

## Determinism Probes

**10×** `deepStrictEqual` on identical frozen sources. Reversed `projects[]` insertion still sorts by `project_id`.

## Execution-Order Probes

Adapter calls in different orders then `projectWorldP0` — semantic result unchanged.

## Hidden-State Probes

A → B → A fixtures: A1 = A2.

## Tracked-Report Rebuildability

In-memory projection **deep-equals** tracked `data/reports/z_composed_awareness_project_world_p0.json`. Rebuild path is source registries → projection, not old report → new report. TEVV did not write the report.

## Prohibited Runtime Review

P0 runtime files: no executable `fetch(` / `http.request` / `WebSocket` / `Math.random` / `eval(` / `child_process` / `setInterval`. No `Date.now()` / `new Date(` / `performance.now()` in P0 runtime. No Crystal DNA, AI Ecosphere, dashboard HTML, or `z_deterministic_foundation` imports.

## Authority Review

No `authorized: true` or `AUTO_REPAIR` in projection. Authority **NONE**.

## Scope-Tripwire Review

Crystal DNA / AI Ecosphere / C360–Z Logic / business-comms records / dashboard: **not wired**.

## Audit Harness Negative Controls

Mutants 1–10 detected (Roulette INTERNAL, filled missing capsule, false z-questra join, conflict RESOLVED, origin REAL_SOURCE, source mutation, absolute path leak, missing source, duplicate ids, report drift).

**AUDIT_HARNESS_NEGATIVE_CONTROL = PASS**

## Findings

| ID | Severity | Area | Finding | Reproducer | Canonical impact |
| -- | -------- | ---- | ------- | ---------- | ---------------- |
| OBS-DUP-001 | OBSERVATION | duplicate-id | Duplicate pc_root ids become two derived records; no hard_stop | In-memory two rows `id: dup-id` | Real registry has unique ids. Unique-id is assumed, not enforced. |

## Severity Table

CRITICAL 0 · HIGH 0 · MEDIUM 0 · LOW 0 · OBSERVATION 1

## TEVV Verdict

**COMPOSED_AWARENESS_PROJECT_WORLD_P0_TEVV = PASS**

## Maturity Posture

COMPOSED AWARENESS · PROJECT WORLD P0 · DETERMINISTIC PROJECTION · **INTERNAL TEVV PASS**

Not: full Project World, full composed runtime, Business/System/Governance worlds, dashboard, production, or independent validation.

**TEVV PASS ≠ executive dashboard authorization.**

## Remaining Limitations

Sparse exact identity links (22 projects, 1 capsule, 1 awareness join). Duplicate-id input outside domain. Oracle coupling of the **normal verifier** remains MEDIUM (not repaired).

## ONE Recommended Next Gate

**Z-SANCTUARY-COMPOSED-AWARENESS-CRYSTAL-DNA-READ-ADAPTER-SPEC-1**

Read-only Crystal DNA adapter specification — dependency/health awareness without AI, business runtime, or dashboard.
