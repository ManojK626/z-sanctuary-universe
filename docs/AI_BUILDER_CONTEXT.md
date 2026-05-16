# AI Builder context — Z-Sanctuary Universe

**Purpose:** One briefing for Cursor (and any AI) working in this hub: where truth lives, how to stay evidence-first, and how the doc pack stays aligned with registries.

## Authority stack (read order)

1. [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) — placement and operational roof when unsure.
2. [AGENTS.md](../AGENTS.md) — hub-wide agent rules, verify intents, GitHub and safety pointers.
3. [Z_SANCTUARY_MONSTER_PROJECT_MASTER_MAP.md](Z_SANCTUARY_MONSTER_PROJECT_MASTER_MAP.md) + `data/z_sanctuary_monster_project_registry.json` — **Monster Project** catalog (human map + machine roster); verify with `npm run z:monster:registry-verify`.
4. `data/z_master_module_registry.json` — canonical **module ID list** for coverage and AI Builder pages.
5. `data/z_core_engines_registry.json` — high-level **engine** labels (not full runtime proof).
6. [Z_SANCTUARY_BUILD_RULES.md](Z_SANCTUARY_BUILD_RULES.md) — hard boundaries for builders.
7. [Z_OMNI_VISUAL_WORKSTATION_ENGINE_CHARTER.md](Z_OMNI_VISUAL_WORKSTATION_ENGINE_CHARTER.md) — **Z-OMNI-CHARTER-1:** governed visual workstation engine (tokens, panel manifests, phased build); presentation and composition under Turtle Mode — not autonomous execution or hype-as-truth.

## Operational technology layers (Phase 0 — docs only)

**Law:** layered tools are **not** the soul of the ecosystem — PC/NAS + hub governance remain authoritative.

- [Z_OPERATIONAL_TECHNOLOGY_LAYERS.md](Z_OPERATIONAL_TECHNOLOGY_LAYERS.md) — Cursor, GitHub, Cloudflare, Z-DAIO, Z-ADTF, devices: roles, phased presets, forbidden patterns.
- [PHASE_Z_OPERATIONAL_TECHNOLOGY_LAYERS_0_GREEN_RECEIPT.md](PHASE_Z_OPERATIONAL_TECHNOLOGY_LAYERS_0_GREEN_RECEIPT.md) — Phase 0 receipt.
- Cursor hook: [.cursor/rules/z-operational-technology-layers.mdc](../.cursor/rules/z-operational-technology-layers.mdc).

Cross-links: [Z-GITHUB-SANCTUARY-GATE.md](Z-GITHUB-SANCTUARY-GATE.md), [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md). Planned: thin `.cursor/rules/z-sanctuary-core.mdc` index (do not duplicate 14 DRP in rules).

## Canonical control root and satellite bridges (Z-CONTROL-LINK-1)

**Sealed on main.** **`Z_Sanctuary_Universe`** (this hub repository) is the **canonical governance and control root** for Z-Sanctuary. Satellite projects must not fork long doctrine; they carry **one thin bridge file** only: **`docs/Z_SANCTUARY_CONTROL_LINK.md`**, aligned from the hub template at the same path.

| Concern | Hub source |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Approved satellite destinations | `data/z_satellite_control_link_manifest.json` |
| Bridge sync (default dry-run) | `scripts/z_sync_control_links.mjs` — `npm run z:control-links:dry`; `npm run z:control-links:apply` only after explicit operator review |
| One-root policy | [Z_SANCTUARY_CANONICAL_CONTROL_ROOT.md](Z_SANCTUARY_CANONICAL_CONTROL_ROOT.md) |
| Cursor-wide reminder | `.cursor/rules/z_control_root_awareness.mdc` |

**Do not:** scan arbitrary PC folders; write outside manifest-approved targets; deploy; bind domains; write or rotate secrets; install IDE extensions; run background services; or mutate NAS paths from this lane. Satellites that depend on NAS stay **`NAS_WAIT`** until the mount is verified and the manifest is updated with operator care.

**Z-DOORWAY-2** (governed local open lane): [AMK_PROJECT_DOORWAY_LAUNCHER.md](AMK_PROJECT_DOORWAY_LAUNCHER.md) — opens approved workspaces and folders **only** (Cursor / VS Code / Explorer); **no** builds or deploys.

**Z-DOORWAY-3** (telemetry / session receipts): `scripts/z_doorway_workspace_status.mjs` (`npm run z:doorway:status`) — read-only status JSON/Markdown from `data/z_doorway_workspace_registry.json` and optional tail of `data/reports/z_doorway_session_log.jsonl`. Does not auto-launch IDEs or mutate NAS.

## Sealed growth stages (Z-AI-BUILDER-AWARENESS-2)

