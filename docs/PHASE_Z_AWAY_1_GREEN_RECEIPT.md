# Phase Z-AWAY-1 — Green Receipt (Deep Turtle Away Mode)

**Phase:** Z-AWAY-1 — docs-only away-mode doctrine
**Scope:** Operator guidance for 1–2 week absence — **no** runtime, watchers, or queue execution
**Date:** 2026-05-22
**Prerequisites:** Hub read-only reports and dashboards (existing lanes)

## Deliverables

| Artifact | Status |
| -------- | ------ |
| `docs/Z_SANCTUARY_DEEP_TURTLE_AWAY_MODE.md` | Added |
| `docs/PHASE_Z_AWAY_1_GREEN_RECEIPT.md` | Added |
| `docs/INDEX.md` | Updated |
| `docs/AI_BUILDER_CONTEXT.md` | Updated |
| `docs/Z_SSWS_WORKSPACE_SPINE.md` | Updated |
| `dashboard/data/amk_project_indicators.json` | Advisory indicator row |

## Explicitly not in Z-AWAY-1

| Item | Posture |
| ---- | ------- |
| New watchers / cron | **Forbidden** |
| Scheduled automation | **Forbidden** |
| Background agents | **Forbidden** |
| Probe / deploy / Cloudflare | **Forbidden** |
| Task queue execution | **Forbidden** |

## Acceptance

- [x] Core law: observe lightly, report clearly, do nothing dangerous
- [x] Reporting chain and away indicators documented
- [x] Z-Zuno executive template included
- [x] Pre-departure and return rituals documented
- [x] Hard forbidden table includes queue non-execution
- [x] No runtime behavior added

## Verification

```bash
npm run verify:md
npm run z:traffic
npm run z:car2
```

ZCO npm commands verified when ZCO spine present on branch; optional on `main` until ZCO PR merges.

## Locked law

```text
Away mode = rest for the operator and quiet for the stack.
Doctrine ≠ automation.
```
