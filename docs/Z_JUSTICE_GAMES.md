# Z-Justice Games — Simulation & Learning Layer

**Layer:** 1 of 3 (Reality Navigation System)
**Phase:** Z-RNS-JUSTICE-GAMES-1 (planned — not runtime in Z-RNS-ARCH-1)
**Parent:** [Z_REALITY_NAVIGATION_SYSTEM.md](Z_REALITY_NAVIGATION_SYSTEM.md)

---

## Purpose

Help people **learn without fear** through governed simulation — courtroom flow, evidence drills, and stress rehearsal using **synthetic data only**.

This layer is **training and awareness**, not legal clearance or court prediction.

---

## Simulation roles (synthetic mentors)

| Persona               | Learning goal                      | Required label                       |
| --------------------- | ---------------------------------- | ------------------------------------ |
| Judge mentor          | Understand stages, timing, decorum | “Synthetic — not a real judge”       |
| Garda / Police mentor | Procedure awareness                | “Synthetic — not authority”          |
| Lawyer mentor         | Evidence organisation drill        | “Not legal advice”                   |
| Reflection mentor     | Calm under pressure                | “Not therapy or medical care”        |
| Clerk mentor          | Paperwork and filing awareness     | “Training only — not filing service” |

No persona may use a real professional’s name without written consent and contract.

---

## Simulation features (Phase 2 target)

- Courtroom flow walkthrough
- Evidence challenge scenarios
- Invoice / damage verification drills
- Witness sequence ordering
- Timeline contradiction spotting
- Stress-mode rehearsal (optional difficulty)

All scenarios ship with **fixture JSON** — never operator PII in default seeds.

---

## Safeguards (locked)

Aligned with [Z_LEGAL_WORKSTATION_SIMULATION_MODE.md](Z_LEGAL_WORKSTATION_SIMULATION_MODE.md):

- Explicit **SIMULATION** banner on every surface
- Synthetic-only identities and evidence sets
- No external connectors, email, or court filing
- No deployment or payment activation from simulation UI
- No privileged real-client uploads in simulation mode
- Simulation outcome **≠** legal clearance
- AI scenario summary **≠** legal advice

---

## Relation to Z-Legal Evidence Core

When a user graduates from simulation to real evidence work, they move to **Layer 2** ([Z_LEGAL_EVIDENCE_CORE.md](Z_LEGAL_EVIDENCE_CORE.md)). Timeline and vault tools remain local-first and human-gated.

Simulation **does not** auto-populate the real vault.

---

## Build gate

Z-Justice Games runtime requires:

1. Z-RNS-ARCH-1 sealed (doctrine)
2. Z-RNS-FOUNDATION-1 timeline mock or local prototype
3. Written simulation charter + green receipt
4. AMK / human approval for any role-based AI mentor UI

---

_Train the process. Never train the outcome. Never replace humans._
