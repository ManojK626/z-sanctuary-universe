# Audit Receipt Structure — Official Records

**Status:** 📋 OUTLINE · depends on Citizenship + Steward Gate Logic  
**Priority:** 🥉  
**Date:** 2026-08-06  
**Authority:** AMK-Goku  
**Parent order:** [Trust Chain](Z_SANCTUARY_TRUST_CHAIN.md)  
**Requires:** [Citizenship Protocol](Z_REGISTRY_CITIZENSHIP_PROTOCOL.md) · [Steward Gate Logic](Z_STEWARD_GATE_LOGIC.md)  
**Awakens later:** Phase green receipts · stewardship certificates · decision log (precursors, not final schema)

---

## Vision vs verified

| | |
| --- | --- |
| **Vision** | Immutable, linkable receipts for governed actions and decisions. |
| **Verified today** | Human-readable receipts and registries exist; **unified immutable audit schema + crypto chain not sealed**. |

---

## Why third

Only after citizenship and gate logic exist do you know **what evidence must be recorded**.

---

## Candidate fields (design target — not sealed schema)

| Field | Intent |
| --- | --- |
| Receipt ID | Unique id |
| Timestamp | When decided / recorded |
| Request ID | Links to gate request |
| Registry Citizen ID | Actor under Citizenship Protocol |
| AI identity | Display / class |
| Human approver | If applicable |
| Risk level | From gate classification |
| Policy version | Constitution / Mesh edition |
| Decision | Approve / deny / defer / hold |
| Evidence references | Docs · reports · hashes of inputs |
| Models involved | Allowlisted models touched |
| Input fingerprint | Future |
| Output fingerprint | Future |
| Cryptographic hash | Future |
| Signature | Future |
| Previous receipt link | Optional chain |
| Archive location | Where stored |

Exact schema is designed **around** Citizenship + Gate Logic — not before them.

---

## Precursors (do not replace)

- Phase `*_GREEN_RECEIPT.md`  
- `data/z_stewardship_certificate_registry.json`  
- Steward Decision Log  
- Report JSON under `data/reports/`  

---

## Phase plan

| Phase | Goal |
| --- | --- |
| 0 | This outline |
| 1 | Field mapping from precursors → candidate schema |
| 2 | Mock receipt examples (docs/JSON) |
| 3+ | Immutability / hashing — explicit AMK + security gate |

---

*Audit Receipt Structure · outline · third in order*
