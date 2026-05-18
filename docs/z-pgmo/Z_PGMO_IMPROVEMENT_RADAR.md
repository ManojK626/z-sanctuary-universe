# Z-PGMO — Improvement radar

The improvement radar produces **recommendations only**. Each item is a suggestion for the operator or a Turtle branch — not permission to execute.

## Signal levels

| Signal | Meaning | Operator action |
| --- | --- | --- |
| GREEN | Aligned; optional polish | Defer or small hygiene PR |
| YELLOW | Drift or sequencing note | Review before next merge |
| BLUE | Informational awareness | No urgency |
| RED | Policy or safety conflict | Stop lane; human decision |

## Radar categories

| Category | Watches | Example suggestion |
| --- | --- | --- |
| Identity | Project markers, ports, names | Run Roulette `identity:check:live` |
| Doctrine | Missing receipts, stale INDEX | Add green receipt after phase seal |
| Merge queue | Branch order vs Turtle | Finish OTL before PGMO merge |
| Gateway | Local ports down | Start `dev:dashboard` manually; gateway observes only |
| Deploy hold | Cloudflare without dry-run | Complete Phase D checklist first |
| Overlap | Two PRs same scope | Close duplicate OTL PR |
| Hygiene | MD060 / verify:md | Table compact in scoped branch only |

## Improvement record format (manual Phase 0)

When PGMO (human or AI) logs a recommendation, use:

```text
project_id:
signal: GREEN | YELLOW | BLUE | RED
category:
suggestion:
needs_human_approval: true | false
sacred_move: true | false
```

Phase 0 has **no** automated report file. Future phases may add read-only JSON under `data/reports/` only with charter approval.

## What improves next (illustrative — May 2026)

These are **examples**, not auto-queued work:

1. Settle Operational Technology Layers PR on `main`
2. Push and merge MD060 hygiene branch (narrow) if still local-only
3. LinguaCore Phase 0 → rebase Phase 1 → merge in order
4. Mauritius / DeX / hotspot / HDMI validation before Z-ADTF
5. Open E2 gateway PR after core spine stable
6. Roulette governance + stabilization PRs on satellite repo
7. Z-PGMO Phase 0 doctrine PR after OTL (this lane)

## Language rules

Prefer: advisory, human-reviewed, verification-guided, operator-approved, governed deployment.

Avoid: self-aware, autonomous decision, fully automatic deployment, AI controls production.

## Related

- [Z_PGMO_OPERATOR_QUEUE_POLICY.md](./Z_PGMO_OPERATOR_QUEUE_POLICY.md)
- [Z_PGMO_MASTER_DOCTRINE.md](./Z_PGMO_MASTER_DOCTRINE.md)
