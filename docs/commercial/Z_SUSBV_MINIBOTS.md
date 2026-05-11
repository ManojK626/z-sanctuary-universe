# Z-SUSBV MiniBot family (doctrine)

**Phase 1:** roles are **documented** here; automation is limited to **`z_susbv_validate.mjs`** read-only checks. No autonomous commercial MiniBots in production.

| MiniBot | Job |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Benchmark Scout Bot** | Collect candidate comparables — **manual or chartered research only** in Phase 1. |
| **Cost Floor Bot** | Check that hosting, support, moderation, storage, legal/compliance **assumptions** are documented before price talk. |
| **Entitlement Bot** | Confirm **capability ≠ access ≠ billing** against `z_service_entitlement_catalog.json`. |
| **Claims Validator Bot** | Flag unsafe wording (“best,” “guaranteed,” “certified”) without proof paths. |
| **Quarterly Ritual Bot** | Nudge when quarterly review is due (metadata `review_cadence` + human calendar). |
| **Segment Bot** | Keep consumer, school, org, enterprise, partner, donation, emergency paths **separate** in registry rows. |
| **Pricing Drift Bot** | Find conflicting `public_price_allowed` vs evidence rows across JSON (Phase 1: validator flags). |
| **DRP Commercial Bot** | Cross-check sensitive segments (children, crisis, health, payments) for **BLUE** human gates. |
| **Zuno Verdict Bot** | Future: map signals to `READY` / `NEEDS_COMPS` / `NEEDS_COST_MODEL` / `HUMAN_DECISION` / `BLOCKED` — Phase 1 uses **GREEN/YELLOW/RED/BLUE** in the validation report instead. |

## Alignment with existing systems

| Existing | Role in Z-SUSBV |
| ----------------------------------- | ------------------------------------------------------------- |
| Z-Traffic Minibots | Traffic **RED/BLUE** blocks treating commercial lanes as safe |
| ZAG (`z_autonomy_task_policy.json`) | Benchmark automation stays **read-only** unless gated |
| ZSX entitlement catalog | Prevents capability/access/price confusion |
| NAV catalog | Services and bridge status are **metadata** |
| AI Builder Pack | Cursor reads doctrine before edits |

## Related

- [Z_SUSBV_SANCTUARY_SELF_BENCHMARKS_VALIDATION.md](./Z_SUSBV_SANCTUARY_SELF_BENCHMARKS_VALIDATION.md)
