# OMNAI core engine simulation (hub)

**Mode:** Report-only, deterministic. **Not** runtime execution authority, not deploy, not providers, not billing, not secrets, not autonomous fleets.

This layer implements blueprint **§02–§09** vocabulary as **pure Node modules** under `core/omnai/` plus scripts that write **JSON and Markdown receipts** under `data/reports/`.

## Signal semantics (advisory)

| Signal | Meaning for operators |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GREEN** | Simulation rollups look steady under the current scenario harness. **Does not** authorize launch, deploy, merge, or any external action. |
| **YELLOW** | Inspect: pathway stress, GMB clone advisory, failed non-veto ANT checks, blocked-but-policy entity lane, or high RED share in matrix exploration. |
| **RED** | Hold: overseer **RED_REVIEW** posture or **veto_recommended** (e.g. secrets pattern, CI not green, recursion guard breach in simulation inputs). |

**Indicator overlay** (`data/reports/z_omnai_core_engine_indicator_overlay.json`) merges tick, chain final, manifest worst-case, and matrix RED-fraction heuristics. It drives the AMK indicator row **`z_omnai_core_engine_simulation`** when the dashboard fetches overlays (`dynamic_overlay`: **`omnai_core_overlay`**). **Indicator ≠ permission.**

## Default matrix (slim)

- **Primary artefact:** `data/reports/z_omnai_core_engine_matrix_summary.json` (+ `.md`)
- Contains **histograms** and a **small slim sample** of runs (first 64 combinations) so the file stays reviewable in git and IDEs.

## Optional full matrix (manual)

- **Command:** `npm run omnai:core:matrix:full` (optionally `node scripts/z_omnai_core_engine_simulate.mjs --matrix-full --max 4800`)
- **Output:** `data/reports/z_omnai_core_engine_matrix_report.full.json` — full Cartesian payload; **large**; use only when you need every run embedded.

## Other receipts

| Artefact | Role |
| --------------------------------------------------------- | ---------------------------------- |
| `data/reports/z_omnai_core_engine_tick_report.{json,md}` | Latest single-scenario tick |
| `data/reports/z_omnai_core_engine_chain_report.{json,md}` | Merged multi-step chain |
| `data/reports/z_omnai_core_engine_manifest_report.json` | Fixed scenario batch from manifest |
| `data/reports/z_omnai_core_engine_combo_summary.json` | Written when using `--all` |

## npm scripts

| Script | Effect |
| -------------------------------- | ----------------------------------------------------------------------------- |
| `npm run omnai:core:simulate` | Single tick + refresh overlay |
| `npm run omnai:core:matrix` | Slim matrix summary + overlay |
| `npm run omnai:core:matrix:full` | Slim summary **and** `.full.json` |
| `npm run omnai:core:manifest` | Manifest batch only |
| `npm run omnai:core:chain` | Chain demo only |
| `npm run omnai:core:all` | Tick + matrix (default cap 4800) + manifest + chain + combo summary + overlay |

## Dashboard

- **AMK Main Control** (`dashboard/Html/amk-goku-main-control.html`): panel script `dashboard/scripts/z-omnai-core-readonly.js` loads overlay + matrix summary links (read-only fetch).
- **Indicators:** `dashboard/data/amk_project_indicators.json` row **`z_omnai_core_engine_simulation`**; overlay wired in `dashboard/scripts/amk-project-indicators-readonly.js`.

## Creative OMNAI workbench (separate phase)

Creative pipeline and letter gate remain under [creative/Z_OMNAI_BLUEPRINT_CAPABILITY_WORKBENCH.md](creative/Z_OMNAI_BLUEPRINT_CAPABILITY_WORKBENCH.md) (`npm run z:omnai`, `z:omnai:build-plan`, etc.). Core engine simulation is **orthogonal**: math/spine/ant/pathway/entity **governance simulation**, not media generation.

## Verification (typical)

```bash
npm run omnai:core:all
npm run verify:md
npm run z:traffic
npm run dashboard:registry-verify
```

Seal and rollback: [PHASE_OMNAI_CORE_ENGINE_MATRIX_GREEN_RECEIPT.md](PHASE_OMNAI_CORE_ENGINE_MATRIX_GREEN_RECEIPT.md).
