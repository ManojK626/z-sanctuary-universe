# Z-MAOS — Failure Escalation Rules

**Purpose:** When MAOS or operators must **stop** and escalate instead of pushing through.

---

## 1. Immediate stop (human required)

- Any hint of **Vault** or PII in wrong surface.
- Release enforcer / `manual_release` contradiction.
- Security sentinel critical finding unexplained.
- Attempted cross-repo write or coupling violation.

---

## 2. Pause and document

- Amber comm-flow or ecosystem verify: record in receipt; **do not** recolor green to hide drift.
- Repeated structure verify FAIL on same path: open ticket / doc note—no silent ignore.

---

## 3. Escalation path

1. Operator captures output + timestamp.
2. Route to **Consent Gatekeeper** + **Risk Shadow** review (human).
3. Only after approval: planned fix with L3 discipline.

---

## 4. Script behaviour

MAOS scripts exit **non-zero** on integrity failures only when explicitly designed; default is print WARN and exit 0 so daily rituals are not brittle—**configurable later**.
