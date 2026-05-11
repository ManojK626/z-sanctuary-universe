# Z-Zuno coverage audit

Generated (UTC hint): machinery local time · commit not inferred.

## Summary

| Status | Count |
| --- | ---: |
| FOUND_FULL | 29 |
| FOUND_PARTIAL | 30 |
| MISSING | 0 |
| DUPLICATE_OR_CONFLICT | 0 |
| NEEDS_SAFETY_REVIEW | 8 |
| NEEDS_DECISION | 1 |

## Reference files presence

| File | Exists |
| --- | :---: |
| `data/z_master_module_registry.json` | yes |
| `docs/Z-ZUNO-AI-FULL-REPORT.md` | yes |
| `docs/Z-SANCTUARY-MASTER-MODULE-INDEX.md` | no |
| `data/Z_module_registry.json` | yes |
| `data/z_modules_registry.json` | no |
| `data/z_sovereign_products_registry.json` | yes |

## FOUND FULL

| id | registry | evidence (found) | missing paths | notes |
| --- | --- | --- | --- | --- |
| commander_panel | implemented | `dashboard/scripts/z-commander-panel.js` | — | — |
| core_engines_registry_datafile | implemented | `data/z_core_engines_registry.json` | — | — |
| display_morph_engine | implemented | `dashboard/scripts/z-display-morph-engine.js` | — | — |
| master_modules_register_doc | implemented | `docs/Z-MASTER-MODULES-REGISTER.md` | — | — |
| mdgev_grid | implemented | `dashboard/z-mdgev/index.html`<br>`dashboard/z-mdgev/mdg.js` | — | — |
| module_registry_hub | implemented | `scripts/z_module_registry_sync.mjs`<br>`data/Z_module_registry.json`<br>`data/z_module_manifest.json` | — | — |
| outreach_pitch_compliance_pack | partial | `docs/Z-BUILD-GATE-MATRIX.md` | — | — |
| qa_rp_surface | implemented | `dashboard/z-qa-rp/index.html`<br>`dashboard/z-qa-rp/qa-rp.js`<br>`data/z_qa_rp_registry.json` | — | — |
| registry_omni_verify | implemented | `scripts/z_registry_omni_verify.mjs` | — | — |
| soundscape_pulse | implemented | `core/z_soundscape_pulse_panel.js`<br>`core/z_soundscape_audio.js`<br>`docs/Z-ACOUSTIC-LIVING-PULSE-ARCHITECTURE.md` | — | — |
| sovereign_products_registry | implemented | `data/z_sovereign_products_registry.json` | — | — |
| twin_roots_phase1 | implemented | `data/z_twin_roots_phase1_mock.json`<br>`scripts/z_twin_roots_status.mjs`<br>`dashboard/panels/z_twin_roots_architecture.html` | — | — |
| z-adaptive-learning-phase3 | implemented | `scripts/z_learning_evaluator.mjs` | — | — |
| z-addon-dashboard-surface | implemented | `dashboard/Html/z-addon-dashboard.html` | — | — |
| z-ai-qadp | implemented | `docs/Z-AI-QADP-QUESTIONS-ANSWERS-DIRECTED-PATHWAYS.md` | — | — |
| z-cross-system-intelligence-phase4 | implemented | `scripts/z_cross_system_synthesizer.mjs` | — | — |
| z-cursor-folder-blueprint | implemented | `docs/Z-CURSOR-FOLDER-STRUCTURE-AND-AI-WORKFLOWS.md` | — | — |
| z-ggaesp-pipeline-360 | implemented | `core_engine/ggaesp_pipeline.ts` | — | — |
| z-heartpulse-engine | partial | `docs/Z-HEARTPULSE-ENGINE.md` | — | — |
| z-mini-bots-phase1 | implemented | `bots/guardian/guardian_bot.mjs` | — | — |
| z-prediction-validation-phase55 | implemented | `scripts/z_prediction_validator.mjs` | — | — |
| z-predictive-intelligence-phase5 | implemented | `scripts/z_predictive_intelligence_engine.mjs` | — | — |
| z-qosmei-core-signal-fusion | implemented | `scripts/z_qosmei_signal_fusion.mjs` | — | — |
| z-sanctuary-core-wrapper | implemented | `packages/z-sanctuary-core/index.js` | — | — |
| z-spi-decision-advisor | implemented | `scripts/z_spi_decision_advisor.mjs` | — | — |
| z-structural-pattern-intelligence | implemented | `scripts/z_structural_pattern_intelligence.mjs` | — | — |
| z-super-chat-orchestrator | implemented | `docs/Z-SUPER-CHAT-BLUEPRINT.md` | — | — |
| zuno_coverage_audit | implemented | `scripts/z_zuno_coverage_audit.mjs`<br>`data/z_master_module_registry.json` | — | — |
| zuno_observer | implemented | `scripts/z_zuno_state_report.mjs` | — | docs/Z-ZUNO-AI-FULL-REPORT.md: ok (Zuno, z_zuno) |

