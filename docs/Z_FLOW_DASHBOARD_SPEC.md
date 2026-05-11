<!-- Z: docs/Z_FLOW_DASHBOARD_SPEC.md -->

# Z-Flow Dashboard Spec (Read-Only Governance)

Purpose: define the governance cockpit as a read-only proof surface. It is not a control room.
The only action surface is human consent, and every action is logged.

## Layout (4 Panels)

1. Live Spine

- Stream of the latest events: Trigger -> Rule Matched -> Consent -> Action -> Result
- Color chips by risk class (low/medium/high/sacred)
- Click a row to open the Audit Card

1. Rule Registry

- List all rules with status (active/paused/draft), module, risk, last executed
- Filters: module, risk, consent level, status
- "View Rule JSON" (read-only)

1. Consent Center

- Queue of items requiring human approval
- Shows reason, risk, proposed actions, cooldown impact
- Buttons: Approve / Deny / Pause Module
- Every action is logged in the audit trail

1. Stability and Harm-Prevention

- GGAESP 360 indicators: momentum, stability, deviation, trend
- Wellbeing indicators: fatigue, stress, focus
- LPBS governor indicators: loop count, escalation rate, cooldown active
- "Interventions today" counter (nudges, cooldowns, emergency)

## Audit Card (Proof Receipt)

Fields:

- rule_id + rule_name
- trigger event
- snapshot hash + timestamp
- consent path (auto/notify/require human + decision)
- actions executed
- outcome
- ethical intent (audit seal)
- human override (if any)

## Config Schema

Dashboard configuration is defined in:

- `schemas/z_dashboard_config.schema.json`

This keeps the UI modular while preserving read-only governance intent.
