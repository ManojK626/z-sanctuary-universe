# GW-0A — Duplicate and alias report

**Phase:** Golden Website GW-0A
**Posture:** Recommend only. **Do not merge. Do not delete.**
**Date:** 2026-08-27

This report lists **name collisions**, **alias relationships**, **old vs canonical names**, **overlapping modules**, and **Golden Website features that already exist inside Z-Sanctuary**. Steward decides any future collapse.

**Cluster count:** 20 possible-duplicate / alias clusters (below). These are **clusters**, not 20 proven bugs. Existing hub `npm run alias:audit` covers filename aliases separately and was not merged into this list.

## How to read a cluster

| Column | Meaning |
| ------ | ------- |
| Relationship | `ALIAS` (same thing, multiple names/paths) · `OVERLAP` (related surfaces, not proven identical) · `INTENTIONAL_SPLIT` · `TYPO` · `STALE_COPY` |
| Recommendation | Human review only |

## 1. Project names

| Cluster | IDs / names | Relationship | Recommendation |
| ------- | ----------- | ------------ | -------------- |
| Universe 2 dual row | `z-sanctuary-universe-2` and `z-sanctuary-universe-2-continuation` share display name **Z_Sanctuary_Universe 2** | `INTENTIONAL_SPLIT` (hub `universe_2_resolution`: intentional_split_not_merge) | Keep both IDs. Public copy must not present two products named the same. |
| Retired stub | `zsanctuary-universe-stub-retired` (old folder `ZSanctuary_Universe`) vs hub `z-sanctuary-universe` | `ALIAS` / closed successor | Do not revive the stub name on the public site. |
| Hub vs continuation | `z-sanctuary-universe` vs `z-sanctuary-universe-2` | `OVERLAP` | Public narrative: hub = control root; Universe 2 = continuation lab. |
| Pets spelling | `z-sancurary-pets-care-compassion` / folder `Z-Sancurary _Pets Care Compassion` | `TYPO` vs intended Sanctuary | Do not “fix” the ID silently. Flag for Steward rename charter. |

## 2. Registry copies (modules)

| Cluster | Paths | Relationship | Recommendation |
| ------- | ----- | ------------ | -------------- |
| Master vs copies | `data/z_master_module_registry.json` (preferred machine list) vs `data/Z_module_registry.json` vs `docs/z_module_registry.json` vs `data/z_module_manifest.json` | `STALE_COPY` / parallel schemas | Do not mint a fifth list. GW overlay points at the master JSON. |
| Generated index age | `docs/Z_SANCTUARY_MODULE_INDEX.md` dated 2026-05-02 vs current master JSON | `STALE_COPY` risk | Refresh index in a later docs-only slice; do not treat the May index as live counts. |
| Living workspace manifest | `docs/living_workspace_manifest.json` plus package and `releases/2026-01-28/` copies | `ALIAS` copies | Cite docs path as canonical for GW. |

Existing hub alias audit (`data/z_canonical_alias_registry.json`) covers Zuno daily-report filename aliases — keep that machinery; do not duplicate it inside GW.

## 3. Engines appearing twice

| Cluster | Where | Relationship | Recommendation |
| ------- | ----- | ------------ | -------------- |
| Ghost Core | `data/z_core_engines_registry.json` **and** monster registry `ghost_core` | `ALIAS` same ID | GW overlay stored **one** ENGINE row. Keep ID `ghost_core`. |
| Alien Core | Same pattern, ID `alien_core` | `ALIAS` same ID | Same. |
| Engine index vs Master Register “core engines” | Engine JSON has **3** engines; Master Register §4 names a wider engine/system set | `OVERLAP` | Public site must not say “three engines” as if that were the whole Master Register. |

## 4. Q&A systems (inspect as requested)

| Surface | Path / ID | Relationship |
| ------- | --------- | ------------ |
| Z-EAII Knowledge Ask | `dashboard/panels/z-eaii-knowledge-ask.html` · tile `eaii-knowledge-ask` | Working local cite-or-admit UI |
| QADP doctrine | `docs/Z-AI-QADP-QUESTIONS-ANSWERS-DIRECTED-PATHWAYS.md` | Pattern, not a separate product |
| Z-Q&A&RP | `dashboard/z-qa-rp/index.html` · tile `z-qa-rp` | Pathways / DRP UI |
| Cloudflare Ask AI | Contingency docs (`docs/Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md`) | Not daily hub operation |

**Recommendation:** Treat as **one public story** (“grounded questions with citations and human gates”) with **internal aliases**, not four products. Do not merge code in GW-0A.

## 5. Screenshot / visual systems

| Surface | Relationship | Recommendation |
| ------- | ------------ | -------------- |
| `docs/Z-AUTO-SCREENSHOTS-SOUNDS-DETECTORS.md` | Consent-first **game** capture doctrine (`CONCEPT`) | Not a Golden Website screenshot gallery |
| Living-workspace Harisha / overlay JS | Operator automation overlays | Private |
| ICIS visual fixtures (4 files under `data/z_icis_*`) | Scientific plates, `DO_NOT_PUBLISH` | Do not reuse as marketing shots |
| Dashboard HTML “looks like mockups” | 62 HTML files; almost no PNG mockup library in docs/dashboard/data | Public mockup set is a **gap** |

