# Phase 1.5 B1 — Architecture Report

**Project:** Z-Connect · Domain Contracts  
**Date:** 2026-07-04  
**Authority:** AMK-approved master instruction  
**Posture:** Architecture only · Merge Hold · Runtime NOT AUTHORIZED

---

## 1. Executive summary

Phase 1.5 B1 delivers the **canonical language** of Z-Connect: **61 JSON Schema (draft 2020-12) files** across **11 domains**, **5 non-executable examples**, versioning and change policy, dependency map, and validation script.

All contracts comply with **AI Constitution v1** and **Scientific Integrity** — no compatibility percentages, destiny scores, or brain-ranking fields.

**Signal:** GREEN for architecture review. **No API, database, auth, UI, or deployment** in this phase.

---

## 2. Folder structure

```text
docs/z-connect/platform-contracts/
├── README.md
├── VERSIONING.md
├── CHANGE_POLICY.md
├── CONTRACT_INVENTORY.md
├── DEPENDENCY_MAP.md
├── PHASE_1_5_B1_ARCHITECTURE_REPORT.md
├── PHASE_1_5_B1_GREEN_RECEIPT.md
├── scripts/
│   ├── generate_schemas.mjs
│   └── validate_contracts.mjs
├── examples/                    (5 fixtures)
├── common/schemas/v1/
├── user/schemas/v1/               (8)
├── connection/schemas/v1/       (5)
├── ai/schemas/v1/               (8)
├── consent/schemas/v1/          (6)
├── messaging/schemas/v1/        (6)
├── family/schemas/v1/           (5)
├── subscription/schemas/v1/     (5)
├── moderation/schemas/v1/       (5)
├── governance/schemas/v1/       (5)
└── discovery/schemas/v1/        (7)
```

---

## 3. Contract inventory

See [CONTRACT_INVENTORY.md](CONTRACT_INVENTORY.md) — **60 domain contracts + 1 definitions bundle**.

Key design choices:

- **Connection Confidence** via `confidence` enum — not numeric scores  
- **AI artifacts** require explanation + limitations + disclaimer pattern  
- **Entertainment interests** require `entertainment_not_scientific` label  
- **Dream Baby Studio** mandatory entertainment disclaimer const  
- **Subscription** schemas marked HOLD for payment runtime  

---

## 4. Dependency diagram

See [DEPENDENCY_MAP.md](DEPENDENCY_MAP.md) — mermaid master diagram.

**Finding:** Acyclic v1 graph · common definitions root · consent precedes AI and shared family features.

---

## 5. Validation results

```bash
node docs/z-connect/platform-contracts/scripts/validate_contracts.mjs
```

| Check | Result |
| ----- | ------ |
| Schema JSON parse | 61/61 PASS |
| Example JSON parse | 5/5 PASS |
| `_non_executable` on examples | 5/5 PASS |
| Forbidden keys scan | PASS |
| Runtime code in platform-contracts | None (scripts are docs tooling only) |
| Duplicate model IDs | None |
| Circular `$ref` | None in v1 |

---

## 6. Risks

| Risk | Mitigation |
| ---- | ---------- |
| AJV not run on schemas yet | Phase 1.6 or package-layer validator |
| Cross-file `$ref` resolution | Full resolver in implementation phase |
| `ValidationResult` name collision with hub packages | Namespace imports at integration |
| Legal copy not in contracts | Separate Stream B legal drafts |
| Subscription HOLD drift | Sacred gate before payment fields expand |

---

## 7. Recommendations

1. Human review this PR under Merge Hold  
2. Complete Stream A VILE merge (Pkgs 1–3) in parallel  
3. Charter **Phase 1.6** for API specs + logical DB model only after B1 approval  
4. Add AJV validation package in Sprint 0 — not in B1  
5. Begin Stream B user journey maps using these contract names  

---

## 8. Future Phase 1.6 preparation

| Deliverable | Blocked until |
| ----------- | ------------- |
| OpenAPI v1 specs | B1 merge + AMK gate |
| Logical database schema doc | B1 merge |
| Contract → TypeScript codegen | VILE foundation on `main` |
| Sprint 0 implementation charter | Stream A + B1 gates |

---

## 9. Known limitations

- No per-field encryption specs (implementation)  
- No rate-limit or auth headers (API phase)  
- Messaging and subscription are structural only — no send/pay runtime  
- Generator script is maintainer tooling — committed schemas are source of truth  
- Domain README per folder summarized in CONTRACT_INVENTORY (not 60 micro-docs)  

---

## 10. Compliance checklist

| Requirement | Met |
| ----------- | --- |
| Technology neutral JSON Schema | Yes |
| Versioned (`v1`) | Yes |
| Privacy-first / consent-first | Yes |
| AI Constitution | Yes |
| Scientific integrity | Yes |
| No `percentCompatible` | Yes |
| No runtime / API / DB / auth / deploy | Yes |

**STOP — Await human approval before Phase 1.6.**
