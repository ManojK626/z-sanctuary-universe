# Z-COMPOSED-AWARENESS-CRYSTAL-DNA-READ-ADAPTER-SPEC-1

**Status:** Specification only · **no adapter runtime** · **no Project World wiring**
**Date:** 2026-08-24
**Baseline HEAD:** `c504935`
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`

P0 TEVV seal: `c504935` · Project World P0: PASS · Internal TEVV: PASS

## Baseline

| Field | Value |
| ----- | ----- |
| START HEAD | `c504935` |
| F5B | Separate · not opened |
| P0 runtime / TEVV | Untouched |
| Crystal DNA sources | Read-only |

## Purpose

Define how Crystal DNA may later enrich Project World with **dependency, integrity, drift, verification, and recovery-awareness** without becoming a mutation engine, health oracle, ownership authority, or auto-repair system.

```text
CRYSTAL DNA = IDENTITY / DEPENDENCY / INTEGRITY AWARENESS
DETECT ≠ REPAIR
PROPOSE RESTORE ≠ RESTORE
RECOVERY CANDIDATE ≠ AUTHORIZED RECOVERY
STATUS ≠ AUTHORITY
DNA ASSET ≠ PROJECT IDENTITY
DEPENDENCY ≠ OWNERSHIP
GREEN ≠ CURRENT
GREEN ≠ DEPLOY AUTHORIZED
```

## P0 / TEVV Authority

Project enumeration remains `data/z_pc_root_projects.json`. Future DNA work must keep `npm run z:awareness:read-model:p0:verify` and `p0:tevv` PASS. **OBS-DUP-001** is a source-contract precondition (unique primary project IDs), not a current real-source defect.

## Crystal DNA Canon

Current law (`docs/Z_CRYSTAL_DNA_MESH.md`, manifest `allowed_actions` / `forbidden_actions`):

**IDENTIFY · MAP · MONITOR · VERIFY · DETECT · COMPARE · REPORT · PROPOSE RESTORE** — human-gated restoration only.

Manifest title: “no auto-repair”. Drift phase: detect/compare/report only; writes limited to drift reports.

**CRYSTAL_DNA_AUTO_REPAIR = NO**

## Historical Language Boundary

| Layer | Language | Authority |
| ----- | -------- | --------- |
| LEGACY / VISUAL | SELF-HEALING · SELF-RECONSTRUCTING · SELF-AWARE | History only (`docs/Z_LEGACY_CORE_ARCHITECTURE_RECONCILIATION_1.md`) |
| CURRENT | Detect, compare, report, propose restore; no automatic repair | Binding |

Do not reintroduce autonomous healing.

## Source Inventory

Resolved by search (not guessed):

- Doctrine: `docs/Z_CRYSTAL_DNA_MESH.md`
- Drift doctrine: `docs/Z_CRYSTAL_DNA_DRIFT_AWARENESS.md`
- Visualization doctrine: `docs/Z_CRYSTAL_DNA_VISUALIZATION.md`
- Manifest: `data/z_crystal_dna_asset_manifest.json` (`z_crystal_dna_asset_manifest_v1`, 8 shards)
- Drift script (WRITE PATH for reports only): `scripts/z_crystal_dna_drift_check.mjs`
- Drift reports: `data/reports/z_crystal_dna_drift_report.{json,md}`
- Map (visualization, not SoT): `dashboard/panels/z-crystal-dna-map.html` + readonly JS/CSS
- Receipts: `docs/PHASE_Z_CRYSTAL_DNA_{1,2,3}_GREEN_RECEIPT.md`
- Adjacent read inputs used by drift (not DNA cards): `data/z_satellite_control_link_manifest.json`, `data/z_doorway_workspace_registry.json`, `dashboard/data/amk_project_indicators.json`

No essential source unresolved.

## Source Resolution Matrix

| Crystal DNA role | Exact source path | Exists | Current maturity | Adapter use |
| ---------------- | ----------------- | ------ | ---------------- | ----------- |
| Mesh doctrine | `docs/Z_CRYSTAL_DNA_MESH.md` | YES | CANONICAL | Semantics / colours / forbid list |
| Asset manifest / DNA cards | `data/z_crystal_dna_asset_manifest.json` | YES | CANONICAL_REGISTRY | Primary read |
| Drift doctrine | `docs/Z_CRYSTAL_DNA_DRIFT_AWARENESS.md` | YES | CANONICAL | Drift field meanings |
| Drift detector | `scripts/z_crystal_dna_drift_check.mjs` | YES | WRITE PATH (reports only) | **Do not invoke** from awareness adapter; consume reports |
| Drift report JSON | `data/reports/z_crystal_dna_drift_report.json` | YES | DERIVED REPORT | Read path |
| Drift report MD | `data/reports/z_crystal_dna_drift_report.md` | YES | DERIVED REPORT | Optional human pointer |
| Visualization | `docs/Z_CRYSTAL_DNA_VISUALIZATION.md` + dashboard panel | YES | LENS | Not source of truth |
| Phase receipts | `docs/PHASE_Z_CRYSTAL_DNA_*_GREEN_RECEIPT.md` | YES | SEALED_RECEIPT | Provenance of phases |
| Control-link / doorway / indicators | paths above | YES | ADJACENT | Drift inputs only; not project enumeration |

## Adapter Role

SOURCE → READ → VALIDATE → IDENTITY MATCH → DEPENDENCY / INTEGRITY MAP → PROVENANCE → optional later Project World enrichment.

Read-only. Configured paths only — **no** runtime filesystem crawl.

## Project Enumeration Boundary

Crystal DNA **must not** mint Project World projects because a shard exists.

`hub_pc_root_projects` is a **shard about** `data/z_pc_root_projects.json`, not a project citizen.

## Identity Join Contract

Attach to a Project World entity only via: exact canonical project ID · explicit alias · sealed identity reconciliation · explicit registry relationship.

Forbidden: similar name, folder resemblance, case-fold without evidence, substring, visual association, semantic guess (`owner_layer` prefix is **not** a join key).

Unmatched DNA → `unmatched_crystal_dna_records` (or equivalent). Never discard. Never guess-attach.

## Duplicate-ID Precondition

Carry **OBS-DUP-001**: `PRIMARY PROJECT IDS MUST BE UNIQUE = TRUE`. If false: **FAIL SAFE** before DNA attach. Do not pick first duplicate. Do not repair the source.

DNA card `id` is described as a **stable shard key**. Manifest does not machine-state uniqueness. Observed: **8 unique** ids. **SPEC GAP:** uniqueness not schema-enforced.

## Sovereignty Boundary

SEPARATE_PROJECT / sovereign / external-linked products stay unowned by the hub if a DNA edge exists. **Roulette / Z-Wheel:** no DNA shard uses `replit-roulette-z-amk-goku-mdcp`. Dependency must not invent hub ownership.

## Crystal DNA Entity Model

Distinguish: **PROJECT** (pc_root) · **COMPONENT** (owner_layer) · **ASSET** (path) · **DNA CARD** (typed identity record) · **SHARD** (unit of continuity) · **DEPENDENCY** (edge of shard ids).

Do not flatten shards into projects.

## Asset / Card / Shard Model

From current doctrine (not redefined):

- **Shard** = named unit of continuity (file, module, registry, report, bridge).
- **DNA card** = typed identity for a shard (`id`, `type`, `path`, `owner_layer`, `dependencies`, `hash_optional`, `rebuild_rule`, `risk`, `status`).
- **Crystal** = whole integrity-intent metaphor, not a runtime object.

Types in use: `doc` · `registry` · `bridge` · `governance_pack` (doctrine also lists `script` / `report` as examples).

## Dependency Model

Source field: `dependencies[]` of **other shard `id` values**. Direction: **this shard depends on listed ids** (A depends on B). Do not collapse to undirected “related” when the array is present.

Cross-project (pc_root): **none observed**. Cross-component: yes (hub shards). **Ownership implied: NO.**

## Cross-Project Dependency

If later records span pc_root projects: represent the edge; do not merge projects or transfer sovereignty.

## Status Model / Namespace

DNA **card** `status` domain = `CRYSTAL_DNA` (recovery colour).

Drift **finding** `signal` domain = `CRYSTAL_DNA_DRIFT` (includes `HOLD`, which is **not** on the DNA card enum).

Do not map onto Z Logic HOLD/BLOCK/STOP, project `deployment_status`, capsule `current_signal`, or business status.

**SAME COLOR / SAME WORD ≠ SAME SEMANTICS.**

## Drift Model

From drift report `findings[]`: `code`, `signal`, `message`, `refs[]`. Overall `overall_signal`. Codes include missing shards, broken dependencies, orphans, stale bridges, HOLD conflicts, NAS_WAIT, topology gaps (see drift doctrine).

**DRIFT ≠ CORRUPTION** automatically. **DRIFT DETECTED ≠ REPAIR AUTHORIZED.**

## Verification Model

Allowed actions include `compare`. `hash_optional` is present on cards; **currently empty** on all eight shards. No universal verification score.

## Hash / Checksum Boundary

If populated later: byte-level compare evidence only. **Matching hash ≠ semantic correctness, security certification, or production readiness.**

## Recovery Posture

Source: `rebuild_rule` (declarative, never executed by DNA-1) · `propose restore` (allowed action) · forbidden `automatic_repair`.

**PROPOSED** read-model labels (not canonized here): `NO_ACTION` · `REVIEW_REQUIRED` · `RESTORE_CANDIDATE` · `RESTORE_PROPOSED` · `HUMAN_APPROVAL_REQUIRED` · `SOURCE_UNAVAILABLE`.

**PROPOSE_RESTORE ≠ RESTORE.** Adapter may expose **HUMAN / STEWARD APPROVAL REQUIRED**; it may not satisfy it.

Recovery locations (path / NAS declaration): **identity only**. No copy, restore, or NAS access.

## Human Approval Boundary

Restore planning is operator-gated. Adapter cannot approve.

## Vault / NAS Boundary

`NAS_WAIT` = declared cold-mirror role **not** mounted/verified (`nas_cold_mirror_declaration` path is a stub, `Z:/…`). **NAS REFERENCE ≠ LIVE NAS ACCESS.** **Z-VAULT ≠ second control plane.** No NAS runtime from this adapter.

## Provenance

Every DNA claim: source path, shard/finding id, source type, `updated_at` / `generated_at` / phase receipt where present, join rule, REAL_SOURCE vs DERIVED.

## Missing / Unknown

No DNA card for a pc_root project → `crystal_dna.posture = MISSING` (or equivalent). **Not GREEN.**

**NO CRYSTAL DNA RECORD ≠ NO PROBLEM.** It means no verified DNA evidence attached.

## Conflicts

Preserve disagreements (e.g. card GREEN vs drift finding; identity clash). `resolution = UNRESOLVED`. No auto-merge. DNA vs Project World identity clash → `IDENTITY_CONFLICT` (or current equivalent).

## Freshness Boundary

Manifest `updated_at`; drift `generated_at`. **GREEN ≠ CURRENT.** No thresholds in this gate. Drift already has a “freshness concern” meaning on **YELLOW** (card) and stale-bridge findings — preserve as source-declared, do not invent CURRENT/AGING/STALE.

## Derived / Source Boundary

DNA values: **REAL_SOURCE**. Enriched Project World record: **DERIVED_REAL**. DNA projection: **DERIVED**. Sources remain authoritative.

Counts (assets, drift items): **DERIVED**. No universal project health score. **CRYSTAL DNA STATUS ≠ PROJECT HEALTH.**

## Non-Mutation / Determinism / Backflow

Do not mutate Project World input, DNA sources, identity docs, manifests, or drift **inputs**. New derived projection only. Identical sources + adapter version → identical output. No randomness, wall-clock semantic facts, AI, network, DB. Hash sources before/after. Mutating derived enrichment must not mutate source objects.

## Read / Write Separation

| Path | Class |
| ---- | ----- |
| Manifest, doctrine, existing drift JSON | READ |
| `z_crystal_dna_drift_check.mjs` | WRITE (reports only) — **out of adapter** |
| Visualization fetch | UI lens — **out of adapter** |
| `propose restore` tooling if added later | WRITE/RECOVERY — **out of adapter** |

Awareness adapter = **READ PATH only**. Offline local files. No HTTP, NAS, cloud.

## Project World Integration Contract

```text
PROJECT WORLD P0 RECORD
        +
