# ZUNO-A1 — Snapshot → ingestion → awareness (read-only)

## Purpose

One tight slice: canonical markdown is still the **human authority**; a **derived JSON** artifact lets Zuno, Cursor, and agents reason on **structured** posture without mutating source truth.

## Artifacts

| Path | Role |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/z_zuno_technology_snapshot.md` | Canonical snapshot (edit here) |
| `scripts/zuno_snapshot_ingest.mjs` | MD → `data/zuno_state_snapshot.json` |
| `data/zuno_state_snapshot.json` | Ingested state (regenerate after MD changes); embeds **`truth_alignment_ref`** (Monster registry required-id checksum at ingest time) |
| `api/zuno/state.mjs` | Read-only loader + slim awareness CLI |

## Commands

```bash
npm run zuno:snapshot
npm run zuno:snapshot:awareness
```

Suggested rhythm after snapshot or registry work:

```bash
npm run zuno:snapshot
npm run zuno:snapshot:truth-align
npm run z:traffic
```

## Not in scope (A1)

- No diff engine, no auto-evolution, no guardian execution loop
- No new hub HTTP server (see `api/zuno/README.md`)
- No Firestore or external ingestion

## Next (A2 / A3)

Read-only intelligence: [ZUNO_A2_SNAPSHOT_DIFF.md](./ZUNO_A2_SNAPSHOT_DIFF.md) — **A2a** `npm run zuno:snapshot:baseline` then `npm run zuno:snapshot:diff`, **A2b** `npm run zuno:snapshot:truth-align` (registry ↔ snapshot). Aggregated posture: [ZUNO_A3_AWARENESS_SCORE.md](./ZUNO_A3_AWARENESS_SCORE.md) — `npm run zuno:awareness-score`.

## Rollback

Remove `scripts/zuno_snapshot_ingest.mjs`, `api/zuno/`, this doc, `npm` scripts, and delete `data/zuno_state_snapshot.json` if desired.
