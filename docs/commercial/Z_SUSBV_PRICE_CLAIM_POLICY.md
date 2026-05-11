# Z-SUSBV — public price and claim policy

## No invented dollar amounts

- **Do not** invent list prices, discounts, ARPU, or “typical customer spend” in hub JSON or docs.
- Dollar figures belong in **human-reviewed** sources (signed worksheets, chartered comps, finance-approved sheets) and must cite **URL, date, or internal receipt ID**.

## Public copy boundaries

| Allowed (with evidence) | Not allowed without proof + human review |
| --------------------------------------- | ----------------------------------------------------- |
| “Planned tier names (illustrative)” | “Best,” “#1,” “guaranteed ROI” |
| “Local-first; no billing in this build” | “Certified” (unless a named cert + scope is attached) |
| “Reference-only in hub catalog” | Implied live paid access from shadow previews |

When writing `claim_notes` in `z_susbv_service_price_validation.json`, **avoid spelling out** forbidden marketing words even in negatives — automated scanners may still flag them; describe the constraint in neutral language instead.

## Entitlement and shadow

- **Shadow previews** (`z_shadow_preview_policy.json`) are read-only references — never implied billing or entitlement.
- **Capability rows** in the entitlement catalog do **not** grant billing.

## DRP / DOP and ZAG

- **14 DRP / 14 DOP** sensitive themes (children, crisis, health, memory, payments, partner surfaces) require **AMK/human** gate before public commercial claims.
- **ZAG:** Z-SUSBV validation is **L0/L1-style evidence** (read JSON, emit reports). No L5 execution (billing, deploy, live bridges).

## Quarterly review

- Tie public claim changes to [../QUARTERLY-MARKET-AND-FACTS-REVIEW.md](../QUARTERLY-MARKET-AND-FACTS-REVIEW.md).

## Related

- [Z_SUSBV_SANCTUARY_SELF_BENCHMARKS_VALIDATION.md](./Z_SUSBV_SANCTUARY_SELF_BENCHMARKS_VALIDATION.md)
