# ZUNO-A2 — Snapshot diff intelligence (read-only)

A2 has **two facets** (same safety posture: observe-only, exit non-zero only on invalid inputs):

1. **A2a — Temporal diff:** current snapshot vs **baseline** JSON (what changed over time).
2. **A2b — Truth-layer alignment:** Monster Project **registry** vs **ingested snapshot** (forgotten cores, stale ingest, narrative gaps).

## Purpose (A2a)

Compare **current** ingested snapshot (`data/zuno_state_snapshot.json`) to an explicit **baseline** (`data/zuno_state_snapshot.baseline.json`) and emit a report only — **no auto-fix**, **no phase advancement**.

## Purpose (A2b)

Compare live `data/z_sanctuary_monster_project_registry.json` (`_meta.required_entry_ids`) to:

- **`truth_alignment_ref`** embedded at last `npm run zuno:snapshot` (checksum of required ids), and
- **Narrative heuristics** (whether each required id likely appears in the snapshot body derived from MD).

Detects **registry changed since snapshot**, **missing ingest echo**, and **symbolic cores not yet reflected** in technology snapshot text. Still **no auto-fix**.

## Commands

```bash
npm run z:monster:registry-verify
npm run zuno:snapshot
npm run zuno:snapshot:baseline   # optional anchor for A2a
npm run zuno:snapshot:diff       # A2a
npm run zuno:snapshot:truth-align   # A2b
npm run z:traffic
```

If baseline is missing, A2a still **exits 0** and writes a `no_baseline` report with guidance.

## Outputs

### Artifact files (A2a)

| File | Role |
| -------------------------------------- | ---------------------------------------- |
| `data/reports/zuno_snapshot_diff.json` | Machine-readable deltas + summary counts |
| `data/reports/zuno_snapshot_diff.md` | Human-readable table |

### Artifact files (A2b)

| File | Role |
| ---------------------------------------------- | ---------------------------------- |
| `data/reports/zuno_truth_layer_alignment.json` | Echo check + per-id narrative tier |
| `data/reports/zuno_truth_layer_alignment.md` | Human-readable summary |

## Delta types

| Type | When |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| `added` | Key or field present only in current |
| `removed` | Key or field present only in baseline |
| `changed` | Value differs (default bucket) |
| `non_claim_changed` | `executive_summary`, `explicit_non_claims`, `inference_hints`, or `core_system_truth` body changed |
| `posture_changed` | `identity.Posture` or `identity.Autonomy level` changed |

`hub_gates` field deltas use `changed` unless you extend rules later.

## Exit codes (temporal diff / A2a)

- **0** — Baseline missing (informational), or diff completed, or no deltas.
- **1** — Current snapshot JSON missing or **invalid** (parse error).

## Exit codes (truth-layer alignment / A2b)

- **0** — Report written (`GREEN` or `YELLOW`; yellow is drift signal, not a process failure).
- **1** — Snapshot or monster registry JSON missing or **invalid**, or registry has no `required_entry_ids`.

## Next (A3)

Aggregated read-only posture: [ZUNO_A3_AWARENESS_SCORE.md](./ZUNO_A3_AWARENESS_SCORE.md) — `npm run zuno:awareness-score`.

## Rollback

Remove `scripts/zuno_snapshot_diff.mjs`, `scripts/zuno_snapshot_baseline.mjs`, `scripts/zuno_truth_layer_alignment.mjs`, npm scripts, this doc, and delete `data/zuno_state_snapshot.baseline.json` / diff reports if desired. Revert `truth_alignment_ref` addition in `scripts/zuno_snapshot_ingest.mjs` if you want older snapshot shape.
