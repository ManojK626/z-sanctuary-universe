# Phase ZCO-8 — Green Receipt (Probe Charter Doctrine)

**Phase:** ZCO-8 — doctrine only
**Scope:** Probe charter markdown — **no** probe scripts, shell, network, or hardware control
**Date:** 2026-05-21
**Prerequisites:** ZCO-7 dashboard embed sealed

## Deliverables

| Artifact | Status |
| -------- | ------ |
| `docs/compute-organism/ZCO_8_PROBE_CHARTER_DOCTRINE.md` | Added |
| `docs/compute-organism/PHASE_ZCO_8_GREEN_RECEIPT.md` | Added |
| `data/z_ecosystem_growth_stage_registry.json` | ZCO-8 entry |
| Architecture roadmap | ZCO-8 sealed; ZCO-9+ = future probe implementation |

## Explicitly not in ZCO-8

| Item | Posture |
| ---- | ------- |
| Probe scripts | **Deferred** (ZCO-9+ with separate receipt) |
| WMI / BIOS / driver queries | **Forbidden** until chartered |
| Network scan | **Forbidden** by default |
| Dashboard control buttons | **Forbidden** |

## Acceptance

- [x] Charter states explicit opt-in, local-only, read-only defaults
- [x] Forbidden list includes telemetry, control, remote scan, auto-cluster
- [x] AMK + Z-ATE gates documented for any future implementation
- [x] No new npm probe commands in this phase

## Verification

```bash
npm run verify:md
```

No new runtime commands required for ZCO-8.

## Locked law

```text
ZCO-8 = future probe boundaries on paper only.
Charter ≠ deploy ≠ probe execution.
```
