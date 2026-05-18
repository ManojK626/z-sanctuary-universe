# Z-SSWS-GTC — GitHub protocol

## GitHub role in this spine

GitHub may:

- store history
- run checks
- host PR review
- preserve rollback trail
- record releases and receipts

## GitHub must not be treated as

- autonomous merge authority
- deployment permission by itself
- sole production truth

Human merge remains sacred.

## Protocol posture

```text
Cursor builds → GitHub verifies → Human approves → Sanctuary records
```

## CI interpretation law

- Check outcomes are evidence, not authority.
- Failed checks inform repair lanes; they do not auto-authorize bypass.
- Green checks indicate readiness posture, not automatic merge permission.

## Related doctrine pointers

- [../Z-GITHUB-SANCTUARY-GATE.md](../Z-GITHUB-SANCTUARY-GATE.md)
- [../Z_OPERATIONAL_TECHNOLOGY_LAYERS.md](../Z_OPERATIONAL_TECHNOLOGY_LAYERS.md)
