# Z-Connect — Phase 1.5 Roadmap (Next Architectural Deliverables)

**Status:** Planned · **no implementation** until Merge Hold architecture review completes and VILE Phase 2A foundation is on `main`  
**Owner:** AMK-Goku

---

## Gate before any deliverable

| Prerequisite | Required |
| ------------ | -------- |
| Z-Connect charter docs reviewed | Yes |
| Architecture Decisions v1 approved | Yes (2026-07-04) |
| VILE Phase 2A Pkgs 1–3 merged to `main` | Pending |
| VILE `zuno-drp` implementation (Pkg 4) | Recommended before Z-Connect runtime |
| Merge Hold released for Z-Connect Phase 1.5 | AMK gate |

---

## Deliverable 1 — Domain contracts — **COMPLETE (B1)**

**Status:** Done · 2026-07-04 · [platform-contracts/README.md](platform-contracts/README.md)

61 JSON Schema files across 11 domains. Validation:

```bash
node docs/z-connect/platform-contracts/scripts/validate_contracts.mjs
```

Reports: [PHASE_1_5_B1_ARCHITECTURE_REPORT.md](platform-contracts/PHASE_1_5_B1_ARCHITECTURE_REPORT.md) · [PHASE_1_5_B1_GREEN_RECEIPT.md](platform-contracts/PHASE_1_5_B1_GREEN_RECEIPT.md)

---

## Deliverable 1.5 — Interaction contracts — **COMPLETE (B1.5)**

**Status:** Done · 2026-07-04 · [interaction-contracts/README.md](interaction-contracts/README.md)

11 behavioural flow specifications with sequence and state diagrams. No executable code.

Reports: [PHASE_1_5_B1_5_ARCHITECTURE_REPORT.md](interaction-contracts/PHASE_1_5_B1_5_ARCHITECTURE_REPORT.md) · [PHASE_1_5_B1_5_GREEN_RECEIPT.md](interaction-contracts/PHASE_1_5_B1_5_GREEN_RECEIPT.md)

Parallel commercial track: [Z_CONNECT_COMMERCIAL_PREP_ASSETS.md](Z_CONNECT_COMMERCIAL_PREP_ASSETS.md)

---

## Deliverable 1.6 — Experience state contracts — **COMPLETE (B1.6)**

**Status:** Done · 2026-07-04 · [experience-state-contracts/README.md](experience-state-contracts/README.md)

7 authoritative state machines with governance-gated transitions, plus a reusable Z-Sanctuary pattern spec. No executable code.

Reports: [PHASE_1_5_B1_6_ARCHITECTURE_REPORT.md](experience-state-contracts/PHASE_1_5_B1_6_ARCHITECTURE_REPORT.md) · [PHASE_1_5_B1_6_GREEN_RECEIPT.md](experience-state-contracts/PHASE_1_5_B1_6_GREEN_RECEIPT.md)

---

## Deliverable 2 — API specifications

**Goal:** OpenAPI or equivalent **spec-only** docs for core services — no server implementation in Phase 1.5.

| Service group | Illustrative scope |
| ------------- | ------------------ |
| Profile | CRUD user-approved profile; export/delete |
| Discovery | Journey session start/pause/approve-summary |
| Insights | Generate Connection Confidence narratives (read-only compute) |
| Consent | Log and query consent records |
| Messaging | **Stub only** — routes documented, runtime Phase 2B+ |

**Posture:** Every route documents DRP category + Shadow requirement (if AI).

**Location (planned):** `docs/z-connect/api/v1/`

---

## Deliverable 3 — Database schema (privacy-first)

**Goal:** Logical schema with consent and privacy built in — **not** production migration scripts until chartered.

| Area | Design requirements |
| ---- | ------------------- |
| Profile | Versioned rows; soft delete; user export |
| Consent | Append-only log; withdrawal marks |
| Journey | Encrypted-at-rest note (implementation phase); retention policy field |
| Insights | Immutable generated records + source field refs |
| PII minimization | No astrology in primary matching tables by default |

**Location (planned):** `docs/z-connect/data/Z_CONNECT_LOGICAL_SCHEMA_v1.md`

---

## Deliverable 4 — User journey maps

**Goal:** Onboarding → Discovery → Connection Confidence → premium (**HOLD**) — diagrams + copy guardrails.

| Journey | Doc focus |
| ------- | --------- |
| Day 1 onboarding | Consent screens, initial profile |
| Week 1 Discovery Journey | Optional depth |
| First insight view | Connection Confidence UI patterns |
| Progressive review | Month 1 approval flow |
| Premium / subscription | **HOLD** — legal + AMK gate |

**Location (planned):** `docs/z-connect/journeys/`

---

## Deliverable 5 — Sprint 0 implementation package

**Goal:** Cursor-ready **charter** for first code sprint — **not** started until gates above clear.

Sprint 0 scope (planned — subject to AMK trim):

- Monorepo package skeleton (`packages/z-connect-*` or app folder — TBD in Sprint 0 charter)  
- Wire **read-only** profile mock against contracts  
- Unit tests for contract validation only  
- No production deploy · no payments · no messaging send  

**Output:** `docs/z-connect/SPRINT_0_IMPLEMENTATION_CHARTER.md` + GREEN_RECEIPT when sprint completes.

---

## Sequencing

```text
Phase 1     ✅ Charter + locked decisions
Phase 1.5   ✅ Domain (B1) → ✅ Interaction (B1.5) → ✅ Experience State (B1.6)
Phase 1.6   → OpenAPI + logical schema + reference architecture (blocked — await B1.6 review)
Phase 1.5+  → Journey maps + commercial assets (parallel)
Sprint 0    → First code (blocked until VILE 2A on main + AMK release)
Phase 2B+   → Read-only API / mock UI
```

---

## Related

- [Z_CONNECT_ARCHITECTURE_DECISIONS_V1.md](Z_CONNECT_ARCHITECTURE_DECISIONS_V1.md)  
- [vile/platform-contracts/](../vile/platform-contracts/) — pattern reference  
- [PHASE_2A_FOUNDATION_INTEGRATION_REPORT.md](../vile/PHASE_2A_FOUNDATION_INTEGRATION_REPORT.md)
