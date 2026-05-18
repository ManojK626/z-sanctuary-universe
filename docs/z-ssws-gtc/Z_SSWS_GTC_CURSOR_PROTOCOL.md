# Z-SSWS-GTC — Cursor protocol

Cursor is the **builder workspace** — not the execution authority.

## Role

Cursor may:

- organize branches (`cursor/zsanctuary/*`, satellite prefixes per repo)
- draft docs and PR-sized diffs
- interpret checks and suggest next Turtle lane
- run verify commands when operator allows terminal
- prepare merge checklists and receipt text

Cursor must not:

- auto-merge or auto-deploy
- silently expand runtime or hidden networking
- override AMK approval or branch protection
- treat its own plan as approved work

## Canonical hub references

Thin index: [.cursor/rules/z-sanctuary-core.mdc](../../.cursor/rules/z-sanctuary-core.mdc)

Turtle Mode: [.cursor/rules/z-turtle-mode-cursor-agents.mdc](../../.cursor/rules/z-turtle-mode-cursor-agents.mdc)

Builder context: [AI_BUILDER_CONTEXT.md](../AI_BUILDER_CONTEXT.md)

Hierarchy when unsure: [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](../Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md)

## GitHub Copilot posture

Copilot and Cursor share **builder** lane discipline:

- doctrine and PR-sized changes under human review
- no duplicate open PRs for same scope without closing one
- same sacred boundaries as Cursor agents

Copilot is not merge authority.

## Workflow chain

```text
Cursor drafts → GitHub hosts PR → checks run → human merges → (future) Cloudflare only with charter
```

## Law

```text
Cursor plan ≠ approved work
command spine ≠ execution authority
```

## Related

- [Z_SSWS_GTC_GITHUB_PROTOCOL.md](./Z_SSWS_GTC_GITHUB_PROTOCOL.md)
- [Z_SSWS_GTC_MASTER_DOCTRINE.md](./Z_SSWS_GTC_MASTER_DOCTRINE.md)
