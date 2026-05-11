# Phase Z-ULTRA-MAGE-1 green receipt

## Delivered

- `docs/Z_ULTRA_MAGE_FORMULA_CODEX.md` — universal formula governance doctrine.
- `data/z_ultra_mage_formula_registry.json` — registry (`mode: formula_governance_only`).
- `data/examples/z_ultra_mage_formula_samples.json` — advisory samples + optional RED fixture.
- `scripts/z_ultra_mage_formula_check.mjs` — read-only validator; writes reports; updates AMK indicator **signal**.
- Reports under `data/reports/z_ultra_mage_formula_report.{json,md}` from `npm run z:ultra:mage`.

## Acceptance

- `npm run verify:md` recovered before this codex landed (CMD Center / IDE admin fences and tables aligned with hub markdownlint).

- Default `npm run z:ultra:mage` exits **0** for **GREEN**, **YELLOW**, or **BLUE** overall signal.

- Exit **1** only on **RED** (registry breach or deliberate fixture asserting forbidden engagements).

## Fixture (optional)

PowerShell:

```powershell
$env:Z_ULTRA_MAGE_INCLUDE_FIXTURES='1'
npm run z:ultra:mage
```

Expect **RED**, exit **1**.

## Rollback

1. Delete the codex docs, registry, samples, validator, and generated reports listed above.

2. Remove `z:ultra:mage` from `package.json`.

3. Remove indicator id `z_ultra_mage_formula_codex` from `dashboard/data/amk_project_indicators.json`.

4. Revert overlay fetch and `z_ultra_mage` mapping in `dashboard/scripts/amk-project-indicators-readonly.js`.

5. Revert hub links from `docs/INDEX.md`, `docs/AI_BUILDER_CONTEXT.md`, cross-linked governance docs, and `data/z_autonomy_task_policy.json`.
