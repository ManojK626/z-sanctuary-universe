# Z-FPMI — Z Further Project & Module Identifier — SPEC 1

**Status:** Specification only · **no FPMI runtime** · **no three-lens mutation** · **no GARE executor**
**Date:** 2026-08-24
**START HEAD:** `46dd361`
**Branch:** `cursor/zsanctuary/z-sdc-phase-0-architecture`

Human name: **Z-FPMI** · Internal acronym: **FPMI** · Future machine namespace: **`z_fpmi`**

## Baseline

Unrelated porcelain preserved. No `git clean`, reset, amend, push, deploy. Sealed runtimes, identities, registries, and sources **not modified**.

Three-lens implementation `70fad5b` · internal TEVV `46dd361`. Source-derived current reality (must remain unchanged by FPMI):

| Fact | Value |
| ---- | ----- |
| PROJECTS | 22 |
| DNA SHARDS | 8 |
| PROJECT↔DNA VERIFIED LINKS | 0 |
| AI RINGS / TOWER AGENTS / MINIBOTS | 4 / 4 / 4 |
| AI VERIFIED ACTIVE | 0 |
| AI↔PROJECT ASSOCIATIONS | 0 |
| AI INTERNAL CONFLICTS | 2 |
| AI UNMATCHED | 5 |
| CROSS-LENS CONFLICTS | 0 |

## Purpose

Specify a deterministic **READ-ONLY** planning/identity overlay that can ask whether existing evidence **declares** where a future, deferred, missing, unmatched, legacy, or not-yet-implemented structure is **intended** to belong — without implementing that home or converting it into a current relationship.

## Constitutional Sentence

> FPMI identifies where evidence says something may belong later; it never claims that future structure exists today.

```text
MISSING TODAY ≠ DOES NOT BELONG ANYWHERE
NOT IMPLEMENTED ≠ UNKNOWN FOREVER
FUTURE INTENDED HOME ≠ CURRENT IMPLEMENTED RELATIONSHIP
FPMI MAY IDENTIFY A FUTURE HOME
FPMI MAY NOT TURN THAT HOME INTO A CURRENT RUNTIME LINK
```

Also: **MORE PLANNING EVIDENCE ≠ MORE CURRENT RELATIONSHIP AUTHORITY** (extends three-lens TEVV: more lenses ≠ more identity authority).

## Z-Prefix Naming Discipline

This gate is the first authorized recording of the standing rule.

```text
Z-PREFIX = NAMESPACE / FAMILY IDENTITY
Z-PREFIX ≠ AUTHORITY
Z-PREFIX ≠ OWNERSHIP
Z-PREFIX ≠ PERMISSION TO BREAK COMPATIBILITY
SAME Z PREFIX ≠ SAME PROJECT
```

**New** Z-Sanctuary-owned work prefers Z from birth: `Z-<Name>` / repo forms `z_<name>` · `z-<name>` · `z:` · `Z_<NAME>`.

**Do not** retroactively rename sealed project IDs, functions (`projectWorldP0`, `composeProjectWorldAndDna`), projection IDs, `cross_lens_conflicts`, child contracts, historical evidence, external identities, or third-party terms.

## Three-Lens Standing

P0 PASS + internal TEVV PASS. FPMI does **not** attach to the composed envelope in this gate. Future sequence: SPEC → P0 projection → TEVV → only then consider a fourth **evidence** plane.

## Current vs Intended Topology

Two independent planes:

| Plane | Answers |
| ----- | ------- |
| CURRENT VERIFIED TOPOLOGY | What exists, is implemented, is verified, has runtime evidence |
| INTENDED / FUTURE TOPOLOGY | Declared future home, deferred project/module, legacy destination, still-unknown home |

```text
INTENDED TOPOLOGY NEVER OVERWRITES CURRENT VERIFIED TOPOLOGY
CURRENT LINK ≠ FUTURE HOME
```

Correct: unmatched now + `FUTURE_DECLARED` later. Incorrect: FPMI therefore MATCHED / association created.

## FPMI Role

Deterministic evidence classifier / planning overlay. May identify: target Project, target Module, future Project, deferred Module, parent Project (as declared), legacy intended home, unresolved candidate, explicit separate/external posture.

Must **not** create, move, register, activate, deploy, or repair any of those.

