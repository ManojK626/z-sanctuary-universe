# Z-API communication flow policy

## Purpose

`data/z_api_communication_flow_policy.json` defines **how signals and collisions are interpreted** for **Z-API-SPINE-1**: route and dependency validation rules, wording collision caution, allowed automatic checks versus human-gated actions, and default **AMK notification** posture.

This file is **policy metadata**. It does not configure a live API gateway, service mesh, or traffic split.

## Signals

| Signal | Meaning |
| ------ | ---------------------------------------------------------------------------------------------------- |
| GREEN | Required registry rows validate; no unsafe collisions. |
| YELLOW | Advisory: optional unknowns, reference placeholders, naming similarity, or non-blocking probe noise. |
| BLUE | Human decision for deploy, bridge, provider, billing, or security posture. |
| RED | Malformed required data, duplicate identity, or unsafe route collision in elevated environments. |

## Collision rules (summary)

- **Route families:** Two services must not claim the same normalized `route_family` in production-like environments without `explicit_route_sharing_with` documenting the relationship. Reference-only rows may overlap without raising severity.
- **Wording:** Similar `display_name` strings with different `risk_class` produce **YELLOW** advisory issues — no automatic entitlement across services.
- **Base URL + health path:** Duplicate non-empty combinations are flagged; duplicate **with** `allow_health_probe` on multiple rows is treated as **RED**.

## Notifications

Default **notify** list: **RED** and **BLUE** only. **GREEN**, **YELLOW**, **GOLD**, **PURPLE**, and **UNKNOWN** stay dashboard evidence unless AMK promotes a lane in `data/amk_operator_notifications.json`.

## DRP and DOP

Sacred and commercial truth, live bridges, and rollout (canary, staged routing) remain **human-gated** per project charters and completion-flow docs. The spine may **list** `human_gated_actions` and `forbidden_auto_actions` per service; it does not enforce runtime policy.

## Law

Same as [Z_API_SPINE_POWER_CELL.md](Z_API_SPINE_POWER_CELL.md): API spine ≠ gateway; registry ≠ mesh; GREEN ≠ deploy; BLUE requires AMK; RED blocks movement.

## Related

- [Z_API_SPINE_POWER_CELL.md](Z_API_SPINE_POWER_CELL.md)
- [Z_API_SERVICE_CAPSULE_POLICY.md](Z_API_SERVICE_CAPSULE_POLICY.md)
- [Z_API_READINESS_AND_SMOKE_GATE.md](Z_API_READINESS_AND_SMOKE_GATE.md)
