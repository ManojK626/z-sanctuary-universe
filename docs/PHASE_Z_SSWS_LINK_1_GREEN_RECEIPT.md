# PHASE Z-SSWS-LINK-1 — Green receipt (manual)

## Scope sealed

This phase adds **registry + policy + validator + reports + AMK indicator wiring** only. It does **not** install extensions, start servers, open ports automatically, deploy, call providers, modify secrets, run launch commands from the validator, or dispatch autonomous tasks.

## Sealed receipt stamp

```text
Z-SSWS-LINK-1 is sealed as read-only launch requirements awareness.
No install, start, secret write, auto-launch, deploy, or bridge action is authorized by this receipt.
```

## Manual checklist

1. `node -e "JSON.parse(require('fs').readFileSync('data/z_ssws_workspace_spine_registry.json','utf8')); JSON.parse(require('fs').readFileSync('data/z_ssws_launch_requirements_policy.json','utf8')); console.log('Z-SSWS registry JSON OK')"`
2. `npm run z:ssws:requirements` — expect exit `0`; overall may be **BLUE** when `secrets_required` rows exist (human lane).
3. `npm run z:api:readiness` and `npm run z:api:spine` — still pass when present.
4. `npm run verify:md`
5. `npm run z:traffic` and `npm run z:car2`
6. Review `data/reports/z_ssws_launch_requirements_report.md` for projects, extension gaps, port collisions, and notification candidates.

## Law

```text
Launch requirement ≠ launch permission.
Extension requirement ≠ auto-install.
Start command ≠ execution.
Shadow workspace ≠ deploy.
GREEN ≠ auto-launch.
BLUE requires AMK.
RED blocks movement.
AMK-Goku owns sacred moves.
```

## Rollback

1. Remove npm script `z:ssws:requirements` and the minimabot line in `scripts/z_traffic_minibots_status.mjs` if fully reverting.
2. Remove indicator row `z_ssws_launch_requirements` and overlay wiring in `dashboard/scripts/amk-project-indicators-readonly.js`.
3. Delete or revert `data/z_ssws_workspace_spine_registry.json`, `data/z_ssws_launch_requirements_policy.json`, `scripts/z_ssws_launch_requirements_check.mjs`, example capsule, and SSWS docs.
4. Delete regenerable `data/reports/z_ssws_launch_requirements_report.*`.

## Sign-off

| Role | Action |
| ---------- | -------------------------------------------------------------------- |
| Maintainer | Confirms checklist and report |
| AMK | Confirms BLUE/RED notification policy for secrets and deploy posture |

Date / initials: \***\*\*\*\*\***\_\_\_\_\***\*\*\*\*\***
