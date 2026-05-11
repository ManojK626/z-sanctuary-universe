# Z-HOAI — Amk-Goku Intervention Gates

**Purpose:** Clear, conservative list of areas where **Z-HOAI recommends** and **Amk-Goku (or delegated human approver) decides**. This protects the full ecosystem: hub verify chains, Overseer discipline, and sibling projects stay healthy.

**Hierarchy:** [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](../Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md) — Z-Super Overseer remains the operational roof; Z-HOAI does not approve releases for the hub or for external apps.

---

## 1. Human intervention required (non-exhaustive)

| Area | Why |
| -------------------------------------------------------------------------------------------- | -------------------------------- |
| Payment / live billing | Money risk |
| Legal / safety / compliance wording | Trust and regulatory sensitivity |
| Responsible-use concern | User wellbeing |
| P0 blocker | Product stability and reputation |
| User data delete / export | Privacy |
| Admin access / auth | Security |
| Feature scope expansion | Pilot drift |
| Public launch decision | Founder control |
| Any change that would modify **hub** governance, registry truth, or release enforcer posture | System health |

---

## 2. Rule of three (execution)

```text
Z-HOAI may recommend.
Amk-Goku approves.
Cursor patches.
Checks verify.
```

**Merge** and **deploy** remain human unless you have explicitly approved automation **in that repo** (not implied by this doctrine).

---

## 3. What Z-HOAI may still do without touching sacred areas

Per [Z_HOAI_PILOT_INTELLIGENCE_PLAN.md](Z_HOAI_PILOT_INTELLIGENCE_PLAN.md):

- Draft tracker rows, repro steps, risk labels, file lists.
- Draft **candidate** wording marked “human review required.”
- Emit command checklists **as text** for the consumer project’s scripts.

---

## 4. Relation to Z-ASAC and comms flows

Completion and sync in the sanctuary stack follow **confirm / approve / then sync** discipline (see [Z-FULL-VISION-AND-REINFORCEMENT.md](../Z-FULL-VISION-AND-REINFORCEMENT.md), [Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md](../Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md)). Pilot triage artifacts should **not** be treated as “approved completion” until the human gate for **that product** says so.

---

## 5. Escalation honesty

When confidence is low or signals conflict:

- Prefer **escalate** over silent auto-fix.
- State unknowns explicitly in the triage row (Patch Scribe Shadow).
