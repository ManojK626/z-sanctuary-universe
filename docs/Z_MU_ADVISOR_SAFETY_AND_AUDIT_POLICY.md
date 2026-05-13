# Z-MU Advisor — Safety & Audit Policy (Z-MU-ADVISOR-1)

## Scope

Governs the **advisor framework** JSON, templates, validator, and any future static Q&A that **only** selects from approved hub material.

## Hard prohibitions

- Live AI provider calls or cloud inference **from this repo phase**.
- Public launch, hosted chat, or mass messaging **without separate charter**.
- User memory, profiling, or **personal data collection** in advisor logs.
- **Legal advice** framed as representation or guaranteed outcomes.
- **Government impersonation** or forged official channels.
- **Protest coordination**, harassment, pile-ons, **doxxing**, sabotage incitement, **illegal leak** playbooks.
- Ethnic or religious **group blame** or collective guilt narratives.
- Hidden surveillance / nonconsensual recording guidance.

## Audit philosophy

**Log decisions and sources, not private lives.**

Allowed metadata in a future trace: mode, truth label, safety signal, claim/citation IDs, blocked flag, timestamp. **No** national ID numbers, home addresses, phone dumps, or intimate details in hub artifacts.

## Truth label discipline

- **verified** only when ledger/citation path includes human-attached primary references.
- **needs_citation** default for statistical or legal concrete claims without attachment.
- **blocked** for unsafe prompts — respond with refusal + short lawful alternative at high level.
- **human_review** before answering sensitive reputational allegations.

## Relationship to truth engine

The advisor never overrides `z_mu_truth_report` classifications: escalate **RED** content to blockage; **YELLOW** prompts stay citation-first; **BLUE** waits for gate.

## Locked law

```text
Civic advisor ≠ government authority.
Explanation ≠ legal advice.
Source link ≠ proof.
Answer log ≠ surveillance.
GREEN ≠ public launch.
BLUE requires human/legal/ethics review.
RED blocks movement.
AMK-Goku owns sacred moves.
```