The ecosystem is in a **governed organism foundation** posture: **read-only awareness** (topology, device trust, doorway receipts, drift, traffic) expands **before** widening autonomous execution. Canonical catalog: [Z_ECOSYSTEM_GROWTH_STATUS.md](Z_ECOSYSTEM_GROWTH_STATUS.md) and `data/z_ecosystem_growth_stage_registry.json`.

| Seal | One-line role |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Z-SSWS IDE** | Main **operator cockpit** — doctrine, tasks, workspace spine; not silent full-system auto-launch. |
| **Z-CONTROL-LINK-1** | Canonical hub + **thin satellite bridge** sync (`docs/Z_SANCTUARY_CONTROL_LINK.md`); `npm run z:control-links:dry` default. |
| **Z-DOORWAY-2** | Governed **workspace opener** — registry + explicit human-run helpers only. |
| **Z-DOORWAY-3** | **Telemetry / session receipts** — read-only reports; optional session log tail. |
| **Z-CRYSTAL-DNA-1** | **Asset identity mesh** — [Z_CRYSTAL_DNA_MESH.md](Z_CRYSTAL_DNA_MESH.md), `data/z_crystal_dna_asset_manifest.json`. |
| **Z-CRYSTAL-DNA-2** | **Living Crystal map** — [Z_CRYSTAL_DNA_VISUALIZATION.md](Z_CRYSTAL_DNA_VISUALIZATION.md). |
| **Z-CRYSTAL-DNA-3** | **Drift / integrity awareness** — [Z_CRYSTAL_DNA_DRIFT_AWARENESS.md](Z_CRYSTAL_DNA_DRIFT_AWARENESS.md), `npm run z:crystal:dna:drift`. |
| **Z-ANYDEVICE-AI-CAPSULE-1** | **Device trust / capability** — [Z_ANYDEVICE_AI_CAPSULE.md](Z_ANYDEVICE_AI_CAPSULE.md). |
| **Z-ANYDEVICE-2** | **Synthetic device simulation** — [Z_ANYDEVICE_SYNTHETIC_SIMULATION.md](Z_ANYDEVICE_SYNTHETIC_SIMULATION.md), `npm run z:anydevice:simulate`. |
| **Z-CYCLE-OBSERVE-1** | **Continuous observation tower + safe task queue** — [Z_CYCLE_OBSERVE_SYSTEM.md](Z_CYCLE_OBSERVE_SYSTEM.md), `npm run z:cycle:observe`; generates `task_queue` only — **does not execute** it. |
| **Z-CYCLE-DASHBOARD-1** | **Read-only ecosystem nervous system UI** — [Z_CYCLE_DASHBOARD_SYSTEM.md](Z_CYCLE_DASHBOARD_SYSTEM.md), `dashboard/panels/z-cycle-dashboard-readonly.html`; GET JSON only — **not** a control plane. |
| **Z-DEPLOYMENT-READINESS-OVERSEER-1** | **Deployment readiness rollup (read-only)** — [Z_DEPLOYMENT_READINESS_OVERSEER.md](Z_DEPLOYMENT_READINESS_OVERSEER.md), `npm run z:deployment:readiness`; writes `z_deployment_readiness_status.{json,md}` only — **not** deploy authority. |
| **Cloudflare governance** | **Preview / runtime posture only**; **production HOLD** — [Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md](Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md). |
| **Casa AI Builder** | **Suggest docs / prompts / checklists only** — no device, deploy, or secret authority. |

### AI Tower / overseers / Cursor AI Builder — communication rules

- **May:** observe, classify, summarize, and suggest (including pointing operators to receipts and verify commands).
- **Must not:** autonomous deploy; secret writes; arbitrary PC scans; real device scanning; NAS mutation; automatic repair; production Cloudflare binding.
- **Sacred authority:** **AMK-Goku / human** remains authority for merge, deploy, NAS-class moves, billing, production edge bind, and sacred gates in hub doctrine.

### Ecosystem feedback (growth posture)

- **Current growth stage:** governed organism foundation.
- **Behavior pattern:** read-only awareness expanding faster than execution (intentional).
- **Strength:** topology + drift (Crystal DNA), device trust + synthetic simulation (AnyDevice), doorway control + telemetry, Cloudflare **preview** posture, **GitHub** truth for change control.
- **Risk to avoid:** too much automation before observability stabilizes.
- **Recommended next lanes:** AI Builder awareness follow-through; then **Z-Lab supervised analysis doctrine** under human gates.

### Z-CYCLE-OBSERVE-1 and Cursor (Z-CURSOR-AWARENESS-3)

**Z-CYCLE-OBSERVE-1 is sealed** as the **continuous observation tower**: it reads registries and prior reports, then writes only `data/reports/z_cycle_observe_status.{json,md}`. It **generates a safe task queue** (`task_queue` in JSON) but **must never execute** those tasks.

