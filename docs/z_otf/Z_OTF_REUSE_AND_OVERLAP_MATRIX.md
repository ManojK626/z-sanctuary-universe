# Z-OTF — Reuse and Overlap Matrix

**Phase:** 0 · **Mutation class:** `DOCS_ONLY`
**Audit base:** `origin/main` @ `b8f950dcc1da59a2dc537cb6443ddd7574ed219d`
**Audit method:** `git ls-files` path survey plus `git grep` content survey over tracked files on the base commit
**Purpose:** prevent duplicate architecture

Governing rule:

> Before BUILD, prove GAP.

---

## 1. Classification vocabulary

| State | Meaning |
| --- | --- |
| `REUSE_CANONICAL` | A canonical surface exists and was positively located on the audit base. Z-OTF consumes it by reference. |
| `REUSE_WITH_ADAPTER_LATER` | A canonical surface exists but a future authorized interface is required before Z-OTF can consume it. |
| `POSSIBLE_OVERLAP_REVIEW` | Something related exists; ownership or scope overlap needs Steward review before either side builds. |
| `NO_CANONICAL_MATCH_FOUND` | Targeted path and content searches on this base returned nothing. **This is a search result, not proof of absence.** |
| `UNKNOWN` | Existence is asserted or implied elsewhere but could not be verified on this base. |

Discipline inherited from [Z-LIC Constitution Spec 1](../Z_LIC_LIVING_INTELLIGENCE_COMMONS_CONSTITUTION_SPEC_1.md) section 26: do not promote memory, another branch, untracked files, or earlier design discussion into canonical architectural fact.

---

## 2. Governance and authority

| Z-OTF need | Located canonical surface | State | Z-OTF action |
| --- | --- | --- | --- |
| Universe law | `docs/governance/Z_SANCTUARY_UNIVERSE_CONSTITUTION_V1.md` | `REUSE_CANONICAL` | INHERIT by reference; never duplicate |
| Hierarchy / observer view | `docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md`, `.cursor/rules/z-hierarchy-chief.mdc` | `REUSE_CANONICAL` | INHERIT; check-first preserved |
| Universal agent law | `docs/Z_SWARM_14DRP_UNIVERSAL_AGENT_LAW.md`, `data/z_swarm_14drp_agent_law_registry.json`, `scripts/z_swarm_14drp_validate.mjs` | `REUSE_CANONICAL` | INHERIT; no competing ethics layer |
| Agent session protocol | `docs/Z_IDE_14DRP_AGENT_PROTOCOL.md`, `data/z_ide_14drp_agent_protocol_registry.json` | `REUSE_CANONICAL` | CONSUME |
| Change control | `.cursor/rules/z-turtle-mode-cursor-agents.mdc` | `REUSE_CANONICAL` | OBEY |
| Build doctrine | `.cursor/rules/z-cursor-build-master-doctrine.mdc` | `REUSE_CANONICAL` | OBEY |
| Continuity / completion oversight | `docs/Z_CONTINUITY_COMPLETION_OVERSEER.md` | `REUSE_CANONICAL` | CONSUME; do not build a second completion overseer |

---

## 3. Truth, evidence and provenance

| Z-OTF need | Located canonical surface | State | Z-OTF action |
| --- | --- | --- | --- |
| Epistemic distinctions and truth states | `docs/Z_POT_PATTERNS_OF_TRUTH_CONSTITUTION_SPEC_1.md` | `REUSE_CANONICAL` | REUSE the state vocabulary verbatim; invent no competing truth score |
| Prohibition on numeric truth scores | Z-PoT section 8 | `REUSE_CANONICAL` | OBEY |
| UNKNOWN as valid result | Z-PoT section 7 | `REUSE_CANONICAL` | OBEY |
| Provenance checking | `config/provenance_manifest.json`, `scripts/z_provenance_check.mjs`, `data/reports/z_provenance_check.json` | `REUSE_WITH_ADAPTER_LATER` | STUDY before defining any Z-OTF provenance field |
| Simulation governance | `docs/Z_PATTERN_SAFE_UNIVERSAL_PATTERN_SIMULATION.md`, `docs/Z_LEGAL_WORKSTATION_SIMULATION_MODE.md` | `REUSE_CANONICAL` | REUSE for the simulation-to-assertion guard; do not invent a parallel mock-labelling law |
| Contradiction / counterevidence handling | Z-PoT sections 6 and 10 | `REUSE_CANONICAL` | CONSUME |

