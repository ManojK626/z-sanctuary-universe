# Z-SUSBV — Sanctuary Universe Self Benchmarks Validation

**Purpose:** Turn pricing posture, service value, market comparisons, cost-to-serve, and commercial readiness into an **evidence-first validation engine** — not guesses, hype, or invented earnings claims.

## Questions Z-SUSBV helps answer

- What are we selling (as **metadata**, not live billing)?
- Who is it for (segment / posture)?
- What comparable services exist (**sources required** before public claims)?
- What is our cost to serve (**floor** documented before price)?
- What trust and compliance gates apply?
- What price range is **justified by evidence** (human review)?
- What claims are **safe to publish**?
- What must be **reviewed quarterly**?

## Core law

- **No benchmark without source.**
- **No price without cost floor.**
- **No claim without evidence.**
- **No auto-rewrite of public copy.**
- **No billing/SKU change without AMK/human approval.**

## Phase ZSUSBV-1 (this slice)

**Docs + JSON metadata + read-only validator only.**

- No live web research, external APIs, scraping, billing logic, payments, entitlement **enforcement**, public price edits, copy auto-rewrites, deployment, or autonomous commercial decisions.

## Command

```bash
npm run z:susbv
```

Outputs:

- `data/reports/z_susbv_validation_report.json`
- `data/reports/z_susbv_validation_report.md`

## Inputs (respect these)

| Input | Role |
| ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| [../pricing-and-benchmarks.md](../pricing-and-benchmarks.md) | Price evidence doctrine |
| [../QUARTERLY-MARKET-AND-FACTS-REVIEW.md](../QUARTERLY-MARKET-AND-FACTS-REVIEW.md) | Quarterly human ritual |
| [../COMMERCIAL-READINESS.md](../COMMERCIAL-READINESS.md) | Go-live checklist |
| `data/z_service_entitlement_catalog.json` | Capability ≠ access ≠ billing |
| `data/z_cross_project_capability_index.json` | Cross-project metadata posture |
| `data/z_shadow_preview_policy.json` | Shadow preview ≠ paid access |
| [../cross-project/Z_SERVICE_ENTITLEMENT_AND_PRICING_POLICY.md](../cross-project/Z_SERVICE_ENTITLEMENT_AND_PRICING_POLICY.md) | Entitlement + pricing policy |
| `data/z_autonomy_task_policy.json` | ZAG autonomy limits (L0–L2 automatic evidence; L5 charter) |
| [../Z_TRAFFIC_MINIBOTS.md](../Z_TRAFFIC_MINIBOTS.md) | GREEN/YELLOW/RED/BLUE before widening commercial lanes |

## Signals

| Signal | Meaning |
| ------ | ------------------------------------------------------------------------------------------------- |
| GREEN | Evidence, comps, cost floor, and readiness sufficient for **human** pricing review |
| YELLOW | Some evidence exists; more comps/costs or registry hygiene needed |
| RED | Unsafe claim, missing core evidence, or conflicting pricing posture in metadata |
| BLUE | AMK/human decision: pricing, entitlement, bundle, partner, charity, school, legal, health, crisis |

## Related docs

- [Z_SUSBV_MINIBOTS.md](./Z_SUSBV_MINIBOTS.md)
- [Z_SUSBV_PRICE_CLAIM_POLICY.md](./Z_SUSBV_PRICE_CLAIM_POLICY.md)
- [PHASE_ZSUSBV_1_GREEN_RECEIPT.md](./PHASE_ZSUSBV_1_GREEN_RECEIPT.md)
- [Z_SUSBV_BENCHMARK_OVERSEER.md](./Z_SUSBV_BENCHMARK_OVERSEER.md) — **ZSUSBV-O1** hub overseer + project capsules (read-only validator)
- [Z_SUSBV_PROJECT_CAPSULE_POLICY.md](./Z_SUSBV_PROJECT_CAPSULE_POLICY.md)
- [PHASE_ZSUSBV_O1_GREEN_RECEIPT.md](./PHASE_ZSUSBV_O1_GREEN_RECEIPT.md)

## Future ladder (not in Phase 1)

| Phase | Adds | Risk |
| --------- | ------------------------------------------------------------------------------ | ----------------- |
| ZSUSBV-O1 | Hub Benchmark Overseer + per-project capsules + global comparison placeholders | Low |
| ZSUSBV-2 | Benchmark spreadsheet/template | Low |
| ZSUSBV-3 | Quarterly report pack from filled comps | Medium |
| ZSUSBV-4 | Human-approved research assistant | Medium/High |
| ZSUSBV-5 | Provider/web research adapter | High, chartered |
| ZSUSBV-6 | Pricing dashboard visibility | Medium |
| ZSUSBV-7 | Commercial decision workflow | High, human-gated |

## Rollback

Remove `data/z_susbv_*.json`, `scripts/z_susbv_validate.mjs`, `npm` script `z:susbv`, this doc family, and validation reports.
