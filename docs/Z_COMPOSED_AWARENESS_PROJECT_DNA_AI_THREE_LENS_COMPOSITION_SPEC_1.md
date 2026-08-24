# Z-COMPOSED-AWARENESS-PROJECT-DNA-AI-THREE-LENS-COMPOSITION-SPEC-1

**Status:** Specification only · **no three-lens runtime** · **no child modification** · **no dashboard** · **no GARE executor**
**Date:** 2026-08-24
**START HEAD:** `b59d4f8`
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`

## Baseline

| Field | Value |
| ----- | ----- |
| Mode | OBSERVE · RECONCILE · SPECIFY · DEFINE THREE-LENS CONTRACT · REPORT · SEAL |
| Implementation | NONE |
| Project World / Crystal DNA / AI Ecosphere | UNCHANGED |
| Existing two-lens composition | UNCHANGED |
| Ledger refresh / DNA drift producer | NOT RUN |
| F5A / F4 / package.json | UNCHANGED |

Unrelated porcelain preserved. Do not `git clean`, reset, amend prior seals, push, or deploy.

## Purpose

Specify the first three-lens Z Composed Awareness architecture:

```text
PROJECT WORLD + CRYSTAL DNA + AI ECOSPHERE
```

Composition is **truthful co-observation**. It is not identity merging, inferred relationships, AI activation, ownership transfer, conflict auto-resolution, GARE authorization, dashboard authority, or production authority.

## Hardened Standing

| Layer | Standing |
| ----- | -------- |
| Project World P0 + internal TEVV | PASS |
| Crystal DNA P0 + source custody + internal TEVV | PASS · CLEAN |
| Project World + Crystal DNA composition P0 + TEVV | PASS |
| AI Ecosphere P0 + source custody + internal TEVV | PASS · CLEAN |

No child runtime is modified by this gate.

Sealed lineage (newest last): Project World P0/TEVV → Crystal DNA P0/custody/TEVV → two-lens spec/P0/TEVV → AI Ecosphere spec/P0/TEVV (`b59d4f8`). This spec does not rewrite that history.

## Three-Lens Doctrine

```text
COMPOSITION ≠ MERGER
LENS ≠ MASTER
PROJECT IDENTITY ≠ DNA SHARD IDENTITY ≠ AI IDENTITY
COVERAGE ≠ RELATIONSHIP
REGISTRATION ≠ ACTIVITY
ADVISORY STATE ≠ RUNTIME STATE
DEPENDENCY ≠ OWNERSHIP
ASSOCIATION ≠ OWNERSHIP
CONFLICT ≠ AUTHORITY
AWARENESS ≠ ACTION
AWARENESS ≠ CONSCIOUSNESS
NAVIGATION LINK ≠ ENTITY RELATIONSHIP
MORE LENSES ≠ MORE IDENTITY AUTHORITY
ZERO VERIFIED RELATIONSHIPS ≠ FAILED COMPOSITION
AI INTERNAL CONFLICTS ≠ CROSS-LENS CONFLICTS
CONFLICT CHANNEL EXISTS ≠ CURRENT CROSS-LENS CONFLICT EXISTS
```

## Sibling-Lens Architecture

```text
Z COMPOSED AWARENESS
│
├── PROJECT WORLD
│     22 project identities · sovereignty · project evidence · capsules / awareness · project provenance
│
├── CRYSTAL DNA
│     8 shards · 6 directed dependencies · card status · 3 drift findings · drift BLUE · DNA provenance
│
├── AI ECOSPHERE
│     4 rings · 4 Tower agents · 4 MiniBots · 5 ledger entries · runtime evidence
│     2 unresolved internal conflicts · 5 unmatched records · AI provenance
│     (global sibling; not attached to the 22 projects)
│
└── EXPLICIT CROSS-LENS RELATIONSHIPS
      PROJECT_DNA_LINK currently 0
      AI_PROJECT_ASSOCIATION currently 0
      AI_DNA_RELATION currently 0 / UNDEFINED
      cross_lens_conflicts currently 0 (channel defined; evidence empty)
