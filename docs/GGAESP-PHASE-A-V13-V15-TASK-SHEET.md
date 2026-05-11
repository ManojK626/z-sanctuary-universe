# GGAESP Phase A Task Sheet (v13-v15 bounded)

**Scope:** Implement only bounded upgrades for `v13`, `v14`, `v15` inside `core_engine/ggaesp_pipeline.ts` while preserving advisory posture and existing Z-ECR/Guardian/Ethics behavior.

**Gate:** BUILD NOW (bounded)
**Out of scope:** v16 distiller, v17 network, v18 axiom engine expansion, v19 co-evolution framework runtime.

Related docs:

- [GGAESP-V13-V19-IMPLEMENTATION-GAPS.md](GGAESP-V13-V19-IMPLEMENTATION-GAPS.md)
- [Z-BUILD-GATE-MATRIX.md](Z-BUILD-GATE-MATRIX.md)
- [Z-ECR-ENERGY-CLASSIFICATION-AND-REPLICATION-LAYER.md](Z-ECR-ENERGY-CLASSIFICATION-AND-REPLICATION-LAYER.md)

---

## 1) File-level implementation targets

### Primary file

- `core_engine/ggaesp_pipeline.ts`

### Optional support files (only if needed)

- `core_engine/ggaesp_test.ts` (add bounded tests/samples)
- `core_engine/heatmap_dev/ggaesp_heatmap_dev_sample.ts` (optional richer input demo)
- `core_engine/heatmap_dev/ggaesp_heatmap_go_dev_sample.ts` (optional calmer-state demo)

---

## 2) v13 bounded upgrade tasks (Collective Synthesis Core-lite)

### v13 Goal

Upgrade v13 from simple agreement scalar to bounded multi-source synthesis without external dependencies.

### v13 Tasks

- Add optional `collectiveSources` input shape under `GGAESPInput.data` (fully optional, safe defaults).
- For each source, compute bounded quality weights:
  - `accuracy_history`
  - `stability`
  - `context_match`
  - `bias_level` (inverse effect)
  - `recency`
- Produce v13 outputs:
  - `collectiveAgreement`
  - `consensusSignal`
  - `minorityWarning`
  - `divergenceAlert`
  - `herdRisk` (refined)
- Keep current behavior when no sources are provided (backward-compatible fallback).

### v13 Guardrails

- No person-level identity or social scoring.
- No external network calls.
- Deterministic math only.

---

## 3) v14 bounded upgrade tasks (HSV + modulation-lite)

### v14 Goal

Expand human-state adaptation using interaction-safe inputs only.

### v14 Tasks

- Extend optional `humanState` usage with bounded fields:
  - `calm`, `focus`, `fatigue`, `anxiety`, `confidence`, `frustration`, `disengagement`
- Compute a bounded Human Stability Factor and Emotional Bias Penalty.
- Feed penalty/factor into score shaping while retaining existing v14 behavior for old payloads.
- Emit clearer v14 reason notes when dampening is applied.

### v14 Guardrails

- No biometrics.
- No hidden profiling.
- State is session context, not identity.

---

## 4) v15 bounded upgrade tasks (Guardian integrity-lite)

### v15 Goal

Make guardian activation more explainable and calibrated without autonomous execution.

### v15 Tasks

- Add multi-trigger detection (`any 2 of N` configurable by constants) for elevated risk mode.
- Add `guardianSafetyFactor` and `irreversibleRiskPenalty` shaping terms (bounded).
- Add lightweight `guardianIntegrityScore` (GIS-lite) estimate in output notes (or memory capsule metadata).
- Add optional near-miss classification:
  - mark when a block/hold prevented likely harmful action.

### v15 Guardrails

- Guardian remains advisory/protective.
- No auto-trade/auto-action execution.
- Preserve reversibility and explainability.

---

## 5) Data contract and compatibility checklist

- Keep `runGGAESP` return keys backward-compatible.
- Keep `memoryCapsule` object present and append-compatible with `GGAESP_MEMORY_V2`.
- Preserve existing fields used by:
  - `dashboard/panels/ggaesp_panel.html`
  - `scripts/z_ggaesp_memory_append.mjs`
  - heatmap dev samples

---

## 6) Test and verify protocol

Run after each incremental milestone:

```powershell
npm run ts:check:ggaesp
npm run ts:build:ggaesp
npm run ts:run:ggaesp
npm run ts:run:ggaesp:heatmap
npm run ts:run:ggaesp:heatmap:go
node scripts/z_sanctuary_structure_verify.mjs
```

If memory shape changed, also validate append path:

```powershell
npm run ggaesp:memory:append <file.json>
```

---

## 7) Definition of done (Phase A)

- v13 bounded synthesis fields implemented with fallback compatibility.
- v14 bounded human-state modulation expanded and deterministic.
- v15 guardian calibration/near-miss tags added without execution authority.
- Existing scripts and panel flows continue to pass.
- Structure verify remains PASS.

---

## 8) Stop conditions (do not cross in Phase A)

- Do not implement networked multi-human sync (v17).
- Do not add invasive emotional profiling.
- Do not add social/relationship scoring capabilities.
- Do not change release authority or bypass governance gates.
