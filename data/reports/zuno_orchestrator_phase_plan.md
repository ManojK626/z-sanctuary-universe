# Zuno orchestrator phase plan (report only)

**Generated:** 2026-05-03 (planning artefact; refresh when orchestration docs change).
**Schema:** `zuno_orchestrator_phase_plan_v1`

## 1. Existing foundations already present

- Master and core engine registries (`data/z_master_module_registry.json`, `data/z_core_engines_registry.json`).
- Zuno coverage audit + Phase 3 completion plan (`data/reports/z_zuno_*`).
- Z-CAR² scan outputs (`data/reports/z_car2_*`).
- AI Builder pack + generated indexes (`docs/AI_BUILDER_CONTEXT.md`, `docs/ai-builder/`, `docs/Z_SANCTUARY_*_INDEX.md`).
- Build rules, implementation lanes, MAOS charter, Cursor Ops railway.
- Dashboard entry docs + `npm run dashboard:registry-verify`.
- Privacy + indicators refresh chain for operator signals.
- Phase 1B JSON fixtures under `packages/zuno-orchestrator-contracts/examples/` (non-executable).
- Phase 1C `examples:check` → `data/reports/zuno_orchestrator_contract_examples_check.{json,md}`.
- Phase 1D `packages/zuno-orchestrator-contracts/README.md` — imports, scripts, fixture boundaries.
- Phase 2A `scripts/lint_task_plan.mjs` — read-only **`ZunoTaskPlan`** lint → `data/reports/zuno_task_plan_lint_report.{json,md}`.
- Phase 2B `dashboard/scripts/z-orchestration-status-readonly.js` — Control Centre card (contracts + reports + posture); no execution.

## 2. New docs added

- `packages/zuno-orchestrator-contracts/README.md`
- `docs/orchestration/ZUNO_CONTRACT_EXAMPLES.md`
- `docs/orchestration/README.md`
- `docs/orchestration/ZUNO_ORCHESTRATOR_BLUEPRINT.md`
- `docs/orchestration/ZUNO_CAPABILITY_ROUTER.md`
- `docs/orchestration/ZUNO_PROVIDER_ADAPTER_CONTRACT.md`
- `docs/orchestration/ZUNO_MEMORY_KNOWLEDGE_LAYER.md`
- `docs/orchestration/ZUNO_OUTPUT_VERIFIER.md`
- `docs/orchestration/Z_SANCTUARY_MASTER_ORCHESTRATION_ROADMAP.md`

## 3. Missing contracts

- **Done (1A):** `packages/zuno-orchestrator-contracts` — types only; no runtime orchestrator yet.
- **Done (1B):** example JSON + `ZUNO_CONTRACT_EXAMPLES.md`; still no runtime consumer.
- **Done (1C):** `scripts/validate_examples.mjs` + reports; still no orchestrator.
- **Done (1D):** package README + orchestration doc polish; still no runtime consumer.
- **Done (2A):** task-plan linter (reports only); still no orchestrator execution.
- **Done (2B):** dashboard read-only orchestration status card; still no runtime orchestrator.
- Runtime wiring that **consumes** those types (Phase 2+ runtime — not started).
- Formula registry JSON under `data/formulas/` (Phase 3).
- Provider capability registry JSON (Phase 5).
- DRP read-only checker script (Phase 4 — proposed).
- Knowledge index scanner (Phase 6 — proposed).
- Cross-project bridge registry JSON (Phase 8 — proposed).

## 4. Safe first code interfaces

- Disabled-only provider metadata JSON (no keys, no calls).
- DRP report script: emits report, does not block merges until validated.
- Local knowledge index scan → report files only.

## 5. Unsafe items that remain blocked

- Live providers, secrets in repo, sensitive modalities per build rules, auto-merge/deploy, XL2 coupling without charter.

## 6. Recommended Phase 1 implementation slice

Phase 2A adds read-only **`ZunoTaskPlan`** linting (no execution). Next optional slices: disabled provider registry JSON, or read-only DRP report script — still no live providers.

## 7. Test commands

```bash
npm run examples:check --workspace=@z-sanctuary/zuno-orchestrator-contracts
npm run task-plan:lint --workspace=@z-sanctuary/zuno-orchestrator-contracts
npm run test --workspace=@z-sanctuary/zuno-orchestrator-contracts
npm run build --workspace=@z-sanctuary/zuno-orchestrator-contracts
npm run z:ai-builder:refresh
npm run z:car2
npm run dashboard:registry-verify
npm run zuno:coverage && npm run zuno:phase3-plan
```

## 8. Rollback plan

Delete `packages/zuno-orchestrator-contracts/` if rolling back 1A; delete `docs/orchestration/` orchestration markdown files and this report pair; revert any INDEX or context links; run `npm install` at hub root.
