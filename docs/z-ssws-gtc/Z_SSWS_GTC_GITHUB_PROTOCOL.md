# Z-SSWS-GTC — GitHub protocol

GitHub is the **vault and PR gate** — not the operator.

## Role

GitHub may:

- store history and audit trail
- run checks and host PR review
- preserve rollback via tags and revert commits
- record releases and merge receipts

GitHub must **not** be treated as:

- autonomous merge authority
- deployment permission by itself
- production truth without human sign-off

Human merge on `main` remains **sacred**.

## Canonical hub references

Full gate doctrine: [Z-GITHUB-SANCTUARY-GATE.md](../Z-GITHUB-SANCTUARY-GATE.md)

AI + comms precautions: [Z-GITHUB-AI-COMMS-PRECAUTIONS.md](../Z-GITHUB-AI-COMMS-PRECAUTIONS.md)

Ecosystem identity: [Z-ECOSYSTEM-GITHUB-INTEGRATION.md](../Z-ECOSYSTEM-GITHUB-INTEGRATION.md)

Do not duplicate those documents here.

## PR posture (Turtle Mode)

| Rule | Intent |
| --- | --- |
| Branch prefix `cursor/zsanctuary/*` (hub) | Guarded worker lanes |
| Protected `main` | No direct sacred pushes |
| PR required | Human review mandatory |
| Checks informative | Green CI ≠ merge approval |
| Close duplicates | One canonical PR per scope |

## What GTC tracks (advisory, Phase 0)

- open PR list and target branch
- check failures (report separately if ESLint baseline debt blocks full verify)
- whether PR is docs-only vs runtime
- merge queue order relative to OTL / PGMO / other lanes

## Verify hints (operator-run)

```bash
npm run verify:sanctuary-github-pr
```

Broader hub verify per [AGENTS.md](../../AGENTS.md) — distinguish enforcer-gated vs technical-only intents.

## Law

```text
GitHub status ≠ merge permission
```

## Related

- [Z_SSWS_GTC_COMMAND_BOUNDARIES.md](./Z_SSWS_GTC_COMMAND_BOUNDARIES.md)
- [Z_SSWS_GTC_CURSOR_PROTOCOL.md](./Z_SSWS_GTC_CURSOR_PROTOCOL.md)
