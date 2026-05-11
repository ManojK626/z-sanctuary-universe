# Phase ZSX-1 — Cross-project capability + service sync · Green receipt

## Scope

**Docs + metadata + local JSON validation only.**

Not in scope: backend, auth, accounts, cloud sync, live API bridge, provider calls, external APIs, analytics execution, payments, iframe embedding, shared memory runtimes, multiplayer, AI mini-bot deployment, live orchestration, deployment automation.

## Delivered artifacts

| Type | Path |
| --------------------- | ---------------------------------------------------------------- |
| Capability index | `data/z_cross_project_capability_index.json` |
| Entitlement catalog | `data/z_service_entitlement_catalog.json` |
| Shadow preview policy | `data/z_shadow_preview_policy.json` |
| Sync doc | `docs/cross-project/Z_CROSS_PROJECT_CAPABILITY_SYNC.md` |
| Entitlement policy | `docs/cross-project/Z_SERVICE_ENTITLEMENT_AND_PRICING_POLICY.md` |
| Shadow policy (human) | `docs/cross-project/Z_SHADOW_PREVIEW_POLICY.md` |
| Zuno knowledge guide | `docs/cross-project/ZUNO_SUPER_SAIYAN_KNOWLEDGE_GUIDE.md` |
| Validator (optional) | `scripts/z_cross_project_capability_sync.mjs` |

## Verify commands

From hub root (`ZSanctuary_Universe`):

```bash
node -e "JSON.parse(require('fs').readFileSync('data/z_cross_project_capability_index.json','utf8')); JSON.parse(require('fs').readFileSync('data/z_service_entitlement_catalog.json','utf8')); JSON.parse(require('fs').readFileSync('data/z_shadow_preview_policy.json','utf8')); console.log('ZSX-1 JSON OK')"
npm run z:cross-project:sync
npm run z:ai-builder:refresh
npm run z:car2
npm run dashboard:registry-verify
```

## Manual checklist

| Check | Pass |
| ------------------------------------------------------ | ---- |
| Law text matches: capability ≠ entitlement chain | ☐ |
| Questra rows cite `z_questra_capability_manifest.json` | ☐ |
| ZQuestCraft placeholder explicit (`manifest_pending`) | ☐ |
| Shadow policy requires source + version + not-live | ☐ |
| Zuno guide stays read-only / no fake humans | ☐ |
| No runtime bridge code added | ☐ |

## Operator sign-off

| Role | Name | Date |
| -------- | ---- | ---- |
| Operator | | |

## ZSX-1B — Navigator visibility (hub cockpit)

| Item | Detail |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Catalog row id | `zsx_cross_project_sync` |
| Rail category | `cross_project_bridges` |
| Surface | `dashboard/data/z_universe_service_catalog.json` + [Z_UNIVERSE_WORKSTATION_NAVIGATOR.md](../dashboard/Z_UNIVERSE_WORKSTATION_NAVIGATOR.md) |

Operators open **Cross-Project Capability Sync** in NAV-1 to reach the ZSX JSON files and cross-project docs from the detail panel (links only).

### ZSX-1B manual checklist

| Check | Pass |
| ----------------------------------------- | ---- |
| Row appears under Cross-project bridges | ☐ |
| Detail panel lists three JSON + five docs | ☐ |
| No new execute/run buttons in navigator | ☐ |

## Rollback

Delete the three JSON files under `data/`, remove `scripts/z_cross_project_capability_sync.mjs`, remove `z:cross-project:sync` from root `package.json`, delete `docs/cross-project/` ZSX-1 files listed above.

**ZSX-1B only:** remove the `zsx_cross_project_sync` service object from `dashboard/data/z_universe_service_catalog.json`, strip the ZSX-1B bullet from `docs/dashboard/Z_UNIVERSE_WORKSTATION_NAVIGATOR.md`, and remove the ZSX-1B section above from this file.