## Non-AI Boundary

```text
FPMI ≠ AI ≠ LLM ≠ AGENT ≠ AUTONOMOUS PLANNER
FPMI ≠ PROJECT CREATOR ≠ MODULE CREATOR
```

P0 must not use LLM, embeddings, vector similarity, or fuzzy semantic match as placement authority.

## Classification Taxonomy

| Class | Meaning |
| ----- | ------- |
| CURRENT_VERIFIED | A current implemented relationship already proven by an authoritative lens. FPMI may cite it; that lens remains authority. |
| FUTURE_DECLARED | Authoritative source **explicitly** declares intended Project/Module home. Not implemented. |
| DEFERRED_PROJECT | Target Project known/planned; implementation or registration deferred. |
| DEFERRED_MODULE | Target Module known/planned; not currently implemented. |
| LEGACY_UNRESOLVED | Legacy evidence exists; canonical intended home not safely reconciled. |
| CANDIDATE_ONLY | Possible home suggested; insufficient to declare. |
| UNASSIGNED | No trustworthy intended home evidenced. |
| SEPARATE_OR_EXTERNAL | **Included:** existing doctrine uses `SEPARATE_PROJECT` (e.g. Roulette / Replit). Must not absorb into a Z-Sanctuary parent. |

```text
MISSING ≠ FUTURE_DECLARED
UNMATCHED ≠ DEFERRED_MODULE
LEGACY ≠ CURRENT
CANDIDATE ≠ DECLARED
DEFERRED ≠ CANCELLED
FUTURE_DECLARED ≠ SCHEDULED
FUTURE_DECLARED ≠ IMPLEMENTATION AUTHORIZED
```

Do **not** classify all five AI unmatched as future modules. Do **not** classify all 22 missing DNA coverage rows as planned relationships.

## Cause Taxonomy

Unresolved placement may be: future project not implemented · future module not implemented · known project but relationship not implemented · legacy name awaiting reconciliation · separate/external · blueprint-only · source incomplete · genuinely unknown. Evidence chooses; do not force one bucket.

## Subject Identity

Stable explicit identity where possible. Else `FPMI_SUBJECT_IDENTITY_UNRESOLVED`. Do not hash/normalize display names into IDs.

Discovered subject types (bounded; not an open ontology): **MODULE** (registry planned stubs) · **PROJECT / IDENTITY CITIZEN** (pc_root + identity map) · **AI CAPABILITY** (only if later explicit home evidence) · **DNA ASSET** (only if later explicit home evidence) · **UNMATCHED RECORD** (optional; not automatic P0).

## Future Target Identity

If target has a canonical current ID, preserve it. If future-only, keep **source-declared name/reference** separately. Do **not** manufacture a current Project World ID.

`target_project` and `target_module` are **separate fields**. Record `target_currently_exists`: YES / NO / UNKNOWN. NO is valid for declared future work.

```text
FUTURE PROJECT REFERENCE ≠ PROJECT WORLD REGISTRATION
FUTURE MODULE REFERENCE ≠ IMPLEMENTED MODULE
```

FPMI cannot add a Project to Project World or treat a deferred module as implemented.

## Project Target / Module Target

A future Project may be a **current registered** project or a **declared future** project — keep distinct. A future Module may sit under either. Existence NO is not a spec error when evidence says future.

## Current Link vs Future Home

Example (valid): AI evidence `current_relationship_posture: UNMATCHED` + `future_classification: FUTURE_DECLARED` + `current_link_created: NO`.

Forbidden: future Project found ⇒ `AI_MATCHED = TRUE` / association created.

Project↔DNA verified links remain **0** even if a DNA shard later has a future Module destination. AI unmatched remains **5** until a **separate** AI reconciliation gate. AI internal conflicts remain **2**, unused as placement authority, not promoted cross-lens. Cross-lens conflicts remain **0**.

## Source Discovery

Search covered `docs/`, `data/`, `scripts/`, registries, governance for future/belongs/module/project/parent/deferred/planned/roadmap/blueprint/legacy/candidate. Essential **structured** planning signals **exist**. No invented “home” fields.

## Source Resolution Matrix

