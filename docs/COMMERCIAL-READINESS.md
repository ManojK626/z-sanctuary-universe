# Commercial readiness — go-live checklist (hub)

**Role:** Checklist before any **live** commercial lane (billing, public paid tiers, partner revenue share). **Z-SUSBV** flags gaps; **AMK / human** signs off.

## Minimum gates (non-exhaustive)

1. **Entitlement** — capability ≠ access ≠ billing (see `data/z_service_entitlement_catalog.json`).
2. **Benchmarks** — comps and sources documented per `data/z_susbv_benchmark_registry.json`.
3. **Cost floor** — documented assumptions; no price below defensible floor without explicit risk acceptance.
4. **Claims** — no “best / guaranteed / certified” without cited evidence (see [commercial/Z_SUSBV_PRICE_CLAIM_POLICY.md](commercial/Z_SUSBV_PRICE_CLAIM_POLICY.md)).
5. **DRP / DOP** — children, crisis, health, memory, payments reviewed where applicable.
6. **Z-Traffic** — `npm run z:traffic` not RED for required minibots before widening commercial scope.

## Related

- [commercial/Z_SUSBV_SANCTUARY_SELF_BENCHMARKS_VALIDATION.md](commercial/Z_SUSBV_SANCTUARY_SELF_BENCHMARKS_VALIDATION.md)
- [Z_TRAFFIC_MINIBOTS.md](Z_TRAFFIC_MINIBOTS.md)
