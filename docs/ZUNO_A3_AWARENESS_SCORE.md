# ZUNO-A3 — Awareness score (read-only)

## Purpose

One **aggregated posture band** and numeric **score** (0–100, higher is calmer) from existing receipts and short-lived checks. **No auto-fix**, **no phase advancement**, **no autonomy loop**.

## Inputs (aggregated)

| Source | Role |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| Monster registry verify | `npm run z:monster:registry-verify` (receipt + exit) |
| Snapshot ingest | `data/zuno_state_snapshot.json` present; `truth_alignment_ref` embedded |
| A2a temporal diff | `scripts/zuno_snapshot_diff.mjs` (when baseline exists; `no_baseline` is advisory) |
| A2b truth alignment | `scripts/zuno_truth_layer_alignment.mjs` |
| Z-Traffic | `scripts/z_traffic_minibots_status.mjs` chief signal |
| Explicit non-claims / autonomy | Parsed from snapshot `identity` and `explicit_non_claims` |

## Command

```bash
npm run zuno:awareness-score
```

Suggested ritual after material edits:

```bash
npm run z:monster:registry-verify
npm run zuno:snapshot
npm run zuno:snapshot:truth-align
npm run zuno:awareness-score
```

(`zuno:awareness-score` re-runs Monster verify, A2a, A2b, and Z-Traffic internally for one fresh receipt. Use `npm run z:traffic` alone when you only want the traffic tower without A3.)

## Outputs

| File | Role |
| ---------------------------------------- | ------------------------------------------------ |
| `data/reports/zuno_awareness_score.json` | Machine-readable band, score, signals, rationale |
| `data/reports/zuno_awareness_score.md` | Human-readable summary |

## Bands

| Band | Meaning |
| ------ | ----------------------------------------------------------------------------------------------------------- |
| GREEN | Stable, aligned, no blocking drift. |
| YELLOW | Known drift, symbolic gaps, optional baseline missing, or advisory traffic. |
| BLUE | Human / AMK decision required (posture language or traffic chief). |
| RED | Broken required evidence (e.g. Monster verify fail, snapshot missing, traffic RED, A2 script hard failure). |

**Note:** A2b **YELLOW** for narrative gaps alone is **expected** until the technology snapshot reflects more of the Monster roster — the score stays honest; it is not a CI failure unless you wire it that way.

## When A3 is RED — A3-R next (not A4)

Do **not** open **A4 (Guardian Loop)** while A3 is **RED** (or Z-Traffic is **RED**). Use **[ZUNO_A3R_AWARENESS_RECOVERY_RECEIPT.md](./ZUNO_A3R_AWARENESS_RECOVERY_RECEIPT.md)** — `npm run zuno:a3r:receipt` — for a read-only **recovery gate receipt** after you follow the traffic-first recovery order.

## Exit codes

- **0** — Receipt written successfully (inspect `band` in JSON for posture).

## Rollback

Remove `scripts/zuno_awareness_score.mjs`, the `zuno:awareness-score` npm script, this doc, and delete `data/reports/zuno_awareness_score.*` if desired. A3-R lives separately: [ZUNO_A3R_AWARENESS_RECOVERY_RECEIPT.md](./ZUNO_A3R_AWARENESS_RECOVERY_RECEIPT.md).
