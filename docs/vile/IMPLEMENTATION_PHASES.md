# VILE Implementation Phases

**Current:** Phase 1.5 — Platform Contracts  
**Law:** [SYSTEM_BOUNDARIES.md](SYSTEM_BOUNDARIES.md)

```text
Phase 1   → Architecture docs
Phase 1.5 → Platform contracts (schemas)     ← NOW
Phase 2A  → Shared packages only (no UI)
Phase 2B  → Read-only API
Phase 2C  → Traveller app (read-only, offline)
Phase 2D  → Vendor onboarding (no payments)
Phase 3   → Agent orchestration runtime
Phase 4+  → Community marketplace, global expansion
```

---

## Phase 1 — Foundation (complete on branch)

| Deliverable | Status |
| ----------- | ------ |
| Canonical doc pack (`docs/vile/`) | Done |
| Package catalog + architecture | Done |
| SYSTEM_BOUNDARIES | Phase 1.5 PR |

**Not delivered:** runtime, apps, agents.

---

## Phase 1.5 — Platform Contracts (active)

**Goal:** Shared interface language before any `packages/zuno-*` implementation.

| Contract | Location |
| -------- | -------- |
| Common events | `platform-contracts/schemas/v1/common-event.schema.json` |
| Agent messages | `agent-message.schema.json` |
| Destination / region / experience / culture | `destination`, `region`, `experience`, `culture` |
| Traveller profile | `traveller-profile.schema.json` |
| Vendor | `vendor.schema.json` |
| Risk assessment | `risk-assessment.schema.json` |
| Emergency response | `emergency-response.schema.json` |
| Payment interfaces | `payment-interface.schema.json` (**HOLD runtime**) |
| Localization | `localization.schema.json` |
| Observability | `observability-event.schema.json` |

| Deliverable | Status |
| ----------- | ------ |
| JSON Schema v1 catalog | This PR |
| Example fixtures (`_non_executable`) | This PR |
| `validate_examples.mjs` | This PR |
| TypeScript package `packages/zuno-*` | **Deferred to 2A** |

---

## Phase 2A — Shared packages only

**No UI. No runtime daemons. No public API.**

| Package | Uses contracts |
| ------- | -------------- |
| `zuno-security` | observability audit + RBAC types |
| `zuno-shadow` | agent-message + shadow status |
| `zuno-drp` | common-event + DRP decision linkage |
| `zuno-observability` | observability-event schema |

Each package: unit tests, README, rollback doc — one package per PR where possible.

---

## Phase 2B — Read-only API

**Allowed routes (illustrative):**

```http
GET /v1/destinations
GET /v1/regions
GET /v1/experiences
GET /v1/cultures
```

| Forbidden in 2B | Reason |
| --------------- | ------ |
| POST bookings | Boundary — no autonomous approvals |
| Payments | Sacred move |
| Vendor write APIs | Phase 2D |
| Agent orchestration | Phase 3 |

DRP middleware on every route. Illustrative data must declare `verificationStatus`.

---

## Phase 2C — Traveller application

| Property | Value |
| -------- | ----- |
| Mode | Read-only |
| Offline | Required — emergency + maps + tickets schema |
| Payments | No |
| Agents | No live swarm |

---

## Phase 2D — Vendor onboarding

| Property | Value |
| -------- | ----- |
| Vendor schema | `vendor.schema.json` |
| Human approval | Required for `onboardingStatus: approved` |
| Payments / payout | **No** — `payoutEnabled: false` |

---

## Phase 3 — Agent orchestration

**Only after 2A–2D stable.**

- Universal Orchestrator runtime  
- Swarm per [AGENT_SWARM_SPEC.md](AGENT_SWARM_SPEC.md)  
- Shadow pipeline mandatory  
- No agent-to-agent shortcuts  

---

## Phase 4 — Community ecosystem

Marketplace, research exports, conservation, volunteer — AMK + legal charters.

---

## Phase 5 — Global expansion

Additional countries, government integrations, enterprise APIs.

---

## Phase completion law

Every phase ends with:

1. Green test report  
2. DRP validation report  
3. Security report  
4. Documentation update  
5. Rollback instructions  

---

## Turtle sequencing

```text
One domain per PR · cursor/zsanctuary/* · Merge Hold · AMK reads delta
```

Do not skip Phase 1.5 to implement UI or agents.
