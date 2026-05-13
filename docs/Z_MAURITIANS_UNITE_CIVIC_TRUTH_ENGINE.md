# Z-Mauritians Unite — Civic Truth & Dignity Engine (Z-MU-TRUTH-1)

Formal ID: **Z-MU-TRUTH-1** — Mauritius Civic Research & Awareness posture inside the Sanctuary hub.

## Purpose

Translate **public pain about wages, debt, institutions, and dignity** into a **peaceful, evidence-first civic layer**: claim rows, verification status, lawful pathway hints, ranked sources, and **nonviolent** policy language.

This phase is **not** a campaigning platform, not legal advice, not a protest coordination surface, not mass messaging, and not publishing infrastructure.

```text
Raw public pain → verified claims → lawful awareness → careful policy proposals → support pathways → hub evidence rows → peaceful civic engagement OFF hub under human judgment
```

## What lives in the hub now

| Artifact | Role |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data/z_mu_claim_ledger.json` | Neutral claim ledger rows (Phase 1 seed). |
| `data/z_mu_source_policy.json` | Source ranks, required fields, peace filter phrases, disclaimers. |
| `data/examples/z_mu_claim_samples.json` | Additional classifier rows (+ optional RED fixture). |
| `scripts/z_mu_truth_check.mjs` | Read-only validator and report writer; syncs AMK indicator **signal**. |
| `data/z_mu_advisor_policy.json` (+ templates) | Z-MU-ADVISOR-1 civic **knowledge advisor** framework — templates only, **no live chat** ([Z_MU_CIVIC_KNOWLEDGE_ADVISOR.md](Z_MU_CIVIC_KNOWLEDGE_ADVISOR.md)). |

## Relation to Z-MU-ADVISOR-1

The **Civic Knowledge Advisor** adds mode + template vocabulary for explaining governance and safe next steps — still **metadata-only** until a separate chartered build adds static or governed AI surfaces. Validator: `npm run z:mu:advisor`.

## Claim Truth Engine (conceptual)

Each claim becomes a ledger row with at least:

- `claim_id`, `category`, `source_status`, `public_wording`, `safety_class`, `next_verification_step`

Statuses include **needs verification**, **verified official neutral language**, and **blocked escalatory**. Operators attach **official citations with dates** before upgrading any provisional wording—never rumor or repost chains alone.

## Lawful pathways (informational hints only)

Pointers belong to **national institutions** and recognised frameworks (labour ministries, commissions, lawful assembly rules, treaty-body **procedural** materials). Operators must cite **verbatim current portals**—this hub stores posture, not a live directory scraper.

**Not legal advice:** anyone affected should consult licensed professionals and official channels.

## Peace filter (mandatory doctrine)

Destructive metaphors (**economic sabotage, violent ultimatums, illegal leaks as strategy, harassment, group blame**) are forbidden as platform-export language. Rows that contain blocked phrases are classified **RED** by the validator and must be rewritten entirely.

Golden law:

```text
Z-Mauritians Unite protects dignity.
It does not incite violence, harassment, doxxing, sabotage, or illegal leaks.
```

## Research engines (road map language)

Later phases MAY add engines (ledger UI, appendix citations, calculators) **still without** autonomy, scraping, coordination, payments, deploy, or live APIs unless separately chartered:

- Claim ledger depth and citation archive
- Source rank tooling
- Wage vs cost hypotheses (simulations labelled “not predictions”)
- Policy scenario text (scenario, not forecast)

## Command

```bash
npm run z:mu:truth
```

Fixture (deliberate RED exercise):

```powershell
$env:Z_MU_TRUTH_INCLUDE_RED_FIXTURE='1'
npm run z:mu:truth
```

## Signals

| Signal | Meaning |
| ---------- | ------------------------------------------------------------------------ |
| **GREEN** | Peaceful, neutral, evidence-anchored rows dominate. |
| **YELLOW** | Evidence gaps or taxonomy warnings—keep offline from public until cited. |
| **BLUE** | Human / legal / ethics gate before wider distribution. |
| **RED** | Escalation, incitement, or governance breach—validator exits **1**. |

## Related hub shields

- [Z_XBUS_EXTERNAL_CONNECTOR_GATE.md](Z_XBUS_EXTERNAL_CONNECTOR_GATE.md) — external connector discipline.
- [Z_ULTRA_MAGE_FORMULA_CODEX.md](Z_ULTRA_MAGE_FORMULA_CODEX.md) — formula stays lawful.
- Safety policy: [Z_MAURITIANS_UNITE_SAFETY_AND_PEACE_POLICY.md](Z_MAURITIANS_UNITE_SAFETY_AND_PEACE_POLICY.md).
- Receipt: [PHASE_Z_MU_TRUTH_1_GREEN_RECEIPT.md](PHASE_Z_MU_TRUTH_1_GREEN_RECEIPT.md).
