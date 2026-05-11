# Z-EDII — Expert Dashboards Intelligence Interfaces

**Purpose:** Doctrine for a **dashboard intelligence layer** that can deliver premium, flexible operator and stakeholder surfaces across Z-Sanctuary products — without turning the assistant into an autonomous executor.

## Scope (doctrine only)

This document defines **standards and rules**. Implementation is phased: doctrine first, then small static prototypes per product charter.

## Supported user types

| User type | Dashboard focus |
| ---------------------- | ---------------------------------------------- |
| Customer | Simple status, support, product info |
| Expert | Tools, analytics, detailed panels |
| Business manager | KPIs, finance, logistics (when chartered) |
| Partner / manufacturer | Specs, tasks, approvals |
| Investor | Growth, proof, trust summaries (non-sensitive) |
| Admin / AMK | Full commander-style view when gated |

## UI concepts

- **Adaptive workspace:** modes such as Standard, Business, Expert, Compact, Full screen, Low-sensory, Presentation (product-specific).
- **Layout:** left mini sidebar, right drawers, full overlay panel, modal inputs, draggable/resizable panels where accessibility allows.
- **Smart panels:** open, minimize, expand, pin, drag, resize, combine into overlay — always with **human-visible** state (no hidden docked agents).

## Workspace AI Assistant (dashboard guide)

**May:** Explain panels, suggest layouts, summarize **already-visible** or **provided** data, prepare draft reports for human send, guide step-by-step **read-only** tours.

**Must not:** Execute payments, submit forms on behalf of user, deploy, change pricing/legal copy, run hidden actions, or exfiltrate data.

## Accessibility and low-sensory

- Respect `prefers-reduced-motion`, contrast targets, and calm density modes.
- Low-sensory mode reduces animation, chip noise, and parallel motion.

## Trust labels and human approval gates

- Surfaces show **trust posture** (read-only, staged, live) as doctrine labels until wired to real gates.
- Sacred moves (deploy, payment, legal, public launch) require **human approval** — never assistant-initiated.

## Responsible analytics (betting / roulette / prediction)

Any surface with gambling-adjacent or prediction language MUST be framed as:

```text
analytics · simulation · education · responsible play · no guaranteed outcomes
```

No win promises, no addictive nudging, no outcome guarantees.

## Core engine structure (conceptual)

```text
Z-EDII
├── Layout Intelligence
├── Panel Registry
├── Role-Based Views
├── Workspace Assistant
├── Overlay / Drawer System
├── Accessibility Modes
├── Trust & Audit Labels
└── Human Approval Gates
```

## Forbidden actions

Auto payments, auto submit, hidden tracking, fake performance claims, deployment without gate, uncontrolled multi-step agent execution, cross-tenant raw data blend.

## Future phase

Read-only prototype panel per product, wired to **mock** or **sanitized** data only.

## Related

- [Z-EDII-SHADOW-INSTANCES.md](Z-EDII-SHADOW-INSTANCES.md) — per-project isolation.
- [Z-RPWC-REPLICABLE-POWER-WITHOUT-CHAOS.md](Z-RPWC-REPLICABLE-POWER-WITHOUT-CHAOS.md) — safe reuse of patterns.
