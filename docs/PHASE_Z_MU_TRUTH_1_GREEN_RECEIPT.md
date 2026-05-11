# Phase Z-MU-TRUTH-1 green receipt

## Delivered

- `docs/Z_MAURITIANS_UNITE_CIVIC_TRUTH_ENGINE.md` — civic truth engine doctrine.
- `docs/Z_MAURITIANS_UNITE_SAFETY_AND_PEACE_POLICY.md` — safety and peace policy.
- `data/z_mu_claim_ledger.json` — seed claim ledger (metadata only).
- `data/z_mu_source_policy.json` — source ranks, required fields, forbidden escalation phrases.
- `data/examples/z_mu_claim_samples.json` — sample rows + optional RED fixture.
- `scripts/z_mu_truth_check.mjs` — validator; writes `data/reports/z_mu_truth_report.{json,md}`; syncs indicator **signal**.
- Hub wiring: `package.json` script `z:mu:truth`, `docs/INDEX.md`, `docs/AI_BUILDER_CONTEXT.md`, `data/z_autonomy_task_policy.json`, AMK indicator `z_mu_truth_civic_engine`, dashboard overlay hook, short cross-links in XBUS + Ultra MAGE docs.

## Acceptance

- No protest coordination, scraping, payments, provider calls, deploy, live APIs, harassment workflows, or illegal-leak guidance ships in this phase.
- Validator exits **0** for **GREEN / YELLOW / BLUE** overall; **1** for **RED** (or set `Z_MU_TRUTH_INCLUDE_RED_FIXTURE=1` to exercise fixture, then rerun without it).
- `npm run verify:md` must pass after doc edits (run before merge).

## Rollback

1. Remove the files above and generated reports.
2. Remove `z:mu:truth` from `package.json`.
3. Remove indicator `z_mu_truth_civic_engine` and dashboard overlay `z_mu_truth` fetch/apply block.
4. Revert INDEX, AI_BUILDER_CONTEXT, autonomy policy, and cross-link lines in XBUS / Ultra MAGE docs.