```

Counts are **source-derived at implementation time**, not permanent architecture constants.

### No master lens

Forbidden:

- AI Ecosphere owns Project World
- Crystal DNA owns Project World
- Project World rewrites AI identity
- AI Ecosphere rewrites DNA identity
- Crystal DNA determines AI runtime

Each lens contributes bounded evidence.

### Design choice (pure function)

Two conceptual shapes were compared:

| Shape | Pros | Cons |
| ----- | ---- | ---- |
| `composeProjectDnaAi(projectWorld, crystalDna, aiEcosphere)` | Child provenance available; three-lens acquisition can version-gate all children; two-lens semantics reused internally; AI remains sibling | Must not treat two-lens report as SoR |
| `composeProjectDnaAi(projectDnaComposition, aiEcosphere)` | Smaller arity | Risk of losing child provenance unless composition already embeds children; two-lens report could become accidental SoR |

**Chosen:** `composeProjectDnaAi(projectWorld, crystalDna, aiEcosphere)`.

Internally reuse sealed `composeProjectWorldAndDna(...)` after **external** version/identity/provenance validation. Do not modify that two-lens function in this gate. Future three-lens **acquisition** may validate versions before invoking the sealed pure compose seam (OBS-COMP-001).

Do not implement now.

## Current Relationship Reality

| Relationship | Current verified evidence |
| ------------ | ------------------------- |
| PROJECT ↔ DNA links | **0** |
| AI ↔ PROJECT associations | **0** |
| AI ↔ DNA relations | **0 / UNDEFINED** (no explicit AI P0 field; do not infer from shared files) |

Valid composition may contain all three zeros. Graph density is not a success metric.

Shared source file ≠ identity relation ≠ ownership relation unless the relationship itself is source-declared.

## Project World Boundary

`data/z_pc_root_projects.json` remains project enumeration authority through the verified Project World projection.

Three-lens composition **must not** create projects from DNA shards, AI personas, MiniBots, Tower agents, ring names, ledger entries, or unmatched AI records.

Project World remains independently drillable. Do not inject AI or DNA state as project facts without an explicit relationship.

## Crystal DNA Boundary

Crystal DNA remains: asset identity · directed dependencies · drift awareness · integrity / recovery hints.

It does **not** enumerate AI identities, establish AI runtime, or enumerate projects.

Preserve the two-lens hub-registry wall: `hub_pc_root_projects` ≠ hub project relationship ≠ 22 project DNA relationships.

Global DNA lens remains: no project-specific DNA state where no verified link exists.

DNA shard dependencies must not automatically become AI dependencies, routing, or authority. AI configuration does not affect Crystal DNA card status.

## AI Ecosphere Boundary

AI Ecosphere remains: typed AI-related identities · registration · configuration · declared runtime evidence · advisory ledger · conflicts · unmatched evidence.

It does **not** enumerate projects or grant runtime authority.

Because verified AI–project associations are currently zero and AI P0 has **no association ingestion path** (OBS-AI-002), the AI lens stays a **global sibling**. Do **not** fabricate 22 AI coverage rows or a synthetic per-project AI status.

Preferred P0 posture:

```text
AI PROJECT ASSOCIATION LENS: GLOBAL / UNASSOCIATED
```

Absence of association, if surfaced at all:

```text
NO VERIFIED AI-PROJECT ASSOCIATION
```

Not: NO AI · AI-FREE · UNSUPPORTED · UNHEALTHY · INACTIVE.

AI advisory ledger remains in the **AI_ECOSPHERE** namespace. Do not attach all ledger entries to all projects.

## AI Typed Families

Preserve:

- `ECOSPHERE_RING`
- `TOWER_AGENT`
- `MINIBOT`

or exact source-established types.

Do **not** flatten into `AI[]` if that destroys type meaning.

Do **not** invent `total_ai_count`. Typed counts may remain visible separately.

## Project-DNA Boundary

Preserve existing two-lens result (source-derived):

| Metric | Current |
| ------ | ------- |
| PROJECT-DNA COVERAGE ROWS | 22 |
| VERIFIED PROJECT↔DNA LINKS | 0 |
| PROJECTS WITH VERIFIED DNA | 0 |
| PROJECTS MISSING VERIFIED DNA | 22 |

Coverage remains coverage. Not connection.

## AI-Project Boundary

Current verified associations: **0**.

Do not manufacture associations from similar names, persona names, MiniBot roles, project wording, folder/path, display name, case normalization, ring names, ledger rows, or Tower agent names.

OBS-AI-002: composition does **not** open association ingestion. A future positive association capability requires a dedicated identity-expansion gate.

Even a future explicit association means **ASSOCIATED**, not OWNS / MEMBER / INTERNAL / CONTROLLED_BY_AI.

Do **not** write a real AI–project link into current evidence merely to demonstrate future functionality. Synthetic verification only.

## AI-DNA Boundary

Search of AI Ecosphere P0 projection: `project_associations: []`; no DNA shard IDs, no Crystal DNA fields, no explicit AI↔DNA relationship family.

**AI↔DNA VERIFIED RELATIONSHIPS: 0 / UNDEFINED.**

`AI_DNA_RELATION` remains **DEFERRED**. Do not invent from shared file references.

## Zero-Relationship Reality

```text
0 VERIFIED PROJECT↔DNA LINKS ≠ COMPOSITION FAILURE
0 VERIFIED AI↔PROJECT ASSOCIATIONS ≠ COMPOSITION FAILURE
0 VERIFIED AI↔DNA RELATIONS ≠ COMPOSITION FAILURE
```

The organism must recognize what it knows, what it does not know, what disagrees, and what must remain unconnected.

## AI Verified-Active Boundary

AI Ecosphere TEVV: **VERIFIED ACTIVE RUNTIMES: 0**.

OBS-AI-001: no positive `verified_active = 1` path (including `online: true` alone).

Three-lens composition **must carry 0 unchanged**. It must **not** create an active-runtime path from project presence, DNA status, DNA GREEN, AI registration, AI GREEN ledger, `sync_score`, `online` alone, `lastPulse`, planned, or recent timestamps.

A future live-runtime evidence contract requires a separate gate.

## AI Unmatched Boundary

Current: **5 unmatched** AI records.

They remain under the AI lens (`ai_ecosphere_lens.unmatched` or equivalent). Do not attach them to projects or DNA.

OBS-AI-003: no MATCHED reconciliation bridge. Adding Project World and Crystal DNA names must **not** turn unmatched rows into matched identities.

```text
UNMATCHED ≠ CONFLICT
UNMATCHED ≠ MISSING
MORE LENSES ≠ MORE IDENTITY AUTHORITY
```

## AI Internal Conflicts

Current: **2 UNRESOLVED** ledger same-field score mismatches **inside** the AI Ecosphere lens.

```text
AI INTERNAL CONFLICTS = 2
≠
CROSS-LENS CONFLICTS = 2
```

Those two conflicts **must not** become Project World or Crystal DNA conflicts merely because three lenses share one envelope.

They belong under `lens_conflicts.ai_ecosphere`, **not** `cross_lens_conflicts`, unless future evidence shows they genuinely concern a cross-lens semantic field on a **resolved** shared entity.

Preserve AI-source provenance. Do not replace with `source = three_lens_composition`.

## Lens Conflicts vs Cross-Lens Conflicts

Conceptual channels:

```text
lens_conflicts:
  project_world[]
  crystal_dna[]
  ai_ecosphere[]     ← current: 2 UNRESOLVED (AI-local)

