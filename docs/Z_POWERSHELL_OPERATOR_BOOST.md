# Z-PowerShell Operator Boost — local-first operator posture

**Status:** docs-only operator guidance for PowerShell use inside Z-Sanctuary lanes.  
**Scope:** command hygiene, local verification posture, and calm operator assistance.  
**Non-scope:** deploy authority, merge authority, unattended execution, secret handling,
or cloud mutation control.

---

## 1. Purpose

The **Z-PowerShell Operator Boost** exists to help an operator move through
PowerShell tasks with a clean, local-first rhythm:

- prepare commands carefully,
- verify before claiming readiness,
- prefer local observation over remote mutation,
- keep human review in charge of merge and deploy decisions.

It is an operator aid, not an automation charter.

---

## 2. PowerShell posture law

This boost is:

- operator guidance,
- command hygiene,
- verification posture,
- local-first workflow assistance.

This boost is **not**:

- automation authority,
- deploy authority,
- merge authority,
- unattended execution,
- secret handling,
- cloud mutation control.

---

## 3. Turtle Mode alignment

The standing law remains:

**Observe -> verify -> suggest -> human decides.**

Readiness signals are informational only. No section in this document grants
autonomous authority.

---

## 4. Operator habits

1. Keep commands explicit and reviewable before execution.
2. Prefer local inspection and local receipts before widening scope.
3. Treat verification output as evidence, not permission.
4. Escalate any merge, deploy, secret, or cloud mutation decision to the human
   operator.
5. Keep documentation truthful about what PowerShell helpers can and cannot do.

---

## 5. Minimal local quick check

From hub root, the smallest matching proof is:

```powershell
npm run verify:md
git status
```

Expected outcome:

- clean docs state,
- no report churn,
- no runtime drift introduced by this docs lane.

---

## 6. Revision

| Version | Note |
| ------- | ---- |
| Z-POWERSHELL-BOOST-1 | Initial operator guidance landing — docs only |
