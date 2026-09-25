# Z-Connect Reference Architecture — Index

**System ID:** Z-CONNECT-1  
**Version:** 1.0  
**Status:** **Architecture frozen** — AMK-approved Phase 1.5 complete  
**Date:** 2026-07-04  
**Posture:** Handbook only · **no new architecture** · Merge Hold · Runtime NOT AUTHORIZED

## Purpose

This folder is the **curated handbook** for every future Z-Connect contributor — human or AI. It **ties together** existing docs; it does not replace or extend them.

```text
Phase 1.5 architecture  →  FROZEN
Reference Architecture  →  this handbook (consolidation)
Phase 1.6 OpenAPI + DB  →  blocked until governance gate opens
Sprint 0                →  blocked
```

## The four complementary layers

| Layer | Question answered | Source |
| ----- | ----------------- | ------ |
| Vision & Constitution | Why are we building this? | Charter, AI Constitution, Scientific Integrity |
| Domain Contracts | What exists? | [platform-contracts/](../platform-contracts/) |
| Interaction Contracts | How do things interact? | [interaction-contracts/](../interaction-contracts/) |
| Experience State Contracts | How do experiences evolve? | [experience-state-contracts/](../experience-state-contracts/) |

## Handbook chapters

| # | Chapter | Role |
| - | ------- | ---- |
| 01 | [System Overview](01_SYSTEM_OVERVIEW.md) | Mission, boundaries, readiness |
| 02 | [Architecture Map](02_ARCHITECTURE_MAP.md) | Layer diagram, stack, dependencies |
| 03 | [Domain Reference](03_DOMAIN_REFERENCE.md) | 61 schemas — where to look |
| 04 | [Interaction Reference](04_INTERACTION_REFERENCE.md) | 11 flows — behaviour map |
| 05 | [State Reference](05_STATE_REFERENCE.md) | 7 state machines — lifecycle map |
| 06 | [Governance Reference](06_GOVERNANCE_REFERENCE.md) | Gates, doctrine, sacred moves |
| 07 | [AI Reference](07_AI_REFERENCE.md) | Constitution, Shadow, discovery |
| 08 | [Security Reference](08_SECURITY_REFERENCE.md) | Hub packages, Zero Trust posture |
| 09 | [Future Extensions](09_FUTURE_EXTENSIONS.md) | Phase 1.6+, reuse beyond Z-Connect |

## Permanent doctrine (AMK-approved)

> A state transition changes the status of an experience — not the autonomy of the user. Users remain in control, and governance exists to protect rights, consent, and safety, not to make personal decisions on their behalf.

Full context: [06_GOVERNANCE_REFERENCE.md](06_GOVERNANCE_REFERENCE.md)

## Z-Sanctuary reuse principle

> The governance framework is reusable, but each application owns its own domain logic and experience states.

See [09_FUTURE_EXTENSIONS.md](09_FUTURE_EXTENSIONS.md)

## Readiness snapshot (2026-07-04)

| Stage | Status |
| ----- | ------ |
| Vision | Complete |
| AI Constitution | Complete |
| Scientific Integrity | Complete |
| Architecture Decisions | Complete |
| Domain Contracts | Complete |
| Interaction Contracts | Complete |
| Experience State Contracts | Complete |
| Reference Architecture | Complete (this handbook) |
| OpenAPI | Waiting |
| Logical Database | Waiting |
| Sprint 0 | Waiting |
| Runtime | Waiting |

## Source authority (do not fork)

| Role | Doc | Scope |
| ---- | --- | ----- |
| Hub lifecycle doctrine | [Z_SANCTUARY_PROJECT_ARCHITECTURE_LIFECYCLE.md](../../Z_SANCTUARY_PROJECT_ARCHITECTURE_LIFECYCLE.md) | ecosystem-wide |
| Universe resolution 2026-07-04 | [Z_SANCTUARY_UNIVERSE_RESOLUTION_2026_07_04.md](../../Z_SANCTUARY_UNIVERSE_RESOLUTION_2026_07_04.md) | canonical posture |
| Master charter | [Z_CONNECT_MASTER_BUILD_CHARTER.md](../Z_CONNECT_MASTER_BUILD_CHARTER.md) | Z-Connect |
| Locked decisions v1 | [Z_CONNECT_ARCHITECTURE_DECISIONS_V1.md](../Z_CONNECT_ARCHITECTURE_DECISIONS_V1.md) | Z-Connect |
| Program status | [Z_CONNECT_PROGRAM_STATUS.md](../Z_CONNECT_PROGRAM_STATUS.md) | Z-Connect |
| Phase 1.5 completion | [PHASE_1_5_COMPLETE_GREEN_RECEIPT.md](PHASE_1_5_COMPLETE_GREEN_RECEIPT.md) | Z-Connect |
| Future baseline ADR (HOLD) | [FUTURE_ADR_Z_CONNECT_V1_BASELINE.md](FUTURE_ADR_Z_CONNECT_V1_BASELINE.md) | when prototype exists |

## For AI contributors

1. Read this INDEX first  
2. Check locked decisions before proposing changes  
3. **Do not expand architecture** without AMK gate — propose ADR, not silent edits  
4. Phase 1.6+ is blocked until Merge Hold release  

## Verdict

Phase 1.5 architecture foundation — COMPLETE · FROZEN · READY FOR ARCHITECTURE REVIEW
