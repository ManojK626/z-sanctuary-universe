# Z-PGMO — Improvement radar

The improvement radar produces **recommendations only**. Each item is a suggestion for the operator or a Turtle branch — not permission to execute.

## PGMO ↔ AMK Indicators ↔ Z-Team AI (Phase 0.1)

```text
project state → indicator posture → Z-Team advisory routing → AMK human decision
```

| Step | Source | PGMO role |
| --- | --- | --- |
| Project state | Boundary map, phase label, merge queue | Describe lane and risk |
| Indicator posture | AMK indicator rows / overlays (when dashboard served) | Compare posture to lane; **no permission** |
| Z-Team advisory | AMK-AI-SYNC routing packets (`amk:ai-sync` report) | Suggest reviewer role (e.g. overseer, hygiene, deploy-hold) |
| AMK decision | Human operator | Sacred moves, merge, deploy, charter |

Reinforcement laws:

```text
indicator ≠ permission
AI team advice ≠ approval
management insight ≠ execution
dashboard visibility ≠ authority
```

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
| Indicator drift | AMK pill / overlay vs lane claim | Open indicators panel; do not auto-edit JSON |
| Z-Team routing | AMK-AI-SYNC report | Operator runs `npm run amk:ai-sync`; read packet only |

## Improvement record format (manual Phase 0)

When PGMO (human or AI) logs a recommendation, use:

```text
project_id:
signal: GREEN | YELLOW | BLUE | RED
category:
suggestion:
needs_human_approval: true | false
sacred_move: true | false
indicator_posture: GREEN | YELLOW | BLUE | RED | unknown
suggested_z_team_role: overseer | hygiene | deploy-hold | routing | none
```

Phase 0 / 0.1 have **no** automated PGMO report file. Future phases may add read-only JSON under `data/reports/` only with charter approval.

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
- [../AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](../AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md)
- [../AMK_AI_TEAM_INDICATOR_SYNC_ROUTER.md](../AMK_AI_TEAM_INDICATOR_SYNC_ROUTER.md)
