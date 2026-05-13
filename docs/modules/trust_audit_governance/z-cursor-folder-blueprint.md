# Z-Cursor folder blueprint (hub spine)

## Registry Identity

| Field | Value |
| --- | --- |
| **ID** | `z-cursor-folder-blueprint` |
| **Category** | trust_audit_governance |
| **Registry status** | implemented |
| **Safety class** | low |
| **Z registry ZID** | z-cursor-folder-blueprint |
| **Zuno audit status** | FOUND_FULL |

## Purpose

JSON blueprint + bootstrap/verify scripts and operator doc so Cursor AI and humans keep the same directory spine across Cursor versions and multi-root workspaces.

## Current Evidence

- `docs/Z-CURSOR-FOLDER-STRUCTURE-AND-AI-WORKFLOWS.md` — **present**

## Current Build Posture

Registry lists **implemented**. Declared paths exist — implementation evidence present at file level (runtime behaviour not asserted here).

## Safety Boundaries

Cross-check hub safety doctrine (generator suggestions only — human authority wins):

_No keyword-boundary match for this module. See hub [Z_SANCTUARY_SAFETY_INDEX.md](../../Z_SANCTUARY_SAFETY_INDEX.md) and `docs/safety/`._

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
