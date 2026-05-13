# Z-Add On Dashboard (staging)

## Registry Identity

| Field | Value |
| --------------------- | --------------------------- |
| **ID** | `z-addon-dashboard-surface` |
| **Category** | trust_audit_governance |
| **Registry status** | implemented |
| **Safety class** | low |
| **Z registry ZID** | z-addon-dashboard-surface |
| **Zuno audit status** | FOUND_FULL |

## Purpose

Data-driven HTML staging for new flows and modules before fusion to main SKK and RKPK. State file lists items and fusion policy. Secondary to index-skk-rkpk; linked from Control Centre Build and automate.

## Current Evidence

- `dashboard/Html/z-addon-dashboard.html` — **present**

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
