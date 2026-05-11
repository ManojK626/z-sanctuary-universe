# Cursor prompts vault — slot 06

**Purpose:** Reusable high-level prompts for operators and Cursor agents. **Not** automatic execution.

## Z-FUTURE-1 — Civilizational Foresight Doctrine (reference prompt)

Use when extending **foresight** docs or registry **only** (no runtime unless a new phase charter says so).

```text
Implement or extend Phase Z-FUTURE-1 — Civilizational Foresight Doctrine.

Scope: docs + metadata only. No runtime prediction engine. No external APIs or provider calls.
No autonomous decisions. No deployment, billing, or entitlement changes.

Goal: Keep Z-PPPFA (Pre-Pattern Present-to-Future Analyzer), Z-MSOAI (Multi-Supervisor Overseer AI),
and Z-FUMCR (Future Upcoming Migration Civilization Roadmaps) aligned with Z-UIL, ZSX, LAWGRID,
SSWS, traffic signals, Zuno/CAR², and 14 DRP — without claiming certainty about the future.

Wording: scenarios, signals, roadmaps, risk review, human decision required.
Avoid: prophecy, oracle, guaranteed prediction, inevitability, automatic civilization steering.

Safety law (verbatim when needed):
Past pattern ≠ future certainty. Scenario ≠ prophecy. Signal ≠ instruction. Roadmap ≠ permission.
AI overseer ≠ human authority. GREEN ≠ launch. BLUE requires AMK / human review. RED blocks movement.

Canonical paths:
- docs/foresight/Z_PPPFA_PRESENT_TO_FUTURE_ANALYZER.md
- docs/foresight/Z_MSOAI_MULTI_SUPERVISOR_OVERSEER.md
- docs/foresight/Z_FUMCR_CIVILIZATION_ROADMAPS.md
- docs/foresight/Z_CIVILIZATION_FORESIGHT_SAFETY_LAW.md
- data/z_civilization_foresight_registry.json
- docs/foresight/PHASE_Z_FUTURE_1_GREEN_RECEIPT.md

Acceptance: JSON parses; npm run verify:md passes; no forbidden runtime scope.
```

## Related hub docs

- [docs/Z_ECOSYSTEM_COHERENCE_ZUNO_SEED.md](../docs/Z_ECOSYSTEM_COHERENCE_ZUNO_SEED.md)
- [docs/AI_BUILDER_CONTEXT.md](../docs/AI_BUILDER_CONTEXT.md)

## OMNAI core engine simulation (reference prompt)

Use when aligning **reports, dashboard indicator overlay, or docs** for OMNAI core simulation — **not** for live orchestration.

```text
Align OMNAI core simulation reporting only.

Allowed: docs/OMNAI_CORE_ENGINE_SIMULATION.md, PHASE_OMNAI_CORE_ENGINE_MATRIX_GREEN_RECEIPT.md,
INDEX / AI_BUILDER_CONTEXT pointers, amk_project_indicators row z_omnai_core_engine_simulation,
overlay fetch in amk-project-indicators-readonly.js, z-omnai-core-readonly.js panel copy.

Verify: npm run omnai:core:all; npm run verify:md; npm run z:traffic; npm run dashboard:registry-verify.

Forbidden: runtime execution authority, deploy, Cloudflare, providers/APIs, billing, secrets,
autonomous actions, new executing agents.

Signals: GREEN/YELLOW/RED are advisory. YELLOW = inspect. RED = hold. GREEN ≠ launch.
Receipts: data/reports/z_omnai_core_engine_matrix_summary.*, z_omnai_core_engine_indicator_overlay.json.
Optional full matrix: npm run omnai:core:matrix:full.
```
