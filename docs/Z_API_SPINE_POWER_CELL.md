# Z-API-SPINE-1 — Universal API Power Cell

## Purpose

**Z-API-SPINE-1** is the hub’s **read-only** catalog of APIs, frontends, workers, scripts, health paths, smoke and readiness command strings, ownership, risk class, autonomy posture, and deployment or Cloudflare labels across the Z-Sanctuary multiverse. It answers: _what exists, where it lives, who owns it, and what evidence is allowed to run automatically_ — without starting servers, opening gateways, or calling production.

This extends the **Z-API-GATE-1** idea from a single-project posture into a **universal registry**: the hub remains the **canonical awareness center**; sibling projects may publish small **service capsules** (see [Z_API_SERVICE_CAPSULE_POLICY.md](Z_API_SERVICE_CAPSULE_POLICY.md)) that the spine validator can aggregate later.

## Architecture roles (Phase 1 = metadata only)

| Concept | Phase 1 meaning |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **ZCPU core** | Central registry + readiness validator (`npm run z:api:spine`) |
| **ZGPU core** | AMK dashboard indicators and future topology map (SPINE-2+) |
| **Whale bus** | Event-bus ideas recorded in policy JSON only — no live bus |
| **AI Tower / observers** | Advisory roles in `data/z_api_spine_registry.json` — classify reports, no dispatch |
| **Quadruple spine** | `api_spine`, `data_spine`, `build_spine`, `oversight_spine`, `visual_dashboard_spine` lanes in the registry |

**Gateway API**, **service mesh**, **OpenTelemetry agents**, and **Cloudflare edge bind** remain **future charters** (SPINE-5+). Industry patterns (catalog, gateway, mesh, observability) inform direction; they are **not** activated by this phase.

## Artifacts

| Path | Role |
| -------------------------------------------------- | -------------------------------------------------------------------------- |
| `data/z_api_spine_registry.json` | Canonical registry: observer roles, spines, `services[]` |
| `data/z_api_communication_flow_policy.json` | Signals, collision rules, alert policy, DRP/DOP boundary notes |
| `data/z_api_service_registry.json` | Narrow API seed (e.g. AT Princess row) aligned to spine |
| `data/examples/z_api_service_capsule.example.json` | Capsule shape for per-project declarations |
| `scripts/z_api_spine_check.mjs` | Validator; writes `data/reports/z_api_spine_report.{json,md}` |
| `scripts/z_api_readiness_charter.mjs` | Phase 1 charter: lists smoke/readiness strings only — **does not execute** |

## Commands

```bash
npm run z:api:spine
npm run z:api:readiness
```

Optional (explicit only): `node scripts/z_api_spine_check.mjs --with-health-probe` — **loopback HTTP only** where `allow_health_probe` is true.

## Relations

- **AMK-MAP / HODP** — Control map may link sealed system row `z_api_spine` in `dashboard/data/amk_control_dashboard_map.json`.
- **AMK indicators** — Row `z_api_spine_power_cell` overlays from `data/reports/z_api_spine_report.json` when the dashboard is HTTP-served.
- **AAL / ZAG** — Autonomy policy lists `z:api:spine` as **L1 evidence**, not execution.
- **Z-Traffic** — Required minimabot runs `z:api:spine` with other tower checks.
- **Z-AWARE-1** — Ecosystem registry; spine focuses on **API and route** metadata.
- **Z-API-GATE** — Readiness and smoke doctrine; spine rows reference gate docs where relevant.
- **Z-SUSBV / Z-OMNAI** — Script lanes appear as `script_service` rows with human-gated commercial or provider actions.

## Law (non-negotiable)

- API spine ≠ API gateway.
- Registry ≠ live service mesh.
- Health check ≠ deploy readiness.
- Similar name ≠ shared entitlement.
- GREEN ≠ deploy.
- BLUE requires AMK.
- RED blocks movement.
- YELLOW stays quiet unless escalated.
- AMK-Goku owns sacred moves.

## Rollback

Remove or revert edits to `data/z_api_spine_registry.json` and `data/z_api_communication_flow_policy.json`, then re-run `npm run z:api:spine`. Reports are regenerable.

## Receipt

Manual checklist: [PHASE_Z_API_SPINE_1_GREEN_RECEIPT.md](PHASE_Z_API_SPINE_1_GREEN_RECEIPT.md).
