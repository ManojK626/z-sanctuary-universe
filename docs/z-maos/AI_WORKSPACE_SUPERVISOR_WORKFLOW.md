# Z-MAOS — AI Workspace Supervisor Workflow

**Purpose:** Operator workflow when using MAOS alongside Cursor/VS Code and multi-root workspaces.

---

## 1. Default sequence

1. Open sanctioned workspace (e.g. `Z_SSWS.code-workspace` or hub folder).
2. Run `npm run z:maos-status` from **hub root** when diagnosing ecosystem posture.
3. Read **next safe action** line in output.
4. Open project-specific cockpit (XL2 Control Deck, etc.) **in that repo** if needed.
5. Route task using `npm run z:maos-route -- <signal>` (see [MINI_BOT_DISPATCH_RULES.md](MINI_BOT_DISPATCH_RULES.md)).
6. Apply **consent** before any gated action ([AMK_CONSENT_GATES.md](AMK_CONSENT_GATES.md)).
7. Run hub verifiers appropriate to what changed ([OPENING_CYCLE_RUNBOOK.md](OPENING_CYCLE_RUNBOOK.md)).

---

## 2. Multi-root discipline

When `Z_All_Projects.code-workspace` merges roots, MAOS status still prefers **explicit cwd**—run from the repo you intend to treat as anchor (usually hub).

---

## 3. Friction removal

See [FRICTION_REMOVAL_PROTOCOL.md](FRICTION_REMOVAL_PROTOCOL.md)—one smallest step per cycle.

---

## 4. Failure and escalation

See [FAILURE_ESCALATION_RULES.md](FAILURE_ESCALATION_RULES.md).
