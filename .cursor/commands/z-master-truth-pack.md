# Z-Sanctuary Master Truth Pack

Cursor, build from the **Z-Sanctuary Master Truth Pack**.

Read the current **Zuno technology snapshot**, **AI Builder context**, and **Monster Project Master Map** (plus `data/zuno_state_snapshot.json` and `data/z_sanctuary_monster_project_registry.json`).

Your task is to **extend the system without breaking health, gates, or doctrine**.

## First

Create or update `docs/Z_SANCTUARY_MONSTER_PROJECT_MASTER_MAP.md` with all known modules, cores, engines, rings, formulas, ethics layers, and project links — keeping symbolic items clearly labeled.

Keep `data/z_sanctuary_monster_project_registry.json` aligned: **`_meta.required_entry_ids`** must list every mandatory Monster name **`id`**, and **`entries`** must cover them.

## Then

Add or adjust **read-only validation** only as needed (`scripts/z_monster_project_registry_verify.mjs`); do not add runtime bridges, payments, external APIs, biometric capture, background autonomy, or deployment code unless explicitly chartered.

## Do not

- New bridges, payments, providers, background agents, biometric capture, or live autonomy unless explicitly chartered.
- Skip catalog/registry before implementation.

## Verification (green receipt)

```bash
npm run z:monster:registry-verify
npm run zuno:snapshot
npm run zuno:snapshot:truth-align
npm run zuno:awareness-score
```

(`zuno:awareness-score` runs Z-Traffic internally for a fresh chief signal; use `npm run z:traffic` alone when you only want the traffic tower receipt.)

Confirm `data/reports/z_monster_project_registry_verify.json` has `"pass": true`, review `data/reports/zuno_truth_layer_alignment.json` for narrative drift, and `data/reports/zuno_awareness_score.json` for the **A3** band (YELLOW narrative gaps are expected until the MD reflects the full Monster roster).

If **A3 is RED**, fix **Z-Traffic** first, then re-run snapshot + A2 + A3; use **`npm run zuno:a3r:receipt`** for the **A3-R** gate receipt — **do not open A4** until recovery and dual-GREEN policy in [docs/ZUNO_A3R_AWARENESS_RECOVERY_RECEIPT.md](../../docs/ZUNO_A3R_AWARENESS_RECOVERY_RECEIPT.md) allow it.
