# Phase OMNAI core engine matrix — green receipt (controlled pass)

**Phase ID:** OMNAI-CORE-ENGINE-MATRIX-1 (documentation + report alignment; no new runtime authority).

## Scope delivered

1. **Report generation** — `npm run omnai:core:all` produces:
   - `data/reports/z_omnai_core_engine_matrix_summary.json` and `.md` (slim default)
   - `data/reports/z_omnai_core_engine_indicator_overlay.json` (AMK overlay source)
   - Tick, chain, manifest, combo summary per simulate script design
2. **Dashboard** — Indicator row `z_omnai_core_engine_simulation` with `dynamic_overlay: omnai_core_overlay`; `amk-project-indicators-readonly.js` fetches overlay JSON and applies `signal` when present.
3. **Stricter rollup** — `core/omnai/omnai_kernel.js` advisory posture: RED on veto / overseer RED; YELLOW on pathway stress, ANT failures, GMB clone advisory, blocked lanes; GREEN only when all checks pass under simulation rules.
4. **Docs** — This receipt + [OMNAI_CORE_ENGINE_SIMULATION.md](OMNAI_CORE_ENGINE_SIMULATION.md).

## Explicit non-goals (sacred boundary)

- No deployment, Cloudflare edits, provider/API calls, billing, secrets ingestion, or autonomous execution loops.
- No new AI agents with execution power; scripts are **validators and writers** only.

## Acceptance checklist

- [x] `npm run omnai:core:all` completes exit 0
- [x] Slim matrix files exist (`matrix_summary`)
- [x] Overlay JSON exists (`indicator_overlay`)
- [x] `npm run verify:md` passes (after `node scripts/z_markdown_table_compact.mjs --dir=docs` where MD060 required)
- [x] `npm run dashboard:registry-verify` green
- [x] AMK indicators JSON validates in dashboard registry verify

## Rollback (ordered)

1. Revert **`core/omnai/omnai_kernel.js`** `computePlanningPosture` / `synthesizeNote` to prior rollup if you need looser advisory semantics.
2. Remove indicator row **`z_omnai_core_engine_simulation`** from `dashboard/data/amk_project_indicators.json` and the **`omnai_core_overlay`** branch + fetch from `dashboard/scripts/amk-project-indicators-readonly.js`.
3. Remove or revert **`dashboard/scripts/z-omnai-core-readonly.js`** and the mount + script tag in **`dashboard/Html/amk-goku-main-control.html`** if the panel should disappear.
4. Revert **`scripts/z_omnai_core_engine_simulate.mjs`** / **`package.json`** `omnai:core:*` scripts if the whole harness is removed.
5. Delete generated **`data/reports/z_omnai_core_engine_*`** files if you want a clean tree (optional).
6. Revert **`docs/OMNAI_CORE_ENGINE_SIMULATION.md`**, this receipt, **INDEX**, **AI_BUILDER_CONTEXT**, **Zuno_Memory_Vault/06_CURSOR_PROMPTS.md** pointers.

## Operator note

After rollback or doc edits, re-run `npm run verify:md` and `npm run dashboard:registry-verify`.
