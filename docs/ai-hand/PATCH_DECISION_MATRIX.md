# Z-HOAI — Patch Decision Matrix

**Purpose:** Simple mapping from **signal type** to **AI posture** vs **human action**. Adjust severities per your product’s tracker policy.

| Signal | AI action | Human action |
| ----------------------------------------------- | ---------------------------------------------------------- | ------------------------------ |
| Typo / small copy clarity (no compliance angle) | Draft fix | Usually quick approve |
| Confusing route / button | Draft P1/P2 row + minimal UX patch idea | Approve if user-facing |
| Crash / failed route | Mark P0/P1; repro + suspect area | Must review |
| Unsafe claim | Mark P1/P0; draft **neutral** replacement for review only | Must review |
| Payment confusion | Mark P1; **no** live billing edits | Must review |
| Responsible-use concern | Mark P0/P1; escalate note; **no** automated user sanctions | Must review promptly |
| Feature request | Defer | No Cycle-1 stabilization patch |
| Nice idea | Backlog | No patch now |

---

## Pairing with shadows

| Signal family | Primary shadows |
| ----------------------- | ---------------------------- |
| Copy confusion (benign) | UX, Patch Scribe |
| Crash | Crash, Ops, Patch Scribe |
| Claims / outcomes | Safety Wording, Patch Scribe |
| Money perception | Pricing, Safety Wording |
| Gates | Access Gate, Ops |
| Support channel noise | Support → reassign |
| Wellbeing | Responsible-Use |
| CI / gates | Ops, Patch Scribe |

---

## Hub safety

Changes that affect **this** repository’s verify pipeline, registry, or governance files are **out of band** for pilot triage: use normal hub change discipline (see [AGENTS.md](../../AGENTS.md)), not this matrix alone.
