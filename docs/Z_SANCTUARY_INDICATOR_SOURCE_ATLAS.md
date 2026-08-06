# Indicator Source Atlas

**Status:** ✅ v1 · Operating System Health · Super Turtle
**Date:** 2026-08-06
**Authority:** AMK-Goku
**Accepted with:** State of the OS first-pass (OS Health Report)
**Source registry:** `dashboard/data/amk_project_indicators.json`
**Overlay script:** `dashboard/scripts/amk-project-indicators-readonly.js`
**Law:** Indicator ≠ permission · Percentage ≠ certification · Go/No-Go ≠ deployment
**Parent:** [Scorecard](Z_SANCTUARY_STATE_OF_THE_OS_2026_SCORECARD.md) · [Indicators doctrine](AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md) · [Registry Atlas](Z_SANCTUARY_REGISTRY_ATLAS.md)

---

## Purpose

Every dashboard indicator should answer:

| Question | This atlas |
| --- | --- |
| What am I? | Name · id · domain |
| Where do I come from? | Static signal + overlay + reports/docs |
| Who owns me? | Steward owner |
| How often should I change? | Expected cadence |
| Can a human verify me? | Verify / human column |

Trust document only — **not** a new runtime or auto-refresh service.

---

## Cloudflare Go/No-Go card (special)

| Field | Value |
| --- | --- |
| What | Cloudflare / edge deploy posture |
| Signal | HOLD · `NO_GO_FOR_DEPLOY` |
| Source | `cloudflare_go_no_go` in indicators JSON |
| Owner | AMK-Goku |
| Cadence | Only when deployment charter changes |
| Verify | JSON block + `docs/Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md` |
| Human verify | Yes (`human_approval_required`) |

---

## Indicator catalogue (55 rows)

