# Z-WORK-PULSE Phase 0 — Background Work Witness doctrine

Formal ID: **Z-WORK-PULSE-0**.

## Purpose

Create a **docs-first witness doctrine** for background work in Z-Sanctuary Universe.
Phase 0 defines vocabulary, safety law, and policy boundaries so future background-capable lanes can be **named, reviewed, and witnessed** before any runtime exists.

Phase 0 ships **documentation and policy JSON only**.
There is **no runtime, no daemon, no auto-start, no deploy lane, no Cloudflare mutation, no GitHub mutation, no payment/legal automation, and no merge/PR automation**.

## Core definitions

### Z-WORK

**Z-WORK** means a declared unit of background-oriented work that is:

- **visible** to the operator,
- **bounded** by policy,
- **named** with a purpose and lane,
- **witnessed** through human-readable doctrine and machine-readable policy,
- **non-authoritative** until a later charter opens a real execution lane.

In Phase 0, **Z-WORK is a governance object, not a running process**.

### Background Work Witness

A **Background Work Witness** is the Sanctuary layer that records what a background lane **would be allowed to mean** and what it is **forbidden** to do.
It exists to prevent hidden automation from entering the hub under vague language like “helper,” “watcher,” “pulse,” or “worker.”

### Pulse

In this doctrine, **Pulse** means a conceptual receipt rhythm for future evidence and visibility.
In Phase 0, a pulse is **not** a timer, loop, job, cron, service, or daemon.

## Golden law

```text
Background possibility ≠ runtime permission.
Witnessing work ≠ executing work.
A pulse name ≠ an always-on worker.
Documentation ≠ deploy approval.
GREEN ≠ auto-start.
Human authority stays above any future background lane.
```

## Phase 0 boundaries

### Allowed in this phase

- Define doctrine and vocabulary
- Define machine-readable policy boundaries
- Name future witness fields and review expectations
- Describe future receipts without implementing them
- Link the witness posture to existing hub governance

### Forbidden in this phase

- Any runtime implementation
- Any background daemon, cron, worker, scheduler, or loop
- Any auto-start or boot-time behavior
- Any deploy or environment mutation
- Any Cloudflare mutation
- Any GitHub mutation
- Any payment or legal automation
- Any merge, auto-merge, or PR automation
- Any secret, credential, token, or account automation

## Why this exists

Z-Sanctuary protects against hidden escalation.
If a future lane says it will “help in the background,” the hub must first know:

1. what the lane is called,
2. what it may observe,
3. what it may report,
4. what it may never do,
5. which gate would be required before any real runtime is even discussed.

This doctrine keeps **docs-first, mock-first, visible-first, local-first, human-reviewed** posture intact.

## Witness posture (Phase 0)

Any future Z-WORK lane should eventually declare at least:

| Field | Meaning |
| ------ | ------- |
| `work_id` | Stable lane identifier |
| `title` | Human-readable name |
| `purpose` | Why the lane exists |
| `phase` | Current charter phase |
| `visibility` | How operators can see it |
| `inputs` | What it may read |
| `allowed_outputs` | What it may emit |
| `forbidden_actions` | Hard stops |
| `human_gate` | Required approval level |
| `runtime_status` | Declared as `not_present` in Phase 0 |

These fields are **policy scaffolding only** in this phase.

## Authority alignment

Z-WORK-PULSE Phase 0 stays beneath existing hub authority:

- [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md)
- [Z_OPERATIONAL_TECHNOLOGY_LAYERS.md](Z_OPERATIONAL_TECHNOLOGY_LAYERS.md)
- [Z_AUTONOMY_LEVELS_POLICY.md](Z_AUTONOMY_LEVELS_POLICY.md)
- [Z-NEW-MODULE-DISCIPLINE.md](Z-NEW-MODULE-DISCIPLINE.md)

## Phase 0 outcome

When this phase is complete, the hub has:

- one doctrine for what “background work witness” means,
- one policy JSON for allowed and forbidden posture,
- zero runtime obligations,
- zero silent execution paths.

That is the point.
Future phases must earn runtime discussion through an explicit charter, not through implication.
