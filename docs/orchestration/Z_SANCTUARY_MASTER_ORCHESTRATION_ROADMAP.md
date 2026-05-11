# Z-Sanctuary master orchestration roadmap

**Purpose:** Single map from **existing hub truth** → **Zuno orchestrator doctrine** → **phased implementation** without chaotic coupling or fake shipped claims.

**Brotherhood seal:** Truthful, modular, safe, auditable — not bigger by being messier.

## Phase 0 — Read current truth first (always)

**Goal:** Cursor and builders never “restart from chat blueprint” while ignoring the repo.

**Run or account for:**

```bash
npm run z:ai-builder:refresh
npm run z:car2
npm run dashboard:registry-verify
```

**Read minimum:**

- `docs/AI_BUILDER_CONTEXT.md`, `docs/Z_SANCTUARY_BUILD_RULES.md`, `docs/Z_SANCTUARY_MASTER_GLOSSARY.md`, `docs/Z_SANCTUARY_IMPLEMENTATION_LANES.md`
- `docs/ai-builder/README.md`, `dashboard/README.md`
- Generated indexes: `docs/Z_SANCTUARY_MODULE_INDEX.md`, `docs/Z_SANCTUARY_ENGINE_INDEX.md`, `docs/Z_SANCTUARY_SAFETY_INDEX.md`
- `data/z_master_module_registry.json`, `data/z_core_engines_registry.json`
- `data/reports/z_zuno_coverage_audit.{json,md}`, `data/reports/z_zuno_phase3_completion_plan.{json,md}`, `data/reports/z_car2_similarity_report.{json,md}`

**Active ritual (full spine):**

```bash
npm run zuno:coverage && npm run zuno:phase3-plan && npm run z:docs:modules && npm run z:car2
```

## Phase 1 — Orchestrator blueprint (complete)

**Deliverables:** `docs/orchestration/` pack:

- [ZUNO_ORCHESTRATOR_BLUEPRINT.md](ZUNO_ORCHESTRATOR_BLUEPRINT.md)
- [ZUNO_CAPABILITY_ROUTER.md](ZUNO_CAPABILITY_ROUTER.md)
- [ZUNO_PROVIDER_ADAPTER_CONTRACT.md](ZUNO_PROVIDER_ADAPTER_CONTRACT.md)
- [ZUNO_MEMORY_KNOWLEDGE_LAYER.md](ZUNO_MEMORY_KNOWLEDGE_LAYER.md)
- [ZUNO_OUTPUT_VERIFIER.md](ZUNO_OUTPUT_VERIFIER.md)
- This roadmap + [README.md](README.md)

No runtime requirement beyond existing scripts.

## Phase 2 — Core contracts (code, gated)

**Goal:** TypeScript contracts for requests, plans, capabilities, providers, formulas, DRP decisions.

**Phase 1A started:** `packages/zuno-orchestrator-contracts/` — workspace `@z-sanctuary/zuno-orchestrator-contracts` (types only; build emits `dist/`). **Phase 1B:** `examples/*.example.json` + [ZUNO_CONTRACT_EXAMPLES.md](ZUNO_CONTRACT_EXAMPLES.md) (non-executable fixtures). **Phase 1C:** `scripts/validate_examples.mjs` + hub reports `data/reports/zuno_orchestrator_contract_examples_check.*` (parse/shape only). **Phase 1D:** package [README.md](../../packages/zuno-orchestrator-contracts/README.md) — import boundaries, scripts, underscore stripping, examples are not runtime plans. **Phase 2A:** [lint_task_plan.mjs](../../packages/zuno-orchestrator-contracts/scripts/lint_task_plan.mjs) — read-only **`ZunoTaskPlan`** JSON lint + hub reports; **no** execution. **Phase 2B:** [z-orchestration-status-readonly.js](../../dashboard/scripts/z-orchestration-status-readonly.js) — HODP read-only status card (examples check, task-plan lint, contracts package, posture lines); **no** buttons. Extend here before adding execution logic elsewhere.

If monorepo layout must split further, use a dedicated task; do not spray interfaces across apps without review.

## Phase 3 — Formula registry

**Goal:** Structured, searchable formula **documentation** and optional `data/formulas/z_formula_registry.json`.

