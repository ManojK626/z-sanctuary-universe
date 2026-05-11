# Z-DRP Verifier Checklist (Cross-Project)

**Purpose:** Give the **verifier** role (human or `/z-eaii-cross-project-verifier`) a repeatable **moral + technical** pass after implementer output. Aligned with the **14 Sacred DRP** framing in [Z-ULTRA-INSTINCTS-AND-FORMULAS.md](Z-ULTRA-INSTINCTS-AND-FORMULAS.md), [Z-HvsP.md](Z-HvsP.md), [Z-DACNETS.md](Z-DACNETS.md), and business governance in [Z-STAKEHOLDERS-AND-BUSINESS-AI.md](Z-STAKEHOLDERS-AND-BUSINESS-AI.md). Canonical legal and vault text stays in governance and vault docs—this list is **operational** for reviews.

**How to use:** For each item, mark **Y** (satisfied), **N** (gap), or **N/A**. Any **N** should appear in the evidence table as a **GAP** with owner and next step.

---

## The fourteen gates (verifier view)

| # | Gate | Verifier question |
| --- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1 | **No harm** | Could this change harm users, operators, or bystanders (including stress, deception, or unsafe defaults)? |
| 2 | **Protect the innocent** | Are children, non-users in affected communities, and other non-consenting parties protected from spillover? |
| 3 | **Lift others (Z-Poorest)** | Does the change preferentially help the most excluded or stressed users when trade-offs exist? |
| 4 | **Disclosure** | Are material limits, risks, and data uses visible where stakeholders need them (README, UI copy, or linked doc)? |
| 5 | **Responsibility** | Is there a clear owner and a credible rollback or mitigation if something goes wrong? |
| 6 | **Protection (data & vault)** | Are secrets, vault paths, and sensitive personal data absent from logs, diffs, and public surfaces? |
| 7 | **Consent-first** | For capture, telemetry, or personal data: is consent and scope respected (see consent-related specs)? |
| 8 | **Truth in verification** | Do stated commands, paths, and outcomes match what was actually run (no hand-waving)? |
| 9 | **Audibility** | Can a third party reconstruct _what happened_ from logs, reports, or handoff text? |
| 10 | **Accessibility & calm UX** | Where UI changes exist: are flashes, contrast, and coercion avoided per sanctuary accessibility norms? |
| 11 | **Fairness (value flows)** | Where money, credits, or pools appear: are documented fairness and regulator/stakeholder views respected? |
| 12 | **Sovereignty & policy** | Does the work obey hub security policy and vault policy (no vault exfiltration, no bypass of read-only rules)? |
| 13 | **Registry truth** | For cross-repo work: do disk paths and ports match `z-eaii-registry.json` (or hub equivalent), not assumptions? |
| 14 | **Pause threshold (Z-UI)** | If heart-led + pre-predict + DRP filter would say “pause,” was escalation chosen instead of silent ship? |

---

## Verdict rubric

- **PASS:** All applicable gates **Y**; evidence table complete.
- **PASS WITH GAPS:** At least one **N** with documented mitigation timeline, or **N/A** with explicit reason.
- **FAIL:** Any **N** on gates **1–3**, **6–7**, or **12**, or evidence table contradicts claims.

---

## Cross-references

- [Z-ULTRA-INSTINCTS-AND-FORMULAS.md](Z-ULTRA-INSTINCTS-AND-FORMULAS.md) — Ω(DRP-♾️), Z-UI, DRP-Filter.
- [rules/Z_SANCTUARY_SECURITY_POLICY.md](../rules/Z_SANCTUARY_SECURITY_POLICY.md) — hub security.
- [docs/vault/Vault_Access_Map.md](vault/Vault_Access_Map.md) — vault routing (read-only sincerity).