| Source | Path | Type | Maturity | Can prove future home? | Can prove current link? |
| ------ | ---- | ---- | -------- | ---------------------- | ----------------------- |
| Project World / pc_root | `data/z_pc_root_projects.json` | CANONICAL REGISTRY | Sealed child consume | Existence of **current** project IDs only | YES (current identity) — FPMI must not write |
| Identity reconciliation map | `docs/PROJECT_IDENTITY_RECONCILIATION.md` | SEALED SPEC / AUDIT | Tracked; SEPARATE / UNRESOLVED / SUBSYSTEM / SUCCESSOR | SEPARATE_OR_EXTERNAL; UNRESOLVED ≠ declared home | NO — not a join engine |
| Master module registry | `data/z_master_module_registry.json` | CANONICAL REGISTRY | Tracked; `registry_status: planned_stub`; **category** not project_id | DEFERRED_MODULE; project UNASSIGNED unless explicit field added later | NO |
| Z module registry | `data/Z_module_registry.json` | CANONICAL REGISTRY | Tracked; `ZStatus: planned`; `ZLayer` / `ZOwner` ≠ project home | DEFERRED_MODULE; project UNASSIGNED | NO |
| AI Ecosphere config/status/ledger | P0 consume set | CONFIG + DERIVED REPORTS | Child TEVV sealed | `planned` ≠ Project/Module home | Runtime evidence only (current AI lens) |
| Three-lens / child composed reports | `data/reports/z_composed_awareness_*` | GENERATED REPORT | Integrity fixtures | NO as planning SoR | Current topology only |
| Family AI registry | `data/z_family_ai_registry.json` | IDENTITY REGISTRY | **Untracked** | Not P0 until custody | NO |
| SSWS shadow manifest | `data/z_ssws_shadow_manifest.json` | GENERATED/CONFIG | **Worktree dirty** | Not P0 | NO |
| ChatGPT project tracking | `data/z_chatgpt_projects_tracking.json` | LEGACY / TRACKING | `parent_project` display names | CANDIDATE_ONLY at most; not P0 | NO |
| Master Modules Register / Huge file | `docs/Z-MASTER-MODULES-REGISTER.md` | ARCHITECTURE CHARTER + external OneDrive source | Prose / checklist | Weak unless a sealed structured field exists | NO |
| Roadmaps / blueprints (ZES, Genesis, Connect, …) | various `docs/**` | ROADMAP / BLUEPRINT | Mixed | CANDIDATE_ONLY unless gate-authorized structured assignment | NO |
| DNA manifest / drift | Crystal DNA P0 sources | CANONICAL + DERIVED | Child custody CLEAN | Asset identity; not automatic project home | Current DNA lens only |

## Evidence Authority Model

Non-numeric hierarchy. **Strong:** explicit sealed identity decision; explicit sealed spec assignment; canonical registry field that **names** intended parent/home. **Weak:** blueprint suggestion, legacy prose, naming/folder similarity, implication. Weak evidence must not become `FUTURE_DECLARED`.

No `future_home_score`, confidence percentage, placement probability, or truth score.

## Explicit Evidence Requirements

`FUTURE_DECLARED` requires an explicit placement contract, such as a structured field or unambiguous sealed sentence of the form: module/project **belongs to** / **parent project** / **target module** / **future implementation will live under**. Do not infer from topic similarity.

Forbidden as placement authority: display-name similarity, case-fold, substring, folder proximity, same acronym/prefix, `owner_layer`, similar purpose, shared source/dashboard/AI name/DNA path, **Z-prefix family identity**.

## Legacy Evidence

Legacy name ≠ future home. If no explicit destination: `LEGACY_UNRESOLVED`. Identity map `UNRESOLVED` / HOLD stays unresolved. `SUCCESSOR` / `PREDECESSOR` in that map require **Steward** (EMK-REHOME etc.); FPMI must not auto-supersede.

Discovered supersession vocabulary: `SUCCESSOR` / `PREDECESSOR` / `replaced_by` **only where the source already defines them**. Newest/oldest/Z-prefix/roadmap does **not** auto-win. Prefer `FPMI_PLANNING_CONFLICT` UNRESOLVED.

## Roadmap / Blueprint Semantics

```text
ROADMAP EXISTS ≠ ROADMAP GATE AUTHORIZED ≠ IMPLEMENTED
BLUEPRINT ≠ COMMITTED ROADMAP
```

