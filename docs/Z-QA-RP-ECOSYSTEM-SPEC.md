# Z-Q&A&RP — Questions, Answers, Resolutions, Pathways (Ecosystem Spec)

**Status:** Canon v1 (hub)
**Scope:** How Q&A and resolution pathways strengthen the AI ecosystem **without** bypassing governance.

## Purpose

**Z-Q&A&RP** is the named loop where:

1. **Questions** — any agent or human surfaces uncertainty (“What can be done?” “What should be done?” “What does DRP require here?”).
2. **Answers** — grounded in repo truth, reports, and docs (not invention).
3. **Resolutions** — choices that pass **SEPC** and **DRP** before execution (see [Z_RESOLUTION_PATHWAYS.md](Z_RESOLUTION_PATHWAYS.md)).
4. **Pathways** — traceable handoff: awareness → recommendation → human / Enforcer → action.

Self-questioning by an AI is **allowed** as _reflection_; **self-authorization to execute** is **not** — Overseer, Enforcer, and release gates remain authoritative.

## Alignment with 14 DRP laws

Operational verifier gates are defined in **[Z-DRP-VERIFIER-CHECKLIST.md](Z-DRP-VERIFIER-CHECKLIST.md)** (fourteen gates: no harm, protect the innocent, lift others, disclosure, responsibility, protection, consent, truth, audibility, accessibility, fairness, sovereignty, registry truth, pause threshold).

Every Q&A&RP output that could change production behavior must be checkable against those gates. Formula and compassion framing: [Z-ULTRA-INSTINCTS-AND-FORMULAS.md](Z-ULTRA-INSTINCTS-AND-FORMULAS.md).

## Resolution spine

Follow **[Z_RESOLUTION_PATHWAYS.md](Z_RESOLUTION_PATHWAYS.md)** — five stages (root detection → cause mapping → action selection → verification → codex update). If a stage fails, **pause** — do not ship silently.

## Ecosystem feeds (observe → improve)

| Signal | Artifact | Role |
| ----------------------- | --------------------------------------------------------------------------------- | ----------------------------------------- |
| Structure & capability | `data/reports/z_garage_system_map.json`, `data/z_garage_capability_registry.json` | Awareness |
| Intelligence & priority | `data/reports/z_ci_intelligence.json`, `data/reports/z_garage_upgrade_plan.json` | Advisory |
| Observer narrative | `data/reports/zuno_system_state_report.json` | State |
| Governance pressure | `data/reports/z_execution_enforcer.json` | Authority context (not overridden by Q&A) |

Q&A&RP **does not** auto-deploy, auto-merge, or bypass `manual_release` / readiness.

## Machine-readable registry

**`data/z_qa_rp_registry.json`** — pathway stages, DRP references, self-inquiry templates for agents, optional append-only intake path for human-approved logging.

## Dashboard

**`/dashboard/z-qa-rp/index.html`** — human-readable view of the registry + links to DRP and pathways docs.

## Cursor / AI usage

When generating answers:

1. Prefer **Hierarchy Chief** and [AGENTS.md](../AGENTS.md) when unsure.
2. Run **DRP verifier mental pass** against the fourteen gates for risky changes.
3. Offer **pathways** (options + tradeoffs + DRP note), not silent execution.

---

_Z-Q&A&RP strengthens the ecosystem by making questions and resolutions **explicit, lawful, and auditable** — not by granting AIs silent control._