- **`overall_observer_signal` BLUE** means **informational / governed awareness** (for example drift or sequencing posture rolled into the observer) — **not** “Cursor failed” and **not** permission to auto-fix.
- **Cursor may** read `z_cycle_observe_status.json` / `.md`, summarize posture, and **suggest** the next **`cursor/zsanctuary/…`** Turtle Mode branch name or scope from a queue row.
- **Cursor must not** run queued tasks automatically; **must not** deploy, merge, push, install packages, start services, mutate NAS, connect real devices, repair files automatically, or touch secrets.
- **AMK / human** chooses which queued item (if any) becomes real work on a branch.
- **All work** still follows: **small branch** → **verify gates** → **human review** → **merge** (no new autonomous authority from this awareness phase).

**Cursor awareness verify bundle** (run in order when refreshing overseer receipts):

```bash
npm run z:deployment:readiness
npm run z:pc:activation
npm run z:cycle:observe
npm run verify:md
npm run z:anydevice:simulate
npm run z:crystal:dna:drift
npm run z:traffic
npm run z:car2
```

(`z:deployment:readiness` rewrites only `data/reports/z_deployment_readiness_status.{json,md}`. `z:pc:activation` is optional but recommended after hub/PowerShell work; it rewrites only `data/reports/z_pc_activation_receipt.{json,md}`.)

**Z-CYCLE-DASHBOARD-1:** open `dashboard/panels/z-cycle-dashboard-readonly.html` over **http** (same-origin GET to `data/reports/`). The page **does not** run npm or execute the task queue.

## IDE Safeguards

- **[VS_FALLBACK_1_VSCODE_OPERATING_MODE.md](VS_FALLBACK_1_VSCODE_OPERATING_MODE.md)** — Safe fallback doctrine when Cursor unavailable. Archive vs real repo distinction enforced. Read first before any IDE changes.
- **[Z_PC_IDE_PATH_HEALTH_CHECK.md](Z_PC_IDE_PATH_HEALTH_CHECK.md)** — Read-only `code`/`Cursor` PATH and install probes for AMK; Explorer context menus are convenience-only vs CLI proof (`npm run z:pc:ide-path`).
- **[AMK_IDE_PATH_AND_FUSION_OPERATOR_RHYTHM.md](AMK_IDE_PATH_AND_FUSION_OPERATOR_RHYTHM.md)** — One-page AMK rhythm: `z:pc:ide-path` → `z:ide:fusion` → gates when IDE/path confusion strikes.

## Active hub surfaces and receipts

