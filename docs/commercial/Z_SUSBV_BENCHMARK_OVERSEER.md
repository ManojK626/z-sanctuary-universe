# Z-SUSBV-O — Z-Benchmark Overseer (Sanctuary Universe Self Benchmark Validation Overseer)

**Purpose:** One **hub-side** validation layer so every Z-Sanctuary project can ship a **small benchmark capsule** while the **central overseer** checks capsules against the hub benchmark registry, evidence metadata, entitlement posture, and module map — **without** duplicating pricing engines or letting shadow copies become alternate truth.

**Friendly name:** Z-Benchmark Overseer.

## What this is not

- Not live web research, scraping, or third-party API calls.
- Not automatic price changes, billing, SKU writes, or public copy rewrites.
- Not certification: **readiness-aligned** with governance themes (for example ISO/IEC 42001:2023, NIST AI RMF, WCAG 2.2) is **not** the same as an audited certificate unless you separately complete an audit.
- Not entitlement enforcement: the overseer **advises**; **AMK/human** decides pricing, launch, and access.

## Architecture (Phase ZSUSBV-O1)

| Layer | Location | Role |
| ------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Project benchmark capsule** | e.g. `z-questra/data/z_project_benchmark_capsule.json` | Declares `project_id`, owners, bridge/memory posture, and `services[]` rows that point at hub `service_id` values. |
| **Hub project index** | `data/z_susbv_project_benchmark_index.json` | Lists projects and optional/required capsule paths. |
| **Hub module map** | `data/z_susbv_module_to_service_map.json` | Maps `module_id` → `service_id` for drift control. |
| **Benchmark registry** | `data/z_susbv_benchmark_registry.json` | Canonical service definitions (existing Z-SUSBV-1). |
| **Price / evidence validation** | `data/z_susbv_service_price_validation.json` | Evidence metadata (existing Z-SUSBV-1). |
| **Global comparison registry** | `data/z_susbv_global_market_comparison_registry.json` | Placeholder **job-to-be-done** groups — **no invented dollar amounts**. |
| **Overseer policy** | `data/z_susbv_overseer_policy.json` | Names, golden law, standards-alignment note, minibot roster. |
| **Validator** | `scripts/z_susbv_overseer_validate.mjs` | Read-only checks; writes `data/reports/z_susbv_overseer_report.{json,md}`. |

## Z-Spiral Scout (internal role name)

**“Spiral AI”** is not a single global product name; unrelated products use “Spiral” branding. In Z-Sanctuary, **Z-Spiral Scout** is an **internal** role for a **future**, **chartered** evidence-collection minibot — not an active web scraper in Phase O1.

## Mini-bot family (advisory)

See `data/z_susbv_overseer_policy.json` → `minibot_family`. Bots **advise**; they do not deploy, price, or merge.

## Communication flow (metadata)

```text
Project capsule → Hub benchmark index → Overseer validator → Reports
→ Z-Traffic / AMK notifications / AMK-MAP (read-only surfaces) → Human decision
```

## Run

From hub root:

```bash
npm run z:susbv
npm run z:susbv:overseer
```

## Related docs

- [Z_SUSBV_SANCTUARY_SELF_BENCHMARKS_VALIDATION.md](Z_SUSBV_SANCTUARY_SELF_BENCHMARKS_VALIDATION.md)
- [Z_SUSBV_PROJECT_CAPSULE_POLICY.md](Z_SUSBV_PROJECT_CAPSULE_POLICY.md)
- [Z_SUSBV_GLOBAL_MARKET_COMPARISON_POLICY.md](Z_SUSBV_GLOBAL_MARKET_COMPARISON_POLICY.md)
- [PHASE_ZSUSBV_O1_GREEN_RECEIPT.md](PHASE_ZSUSBV_O1_GREEN_RECEIPT.md)

## Standards references (orientation)

- [ISO/IEC 42001:2023](https://www.iso.org/standard/42001) — AI management system standard (governance themes).
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework) — risk framing for AI systems.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — accessibility readiness themes for web surfaces.
