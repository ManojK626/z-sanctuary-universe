# Phase 2.3B — AT Love Zebra / Z-Zebras Family

## Purpose

**Z-Zebras Family** is the friendly **inspector + designer + accessibility + service-readiness** layer for Z-QUESTRA (and eventually reusable across Z-Sanctuary). One family, **unique stripes**: every user seen differently, protected equally — **readiness and kindness first**, not scary compliance theatre.

## Core idea (four minds metaphor)

| Mind | Zebra lane |
| -------------------- | ---------------------------------- |
| Inspector | Z-Inspector, Z-Access, Z-DRP |
| Designer | AT Love Zebra, Z-Designer |
| Coding / performance | Z-Code, Z-Performance |
| Service architect | Z-Service (gated), readiness cards |

## What ships in 2.3B

| Layer | Detail |
| ------------ | --------------------------------------------------------------------------------- |
| Comfort Zone | **Z Toolset Comfort Zone** wraps Comfort bar + Z-Zebras panel |
| Tokens | `zebraFamilyTokens.js` — amber, aqua, mint, violet, rose, leaf, gold, deep blue |
| Metadata | `zebraServiceMap.js` — roles, readiness cards, roadmap tags (informational) |
| UI | `ZZebrasFamilyPanel.jsx`, `ZebraInspectorCard.jsx`, `ZebraReadinessChecklist.jsx` |

## Certification / standards language

We track **readiness** and **roadmap labels** only. References for operators (not claims):

| Topic | Reference |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| WCAG 2.2 | [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) |
| European Accessibility Act | [European Commission — accessibility](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en) |
| EN 301 549 | [AccessibleEU — EN 301 549](https://accessible-eu-centre.ec.europa.eu/content-corner/digital-library/en-3015492021-accessibility-requirements-ict-products-and-services_en) |
| AI governance | [ISO/IEC 42001](https://www.iso.org/standard/42001) |
| Security management | [ISO/IEC 27001](https://www.iso.org/standard/27001) |
| SOC 2 | [AICPA — SOC for service organizations](https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2) |
| Children’s privacy (US context) | [FTC COPPA rule](https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa) |

**We do not state certification.** Official certification requires qualified external review.

## Forbidden (this phase)

Backend, auth, new cloud persistence, LLM analysis, email/API/calendar sync, voice, analytics, payments, live Z-Sanctuary runtime bridge, claims of WCAG/ISO/SOC compliance.

## Acceptance

`npm test` passes; panel visible under Comfort Zone; gated Service zebra clearly marked; disclaimer visible.