**Verified alignment.** The evidence-posture states in [Z-OTF Evidence and State Doctrine](Z_OTF_EVIDENCE_AND_STATE_DOCTRINE.md) were checked against Z-PoT section 7 on this base and match it exactly: `KNOWN`, `SUPPORTED`, `LIKELY`, `PLAUSIBLE`, `MIXED`, `DISPUTED`, `UNVERIFIED`, `CONTRADICTED`, `UNKNOWN`. Z-OTF adds no new epistemic state.

---

## 4. Shared learning and feedback

| Z-OTF need | Located canonical surface | State | Z-OTF action |
| --- | --- | --- | --- |
| Learning / evolution authority rules | `docs/Z_LIC_LIVING_INTELLIGENCE_COMMONS_CONSTITUTION_SPEC_1.md` | `REUSE_CANONICAL` | INHERIT; learning confers no authority |
| Learning architecture reconciliation | `docs/Z_LIC_LIVING_INTELLIGENCE_COMMONS_ARCHITECTURE_RECONCILIATION_1.md` | `REUSE_CANONICAL` | CONSUME |
| AI learning pathway | `docs/Z_STILLNESS_MODE_AI_LEARNING_PATHWAY.md`, `data/z_stillness_learning_registry.json` | `POSSIBLE_OVERLAP_REVIEW` | Do not build a second learning pathway engine without Steward review |
| Learning log / history | `scripts/z_learning_log_append.mjs`, `data/logs/z_learning_history.jsonl`, `scripts/z_learning_evaluator.mjs` | `REUSE_WITH_ADAPTER_LATER` | CONSUME transport rather than a new log |
| Feedback triage | `docs/ai-hand/FEEDBACK_TRIAGE_RULES.md` | `REUSE_CANONICAL` | CONSUME |
| Adaptive learning | `docs/modules/trust_audit_governance/z-adaptive-learning-phase3.md`, `data/reports/z_adaptive_learning_state.json` | `POSSIBLE_OVERLAP_REVIEW` | Review before any Z-OTF learning loop |

Z-LIC section 11 states explicitly that Z-LIC does not own MiniBots, Zuno, Z-Omni, Z-PoT, Z-ICIS, Stewardship, 14 DRP, existing communication infrastructure, Project World, Z-Composed Awareness, or individual project AIs. Z-OTF must respect the same ownership boundary and claim none of them.

---

## 5. Commercial evidence

| Z-OTF need | Located canonical surface | State | Z-OTF action |
| --- | --- | --- | --- |
| Self-benchmark validation | `docs/commercial/Z_SUSBV_SANCTUARY_SELF_BENCHMARKS_VALIDATION.md`, `scripts/z_susbv_validate.mjs` | `REUSE_CANONICAL` | CONSUME; Z-SUSBV remains the commercial evidence authority |
| Price and claim policy | `docs/commercial/Z_SUSBV_PRICE_CLAIM_POLICY.md` | `REUSE_CANONICAL` | OBEY; no invented amounts, no superiority wording |
| Benchmark overseer | `docs/commercial/Z_SUSBV_BENCHMARK_OVERSEER.md`, `data/z_susbv_overseer_policy.json`, `scripts/z_susbv_overseer_validate.mjs` | `REUSE_CANONICAL` | CONSUME |
| Market comparison policy | `docs/commercial/Z_SUSBV_GLOBAL_MARKET_COMPARISON_POLICY.md`, `data/z_susbv_global_market_comparison_registry.json` | `REUSE_CANONICAL` | CONSUME; do not build a competing comparator authority |
| Benchmark registry | `data/z_susbv_benchmark_registry.json`, `data/z_susbv_project_benchmark_index.json` | `REUSE_CANONICAL` | CONSUME read-only |
| Service price validation | `data/z_susbv_service_price_validation.json`, `data/z_susbv_module_to_service_map.json` | `REUSE_CANONICAL` | CONSUME read-only |
| SUSBV minibots | `docs/commercial/Z_SUSBV_MINIBOTS.md` | `REUSE_CANONICAL` | CONSUME; no new commercial minibot authority |
| Project capsule policy | `docs/commercial/Z_SUSBV_PROJECT_CAPSULE_POLICY.md`, `data/examples/z_project_benchmark_capsule.example.json` | `REUSE_CANONICAL` | CONSUME |
| Commercial readiness | `docs/COMMERCIAL-READINESS.md` | `REUSE_CANONICAL` | CONSUME |
| Pricing doctrine | `docs/pricing-and-benchmarks.md` | `REUSE_CANONICAL` | CONSUME |
| Market freshness ritual | `docs/QUARTERLY-MARKET-AND-FACTS-REVIEW.md` | `REUSE_CANONICAL` | CONSUME; tie any public claim change to this review |
| Legal benchmark readiness | `docs/Z_LEGAL_GLOBAL_BENCHMARK_READINESS_PANEL.md`, `dashboard/data/z_legal_benchmark_readiness.json` | `POSSIBLE_OVERLAP_REVIEW` | Review before any Z-OTF readiness panel |

