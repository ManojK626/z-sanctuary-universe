# AMK IDE path + fusion operator rhythm

**One page** when VS Code, Cursor, or Explorer paths feel confusing: prove **CLI + real roots** first, then refresh **fusion and gates**. Read-only commands only unless you deliberately open feature lanes elsewhere.

## Real roots (canonical)

| Location | Path |
| --- | --- |
| **Hub** | `C:\Cursor Projects Organiser\Z_Sanctuary_Universe` |
| **Labs** | `C:\Cursor Projects Organiser\Z_Sanctuary_Universe\ZSanctuary_Labs` |

**Never treat as authoritative hub:** anything under **`C:\Users\<you>\.cursor\projects\...`** — that is **archive / agent workspace / cache**. Scratch files there are **not** sealed hub receipts unless copied into the real hub on purpose.

## When to run `npm run z:pc:ide-path`

Run **`z:pc:ide-path`** when:

- **Explorer** lost **Open with VS Code** or similar (shell registration drift).
- You are unsure whether **`code`** or **`cursor`** resolves on PATH.
- You opened a folder and suspect **`cwd`** or workspace might be under **`.cursor/projects`**.
- You want a **fresh JSON + Markdown receipt** before trusting dual-IDE work.

See also: [Z_PC_IDE_PATH_HEALTH_CHECK.md](Z_PC_IDE_PATH_HEALTH_CHECK.md).

## When to run `npm run z:ide:fusion`

Run **`z:ide:fusion`** when:

- **Cursor** and **VS Code** might both be active on the hub.
- You changed **`data/ide-fusion/active_sessions.json`** or appended to **`handoff_journal.jsonl`**.
- You need **`conflict_risk`**, **`handoff_status`**, and **parallel-session** posture.

See also: [Z_IDE_FUSION_WORKFLOW_CONTROL.md](Z_IDE_FUSION_WORKFLOW_CONTROL.md).

## Cockpit vs deep work (Z-SSWS-COCKPIT-1)

After PATH + fusion receipts look sane, run **`npm run z:ssws:cockpit`** to refresh **which roots are cockpit vs deep-work** and a **dry-run** `code` / `cursor` suggestion list. The script **does not** open IDEs; use [AMK_WORKSPACE_DOORWAY.md](AMK_WORKSPACE_DOORWAY.md) copy-commands when you intentionally open a lane.

## Fusion signal: YELLOW can be healthy

If **both** IDEs declare **active sessions** on the same **`project_id`**, fusion often reports **`same_project_parallel`** → **`overall_signal`: YELLOW** with **`conflict_risk`: watch**.

That is **not** automatically failure. It means: **two surfaces are active; the spine is watching.** Do **not** force GREEN just to feel calm — **YELLOW** is the honest coordinated posture unless policy changes.

## Normal rhythm (after path confusion)

From **hub root** (`Z_Sanctuary_Universe`):

```bash
npm run z:pc:ide-path
npm run z:ide:fusion
npm run verify:md
npm run z:traffic
npm run z:car2
npm run dashboard:registry-verify
```

## Optional fuller rhythm

When cadence / MOD-DIST / NUMEN / triple-check matter for the session:

```bash
npm run z:cadence:logical-brains
npm run z:mod:dist
npm run z:numen:hub
npm run z:sec:triplecheck
```

(Add **`z:pc:ide-path`** and **`z:ide:fusion`** ahead of these when IDE posture is unclear.)

## Doorway (explicit opens)

Controlled profiles and dry-run posture: [AMK_WORKSPACE_DOORWAY.md](AMK_WORKSPACE_DOORWAY.md) — **`npm run amk:doorway:status`** before **`amk:doorway:open`**.

## Locked law

```text
Explorer context menu ≠ project health.
CLI path proof beats right-click.
Fusion YELLOW can be healthy watch when two IDEs declare sessions.
.cursor/projects ≠ build root.
IDE detected ≠ deploy permission.
GREEN ≠ deploy.
AMK-Goku owns sacred moves.
```

## Receipt

Phase seal: [PHASE_AMK_IDE_RHYTHM_1_GREEN_RECEIPT.md](PHASE_AMK_IDE_RHYTHM_1_GREEN_RECEIPT.md).
