# 07 — Z multi-project deployment routing

## Status

`BLOCKED`

## Goal

Future: document or implement **routing** for which project deploys where — **sacred**; touches release control, twin roots, and Overseer posture.

## Context

- `AGENTS.md` release / verify intent section
- [docs/z-maos/AMK_CONSENT_GATES.md](../../z-maos/AMK_CONSENT_GATES.md)

## Dependencies

- `manual_release` / execution enforcer policy understood by human operator.
- Charter for any automated routing hints.

## Strict rules

- **FORBIDDEN_NOW:** wiring deploy keys, CI secrets, or “one button deploy all” from hub docs.
- No Cloudflare/AWS/similar integration from this prompt family without explicit approval.

## Files to touch

- None while `BLOCKED`.

## Acceptance criteria

- N/A until unblocked.

## Verification commands

```bash
npm run z:maos-status
```

## Handoff response format

Use [../Z_HANDOFF_TEMPLATE.md](../Z_HANDOFF_TEMPLATE.md).

## Next linked task

When unblocked → separate READY prompts per provider **after** human gate text exists.