## 6. Canvas / map systems

| Surface | Relationship |
| ------- | ------------ |
| HODP Z Blueprint (inside `index-skk-rkpk.html`) | Operator control canvas |
| Universal Canvas lite | `dashboard/panels/z_uccr_universal_canvas_lite.html` |
| Magical Canvas PlayKit | Monster id `magical_canvas_playkit` |
| Living Ecosphere Map | `dashboard/Html/z-universe-ecosphere-map.html` · catalog `zmv_ecosphere_map_readonly` |
| Biology map (doctrine metaphor) | `docs/Z_SANCTUARY_ECOSYSTEM_BIOLOGY_MAP.md` |
| Monster project master map | `docs/Z_SANCTUARY_MONSTER_PROJECT_MASTER_MAP.md` |
| Crystal DNA map panel | `dashboard/panels/z-crystal-dna-map.html` |
| AMK-Goku Main Control Map | `dashboard/Html/amk-goku-main-control.html` (AMK-MAP-1 sealed) |
| Universe census / discovery receipts | Dashboard docs under `docs/dashboard/` |

**Recommendation:** Golden Website needs **one public map metaphor**. Internally these are complementary, not duplicates to delete.

## 7. Commercial / benchmark / investor systems

| Surface | Relationship | Recommendation |
| ------- | ------------ | -------------- |
| `docs/COMMERCIAL-READINESS.md` | Go-live **checklist** | Not a store |
| `docs/pricing-and-benchmarks.md` | Evidence doctrine for Z-SUSBV; **does not set prices** | Do not publish numbers |
| SUSBV receipts | `docs/commercial/PHASE_ZSUSBV_*` | Advisory only |
| `docs/Z-ECOSYSTEM-CAUSE-EFFECT-MARKET-MAP.md` | Market narrative | Data-room class |
| `docs/Z-STAKEHOLDERS-AND-BUSINESS-AI.md` | Vision: payment gateway, Business/HR/Financials/Joker AIs | `CONCEPT` — not live commercial |
| WorkSphere marketplace hub | PC-root `z-worksphere-marketplace-hub` | `MARKETPLACE` + `POTENTIAL_NOT_VALIDATED` |
| Entitlement catalog | `data/z_service_entitlement_catalog.json` | Capability ≠ billing |

**Recommendation:** One public line: “commercial lanes are not live; benchmarks are evidence-gated.” Do not merge these docs.

## 8. Evidence / verification systems

| Surface | Role |
| ------- | ---- |
| Green receipts (`PHASE_*` / `GREEN_RECEIPT`) | Slice seals — 166 receipt-like files inventoried |
| AAFRTC | Hub full-verify pipeline |
| Execution enforcer / `manual_release` | Release governance — not a public badge |
| Monster registry verify | `npm run z:monster:registry-verify` |
| Dashboard registry verify | `npm run dashboard:registry-verify` |
| Alias audit | `npm run alias:audit` |
| Data-leak audit | `npm run security:data-leak-audit` |

**Recommendation:** Public “verified” language is dangerous. GW-0A uses no `VERIFIED` overlay rows.

## 9. Possible Golden Website features already present

These hub surfaces already cover stories a Golden Website might want. **Reuse after sanitization; do not rebuild in parallel.**

| Public-facing story (future) | Already in Z-Sanctuary |
| --------------------------- | ---------------------- |
| Organism / map of the universe | Navigator, ecosphere HTML, monster map, biology map |
| Ask the sanctuary | Knowledge Ask, QADP, Z-Q&A&RP |
| Morning / operations status | SSWS Morning Cockpit |
| Ethics / DRP | 14 DRP docs, GGAESP monster + formula overlay |
| Commercial honesty | COMMERCIAL-READINESS + pricing doctrine |
| Steward / creator compass | AMK-Goku Main Control Map, Steward AI charter (no runtime) |
| Scientific public-benefit (insects) | Z-ICIS — **private / do not publish as live AI** |

## 10. Formula / ethics aliases

| Cluster | Recommendation |
| ------- | -------------- |
| Monster `ggaesp_360` vs overlay `ZS-FORMULA-003` | Temporary formula ID pending canonical review — **do not ship both names** |
| Ω formula vs “Z-Mega / QOSMEI” ecosphere language | Overlap in narrative; keep one public explanation |
| Bee Vision catalog vs ICIS closed runtime | Monster id `bee_vision` remains in the catalog; ICIS Bee Vision / ICIS-4 stay **CLOSED**. Public site must not imply a live vision product. |
| Zuno report filenames | `data/z_canonical_alias_registry.json` already aliases daily vs system state reports. Do not add a GW-only third filename. |

## Steward actions (not executed)

1. Choose public names for Universe 2 vs hub.
2. Choose one public Q&A name.
3. Choose one public map/canvas name.
4. Decide whether `ZS-*-###` temporary IDs become permanent or fold into existing IDs.
5. Do **not** auto-merge module JSON copies.

GW-1 remains closed until Steward approval.
