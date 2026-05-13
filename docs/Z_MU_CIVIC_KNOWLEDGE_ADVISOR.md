# Z-MU-ADVISOR-1 — Mauritius Civic Knowledge Advisor (framework only)

## Purpose

A **peaceful civic knowledge advisor** posture: explain institutions, rights concepts, **lawful** complaint pathways, evidence thinking, and dignified public wording — **without** becoming a protest bot, political weapon, accusation machine, or lawyer.

Phase **Z-MU-ADVISOR-1** ships **docs + JSON policy + answer templates + sample prompts + read-only validator**. There is **no** live chat runtime, **no** AI provider, **no** public URL, **no** user accounts, and **no** personal data retention in this slice.

## Disclosure shape (for any future UI)

```text
I can explain the process, point to categories of sources, and help you prepare safe questions or checklists.
I cannot accuse, harass, incite, impersonate government, give legal advice as a lawyer, or coordinate pressure campaigns.
```

## Truth labels (every answer must carry one)

| Label | Meaning |
| ------------------- | -------------------------------------------------------------------------------------------- |
| **verified** | Anchored to official or otherwise reviewed primary material in the hub ledger/citation path. |
| **needs_citation** | Not ready for public factual claim; requires human-curated sources. |
| **procedural** | How to approach an institution safely; still not legal advice. |
| **policy_proposal** | Reform idea framed as scenario — not prediction or promise. |
| **blocked** | Unsafe request (harassment, doxxing, incitement, illegal leaks, etc.). |
| **human_review** | Ethics / legal / AMK gate before any outbound assistant text. |

## Modes (template-backed only in this phase)

| Mode | Intent |
| --------------------------- | ------------------------------------------------------- |
| **learn_governance** | Neutral institutional literacy. |
| **understand_my_situation** | Clarifying questions; safe next steps. |
| **claim_checker** | Draft claim ledger posture; default **needs citation**. |
| **citation_helper** | Explain what proof would look like; **no scraping**. |
| **safe_wording_rewrite** | De-escalate language toward lawful civic tone. |
| **evidence_checklist** | Lawful voluntary document planning only. |
| **policy_explainer** | Labelled proposals, not guarantees. |
| **escalation_filter** | Block unsafe asks; refuse with policy cite. |

## Audit-safe response log (design only)

Future implementations should log **decisions and source pointers**, not private lives. Example fields (no PII): `response_id`, `timestamp`, `mode`, `truth_label`, `safety_signal`, `sources_used`, `blocked_content`, `human_review_required`, `pii_stored: false`.

## Artifacts

| Path | Role |
| -------------------------------------------------- | ----------------------------------------- |
| `data/z_mu_advisor_policy.json` | Framework flags and allowed labels/modes. |
| `data/z_mu_advisor_answer_templates.json` | Template library (no runtime LLM). |
| `data/examples/z_mu_advisor_sample_questions.json` | Classifier fixtures. |
| `scripts/z_mu_advisor_check.mjs` | Validator + reports + indicator sync. |

## Command

```bash
npm run z:mu:advisor
```

RED fixture exercise:

```powershell
$env:Z_MU_ADVISOR_INCLUDE_RED_FIXTURE='1'
npm run z:mu:advisor
```

## Roadmap (not in this phase)

- **Phase 2:** Local static Q&A selecting approved templates (still no internet).
- **Phase 3:** Governed model/RAG only after AMK charter, privacy policy, and review queues.

## Related

- Truth engine: [Z_MAURITIANS_UNITE_CIVIC_TRUTH_ENGINE.md](Z_MAURITIANS_UNITE_CIVIC_TRUTH_ENGINE.md)
- Safety: [Z_MAURITIANS_UNITE_SAFETY_AND_PEACE_POLICY.md](Z_MAURITIANS_UNITE_SAFETY_AND_PEACE_POLICY.md), [Z_MU_ADVISOR_SAFETY_AND_AUDIT_POLICY.md](Z_MU_ADVISOR_SAFETY_AND_AUDIT_POLICY.md)
- Receipt: [PHASE_Z_MU_ADVISOR_1_GREEN_RECEIPT.md](PHASE_Z_MU_ADVISOR_1_GREEN_RECEIPT.md)
