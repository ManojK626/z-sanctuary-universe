# Z-Connect — Connection Confidence

**Status:** Signature concept · specification only  
**Owner:** AMK-Goku  
**Version:** 1.0 (locked with Architecture Decisions v1)

---

## Problem

A single percentage — *“You are 92% compatible”* — implies false precision, encourages decision outsourcing, and erodes trust when outcomes differ.

---

## Principle

Replace opaque scores with **explainable, dimension-level confidence** tied to **what the user actually shared**.

```text
No:   "92% compatible"
Yes:  "Shared interests — high confidence (you both listed hiking and science fiction)"
      "Long-term goals — limited information (only Day 1 profile so far)"
```

Insights are **conversation starters**, not facts.

---

## Immutable rule

> No AI-generated compatibility insight shall be presented as objective truth. All insights are probabilistic, preference-based, and intended to help users explore connections — not to make decisions for them.

---

## Confidence levels (UI vocabulary)

| Level | Meaning | Typical basis |
| ----- | ------- | ------------- |
| **High confidence** | Multiple explicit user inputs align | Both users stated the same interest or preference |
| **Medium confidence** | Some alignment; partial data | One detailed answer + inferred theme user approved |
| **Limited information** | Not enough user-shared data yet | Dimension not covered in profile or journey |
| **Still learning** | Progressive Discovery active | User invited deeper sharing; summary pending approval |

Never map confidence levels to a hidden numeric rank used for sorting people.

---

## Example presentation

**Between you and Alex (illustrative):**

| Dimension | Observation | Confidence |
| --------- | ------------- | ---------- |
| Shared interests | Both mentioned hiking and documentary films | High |
| Communication preferences | Alex prefers async chat; you prefer voice notes | Medium — different styles, not incompatible |
| Long-term goals | Alex shared family goals; you have not yet | Limited information |
| Lifestyle alignment | Sleep schedule preferences overlap | Still learning |

**Suggested opener:** *“I noticed we both enjoy hiking — any favourite trails?”*

---

## What the AI must explain

For each insight surfaced, the UI or assistant should make visible:

1. **Why** — which user-provided fields or approved journey themes contributed  
2. **Confidence** — one of the four levels above  
3. **Limitation** — what is **not** known yet  
4. **User action** — “Add more to your profile”, “Start a Discovery Journey”, or “Edit this summary”  

---

## Forbidden patterns

| Pattern | Why |
| ------- | --- |
| Single compatibility percentage | False precision; manipulative |
| “Scientifically proven match” | Unless citing specific study in expert mode — not default product |
| Hidden sort score from confidence | Confidence is explanatory, not a ranking weapon |
| Confidence derived from astrology (default lane) | Entertainment lane excluded unless user opts into fun filters |

---

## Data model hint (Phase 1.5 contract)

Future `compatibility-insight` shapes should include:

- `dimensionId`  
- `narrative` (plain language)  
- `confidenceLevel` (`high` \| `medium` \| `limited` \| `learning`)  
- `sourceFieldRefs[]` (user-approved profile paths only)  
- `disclaimer` (immutable template string)  
- `generatedAtIso` · `correlationId`  

No `percentCompatible` field in v1 contracts.

---

## Stack gates (when runtime exists)

- **Shadow** — block manipulative certainty language  
- **DRP** — escalate child-data or health-adjacent insight categories  
- **Observability** — audit insight generation with correlation ID (no PII in logs)  

---

## Related

- [Z_CONNECT_PROGRESSIVE_DISCOVERY.md](Z_CONNECT_PROGRESSIVE_DISCOVERY.md)  
- [Z_CONNECT_SCIENTIFIC_INTEGRITY.md](Z_CONNECT_SCIENTIFIC_INTEGRITY.md)  
- [Z_CONNECT_ARCHITECTURE_DECISIONS_V1.md](Z_CONNECT_ARCHITECTURE_DECISIONS_V1.md)
