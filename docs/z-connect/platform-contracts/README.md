# Z-Connect Phase 1.5 — Platform Contracts (B1)

**Status:** Architecture only · **Merge Hold** · **no runtime**  
**Authority:** AMK-approved · Stream B deliverable B1  
**Version:** 1.0

## Law

```text
Contracts first · Packages second · APIs third · UI last
Runtime: NOT AUTHORIZED
```

## Compliance

Every contract complies with:

- [Z_CONNECT_AI_CONSTITUTION_V1.md](../Z_CONNECT_AI_CONSTITUTION_V1.md)  
- [Z_CONNECT_SCIENTIFIC_INTEGRITY.md](../Z_CONNECT_SCIENTIFIC_INTEGRITY.md)  

**Forbidden in all contracts:** `percentCompatible`, destiny scores, brain ranking, astrology scoring, clinical diagnosis fields.

## Domain map

| Domain | Contracts | Path |
| ------ | --------- | ---- |
| Common | Shared `$defs` | [common/](common/) |
| User | 8 | [user/](user/) |
| Connection | 5 | [connection/](connection/) |
| AI | 8 | [ai/](ai/) |
| Consent | 6 | [consent/](consent/) |
| Messaging | 6 | [messaging/](messaging/) |
| Family | 5 | [family/](family/) |
| Subscription | 5 | [subscription/](subscription/) |
| Moderation | 5 | [moderation/](moderation/) |
| Governance | 5 | [governance/](governance/) |
| Discovery | 7 | [discovery/](discovery/) |

**Total:** 60 domain schemas + 1 definitions bundle = **61** JSON Schema files.

Full inventory: [CONTRACT_INVENTORY.md](CONTRACT_INVENTORY.md)

## Examples

Non-executable fixtures: [examples/](examples/) — all require `"_non_executable": true`

## Policies

- [VERSIONING.md](VERSIONING.md)  
- [CHANGE_POLICY.md](CHANGE_POLICY.md)  
- [DEPENDENCY_MAP.md](DEPENDENCY_MAP.md)  

## Validation

```bash
node docs/z-connect/platform-contracts/scripts/validate_contracts.mjs
npx markdownlint "docs/z-connect/platform-contracts/**/*.md"
```

Full AJV validation deferred to Phase 1.6 / package layer.

## Reports

- [PHASE_1_5_B1_ARCHITECTURE_REPORT.md](PHASE_1_5_B1_ARCHITECTURE_REPORT.md)  
- [PHASE_1_5_B1_GREEN_RECEIPT.md](PHASE_1_5_B1_GREEN_RECEIPT.md)  

## Next (Phase 1.6 — blocked)

API specifications · logical database model — **await human approval**.
