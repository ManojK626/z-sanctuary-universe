# Z-HOAI — Feedback Triage Rules

**Purpose:** Turn raw tester language into **one consistent structure** for trackers and PR discipline. Works in any pilot repo; hub stores the **rules** only.

---

## 1. Typical tester utterances

Examples:

```text
This button confused me.
This page crashed.
This wording felt unsafe.
This feature was useful.
This price made sense / did not make sense.
```

---

## 2. Required output shape (tracker-ready)

For each distinct finding, produce:

```text
Severity:        (P0 / P1 / P2 / defer)
Domain:          (e.g. UX, Crash, Safety Wording, Pricing, Gate, Support, Responsible-Use, Ops)
Affected route:  (path or screen id)
Repro steps:     (numbered)
Expected:        (short)
Actual:          (short)
Risk:            (plain language + tag: e.g. compliance, stability, wellbeing)
Suggested minimal fix: (draft or “none yet”)
Needs Amk-Goku decision: (yes/no + one-line why)
Assigned shadows:       (subset of the nine roles)
Verification commands:  (consumer-project commands only; see flow doc)
```

---

## 3. Severity hints (non-binding)

| Pattern | Typical severity |
| ------------------------------------ | ---------------- |
| Reproducible crash on core journey | P0/P1 |
| Misleading payment/legal implication | P1/P0 |
| Cosmetic typo, no compliance angle | P2 |
| New feature wish | defer / backlog |

Final severity is **human-owned** when gates say so ([AMK_INTERVENTION_GATES.md](AMK_INTERVENTION_GATES.md)).

---

## 4. Worked example (illustrative)

**Feedback:** “The Founder page makes me think I’m paying for better predictions.”

**Structured result:**

```text
Severity: P1
Domain: Pricing / Safety Wording
Affected route: /founder-offer (example)
Repro steps:
  1. Open Founder offer from navigation.
  2. Read hero and CTA copy without scrolling.
Expected: Clear that access is software/education scoped; no outcome promises tied to payment.
Actual: Copy implies performance or prediction advantage from payment.
Risk: Unsafe payment implication; trust/compliance.
Suggested minimal fix: Replace with software-access language; remove outcome-coupled claims (draft for human review only).
Needs Amk-Goku decision: yes — payment/legal-adjacent copy.
Assigned shadows: Safety Wording Shadow, Pricing Shadow, Patch Scribe Shadow
Verification commands: <set in consumer repo: pilot gate, lint, tests as applicable>
```

---

## 5. Privacy and comms hygiene

- Do not paste secrets, tokens, or full account data into hub files.
- If feedback contains PII, **redact** in the triage artifact; store details per **consumer** repo policy only.
- Align with hub communications precautions when Git/AI tooling is involved: [Z-GITHUB-AI-COMMS-PRECAUTIONS.md](../Z-GITHUB-AI-COMMS-PRECAUTIONS.md), [AGENTS.md](../../AGENTS.md).
