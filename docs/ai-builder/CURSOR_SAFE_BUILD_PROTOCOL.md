# Cursor safe build protocol

## Before edits

- Confirm **workspace root** is `ZSanctuary_Universe` (or the intended sub-root), not a sibling product repo mixed by mistake.
- Read the **target module** row in `data/z_master_module_registry.json` and the generated page under `docs/modules/…` if it exists.
- If the row is `safety_hold` or `decision_required`, read linked `docs/safety/*.md` and stop for human direction.

## During edits

- Touch **only** files needed for the task; avoid drive-by refactors across unrelated modules.
- If adding a **new** module path: add registry evidence first, then files, then `npm run zuno:coverage`, then `npm run z:docs:modules`.

## After edits

- Run **scoped** checks (eslint on touched scripts, `markdownlint` on touched docs) when you change those areas.
- For risky or wide diffs: `npm run verify:full:technical` after AMK agrees the cost is justified.

## Rollback mindset

- Prefer small commits or PRs per domain (UI vs scripts vs docs) so revert is one decision.
