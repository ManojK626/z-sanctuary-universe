# Z-CURSOR MASTER MODE (Zuno Edition)

Ops doctrine for using Cursor safely inside **Z-Sanctuary**. This is **human ritual**, not automation: scripts, tasks, and CI remain the authority.

---

## Core constraints (control laws)

```text
MAX_AGENTS = 2
ONE_DOMAIN_PER_RUN = TRUE
NO_FILE_OVERLAP = STRICT
VERIFY_BEFORE_STOP = REQUIRED
CANVAS = VISUAL_ONLY
DEPLOYMENT = HOLD
```

Treat these as defaults unless a separate governance note explicitly changes them.

---

## Master workspace structure (multi-root)

Open the hub workspace with folders in **priority order**:

1. **ZSanctuary_Universe** — core hub (always include; keeps system awareness).
2. **Z-Sanctuary_Replit** — active app (e.g. roulette / API) when in scope.
3. **Z_Labs** — experimental zone.
4. **Extras & Tools** — scripts and helpers.

**Rule:** Hub visible first so registry, verify paths, and Overseer-aligned docs stay in reach.

---

## Tiled layout (command center)

Use a stable pane layout:

```text
┌─────────────────────────────┬─────────────────────────────┐
│ Commander / hub (LEFT)      │ Active project (RIGHT)       │
│ Status, commflow, next step │ Current lane — code / UI     │
├─────────────────────────────┴─────────────────────────────┤
│ Terminal / verify (BOTTOM)                                   │
│ npm run verify:full:technical (when closing a lane)          │
└──────────────────────────────────────────────────────────────┘
```

This separates **awareness**, **execution**, and **proof**.

---

## Agent control (strict mode)

### Allowed (agents)

- **Agent 1:** Primary task (e.g. UI polish in one module).
- **Agent 2:** Support task in a **different** domain (e.g. docs or lint-only fixes).

### Forbidden (agents)

```text
❌ Same file edited by two agents
❌ Same module touched in conflicting ways in one run
❌ Cross-domain edits bundled into one agent run
❌ More than two agents
```

**Example (safe):** Agent 1 — scoped CSS for Commander panel; Agent 2 — Markdown cleanup under `docs/` with no overlap.

---

## Worktrees (isolation)

Use **git worktrees** (or equivalent isolated branches) for parallel experiments:

```text
main = stable truth

worktree → feature branch (e.g. anima-lite, passport-validator, display-engine)
```

**Rule:** Do not experiment on `main`; merge only after review and verify.

---

## Canvas and visual surfaces

### Allowed (canvas)

- Visual maps (e.g. Z-CANVAS Root Map), dashboards, flows for orientation.

### Not allowed from Canvas alone

```text
❌ Moving files or repos as “truth”
❌ Treating Canvas as registry or execution authority
❌ Assuming Canvas state replaces EAII / hub reports without verification
```

**Golden rule:** Canvas **shows** orientation; **CLI verify and hub governance** decide truth.

---

## Execution ritual (every lane)

```text
1. Pick ONE lane (one domain).
2. Run at most two agents with zero file overlap.
3. Review diffs locally.
4. Run: npm run verify:full:technical
5. If PASS → accept / merge per your PR workflow.
6. If FAIL → fix or rollback; do not stack more lanes on top.
7. STOP.
```

**Verify-before-stop** is mandatory for closing a lane.

---

## Daily flow (short rhythm)

```text
OPEN workspace → Observe hub / Commander context
↓
CHOOSE ONE LANE
↓
RUN (≤ 2 agents, no overlap)
↓
VERIFY
↓
STOP
```

Avoid chaining three or four unrelated tasks in one session without a verify boundary between them.

---

## Deployment posture

**Deployment:** **HOLD** until explicitly lifted by your release process (`manual_release`, Overseer-aligned gates, and human decision). Master Mode does not override that.

---

## Danger signals (stop and reset)

If you notice:

- Too many parallel agents or churn across modules.
- Same files touched from multiple lanes.
- Verify skipped “to save time.”
- Workspace confusion (wrong root, mixed repos).

**Then:** stop, reset to **single lane**, re-open hub-first workspace, and run verify only after the lane is clean.

---

## Principle

```text
Parallel tools exist.
Sequential discipline protects the stack.
```

Cursor scales power; Z-Sanctuary scales on **clarity, verify, and human gate**.

---

## Rollback (this document only)

Remove **`docs/Z-CURSOR-MASTER-MODE.md`** from the repo if this doctrine should no longer apply; no scripts depend on this file.