| Surface | Why it matters |
| -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [AMK_GOKU_MAIN_CONTROL_DASHBOARD.md](AMK_GOKU_MAIN_CONTROL_DASHBOARD.md) | Main AMK command-center doctrine (MAP and FLEX phases). |
| [AMK_GOKU_COMMAND_BOOK_LAYOUT.md](AMK_GOKU_COMMAND_BOOK_LAYOUT.md) | Drawer/focus/inspector/tools shell behavior and locked law. |
| [PHASE_AMK_DASH_FLEX_2_GREEN_RECEIPT.md](PHASE_AMK_DASH_FLEX_2_GREEN_RECEIPT.md) | FLEX-2 scope and acceptance receipt. |
| [AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md](AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md) | Indicator posture, overlays, and advisory Go/No-Go framing. |
| [AMK_GOKU_OPERATOR_CONFIRMATION_POLICY.md](AMK_GOKU_OPERATOR_CONFIRMATION_POLICY.md) | Sacred-move ownership and confirmation boundaries. |
| [AMK_ZUNO_ADVISOR_CONSOLE.md](AMK_ZUNO_ADVISOR_CONSOLE.md) | Local deterministic advisor law (guidance, not execution). |
| [AMK_AUTONOMOUS_APPROVAL_LADDER.md](AMK_AUTONOMOUS_APPROVAL_LADDER.md) | AAL posture and lane separation. |
| [AMK_GOKU_NOTIFICATIONS_PANEL.md](AMK_GOKU_NOTIFICATIONS_PANEL.md) | Notification board behavior and non-execution constraints. |
| [AMK_WORKSPACE_DOORWAY.md](AMK_WORKSPACE_DOORWAY.md) | Workspace doorway discipline and status flow. |
| [AMK_CURSOR_WORKSPACE_STRATEGY.md](AMK_CURSOR_WORKSPACE_STRATEGY.md) | Cursor workspace profile strategy and safe operator flow. |
| [Z_SSWS_WORKSPACE_SPINE.md](Z_SSWS_WORKSPACE_SPINE.md) | SSWS workspace launch requirements and guard rails. |
| [Z_ECOSYSTEM_GROWTH_STATUS.md](Z_ECOSYSTEM_GROWTH_STATUS.md) | Sealed growth stages + AI Builder / overseer communication posture (Z-AI-BUILDER-AWARENESS-2). |
| [Z_CRYSTAL_DNA_MESH.md](Z_CRYSTAL_DNA_MESH.md) | Z-CRYSTAL-DNA-1 asset identity mesh (shards, dependencies, governance). |
| [Z_CRYSTAL_DNA_VISUALIZATION.md](Z_CRYSTAL_DNA_VISUALIZATION.md) | Z-CRYSTAL-DNA-2 living Crystal ecosystem map (read-only). |
| [Z_CRYSTAL_DNA_DRIFT_AWARENESS.md](Z_CRYSTAL_DNA_DRIFT_AWARENESS.md) | Z-CRYSTAL-DNA-3 drift and integrity awareness (detect-only reports). |
| [Z_ANYDEVICE_AI_CAPSULE.md](Z_ANYDEVICE_AI_CAPSULE.md) | Z-ANYDEVICE-AI-CAPSULE-1 device trust / declared capability governance. |
| [Z_ANYDEVICE_SYNTHETIC_SIMULATION.md](Z_ANYDEVICE_SYNTHETIC_SIMULATION.md) | Z-ANYDEVICE-2 synthetic device simulation (fiction-only + simulator). |
| [PHASE_Z_AI_BUILDER_AWARENESS_2_GREEN_RECEIPT.md](PHASE_Z_AI_BUILDER_AWARENESS_2_GREEN_RECEIPT.md) | Z-AI-BUILDER-AWARENESS-2 sealed growth / overseer communication receipt. |
| [Z_CYCLE_OBSERVE_SYSTEM.md](Z_CYCLE_OBSERVE_SYSTEM.md) | Z-CYCLE-OBSERVE-1 read-only observer + safe task queue (reports only; no execution). |
| [PHASE_Z_CYCLE_OBSERVE_1_GREEN_RECEIPT.md](PHASE_Z_CYCLE_OBSERVE_1_GREEN_RECEIPT.md) | Seal receipt for Z-CYCLE-OBSERVE-1 cycle observe phase. |
| [PHASE_Z_CURSOR_AWARENESS_3_GREEN_RECEIPT.md](PHASE_Z_CURSOR_AWARENESS_3_GREEN_RECEIPT.md) | Z-CURSOR-AWARENESS-3 — Cycle Observe sealed; Cursor / rule alignment receipt. |
| [Z_CYCLE_DASHBOARD_SYSTEM.md](Z_CYCLE_DASHBOARD_SYSTEM.md) | Z-CYCLE-DASHBOARD-1 read-only ecosystem nervous system dashboard (UI only). |
| [PHASE_Z_CYCLE_DASHBOARD_1_GREEN_RECEIPT.md](PHASE_Z_CYCLE_DASHBOARD_1_GREEN_RECEIPT.md) | Seal receipt for Z-CYCLE-DASHBOARD-1. |
| [Z_DEPLOYMENT_READINESS_OVERSEER.md](Z_DEPLOYMENT_READINESS_OVERSEER.md) | Z-DEPLOYMENT-READINESS-OVERSEER-1 read-only deployment posture rollup. |
| [PHASE_Z_DEPLOYMENT_READINESS_OVERSEER_1_GREEN_RECEIPT.md](PHASE_Z_DEPLOYMENT_READINESS_OVERSEER_1_GREEN_RECEIPT.md) | Seal receipt for Z-DEPLOYMENT-READINESS-OVERSEER-1. |
| [Z_API_SPINE_POWER_CELL.md](Z_API_SPINE_POWER_CELL.md) | API spine posture within hub governance. |
| [Z_API_READINESS_AND_SMOKE_GATE.md](Z_API_READINESS_AND_SMOKE_GATE.md) | Readiness/smoke charter and non-bypass flow. |
| [Z_TRAFFIC_MINIBOTS.md](Z_TRAFFIC_MINIBOTS.md) | Traffic report source and signal semantics. |
| [Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md](Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md) | Universal 14 DRP law for mini-bots, swarm helpers, and future agents. |
| [Z_FORMULA_SWARM_CO_DESIGN_ENGINE.md](Z_FORMULA_SWARM_CO_DESIGN_ENGINE.md) | Z-Formula routing/classification layer (symbolic + report-only). |
| [PHASE_Z_SWARM_14DRP_1_GREEN_RECEIPT.md](PHASE_Z_SWARM_14DRP_1_GREEN_RECEIPT.md) | Seal receipt for Z-SWARM-14DRP-1 governance phase. |
| [Z_IDE_FUSION_WORKFLOW_CONTROL.md](Z_IDE_FUSION_WORKFLOW_CONTROL.md) | Shared evidence and handoff control for Cursor + VS Code lanes. |
| [PHASE_Z_IDE_FUSION_1_GREEN_RECEIPT.md](PHASE_Z_IDE_FUSION_1_GREEN_RECEIPT.md) | Seal receipt for Z-IDE-FUSION-1 coordination phase. |
| [Z_SEC_TRIPLECHECK_COMMUNICATION_FLOW_AUDIT.md](Z_SEC_TRIPLECHECK_COMMUNICATION_FLOW_AUDIT.md) | Triple-check audit for communication flow, drift, and path safety. |
| [Z_LOGICAL_BRAINS_HUB_REFERENCE.md](Z_LOGICAL_BRAINS_HUB_REFERENCE.md) | Hub reference-only registration for Labs Logical Brains capsule. |
| [Z_NUMEN_HUB_REFERENCE.md](Z_NUMEN_HUB_REFERENCE.md) | Hub reference-only registration for Labs Z-NUMEN pattern literacy module. |
| [Z_MOD_DIST_MODULE_DISTRIBUTOR.md](Z_MOD_DIST_MODULE_DISTRIBUTOR.md) | Z-MOD-DIST-1 read-only module routing advisor (forecast/suggest only). |
| [Z_XBUS_EXTERNAL_CONNECTOR_GATE.md](Z_XBUS_EXTERNAL_CONNECTOR_GATE.md) | Z-XBUS-GATE-1 external connector registry + validator (metadata only; no live bus). |
| [Z_REPLICA_FABRIC_GOVERNED_SELF_REPLICATION.md](Z_REPLICA_FABRIC_GOVERNED_SELF_REPLICATION.md) | Z-REPLICA-FABRIC-1 governed OMNAI monocore replica doctrine — registry + reports only (no live replication). |
| [OMNAI_CORE_ENGINE_SIMULATION.md](OMNAI_CORE_ENGINE_SIMULATION.md) | OMNAI core §02–09 **deterministic simulation**: slim matrix summary, optional full matrix, indicator overlay — **reports only** (GREEN ≠ execute). |
| [PHASE_OMNAI_CORE_ENGINE_MATRIX_GREEN_RECEIPT.md](PHASE_OMNAI_CORE_ENGINE_MATRIX_GREEN_RECEIPT.md) | Seal + rollback for OMNAI core matrix / overlay alignment pass. |
| [Z_ULTRA_MAGE_FORMULA_CODEX.md](Z_ULTRA_MAGE_FORMULA_CODEX.md) | Z-ULTRA-MAGE-1 universal formula governance codex (OMNAI + hubs as governed vocabulary; no formula engine runtime). |
| [Z_MAURITIANS_UNITE_CIVIC_TRUTH_ENGINE.md](Z_MAURITIANS_UNITE_CIVIC_TRUTH_ENGINE.md) | Z-MU-TRUTH-1 peaceful civic claim ledger + verification posture (no protest/deploy/provider tooling). |
| [Z_MU_CIVIC_KNOWLEDGE_ADVISOR.md](Z_MU_CIVIC_KNOWLEDGE_ADVISOR.md) | Z-MU-ADVISOR-1 civic knowledge advisor framework (templates + policy; no live AI or public chat). |
| [Z_PATTERN_SAFE_UNIVERSAL_PATTERN_SIMULATION.md](Z_PATTERN_SAFE_UNIVERSAL_PATTERN_SIMULATION.md) | Z-PATTERN-SAFE-1 pattern literacy and simulation governance (registry + validator; no live prediction engine). |
| [AMK_AI_TEAM_INDICATOR_SYNC_ROUTER.md](AMK_AI_TEAM_INDICATOR_SYNC_ROUTER.md) | AMK-AI-SYNC-1 indicator drift observer + routing packets — Phase 1 never auto-edits indicators from the validator. |
| [Z_AI_FUSION_CAPABILITY_MAP.md](Z_AI_FUSION_CAPABILITY_MAP.md) | Z-AI-FUSION-MAP-1 overlap governance map — fusion suggestions only (**no runtime merge auto-execution**). |
| [Z_STILLNESS_MODE_AI_LEARNING_PATHWAY.md](Z_STILLNESS_MODE_AI_LEARNING_PATHWAY.md) | Z-STILLNESS-LEARN-1 idle alignment pathway — learn and report only (**no background automation**). |
| [Z_SANCTUARY_ECOSYSTEM_BIOLOGY_MAP.md](Z_SANCTUARY_ECOSYSTEM_BIOLOGY_MAP.md) | Ecosystem biology metaphor — roots, trees, law stack, borders (**not** runtime control). |
| [design/Z_UNIVERSAL_INTERACTION_LANGUAGE.md](design/Z_UNIVERSAL_INTERACTION_LANGUAGE.md) | Z-UIL-1 universal interaction language — shared identity vs entitlement separation; complements Z-VIL (**docs only**). |
| [LAWGRID_1A_GOVERNANCE_OBSERVATORY.md](LAWGRID_1A_GOVERNANCE_OBSERVATORY.md) | LAWGRID-1A read-only governance observatory — spine, constellation map, catalog/benchmark/ZSX/ZMV/SSWS/AMK ingest (**no runtime authority**). |
| [PHASE_LAWGRID_1A_GREEN_RECEIPT.md](PHASE_LAWGRID_1A_GREEN_RECEIPT.md) | LAWGRID-1A sealed scope receipt. |
| [foresight/Z_CIVILIZATION_FORESIGHT_SAFETY_LAW.md](foresight/Z_CIVILIZATION_FORESIGHT_SAFETY_LAW.md) | Z-FUTURE-1 civilizational foresight safety law — scenarios, not prophecy (**doctrine + registry only**). |
| [foresight/PHASE_Z_FUTURE_1_GREEN_RECEIPT.md](foresight/PHASE_Z_FUTURE_1_GREEN_RECEIPT.md) | Z-FUTURE-1 phase receipt. |
| [Z_ECOSYSTEM_COHERENCE_ZUNO_SEED.md](Z_ECOSYSTEM_COHERENCE_ZUNO_SEED.md) | Ecosystem coherence seed — Zuno reports + foresight alignment (**no runtime bridge**). |
| [Z_LEGAL_EVIDENCE_CORE.md](Z_LEGAL_EVIDENCE_CORE.md) | Z-LEGAL-OPS-1 proof-first legal evidence layer — AI organizes evidence only (**no legal advice runtime**). |
| [Z_LAWYER_WORKSTATION_CONTROL_CENTRE.md](Z_LAWYER_WORKSTATION_CONTROL_CENTRE.md) | Future legal review cockpit concept — no endorsement/auth/account authority in Phase 1. |
| [Z_GUARDIAN_LEGAL_CIRCLE.md](Z_GUARDIAN_LEGAL_CIRCLE.md) | Real-world advisor layer only under written agreement and consent; not runtime authority. |
| [Z_LEGAL_PRODUCT_IP_COMPLIANCE_WORKSTATION.md](Z_LEGAL_PRODUCT_IP_COMPLIANCE_WORKSTATION.md) | Z-LEGAL-PRODUCT-OPS-1 product/IP legal workstation map — concept evidence only (**no launch/manufacturing lane**). |
| [Z_LEGAL_PRODUCT_SAFETY_AND_IP_POLICY.md](Z_LEGAL_PRODUCT_SAFETY_AND_IP_POLICY.md) | Product safety/IP/claims/supplier boundary policy for legal-product governance. |
| [Z_LEGAL_CANVAS_WORLD_MAP_WORKSTATION.md](Z_LEGAL_CANVAS_WORLD_MAP_WORKSTATION.md) | Visual legal-product canvas posture — governance map only (**no tracking/surveillance/runtime control**). |
| [Z_LEGAL_WORKSTATION_STACK_REQUIREMENTS.md](Z_LEGAL_WORKSTATION_STACK_REQUIREMENTS.md) | Z-LEGAL-WORKSTATION-STACK-1 full lawyer workstation requirements stack (case/evidence/media/comms/simulation) as governance-only architecture. |
| [Z_LEGAL_WORKSTATION_SIMULATION_MODE.md](Z_LEGAL_WORKSTATION_SIMULATION_MODE.md) | Safe simulation-mode doctrine for lawyer workflow training with synthetic-only data. |
| [Z_LEGAL_WORKSTATION_TOOLBELT.md](Z_LEGAL_WORKSTATION_TOOLBELT.md) | Z-LEGAL-TOOLBELT-1 compact legal tool dock map (viewer/timeline/risk/contract/IP/consent/AI panel) as UI metadata only. |
| [PHASE_Z_LEGAL_WORKSTATION_UX_1_GREEN_RECEIPT.md](PHASE_Z_LEGAL_WORKSTATION_UX_1_GREEN_RECEIPT.md) | Z-LEGAL-WORKSTATION-UX-1 interactive synthetic-data prototype (tool dock + 3-column workstation) with strict no-runtime legal boundaries. |
| [PHASE_Z_DASH_LIVING_NEON_1_GREEN_RECEIPT.md](PHASE_Z_DASH_LIVING_NEON_1_GREEN_RECEIPT.md) | Z-DASH-LIVING-NEON-1 living neon visual system for legal workstation + AMK main dashboard (UI-only, no runtime authority). |
| [PHASE_Z_DASH_LIVING_NEON_1A_GREEN_RECEIPT.md](PHASE_Z_DASH_LIVING_NEON_1A_GREEN_RECEIPT.md) | Z-DASH-LIVING-NEON-1A stricter neon mockup-matching reconstruction for lawyer workstation (UI-only, mock/no-op actions). |
| [PHASE_Z_DASH_LIVING_NEON_1B_GREEN_RECEIPT.md](PHASE_Z_DASH_LIVING_NEON_1B_GREEN_RECEIPT.md) | Z-DASH-LIVING-NEON-1B high-fidelity shell pass for wider, richer, and more legible neon lawyer workstation cockpit (UI-only). |
| [PHASE_Z_LEGAL_WORKSTATION_AI_SPINE_1_GREEN_RECEIPT.md](PHASE_Z_LEGAL_WORKSTATION_AI_SPINE_1_GREEN_RECEIPT.md) | Z-LEGAL-WORKSTATION-AI-SPINE-1 photophobia comfort pass + synthetic legal AI duo and dual-knowledge-spine cockpit (no live AI/legal advice). |
| [PHASE_Z_LEGAL_WORKSTATION_UX_2_GREEN_RECEIPT.md](PHASE_Z_LEGAL_WORKSTATION_UX_2_GREEN_RECEIPT.md) | Z-LEGAL-WORKSTATION-UX-2 compact cockpit: protector modes, receipts drawer, historical simulation drill (HTML/CSS/JS only, synthetic data). |
| [PHASE_Z_LEGAL_WORKSTATION_UX_2A_GREEN_RECEIPT.md](PHASE_Z_LEGAL_WORKSTATION_UX_2A_GREEN_RECEIPT.md) | Z-LEGAL-WORKSTATION-UX-2A label alignment: hub, iframe, service map, indicator copy match UX-2 naming (no layout/runtime change). |
| [Z_LEGAL_GLOBAL_BENCHMARK_READINESS_PANEL.md](Z_LEGAL_GLOBAL_BENCHMARK_READINESS_PANEL.md) | Z-LEGAL-BENCH-1 internal readiness panel for UX-2 (JSON-backed; not certification, valuation, legal advice, or launch authority). |
| [PHASE_Z_LEGAL_BENCH_1_GREEN_RECEIPT.md](PHASE_Z_LEGAL_BENCH_1_GREEN_RECEIPT.md) | Z-LEGAL-BENCH-1 sealed scope receipt for benchmark panel wiring. |
| [Z_XBUS_CONNECTOR_SECURITY_POLICY.md](Z_XBUS_CONNECTOR_SECURITY_POLICY.md) | Phase 1 connector security boundaries (no live execution from gate). |
| [Z_SSWS_SUPER_SAIYAN_WORKSPACE_COCKPIT.md](Z_SSWS_SUPER_SAIYAN_WORKSPACE_COCKPIT.md) | Z-SSWS-COCKPIT-1 cockpit vs deep-work registry + dry-run plan (no auto-launch). |
| [PHASE_Z_SSWS_COCKPIT_1_GREEN_RECEIPT.md](PHASE_Z_SSWS_COCKPIT_1_GREEN_RECEIPT.md) | Seal receipt for cockpit orchestration phase. |
| [Z_LOGICAL_BRAINS_MONITORING_CADENCE.md](Z_LOGICAL_BRAINS_MONITORING_CADENCE.md) | HUB-2 monitoring rhythm checklist for ongoing non-clinical posture checks. |
| [Z_CADENCE_REAL_CYCLE_RUNNER.md](Z_CADENCE_REAL_CYCLE_RUNNER.md) | Z-CADENCE-1 allowlisted cadence runner and follow-up logic (report-only). |
| [Z_MR_BUG_MINI_FIXER_POLICY.md](Z_MR_BUG_MINI_FIXER_POLICY.md) | Auto-fix boundary policy: docs hygiene only, no runtime/security rewires. |
| [PHASE_Z_SEC_TRIPLECHECK_1_GREEN_RECEIPT.md](PHASE_Z_SEC_TRIPLECHECK_1_GREEN_RECEIPT.md) | Seal receipt for Z-SEC-TRIPLECHECK-1 audit phase. |
| [PHASE_Z_CURSOR_AWARENESS_1_GREEN_RECEIPT.md](PHASE_Z_CURSOR_AWARENESS_1_GREEN_RECEIPT.md) | Cursor awareness for Z-CONTROL-LINK-1 seal and canonical hub control root. |
| [Z_AMK_GTAI_STRATEGY_COUNCIL.md](Z_AMK_GTAI_STRATEGY_COUNCIL.md) | Strategy council rollup posture and advisory law. |
| [Z_ROOT_7_GUARDIAN_COORDINATION_LAYER.md](Z_ROOT_7_GUARDIAN_COORDINATION_LAYER.md) | Root guardian symbolic layer and limits. |
| [ZUNO_WEEKLY_FULL_RUN_AND_OBSERVATION.md](ZUNO_WEEKLY_FULL_RUN_AND_OBSERVATION.md) | Weekly observation cadence and evidence routine. |
| [INDEX.md](INDEX.md) | Compact docs registry entry point for daily operations. |

