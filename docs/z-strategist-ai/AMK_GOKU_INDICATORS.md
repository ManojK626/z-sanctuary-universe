# AMK-Goku Indicators — Z-Strategist AI

**Posture:** Signal labels only · **not** automated scoring in Phase 0

Each indicator uses one of: **GREEN** · **AMBER** · **RED** · **HOLD** · **UNKNOWN**

## Indicator categories

| # | Indicator | What it measures |
| --- | ---------------------------- | --------------------------------------------------------- |
| 1 | **Vision Readiness** | Purpose, audience, and problem statement clarity |
| 2 | **Documentation Readiness** | Doctrine, receipts, registries, builder context |
| 3 | **Technical Readiness** | Build quality, verify posture, runtime boundaries |
| 4 | **Security Readiness** | Secrets, access, attack surface, sacred boundaries |
| 5 | **Privacy Readiness** | Data handling, child/safety, consent posture |
| 6 | **Banking Readiness** | Whether banking/payout paths need human review |
| 7 | **Legal Review Readiness** | Terms, contracts, partnerships — review recommended flags |
| 8 | **Tax/VAT Review Readiness** | Whether tax/VAT accounting review is recommended |
| 9 | **Deployment Risk** | Risk of premature deploy, drift, or gate bypass |
| 10 | **Revenue Activation Risk** | Risk of turning on money flows without gates |
| 11 | **Human Gate Status** | AMK-Goku Final Gate: Approved / Hold / Needs review |
| 12 | **Ecosystem Dependency Readiness (EDR)** | Upstream/downstream project dependency risk |

## Signal definitions

| Signal | Meaning |
| ----------- | ----------------------------------------------------------------------- |
| **GREEN** | Posture documented and aligned; no known blockers for **current stage** |
| **AMBER** | Gaps, drift, or upcoming transition — review recommended |
| **RED** | Serious gap, boundary breach risk, or launch would be unsafe |
| **HOLD** | Explicit stop — do not advance stage or deploy |
| **UNKNOWN** | Not yet assessed — fill readiness card |

## Category guidance

### Vision Readiness

- **GREEN:** Owner, purpose, user group documented
- **AMBER:** Vision exists but user group vague
- **RED:** Conflicting purpose or harm risk undocumented
- **HOLD:** Paused by AMK

### Documentation Readiness

- **GREEN:** Charter, receipt, index entries exist for phase
- **AMBER:** Partial docs or stale registry
- **RED:** High-risk module with no doctrine

### Technical Readiness

- **GREEN:** Verify passes for stage; Turtle Mode respected
- **AMBER:** Verify gaps or unmerged PRs
- **RED:** Runtime/API/payment added without charter

### Security Readiness

- **GREEN:** No secrets in repo; gates documented
- **AMBER:** Report drift or config review needed
- **RED:** Exposed secrets or bypass patterns

### Privacy Readiness

- **GREEN:** Privacy/safety note; no undeclared data storage
- **AMBER:** Future data plans not fully gated
- **RED:** Child/health data without policy

### Banking Readiness

- **GREEN:** No revenue — banking not applicable
- **AMBER:** Revenue planned — **banking review recommended**
- **RED:** Payouts planned without banking gate
- **UNKNOWN:** Revenue model unclear

### Legal Review Readiness

- **GREEN:** No public commercial exposure
- **AMBER:** Stage 3+ — **legal review recommended**
- **RED:** Contracts/partnerships without review

### Tax/VAT Review Readiness

- **GREEN:** No revenue
- **AMBER:** Stage 4 — registration review may apply
- **RED:** Stage 5 without **tax/VAT review recommended** flag addressed

### Deployment Risk

- **GREEN:** Read-only / static / docs-only
- **AMBER:** Pre-deploy planning
- **RED:** Deploy attempted without human gate

### Revenue Activation Risk

- **GREEN:** No payment paths
- **AMBER:** Mock ledger / illustrated figures only
- **RED:** Live payment integration without gate

### Human Gate Status

- **Approved:** AMK explicitly approved for **named** next step only  
- **Hold:** Default for sacred moves  
- **Needs review:** Steward or advisor input required  

### Ecosystem Dependency Readiness (EDR)

Measures whether a project **depends on other projects** that are not ready. A project may look GREEN alone but remain blocked by a RED or HOLD upstream dependency.

**Example dependency tree (illustrative):**

```text
ZILWA Living Experiences
  ├── Z-Tourism (lane)
  ├── Local Community Layer
  ├── Cultural Ambassador Layer
  ├── AI Assistant Layer (future — gated)
  └── Environmental Layer
```

| EDR signal | Meaning |
| ---------- | ------- |
| **GREEN** | No critical upstream blockers for current stage; dependencies documented |
| **AMBER** | Depends on projects in AMBER/HOLD/UNKNOWN — proceed with caution |
| **RED** | Depends on RED upstream (e.g. payments hub, deploy lane) for planned next step |
| **HOLD** | Cross-project coupling forbidden until charter |
| **UNKNOWN** | Dependency map not yet filled |

**Rule:** Do not mark a project deployment-ready if **EDR** is AMBER or RED unless AMK documents an explicit exception and scoped decoupling.

## Composite rules

| Rule | Effect |
| ------------------------------------ | --------------------------------------------------- |
| Any **RED** on Deployment or Revenue | Cannot mark deployment-ready |
| Human Gate = **Hold** | Stage advance blocked |
| Stage ≥ 4 | Registration review recommended (not auto-required) |
| Stage = 5 | Tax/VAT review recommended (not auto-required) |
| Any **UNKNOWN** on required fields | Cannot mark GREEN overall |
| **EDR** AMBER or RED | Cannot mark deployment-ready without AMK exception |

## Dashboard linkage (future — gated)

AMK-Goku Indicators may later mirror read-only on hub dashboards. **Phase 0:** markdown cards only. No live scoring API.

## Template

Per-project assessment: [PROJECT_READINESS_TEMPLATE.md](PROJECT_READINESS_TEMPLATE.md)
