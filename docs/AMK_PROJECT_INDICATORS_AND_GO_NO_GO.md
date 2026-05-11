# AMK project indicators and Go/No-Go (AMK-INDICATOR-1)

**Purpose:** One **read-only** registry and dashboard surface so AMK-Goku can see **internal readiness** (traffic-style signals, growth percent bands, next actions, and advisory Go/No-Go labels) for major Z-Sanctuary systems **without** hunting folders. This layer **summarizes** posture; it does **not** open lanes, deploy, bill, or run tools.

## Where it lives

| Artifact | Role |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dashboard/data/amk_project_indicators.json` | Canonical indicator rows + Cloudflare Go/No-Go block |
| `dashboard/scripts/amk-project-indicators-readonly.js` | Loads JSON, optional overlays from hub **report** JSON (when served over HTTP), sorts cards, renders Cloudflare card |
| `dashboard/styles/amk-project-indicators.css` | Pills, bars, posture chip row, advisory law list, panel layout |
| `dashboard/Html/index-skk-rkpk.html` + shadow workbench | Fixed **left** panel: indicators + Cloudflare card |
| `dashboard/Html/amk-goku-main-control.html` | Collapsible section `data-amk-section="indicators"` (hidden on **Kids** and **Public Visitor** domain lenses via `amk_control_dashboard_map.json`) |

## Signals (color pills)

| Signal | Meaning (internal) | Typical operator posture |
| ---------- | ------------------------------------------------ | ------------------------------------------------ |
| **GREEN** | Ready to consider the next **normal** local lane | Proceed only if AMK chooses |
| **YELLOW** | Honest caution / optional gap | Hold or narrow cleanup slice |
| **BLUE** | Human decision needed | AMK approval before widening scope |
| **RED** | Blocked or failed gate | Fix evidence before treating as clear |
| **PURPLE** | Future-gated / visionary | Do not treat as active commercial or deploy lane |
| **GOLD** | Sealed baseline / trusted doctrine slice | Safe archive posture for that subsystem |

**UNKNOWN** appears when a row intentionally has no static signal until a **report overlay** loads, or when fetch fails — the UI **must not** fabricate GREEN.

Optional row fields (rendered when present):

- **`posture_chips`** — short uppercase chips (e.g. ADVISORY, NO EXECUTION) for glance posture.
- **`advisory_law_lines`** — bullet law lines shown under the readiness label (still not execution).

## Growth percentage bands (internal only)

Percent reflects **hub maturity for operators**, not a public certification:

| Range | Meaning |
| ----- | ----------------------------------------------------------------------------- |
| 0–25 | Concept / doctrine |
| 26–50 | Metadata / docs / policy |
| 51–75 | Validator / report / dashboard-visible evidence |
| 76–90 | Tested local baseline |
| 91–99 | Release-candidate review |
| 100 | Human-signed release or deploy-ready **receipt** (still not automatic deploy) |

## Go/No-Go labels (advisory)

Examples used in JSON: `GO_FOR_LOCAL_REVIEW`, `PREPARE_FOR_RELEASE_REVIEW`, `NO_GO_FOR_DEPLOY`, `NO_GO_FOR_PUBLIC_PRICING`, `BLUE_HUMAN_DECISION_REQUIRED`, `BLOCKED_BY_RED_GATE`. These are **labels for judgment**, not Terraform, not Cloudflare API calls, not CI auto-promotion.

## Cloudflare / edge readiness card

The JSON block `cloudflare_go_no_go` stays on **HOLD** until a separate human-approved deployment lane exists. The card lists **required gates**, **blocked categories**, and states that **human approval** is required. It mirrors the hub posture: edge hosting remains **optional contingency** per existing Cloudflare precautions docs — see `docs/Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md`.

## How this connects to other surfaces

- **AMK-MAP** — Same domain lens map; indicators section is another sealed read-only slice.
- **AMK-Goku Notifications** — Notifications recommend lanes; indicators show **cross-system** readiness. Same law: no execution from the browser UI.
- **Z-Traffic Minibots** — `traffic_chief.overall_signal` can **overlay** the Z-Traffic row when `data/reports/z_traffic_minibots_status.json` is reachable.
- **Z-IDE-FUSION-1** — `overall_signal` from `data/reports/z_ide_fusion_report.json` overlays IDE coordination posture (session alignment, handoff status, conflict risk); advisory-only.
- **Z-SEC-TRIPLECHECK-1** — `overall_signal` from `data/reports/z_sec_triplecheck_report.json` overlays communication-flow and safety-drift audit posture; advisory-only.
- **Z-LOGICAL-BRAINS-HUB-1** — `data/reports/z_logical_brains_hub_reference_report.json` tracks Labs capsule visibility as reference-only monitoring; never runtime coupling.
- **Z-CADENCE-1** — `data/reports/z_cadence_cycle_report.json` tracks allowlisted cadence-cycle status and follow-up recommendations; advisory-only and never deployment permission.
- **Z-MOD-DIST-1** — `signal` from `data/reports/z_mod_dist_report.json` overlays the routing advisor row when reachable; advisory-only.
- **Z-XBUS-GATE-1** — `overall_signal` from `data/reports/z_xbus_connector_gate_report.json` overlays connector governance (registry ≠ live connector); advisory-only.
- **Z-LEGAL-OPS-1** — `signal` from `data/reports/z_legal_ops_report.json` overlays legal workstation governance posture; advisory-only and never legal advice authority.
- **Z-LEGAL-PRODUCT-OPS-1** — `signal` from `data/reports/z_legal_product_ops_report.json` overlays product/IP legal workstation posture; advisory-only and never launch/manufacturing authority.
- **Z-SSWS-COCKPIT-1** — `overall_signal` from `data/reports/z_ssws_cockpit_report.json` overlays cockpit vs deep-work orchestration (dry-run plan only; no auto-launch).
- **ZAG** — Autonomy policy JSON informs the ZAG row; widening dispatch stays outside this UI.
- **ZSUSBV Benchmark Overseer** — Overseer report can overlay the commercial benchmark row (`overseer_signal`).
- **VH100 / MCBURB / FBAP** — Doctrine + JSON posture rows (read-only).
- **NAV / ZSX / ZMC** — Navigator catalog, cross-project index, and magical registry placeholders as separate rows.
- **Z-QUESTRA / ÉirMind / ZQuestCraft** — Local lab vs satellite reference vs placeholder honesty.
- **Autonomous / background AI reports** — May feed indicators **only** as read-only JSON evidence when fetched; they never grant permission.

## Sort order (UI)

1. RED
2. BLUE
3. YELLOW
4. GREEN
5. GOLD
6. PURPLE
7. UNKNOWN (missing overlay / null signal)

## Z-AAL (AAL-1) cross-surface

**Z Autonomous Approval Ladder** and the **Zuno Advisor Console** on the AMK main control classify **auto-lane candidates** vs **AMK sacred lane** and answer deterministic prompts locally — still no execution from the browser. See [AMK_AUTONOMOUS_APPROVAL_LADDER.md](./AMK_AUTONOMOUS_APPROVAL_LADDER.md), [AMK_ZUNO_ADVISOR_CONSOLE.md](./AMK_ZUNO_ADVISOR_CONSOLE.md), and [PHASE_AAL_1_GREEN_RECEIPT.md](./PHASE_AAL_1_GREEN_RECEIPT.md). The indicator row `z_aal_advisor` in `dashboard/data/amk_project_indicators.json` tracks this slice at a glance.

## Z-AWARE-1 (ecosystem spine)

**Z-AWARE-1** aggregates `data/z_ecosystem_awareness_registry.json` + project capsules into `data/reports/z_ecosystem_awareness_report.json`. The indicator row `z_ecosystem_awareness_spine` overlays **overall_signal** when the report is reachable over HTTP. **RED/BLUE** rows in `notification_candidates_red_blue_only` are the only default interrupt class; **YELLOW** stays quiet on notifications unless you escalate. See [Z_ECOSYSTEM_AWARENESS_SPINE.md](./Z_ECOSYSTEM_AWARENESS_SPINE.md) and [Z_ECOSYSTEM_ALERT_POLICY.md](./Z_ECOSYSTEM_ALERT_POLICY.md).

## Z-API-SPINE-1 (API power cell)

**Z-API-SPINE-1** validates `data/z_api_spine_registry.json` and `data/z_api_communication_flow_policy.json`, then writes `data/reports/z_api_spine_report.json`. The indicator row `z_api_spine_power_cell` overlays **overall_signal** when that report is reachable over HTTP. Same notification law as Z-AWARE-1: default **RED/BLUE** candidates only. This slice is **not** an API gateway and not a service mesh. See [Z_API_SPINE_POWER_CELL.md](./Z_API_SPINE_POWER_CELL.md) and [Z_API_COMMUNICATION_FLOW_POLICY.md](./Z_API_COMMUNICATION_FLOW_POLICY.md).

## Z-SSWS-LINK-1 (workspace launch requirements)

**Z-SSWS-LINK-1** validates `data/z_ssws_workspace_spine_registry.json` and `data/z_ssws_launch_requirements_policy.json`, then writes `data/reports/z_ssws_launch_requirements_report.json`. The indicator row `z_ssws_launch_requirements` overlays **overall_signal** when that report is reachable over HTTP. **BLUE** is expected when a project row declares `secrets_required` or other human gates; this is still **read-only** evidence — no extension install, server start, or auto-launch from the dashboard. See [Z_SSWS_WORKSPACE_SPINE.md](./Z_SSWS_WORKSPACE_SPINE.md) and [Z_SSWS_LAUNCH_REQUIREMENTS_POLICY.md](./Z_SSWS_LAUNCH_REQUIREMENTS_POLICY.md).

## Z-SSWS-DOOR-1 (AMK Workspace Doorway)

**Z-SSWS-DOOR-1** adds `data/amk_workspace_doorway_registry.json`, `npm run amk:doorway:status`, and `scripts/amk_open_workspace_doors.ps1` for **folder and workspace file opens only**. The indicator row `amk_workspace_doorway` overlays **overall_signal** from `data/reports/amk_workspace_doorway_status.json` when reachable over HTTP. **Go/No-Go** stays `NO_GO_FOR_AUTO_LAUNCH`: the dashboard should surface **copy-command** posture until a separate local helper or protocol is chartered. See [AMK_WORKSPACE_DOORWAY.md](./AMK_WORKSPACE_DOORWAY.md) and [PHASE_Z_SSWS_DOOR_1_GREEN_RECEIPT.md](./PHASE_Z_SSWS_DOOR_1_GREEN_RECEIPT.md).

## Z-SSWS-LAB-1 (Cursor workspace control)

**Z-SSWS-LAB-1** adds `workspaces/AMK-Goku-Super-Saiyan-Main.code-workspace`, `workspaces/AMK-Goku-Z-Lab.code-workspace`, `data/amk_cursor_workspace_profiles.json`, and `npm run amk:workspace:profiles` so AMK can use **one main cockpit** plus **deep-work** splits at the **workspace layer only** (no repo fusion, no server start). The indicator row `amk_cursor_workspace_profiles` overlays **overall_signal** from `data/reports/amk_cursor_workspace_profiles_report.json` when reachable over HTTP. See [AMK_CURSOR_WORKSPACE_STRATEGY.md](./AMK_CURSOR_WORKSPACE_STRATEGY.md) and [PHASE_Z_SSWS_LAB_1_GREEN_RECEIPT.md](./PHASE_Z_SSWS_LAB_1_GREEN_RECEIPT.md).

## Z-AMK-GTAI-1 (Strategy Council reports)

**Z-AMK-GTAI-1** adds `data/z_amk_gtai_strategy_council.json` and `npm run z:amk:strategy` to produce **read-only** `data/reports/z_amk_gtai_strategy_report.{json,md}` — a single rollup of traffic, SSWS, doorway, workspace profiles, OMNAI, SUSBV, CAR², and optional sources. The indicator row `z_amk_gtai_strategy_council` overlays **overall_signal** when the report is reachable over HTTP. **Go/No-Go** is **ADVISORY_ONLY** — strategy report ≠ execution. See [Z_AMK_GTAI_STRATEGY_COUNCIL.md](./Z_AMK_GTAI_STRATEGY_COUNCIL.md) and [PHASE_Z_AMK_GTAI_1_GREEN_RECEIPT.md](./PHASE_Z_AMK_GTAI_1_GREEN_RECEIPT.md).

## AMK-AI-SYNC-1 (indicator sync observer + AI team router)

**AMK-AI-SYNC-1** is **`npm run amk:ai-sync`**: it reads **`data/amk_ai_team_router_registry.json`**, routed samples, and lightweight hub hints (**`dashboard/data/amk_project_indicators.json`**, **`package.json`**, **`data/reports/**` baseline names**) and writes **`data/reports/amk_ai_team_sync_report.{json,md}`** containing **decision packets** (`recommended_ai_team`, suggested `npm run` checks — **routing evidence**, not authority). **Phase 1 validators do not silently rewrite indicators.** The **`amk_ai_team_indicator_sync`** row overlays **`signal`** when **`amk_ai_team_sync_report.json`** loads over HTTP. **Go/No-Go**: **DECISION_ROUTING_ONLY\*\*.

## Z-AI-FUSION-MAP-1 (capability overlap governance)

**Z-AI-FUSION-MAP-1** is **`npm run z:ai:fusion-map`**, reading **`data/z_ai_fusion_capability_registry.json`** + paired samples → **`data/reports/z_ai_fusion_map_report.{json,md}`** with **`overlap_numeric_score`**, qualitative band commentary, and `fusion_recommended_decision`. Validators emit **nothing** resembling merge automation. Indicator **`z_ai_fusion_capability_map`** overlays **`signal`** via **`z_ai_fusion_map_report.json`**. **Go/No-Go**: **CAPABILITY_GOVERNANCE_ONLY**.

## Z-MOD-DIST-1 + AMK-DASH-MOD-DIST-1 (module routing advisor)

**Z-MOD-DIST-1** is the read-only **`npm run z:mod:dist`** router (registry + samples → `data/reports/z_mod_dist_report.{json,md}`). **AMK-DASH-MOD-DIST-1** improves the **`z_mod_dist_routing_advisor`** indicator row: posture chips, advisory law lines, Markdown report listed first, and **live overlay** of **`signal`** from `z_mod_dist_report.json` when the dashboard is served from repo root (**no validator code change**, **no execution**). **Go/No-Go** stays **ADVISORY_ROUTING_ONLY**. See [Z_MOD_DIST_MODULE_DISTRIBUTOR.md](./Z_MOD_DIST_MODULE_DISTRIBUTOR.md), [PHASE_Z_MOD_DIST_1_GREEN_RECEIPT.md](./PHASE_Z_MOD_DIST_1_GREEN_RECEIPT.md), and [PHASE_AMK_DASH_MOD_DIST_1_GREEN_RECEIPT.md](./PHASE_AMK_DASH_MOD_DIST_1_GREEN_RECEIPT.md).

## Z-XBUS-GATE-1 (external connector governance)

**Z-XBUS-GATE-1** is **`npm run z:xbus:gate`** (registry + policy + classifier fixtures → `data/reports/z_xbus_connector_gate_report.{json,md}`). The indicator row **`z_xbus_connector_gate`** overlays **`overall_signal`** when the report is reachable over HTTP. **Go/No-Go** stays **CONNECTOR_GOVERNANCE_ONLY**: registry ≠ live connector, mock ≠ customer data. See [Z_XBUS_EXTERNAL_CONNECTOR_GATE.md](./Z_XBUS_EXTERNAL_CONNECTOR_GATE.md), [Z_XBUS_CONNECTOR_SECURITY_POLICY.md](./Z_XBUS_CONNECTOR_SECURITY_POLICY.md), and [PHASE_Z_XBUS_GATE_1_GREEN_RECEIPT.md](./PHASE_Z_XBUS_GATE_1_GREEN_RECEIPT.md).

## Z-SSWS-COCKPIT-1 (workspace cockpit orchestrator)

**Z-SSWS-COCKPIT-1** is **`npm run z:ssws:cockpit`**: it reads `data/z_ssws_cockpit_registry.json`, verifies **Phase 1 posture** (dry-run only, no auto-launch, no live NAS/Cloud/sync defaults), **mirrors** `data/reports/z_pc_ide_path_report.json` and `data/reports/z_ide_fusion_report.json`, and writes `data/reports/z_ssws_cockpit_report.{json,md}` with a **text-only** suggested `code`/`cursor` listing. The indicator row **`z_ssws_super_saiyan_cockpit`** overlays **`overall_signal`** when the report is reachable over HTTP. **Go/No-Go** stays **WORKSPACE_ORCHESTRATION_ONLY**. See [Z_SSWS_SUPER_SAIYAN_WORKSPACE_COCKPIT.md](./Z_SSWS_SUPER_SAIYAN_WORKSPACE_COCKPIT.md) and [PHASE_Z_SSWS_COCKPIT_1_GREEN_RECEIPT.md](./PHASE_Z_SSWS_COCKPIT_1_GREEN_RECEIPT.md).

## Z-ROOT-7 (Seven Guardian Coordination)

**Z-ROOT-7** adds `data/z_root_guardian_coordination.json` and a **symbolic** Milky Way guardian council on `dashboard/Html/amk-goku-main-control.html` (CSS + read-only script). **Z-ROOT-7B** upgrades it to **3D-lite**: CSS perspective, layered stars, orbital ellipses, JSON `tz` depth, tilt cards, optional slow orbit drift, and pointer parallax — **still no WebGL**. The indicator row `z_root_7_guardian_coordination` is **ADVISORY_VISUAL_ONLY** with a fixed **GREEN** metadata signal — not live health. Guardian mascots are **not** factual animal or mystical claims; no execution, research, or APIs. See [Z_ROOT_7_GUARDIAN_COORDINATION_LAYER.md](./Z_ROOT_7_GUARDIAN_COORDINATION_LAYER.md), [PHASE_Z_ROOT_7_GREEN_RECEIPT.md](./PHASE_Z_ROOT_7_GREEN_RECEIPT.md), [PHASE_Z_ROOT_7B_3D_GREEN_RECEIPT.md](./PHASE_Z_ROOT_7B_3D_GREEN_RECEIPT.md).

## Law (all future notifications and boards)

```text
Indicator ≠ permission.
Percentage ≠ certification.
Go/No-Go ≠ deployment.
Notification ≠ execution.
Autonomous AI report ≠ human approval.
AMK-Goku opens lanes.
Gates verify before work.
```

## Related docs

- [AMK_GOKU_NOTIFICATIONS_PANEL.md](./AMK_GOKU_NOTIFICATIONS_PANEL.md)
- [AMK_GOKU_MAIN_CONTROL_DASHBOARD.md](./AMK_GOKU_MAIN_CONTROL_DASHBOARD.md)
- [Z_TRAFFIC_MINIBOTS.md](./Z_TRAFFIC_MINIBOTS.md)
- [Z_AUTONOMOUS_GUARDIAN_LOOP.md](./Z_AUTONOMOUS_GUARDIAN_LOOP.md)
- [commercial/Z_SUSBV_BENCHMARK_OVERSEER.md](./commercial/Z_SUSBV_BENCHMARK_OVERSEER.md)
- [PHASE_AMK_INDICATOR_1_GREEN_RECEIPT.md](./PHASE_AMK_INDICATOR_1_GREEN_RECEIPT.md)
- [AMK_AUTONOMOUS_APPROVAL_LADDER.md](./AMK_AUTONOMOUS_APPROVAL_LADDER.md)
- [AMK_ZUNO_ADVISOR_CONSOLE.md](./AMK_ZUNO_ADVISOR_CONSOLE.md)
- [Z_ECOSYSTEM_AWARENESS_SPINE.md](./Z_ECOSYSTEM_AWARENESS_SPINE.md)
- [PHASE_Z_AWARE_1_GREEN_RECEIPT.md](./PHASE_Z_AWARE_1_GREEN_RECEIPT.md)
- [AMK_WORKSPACE_DOORWAY.md](./AMK_WORKSPACE_DOORWAY.md)
- [PHASE_Z_SSWS_DOOR_1_GREEN_RECEIPT.md](./PHASE_Z_SSWS_DOOR_1_GREEN_RECEIPT.md)
- [AMK_CURSOR_WORKSPACE_STRATEGY.md](./AMK_CURSOR_WORKSPACE_STRATEGY.md)
- [PHASE_Z_SSWS_LAB_1_GREEN_RECEIPT.md](./PHASE_Z_SSWS_LAB_1_GREEN_RECEIPT.md)
- [Z_AMK_GTAI_STRATEGY_COUNCIL.md](./Z_AMK_GTAI_STRATEGY_COUNCIL.md)
- [Z_IDE_FUSION_WORKFLOW_CONTROL.md](./Z_IDE_FUSION_WORKFLOW_CONTROL.md)
- [PHASE_Z_IDE_FUSION_1_GREEN_RECEIPT.md](./PHASE_Z_IDE_FUSION_1_GREEN_RECEIPT.md)
- [Z_SEC_TRIPLECHECK_COMMUNICATION_FLOW_AUDIT.md](./Z_SEC_TRIPLECHECK_COMMUNICATION_FLOW_AUDIT.md)
- [Z_LOGICAL_BRAINS_HUB_REFERENCE.md](./Z_LOGICAL_BRAINS_HUB_REFERENCE.md)
- [Z_CADENCE_REAL_CYCLE_RUNNER.md](./Z_CADENCE_REAL_CYCLE_RUNNER.md)
- [Z_MR_BUG_MINI_FIXER_POLICY.md](./Z_MR_BUG_MINI_FIXER_POLICY.md)
- [PHASE_Z_SEC_TRIPLECHECK_1_GREEN_RECEIPT.md](./PHASE_Z_SEC_TRIPLECHECK_1_GREEN_RECEIPT.md)
- [PHASE_Z_LOGICAL_BRAINS_HUB_1_GREEN_RECEIPT.md](./PHASE_Z_LOGICAL_BRAINS_HUB_1_GREEN_RECEIPT.md)
- [PHASE_Z_CADENCE_1_GREEN_RECEIPT.md](./PHASE_Z_CADENCE_1_GREEN_RECEIPT.md)
- [Z_ROOT_7_GUARDIAN_COORDINATION_LAYER.md](./Z_ROOT_7_GUARDIAN_COORDINATION_LAYER.md)
- [PHASE_Z_ROOT_7_GREEN_RECEIPT.md](./PHASE_Z_ROOT_7_GREEN_RECEIPT.md)
- [PHASE_Z_ROOT_7B_3D_GREEN_RECEIPT.md](./PHASE_Z_ROOT_7B_3D_GREEN_RECEIPT.md)
- [PHASE_Z_AMK_GTAI_1_GREEN_RECEIPT.md](./PHASE_Z_AMK_GTAI_1_GREEN_RECEIPT.md)
- [Z_MOD_DIST_MODULE_DISTRIBUTOR.md](./Z_MOD_DIST_MODULE_DISTRIBUTOR.md)
- [PHASE_Z_MOD_DIST_1_GREEN_RECEIPT.md](./PHASE_Z_MOD_DIST_1_GREEN_RECEIPT.md)
- [PHASE_AMK_DASH_MOD_DIST_1_GREEN_RECEIPT.md](./PHASE_AMK_DASH_MOD_DIST_1_GREEN_RECEIPT.md)
