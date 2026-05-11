# Z-API readiness and smoke gate

## Purpose

This doc ties **readiness** and **smoke** concepts to **Z-API-SPINE-1** and **Z-API-GATE** posture: command strings and evidence paths are **registered**, not **auto-run** by the spine validator in Phase 1.

## Definitions

| Term | Meaning here |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Smoke gate** | A documented command (or task) that proves a lane after intentional operator or CI invocation |
| **Readiness** | Evidence that metadata, build, and policy checks align — still not automatic permission to deploy |
| **Health path** | Optional HTTP path relative to `local_base_url`; **no default HTTP call** unless `allow_health_probe` is true and the operator passes `--with-health-probe` (loopback only) |

## Registry columns

Spine `services[]` rows include:

- `smoke_command` — advisory string (e.g. `npm run z:traffic`)
- `readiness_command` — advisory string (e.g. `npm run verify:md`)
- `allow_health_probe` — boolean; default **false**

`npm run z:api:readiness` prints a **charter summary** of those strings from `data/z_api_spine_registry.json` and **does not execute** them.

## Z-API-GATE alignment

The gate doctrine remains: **gates verify before work**; the spine **lists** which gate strings apply per service. Opening live gateways, meshes, or production routes requires a **separate charter** and AMK sign-off.

## Law

- Health check ≠ deploy readiness.
- GREEN validator signal ≠ deploy.
- Smoke command present ≠ smoke command executed by the spine.

## Z-SSWS-LINK-1 link

Workspace launch rows in `data/z_ssws_workspace_spine_registry.json` reference this doc via `api_readiness_ref` so **install / start / verify / smoke** strings stay aligned with API gate doctrine. The SSWS validator still **does not execute** those commands. See [Z_SSWS_WORKSPACE_SPINE.md](Z_SSWS_WORKSPACE_SPINE.md).

## Related

- [Z_API_SPINE_POWER_CELL.md](Z_API_SPINE_POWER_CELL.md)
- [AGENTS.md](../AGENTS.md) (verify intents and enforcer gates)