Z-SUSBV price and claim policy also fixes the evidence rule Z-OTF must obey: dollar figures belong in human-reviewed sources and must cite a URL, date, or internal receipt identifier.

---

## 6. Entitlement and autonomy

| Z-OTF need | Located canonical surface | State | Z-OTF action |
| --- | --- | --- | --- |
| Entitlement / pricing separation | `docs/cross-project/Z_SERVICE_ENTITLEMENT_AND_PRICING_POLICY.md` | `REUSE_CANONICAL` | CONSUME |
| Entitlement catalog | `data/z_service_entitlement_catalog.json` | `REUSE_CANONICAL` | CONSUME read-only; catalog rows grant no billing |
| Entitlement boundary precedent | `docs/cross-project/Z_MAGICAL_VISUAL_ENTITLEMENT_BOUNDARY.md` | `REUSE_CANONICAL` | STUDY as precedent |
| Autonomy limits | `data/z_autonomy_task_policy.json` | `REUSE_CANONICAL` | CONSUME |
| Autonomy levels doctrine | `docs/Z_AUTONOMY_LEVELS_POLICY.md` | `REUSE_CANONICAL` | OBEY; Z-OTF creates no new autonomy ladder |

---

## 7. Operational health and observation

| Z-OTF need | Located canonical surface | State | Z-OTF action |
| --- | --- | --- | --- |
| Minibot traffic state | `docs/Z_TRAFFIC_MINIBOTS.md`, `scripts/z_traffic_minibots_status.mjs`, `data/reports/z_traffic_minibots_status.json` | `REUSE_CANONICAL` | CONSUME; minibots advise, humans choose |
| Service level guard | `config/z_slo_targets.json`, `config/z_slo_profiles.json`, `scripts/z_slo_guard.mjs`, `core/z_slo_badge.js` | `REUSE_CANONICAL` | CONSUME; any uptime statement must derive from measured guards |
| Indicators and go / no-go | `docs/AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md`, `dashboard/data/amk_project_indicators.json`, `scripts/z_indicator_watchdog.mjs` | `REUSE_CANONICAL` | CONSUME |
| Indicator sync router | `docs/AMK_AI_TEAM_INDICATOR_SYNC_ROUTER.md` | `REUSE_CANONICAL` | CONSUME |
| Dashboard registry | `data/z_mdg_dashboard_registry.json`, `scripts/z_dashboard_registry_verify.mjs` | `REUSE_WITH_ADAPTER_LATER` | INTEGRATE LATER; do not build a competing roof |
| System health / guardian | `scripts/z_guardian_report.mjs`, `data/reports/z_system_health.json`, `data/reports/Z_SYSTEM_HEALTH_CERTIFICATE.sha256` | `REUSE_CANONICAL` | CONSUME |
| Communication health | `scripts/z_communication_health.mjs`, `data/reports/z_communication_health.json` | `REUSE_CANONICAL` | CONSUME |

---

## 8. Cross-project awareness and identity