cross_lens_conflicts[]   ← current: 0; CHANNEL REQUIRED
```

OBS-COMP-002: two-lens `compose()` has no generalized same-field conflict channel. **This spec defines the three-lens channel.** Do **not** modify current two-lens runtime.

```text
CONFLICT CHANNEL EXISTS ≠ CURRENT CROSS-LENS CONFLICT EXISTS
```

Empty `cross_lens_conflicts = []` is acceptable and desirable **now**, provided the implementation supports the channel structurally and does not hard-code “conflicts can never happen.”

Future synthetic verification: explicitly reconciled entities with incompatible same-field claims → **1** retained conflict with provenance; remove evidence → **0**; no hidden memory.

## Cross-Lens Conflict Semantics

A cross-lens conflict exists **only** when:

1. two or more lenses
2. make incompatible claims
3. about the **same defined semantic field**
4. for the **same resolved entity / relationship**

No same-entity identity bridge → no comparison. No semantic-field equivalence → no comparison.

Unmatched AI record saying X vs Project World project saying Y is **not** a conflict unless the AI record is explicitly reconciled to that entity.

Conceptual shape (not executable schema):

```text
CrossLensConflict {
  conflict_id
  semantic_field
  entity_refs[]
  claims[]
  lens_refs[]
  provenance[]
  posture: UNRESOLVED
}
```

No winner, score, or precedence in this P0.

Forbidden auto-resolution: newest wins · AI wins · Project World wins · DNA wins · GREEN wins · higher score wins · runtime-looking source wins — unless a future canon defines field-specific precedence (not this P0).

`DIFFERENT DIMENSIONS ≠ CONFLICT`. Example: project GREEN + DNA drift BLUE + AI ledger GREEN + AI runtime UNVERIFIED do **not** conflict merely because values differ.

Same label in different namespaces (GREEN / ACTIVE / PLANNED) must not be compared by string equality.

## Status Namespace Matrix

| Namespace | Owner | Auto-map to other lenses |
| --------- | ----- | ------------------------ |
| Project identity / sovereignty | Project World | NO |
| Project deployment | Project World | NO |
| Project awareness | Project World | NO |
| CRYSTAL_DNA_CARD | Crystal DNA | NO |
| CRYSTAL_DNA_DRIFT | Crystal DNA | NO |
| AI registration | AI Ecosphere | NO |
| AI configuration | AI Ecosphere | NO |
| AI runtime-evidence | AI Ecosphere | NO |
| AI advisory ledger | AI Ecosphere | NO |
| AI conflict posture | AI Ecosphere | NO (internal vs cross-lens channels) |
| GARE policy | GARE charter | NO eligibility inference |
| Z Logic HOLD/BLOCK/STOP | F5A / Z Logic | NO in this composition |

```text
AI LEDGER GREEN ≠ PROJECT HEALTH GREEN
AI LEDGER GREEN ≠ DNA GREEN
AI LEDGER GREEN ≠ ACTIVE AI
CRYSTAL DNA GREEN ≠ AI RUNTIME ACTIVE
```

No universal health summary, ecosystem percentage, combined readiness, self-awareness score, or truth score. No new mathematics. No universal authority summary (`system ready` / `autonomous ready` / `repair ready` / `production ready`).

## Missing / Unknown / Unverified / Unmatched / Conflicting

Preserve as **distinct**:

| State | Not |
| ----- | --- |
| MISSING | UNKNOWN, UNHEALTHY, INACTIVE |
| UNKNOWN | UNVERIFIED |
| UNVERIFIED | INACTIVE, OFFLINE |
| UNMATCHED | CONFLICT, MISSING |
| CONFLICTING | auto-resolved winner |

No false coercion of empty/null runtime evidence to boolean false unless the source itself provides false.

## Version Gate

Carry **OBS-COMP-001**.

Future three-lens **acquisition** must validate, **before** composition:

- Project World `projection_id` / `schema_version` / `projection_version`
- Crystal DNA same
- AI Ecosphere same

```text
VALID CHILD SEMANTICS ≠ SUPPORTED CHILD VERSION
```

Unknown version: **HARD STOP**.

Do not repair current `composeProjectWorldAndDna(...)` in this gate.

## Projection Input Contract

Preferred:

```text
PROJECT WORLD PURE BUILDER  →  VALIDATED PROJECT PROJECTION
CRYSTAL DNA PURE BUILDER    →  VALIDATED DNA PROJECTION
AI ECOSPHERE PURE BUILDER   →  VALIDATED AI PROJECTION
        │
        ▼
