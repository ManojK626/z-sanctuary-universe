# Phase ZSUSBV-1 — green receipt (benchmark validation doctrine)

## Scope delivered

- Doctrine stubs: `docs/pricing-and-benchmarks.md`, `docs/QUARTERLY-MARKET-AND-FACTS-REVIEW.md`, `docs/COMMERCIAL-READINESS.md`
- Metadata: `data/z_susbv_benchmark_registry.json`, `data/z_susbv_service_price_validation.json`
- Read-only validator: `scripts/z_susbv_validate.mjs` → `data/reports/z_susbv_validation_report.{json,md}`
- Commercial doc pack: `docs/commercial/Z_SUSBV_*.md` (this file + main + minibots + price claim policy)
- NPM: `npm run z:susbv`

## Explicitly not in Phase 1

- Live web research, external APIs, scraping
- Billing/SKU/payment code paths
- Entitlement **enforcement** or runtime bridges
- Auto-rewrite of public marketing copy
- Deployment or provider secrets

## Manual checklist (operator)

1. Run `npm run z:susbv` and open `data/reports/z_susbv_validation_report.md`.
2. Sample hub data may show **BLUE** (school / human-gate row) or **YELLOW** (comps gap) by design — that is honest posture, not a broken validator. If signal is **RED**, stop commercial lane work until evidence or wording fixes land.
3. Run `npm run z:traffic` — required minibots should not be **RED** before widening commercial scope.
4. Run `npm run z:car2` after large doc/registry churn.
5. Confirm no dollar amounts were invented in new JSON (metadata only).

## Commands run (acceptance)

```bash
npm run z:susbv
npm run verify:md
npm run z:traffic
npm run z:car2
```

## Rollback

1. Remove `scripts/z_susbv_validate.mjs` and `z:susbv` from `package.json`.
2. Delete `data/z_susbv_benchmark_registry.json`, `data/z_susbv_service_price_validation.json`, and `data/reports/z_susbv_validation_report.*`.
3. Remove `docs/commercial/Z_SUSBV_*` and `docs/commercial/PHASE_ZSUSBV_1_GREEN_RECEIPT.md` if reverting the whole phase.
4. Remove doctrine stubs under `docs/pricing-and-benchmarks.md`, `docs/QUARTERLY-*`, `docs/COMMERCIAL-READINESS.md` only if no other doc depends on them (check links first).
