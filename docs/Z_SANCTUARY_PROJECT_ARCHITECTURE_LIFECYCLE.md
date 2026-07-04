# Z-Sanctuary — Project Architecture Lifecycle

**Version:** 1.0  
**Status:** **Canonical doctrine** — AMK-approved 2026-07-04  
**Origin:** Z-Connect Phase 1.5 completion  
**Posture:** Reusable for every future Z-Sanctuary initiative · no runtime implied

---

## Purpose

Establish a **permanent, disciplined lifecycle** for every project in the Z-Sanctuary Universe — from vision through architecture freeze, human approval, and deliberate implementation.

Z-Connect Phase 1.5 is the **reference exemplar**. Future projects (ZILWA, Compassion Platform, Z-Legal, Zuno Intelligence, and others) follow the same shape with **their own** domain logic and experience states.

---

## The lifecycle

```text
🌱 Vision
  ↓
🏛️ Constitution (moral / AI law where applicable)
  ↓
🧭 Architecture Decisions (locked ADRs)
  ↓
📦 Domain Contracts        — What data exists?
  ↓
🤝 Interaction Contracts   — How do participants interact?
  ↓
🔄 Experience State Contracts — How do experiences evolve?
  ↓
📚 Reference Handbook      — Curated tie-together (no new layers)
  ↓
========================
🔒 ARCHITECTURE FREEZE
========================
  ↓
👀 Architecture Review
  ↓
✅ Human Approval (AMK gate)
  ↓
⚙️ Implementation (Phase 1.6+ / Sprint 0)
  ↓
🧪 Verification
  ↓
🚀 Deployment Review
  ↓
👤 Final Human Authorization
```

---

## Layer questions (separation of concerns)

| Layer | Question answered |
| ----- | ----------------- |
| Vision | Why are we building this? |
| Constitution | What moral law governs behaviour (especially AI)? |
| Architecture Decisions | What is locked vs open? |
| Domain Contracts | What exists? |
| Interaction Contracts | How do things interact? |
| Experience State Contracts | How do experiences evolve over time? |
| Reference Handbook | Where is everything tied together? |

**Do not add contract layers after the freeze** without an AMK-gated ADR.

---

## Architecture freeze rules

When a project reaches **ARCHITECTURE FREEZE**:

1. **No new contract layers** — consolidation only (handbook, cross-walks, ADRs)  
2. **No runtime code** until human approval opens the implementation gate  
3. **Merge Hold** remains until review completes  
4. **GREEN ≠ deploy** — receipts are architecture signals, not launch permission  
5. **Sacred moves** (payments, launch, child data, bulk actions) always require AMK gate  

Closing posture: **Freeze. Protect. Review. Build deliberately.**

---

## Three permanent rules (AMK — Universe Resolution 2026-07-04)

Canonical resolution: [Z_SANCTUARY_UNIVERSE_RESOLUTION_2026_07_04.md](Z_SANCTUARY_UNIVERSE_RESOLUTION_2026_07_04.md)

### Rule 1 — Freeze means freeze

Once architecture is **FROZEN**, changes occur only through a documented **ADR** approved through governance. No silent edits to locked layers.

### Rule 2 — Shared foundations first

Infrastructure, governance, and reusable packages mature **before** application runtime depends on them. Current critical path: VILE Track A (Pkgs 1–3 merge · `zuno-drp` · verify `main`).

### Rule 3 — Commercial work continues

Parallel non-runtime work (strategy, UX, branding, legal drafts, marketing, community) may continue while engineering waits behind Merge Hold — without bypassing technical governance.

---

## Z-Sanctuary reuse principle

> The governance framework is reusable, but each application owns its own domain logic and experience states.

| Shared across projects | Owned per project |
| ---------------------- | ----------------- |
| DRP, Shadow, Security, Observability patterns | Domain schemas |
| Gate taxonomy (Consent · Security · DRP · Shadow · Human) | Interaction flows |
| 14 DRP law · Merge Hold discipline | Experience state machines |
| This lifecycle | Business logic · UX · copy |

No shared runtime without explicit charter + 14 DRP gate.

---

## State transition doctrine

