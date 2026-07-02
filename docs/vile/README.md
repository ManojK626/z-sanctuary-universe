# Vanilla Islands Living Experiences (VILE)

**System ID:** VILE-1  
**Parent:** Z-Sanctuary Universe  
**Version:** 1.0 — Canonical System Blueprint (architecture-first)  
**Posture:** Documentation foundation · **not** deploy or revenue approval  
**Phase:** Phase 1.5 — Platform Contracts ([platform-contracts/](platform-contracts/))

## Purpose

VILE is the **enterprise engineering charter** for an ethical AI-powered **Indian Ocean Living Experiences** platform (Mauritius · Réunion · Madagascar → global).

This folder is the **repository foundation** for how Cursor and human builders think before code. It does **not** authorise runtime, payments, or autonomous agents.

## Relationship to ZILWA

| Layer | Name | Role |
| ----- | ---- | ---- |
| Engineering charter | **VILE** (this pack) | Architecture, packages, agents, security, phases |
| Community doctrine | **ZILWA** | Steward listening, exhibits, dignity-first hospitality |

See [ZILWA_VILE_RELATIONSHIP.md](ZILWA_VILE_RELATIONSHIP.md).

## Document map (24 files)

### Charter & placement

| Doc | Role |
| --- | ---- |
| [VILE_CANONICAL_SYSTEM_BLUEPRINT.md](VILE_CANONICAL_SYSTEM_BLUEPRINT.md) | Master blueprint v1.0 |
| [CURSOR_BUILDER_CHARTER.md](CURSOR_BUILDER_CHARTER.md) | Cursor AI builder instructions |
| [ZILWA_VILE_RELATIONSHIP.md](ZILWA_VILE_RELATIONSHIP.md) | ZILWA ↔ VILE alignment |
| [ADR_001_ARCHITECTURE_FIRST_DOCS.md](ADR_001_ARCHITECTURE_FIRST_DOCS.md) | Why docs before code |

### Architecture

| Doc | Role |
| --- | ---- |
| [ARCHITECTURE_OVERVIEW.md](ARCHITECTURE_OVERVIEW.md) | Layered system diagram |
| [ZUNO_STACK_PLACEMENT.md](ZUNO_STACK_PLACEMENT.md) | One core, many platforms |
| [PACKAGE_CATALOG.md](PACKAGE_CATALOG.md) | Shared `packages/` plan |
| [PLATFORM_MODULES.md](PLATFORM_MODULES.md) | `apps/` surface map |
| [API_SURFACE_PLAN.md](API_SURFACE_PLAN.md) | API boundaries (design only) |

### AI, DRP, security

| Doc | Role |
| --- | ---- |
| [AGENT_SWARM_SPEC.md](AGENT_SWARM_SPEC.md) | Agent roles + orchestrator law |
| [SHADOW_VALIDATION_PIPELINE.md](SHADOW_VALIDATION_PIPELINE.md) | Never bypass Shadow |
| [DRP_MIDDLEWARE_ARCHITECTURE.md](DRP_MIDDLEWARE_ARCHITECTURE.md) | 14 DRP on every endpoint |
| [ETHICAL_AI_CHARTER.md](ETHICAL_AI_CHARTER.md) | Dignity, safety, no fabrication |
| [SECURITY_ZERO_TRUST.md](SECURITY_ZERO_TRUST.md) | Zero trust design |

### Product & operations

| Doc | Role |
| --- | ---- |
| [OFFLINE_FIRST_DESIGN.md](OFFLINE_FIRST_DESIGN.md) | Traveller offline requirements |
| [PAYMENT_ABSTRACTION_DESIGN.md](PAYMENT_ABSTRACTION_DESIGN.md) | Provider interfaces — **HOLD runtime** |
| [UX_PRINCIPLES.md](UX_PRINCIPLES.md) | Experience design law |
| [OBSERVABILITY_STANDARDS.md](OBSERVABILITY_STANDARDS.md) | Logs, metrics, tracing |
| [TESTING_AND_VERIFICATION_GATE.md](TESTING_AND_VERIFICATION_GATE.md) | Phase completion gates |
| [CODING_STANDARDS.md](CODING_STANDARDS.md) | Engineering discipline |
| [DEVOPS_AND_RELEASE_POSTURE.md](DEVOPS_AND_RELEASE_POSTURE.md) | CI, rollback, human gate |

### Roadmap

| Doc | Role |
| --- | ---- |
| [IMPLEMENTATION_PHASES.md](IMPLEMENTATION_PHASES.md) | Phase 1.5 → 2A–2D → 3 sequencing |
| [ROADMAP_INDIAN_OCEAN.md](ROADMAP_INDIAN_OCEAN.md) | Mauritius → Réunion → Madagascar |

### Boundaries & contracts (Phase 1.5)

| Doc | Role |
| --- | ---- |
| [SYSTEM_BOUNDARIES.md](SYSTEM_BOUNDARIES.md) | What VILE will **not** do |
| [platform-contracts/README.md](platform-contracts/README.md) | JSON Schema shared language (13 contracts) |

## Law

```text
Documented ≠ Implemented ≠ Running
Architecture first · Contracts before packages · Merge Hold · AMK gate on sacred moves
```

See [SYSTEM_BOUNDARIES.md](SYSTEM_BOUNDARIES.md).

## Verdict

GREEN FOR PR REVIEW — MERGE HOLD (foundation docs only)
