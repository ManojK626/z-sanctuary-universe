# Zuno Advisor Console (AAL-1)

**Purpose:** A **read-only** “second guide” surface on the **AMK-Goku Main Control** dashboard that answers common operator questions using **local JSON**, optional **report fetches** (traffic, indicators), and **deterministic string rules** — not an LLM, not voice, not execution.

## Where it lives

- **Data:** [`dashboard/data/amk_autonomous_approval_ladder.json`](../dashboard/data/amk_autonomous_approval_ladder.json) — ladder levels, auto-lane task rows, sacred-lane task rows, law note, supported prompt list.
- **UI:** `dashboard/Html/amk-goku-main-control.html` — section `data-amk-section="advisor"` (hidden on **Kids** and **Public Visitor** domain lenses).
- **Script:** `dashboard/scripts/amk-zuno-advisor-readonly.js`
- **Styles:** `dashboard/styles/amk-zuno-advisor.css`

## Supported prompts (phase 1)

Typed into the box; click **Get guidance** (no network AI call):

- What should I do next?
- What is blocked?
- What can auto-advance?
- What needs AMK approval?
- Is Cloudflare ready?

Answers combine: Z-Traffic chief signal (when `data/reports/z_traffic_minibots_status.json` loads), indicator Cloudflare block (when `dashboard/data/amk_project_indicators.json` loads), and ladder task rows.

## What is explicitly not in AAL-1

- No live AI / LLM API.
- No voice, microphone, camera, or GPS capture.
- No `npm run`, Cursor task dispatch, deploy, bridge, billing, auto-merge, or provider calls from buttons.
- **One-click** in later phases = **review bundle / receipt preparation** only — not launch.
- **Voice** = future-gated until consent UX, privacy policy, and DRP review.

## Local acknowledgement

**Mark advisor board reviewed** stores a timestamp in **browser `localStorage` only** — same discipline as other AMK read-only panels.

## Law

```text
Advisor ≠ executor.
Approval ≠ deployment.
Auto-lane ≠ unrestricted autonomy.
One click ≠ launch.
AMK-Goku owns sacred moves.
```

## Related

- [AMK_AUTONOMOUS_APPROVAL_LADDER.md](./AMK_AUTONOMOUS_APPROVAL_LADDER.md)
- [PHASE_AAL_1_GREEN_RECEIPT.md](./PHASE_AAL_1_GREEN_RECEIPT.md)
- [AMK_GOKU_MAIN_CONTROL_DASHBOARD.md](./AMK_GOKU_MAIN_CONTROL_DASHBOARD.md)
