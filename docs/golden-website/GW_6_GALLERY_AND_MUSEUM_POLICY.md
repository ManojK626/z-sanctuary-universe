# GW-6 — Visual Gallery and Prototype Museum policy

**Phase:** Golden Website GW-6
**Date:** 2026-08-27
**Status:** Policy for a **future** Gallery and Museum. Neither surface is built or published in GW-6.

Golden Guide AI remains **CLOSED**. Full Golden Universe Map remains **CLOSED**.

## Visual Gallery

**Role:** visual explanation.

A gallery exhibit is a still (or later, carefully labeled motion) artifact that helps a visitor understand a canonical Golden Website record.

Each exhibit must disclose what the visual **is**, using:

- `REAL UI CAPTURE`
- `LOCAL WORKING PROTOTYPE` (only if the still is of a running local UI)
- `SIMULATED UI`
- `CONCEPT MOCKUP`
- `HISTORICAL DESIGN`
- `FUTURE VISION`

A concept mockup must not look like a deployed product. Historical captures must be dated. QUALIFIED, SEALED, and PASS gates stay visible as text, not traffic lights.

## Prototype Museum

**Role:** interactive local / public-safe demonstrations.

A museum exhibit is an interactive HTML/UI that a visitor can use **after** sanitization and Steward approval.

WORKING frontend ≠ working backend. SIMULATED data ≠ live telemetry. LOCAL prototype ≠ public service. HTML file ≠ product readiness. Visual richness ≠ implementation evidence.

Do not iframe unsanitized operator dashboards. Do not fetch private registries, report JSON, localhost, or filesystem paths at public runtime.

## Required links on every future exhibit

Each Gallery or Museum exhibit must point back to:

1. Canonical portfolio record (adapter `canonical_id`)
2. Evidence state (VERIFIED / SEALED / QUALIFIED / CONCEPT / HOLD / CLOSED)
3. Claim limitations (`not_claimed` / “what is not claimed”)
4. Related evidence (public-safe refs only)

If the canonical link is uncertain, the exhibit stays `NEEDS_IDENTITY_REVIEW` and is not shown.

## Admission gate (later phases)

```text
identity → relevance → functionality → dependencies → sanitization → security → evidence → Steward approval
```

GW-6 stops at discovery and shortlist. It does not admit exhibits.

## Hard laws

```text
visual ≠ implementation
prototype ≠ production
working UI ≠ working service
historical ≠ current
future vision ≠ active capability
public-safe ≠ published
observe → verify → suggest → human decides
readiness ≠ deploy
```