A blueprint/roadmap may support `CANDIDATE_ONLY` or, if governance/maturity explicitly commits a structured assignment, `FUTURE_DECLARED` — while `CURRENT LINK: NONE`.

## Future-Home Conflicts / Planning Conflict Semantics

Incompatible authoritative homes: **do not choose**. `FPMI_PLANNING_CONFLICT` with subject, claims, targets, sources, posture `UNRESOLVED`.

```text
FPMI PLANNING CONFLICT ≠ AI INTERNAL CONFLICT ≠ CURRENT CROSS-LENS CONFLICT
```

Must not change three-lens conflict counts.

## Separate / External Boundary

**SEPARATE_OR_EXTERNAL** is required. Roulette (`replit-roulette-z-amk-goku-mdcp`) is `SEPARATE_PROJECT` in identity reconciliation and SEPARATE in Project World. Related technology ≠ Z-Sanctuary parent. Sister Aisling / ÉirMind: SUBSYSTEM / lineage — FPMI must not invent a second project or absorb ÉirMind as a new Project World row.

Intended implementation home ≠ legal ownership ≠ sovereignty ≠ runtime control.

## Sovereignty

Copy/cite Project World sovereignty. Future home must not change it. Roulette ownership unchanged.

## AI Unmatched Protection

Five records remain AI-lens unmatched. They are **optional** FPMI subjects only if stably identifiable **and** independent future-home evidence exists. Discovery did **not** find explicit Project/Module homes for `hygiene`, `disturbance_watch`, `super_ghost_feed`, `qosmei_core`, `task_accomplishments`. First slice: **exclude** or classify `UNASSIGNED`. Do not invent five destinations. OBS-AI-002 / OBS-AI-003 are **not** repaired by FPMI.

## DNA Missing Protection

22 MISSING coverage rows ≠ 22 FPMI subjects. Future module destination ≠ verified Project↔DNA link. Include only with explicit planning evidence.

## AI Internal Conflict Protection / Cross-Lens Conflict Protection

FPMI does not resolve, promote, or use the two ledger score conflicts as placement. Cross-lens channel and count stay with three-lens.

## Provenance

Every future-home claim: repo-relative path, record/section, source type, maturity, exact declaration or field, origin, seal/version where available. Preserve the **claim text/field**, not only the conclusion. No FPMI self-sourcing (old FPMI report ↛ new FPMI report).

## Source Custody

| Intended P0 input | Tracked | Dirty overlay | P0 |
| ----------------- | ------- | ------------- | -- |
| `docs/PROJECT_IDENTITY_RECONCILIATION.md` | YES | No (this gate) | YES — SEPARATE / UNRESOLVED only |
| `data/Z_module_registry.json` | YES | Confirm worktree=HEAD at implementation | YES — planned → DEFERRED_MODULE, project UNASSIGNED |
| `data/z_master_module_registry.json` | YES | Confirm worktree=HEAD | YES — planned_stub → DEFERRED_MODULE, project UNASSIGNED |
| `data/z_pc_root_projects.json` | YES | Child-sealed for existence checks | YES — **read** current ID existence only |
| Family AI registry / dirty shadow / ChatGPT tracking / Huge file | Untracked or weak/dirty | — | **NO** |

If implementation later needs those excluded files: **source-custody reconciliation** first. This spec’s **narrow** P0 set is treated as **CLEAN enough to implement** after a pre-implement hash check vs HEAD.

## Determinism

Same sources + same FPMI version → same classifications. Network / database / AI / randomness / clock-dependent classification: **NONE**.

## Current Three-Lens Non-Mutation

Future FPMI must not modify Project World, Crystal DNA, AI Ecosphere, two-lens or three-lens composition, their reports, sources, or unmatched/conflict/active/association counts. FPMI may keep **separate** planning counts only.

## Fourth Evidence Plane — Future Only

```text
Z COMPOSED AWARENESS
├── CURRENT PROJECT WORLD
├── CURRENT CRYSTAL DNA
├── CURRENT AI ECOSPHERE
└── (later) Z-FPMI INTENDED-HOME AWARENESS
```

Fourth plane ≠ fourth authority. Do **not** attach in this gate.

## Future Full Status Matrix Relationship

A read-only stewardship view may later consume FPMI (current status, intended home, deferred, evidence, planning conflicts, next gate). **VIEW ≠ SOURCE OF TRUTH. DASHBOARD ≠ AUTHORITY.** Do not implement the matrix now.

