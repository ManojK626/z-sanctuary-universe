# Zuno awareness recovery receipt (A3-R)

**Generated:** 2026-05-03T16:02:37.890Z

| Field | Value |
| ------------------------- | ------------------ |
| Mode | read_last_receipts |
| A3 band (last) | RED |
| Z-Traffic chief | RED |
| Recovery status | blocked |
| A4 Guardian Loop eligible | **no** |
| A4 blocked | **yes** |

## Gate rule

Do **not** open **A4 (Guardian Loop)** while **A3 is RED** or **Z-Traffic chief is RED**. Use this receipt after fixes.

## Correct recovery order

1. `npm run z:traffic` — fix whatever makes Z-Traffic RED **first**.
2. After intentional snapshot-shape changes are accepted:

```bash
npm run zuno:snapshot
npm run zuno:snapshot:diff
npm run zuno:snapshot:truth-align
npm run zuno:awareness-score
npm run zuno:a3r:receipt
```

Use `npm run zuno:a3r:receipt -- --live` for the last step only when you want a fresh traffic + A3 pass before reading.

## Block / eligibility detail

A3 band is RED; Z-Traffic chief is RED. Do not open A4.

---

_Read-only receipt — no auto-fix, no A4 execution._
