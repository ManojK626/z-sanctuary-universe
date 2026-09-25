# Z-Connect Contract Versioning

**Version:** 1.0  
**Applies to:** `docs/z-connect/platform-contracts/**`

## Rule

Every contract schema begins at **`v1`**.

The `schemaVersion` field on every instance is **`"v1"`** until a new major generation is chartered.

## Major versions

| Version | Meaning |
| ------- | ------- |
| **v1** | Phase 1.5 B1 initial architecture contracts |
| **v2+** | Requires AMK-gated ADR + migration notes |

## Never

- Silently rename required fields  
- Remove fields without deprecation period (future)  
- Break v1 fixtures without version bump  

## File naming

```text
{domain}/schemas/v1/{contract-name}.schema.json
```

## `$id` namespace

```text
https://z-sanctuary.local/z-connect/schemas/v1/{contract-id}.json
```

## Relationship to hub

Aligns with [VILE VERSIONING pattern](../../vile/platform-contracts/README.md) — contracts precede packages.
