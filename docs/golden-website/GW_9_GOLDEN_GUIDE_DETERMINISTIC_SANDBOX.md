# GW-9 — Golden Guide deterministic sandbox

**Phase:** Golden Website GW-9
**Date:** 2026-08-27
**Runtime:** **SANDBOX_LOCAL_ONLY**. Production Golden Guide AI = **CLOSED**.
**Provider:** none. Embeddings: none. Network: none.
**CTA:** Ask Z-Sanctuary
**Label:** GOLDEN GUIDE AI — SANDBOX · LOCAL PREVIEW

Open locally: `docs/golden-website/shell/guide-sandbox.html`

## Architecture

```text
Visitor
  → Question
  → Intent classifier
  → Approved corpus lookup
  → Evidence / claim guard
  → Answer composer
  → Citation + limitation validator
  → Surface router
  → Response (one of five behaviors)
```

An LLM may later sit **inside** this pipeline. It must not bypass it.

Golden Guide AI ≠ Zuno. AI answer ≠ evidence. Retrieval ≠ truth. Intent ≠ truth.

## Retrieval method

Provider-free and explainable:

1. Normalize the question (lowercase, strip punctuation).
2. Private-request guard (before lookup).
3. Exact match against curated GW-8 Q&A mappings.
4. Hype / evidence-upgrade / commercial guards.
5. Identity guard (`Are you Zuno?` → No).
6. Weighted keyword overlap against the 22 approved records and subject aliases.
7. LOW confidence becomes UNKNOWN unless a curated mapping exists.

No embeddings. No vector database. No external search. No APIs.

Knowledge source: `data/golden-website/public/gw8_approved_knowledge_corpus.json` only (22 records).

## Behavior classes

Every response resolves to exactly one of:

| Class | When |
| --- | --- |
| ANSWER | Approved knowledge directly supports the reply |
| QUALIFY | Partly answerable; limitations required |
| ROUTE | Safest useful act is a local surface pointer |
| PRIVATE_REFUSAL | Private / sensitive request |
| UNKNOWN | Cannot ground the question |

UNKNOWN may carry `NEEDS_REVIEW`. Unknown is a valid result. It does not hallucinate.

## Guards

- **Claim guard:** blocks unsupported production, commercial-validation, revenue, valuation, market-leader, and superiority language.
- **Evidence-state guard:** QUALIFIED ≠ VERIFIED. SEALED ≠ deployed. PASS ≠ VERIFIED. Working local ≠ public service.
- **Commercial guard:** POTENTIAL_NOT_VALIDATED. No invented figures.
- **Identity guard:** Golden Guide is not Zuno and not AMK Personal AI.
- **Private guard:** refuses Zuno memory, HODP, ICIS, NAS, overlay catalogs, operator HTML, secrets, and internal infrastructure without confirming extra detail.

## Citation model

Grounded answers expose:

- `knowledge_id`
- `subject_id`
- public name and evidence state
- related local `.html` surfaces

No internal filesystem paths.

## Explainability

**Why this answer?** shows matched subjects, knowledge IDs, behavior, intent class, confidence (HIGH / MEDIUM / LOW), and retrieval method. Not private data. Not chain-of-thought.

## Privacy model

Each question is independent. No persistent visitor memory. No personal storage. Browser-visible corpus is the approved GW-8 public-safe payload only.

## Limitations

- This is a local sandbox, not a public AI service.
- Production Golden Guide AI runtime remains closed.
- Full Golden Universe Map remains locked.
- Critic Mode is not a live runtime.
- Human NVDA / VoiceOver remains required before any public pilot.
- Language flexibility is limited; a future model may help phrasing only after this grounding layer.
- Review queue for UNKNOWN is still not implemented.

## Hard laws

```text
Golden Guide AI ≠ Zuno
AI answer ≠ evidence
retrieval ≠ truth
intent ≠ truth
UNKNOWN ≠ failure
private ≠ answerable
QUALIFIED ≠ VERIFIED
prototype ≠ production
potential ≠ revenue
local sandbox ≠ public service
observe → verify → suggest → human decides
readiness ≠ deploy
```
