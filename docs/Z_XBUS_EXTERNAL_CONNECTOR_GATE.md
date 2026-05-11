# Z-XBUS-GATE-1 — External connector / API / business service gate

## Purpose

**Z-XBUS** defines **connector governance**: a **central read-only registry** and validator for ideas that might one day speak to **APIs, MVP services, IDE integrations, business tools, webhooks, buses, portals, analytics, databases, AI providers, payments, or enterprise integrations**.

Phase **Z-XBUS-GATE-1** is **border control in metadata only**:

```text
Register → classify → report → AMK gates later.
No live outbound connectors from this phase.
```

## What this layer is **not**

| Misread | Reality |
| -------------------------- | ------------------------------------------------------ |
| “Registry row exists” | **Not** activation of that API |
| “Provider connector typed” | **Not** permission to call a provider |
| “Payment typed” | **Not** billing or capture |
| “Webhook typed” | **Not** webhook execution |
| GREEN on report | **Not** deploy, production contract, or public release |

Connector registry ≠ live bus.

## Classification labels

| Label | Meaning (Phase 1) |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| **INTERNAL_REFERENCE_ONLY** | Description + flags only — no outbound lane |
| **MOCK_SIMULATION_ONLY** | Mock/sim posture only |
| **BLUE_AMK_DECISION_REQUIRED** | Future external lane requires AMK/charter before any live work |
| **FUTURE_CHARTER_REQUIRED** | Cross-hub or enterprise coupling blocked until chartered |
| **RED_BLOCKED** | Explicitly forbidden or illegal posture for Phase 1 entries (should not carry live flags) |

## Signals (validator)

| Signal | Meaning |
| ---------- | ------------------------------------------------------------------------------------- |
| **GREEN** | Registry entries obey Phase 1 law; fixtures match classifier |
| **YELLOW** | Advisory gaps only (policy/registry shape warnings) |
| **BLUE** | Registry includes future connectors awaiting AMK/charter (still no execution) |
| **RED** | Forbidden live lanes in hub registry rows, policy breach, classifier/fixture mismatch |

Exit codes: **0** for GREEN/YELLOW/BLUE; **1** for RED only.

## Artifacts

| Path | Role |
| ----------------------------------------------------- | ---------------------------------------------- |
| `data/z_xbus_connector_registry.json` | Canonical connector metadata + classifications |
| `data/z_xbus_connector_policy.json` | Phase 1 hard law flags |
| `data/examples/z_xbus_connector_samples.json` | Fixtures proving classifier behaviour |
| `scripts/z_xbus_connector_gate_check.mjs` | Read-only validator + reports |
| `data/reports/z_xbus_connector_gate_report.{json,md}` | Evidence |

## Commands

```bash
npm run z:xbus:gate
```

## Relationships

- **Z-MOD-DIST** — _where an idea sits_ ([Z_MOD_DIST_MODULE_DISTRIBUTOR.md](Z_MOD_DIST_MODULE_DISTRIBUTOR.md)).
- **Z-XBUS** — _whether it may connect outside_ (this gate).
- **Z-SEC-TRIPLECHECK** — honesty / drift scans ([Z_SEC_TRIPLECHECK_COMMUNICATION_FLOW_AUDIT.md](Z_SEC_TRIPLECHECK_COMMUNICATION_FLOW_AUDIT.md)).
- **Z-REPLICA-FABRIC** — _bounded OMNAI replica doctrine_ — planning/report outputs only; **no** live connector activation from fabric ([Z_REPLICA_FABRIC_GOVERNED_SELF_REPLICATION.md](Z_REPLICA_FABRIC_GOVERNED_SELF_REPLICATION.md)).

- **Z-ULTRA-MAGE** — _formula governance codex_ — aligns hub formulas with OMNAI vocabulary in registry/report form only ([Z_ULTRA_MAGE_FORMULA_CODEX.md](Z_ULTRA_MAGE_FORMULA_CODEX.md)).

- **Z-MU-TRUTH** — _Mauritius civic truth & dignity ledger_ — peaceful claim verification posture; **no** live messaging, payments, or outbound campaign connectors without charter ([Z_MAURITIANS_UNITE_CIVIC_TRUTH_ENGINE.md](Z_MAURITIANS_UNITE_CIVIC_TRUTH_ENGINE.md)).

- **Z-PATTERN-SAFE** — _pattern literacy vs prediction-simulation_ — OCR, live probes, monetisation bridges, or “trust marketplaces” that appear in blueprint PDFs classify as **BLUE** until XBUS charter ([Z_PATTERN_SAFE_UNIVERSAL_PATTERN_SIMULATION.md](Z_PATTERN_SAFE_UNIVERSAL_PATTERN_SIMULATION.md)).

- **AMK-AI-SYNC-1** — _indicator sync observer + routing packets_ — “external connector?” requests should still land **Z-XBUS team** recommendations in **`amk_ai_team_sync_report.json`** ([AMK_AI_TEAM_INDICATOR_SYNC_ROUTER.md](AMK_AI_TEAM_INDICATOR_SYNC_ROUTER.md)).

- **Z-LEGAL-OPS-1** — _legal workstation boundary_ — any connector touching legal communications, filing, payment, or client-data movement remains concept-only until explicit charter and contract gates ([Z_LEGAL_EVIDENCE_CORE.md](Z_LEGAL_EVIDENCE_CORE.md)).

- **Z-LEGAL-PRODUCT-OPS-1** — _product/legal/IP workstation boundary_ — supplier APIs, manufacturing connectors, and world-map telemetry remain blocked in Phase 1; visual governance only ([Z_LEGAL_PRODUCT_IP_COMPLIANCE_WORKSTATION.md](Z_LEGAL_PRODUCT_IP_COMPLIANCE_WORKSTATION.md)).

## Locked law

```text
No external connector may become live until it has identity, purpose,
data boundary, entitlement boundary, secret policy, rollback plan, AMK gate, and report proof.
```

Seal: [PHASE_Z_XBUS_GATE_1_GREEN_RECEIPT.md](PHASE_Z_XBUS_GATE_1_GREEN_RECEIPT.md)