| ID | Name | Signal (static) | Overlay | Related reports | Related docs (first) | Owner | Cadence | Human verify |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `amk_map_stack` | AMK-MAP stack (1–3) | GREEN | `none` | — | `docs/AMK_GOKU_MAIN_CONTROL_DASHBOARD.md` | AMK-Goku | Static JSON / phase receipt — refresh when docs change | Advisory |
| `amk_notifications` | AMK-Goku Notifications | GREEN | `none` | `data/amk_operator_notifications.json` | `docs/AMK_GOKU_NOTIFICATIONS_PANEL.md` | AMK-Goku | Static JSON / phase receipt — refresh when docs change | Yes |
| `z_traffic_minibots` | Z-Traffic Minibots | GREEN | `z_traffic` | `data/reports/z_traffic_minibots_status.json` | `docs/Z_TRAFFIC_MINIBOTS.md` | AMK + lane steward | When overlay report is refreshed (manual steward cadence) | Advisory |
| `zag_guardian` | ZAG Guardian Loop | BLUE | `none` | — | `docs/Z_AUTONOMOUS_GUARDIAN_LOOP.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Yes |
| `z_swarm_14drp_universal_law` | Z-SWARM-14DRP universal law | — | `z_swarm_14drp` | `data/reports/z_swarm_14drp_report.json`; `data/reports/z_swarm_14drp_report.md` | `docs/Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `z_ide_fusion_control` | Z-IDE-FUSION shared workflow control | — | `z_ide_fusion_control` | `data/reports/z_ide_fusion_report.json`; `data/reports/z_ide_fusion_report.md` | `docs/Z_IDE_FUSION_WORKFLOW_CONTROL.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `z_sec_triplecheck_audit` | Z-SEC Triple-check audit | — | `z_sec_triplecheck` | `data/reports/z_sec_triplecheck_report.json`; `data/reports/z_sec_triplecheck_report.md` | `docs/Z_SEC_TRIPLECHECK_COMMUNICATION_FLOW_AUDIT.md` | AMK-Goku (hub steward) | When overlay report is refreshed (manual steward cadence) | Yes |
| `vh100` | VH100 Security Core | GOLD | `none` | — | `docs/security/Z_VH100_VEGETA_HARISHA_SECURITY_CORE.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Advisory |
| `mcburb` | MCBURB backup posture | GOLD | `none` | — | `docs/security/Z_MCBURB_BACKUP_RECONVERGE_BOOSTER.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Advisory |
| `fbap` | FBAP fire-backs awareness | GOLD | `none` | — | `docs/security/Z_FBAP_FIRE_BACKS_AWARENESS_PROTOCOL.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Advisory |
| `nav_workstation` | NAV Workstation (catalog) | GREEN | `none` | — | `docs/dashboard/Z_UNIVERSE_WORKSTATION_NAVIGATOR.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Advisory |
| `zsx` | ZSX cross-project capability | YELLOW | `none` | — | `docs/cross-project/PHASE_ZSX_1_GREEN_RECEIPT.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Advisory |
| `zmc_magical` | ZMC Magical Canvas PlayKit | PURPLE | `none` | — | `docs/Z_SANCTUARY_MONSTER_PROJECT_MASTER_MAP.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Yes |
| `zsusbv_overseer` | Z-SUSBV Benchmark Overseer | YELLOW | `z_susbv_overseer` | `data/reports/z_susbv_overseer_report.json`; `data/reports/z_susbv_validation_report.json` | `docs/commercial/Z_SUSBV_BENCHMARK_OVERSEER.md` | AMK-Goku (hub steward) | When overlay report is refreshed (manual steward cadence) | Yes |
| `z_car2` | Z-CAR² structure mirror | — | `z_car2` | `data/reports/z_car2_similarity_report.json` | `docs/Z_AUTONOMOUS_GUARDIAN_LOOP.md` | AMK-Goku (hub steward) | When overlay report is refreshed (manual steward cadence) | Advisory |
| `zuno_coverage` | Z-Zuno coverage audit | — | `zuno` | `data/reports/z_zuno_coverage_audit.json` | `docs/AI_BUILDER_CONTEXT.md` | AMK-Goku (hub steward) | When overlay report is refreshed (manual steward cadence) | Advisory |
| `z_questra` | Z-QUESTRA | GREEN | `none` | — | `z-questra/README.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Advisory |
| `eirmind` | ÉirMind | PURPLE | `none` | — | `docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Yes |
| `zquestcraft` | ZQuestCraft (placeholder) | PURPLE | `none` | — | `docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Yes |
| `entitlement_catalog` | Service entitlement catalog | BLUE | `none` | — | `docs/cross-project/Z_SERVICE_ENTITLEMENT_AND_PRICING_POLICY.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Yes |
| `z_aal_advisor` | Z-AAL Autonomous Approval Ladder + Zuno Advisor (AAL-1) | GREEN | `none` | `data/reports/z_traffic_minibots_status.json` | `docs/AMK_AUTONOMOUS_APPROVAL_LADDER.md` | AMK-Goku | Static JSON / phase receipt — refresh when docs change | Advisory |
| `z_omnai_build_workbench` | Z-OMNAI Blueprint Capability Workbench | BLUE | `none` | `data/reports/z_omnai_build_plan_report.json`; `data/reports/z_omnai_blueprint_report.json` | `docs/creative/Z_OMNAI_BLUEPRINT_CAPABILITY_WORKBENCH.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Yes |
| `z_omnai_core_engine_simulation` | OMNAI core simulation (engines §02–09) | — | `omnai_core_overlay` | `data/reports/z_omnai_core_engine_indicator_overlay.json`; `data/reports/z_omnai_core_engine_matrix_summary.json` | `docs/creative/Z_OMNAI_BLUEPRINT_CAPABILITY_WORKBENCH.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Advisory |
| `z_omnai_movie_trailer_bundle` | Z-OMNAI movie trailer review bundle | GREEN | `none` | `data/reports/z_omnai_movie_trailer_bundle_report.json`; `data/reports/z_omnai_build_plan_report.json` | `docs/creative/Z_OMNAI_MOVIE_TRAILER_REVIEW_BUNDLE.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Yes |
| `z_omnai_master_media_seed` | Z-OMNAI master media concept seed | GREEN | `none` | `data/reports/z_omnai_master_media_seed_report.json`; `data/reports/z_omnai_movie_trailer_bundle_report.json` | `docs/creative/Z_OMNAI_MASTER_MEDIA_CONCEPT_SEED.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Yes |
| `z_omnai_media_letter_gate` | Z-OMNAI media letter gate (A–E) | YELLOW | `none` | `data/reports/z_omnai_media_letter_gate_report.json` | `docs/creative/Z_OMNAI_MEDIA_LETTER_GATE.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Yes |
| `z_ecosystem_awareness_spine` | Z-AWARE-1 Universal Ecosystem Awareness Spine | — | `z_ecosystem_awareness` | `data/reports/z_ecosystem_awareness_report.json`; `data/reports/z_ecosystem_awareness_report.md` | `docs/Z_ECOSYSTEM_AWARENESS_SPINE.md` | AMK-Goku (hub steward) | When overlay report is refreshed (manual steward cadence) | Advisory |
| `z_api_spine_power_cell` | Z-API-SPINE-1 Universal API Power Cell | — | `z_api_spine` | `data/reports/z_api_spine_report.json`; `data/reports/z_api_spine_report.md` | `docs/Z_API_SPINE_POWER_CELL.md` | AMK-Goku (hub steward) | When overlay report is refreshed (manual steward cadence) | Advisory |
| `z_ssws_launch_requirements` | Z-SSWS-LINK-1 Workspace launch requirements | — | `z_ssws` | `data/reports/z_ssws_launch_requirements_report.json`; `data/reports/z_ssws_launch_requirements_report.md` | `docs/Z_SSWS_WORKSPACE_SPINE.md` | AMK-Goku (hub steward) | When overlay report is refreshed (manual steward cadence) | Advisory |
| `amk_cursor_workspace_profiles` | AMK Cursor workspace profiles (Z-SSWS-LAB-1) | — | `amk_cursor_workspace_profiles` | `data/reports/amk_cursor_workspace_profiles_report.json`; `data/reports/amk_cursor_workspace_profiles_report.md` | `docs/AMK_CURSOR_WORKSPACE_STRATEGY.md` | AMK-Goku (hub steward) | When overlay report is refreshed (manual steward cadence) | Advisory |
| `z_amk_gtai_strategy_council` | Z-AMK-GTAI Strategy Council (decision reports) | — | `z_amk_gtai_strategy_council` | `data/reports/z_amk_gtai_strategy_report.json`; `data/reports/z_amk_gtai_strategy_report.md` | `docs/Z_AMK_GTAI_STRATEGY_COUNCIL.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Advisory |
| `amk_workspace_doorway` | AMK Workspace Doorway (Z-SSWS-DOOR-1) | — | `amk_workspace_doorway` | `data/reports/amk_workspace_doorway_status.json`; `data/reports/amk_workspace_doorway_status.md` | `docs/AMK_WORKSPACE_DOORWAY.md` | AMK-Goku (hub steward) | When overlay report is refreshed (manual steward cadence) | Advisory |
| `z_root_7_guardian_coordination` | Z-ROOT-7 Seven Guardian Coordination | GREEN | `none` | — | `docs/Z_ROOT_7_GUARDIAN_COORDINATION_LAYER.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Advisory |
| `z_logical_brains_hub_reference` | Z-Logical Brains hub reference | UNKNOWN | `none` | `data/reports/z_logical_brains_hub_reference_report.json`; `data/reports/z_logical_brains_hub_reference_report.md` | `docs/Z_LOGICAL_BRAINS_HUB_REFERENCE.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Yes |
| `z_numen_hub_reference` | Z-NUMEN hub reference | UNKNOWN | `none` | `data/reports/z_numen_hub_reference_report.json`; `data/reports/z_numen_hub_reference_report.md` | `docs/Z_NUMEN_HUB_REFERENCE.md` | AMK-Goku (hub steward) | Static JSON / phase receipt — refresh when docs change | Yes |
| `z_mod_dist_routing_advisor` | Z-MOD-DIST routing advisor | GREEN | `z_mod_dist` | `data/reports/z_mod_dist_report.md`; `data/reports/z_mod_dist_report.json` | `docs/Z_MOD_DIST_MODULE_DISTRIBUTOR.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `z_xbus_connector_gate` | Z-XBUS external connector gate | — | `z_xbus_gate` | `data/reports/z_xbus_connector_gate_report.json`; `data/reports/z_xbus_connector_gate_report.md` | `docs/Z_XBUS_EXTERNAL_CONNECTOR_GATE.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `z_ssws_super_saiyan_cockpit` | Z-SSWS Super Saiyan workspace cockpit | — | `z_ssws_cockpit` | `data/reports/z_ssws_cockpit_report.json`; `data/reports/z_ssws_cockpit_report.md` | `docs/Z_SSWS_SUPER_SAIYAN_WORKSPACE_COCKPIT.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `z_logical_brains_cadence_cycle` | Z-Logical Brains cadence cycle | UNKNOWN | `none` | `data/reports/z_cadence_cycle_report.json`; `data/reports/z_cadence_cycle_report.md` | `docs/Z_CADENCE_REAL_CYCLE_RUNNER.md` | AMK-Goku | Static JSON / phase receipt — refresh when docs change | Yes |
| `z_pc_ide_path_health` | Z-PC-IDE-PATH install / PATH health | — | `none` | `data/reports/z_pc_ide_path_report.json`; `data/reports/z_pc_ide_path_report.md` | `docs/Z_PC_IDE_PATH_HEALTH_CHECK.md` | AMK-Goku | Static JSON / phase receipt — refresh when docs change | Advisory |
| `z_replica_fabric_governance` | Z-Replica Fabric governed replication | BLUE | `z_replica_fabric` | `data/reports/z_replica_fabric_report.json`; `data/reports/z_replica_fabric_report.md` | `docs/Z_REPLICA_FABRIC_GOVERNED_SELF_REPLICATION.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `z_ultra_mage_formula_codex` | Z-Ultra MAGE formula codex | BLUE | `z_ultra_mage` | `data/reports/z_ultra_mage_formula_report.json`; `data/reports/z_ultra_mage_formula_report.md` | `docs/Z_ULTRA_MAGE_FORMULA_CODEX.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `z_mu_truth_civic_engine` | Z-MU Truth — Mauritius civic dignity engine | BLUE | `z_mu_truth` | `data/reports/z_mu_truth_report.json`; `data/reports/z_mu_truth_report.md` | `docs/Z_MAURITIANS_UNITE_CIVIC_TRUTH_ENGINE.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `z_mu_civic_knowledge_advisor` | Z-MU Advisor — Mauritius civic knowledge framework | BLUE | `z_mu_advisor` | `data/reports/z_mu_advisor_report.json`; `data/reports/z_mu_advisor_report.md` | `docs/Z_MU_CIVIC_KNOWLEDGE_ADVISOR.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `z_pattern_safe_governance` | Z-Pattern Safe — universal pattern simulation governance | BLUE | `z_pattern_safe` | `data/reports/z_pattern_safe_report.json`; `data/reports/z_pattern_safe_report.md` | `docs/Z_PATTERN_SAFE_UNIVERSAL_PATTERN_SIMULATION.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `amk_ai_team_indicator_sync` | AMK AI Team — indicator sync + decision router | — | `amk_ai_team_sync` | `data/reports/amk_ai_team_sync_report.json`; `data/reports/amk_ai_team_sync_report.md` | `docs/AMK_AI_TEAM_INDICATOR_SYNC_ROUTER.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `z_ai_fusion_capability_map` | Z-AI Fusion — capability overlap map | — | `z_ai_fusion_map` | `data/reports/z_ai_fusion_map_report.json`; `data/reports/z_ai_fusion_map_report.md` | `docs/Z_AI_FUSION_CAPABILITY_MAP.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `z_stillness_ai_learning_pathway` | Z-Stillness — AI learning pathway | — | `z_stillness_learning` | `data/reports/z_stillness_learning_report.json`; `data/reports/z_stillness_learning_report.md` | `docs/Z_STILLNESS_MODE_AI_LEARNING_PATHWAY.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Advisory |
| `z_legal_ops_workstation` | Z-Legal Ops workstation | — | `z_legal_ops` | `data/reports/z_legal_ops_report.json`; `data/reports/z_legal_ops_report.md` | `docs/Z_LEGAL_EVIDENCE_CORE.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `z_legal_product_ops_workstation` | Z-Legal Product and IP workstation | — | `z_legal_product_ops` | `data/reports/z_legal_product_ops_report.json`; `data/reports/z_legal_product_ops_report.md` | `docs/Z_LEGAL_PRODUCT_IP_COMPLIANCE_WORKSTATION.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `z_legal_workstation_stack` | Z-Legal Workstation full stack requirements | — | `z_legal_workstation_stack` | `data/reports/z_legal_workstation_stack_report.json`; `data/reports/z_legal_workstation_stack_report.md` | `docs/Z_LEGAL_WORKSTATION_STACK_REQUIREMENTS.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `z_legal_toolbelt` | Z-Legal Toolbelt Dock | GREEN | `z_legal_toolbelt` | — | `docs/Z_LEGAL_WORKSTATION_TOOLBELT.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `z_legal_workstation_ux` | Z-Lawyer Workstation UX-2 (compact protector) | GREEN | `z_legal_workstation_ux` | — | `docs/PHASE_Z_LEGAL_WORKSTATION_UX_2_GREEN_RECEIPT.md` | AMK-Goku | When overlay report is refreshed (manual steward cadence) | Yes |
| `dashboard_registry` | Dashboard registry verify | — | `dashboard_registry` | `data/reports/z_dashboard_registry_verify.json` | `dashboard/README.md` | AMK-Goku (hub steward) | When overlay report is refreshed (manual steward cadence) | Advisory |
| `z_deployment_readiness` | Z-Deployment-Readiness overseer | — | `z_deployment_readiness` | `data/reports/z_deployment_readiness_status.json` | `docs/Z_DEPLOYMENT_READINESS_OVERSEER.md` | AMK-Goku (hub steward) | When overlay report is refreshed (manual steward cadence) | Advisory |

