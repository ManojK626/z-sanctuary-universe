# Z — Mini bot operators (Phase 1)

## Registry Identity

| Field | Value |
| --------------------- | ---------------------- |
| **ID** | `z-mini-bots-phase1` |
| **Category** | trust_audit_governance |
| **Registry status** | implemented |
| **Safety class** | low |
| **Z registry ZID** | z-mini-bots-phase1 |
| **Zuno audit status** | FOUND_FULL |

## Purpose

Observe-only: bot:guardian (PC paths vs registry), bot:sync (registry snapshot to bot_sync_snapshots/, not full tree), bot:health (Node/OS). bots/README.md

## Current Evidence

- `bots/guardian/guardian_bot.mjs` — **present**

## Current Build Posture

Registry lists **implemented**. Declared paths exist — implementation evidence present at file level (runtime behaviour not asserted here).

## Safety Boundaries

Cross-check hub safety doctrine (generator suggestions only — human authority wins):

- [`NON_MEDICAL_PRODUCT_BOUNDARY.md`](../../safety/NON_MEDICAL_PRODUCT_BOUNDARY.md)

## Allowed Next Steps

- Documentation and registry alignment only unless a separate charter approves code.
- Re-run `npm run zuno:coverage` after changing `expected_paths`.
- Re-run `npm run z:docs:modules` to refresh this file from truth sources.
- Narrow refactors inside evidenced files with human review and verify pipeline.

## Forbidden Until Gate

- Auto-merge, deploy, publish, or enable payments without AMK consent and release gates.
- Invent files, paths, or features not listed in registry + evidence above.
- Activate GPS, camera, mic, health, gambling, emergency, soulmate/baby predictor, or marketplace automation without explicit boundary review.

## Cursor Builder Notes

- Read `data/z_master_module_registry.json` and this file together; registry ID is canonical.
- Do not claim **implemented** unless evidence paths above are present (or audit proves alternate evidence).
- Default deployment posture: **HOLD** unless AMK and Overseer workflow say otherwise.

## Zuno Verdict

`READY_FOR_SAFE_REFACTOR`
