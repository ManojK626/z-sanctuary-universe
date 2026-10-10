# Z-Connect — Architecture Decisions v1 (Locked)

**System ID:** Z-CONNECT-1  
**Version:** 1.0  
**Status:** **Locked** — AMK-approved canonical decisions  
**Date:** 2026-07-04  
**Posture:** Merge Hold until architecture review completes · implementation blocked until VILE Phase 2A foundation merges

These decisions are **binding** on all Z-Connect design, contracts, and future implementation unless superseded by an explicit AMK-gated ADR.

---

## Locked decisions

| # | Decision | Meaning |
| - | -------- | ------- |
| 1 | **Architecture before implementation** | Docs and contracts precede runtime; no production code without charter + receipt |
| 2 | **AI as guide, never authority** | AI suggests and explains; users decide and act |
| 3 | **Evidence-based compatibility via preferences** | Matching inputs = user-stated preferences and voluntarily shared information — not pseudoscience |
| 4 | **Entertainment clearly labeled** | Astrology and similar features are optional entertainment — never scientific predictors |
| 5 | **Human approval before production deploy** | GREEN ≠ deploy; AMK gate on launch |
| 6 | **Consent-first design** | Opt-in for every sensitive layer; consent logs when runtime exists |
| 7 | **Privacy and security foundational** | Reuse `zuno-security`, Shadow, DRP, observability — no duplicated engines |
| 8 | **Reuse Z-Sanctuary shared packages** | Extend hub `zuno-*` and orchestrator contracts — do not fork |
| 9 | **Connection Tree branch model** | Major capabilities = separate branches — not one monolithic app ([module branches](Z_CONNECT_MODULE_BRANCHES.md)) |
| 10 | **Connection Confidence over percentages** | Explain insights + confidence per dimension — no “92% compatible” ([detail](Z_CONNECT_CONNECTION_CONFIDENCE.md)) |
| 11 | **Progressive Discovery** | Understanding deepens over time with consent — not one-shot questionnaire truth ([detail](Z_CONNECT_PROGRESSIVE_DISCOVERY.md)) |
| 12 | **AI Constitution v1** | Moral law for every AI interaction ([Z_CONNECT_AI_CONSTITUTION_V1.md](Z_CONNECT_AI_CONSTITUTION_V1.md)) |

---

## Program model (2026-07-04)

| Stream | Effort | Focus |
| ------ | ------ | ----- |
| **A — Foundation** | ~40% | VILE merge · `zuno-drp` · hub backbone |
| **B — Z-Connect prep** | ~60% | Contracts, specs, commercial, legal drafts — no runtime |

See [Z_CONNECT_PROGRAM_STATUS.md](Z_CONNECT_PROGRAM_STATUS.md) · [Z_CONNECT_STREAM_B_PREP_CHARTER.md](Z_CONNECT_STREAM_B_PREP_CHARTER.md)

## Immutable governance rule

> **No AI-generated compatibility insight shall be presented as objective truth.** All insights are probabilistic, preference-based, and intended to help users explore connections — not to make decisions for them.

This rule appears in:

- [Z_CONNECT_SYSTEM_BOUNDARIES.md](Z_CONNECT_SYSTEM_BOUNDARIES.md)  
- [Z_CONNECT_SCIENTIFIC_INTEGRITY.md](Z_CONNECT_SCIENTIFIC_INTEGRITY.md)  
- [Z_CONNECT_CONNECTION_CONFIDENCE.md](Z_CONNECT_CONNECTION_CONFIDENCE.md)  

---

## Permanent doctrines (Phase 1.5 complete — 2026-07-04)

### State transition doctrine

> A state transition changes the status of an experience — not the autonomy of the user. Users remain in control, and governance exists to protect rights, consent, and safety, not to make personal decisions on their behalf.

### Z-Sanctuary reuse principle

> The governance framework is reusable, but each application owns its own domain logic and experience states.

Handbook: [REFERENCE_ARCHITECTURE/06_GOVERNANCE_REFERENCE.md](REFERENCE_ARCHITECTURE/06_GOVERNANCE_REFERENCE.md)

---

## Connection Tree alignment

Z-Connect inherits [Z-Connection Tree Philosophy](../Z-CONNECTION-TREE-PHILOSOPHY.md):

- No leaderboards · no referral pressure · optional presence · delete anytime  
- Branches are **capabilities**, not ranks  

See [Z_CONNECT_MODULE_BRANCHES.md](Z_CONNECT_MODULE_BRANCHES.md).

---

## What remains open (not locked)

- Exact API route catalogue (Phase 1.6 — blocked)  
- Database technology choice (Phase 1.6 — blocked)  
- Premium subscription mechanics (sacred move — separate charter)  
- Sprint 0 code start date — **blocked until** VILE Phase 2A Pkgs 1–3 on `main` + governance gate  

**Phase 1.5 architecture is frozen.** Reference handbook: [REFERENCE_ARCHITECTURE/INDEX.md](REFERENCE_ARCHITECTURE/INDEX.md)

Next deliverables (blocked): [Z_CONNECT_PHASE_1_5_ROADMAP.md](Z_CONNECT_PHASE_1_5_ROADMAP.md)

---

## Approval record

| Gate | Status |
| ---- | ------ |
| Architecture decisions v1 | **Approved** — AMK-Goku, 2026-07-04 |
| Implementation | **Blocked** — Merge Hold |
| Production deploy | **Blocked** — human gate |
