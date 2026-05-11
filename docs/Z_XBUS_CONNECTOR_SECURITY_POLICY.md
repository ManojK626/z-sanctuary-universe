# Z-XBUS Connector security policy (Phase 1)

## Scope

Doctrine for **connector entries** documented in **Z-XBUS-GATE-1**. **Phase 1** allows **registration, classification, and reports only**. Operational security for future pilots lives in charters and separate vault/policy docs.

## Forbidden in Phase 1 (machine-enforced posture)

Configured in `data/z_xbus_connector_policy.json`:

- No **live** external connector switching on from hub automation.
- No **secret storage** in registry artifacts (tokens, keys, raw credentials).
- No **customer data** payloads in connector JSON files.
- No **payment activation** from registry scripts.
- No **provider calls** initiated by gate scripts.
- No **webhook execution** from gate scripts.
- No **external write actions** scripted as Phase 1 deliverables.

**Mock pathways** remain allowed as **documents and flags only**.

## Boundary classes

### Data boundary

Minimum-necessary scopes must be documented before any pilot. Expansion requires **BLUE** posture and explicit AMK/charter.

### Entitlement boundary

Commercial or licensed surfaces (examples: **Z-SUSBV**, **Z-OMNAI**, **Franed**) must remain **explicit rows** — no silent entitlement bleed between connectors.

### Secret boundary

Secret **policy references** docs and vault discipline; **never** embedded secrets in connector registry files.

### Child / classroom boundary

Minor-facing connectors default to **BLUE** until safeguarding + charter review completes.

## AMK-gated lanes (conceptual checklist)

Hard gates before live external work:

- Secrets / KMS / credential handling
- Billing, SKUs, entitlements mutations
- Provider or model API calls touching real accounts
- Public API exposure or customer-visible SLAs
- Production deployment coupling
- Enterprise contract scope
- Child-data flows
- Cross-project entitlements vs another repo (including **XL2** without charter)

## Reporting

Evidence from:

```bash
npm run z:xbus:gate
```

Treat **BLUE** as “planning authorised; execution not authorised until AMK opens lane.”

## Related

- Main gate doctrine: [Z_XBUS_EXTERNAL_CONNECTOR_GATE.md](Z_XBUS_EXTERNAL_CONNECTOR_GATE.md)
- Receipt: [PHASE_Z_XBUS_GATE_1_GREEN_RECEIPT.md](PHASE_Z_XBUS_GATE_1_GREEN_RECEIPT.md)
