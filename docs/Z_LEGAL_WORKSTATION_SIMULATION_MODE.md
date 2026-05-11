# Z-LEGAL-WORKSTATION-STACK-1A — Simulation mode (safe)

## Purpose

Define simulation-mode boundaries for lawyer training and workflow rehearsal without enabling live legal runtime.

## Safe interpretation

Simulation mode means:

- synthetic scenarios
- synthetic identities
- synthetic evidence sets
- synthetic communication loops

It does not mean:

- live client intake
- live legal advice dispatch
- court filing
- external connector execution

## Simulation scenario categories

- Contract dispute readiness
- Product safety and claims review
- IP filing readiness queue
- Data-protection complaint handling
- Internal legal-comms escalation flow

## Required safeguards

- Synthetic-only data in simulation mode
- Explicit simulation banner in UI
- No external outbound connectors
- No deployment or payments
- No privileged real-client uploads

## Completion artifacts

Each simulation run should produce report-only artifacts:

- scenario summary
- gate-check result
- evidence trace map
- decision handoff packet draft

## Locked law

- Simulation mode != production legal workflow.
- Training outcome != legal clearance.
- AI scenario summary != legal advice.
- GREEN simulation run != launch or filing permission.
