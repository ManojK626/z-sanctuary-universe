# AMK-Goku Notifications Panel

**Purpose:** A **human confirmation cockpit** for recommended next tasks and lanes. The system **recommends**; **AMK-Goku (human)** confirms what may open next — **outside** this panel’s execution surface.

## Flow (conceptual)

- **Z-Traffic** recommends proceed / hold via minibots receipts.
- **ZAG** defines allowed autonomy (L0–L5).
- **VH100 / Z-MCBURB / Z-FBAP** classify risk and resilience posture (doctrine + metadata in current phases).
- **AMK-Goku** confirms the next lane in judgment and ritual — not by clicking “run” inside this UI in Phase AMK-NOTIFY-1.

## Phase AMK-NOTIFY-1 scope

- **Dashboard UI + local metadata + docs only.**
- **No** task execution, deploy, bridge, provider/API calls, billing or pricing changes, auto-merge, or live Cursor task dispatch from the panel.

## Where it lives

- **Data:** [data/amk_operator_notifications.json](../data/amk_operator_notifications.json) — lane cards (editable by operators).
- **Dashboard:** `dashboard/Html/index-skk-rkpk.html` + **shadow** workbench mirror — panel markup + `dashboard/scripts/amk-goku-notifications-readonly.js` + `dashboard/styles/amk-goku-notifications.css`.
- **Policy:** [AMK_GOKU_OPERATOR_CONFIRMATION_POLICY.md](./AMK_GOKU_OPERATOR_CONFIRMATION_POLICY.md).

## Cards (fields)

Each notification includes: `id`, `title`, `domain`, `recommended_by`, `signal` (GREEN / YELLOW / RED / BLUE), `risk_class`, `autonomy_level` (ZAG L0–L5), `status`, `required_checks`, `related_reports`, `related_docs`, `rollback_note`, `human_confirmation_required`, `forbidden_actions`.

## Buttons (Phase 1 behavior)

- **Confirm next lane / Hold / Needs review** — write **browser `localStorage` only** (`amkGokuNotificationDecision_v1`) as an **operator decision stub**.
- They **do not** run `npm`, Cursor tasks, or change repo files. To persist decisions in git, **manually** update `data/amk_operator_notifications.json` (or a future chartered export).

## Z-SSWS and shadow

- **Z-SSWS** remains the workspace signal spine: main notifications, shadow copies, pending queue summaries, traffic receipts — **observe / mirror / suggest** only.
- **Shadow** dashboards may mirror this panel; they must **not** execute, merge, deploy, bridge, bill, or rewrite source truth.

## Confirmation law

```text
Notification ≠ execution.
Confirmation ≠ deployment.
Recommendation ≠ permission.
AMK approval opens a lane; gates still verify before work.
```

## AMK-INDICATOR-1 (cross-surface)

The **Unified readiness indicators** board ([AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](./AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md)) complements this panel: notifications queue **lanes**; indicators summarize **systems** (traffic, ZAG, Z-SUSBV, VH100, NAV, ZSX, Cloudflare HOLD, etc.) with the same non-execution law. Use both when choosing the next Turtle slice.

## Z-AWARE-1 (RED / BLUE interrupt discipline)

**Z-AWARE-1** writes `data/reports/z_ecosystem_awareness_report.json` with `notification_candidates_red_blue_only`. **YELLOW** optional gaps should **not** become noisy lanes by default. Operators may copy a candidate into a new notification row or change a **held** template lane (`lane_z_aware_candidate_*`) to **pending** only when the report shows **RED** or **BLUE**. See [Z_ECOSYSTEM_AWARENESS_SPINE.md](./Z_ECOSYSTEM_AWARENESS_SPINE.md) and [Z_ECOSYSTEM_ALERT_POLICY.md](./Z_ECOSYSTEM_ALERT_POLICY.md).

## Related

- [Z_TRAFFIC_MINIBOTS.md](./Z_TRAFFIC_MINIBOTS.md)
- [Z_AUTONOMOUS_GUARDIAN_LOOP.md](./Z_AUTONOMOUS_GUARDIAN_LOOP.md)
- [PHASE_AMK_NOTIFY_1_GREEN_RECEIPT.md](./PHASE_AMK_NOTIFY_1_GREEN_RECEIPT.md)
- [AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](./AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md)
- [Z_ECOSYSTEM_AWARENESS_SPINE.md](./Z_ECOSYSTEM_AWARENESS_SPINE.md)
