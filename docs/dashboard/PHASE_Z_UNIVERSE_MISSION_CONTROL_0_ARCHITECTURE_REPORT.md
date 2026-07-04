# Phase Z-UNIVERSE-MC-0 — Architecture Report

**Project:** Z-Sanctuary Universe Mission Control  
**Date:** 2026-07-04  
**Posture:** Observer/orchestrator · Merge Hold · Runtime NOT AUTHORIZED

---

## Executive summary

Phase MC-0 defines **Mission Control architecture** for the AMK-Goku Indicator Dashboard: observer/orchestrator pipeline, standard **Zuno Universe Report** per department, separate health dimensions, gated one-click actions, and a **read-only Universe Status Engine** producing the first comprehensive ecosystem report.

**No dashboard UI changes in MC-0** — architecture + report script only.

---

## Deliverables

| Item | Location |
| ---- | -------- |
| Mission Control architecture | [Z_UNIVERSE_MISSION_CONTROL_ARCHITECTURE.md](Z_UNIVERSE_MISSION_CONTROL_ARCHITECTURE.md) |
| Universe report spec | [Z_ZUNO_UNIVERSE_REPORT_SPEC.md](Z_ZUNO_UNIVERSE_REPORT_SPEC.md) |
| Status engine doc | [Z_UNIVERSE_STATUS_ENGINE.md](Z_UNIVERSE_STATUS_ENGINE.md) |
| Department registry | `data/z_universe_department_registry.json` |
| Report script | `scripts/z_universe_status_report.mjs` |
| npm command | `npm run z:universe:status` |

---

## Design decisions

1. **Observer not controller** — pipeline ends at Human Approval before sacred actions.  
2. **No single health score** — eight separate dimension signals.  
3. **Standard report shape** — all departments comparable.  
4. **Track A priority** encoded in report priorities block.  
5. **Z-Connect frozen** — Mission Control does not expand Z-Connect architecture.

---

## Validation

```bash
npm run z:universe:status
```

Expect exit 0 and files under `data/reports/z_universe_status_report.{json,md}`.

---

## Next (blocked until AMK)

- MC-1: Dashboard panel overlay from report JSON  
- MC-2: Structured AI review attachments  
- MC-3: Gated workflow initiators (links only)

---

## Verdict

GREEN for architecture review · Observer/orchestrator · Runtime NOT AUTHORIZED