## Verify lanes (technical receipts)

- `npm run z:control-links:dry` — Z-CONTROL-LINK-1: plan bridge sync from hub template to manifest-approved satellites only (no satellite file writes; hub reports under `data/reports/` may refresh).
- `npm run z:control-links:apply` — same script with `--apply`; writes **only** the bridge markdown path declared in the manifest (operator-gated).
- `npm run z:cycle:observe` — Z-CYCLE-OBSERVE-1: full-system observation + safe task queue report (`data/reports/z_cycle_observe_status.{json,md}`); **does not execute** queued tasks.
- `npm run z:anydevice:simulate` — Z-ANYDEVICE-2: synthetic device simulation report refresh (`data/reports/z_anydevice_simulation_report.{json,md}`).
- `npm run z:crystal:dna:drift` — Z-CRYSTAL-DNA-3: topology drift / integrity awareness reports only.
- `npm run verify:md` — markdown gate; required before sealing doc-only phases.
- `npm run dashboard:registry-verify` — dashboard registry consistency receipt.
- `npm run z:traffic` — traffic minibot status refresh.
- `npm run z:swarm:14drp` — universal swarm law and role-registry validator.
- `npm run z:ide:fusion` — shared IDE session and handoff coordination report.
- `npm run z:ssws:cockpit` — cockpit vs deep-work registry check; dry-run open plan only.
- `npm run z:pc:ide-path` — read-only VS Code/Cursor PATH and install sanity for PC + doorway posture (reports only).
- `npm run z:sec:triplecheck` — communication-flow and safety drift audit report.
- `npm run z:logical-brains:hub` — validates Labs capsule registration as reference-only hub evidence.
- `npm run z:numen:hub` — validates Labs Z-NUMEN hub reference registry as reference-only evidence (no runtime bridge).
- `npm run z:mod:dist` — advisory module/workspace routing report from registry + samples (not permission, not AI provider).
- `npm run z:xbus:gate` — read-only external connector registry + policy validator; reports only — not live API, provider, payment, or webhook execution.
- `npm run z:replica:fabric` — governed replica-fabric doctrine check; classifies advisory missions; no runtime replication or autonomous execution.
- `npm run z:ultra:mage` — Z-Ultra MAGE formula codex validator; classifies advisory samples; exit **1** only on **RED**.
- `npm run z:mu:truth` — Z-MU-TRUTH-1 civic truth engine check; classifies claim rows; peaceful-only scope; exit **1** only on **RED**.
- `npm run z:mu:advisor` — Z-MU-ADVISOR-1 advisor framework check; validates templates and sample prompts; no provider or user-data behavior; exit **1** only on **RED**.
- `npm run z:pattern:safe` — Z-PATTERN-SAFE-1 pattern/simulation governance check; gamble/money lanes must stay BLUE or RED — not GREEN as “help”; exit **1** only on **RED**.
- `npm run amk:ai-sync` — AMK-AI-SYNC-1 read-only indicator sync hints + routing packets to Z-AI teams — **routes evidence, not sacred authority**; exit **1** only on **RED**.
- `npm run z:ai:fusion-map` — Z-AI-FUSION-MAP-1 capability overlap scorer + fusion recommendations — **never auto-merge**; exit **1** only on **RED**.
- `npm run z:stillness:learn` — Z-STILLNESS-LEARN-1 stillness pathway registry + sample classifier — **read-only reports**; exit **1** only on **RED**; **no** daemons or self-upgrade.
- `npm run z:legal:ops` — Z-LEGAL-OPS-1 legal workstation governance validator — concept/report only; exit **1** only on **RED**; **no** legal advice runtime, client-data intake, or endorsement lanes.
- `npm run z:legal:product-ops` — Z-LEGAL-PRODUCT-OPS-1 legal-product/IP workstation validator — concept/report only; exit **1** only on **RED**; **no** product launch, manufacturing order, supplier connector, payment, medical claim publication, or deploy lane.
- `npm run z:legal:workstation-stack` — Z-LEGAL-WORKSTATION-STACK-1 full workstation requirements validator (docs/media/comms/AI/simulation governance); report-only; exit **1** only on **RED**.
- AMK indicators row **`z_mod_dist_routing_advisor`** shows posture chips + law lines; overlays **`signal`** from `data/reports/z_mod_dist_report.json` when dashboard is HTTP-served — see `docs/PHASE_AMK_DASH_MOD_DIST_1_GREEN_RECEIPT.md`.
- `npm run z:cadence:logical-brains` — runs allowlisted Logical Brains cadence checks and writes follow-up report metadata.
- `npm run z:car2` — CAR2 similarity scan refresh.
- `npm run z:monster:registry-verify` — monster registry alignment check.
- `npm run omnai:core:simulate` / `npm run omnai:core:all` — OMNAI core engine tick + matrix summary + **`z_omnai_core_engine_indicator_overlay.json`** for AMK indicator **`z_omnai_core_engine_simulation`** (`omnai_core_overlay`). **`npm run omnai:core:matrix:full`** — optional full Cartesian JSON (large). Receipt: [PHASE_OMNAI_CORE_ENGINE_MATRIX_GREEN_RECEIPT.md](PHASE_OMNAI_CORE_ENGINE_MATRIX_GREEN_RECEIPT.md).

---

_Check main [INDEX.md](INDEX.md) for full documentation registry._
