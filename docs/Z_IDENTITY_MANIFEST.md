# Identity Manifest — Birth Certificate of Every Registry Citizen

**Status:** ✅ PHASE 0 OPEN · Immutable **categories** sealed · field lists are examples  
**Book:** B (Registry Citizenship family) · **Step 1 of 4**  
**Date:** 2026-08-06  
**Authority:** AMK-Goku  
**Parents:** [Trust Chain](Z_SANCTUARY_TRUST_CHAIN.md) · [Citizenship Protocol](Z_REGISTRY_CITIZENSHIP_PROTOCOL.md)  
**Law:** Identity precedes citizenship · Vision ≠ verified · Evidence property applies

---

## Vision vs verified

| | |
| --- | --- |
| **Vision** | Every Registry Citizen has a complete Identity Manifest before admission, gates, or revocation. |
| **Verified today** | **Categories** chartered; example fields listed; **no** mandatory runtime manifest file or admission engine. |

---

## Why this comes first (Book B)

Without a complete manifest:

- you cannot evaluate citizenship consistently  
- you cannot revoke citizenship consistently  
- you cannot distinguish humans from agents reliably  

Everything else in Book B depends on **identity truth** from one source — not redefined in every downstream doc.

```text
Trust Chain
    ↓
Identity Manifest          🥇  (this document)
    ↓
Registry Citizenship Rules
    ↓
Capability Declaration     (category inside manifest + later rules)
    ↓
Human / Agent Distinction  🔒 derived later
    ↓
Steward Gates
    ↓
Revocation Framework       🔒 derived later
    ↓
Audit Receipts
```

**Constitutional logic:**

```text
Identity precedes citizenship.
Citizenship precedes governance.
Governance precedes revocation.
```

---

## Phase 0 — Immutable categories (freeze these)

Individual fields may refine later. **Categories do not reorder** without AMK edition bump.

### 1 · Identity

Examples: Registry ID · Display Name · Identity Type · Version

### 2 · Origin

Examples: Vendor · Creator · Deployment Owner · Provenance

### 3 · Technical Profile

Examples: Model Family · Architecture Class · Context Window · Modalities · Runtime Environment

### 4 · Capability Declaration

**Not permissions. Capabilities.**

Examples: Text · Vision · Audio · Coding · Planning · Search · Tool Use

Permissions / allow-lists live under governance and Steward Gates — not confused with capability declaration.

### 5 · Governance Profile

Examples: Trust Level · Steward Required · Risk Category · Approval Boundary

### 6 · Lifecycle

Examples: Created · Activated · Suspended · Retired  
(Status vocabulary aligns later with Citizenship Rules / Revocation — do not invent revocation rules here.)

---

## Evidence (cross-cutting)

Every manifest create / update / status change should be **traceable** (who · when · why · receipt ref) per Trust Chain Evidence property.

---

## Explicitly not this Phase 0

| Deferred | Why |
| --- | --- |
| Full field schema seal | Categories first |
| Human–Agent Distinction Schema | Grows from Identity Type — Book B step 3 🔒 |
| Revocation Framework | Inverse of citizenship — Book B step 4 🔒 |
| Runtime admission / enforcement | Closing Doctrine |

---

## Book B freeze order (locked)

1. ✅ **Identity Manifest** (what every citizen must declare) — this doc  
2. ✅ **Citizenship Rules** (how admission is evaluated) — [Citizenship Protocol](Z_REGISTRY_CITIZENSHIP_PROTOCOL.md) refined next  
3. 🔒 **Human–Agent Distinction Schema** (derived from manifest)  
4. 🔒 **Revocation Framework** (derived from citizenship rules)  

---

## Next

Refine Citizenship Rules against these six categories (admission questions map to Identity / Origin / Technical / Capability / Governance / Lifecycle).  
Do **not** open Distinction or Revocation docs as active design until Manifest + Rules are stable enough for AMK Phase 0.5.

---

*Identity Manifest · Book B step 1 · categories sealed*