## FOUND PARTIAL

| id | registry | evidence (found) | missing paths | notes |
| --- | --- | --- | --- | --- |
| ai-agent-designer | planned_stub | — | — | — |
| ai-agent-navigator | planned_stub | — | — | — |
| ai-agent-protector | planned_stub | — | — | — |
| ai-agent-scribe | planned_stub | — | — | — |
| ai-tower | planned_stub | — | — | — |
| autopilot-engine | planned_stub | — | — | — |
| core-chronicle | planned_stub | — | — | — |
| core-chronicle-hud | planned_stub | — | — | — |
| core-dashboard | planned_stub | — | — | — |
| core-emotion-filter | planned_stub | — | — | — |
| core-energy-response | planned_stub | — | — | — |
| core-status-console | planned_stub | — | — | — |
| family_companion_grove | planned_stub | — | — | — |
| global_eco_marketplace_awareness | doctrine_only | — | — | — |
| media_storytelling_os | doctrine_only | — | — | — |
| rkpk-companion | planned_stub | — | — | — |
| sepc-governance | planned_stub | — | — | — |
| skk-companion | planned_stub | — | — | — |
| social-arena | planned_stub | — | — | — |
| z_gadget_mirrors_product | doctrine_only | — | — | — |
| z-anima-core | planned_stub | — | — | — |
| z-ecosphere-transparency-report | planned_stub | — | — | — |
| z-fhmff-lite | doctrine_only | — | — | — |
| z-kbozsu | planned_stub | — | — | — |
| z-krtaa-curriculum-emitter | doctrine_only | — | — | — |
| z-papao-precautions-advisor | planned_stub | — | — | — |
| z-pis-projects-identifier-sharing | planned_stub | — | — | — |
| z-whale-bus-spine | planned_stub | — | — | — |
| z-zecce-confirmations | doctrine_only | — | — | — |
| zen_scheduler_hub | planned_stub | — | — | — |

## NEEDS SAFETY REVIEW

| id | registry | evidence (found) | missing paths | notes |
| --- | --- | --- | --- | --- |
| gambling_prediction_voice | safety_hold | — | — | docs/safety/GAMBLING_PREDICTION_BOUNDARY.md: ok (gambling, prediction) |
| gps_safety_module | safety_hold | — | — | docs/safety/LOCATION_CAMERA_MIC_BOUNDARY.md: ok (location, consent) |
| mirrorsoul_hub_slice | implemented | `packages/z-sanctuary-mirrorsoul-slice/index.mjs`<br>`packages/z-sanctuary-mirrorsoul-slice/package.json`<br>`apps/web/src/app/mirrorsoul/page.js`<br>`apps/api/src/modules/mirrorSoul/controller.mjs` | — | docs/safety/MIRRORSOUL_PRIVACY_BOUNDARY.md: ok (MirrorSoul, privacy) |
| movement_health_coach_lite | safety_hold | — | — | docs/safety/NON_MEDICAL_PRODUCT_BOUNDARY.md: ok (non-medical, disclaimer) |
| public_trust_portal_lottery | implemented | `Amk_Goku Worldwide Loterry/ui/public_trust/trust_portal.js` | — | docs/safety/LOTTERY_RESPONSIBLE_USE_BOUNDARY.md: ok (lottery, responsible) |
| roulette | safety_hold | — | — | — |
| roulette-calculator | safety_hold | — | — | — |
| soulmate_baby_predictor | safety_hold | — | — | — |

## NEEDS DECISION

| id | registry | evidence (found) | missing paths | notes |
| --- | --- | --- | --- | --- |
| ethical_monetization_layer | decision_required | — | — | — |

## Suggested manual follow-ups

- If `FOUND_PARTIAL` / `MISSING`: add/adjust paths in `data/z_master_module_registry.json` (truth list must stay grounded).
- `NEEDS_SAFETY_REVIEW`: add boundary docs / gates before UX or automation expands.
- `docs/Z-ZUNO-AI-FULL-REPORT.md`: extend with summaries from this audit; do not let AI invent file paths there.