> A state transition changes the status of an experience — not the autonomy of the user. Users remain in control, and governance exists to protect rights, consent, and safety, not to make personal decisions on their behalf.

---

## Reference exemplar — Z-Connect Phase 1.5

| Layer | Status | Location |
| ----- | ------ | -------- |
| Vision | Locked | [z-connect/Z_CONNECT_MASTER_BUILD_CHARTER.md](z-connect/Z_CONNECT_MASTER_BUILD_CHARTER.md) |
| AI Constitution | Locked | [z-connect/Z_CONNECT_AI_CONSTITUTION_V1.md](z-connect/Z_CONNECT_AI_CONSTITUTION_V1.md) |
| Scientific Integrity | Locked | [z-connect/Z_CONNECT_SCIENTIFIC_INTEGRITY.md](z-connect/Z_CONNECT_SCIENTIFIC_INTEGRITY.md) |
| Architecture Decisions | Locked | [z-connect/Z_CONNECT_ARCHITECTURE_DECISIONS_V1.md](z-connect/Z_CONNECT_ARCHITECTURE_DECISIONS_V1.md) |
| Domain Contracts | Locked | [z-connect/platform-contracts/](z-connect/platform-contracts/) |
| Interaction Contracts | Locked | [z-connect/interaction-contracts/](z-connect/interaction-contracts/) |
| Experience State Contracts | Locked | [z-connect/experience-state-contracts/](z-connect/experience-state-contracts/) |
| Reference Handbook | Locked | [z-connect/REFERENCE_ARCHITECTURE/](z-connect/REFERENCE_ARCHITECTURE/) |

**Formal status:** COMPLETE · FROZEN · READY FOR ARCHITECTURE REVIEW (AMK, 2026-07-04)

Future baseline ADR (when prototype exists): [FUTURE_ADR_Z_CONNECT_V1_BASELINE.md](z-connect/REFERENCE_ARCHITECTURE/FUTURE_ADR_Z_CONNECT_V1_BASELINE.md)

---

## Critical path after freeze (hub-wide)

When a product architecture freezes, **engineering priority returns to the shared foundation** before application implementation:

| Track | Priority | Focus |
| ----- | -------- | ----- |
| **A — Foundation** | Highest | VILE Pkgs 1–3 merge · `zuno-drp` implementation · verify `main` |
| **B — Product prep** | Paused (architecture) | Commercial assets, legal drafts — no new architecture layers |
| **Product Phase 1.6+** | Blocked | OpenAPI, logical DB, Sprint 0 — only after Track A gate |

VILE reference: [vile/PHASE_2A_FOUNDATION_INTEGRATION_REPORT.md](vile/PHASE_2A_FOUNDATION_INTEGRATION_REPORT.md)

---

## Adoption checklist (new project)

- [ ] Vision charter + boundaries  
- [ ] Constitution / integrity docs (if AI or sensitive data)  
- [ ] Architecture decisions v1 locked  
- [ ] Domain contracts  
- [ ] Interaction contracts  
- [ ] Experience state contracts  
- [ ] Reference handbook  
- [ ] Architecture freeze declared  
- [ ] Human architecture review  
- [ ] Implementation gate opened intentionally  

Pattern for ESC: [z-connect/experience-state-contracts/ESC_REUSABLE_PATTERN.md](z-connect/experience-state-contracts/ESC_REUSABLE_PATTERN.md)

---

## Related

- [Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md](Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md)  
- [Z-NEW-MODULE-DISCIPLINE.md](Z-NEW-MODULE-DISCIPLINE.md)  
- [z-connect/Z_CONNECT_PROGRAM_STATUS.md](z-connect/Z_CONNECT_PROGRAM_STATUS.md)  
- [AI_BUILDER_CONTEXT.md](AI_BUILDER_CONTEXT.md)

---

## Approval record

| Gate | Status |
| ---- | ------ |
| Lifecycle doctrine v1 | **Approved** — AMK-Goku, 2026-07-04 |
| Z-Connect Phase 1.5 | **COMPLETE · FROZEN · READY FOR ARCHITECTURE REVIEW** |
| Universe Resolution 2026-07-04 | **Accepted** — canonical hub posture |
