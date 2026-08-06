# Registry Citizenship Protocol — Constitution of AI Membership

**Status:** ✅ PHASE 0 OPEN · Architecture / governance · **not runtime admission**  
**Priority:** 🥇 Highest of the three immutable blueprints  
**Date:** 2026-08-06  
**Authority:** AMK-Goku  
**Parent order:** [Trust Chain](Z_SANCTUARY_TRUST_CHAIN.md)  
**Awakens:** Z-ZES organism citizenship · PC-root / module / monster registries · Family AI registry · Stewardship certificates (related, not identical)

---

## Vision vs verified

| | |
| --- | --- |
| **Vision** | Before an AI receives audit receipts, passes Steward Gates, touches enterprise data, or talks to another AI, it is a **verified citizen** of the ecosystem. |
| **Verified today** | Protocol **chartered**; field questions defined; existing citizenship **patterns** (e.g. Z-ZES `data/z_zes_organism_citizenship.json`) are precursors — **universal AI citizen admission runtime does not exist**. |

---

## Purpose

Trusted **identity layer** for the organism. Without it, governance has no durable “who.”

---

## Questions every citizen record must answer

| Question | Field intent |
| --- | --- |
| Who are you? | `citizen_id` · display name · class (AI / organism / tool / human-steward agent) |
| What are you allowed to do? | `capabilities` · `autonomy_ceiling` · `forbidden_actions` |
| Which models can you access? | `model_allowlist` / `model_deny` (or `none` until chartered) |
| Which industries are you approved for? | `industry_scopes` (or `hub_only`) |
| What risks are associated with you? | `risk_class` · `risk_notes` |
| Who approved your admission? | `admitted_by` · `admission_receipt` |
| What version are you? | `citizen_version` · `protocol_edition` |
| Can citizenship be suspended or revoked? | `status`: `ACTIVE` · `SUSPENDED` · `REVOKED` · `ARCHIVED` + `status_reason` |

---

## Prerequisite law (membership before action)

Before a citizen may:

1. Receive an **Audit Receipt** as actor  
2. Pass a **Steward Gate** as requester  
3. Access enterprise / sensitive data  
4. Communicate with another AI under organism policy  

…they must hold **ACTIVE** citizenship under this protocol (when the protocol is later enforced).  

**Phase 0:** document and align registries — **do not** block existing hub observe scripts.

---

## Relationship to existing citizenship

| Existing | Relation |
| --- | --- |
| Z-ZES organism citizenship | Precursor organism-level citizen |
| `z_pc_root_projects.json` | Project citizenship (disk / Organiser) |
| Module / monster manifests | Capability / catalog IDs — not full AI membership yet |
| Family AI registry | Identity-adjacent — map carefully, do not merge blindly |
| Stewardship certificates | Preservation proofs — **not** AI admission |

This protocol is the **AI / agent membership constitution**; it does not replace project PC-root citizenship.

---

## Proposed machine shape (design only — Phase 0)

```text
schema: z_registry_citizenship_protocol_v0
citizen_id, display_name, class,
status, citizen_version, protocol_edition,
capabilities[], autonomy_ceiling, forbidden_actions[],
model_allowlist[], industry_scopes[],
risk_class, risk_notes,
admitted_by, admitted_at, admission_receipt,
suspended_at?, revoked_at?, status_reason?,
depends_on[], constitution_edition
```

No production registry file is mandated until AMK opens a Phase 0.5 citizenship **schema seal**.

---

## Phase plan

| Phase | Goal | Gate |
| --- | --- | --- |
| 0 | This protocol · Trust Chain order | ✅ Open |
| 0.5 | Schema seal + map existing IDs (Z-ZES, Family AI, …) | AMK Quality Gate |
| 1 | Mock citizen cards (docs/JSON dry-run) | AMK |
| 2+ | Enforcement hooks | Explicit · later |

---

## Next blueprint

Only after Phase 0.5 schema direction is clear: deepen [Steward Gate Logic](Z_STEWARD_GATE_LOGIC.md).

---

*Registry Citizenship Protocol · Phase 0 · foundation of membership*
