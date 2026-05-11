# Z-HUB-2.1 Monthly Review Template (Read-Only)

## Purpose

Use this template only when cadence follow-up is:

`READY_FOR_HUB_2_1_MONTHLY_REVIEW_TEMPLATE`

This document is an evidence drafting surface. It is **not** a deploy, runtime, provider, child-data, vault, or public-release approval.

## Operator quick-fill (2 minutes)

- Month: `<YYYY-MM>`
- Cadence overall: `<GREEN | YELLOW | BLUE | RED>`
- Cadence follow-up: `<CONTINUE_CADENCE | READY_FOR_HUB_2_1_MONTHLY_REVIEW_TEMPLATE | AMK_DECISION_REQUIRED | BLOCKED_RED>`
- Stable green detected: `<true|false>`
- AMK decision needed now: `<yes|no>`
- Decision or note: `<short note>`

## Inputs (report-only)

- `data/reports/z_cadence_cycle_report.json`
- `data/reports/z_cadence_cycle_report.md`
- `data/reports/z_logical_brains_hub_reference_report.json`
- `data/reports/z_sec_triplecheck_report.json`
- `data/reports/z_ide_fusion_report.json`
- `data/reports/z_traffic_minibots_status.json`
- `data/reports/z_car2_similarity_report.json`

## Monthly review header

- Review window: `<YYYY-MM>`
- Prepared by: `<operator>`
- Cadence status: `<GREEN | YELLOW | BLUE | RED>`
- Cadence follow-up: `<CONTINUE_CADENCE | READY_FOR_HUB_2_1_MONTHLY_REVIEW_TEMPLATE | AMK_DECISION_REQUIRED | BLOCKED_RED>`

## Core checks

1. Cadence cycle is read-only and allowlisted checks passed.
2. No forbidden lane behavior appears in cadence report.
3. Logical Brains remains reference-only and non-clinical.
4. Triple-check posture is acceptable for review drafting.
5. IDE fusion posture is acceptable for documentation coordination.
6. Traffic + CAR2 posture does not indicate blocked movement.

## Evidence summary

- Cadence overall signal: `<value>`
- Previous cadence signal: `<value>`
- Stable green detected: `<true|false>`
- Next follow-up: `<value>`
- Notification candidates: `<none|list>`
- Forbidden behavior confirmed absent: `<true|false>`

## AMK decision section

- AMK decision required now: `<yes|no>`
- If yes, reason: `<reason>`
- If no, maintain cadence rhythm and continue evidence refresh.

## Locked law reminder

```text
Cadence runner != deployment.
Follow-up notification != permission.
Two GREEN cycles != public release.
Auto-task follow-up != auto-execution.
GREEN != deploy.
BLUE requires AMK.
RED blocks movement.
AMK-Goku owns sacred moves.
```

## Output of this template

- Allowed output: monthly review note and next read-only cadence plan.
- Not allowed output: deploy approval, runtime bridge approval, provider/child-data/vault lane opening, public launch approval.
