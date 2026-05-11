# Z-AWARE-1 — Universal Ecosystem Awareness Spine

**Purpose:** One **central read-only** awareness layer in **ZSanctuary_Universe** so sibling and satellite projects can declare posture through **small capsules** instead of copying full doctrine into every repo. The hub aggregates registry rows, optional capsules, and alert policy into **reports** and **AMK indicators** — without deployment, billing, provider calls, bridges, or autonomous execution.

## Core design

- **Canonical law** lives in the hub (`docs/`, `data/`, `AGENTS.md`, registries).
- **Project capsule** — small JSON per project (or empty with `known_hold_reason` when optional/external).
- **Awareness report** — `npm run z:ecosystem:awareness` writes `data/reports/z_ecosystem_awareness_report.{json,md}`.
- **AMK indicator** — row `z_ecosystem_awareness_spine` in `dashboard/data/amk_project_indicators.json` (overlay from report when HTTP-served).
- **Notifications** — only **RED** and **BLUE** are interrupt-class; **YELLOW** stays quiet unless you escalate. See [Z_ECOSYSTEM_ALERT_POLICY.md](./Z_ECOSYSTEM_ALERT_POLICY.md).

## What connects here

- **AMK-MAP**, **AMK indicators**, **AMK notifications**, **AAL / Zuno Advisor**, **Z-Traffic**, **ZAG** (`data/z_autonomy_task_policy.json`), **Z-SUSBV**, **Z-OMNAI** read-only lanes, API readiness references (metadata), and **AI Tower** Sage / Warrior / Shadow as **advisory role labels only** (no fake live counts, no execution).

## Complete awareness test (safe)

The validator checks (without running every sibling heavy build):

- Registry rows are well formed.
- Capsule exists when `required_for_daily_status` is true.
- Capsule schema and required fields when file exists.
- `deployment_status`, `autonomy_level`, `human_gated_actions`, and docs or `known_hold_reason` posture.
- Optional projects missing capsules produce **YELLOW**, not RED.
- **RED** only when a **required** project is malformed or a critical gate fails.

## Law

```text
Awareness ≠ execution.
Capsule ≠ entitlement.
Indicator ≠ permission.
GREEN ≠ deploy.
BLUE requires AMK.
RED blocks movement.
YELLOW is quiet advisory unless escalated.
AMK-Goku owns sacred moves.
```

## Related

- [Z_PROJECT_AWARENESS_CAPSULE_POLICY.md](./Z_PROJECT_AWARENESS_CAPSULE_POLICY.md)
- [Z_ECOSYSTEM_ALERT_POLICY.md](./Z_ECOSYSTEM_ALERT_POLICY.md)
- [PHASE_Z_AWARE_1_GREEN_RECEIPT.md](./PHASE_Z_AWARE_1_GREEN_RECEIPT.md)
- [AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](./AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md)
- [AMK_GOKU_NOTIFICATIONS_PANEL.md](./AMK_GOKU_NOTIFICATIONS_PANEL.md)
- [Z_TRAFFIC_MINIBOTS.md](./Z_TRAFFIC_MINIBOTS.md)