---

## Overlay → report map (from UI script)

| Overlay key | Typical report path |
| --- | --- |
| `z_traffic` | `data/reports/z_traffic_minibots_status.json` |
| `z_susbv_overseer` | `data/reports/z_susbv_overseer_report.json` |
| `z_car2` | `data/reports/z_car2_similarity_report.json` |
| `zuno` | `data/reports/z_zuno_state_report.json (confirm path in overlay fetch)` |
| `dashboard_registry` | `data/reports/z_dashboard_registry_verify.json` |
| `deployment_readiness` | `data/reports/z_deployment_readiness_status.json` |
| `z_ecosystem_awareness` | `data/reports/z_ecosystem_awareness_report.json` |
| `z_api_spine` | `data/reports/z_api_spine_report.json` |
| `z_ssws` | `data/reports/z_ssws_launch_requirements_report.json` |
| `amk_workspace_doorway` | `data/reports/amk_workspace_doorway_status.json` |
| `amk_cursor_workspace_profiles` | `data/reports/amk_cursor_workspace_profiles_report.json` |
| `z_amk_gtai_strategy_council` | `data/reports/z_amk_gtai_strategy_report.json` |

---

## Gaps (recommendations — do not auto-fix)

| Gap | Note |
| --- | --- |
| Empty `related_reports` + overlay `none` | Trust rests on phase docs / `last_known_basis` |
| Stale overlay reports | Colour may lag — pair with Freshness Cadence |
| Fetch failure | UI must not fabricate GREEN |

## Next rhythm (recorded, not automated)

See [Freshness Cadence](Z_SANCTUARY_FRESHNESS_CADENCE.md) — Daily / Weekly / Monthly / Quarterly.

*Atlas v1 · OS Health · strengthens Layers 3–5 · no new systems*