| Z-OTF need | Located canonical surface | State | Z-OTF action |
| --- | --- | --- | --- |
| Cross-project capability index | `data/z_cross_project_capability_index.json`, `scripts/z_cross_project_capability_sync.mjs`, `docs/cross-project/Z_CROSS_PROJECT_CAPABILITY_SYNC.md` | `REUSE_CANONICAL` | CONSUME; no new capability index |
| Ecosystem awareness spine | `docs/Z_ECOSYSTEM_AWARENESS_SPINE.md`, `data/z_ecosystem_awareness_registry.json`, `scripts/z_ecosystem_awareness_check.mjs` | `REUSE_CANONICAL` | CONSUME; no new awareness plane |
| Project awareness capsule | `docs/Z_PROJECT_AWARENESS_CAPSULE_POLICY.md`, `data/z_sanctuary_universe_awareness_capsule.json` | `REUSE_CANONICAL` | CONSUME |
| Cross-project observer | `core/z_cross_project_observer_badge.js`, `scripts/z_cross_project_health_probe.mjs`, `data/reports/z_cross_project_observer.json` | `REUSE_CANONICAL` | CONSUME |
| Capability overlap governance | `docs/Z_AI_FUSION_CAPABILITY_MAP.md`, `data/z_ai_fusion_capability_registry.json` | `REUSE_CANONICAL` | CONSUME as the existing overlap-governance surface |
| Cross-project linking policy | `docs/z-maos/CROSS_PROJECT_LINKING_POLICY.md` | `REUSE_CANONICAL` | OBEY |
| Z-Composed Awareness read model | Named as an existing organ by Z-PoT section 18 and Z-LIC section 11, but no implementation or specification document is tracked on this base | `UNKNOWN` | Do **not** design around it and do **not** rebuild it. A future gate must locate the canonical surface first. |
| Project identity / PID mechanism | No `data/z_universe_project_registry.json` and no PID-named surface on this base | `UNKNOWN` | Defer entirely to Phase 0.5; re-verify canonical registry surfaces at that time |

**Evidence note on Z-Composed Awareness.** The implementation documents `docs/Z_COMPOSED_AWARENESS_READ_MODEL_P0_IMPLEMENTATION_1.md` and `docs/Z_COMPOSED_AWARENESS_PROJECT_WORLD_CRYSTAL_DNA_P0_IMPLEMENTATION_1.md` exist on the unmerged local branch `cursor/zsanctuary/global-open-workflow-reconciliation` @ `3f02aa6`, not on `origin/main`. Per Z-LIC section 26 they remain `UNKNOWN` as hub authority for this phase.

---

## 9. Receipts, custody and recovery

| Z-OTF need | Located canonical surface | State | Z-OTF action |
| --- | --- | --- | --- |
| Green receipt convention | approximately 150 `docs/PHASE_*_GREEN_RECEIPT.md` files, including `docs/PHASE_Z_POT_CONSTITUTION_SPEC_1_GREEN_RECEIPT.md` | `REUSE_CANONICAL` | REUSE the format; this phase does so |
| Reconciliation receipts | `docs/reconciliation/` | `REUSE_CANONICAL` | REUSE |
| Lifeboat recovery organism | `docs/Z_LIFEBOAT_RECOVERY_ORGANISM_SPEC_1.md` | `REUSE_CANONICAL` | CONSUME |
| Lifeboat git bundle custody | `docs/Z_LIFEBOAT_GIT_BUNDLE_SPEC_1.md` | `REUSE_CANONICAL` | CONSUME |
| Dual offline custody | `docs/Z_LIFEBOAT_DUAL_OFFLINE_CUSTODY_SPEC_1.md`, `docs/Z_LIFEBOAT_OFFLINE_CUSTODY_SECURITY_PREFLIGHT_1.md` | `REUSE_CANONICAL` | CONSUME |
| Cloud custody boundary | `docs/Z_R2_LIFEBOAT_CUSTODY_RECONCILIATION_0.md`, Z-LIC section 27 | `REUSE_CANONICAL` | OBEY: custody is evidence redundancy, not evidence authority |
| Digest / manifest custody practice | `exports/trust_pack_2026-03/verification/hashes.sha256`, `config/governance_sync_log.sha256` | `REUSE_CANONICAL` | REUSE the existing digest convention |
| Product-facing evidence receipts | `docs/Z_LEGAL_EVIDENCE_CORE.md` describes an "evidence receipt map (commands run, generated reports, registry links)" | `POSSIBLE_OVERLAP_REVIEW` | **Naming resolved 2026-09-07:** Z-OTF will not use "Evidence Receipt". Future artifact is Operational Provenance Record (`OPR`). Legal compatibility remains CLOSED until a Phase 1 review. No schema now. |
| Cryptographic receipt with signature, key rotation and public verification | No signing, key-management, or public-verification surface located on this base | `NO_CANONICAL_MATCH_FOUND` | Candidate genuine gap; remains CLOSED until a future gate re-verifies |

---

## 10. Communication and external adapters

