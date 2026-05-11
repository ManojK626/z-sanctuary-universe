# Z-HOAI — Multi-Shadow Mini-Bot Roles

**Purpose:** Define **logical** “shadow” roles (not separate running bots required). Each role is a lens for classifying pilot feedback and deciding what may be drafted vs what must escalate.

**Principle:** Many eyes, **no** reckless autonomy. See [Z_HOAI_PILOT_INTELLIGENCE_PLAN.md](Z_HOAI_PILOT_INTELLIGENCE_PLAN.md).

---

## Role index

| Shadow | Domain | Primary watch |
| ---------------------- | ---------------------- | ------------------------------------------------------------------------ |
| UX Shadow | User confusion | Bad flow, unclear pages, confusing controls |
| Crash Shadow | App bugs | Crashes, console errors, broken routes |
| Safety Wording Shadow | Claims / safety | Unsafe or misleading claims, gambling/payment implication |
| Pricing Shadow | Pricing clarity | Plan confusion, price sense / nonsense |
| Access Gate Shadow | Feature gates | Wrong lock/unlock, entitlement mismatch |
| Support Shadow | Support / feedback ops | Categories, urgency, routing (e.g. Z-FCCAI-style taxonomies in your app) |
| Responsible-Use Shadow | User safety | Distress, chasing, underage, unsafe behaviour signals |
| Ops Shadow | Tooling | Pilot gates, dry runs, lint/build/test discipline |
| Patch Scribe Shadow | Records | Tracker rows, patch notes, report updates |

---

## 1. UX Shadow

| Item | Detail |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| **Input signals** | “Confused,” “didn’t understand,” “wrong place,” flow complaints, accessibility friction (if reported). |
| **Classification rules** | Map to **domain UX**; severity often P2 unless blocks task (then P1). Link **affected route** and **steps**. |
| **Allowed actions** | Draft clearer copy/layout suggestion; propose **minimal** UI change list; tracker row draft. |
| **Escalation triggers** | Confusion implies **money, legal, or safety** → escalate. Any P0 blockage of core journey. |
| **Forbidden actions** | Shipping UX that **implies** forbidden product behaviour; redesign “while we’re here” scope creep. |

---

## 2. Crash Shadow

| Item | Detail |
| ------------------------ | ------------------------------------------------------------------------------------------------------------ |
| **Input signals** | White screen, stack traces, “page died,” infinite spin, failed navigation. |
| **Classification rules** | **Crash Shadow** owns **repro** and **environment** hints; severity **P0/P1** if reproducible or widespread. |
| **Allowed actions** | Bug summary draft; suspected file/module list; repro steps; suggested hotfix **outline**. |
| **Escalation triggers** | Data loss, auth bypass, security exception → immediate human + security path in **that** product. |
| **Forbidden actions** | Auto-merging fixes; silencing errors; disabling checks to “make it pass.” |

---

## 3. Safety Wording Shadow

| Item | Detail |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Input signals** | “Felt unsafe,” “sounds like gambling advice,” “promises outcomes,” payment implication on non-payment features. |
| **Classification rules** | Tag **Safety Wording** + **risk label**; default **human review required = yes**. |
| **Allowed actions** | **Draft** alternative wording for review only; cite **affected strings/routes**; P1/P0 recommendation. |
| **Escalation triggers** | Always escalate for **merge**; AI never “finalizes” compliance language. |
| **Forbidden actions** | Auto-editing legal/safety copy; adding urgency/scarcity that increases harm. |

---

## 4. Pricing Shadow

| Item | Detail |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **Input signals** | “Price makes no sense,” founder/plan confusion, mismatch between UI and expectation. |
| **Classification rules** | Tag **Pricing**; separate **billing bug** vs **copy clarity**. |
| **Allowed actions** | Clarification questions; draft **neutral** explanatory copy **for review**; tracker row with screenshots references. |
| **Escalation triggers** | Any live billing, tax, refunds, charging path → human mandatory. |
| **Forbidden actions** | Changing amounts, SKU logic, entitlement rules, or store config without approval. |

---

## 5. Access Gate Shadow

| Item | Detail |
| ------------------------ | ------------------------------------------------------------------------------- |
| **Input signals** | “Should have access,” “locked incorrectly,” beta flag wrong. |
| **Classification rules** | Tie to **gate source** (flag, tier, cohort) if known; severity by blast radius. |
| **Allowed actions** | Hypothesis + repro; suggest **minimal** conditional fix scoped to gates. |
| **Escalation triggers** | Security-sensitive roles, admin impersonation, data exposure. |
| **Forbidden actions** | Broad “unlock everyone” hacks; weakening auth for convenience. |

---

## 6. Support Shadow

| Item | Detail |
| ------------------------ | -------------------------------------------------------------------------------- |
| **Input signals** | Misc feedback channels, categorized tickets, recurring themes. |
| **Classification rules** | Map themes to **other shadows** (UX, Crash, …); urgency triage only. |
| **Allowed actions** | Cluster summary; backlog suggestions **defer** for pilot stabilization. |
| **Escalation triggers** | Harassment, self-harm, legal threat → Responsible-Use / human immediate. |
| **Forbidden actions** | Auto-closing incidents; committing PII into hub repos or reports without policy. |

---

## 7. Responsible-Use Shadow

| Item | Detail |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **Input signals** | Distress language, compulsive patterns, underage clues, escalation of harm. |
| **Classification rules** | Treat as **safeguarding-sensitive**; do not diagnose; **minimal** factual logging only. |
| **Allowed actions** | Internal escalation note templates; pointers to crisis resources **only where product policy allows** — human approves wording. |
| **Escalation triggers** | **Always** prioritize human review; treat as potential P0 for policy response. |
| **Forbidden actions** | Automated punitive account actions; public shaming copy; scraping personal data beyond policy. |

---

## 8. Ops Shadow

| Item | Detail |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Input signals** | CI failures, gate scripts, stale branches, flaky tests blocking pilot. |
| **Classification rules** | Separate **product bug** vs **pipeline** noise; cite failing command/log line. |
| **Allowed actions** | Command checklist draft; rerun recipe; isolate minimal fix PR scope. |
| **Escalation triggers** | Enforcer/release gates failing in hub **without pilot context** → follow hub docs, don’t jury-rig XL2 hacks here. |
| **Forbidden actions** | Disabling org-wide guardians to ship a pilot patch from the wrong repo. |

---

## 9. Patch Scribe Shadow

| Item | Detail |
| ------------------------ | --------------------------------------------------------------------------------- |
| **Input signals** | Decisions made, merges planned, verification outcomes. |
| **Classification rules** | One tracker row **per** discrete finding; link PR/patch IDs in **consumer** repo. |
| **Allowed actions** | Fill `verification_commands`, risks, rollback notes **as drafts**. |
| **Escalation triggers** | Contradiction between tracker and actual merge → stop and reconcile with human. |
| **Forbidden actions** | Marking “verified” without human confirmation when gates require it. |

---

## Cross-reference

- Triage field mapping: [FEEDBACK_TRIAGE_RULES.md](FEEDBACK_TRIAGE_RULES.md)
- Human gates: [AMK_INTERVENTION_GATES.md](AMK_INTERVENTION_GATES.md)
- Matrix: [PATCH_DECISION_MATRIX.md](PATCH_DECISION_MATRIX.md)
