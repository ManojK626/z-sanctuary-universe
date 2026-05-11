# Phase ZMV-1A — Magical Visual Bridge Registry + Ecosphere Map policy · Green receipt

## Scope

**Docs + metadata + read-only NAV catalog reference only.**

Not in scope: backend, auth, accounts, provider calls, external APIs, Cloudflare deployment changes, payments, billing execution, entitlement enforcement, shared memory, iframe embedding, live service bridge, cross-project runtime coupling.

## Delivered

| Item | Path |
| -------------------------- | ------------------------------------------------------------------------------- |
| Visual capability registry | `data/z_magical_visual_capability_registry.json` |
| Bridge policy | `docs/cross-project/Z_MAGICAL_VISUAL_BRIDGE_POLICY.md` |
| Entitlement boundary | `docs/cross-project/Z_MAGICAL_VISUAL_ENTITLEMENT_BOUNDARY.md` |
| Ecosphere map design | `docs/dashboard/Z_SANCTUARY_LIVING_ECOSPHERE_MAP.md` |
| NAV catalog row | `dashboard/data/z_universe_service_catalog.json` (`zmv_magical_visual_bridge`) |
| Navigator pointer | `docs/dashboard/Z_UNIVERSE_WORKSTATION_NAVIGATOR.md` |
| Sync validator | `scripts/z_cross_project_capability_sync.mjs` (also validates magical registry) |

## Verify (hub root)

```bash
node -e "JSON.parse(require('fs').readFileSync('data/z_magical_visual_capability_registry.json','utf8')); console.log('ZMV JSON OK')"
npm run z:cross-project:sync
npm run dashboard:registry-verify
npm run z:car2
npm run verify:md
```

## Manual checklist

| Check | Pass |
| -------------------------------------- | ---- |
| Registry rows include required fields | ☐ |
| Golden law echoed in policy docs | ☐ |
| No runtime bridge or deploy code added | ☐ |
| NAV shows Magical Visual Bridge row | ☐ |

## Operator sign-off

| Role | Name | Date |
| -------- | ---- | ---- |
| Operator | | |

## Rollback

Remove `data/z_magical_visual_capability_registry.json`, the four docs above, the catalog row + category (and service-map accent if added), revert navigator bullet, revert sync script changes.