CRYSTAL DNA PROJECTION (separate first)
        ↓
later composition (do not rename maturity in this gate)
```

Recommend **separate intermediate report** first (e.g. future `z_composed_awareness_crystal_dna_projection_*.json`), then compose. Do **not** extend P0 JSON in the first executable slice.

No F5A / C360 / MMM / Shadow / Z Logic wiring. No dashboard. No business/comms entities.

## Status Matrix

| Crystal DNA status | Current meaning | Source | Read-model meaning | Authority |
| ------------------ | --------------- | ------ | ------------------ | --------- |
| GREEN | Expected healthy for current phase; compare OK | DNA-1 doctrine / card | `CRYSTAL_DNA` GREEN | NONE |
| YELLOW | Drift or freshness concern; review before treating as authoritative | DNA-1 | `CRYSTAL_DNA` YELLOW — **not** Z Logic HOLD / project HOLD | NONE |
| BLUE | Hold / AMK or overseer decision before structural change | DNA-1 | `CRYSTAL_DNA` BLUE — **not** Z Logic HOLD | NONE |
| RED | Blocked or known-bad; do not treat as source of truth | DNA-1 | `CRYSTAL_DNA` RED — **not** Z Logic BLOCK | NONE |
| QUARANTINE | Isolated from automatic promotion; manual triage only | DNA-1 | Integrity/recovery posture — **≠ delete / isolate repo / shutdown / ownership change** | NONE |
| NAS_WAIT | Cold mirror/NAS-backed role declared but not mounted/verified | DNA-1 + manifest | Declaration-only — **≠ live NAS** | NONE |
| HOLD | Mixed HOLD vs GREEN on related surfaces (doorway etc.) | Drift **signal** only | `CRYSTAL_DNA_DRIFT` HOLD — **≠** DNA card enum, **≠** Z Logic, **≠** project deployment HOLD | NONE |

## Dependency Matrix

| Dependency type | Source-defined? | Directional? | Cross-project possible? | Ownership implied? |
| --------------- | --------------- | ------------ | ----------------------- | ------------------ |
| Shard `dependencies[]` (requires other shard ids) | YES | YES (depends-on) | Not in current 8-shard mesh | NO |

Broken dependency (target id missing) is a **drift finding**, not a new edge type.

## Recovery Matrix

| Recovery concept | Source-defined? | Read-model representation | Action authorized? |
| ---------------- | --------------- | ------------------------- | ------------------ |
| detect / compare / report | YES | source-declared actions | NONE (already happened if reports exist) |
| propose restore | YES | proposal / plan pointer | NONE |
| rebuild_rule | YES | declarative hint | NONE (never execute) |
| automatic_repair | YES (forbidden) | must not appear as authorized | NO |
| NAS mutation / deploy / force push / secret restore | YES (forbidden) | expose as forbidden | NO |
| NO_ACTION / RESTORE_CANDIDATE / … | NO | **PROPOSED** labels only | NONE |

## Project Join Matrix

Current DNA cards vs pc_root `projects[].id`:

| Class | Count | Notes |
| ----- | ----- | ----- |
| EXACT PROJECT MATCH | **0** | No shard `id` equals a pc_root project id |
| EXPLICIT ALIAS MATCH | **0** | No sealed alias DNA→project |
| UNMATCHED | **8** | All cards unmatched as projects |
| AMBIGUOUS | **0** | |
| NON-PROJECT ASSET | **8** | Hub shards (docs, registries, bridges, NAS stub) |

`hub_pc_root_projects` is **not** an exact match to `z-sanctuary-universe`. Do not attach via path resemblance.

## Current Coverage

Evidence-backed:

| Measure | Count |
| ------- | ----- |
| Crystal DNA records (shards) | **8** |
| Directed dependency edges | **6** |
| Projects explicitly linked | **0** |
| pc_root projects without DNA join | **22** |
| Unmatched DNA identities (as projects) | **8** |
| Drift findings (tracked report sample) | **3** (`overall_signal` BLUE) |
| `hash_optional` populated | **0** |

**Coverage ≠ quality.** More/fewer DNA records ≠ healthier/worse projects.

## Visualization Boundary

DNA-2 map is a **read-only lens**. Visualization ≠ source of truth. Future awareness adapter reads files, does not drive the map.

## Drift-Awareness Boundary

Script + reports + optional map GET. Script **writes** only the two report files. Adapter **reads** existing reports; must not run repair or NAS.

## Restore-Action Boundary

No current DNA tool **executes** restore. `propose restore` is vocabulary + `rebuild_rule` hints. Drift script is **not** restore. Adapter must not call drift in a way that is required for awareness (optional operator regen is outside this adapter).

## Negative Test Design

missing DNA ≠ GREEN · RED ≠ Z Logic BLOCK · YELLOW ≠ project HOLD · BLUE/HOLD collision ≠ one semantics · dependency ≠ ownership · drift ≠ corruption · drift ≠ repair · propose restore ≠ restore · quarantine ≠ delete · NAS_WAIT ≠ NAS access · checksum match ≠ semantic truth · legacy self-healing ≠ autonomous repair · Roulette remains unmerged · DNA asset ≠ new project.

## Future TEVV Design

source resolution · identity join · unmatched DNA · missing DNA · duplicate project ID fail-safe · duplicate asset ID if defined · status namespace · drift preservation · dependency direction · cross-project · sovereignty · Roulette · conflict · provenance · non-mutation · backflow · determinism · source hash · auto-repair prohibition · authority ceiling.

Prefer real 8-shard mesh; synthetics for negatives only; mocks labeled.

## Hard Stops

Future implementation **stops** if: project IDs duplicated · project or DNA identity ambiguous · required source missing · fuzzy join needed · source mutation / restore / NAS / network / AI needed · status meaning would be invented · dependency direction would be invented.

## Specification Gaps

- DNA asset-id uniqueness not schema-enforced.
- No project-level DNA catalog (mesh is hub-shard scoped).
- Drift `HOLD` vs card `BLUE` vs project `deployment_status` HOLD — three namespaces; no unified severity model.
- Empty `hash_optional` — compare pipeline incomplete.
- Restore-state vocabulary beyond propose/rebuild_rule is **PROPOSED**.
- Whether hub `owner_layer` may ever become an **explicit** join (Steward decision) — **not** authorized as a guess.

## First Implementable Slice

**Separate Crystal DNA projection** (not P0 JSON mutation):

configured manifest + drift report → shard records + directed deps + namespaced status + drift findings + provenance + unmatched-as-project + MISSING for all 22 pc_root projects · duplicate project-id precondition · no restore · no fuzzy join.

Then adapter verify + internal TEVV **before** Project World composition.

## Recommended Composition Sequence

DNA sources → DNA read projection → adapter verify → TEVV → (later) Project World composition → composition verify → composition TEVV. **Not** dashboard.

## Maturity

**CRYSTAL_DNA_READ_ADAPTER_SPEC_READY**

Not implemented. Not wired. Recommend next maturity label only after the intermediate projection exists: informal **DNA projection P0** (do not rename Project World P0).

## ONE Recommended Next Gate

**Z-SANCTUARY-COMPOSED-AWARENESS-CRYSTAL-DNA-READ-ADAPTER-P0-IMPLEMENTATION-1**

Joins and status **meanings** are resolved enough for a **shard-level** read projection. Project-level attach remains correctly **empty** until explicit identity evidence exists — that is not a blocker for the intermediate report.
