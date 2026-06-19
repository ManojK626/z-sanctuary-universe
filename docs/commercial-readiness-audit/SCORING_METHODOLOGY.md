# Commercial Readiness — Scoring Methodology

**Posture:** Non-financial ranking · evidence-weighted  
**Date:** 2026-06-11

## Scales (1–5)

Higher score = **more favorable for near-term commercial exploration** (except where noted).

| Factor | 1 | 3 | 5 |
| ------ | - | - | - |
| **Technical Readiness** | Idea / no build | Partial prototype | Runnable product + tests/verify |
| **Revenue Potential** | Unclear or symbolic only | Plausible niche revenue | Clear recurring or transaction model |
| **Time To Market** | 12+ months of gates | 6–12 months | 3–6 months with scoped MVP |
| **Compliance Complexity** | High (health, gambling, children) | Medium (consumer SaaS) | Low (B2B tools, edu with clear boundaries) |
| **Support Burden** | High touch / 24×7 risk | Moderate | Mostly self-serve / async |
| **Cost To Launch** | High infra + legal + ops | Moderate | Low (static, local-first, existing build) |

## Composite score

```text
Composite = average of six factors (unweighted)
```

Optional weighting for **Turtle-safe income** (documented in audit, not automated):

| Factor | Weight | Rationale |
| ------ | ------ | --------- |
| Compliance Complexity | 1.5× | Protects Anne/JB from accidental liability |
| Technical Readiness | 1.25× | Income needs something shippable |
| Revenue Potential | 1.0× | Important but not at cost of gates |
| Time To Market | 1.0× | |
| Support Burden | 1.0× | |
| Cost To Launch | 1.0× | |

Weighted score shown in [COMMERCIAL_READINESS_AUDIT.md](COMMERCIAL_READINESS_AUDIT.md) as **Turtle-weighted**.

## Evidence rules

1. Cite hub files — registry, build gate, monster map, strategist cards (if on branch)
2. Mark **hypothesis** where revenue model is inferred
3. **BUILD NOW / PREPARE ONLY / WAIT** from build gate overrides optimism
4. Payment/commerce = **WAIT** until explicit charter — caps Revenue Activation scoring

## What this does not do

- Project EUR/MUR income
- Choose Mauritius vs Ireland entity
- Approve Stripe, VAT, or contracts

See [LEGAL_TAX_BANKING_BOUNDARIES.md](../z-strategist-ai/LEGAL_TAX_BANKING_BOUNDARIES.md) (if strategist pack present on branch).
