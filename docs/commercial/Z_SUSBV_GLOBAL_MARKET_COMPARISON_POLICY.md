# Z-SUSBV — Global market comparison registry policy

**File:** `data/z_susbv_global_market_comparison_registry.json`
**Schema:** `z_susbv_global_market_comparison_registry_v1`

## Purpose

Hold **structured placeholders** for future **job-to-be-done** comparison groups: segment, evidence posture, freshness, and **source policy** — without storing **invented prices** or scraped competitor dollar tables in the hub.

## Field intent

| Field | Meaning |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `comparison_group` | Stable id for a comparison bucket. |
| `job_to_be_done` | Plain-language JTBD (no uncited market share claims). |
| `target_segment` | Who the comparison serves. |
| `required_comp_count` | How many comps are expected **before** claiming parity (may be `0` for dormant rows). |
| `evidence_status` | e.g. `not_started`, `pending`, `sufficient` (metadata only). |
| `freshness` | e.g. `unknown`, `stale` — human refresh signals. |
| `notes` | Operator notes — still no dollar amounts unless sourced elsewhere under charter. |
| `source_policy` | How evidence may be gathered later (charter, quarterly review, human-approved research). |

## Hard rule

**No invented dollar amounts** in this JSON. The overseer rejects JSON text that matches forbidden invented-amount key patterns (see `scripts/z_susbv_overseer_validate.mjs`).

## Relation to Z-Spiral Scout

When a **governed** research lane exists, **Z-Spiral Scout** (future) may populate evidence **outside** this placeholder file first — then human review merges summaries **without** silent price propagation.

## Related

- [Z_SUSBV_BENCHMARK_OVERSEER.md](Z_SUSBV_BENCHMARK_OVERSEER.md)
- [QUARTERLY-MARKET-AND-FACTS-REVIEW.md](../QUARTERLY-MARKET-AND-FACTS-REVIEW.md)
