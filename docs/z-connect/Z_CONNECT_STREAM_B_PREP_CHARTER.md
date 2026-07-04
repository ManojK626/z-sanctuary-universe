# Z-Connect — Stream B Preparation Charter

**Purpose:** Parallel work that **does not require runtime code** — so Z-Connect can enter Sprint 0 immediately when the VILE Phase 2A foundation merge gate clears.

**Owner:** AMK-Goku  
**Date:** 2026-07-04  
**Posture:** Docs, specs, copy, and design artifacts only · **Merge Hold** on Stream A unchanged

---

## Program balance (AMK directive)

| Stream | Effort target | Focus |
| ------ | ------------- | ----- |
| **A — Z-Sanctuary Foundation** | ~40% | VILE Pkgs 1–3 merge · `zuno-drp` · hub governance |
| **B — Z-Connect preparation** | ~60% | Product, commercial, and legal readiness without runtime |

Stream B **must not** bypass Stream A gates for code, deploy, payments, or production APIs.

---

## Stream A recap (unchanged)

1. Keep Merge Hold  
2. Finish VILE package review  
3. Merge Packages 1–3 to `main`  
4. Verify `main` green  
5. Implement `@z-sanctuary/zuno-drp` from [charter](../vile/PHASE_2A_PACKAGE_4_ZUNO_DRP_CHARTER.md)  

Stream A = long-term backbone for every future project.

---

## Stream B deliverables

Each item is a **document or spec** until Sprint 0 is chartered. Status: **Not started** unless noted.

### Technical architecture (no server code)

| # | Deliverable | Planned location | Depends on runtime? |
| - | ----------- | ---------------- | ------------------- |
| B1 | Domain contracts (JSON Schema v1) | [platform-contracts/](platform-contracts/) | No — **Complete** |
| B2 | API specifications (OpenAPI / spec-only) | `docs/z-connect/api/v1/` | No |
| B3 | Database logical model (privacy + consent) | `docs/z-connect/data/Z_CONNECT_LOGICAL_SCHEMA_v1.md` | No |
| B4 | User journey maps | `docs/z-connect/journeys/` | No |
| B5 | Technical backlog (epics → Sprint 0 scope) | `docs/z-connect/Z_CONNECT_TECHNICAL_BACKLOG.md` | No |

Detail: [Z_CONNECT_PHASE_1_5_ROADMAP.md](Z_CONNECT_PHASE_1_5_ROADMAP.md)

### Product & experience (no app code)

| # | Deliverable | Planned location | Depends on runtime? |
| - | ----------- | ---------------- | ------------------- |
| B6 | UX wireframes (low-fi) | `docs/z-connect/design/wireframes/` | No |
| B7 | Product roadmap (v1 → v2) | `docs/z-connect/Z_CONNECT_PRODUCT_ROADMAP.md` | No |
| B8 | AI Constitution v1 | [Z_CONNECT_AI_CONSTITUTION_V1.md](Z_CONNECT_AI_CONSTITUTION_V1.md) | **Done** |

### Brand & go-to-market (no deploy)

| # | Deliverable | Planned location | Depends on runtime? |
| - | ----------- | ---------------- | ------------------- |
| B9 | Branding guidelines (name, tone, visual direction) | `docs/z-connect/brand/` | No |
| B10 | Landing page copy (draft) | `docs/z-connect/marketing/LANDING_PAGE_COPY.md` | No |
| B11 | Marketing roadmap | `docs/z-connect/marketing/Z_CONNECT_MARKETING_ROADMAP.md` | No |
| B12 | Investor pitch outline | `docs/z-connect/commercial/INVESTOR_PITCH_OUTLINE.md` | No |

### Commercial & legal (HOLD until human/legal review)

| # | Deliverable | Planned location | Gate |
| - | ----------- | ---------------- | ---- |
| B13 | Pricing strategy (hypothesis) | `docs/z-connect/commercial/PRICING_STRATEGY.md` | AMK + team |
| B14 | First revenue milestone | [Z_CONNECT_COMMERCIAL_MILESTONE.md](Z_CONNECT_COMMERCIAL_MILESTONE.md) | AMK |
| B15 | Privacy policy (draft) | `docs/z-connect/legal/PRIVACY_POLICY_DRAFT.md` | Legal review |
| B16 | Terms of service (draft) | `docs/z-connect/legal/TERMS_OF_SERVICE_DRAFT.md` | Legal review |

**Sacred moves:** live payments, public launch, and legal publication require AMK gate — drafts are preparation only.

---

## Sequencing (recommended)

```text
Week 1–2 (Stream B priority)
  → B8 AI Constitution ✅
  → B14 Commercial milestone framing
  → B1 Domain contracts (profile, consent, insight)
  → B4 User journeys (onboarding + Connection Confidence)

Week 2–4
  → B2 API specs · B3 logical schema
  → B6 Wireframes · B10 Landing copy
  → B13 Pricing hypothesis · B7 Product roadmap

Week 4+
  → B11 Marketing · B12 Investor outline
  → B15–B16 Legal drafts (mark DRAFT — not for publication)
  → B5 Technical backlog → Sprint 0 charter (when Stream A gate clears)
```

---

## Gates before Sprint 0 code

| Prerequisite | Stream |
| ------------ | ------ |
| Architecture decisions v1 locked | B ✅ |
| AI Constitution v1 locked | B ✅ |
| Domain contracts v1 draft | B |
| VILE Pkgs 1–3 on `main` | A |
| Merge Hold released for Sprint 0 | AMK |
| B1–B4 minimum complete | B (recommended) |

---

## Out of scope for Stream B

- Production API deployment  
- Payment provider integration  
- User database provisioning  
- App store submission  
- Marketing spend  

---

## Related

- [README.md](README.md)  
- [Z_CONNECT_PROGRAM_STATUS.md](Z_CONNECT_PROGRAM_STATUS.md)  
- [PHASE_2A_FOUNDATION_INTEGRATION_REPORT.md](../vile/PHASE_2A_FOUNDATION_INTEGRATION_REPORT.md)