Docs-first under `docs/formulas/` (see user vision); formulas described as **decision and transformation frameworks**, not guarantees.

## Phase 4 — DRP governance engine

**Goal:** Docs + read-only evaluator script → reports under `data/reports/`; **no** silent blocking until validated.

Suggested phased evolution: docs → interfaces → fixtures → read-only evaluator → gated integration.

## Phase 5 — Provider adapter skeleton

**Goal:** `data/providers/z_provider_capability_registry.json` (metadata, disabled) + docs; **no** keys, **no** live calls.

## Phase 6 — Knowledge / memory index

**Goal:** Local read-only scan → `data/reports/z_knowledge_index.{json,md}`; no external indexers without approval.

## Phase 7 — Creative production engines

**Goal:** Blueprint docs under `docs/creative/` per medium; each with input, agents, formula, safety gate, output, verification, human approval point.

## Phase 8 — Cross-project overseer

**Goal:** Bridge map doctrine — **connected | reference-only | blocked | separate railway | needs charter** — especially **XL2** ([CROSS_PROJECT_LINKING_POLICY.md](../z-maos/CROSS_PROJECT_LINKING_POLICY.md)).

## Phase 9 — Dashboard cockpit

**Goal:** Read-only cards (coverage, CAR², AI Builder links, formula or DRP status placeholders, deployment HOLD). No auto-fix buttons until approved.

## Phase 10 — One implementation lane at a time

**Goal:** Single lane, single module, single risk class, acceptance checklist, rollback plan ([Z_SANCTUARY_IMPLEMENTATION_LANES.md](../Z_SANCTUARY_IMPLEMENTATION_LANES.md)).

## What this roadmap defines (checklist)

1. Zuno as **orchestrator**, not one giant model — [ZUNO_ORCHESTRATOR_BLUEPRINT.md](ZUNO_ORCHESTRATOR_BLUEPRINT.md)
2. Capability routing — [ZUNO_CAPABILITY_ROUTER.md](ZUNO_CAPABILITY_ROUTER.md)
3. Provider-agnostic adapters — [ZUNO_PROVIDER_ADAPTER_CONTRACT.md](ZUNO_PROVIDER_ADAPTER_CONTRACT.md)
4. Z Formula layer — Phase 3 + existing formula docs ([Z-ULTRA-INSTINCTS-AND-FORMULAS.md](../Z-ULTRA-INSTINCTS-AND-FORMULAS.md))
5. 14 DRP governance — Phase 4 + omni ethics rules elsewhere
6. Knowledge and memory — [ZUNO_MEMORY_KNOWLEDGE_LAYER.md](ZUNO_MEMORY_KNOWLEDGE_LAYER.md)
7. Project overseer — Z-MAOS + registry ([Z_MAOS_CHARTER.md](../z-maos/Z_MAOS_CHARTER.md))
8. Dashboard reporting — Phase 9 + existing indicators pipeline
9. Safety gates and forbidden automation — [Z_SANCTUARY_BUILD_RULES.md](../Z_SANCTUARY_BUILD_RULES.md)
10. Phase-by-phase plan — this document + `data/reports/zuno_orchestrator_phase_plan.{json,md}`

## Forbidden (whole programme)

- Live provider integrations without contracts and consent
- API keys in repo
- Payments, GPS, camera, mic, gambling automation, baby predictor, health claims, emergency automation, production deploy activation — unless explicitly chartered and gated
- **XL2** coupling without charter

## Verification after doc changes

```bash
npm run z:ai-builder:refresh
npm run z:car2
npm run dashboard:registry-verify
```

## Related doctrine

- [Z-RPWC-REPLICABLE-POWER-WITHOUT-CHAOS.md](../Z-RPWC-REPLICABLE-POWER-WITHOUT-CHAOS.md)
- [Z-AI-DOORWAY-AND-ESCORT-PROTOCOL.md](../Z-AI-DOORWAY-AND-ESCORT-PROTOCOL.md)
- [Z-CRITICAL-BUG-HUNTER-BRIEF.md](../Z-CRITICAL-BUG-HUNTER-BRIEF.md) — manual high-severity reviews only
