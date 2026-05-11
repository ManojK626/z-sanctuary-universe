# Shadow preview policy (ZSX-1)

## Definition

A **shadow preview** is a **read-only** representation of another project’s capability: static HTML snippet, doc excerpt, archived JSON snapshot, screenshot, or similar — **not** a hosted live instance billed or operated by the preview host.

## Why this exists

Without clear labeling, users assume:

- The preview host **ships** the tool,
- **Payment** to the host covers the source project,
- **Live data** or **sync** exists when it does not.

Shadow rules prevent **silent service inheritance** and pricing confusion.

## Required declarations

Every shadow preview **must** declare:

| Field | Meaning |
| -------------------------------- | ----------------------------------- |
| Source project | Canonical owner (e.g. z-questra) |
| Source version or freshness date | So staleness is visible |
| Copied capability / surface name | What is being mirrored |
| Pricing owner | Who sets commercial terms |
| Bridge status | e.g. reference_only / not_connected |
| Not-live warning | Explicit “not a live service” |
| Entitlement disclaimer | Reference ≠ access |

Machine-readable mirror: `data/z_shadow_preview_policy.json`.

## Example label

```text
Shadow preview from Z-QUESTRA v0.2.9 (freshness: 2026-05-01). Read-only reference.
Not a live service. Pricing and access remain owned by Z-QUESTRA until a formal bundle charter exists.
```

(Template fields in JSON use `{{placeholders}}` for automation later.)

## Escalation to live use

Live execution, iframe runtime coupling, APIs, or cross-project memory require:

1. **Written charter**
2. **14 DRP / 14 DOP gate** (safety + operational discipline)
3. **Privacy / consent / deletion** story where personal data could appear

A shadow preview satisfies **none** of these by itself.

## Related

- [Z_SERVICE_ENTITLEMENT_AND_PRICING_POLICY.md](./Z_SERVICE_ENTITLEMENT_AND_PRICING_POLICY.md)
- [Z_CROSS_PROJECT_CAPABILITY_SYNC.md](./Z_CROSS_PROJECT_CAPABILITY_SYNC.md)