## First Implementable Slice

1. Parse tracked module registries: `planned` / `planned_stub` → subjects type MODULE, `future_classification: DEFERRED_MODULE`, `target_project` UNASSIGNED (no explicit parent field today).
2. Parse identity reconciliation: explicit `SEPARATE_PROJECT` → `SEPARATE_OR_EXTERNAL`; `UNRESOLVED` → `LEGACY_UNRESOLVED` or UNASSIGNED — **not** FUTURE_DECLARED.
3. Use pc_root only to set `target_currently_exists` when a **declared** target ID is later present.
4. **Exclude:** AI unmatched 5, DNA missing 22, untracked/dirty overlays, composed reports as SoR, prose roadmaps as auto-declared homes.
5. Output separate `data/reports/z_fpmi_p0.json` (future). Isolated `scripts/z_fpmi/`. Node ESM, deps 0.
6. Verifier must prove current three-lens counts unchanged; no fuzzy placement; deferred module ≠ implemented; deferred project ≠ new Project World row; planning conflicts UNRESOLVED; no GARE/AI.

Conceptual (not executable) projection: `schema_version`, `projection_id` (e.g. `z_fpmi_p0`), `projection_version`, `posture: DERIVED_PLANNING_OVERLAY`, `sources[]`, `subjects[]`, `future_home_claims[]`, `classifications[]`, `planning_conflicts[]`, `unresolved[]`, `summary` (planning counts only; no health/readiness).

Subject record fields only if supported: `subject_ref`, `subject_type`, `current_presence`, `current_relationship_posture` (from authoritative **current** lens, not invented), `future_classification`, target project/module refs/names, `target_currently_exists`, `evidence_refs`, `origin`, `planning_conflicts`.

Safe summary counts: subjects_examined, deferred_module_count, separate_or_external_count, legacy_unresolved_count, unassigned_count, planning_conflict_count. No completion percentage.

## Future Machine Output

Candidate report: `data/reports/z_fpmi_p0.json`. Tree: `scripts/z_fpmi/` · `scripts/z_fpmi_p0.mjs` · `scripts/z_fpmi_p0_verify.mjs`. **Do not create now.**

## Future Verification

At minimum the 22 assertions listed in the gate charter §77 (stable IDs, explicit claims, no fuzzy, no current-link creation, three-lens counts frozen, sovereignty, separate/external, provenance, no AI, determinism, no GARE).

## Future TEVV

Attacks per gate charter §78 (auto-labelling unmatched/DNA, Z-prefix/path/name homes, candidate promotion, inserting deferred projects, absorbing Roulette, auto-resolving planning conflicts, FPMI report as SoR, mutating three-lens, inventing GARE).

## GARE Boundary

Policy DEFINED · executor NOT_IMPLEMENTED. FPMI creates no eligibility, AR class, recipe, rollback, or autonomous action. No READY/GO/IMPLEMENT/DEPLOY/ACTIVATE/REPAIR from a planning row.

## Hard Stops

Stop if: fuzzy match required; FPMI would change current counts; future project would enter Project World; unmatched would become MATCHED; DNA missing would become verified links; planning conflict would be auto-won; dirty/untracked source consumed; LLM/embeddings used; GARE inferred; three-lens mutated.

## Non-Goals

Runtime this gate · attaching fourth plane · Full Status Matrix UI · crawling all Markdown at runtime · repairing OBS-* · identity reconciliation execution · registry rewrites · GARE · dashboard · production.

## Observations Carried

OBS-ID-001, OBS-COMP-001, OBS-COMP-002, OBS-AI-001, OBS-AI-002, OBS-AI-003 — **not repaired**. FPMI is not a workaround for missing association ingestion or MATCHED bridge.

## Maturity

**Z-FPMI · SPECIFICATION** only.

## Spec Readiness

**Z_FPMI_SPEC_READY**

## ONE Recommended Next Gate

**Z-SANCTUARY-FURTHER-PROJECT-MODULE-IDENTIFIER-FPMI-P0-IMPLEMENTATION-1**

Narrow slice above; confirm listed JSON/MD byte-equal to HEAD before coding. If that check fails, divert to source-custody reconciliation instead of expanding consume set.
