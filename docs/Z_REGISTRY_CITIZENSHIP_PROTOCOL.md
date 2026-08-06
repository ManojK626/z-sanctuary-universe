# Registry Citizenship Protocol — Constitution of AI Membership

**Status:** ✅ PHASE 0 OPEN · Architecture / governance · **not runtime admission**  
**Priority:** 🥇 Book B · **Step 2** (after Identity Manifest)  
**Date:** 2026-08-06  
**Authority:** AMK-Goku  
**Parent order:** [Trust Chain](Z_SANCTUARY_TRUST_CHAIN.md) · **Requires:** [Identity Manifest](Z_IDENTITY_MANIFEST.md)  
**Awakens:** Z-ZES organism citizenship · PC-root / module / monster registries · Family AI registry · Stewardship certificates (related, not identical)

---

## Vision vs verified

| | |
| --- | --- |
| **Vision** | Before an AI receives audit receipts, passes Steward Gates, touches enterprise data, or talks to another AI, it is a **verified citizen** of the ecosystem. |
| **Verified today** | Protocol **chartered**; admission questions mapped to Manifest categories; existing citizenship **patterns** are precursors — **universal AI citizen admission runtime does not exist**. |

---

## Book B freeze order (do not reorder)

1. ✅ [Identity Manifest](Z_IDENTITY_MANIFEST.md) — what every citizen must declare  
2. ✅ **Citizenship Rules** (this doc) — how admission is evaluated  
3. 🔒 [Human–Agent Distinction](Z_HUMAN_AGENT_DISTINCTION_SCHEMA.md) — locked  
4. 🔒 [Revocation Framework](Z_REVOCATION_FRAMEWORK.md) — locked  

```text
Identity precedes citizenship.
Citizenship precedes governance.
Governance precedes revocation.
```

---

## Purpose

Trusted **membership rules** for the organism — evaluated against a complete Identity Manifest. Without Manifest, citizenship evaluation invents identity ad hoc.

---

## Admission questions → Manifest categories

| Question | Manifest category | Field intent (examples) |
| --- | --- | --- |
| Who are you? | Identity | `citizen_id` · display name · Identity Type · version |
| Where do you come from? | Origin | vendor · creator · owner · provenance |
| What is your technical shape? | Technical Profile | model family · modalities · runtime |
| What can you do? | Capability Declaration | text · vision · tools… (**not** permissions) |
| What governance binds you? | Governance Profile | trust level · steward required · risk · approval boundary |
| Where are you in life? | Lifecycle | created · activated · suspended · retired |
| What are you allowed to do (permissions)? | Governance + later Gates | `autonomy_ceiling` · `forbidden_actions` · model allowlist |
| Which industries? | Governance Profile / scopes | `industry_scopes` or `hub_only` |
| Who approved admission? | Evidence / receipt | `admitted_by` · `admission_receipt` |
| Can status change? | Lifecycle · **Revocation locked** | status vocabulary only — invalidating **conditions** wait for Revocation Framework |

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