| Z-OTF need | Located canonical surface | State | Z-OTF action |
| --- | --- | --- | --- |
| Communication flow policy | `docs/Z_API_COMMUNICATION_FLOW_POLICY.md`, `data/z_api_communication_flow_policy.json` | `REUSE_CANONICAL` | OBEY |
| Communication spine | `docs/zuno-4root/ZUNO_4ROOT_COMMUNICATION_SPINE.md` | `REUSE_CANONICAL` | CONSUME; do not build a second spine |
| Comms flow verification | `scripts/z_ecosystem_commflow_verifier.mjs`, `scripts/z_ide_commflow_guard.mjs` | `REUSE_CANONICAL` | CONSUME |
| Comms security audit | `docs/Z_SEC_TRIPLECHECK_COMMUNICATION_FLOW_AUDIT.md` | `REUSE_CANONICAL` | CONSUME |
| External connector gate | `docs/Z_XBUS_EXTERNAL_CONNECTOR_GATE.md`, `docs/Z_XBUS_CONNECTOR_SECURITY_POLICY.md`, `data/z_xbus_connector_registry.json`, `scripts/z_xbus_connector_gate_check.mjs` | `REUSE_CANONICAL` | **Mandatory.** Every future Z-OTF external provider must pass this existing gate. Z-OTF creates no parallel adapter gate. |
| Operator notification | `docs/PHASE_AMK_NOTIFY_1_GREEN_RECEIPT.md`, `data/amk_operator_notifications.json` | `REUSE_WITH_ADAPTER_LATER` | CONSUME |
| Workflow control | `docs/Z_IDE_FUSION_WORKFLOW_CONTROL.md`, `data/z_ide_fusion_control_registry.json` | `POSSIBLE_OVERLAP_REVIEW` | Review before any Z-OTF work-item model |
| Business or customer messaging workflow (WhatsApp, quick replies, approvals) | Only an incidental mention in `data/examples/z_mu_advisor_sample_questions.json`; no messaging workflow engine located | `NO_CANONICAL_MATCH_FOUND` | Candidate gap. Any future work routes through the Z-XBUS gate. Absence is a search result, not proof. |

---

## 11. Knowledge, media and product lanes

| Z-OTF need | Located canonical surface | State | Z-OTF action |
| --- | --- | --- | --- |
| Memory / knowledge layer | `docs/orchestration/ZUNO_MEMORY_KNOWLEDGE_LAYER.md` | `POSSIBLE_OVERLAP_REVIEW` | Review before any Z-OTF knowledge interface |
| Civic knowledge advisor precedent | `docs/Z_MU_CIVIC_KNOWLEDGE_ADVISOR.md` | `REUSE_CANONICAL` | STUDY as the existing source-linked-answer precedent |
| Research intake and allowlist | `docs/Z_RESEARCH_REVIEW_PROTOCOL.md`, `config/z_research_allowlist.json`, `scripts/z_research_intake.mjs` | `REUSE_CANONICAL` | CONSUME |
| Document taxonomy | `docs/Z_DOC_TAXONOMY.md` | `REUSE_CANONICAL` | OBEY |
| Media engines | `docs/creative/Z_OMNAI_MASTER_MEDIA_CONCEPT_SEED.md`, `docs/creative/Z_OMNAI_MEDIA_LETTER_GATE.md`, `docs/modules/media_creative/media_storytelling_os.md` | `REUSE_CANONICAL` | REUSE; Z-OTF builds no media engine |
| Product / IP compliance workstation | `docs/Z_LEGAL_PRODUCT_IP_COMPLIANCE_WORKSTATION.md`, `docs/Z_LEGAL_PRODUCT_SAFETY_AND_IP_POLICY.md` | `POSSIBLE_OVERLAP_REVIEW` | Review before any Z-OTF compliance surface |
| Sovereign products registry | `data/z_sovereign_products_registry.json`, `scripts/z_product_registry_verify.mjs` | `REUSE_WITH_ADAPTER_LATER` | Any future product identity uses this, not a new registry |
| Local-first data mode doctrine | Term appears in module registers and status reports as a descriptor; no doctrine defining `LOCAL_ONLY` versus `LOCAL_FIRST_SYNC` versus cloud-consented modes was located | `NO_CANONICAL_MATCH_FOUND` | Candidate gap; Z-OTF may declare the vocabulary in doctrine only, with no runtime claim |
| Academy / accreditation | No academy or accreditation surface located | `NO_CANONICAL_MATCH_FOUND` | Remains CLOSED |
| Tax / VAT engine | No tax engine located | `NO_CANONICAL_MATCH_FOUND` | Remains CLOSED; high-risk lane |
| Server-enforced role-based access | No RBAC surface located | `NO_CANONICAL_MATCH_FOUND` | Remains CLOSED; role switching is not security |
| Invoice / billing engine | Only incidental mentions in reports and registries; no billing engine located | `NO_CANONICAL_MATCH_FOUND` | Remains CLOSED |