validate versions · identities · provenance
        │
        ▼
reuse existing PW+DNA composition semantics (sealed)
        │
        ▼
attach AI Ecosphere as sibling (global)
        │
        ▼
derive explicit cross-lens relationships / conflicts only
        │
        ▼
THREE-LENS COMPOSED AWARENESS
```

**PURE BUILDERS** preferred over tracked reports as runtime sources.

Tracked reports remain integrity / regression fixtures / evidence, **not** system of record:

- `data/reports/z_composed_awareness_project_world_crystal_dna_p0.json`
- `data/reports/z_composed_awareness_ai_ecosphere_p0.json`

Prohibit: old three-lens report → new three-lens report as source authority.

Future implementation must **not** modify sealed child runtimes or two-lens composition merely for integration convenience. Prefer adapters/wrappers.

## Existing Two-Lens Reuse

Reuse two-lens **semantics** (zero current PW↔DNA links, coverage rows, sovereignty copy, Roulette SEPARATE, namespaces). Do not overwrite the two-lens report. Do not require it as the sole source for three-lens runtime.

## Pure Builder Strategy

See input contract. Generator (future) may write a **new** three-lens report only.

## Sovereignty

Copy Project World sovereignty unchanged.

Neither DNA relationship, AI registration, AI activity, AI association, AI score, nor AI ledger band may modify sovereignty.

AI association ≠ ownership (see AI-Project Boundary).

## Roulette / Z-Wheel

| Fact | Value |
| ---- | ----- |
| Project posture | SEPARATE / external (Project World) |
| PROJECT↔DNA | 0 verified |
| AI↔PROJECT | 0 verified |
| Ownership | UNCHANGED |

No invented Roulette DNA link or Roulette AI association.

## Provenance

Four distinct layers:

1. PROJECT provenance
2. DNA provenance
3. AI provenance
4. CROSS-LENS relationship / conflict provenance

No collapse.

Every future verified cross-lens relationship must evidence: entity A, entity B, relationship, source(s), identity basis. No provenance → **NO VERIFIED RELATIONSHIP**.

AI’s two internal conflicts retain AI-source provenance.

## Derived / Source Boundary

| Layer | Origin |
| ----- | ------ |
| Config / status source values | REAL_SOURCE |
| Ledger (AI) | DERIVED_REAL |
| Project World / DNA / AI entity records | DERIVED_REAL |
| Three-lens envelope / summary | DERIVED_COMPOSITION / DERIVED |
| Cross-lens relationships | DERIVED_FROM_EXPLICIT_EVIDENCE |
| Cross-lens conflicts | DERIVED_FROM_COMPARABLE_EXPLICIT_CLAIMS |

Composed output is **never** source-of-record.

## Source Custody

Preserve child execution-byte SHA-256 and canonical JSON SHA-256 references. Three-lens layer references child projection versions / source refs; it does not become a substitute for child custody.

No ledger refresh. No DNA drift producer. No dirty/untracked overlay consumption.

## Determinism

Same validated Project World + Crystal DNA + AI Ecosphere projections + same `composition_version` → same three-lens output.

No current-clock semantics. No randomization. Future pure composition must not mutate child projections. Mutating three-lens output must not mutate children or the existing two-lens child composition.

Stable ordering: prefer established child ordering for projects, shards, dependencies, rings, agents, MiniBots, ledger entries, AI conflicts, unmatched, cross-lens relationships, and cross-lens conflicts. Do not reorder semantically meaningful arrays.

## Global DNA Lens

Unchanged from two-lens: DNA visible without false project attachment.

## Global AI Lens

Because associations = 0, AI Ecosphere remains globally visible (rings, agents, MiniBots, runtime evidence, ledger, conflicts, unmatched) without false attachment to 22 projects.

Future UI may navigate Project → AI Ecosphere or Project → Crystal DNA. **Navigation ≠ entity relationship.**

## Self-Awareness Contribution

Would contribute: project identity · sovereignty · asset/dependency · drift · AI registration · configuration · runtime-evidence · AI conflict awareness.

Does **not** claim complete self-awareness or consciousness.

## GARE Boundary

GARE remains separate. Three-lens awareness may later be **input** to diagnosis. It does not authorize recovery.

```text
THREE-LENS AWARENESS ≠ GARE ELIGIBILITY
AI ACTIVE ≠ REPAIR AUTHORITY
DNA DRIFT ≠ REPAIR AUTHORITY
PROJECT STATUS ≠ REPAIR AUTHORITY
```

Must not synthesize AR class, `autonomous_eligible`, `recipe_id`, rollback policy, or repair command.

Policy: DEFINED (charter). Executor: NOT IMPLEMENTED. Eligibility: UNDECLARED.

No AI model execution. No network. No database. No Mango/Tarzan activation. No C360/MMM/Shadow/Z Logic evaluation in this adapter.

## Observation Carry-Forward Matrix

| Observation | Origin | Current meaning | Three-lens requirement | Blocks spec? |
| ----------- | ------ | --------------- | ---------------------- | ------------ |
| OBS-ID-001 | Crystal DNA child | Missing vs duplicate shard ID share a coarse stop code | Do not repair child; keep unique IDs as compose preconditions; AI P0 already distinguishes missing vs duplicate | NO |
| OBS-COMP-001 | Two-lens compose | Pure `compose()` does not reject unknown `projection_id`; acquire path should | Three-lens **acquisition** validates all three child versions before compose; do not modify two-lens runtime now | NO |
| OBS-COMP-002 | Two-lens compose | `compose()` always `conflicts: []`; no generalized same-field channel | Define `cross_lens_conflicts[]` structurally; current evidence 0; do not promote AI’s 2 internal conflicts | NO |
| OBS-AI-001 | AI TEVV | No positive verified-active path | Carry verified active = 0; composition must not invent an active-runtime path | NO |
| OBS-AI-002 | AI TEVV | No association ingestion; always `[]` | Carry AI↔project = 0; composition does not open ingestion | NO |
| OBS-AI-003 | AI TEVV | No MATCHED reconciliation bridge | Carry 5 unmatched; other lenses must not fuzzy-match them | NO |

Future paths (all **DEFERRED**, not implemented by composition):

- OBS-AI-001 → runtime-evidence expansion with stronger source semantics
- OBS-AI-002 → explicit identity source + provenance for associations
- OBS-AI-003 → dedicated reconciliation engine; composition is not that engine

## Current Factual Summary

Source-derived at spec time (do not freeze as permanent constants):

| Fact | Value |
| ---- | ----- |
| PROJECTS | 22 |
| DNA SHARDS | 8 |
| DNA DEPENDENCIES | 6 |
| DNA DRIFT FINDINGS | 3 (overall BLUE) |
| PROJECT↔DNA VERIFIED LINKS | 0 |
| AI RINGS | 4 |
| AI TOWER AGENTS | 4 |
| AI MINIBOTS | 4 |
| AI LEDGER ENTRIES | 5 |
| VERIFIED ACTIVE AI RUNTIMES | 0 |
| AI↔PROJECT VERIFIED ASSOCIATIONS | 0 |
| AI↔DNA VERIFIED RELATIONSHIPS | 0 / UNDEFINED |
| AI INTERNAL CONFLICTS | 2 |
| AI UNMATCHED RECORDS | 5 |
| CROSS-LENS CONFLICTS | 0 |

Relationship counts must remain distinguishable. Do not collapse into a generic graph-edge total.

## Machine Output Strategy

Future **separate** report (do not create now):

`data/reports/z_composed_awareness_project_dna_ai_p0.json`

Do **not** overwrite Project World, Crystal DNA, AI Ecosphere, or existing PW+DNA composition reports.

Conceptual shape (not executable schema):

```text
{
  schema_version,
  composition_id,
  composition_version,
  posture,
  inputs: { project_world, crystal_dna, ai_ecosphere },
  project_world: {...},
  crystal_dna_lens: {...},
  ai_ecosphere_lens: {...},
  project_dna_coverage: [...],
  cross_lens_relationships: [...],
  lens_conflicts: {
    project_world: [...],
    crystal_dna: [...],
    ai_ecosphere: [...]
  },
  cross_lens_conflicts: [...],
  unmatched: { ai_ecosphere: [...] },
  summary: {...}
}
```

Internal AI conflicts → `lens_conflicts.ai_ecosphere`. Five unmatched → AI lens unmatched. Current `cross_lens_conflicts: []`.

## First Implementable Slice

If this spec is READY, implement **only**:

- validated three child projections (pure builders)
- explicit version gate
- reuse existing PW+DNA composition semantics
- attach AI Ecosphere as sibling **global** lens
- preserve 0 PW↔DNA links
- preserve 0 AI↔Project associations
- preserve AI 2 internal conflicts under AI lens
- preserve AI 5 unmatched records
- introduce empty current `cross_lens_conflicts[]` **as a real channel**
- preserve provenance
- derive factual summary (no universal health/authority scores)
- 3× deterministic proof
- child non-mutation
- separate report
- verifier

No new association logic. No active-runtime logic. No reconciliation bridge.

Isolated future tree (do not create now): `scripts/z_composed_awareness_project_dna_ai/` plus `scripts/z_composed_awareness_project_dna_ai_p0.mjs` and `_verify.mjs`.

## Future Verification

Minimum assertions (future implementation):

1. all three child projections valid
2. all projection versions supported
3. Project World IDs unique
4. DNA shard IDs unique
5. AI typed IDs valid
6. child projection inputs unchanged
7. Project World count preserved
8. DNA shard/dependency counts preserved
9. AI typed family counts preserved
10. no universal AI total invented
11. Project↔DNA zero links preserved (until explicit evidence)
12. AI↔Project zero associations preserved (until expansion gate)
13. AI unmatched records preserved
14. AI conflicts preserved internally
15. AI internal conflicts not promoted to cross-lens
16. no fuzzy identity bridge
17. no name/path/owner_layer bridge
18. no active runtime invented
19. sovereignty unchanged
20. Roulette unchanged
21. DNA status not mapped to project/AI
22. AI ledger status not mapped to project/DNA
23. different dimensions not false-conflicted
24. same-field cross-lens conflicts retained (synthetic channel proof)
25. provenance preserved by lens
26. relationship provenance required
27. no GARE eligibility
28. no child mutation
29. output backflow absent
30. deterministic output
31. no network
32. no AI calls
33. no refresh tooling

## Future TEVV

Adversarial probes must cover at least: coverage→DNA link; ring/MiniBot/Tower/persona/ledger/unmatched fuzzy-matched to Project; DNA shard matched to AI by path; AI GREEN→project health; DNA GREEN→AI active; UNVERIFIED→inactive; verified-active invented from ledger/status; two AI conflicts promoted to cross-lens; different dimensions false-conflict; true same-field auto-resolved; association changes sovereignty; Roulette linked to AI or DNA; version mismatch accepted; output mutates child; unmatched disappear; conflict provenance disappears; relationship without provenance; old three-lens report as source; GARE inferred from awareness.

## Hard Stops

Stop if: invalid or unsupported child version; duplicate/missing typed IDs; fuzzy matching required; AI internal conflicts would be promoted to cross-lens without same-entity same-field evidence; unmatched AI rows would be auto-matched; verified-active would be invented; sovereignty or Roulette would change; GARE eligibility inferred; child mutation; report recursion as SoR; ledger/drift refresh invoked; network/AI execution.

## Non-Goals

This gate does **not**: implement three-lens composition; modify two-lens `compose()`; modify AI P0; repair OBS-COMP-001/002; add verified-active path; add association ingestion; reconcile unmatched AI rows; activate AI; run ledger or DNA drift refresh; implement GARE or autonomous repair; implement dashboard; add Business/System World; wire F5A formulas; deploy.

## Authority

```text
THREE-LENS COMPOSITION AUTHORITY: NONE
AI AUTHORITY: NONE
REPAIR AUTHORITY: NONE
AUTONOMOUS AUTHORITY: NONE
PRODUCTION AUTHORITY: NONE
```

## Maturity

If sealed READY, permit only:

**PROJECT WORLD + CRYSTAL DNA + AI ECOSPHERE · THREE-LENS COMPOSITION SPEC**

Not: live AI ecosystem · AI Colony live · Swarm live · complete inventory · three-lens runtime · self-aware AI · GARE runtime · dashboard · production · external certification.

## Spec Readiness

**PROJECT_DNA_AI_THREE_LENS_COMPOSITION_SPEC_READY**

## ONE Recommended Next Gate

**Z-SANCTUARY-COMPOSED-AWARENESS-PROJECT-DNA-AI-THREE-LENS-COMPOSITION-P0-IMPLEMENTATION-1**

Do **not** recommend GARE executor, dashboard, live AI, association ingestion, or verified-active expansion yet.
