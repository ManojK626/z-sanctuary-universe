<!-- Z: docs/ROULETTE_SAFETY_RULES.md -->

# Roulette Safety Rules (Z-Flow)

---

**Author:** Z-Sanctuary Team
**Last Updated:** 2026-01-17
**Version:** 1.0

---

Purpose: document the deterministic, human-first guardrails for the Roulette module.
This is policy, not code. The module reports facts; the Z-Flow Spine decides.

## Allowed Triggers (Roulette Emits Only Facts)

Core triggers:

- SPIN_RECORDED
- BET_PLACED
- WIN_RECORDED
- LOSS_RECORDED
- SESSION_START
- SESSION_END
- BET_SIZE_CHANGED
- MANUAL_STOP_REQUESTED

Derived signals (computed, not guessed):

- LOSS_MOMENTUM_UPDATED
- BET_ESCALATION_RATE_UPDATED
- SESSION_DURATION_UPDATED
- RISK_PATTERN_DETECTED (Z / ZN / ZX / Heat)
- LPBS_LOOP_COUNT_UPDATED

> See Glossary below for acronym definitions.

## Context Snapshot (Roulette-Specific)

Each trigger captures:

- Z-Patterns: Z1-Z18, ZX multipliers, cold/heat zones
- LPBS FLEX: step depth, escalation slope, recovery attempts
- GGAESP 360: momentum, stability, deviation, trend slope
- Wellbeing overlay: fatigueIndex, focusLevel, stressIndex
- Session meta: duration, bet frequency, volatility

## Canonical Z-Rules (Safety + Choice)

ROU-001: Pattern Insight Only (Low Risk)

- Trigger: RISK_PATTERN_DETECTED
- Conditions: Z-pattern detected, stability normal
- Consent: notify
- Actions: show insight panel (read-only). No autoplay or pressure.
- Intent: inform without steering.

ROU-010: Bet Escalation Soft Brake (Medium Risk)

- Trigger: BET_SIZE_CHANGED
- Conditions: bet increase >= threshold within short window
- Consent: auto (reversible)
- Actions: gentle prompt; highlight LPBS recommended cap (no force).
- Intent: awareness before momentum builds.

ROU-020: Loss Spiral Gate (High Risk)

- Trigger: LOSS_MOMENTUM_UPDATED
- Conditions: loss momentum accelerating AND stability down AND fatigueIndex >= threshold
- Consent: require human
- Actions: soft-lock betting controls; offer cooldown choices; provide reflection/exit.
- LPBS Governor: enforce cooldown window.
- Intent: prevent harm during compromised state.

ROU-030: LPBS Depth Cap (High Risk)

- Trigger: LPBS_LOOP_COUNT_UPDATED
- Conditions: LPBS depth exceeds safe envelope
- Consent: require human
- Actions: pause LPBS progression; allow manual reset only; explain clearly.
- Intent: stop infinite descent.

ROU-900: Sacred Override (Sacred Risk)

- Trigger: MANUAL_STOP_REQUESTED
- Consent: immediate (human initiated)
- Actions: halt betting instantly; preserve state; offer support options.
- Intent: dignity and agency above all.

---

### Thresholds & Policy Links

- For all rules referencing a "threshold" or "safe envelope," see [core/thresholds.json](../core/thresholds.json) or the Z-Flow policy documentation for current values.

---

## Execution Path (Always)

ROULETTE EVENT
-> Z-OBSERVE
-> CONTEXT SNAPSHOT
-> Z-RULE MATCH
-> RISK CLASS
-> CONSENT GATE
-> HUMAN (if required)
-> Z-FLOW EXECUTOR
-> AUDIT + STABILIZATION CHECK

No shortcuts. No hidden nudges.

---

## Glossary

- **Z-Pattern**: Proprietary pattern recognition signals (Z1-Z18, ZX multipliers, etc.)
- **ZX / ZN**: Special Z-Pattern multipliers (ZX = "Z-Extreme", ZN = "Z-Normal")
- **LPBS**: Loss-Progression Bet Slope (governs bet escalation and recovery)
- **GGAESP 360**: Momentum and stability metrics (GGAESP = Generalized Game Activity & Emotional State Profile)
- **Heat/Cold Zones**: Streaks or clusters of outcomes (hot/cold tables)
- **fatigueIndex**: Composite measure of user fatigue
- **focusLevel**: Composite measure of user focus
- **stressIndex**: Composite measure of user stress
- **Safe Envelope**: Predefined safe operating range for LPBS depth or escalation
- **Cooldown Window**: Minimum enforced break period after high-risk triggers

---