---

## 12. Verification and hygiene reuse

| Z-OTF need | Located canonical surface | State |
| --- | --- | --- |
| Markdown / docs verification | `npm run verify:md` via `.markdownlint.json` | `REUSE_CANONICAL` |
| Canonical alias audit | `npm run alias:audit` (`scripts/z_canonical_alias_audit.mjs`) | `REUSE_CANONICAL` |
| Data leak audit | `npm run security:data-leak-audit` (`scripts/z_data_leak_detector.mjs`) | `REUSE_CANONICAL` |
| Placeholder directory audit | `npm run placeholder:audit` (`scripts/z_placeholder_dir_audit.mjs`) | `POSSIBLE_OVERLAP_REVIEW` |
| Structure and registry verification | `scripts/z_sanctuary_structure_verify.mjs`, `scripts/z_registry_omni_verify.mjs` | `REUSE_CANONICAL` |

Scope note: `placeholder:audit` audits placeholder **directories**. It is not a scanner for unsupported textual claims. Z-OTF must not cite it as evidence that claim quarantine is automated. No unsupported-claim scanner was located on this base; Phase 0 quarantine is therefore documentary and human-reviewed.

---

## 13. Ten duplication tests

Any future Z-OTF component proposal must answer all ten before implementation is requested:

1. Does a canonical engine already perform this?
2. Does a registry already describe this?
3. Does an observer already expose this?
4. Does a receipt or evidence contract already exist?
5. Does Z-PoT already define the epistemic distinction?
6. Does Z-LIC already define the learning or evolution authority?
7. Does Z-SUSBV already own this commercial evidence?
8. Does an existing minibot, traffic, or alert system already emit the signal?
9. Does a dashboard already own the correct roof?
10. Can Z-OTF consume a contract instead of copying an implementation?

If YES: reference it, adapt only through a later authorized interface, and do not clone.
If UNKNOWN: mark `UNKNOWN`, locate evidence, and do not assume absence.
If NO and the gap is evidenced: document the gap; a future phase may authorize a component.

---

## 14. Architecture principle

Z-OTF is a composition layer:

```text
existing governed capabilities
        ↓
versioned governed contracts
        ↓
Z-OTF operational composition
        ↓
future product-specific interfaces
```

It is not a parallel ecosystem that copies every engine. Z-OTF is connective tissue, not another empire inside the organism.

---

## 15. Candidate gaps recorded by this audit

Recorded as candidates only. None is authorized for build, and each requires re-verification at its own future gate.

| Candidate gap | State | Gate |
| --- | --- | --- |
| Externally verifiable cryptographic Operational Provenance Record (`OPR`) with signature, key rotation and public verification | `NO_CANONICAL_MATCH_FOUND` | Phase 6 · CLOSED |
| Human-approved business or customer messaging workflow | `NO_CANONICAL_MATCH_FOUND` | Phase 4 · CLOSED |
| Explicit data-processing-mode doctrine and disclosure | `NO_CANONICAL_MATCH_FOUND` | Phase 3 · CLOSED |
| Server-enforced multi-party role model | `NO_CANONICAL_MATCH_FOUND` | Phase 7 · CLOSED |
| Academy with completion certificates | `NO_CANONICAL_MATCH_FOUND` | Phase 9 · CLOSED |
| Tax and compliance decision support | `NO_CANONICAL_MATCH_FOUND` | Phase 11 · CLOSED |
| Invoice or billing engine | `NO_CANONICAL_MATCH_FOUND` | not declared; Z-SUSBV rules that catalog rows grant no billing |
| Unsupported-claim scanner | `NO_CANONICAL_MATCH_FOUND` | not yet declared |

These eight are the distinct candidate gaps found by this audit. Rows in sections 9 through 11 restate them in context.

---

## 16. Later repository split criteria

Z-OTF remains inside Z-Sanctuary until a future gate proves all of the following: a separate deployment lifecycle is required; a separate secrets and runtime boundary is required; a separate commercial release cadence is required; reusable contracts are stable; parent governance remains consumable through a versioned interface; recovery and custody are solved; registry citizenship is approved; and duplication risk is lower than the benefit of separation.

Until then: **inside Z-Sanctuary**.
