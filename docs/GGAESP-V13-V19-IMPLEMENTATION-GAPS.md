# GGAESP v13-v19 Implementation Gaps (Build-Gated)

**Purpose:** Track what is already implemented in `core_engine/ggaesp_pipeline.ts` versus the expanded v13-v19 vision, with clear gate labels (`BUILD NOW` / `PREPARE ONLY` / `WAIT`).

**Authority chain:**
[Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) → [Z-BUILD-GATE-MATRIX.md](Z-BUILD-GATE-MATRIX.md) → [Z-MASTER-MODULES-REGISTER.md](Z-MASTER-MODULES-REGISTER.md)

**Current technical base:** `runV13` .. `runV19` exist in `core_engine/ggaesp_pipeline.ts`; memory append path exists via `core_engine/ggaesp_memory.ts` and `scripts/z_ggaesp_memory_append.mjs`.

---

## Snapshot (as of 2026-04-27)

| Layer | Current state | Gap class | Gate |
| ------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------- |
| v13 Collective intelligence | Basic collective agreement + herd-risk adjustment present | Lacks multi-source CSC, contrarian detector, source weighting matrix | BUILD NOW (bounded) |
| v14 Human-adaptive intelligence | Basic human-state penalty present (`fatigue`, `anxiety`, `confidence`) | Lacks richer HSV/EME state model and modulation profiles | BUILD NOW (bounded) |
| v15 Guardian autonomous | Core guardian enforcement and branch status present | Lacks GIS, near-miss memory class, trigger-combination model | BUILD NOW (bounded) |
| v16 Legacy transmission | Memory capsule exists | Lacks legacy object model + wisdom distiller + applicability bounds | PREPARE ONLY |
| v17 Multi-human network | Placeholder note only | No decentralized shared-signal protocol implemented | WAIT |
| v18 Ethical governance | Basic ethics downgrade exists | Lacks full axiom/council review framework | PREPARE ONLY |
| v19 Co-evolution | Output shaping stage exists | Lacks hand-back, skill transmission, mirrored growth policy | PREPARE ONLY |

---

## Already implemented in code

- v13: collective agreement + herd-risk score shaping.
- v14: emotional-bias penalty via human-state inputs.
- v15: guardian gate (`GO/PREPARE/HOLD/BLOCK`) + `guardian_status`.
- v16: memory capsule (with branch trace) and append-only memory path.
- v18: ethics downgrade when risk violates dignity posture.
- v19: final output shaping (`metaScore`, `polarity`, `confidence`, notes).

---

## Gap map by version

## v13 - Collective Synthesis Core (CSC)

**Target capabilities (missing):**

- Multi-source input list (tables, strategies, agents, sessions, timeframes).
- Per-source dynamic weight model:
  - `accuracy_history`
  - `stability`
  - `context_match`
  - `bias_level`
  - `recency`
- Consensus vs contrarian detection:
  - `consensus_signal`
  - `minority_warning`
  - `divergence_alert`

**Build recommendation:** `BUILD NOW` (internal, advisory-only, no external social scoring).

---

## v14 - Human State Interface + Emotional Modulation

**Target capabilities (missing):**

- Human State Vector (HSV) expansion:
  - calm, focused, fatigued, overconfident, anxious, frustrated, grounded, disengaged
- Emotional Modulation Engine (EME) profiles:
  - adjust guidance intensity, pace, and action thresholds by state
- Emotional safety rails:
  - forced de-escalation posture when instability rises

**Build recommendation:** `BUILD NOW` (bounded to local interaction patterns; no biometric or invasive profiling).

---

## v15 - Guardian Autonomous Mode (bounded)

**Target capabilities (missing):**

- Trigger-combination model (e.g., any 2 of N high-risk indicators).
- `GuardianIntegrityScore` (GIS) for over/under-intervention balancing.
- `NearMiss` capsule class to learn from almost-fail events.
- Explicit reversible intervention profile matrix.

**Build recommendation:** `BUILD NOW` (advisory/constraint layer only; no autonomous trade execution).

---

## v16 - Legacy & Wisdom Transmission

**Target capabilities (missing):**

- Legacy Object Model (LOM) with applicability and non-applicability bounds.
- Wisdom distiller (cluster -> denoise -> distill -> confidence band).
- Transmission modes (seed/guide/mentor/guardian).
- Anti-dogma decay and revalidation workflow.

**Build recommendation:** `PREPARE ONLY` (docs + schemas + mocks first).

---

## v17 - Multi-Human Guardian Network

**Target capabilities (missing):**

- Decentralized node model for anonymized shared alerts.
- Strict shared signal schema (non-personal only).
- Anti-herd lock for sudden consensus spikes.
- Opt-in governance and exit semantics.

**Build recommendation:** `WAIT` until identity, moderation, and legal/privacy posture are fully ready.

---

## v18 - Ethical Governance Engine

**Target capabilities (missing):**

- Explicit ethical axiom set as machine-checkable rules.
- Ethics review loop around major actions (allow/downgrade/block).
- Multi-perspective council synthesis (logic/compassion/risk/wisdom/long-term).

**Build recommendation:** `PREPARE ONLY` (charter + policy tests before runtime enforcement expansion).

---

## v19 - Human-AI Co-Evolution Framework

**Target capabilities (missing):**

- Mirrored growth policy:
  - human capacity up -> depth up
  - fatigue up -> complexity down
- Hand-back rule (explainable and teachable capability transfer).
- Skill transmission lane (assist learning, avoid dependency).

**Build recommendation:** `PREPARE ONLY` (charter + training UX + guard tests before live integration).

---

## Suggested phased execution (safe order)

1. **Phase A (`BUILD NOW`)**
   - v13 bounded CSC
   - v14 bounded HSV/EME
   - v15 bounded GIS + NearMiss
2. **Phase B (`PREPARE ONLY`)**
   - v16, v18, v19 schemas, docs, and tests
3. **Phase C (`WAIT`)**
   - v17 networked collective layer after governance/legal readiness

---

## Non-negotiable safeguards

- Advisory-first posture remains active.
- Guardian and ethics can downgrade or block.
- No people scoring, no coercive logic, no hidden emotional exploitation.
- All new capabilities must remain transparent and reversible.

---

## Verification checklist after each increment

- `npm run ts:check:ggaesp`
- `npm run ts:build:ggaesp`
- `npm run ts:run:ggaesp`
- `node scripts/z_sanctuary_structure_verify.mjs`
- If memory schema touched: verify `GGAESP_MEMORY_V2` append path remains compatible.
