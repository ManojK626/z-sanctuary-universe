# ZUNO-A3R — Awareness recovery receipt (read-only gate)

## Purpose

When **A3** is **RED** or **YELLOW**, the next **safe** lane is **recovery and receipts**, not **A4 (Guardian Loop)**. A3-R writes a **small gate receipt** that states:

- last **A3 band** and **Z-Traffic** chief signal (from existing JSON, or refreshed with `--live`),
- whether **A4 is eligible** under hub discipline (**dual GREEN** on A3 + Traffic for strict eligibility),
- the **correct recovery order** (no auto-fix).

## Gate rule

**Do not open A4** while **A3 band is RED** or **Z-Traffic chief is RED**. Resolve traffic and snapshot hygiene first, then re-run A3.

## Command

```bash
npm run zuno:a3r:receipt
```

Refresh traffic + full A3, then emit receipt (slower, fresher):

```bash
npm run zuno:a3r:receipt -- --live
```

## Correct recovery order (operator)

1. **`npm run z:traffic`** — fix whatever makes Z-Traffic **RED** first.

2. **Only after** intentional snapshot-shape changes are accepted, run ingest, A2, and A3, then capture the gate:

```bash
npm run zuno:snapshot
npm run zuno:snapshot:diff
npm run zuno:snapshot:truth-align
npm run zuno:awareness-score
npm run zuno:a3r:receipt
```

Use `npm run zuno:a3r:receipt -- --live` instead of the last line when you want a fresh traffic + A3 pass before the receipt.

## Outputs

| File | Role |
| --------------------------------------------------- | ---------------------------------- |
| `data/reports/zuno_awareness_recovery_receipt.json` | Machine-readable gate + references |
| `data/reports/zuno_awareness_recovery_receipt.md` | Human-readable recovery summary |

## A4 eligibility (strict)

`a4_guardian_loop_eligible` is **true** only when **both** the last A3 band and Z-Traffic chief are **GREEN**. Any RED/BLUE, or YELLOW, keeps **A4 blocked** for automation purposes (human charter still applies for any future A4 work).

## Exit codes

- **0** — Receipt written (inspect JSON for gate; blocked is normal until recovery).

## Related

- [ZUNO_A3_AWARENESS_SCORE.md](./ZUNO_A3_AWARENESS_SCORE.md) — A3 aggregate score.
- [ZUNO_A2_SNAPSHOT_DIFF.md](./ZUNO_A2_SNAPSHOT_DIFF.md) — A2a/A2b.

## Rollback

Remove `scripts/zuno_awareness_recovery_receipt.mjs`, the `zuno:a3r:receipt` npm script, this doc, and delete `data/reports/zuno_awareness_recovery_receipt.*` if desired.
