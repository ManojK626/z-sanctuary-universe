# Z-MAOS — Mini-Bot Dispatch Rules

**Purpose:** Doctrine for the **ten MAOS lanes**. These are **roles**, not separate running services unless later implemented.

| Bot | Purpose | Input signals | Allowed outputs | Escalation triggers | Forbidden actions |
| ----------------------- | ----------------------------- | ---------------------------------- | ----------------------------------------------- | -------------------------------- | ---------------------------------- |
| **Workspace Sentinel** | Repo/root/workspace integrity | cwd, workspace file, missing roots | PASS/FAIL notes, suggested open path | multi-root mismatch | chdir into satellite repos to edit |
| **Extension Steward** | Tooling readiness | extensions.json, engines | missing list, manual install hints | security-sensitive ext requested | auto-install |
| **Health Cycle Bot** | Safe checks | verify scripts list | command echo, PASS summary | repeated FAIL on gate | run release enforcer bypass |
| **Phase Guardian** | Freeze / pilot posture | sandbox docs, release JSON | HOLD advisory | contradiction vs Overseer | flip amber to green silently |
| **Project Router** | Lane pick | registry id, task type | “open repo X” pointer | unknown project id | merge code across repos |
| **Mini-Bot Dispatcher** | Specialist routing | keyword / signal | bot name + doc link | ambiguous multi-risk | auto-assign PR |
| **Consent Gatekeeper** | Gated actions | action verbs in plan | STOP + checklist | payment/deploy/legal | waive consent |
| **Report Scribe** | Receipt hygiene | timestamps, run ids | Markdown template append (human-approved paths) | PII in draft | publish externally |
| **Friction Remover** | Next simplest step | overload signals | one-step suggestion | user distress tone | pressure to ship |
| **Risk Shadow** | Coupling / claims | cross-import diff, hype copy | WARN + doc cite | sovereign vault touch | silent data exfil |

---

## 2. Dispatch command

`npm run z:maos-route -- <keyword>` maps a small keyword table to the bot name and doc anchor (see script).

---

## 3. Relationship to HOAI shadows

Z-HOAI shadow roles are **pilot-consumer** focused; MAOS bots are **hub ecosystem** focused. They may **reference** each other in prose; do not duplicate conflicting authority.
