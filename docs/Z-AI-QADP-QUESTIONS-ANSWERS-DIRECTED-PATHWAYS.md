# Z-AI QADP — Questions, Answers & Directed Pathways

## Purpose

**QADP** is a **hub pattern** for how Z-AI (and any assistant) should work across the Organiser so that work stays **grounded**, **project-correct**, and **traceable**. It links directly to creations you already have: registry, Super Chat citations, verifiers, evidence logs, dashboard, and governance docs.

This document does **not** claim magic elimination of all model mistakes. It defines **operational guarantees when the process is followed**: citations, registry-first resolution, explicit pathways, and human or approval gates where risk is non-trivial.

---

## Q — Questions (structured, disambiguated)

- **Anchor the question** to a **concrete artifact or intent**: file path, task label, module id, or doc title — not only free-form chat.
- **Resolve project context first** using generated truth, not guesses:
  - Hub: `data/z_pc_root_projects.json` (hub role, paths under `pc_root`).
  - Authority order when unsure: [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md).
- **Ask clarifying splits** when one question could touch multiple roots (e.g. “registry” might mean Z-EAII file vs hub `data/` vs Organiser). Prefer naming the **folder or repo** the user means.
- **Vault and sensitive zones** stay read-only or redacted by policy; questions about vault topics may be answered at **policy level** without exposing raw vault payloads (see security policy in repo rules).

---

## A — Answers (citation-backed, honest limits)

- **Prefer grounded answers**: quote or point to paths, snippets, and registry entries. Super Chat Phase A search returns **project + path + snippet**; use that shape in any “cross-project” answer.
- **If evidence is missing**, say so and name **what to run** next (e.g. `npm run super-chat:verify`, `node scripts/z_registry_omni_verify.mjs`, `node scripts/z_sanctuary_structure_verify.mjs`) instead of inventing file contents.
- **No silent cross-project substitution**: do not assume “the lottery app” equals “the hub” unless `z_pc_root_projects.json` ties the path. When in doubt, list **which project** each fact applies to.
- **Evidence spine**: append-only logs (e.g. Super Chat `data/reports/z_super_chat_evidence.jsonl`, bridge logs, Zuno reports) support **replay** and post-hoc review — not to prove the model never erred, but to show **what was queried and what was returned**.

---

## DP — Directed Pathways (follow-up vs autonomous)

**Directed Pathways** are explicit **next steps** with clear **ownership** and **gates**.

| Lane | Meaning | Typical wiring in Z-Sanctuary |
| ------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Follow-up task** | A human or tool picks up after a checkpoint; may need confirmation or a verifier run. | VS Code tasks, `npm run …`, checklist items, Super Chat “Prepare run” (gated `EXECUTE`). |
| **Autonomous task** | Bounded automation allowed **only** where policy says so (schedulers, read-only audits, indicators). | Auto-run hygiene, structure verify, non-writing probes — still **no silent writes** to vault or production without approval. |

- **Pathway template (for AI and humans):**
  `Intent → registry/project check → retrieve/cite OR run verifier → optional approval → action → evidence entry`
- **Escalation**: anything that **changes** repos, secrets, or production should go through your existing **approval + verification** story (Super Chat blueprint Action spine; Folder Manager; Overseer discipline).

---

## Links to existing creations (single map)

| Need | Use |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Which project lives where | `data/z_pc_root_projects.json` |
| Cross-root search + citations | [Z-SUPER-CHAT-BLUEPRINT.md](Z-SUPER-CHAT-BLUEPRINT.md), `npm run super-chat:readonly` |
| Hub structure sanity | `node scripts/z_sanctuary_structure_verify.mjs` |
| PC/NAS + rules + tasks sync picture | `node scripts/z_registry_omni_verify.mjs` |
| Module and panel roster | [Z-MASTER-MODULES-REGISTER.md](Z-MASTER-MODULES-REGISTER.md), `data/z_module_manifest.json` |
| Completions and control plane | [Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md](Z-COMPLETIONS-TEST-AND-COMMUNICATIONS-FLOW.md), dashboard Z Blueprint |
| Security / vault posture | `rules/Z_SANCTUARY_SECURITY_POLICY.md`, vault policy docs |

---

## Checklist for any AI (anti–cross-project mix-up & “hallucination” drift)

1. Read **Hierarchy Chief** if scope or ownership is unclear.
2. Resolve **project** from `z_pc_root_projects.json` (or explicit user path) before editing.
3. **Cite** paths for factual claims about the codebase; if you cannot cite, **flag as inference**.
4. After substantive answers, suggest **one verifier** or **one Super Chat query** that would **falsify** a wrong claim.
5. For follow-ups, output a **short pathway**: next command, expected artifact, who approves if writes are involved.

---

## Status

**Living doc.** Extend this file when you add new verifiers, registry fields, or Super Chat phases. Keep QADP terminology aligned with the Master Register and Super Chat blueprint so no assistant has to “guess” where methodology lives.
