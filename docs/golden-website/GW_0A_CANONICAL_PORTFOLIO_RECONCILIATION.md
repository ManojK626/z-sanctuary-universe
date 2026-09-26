# GW-0A — Canonical portfolio reconciliation

**Phase:** Golden Website GW-0A
**Mode:** Turtle · evidence-first · reconciliation only
**Date:** 2026-08-27
**Overlay:** [data/golden-website/gw_portfolio_registry.json](../../data/golden-website/gw_portfolio_registry.json)

This document is the **policy** for the first Golden Website reconciliation layer. It does **not** launch a public site.

## Mission lock

GW-0A inventories and maps existing Z-Sanctuary Universe projects, modules, engines, AI systems, formulas, HTML prototypes, visuals, receipts, commercial pathways, public-benefit roles, and dependencies.

| Forbidden in GW-0A | Status |
| ------------------ | ------ |
| Public Golden Website UI | Not built |
| Deploy / Cloudflare production bind | Not done |
| Private-data exposure | Not done |
| Autonomous runtime | Not added |
| Duplicate canonical registries | Overlay only |
| Destructive cleanup / silent rename | Not done |
| GW-1 Public Knowledge Twin | **Blocked** until Steward approval |

## Doctrine preserved

- federation ≠ authority
- topology ≠ ownership
- observe → verify → suggest → human decides
- readiness ≠ deploy
- organization ≠ control
- layered tools ≠ the soul

## Overlay, not authority

Existing registries remain the **source of truth** for their own IDs:

| Layer | Canonical file |
| ----- | -------------- |
| PC-root projects | `data/z_pc_root_projects.json` |
| Master modules | `data/z_master_module_registry.json` |
| Monster cores | `data/z_sanctuary_monster_project_registry.json` |
| Core engines | `data/z_core_engines_registry.json` |
| Dashboard tiles | `data/z_mdg_dashboard_registry.json` |
| Navigator catalog | `dashboard/data/z_universe_service_catalog.json` |

`gw_portfolio_registry.json` **adds** Golden Website fields. It does **not** replace those files. Where a system already has an ID, GW-0A reuses it. Temporary IDs use the `ZS-*-###` prefixes and `"id_status": "TEMPORARY_PENDING_CANONICAL_REVIEW"`.

## Path discoveries (do not fork)

| Requested in brief | Actual / discovery |
| ------------------ | ------------------ |
| `docs/Z_FULL_BUILD_CHECKLIST.md` | `docs/Z-FULL-BUILD-CHECKLIST.md` |
| `data/z_module_registry.json` | Prefer `data/z_master_module_registry.json`. Copies/aliases exist — see [GW_0A_DUPLICATE_AND_ALIAS_REPORT.md](GW_0A_DUPLICATE_AND_ALIAS_REPORT.md) |
| `living_workspace_manifest.json` | Canonical: `docs/living_workspace_manifest.json` (package/release copies exist) |
| Module index | `docs/Z_SANCTUARY_MODULE_INDEX.md` (generated 2026-05-02 — treat as near-canonical, possibly stale) |

Inspected first (human + overlay builder): Master Register, module/engine/monster maps, biology map, Full Build Checklist, commercial/pricing/market/stakeholder docs, QADP, auto-screenshots, GitHub integration, module JSON, living workspace manifest, green receipts, HTML/dashboard prototypes, ICIS visual fixtures.

## Evidence classification (exact)

Use **exactly** one of:

| State | Meaning in GW-0A |
| ----- | ---------------- |
| `VERIFIED` | Public-facing, independent verification of the **Golden Website claim**. **Unused in this phase.** Existence on disk is not VERIFIED. |
| `SEALED` | A named green receipt or sealed scientific/governance packet exists for **that slice**. Sealed ≠ public-safe. |
| `QUALIFIED` | Hub implementation, registry row, or working local UI exists, but public proof is incomplete. |
| `CONCEPT` | Doctrine, vision, or planned stub. |
| `HOLD` | Safety hold, missing path, money/identity/health adjacency, or steward pin-hold. |
| `CLOSED` | Retired, or explicitly closed (example: Bee Vision runtime / ICIS-4). |

Never infer `VERIFIED` from existence alone. A working frontend is not proof that the backend capability exists.

## Economic classification (exact)

Use **one or more** of: `DIRECT_PRODUCT`, `PLATFORM_REVENUE`, `MARKETPLACE`, `ENTERPRISE_B2B`, `RESEARCH_IP`, `ENABLER`, `PUBLIC_BENEFIT`, `EXPERIMENTAL`.

Do not claim revenue where no evidence exists. Default commercial marker:

`"commercial_status": "POTENTIAL_NOT_VALIDATED"`

`NOT_COMMERCIAL` is used only when the row is explicitly non-revenue (formulas, receipt corpus, vault).

GW-0A assigned **zero** `DIRECT_PRODUCT` rows. No live billing lane was evidenced.

## Prototype classification (exact)

For HTML/dashboard prototypes: `WORKING` | `PARTIAL` | `SIMULATED` | `CONCEPT` | `PRIVATE`.

`WORKING` means the local page loads and behaves as a frontend. It does **not** mean production backend, payments, or public edge.

## Public exposure classification (exact)

`PUBLIC_SAFE` | `PUBLIC_AFTER_SANITIZATION` | `QUALIFIED_DATA_ROOM` | `PRIVATE` | `DO_NOT_PUBLISH`

No asset is auto-exposed. Pipeline: [GW_0A_PUBLIC_PRIVATE_BOUNDARY.md](GW_0A_PUBLIC_PRIVATE_BOUNDARY.md).

GW-0A assigned **zero** `PUBLIC_SAFE` rows.

## Master matrix schema

Every overlay record uses these fields (JSON keys in snake_case):

| Field | JSON key | Notes |
| ----- | -------- | ----- |
| Canonical ID | `canonical_id` | Existing ID preferred |
| Name | `name` | Display name; not a rename of the system |
| Type | `type` | `PROJECT` `MODULE` `ENGINE` `AI` `FORMULA` `PROTOTYPE` `VISUAL` `EVIDENCE` |
| Parent organism/project | `parent_organism_project` | Usually `z-sanctuary-universe` |
| Purpose | `purpose` | Short, evidence-bounded |
| Evidence state | `evidence_state` | Exact enum above |
| Implementation state | `implementation_state` | Hub/registry language, not a green flip |
| Source of truth | `source_of_truth` | Paths to canonical files |
| Receipts/tests | `receipts_tests` | Named receipts or verify commands/docs |
| HTML prototypes | `html_prototypes` | Hub-relative paths |
| Visual mockups | `visual_mockups` | Images/fixtures if any |
| Related AI | `related_ai` | IDs |
| Related engines | `related_engines` | IDs |
| Dependencies | `dependencies` | IDs or paths |
| Ethical/public-benefit role | `ethical_public_benefit_role` | Claim only if sourced |
| Economic role | `economic_role` | Array of exact tokens |
| Customer/beneficiary | `customer_beneficiary` | Internal unless evidenced |
| Revenue pathway | `revenue_pathway` | “None claimed” unless evidenced |
| Public exposure class | `public_exposure_class` | Exact enum |
| Security class | `security_class` | `INTERNAL` `VAULT` `SCIENTIFIC_PRIVATE` |
| Human validation needed | `human_validation_needed` | Default true |
| Golden Website surfaces | `golden_website_surfaces` | Empty until GW-1+ mapping |
| Next evidence gate | `next_evidence_gate` | What Steward must decide next |

Additional overlay keys: `id_status`, `commercial_status`, optional `prototype_class`, `notes`.

## Inventory posture (filesystem vs overlay)

| Inventory | Count at GW-0A build | Overlay treatment |
| --------- | -------------------- | ----------------- |
| PC-root projects | 22 + 1 retired | All included with existing IDs |
| Monster entries | 27 | Included; `ghost_core` / `alien_core` kept as **engines** (same IDs) |
| Master modules | 68 | All included with existing IDs |
| Core engines | 3 | All included |
| MDG dashboard tiles | 14 | Prototype rows with existing tile IDs |
| Navigator catalog services | 21 | Pointers via selected IDs; not fully cloned |
| HTML under `dashboard/` or `docs/public/` | 62 | Key surfaces as prototype rows; remainder counted, not duplicated |
| Receipt-like files | 166 | Corpus pointer + selected sealed examples |
| Images under docs/dashboard/data | 4 | ICIS fixtures grouped as one visual row |

## Next gate

**STOP.** Do not open GW-1 (Public Knowledge Twin foundation) without explicit Steward approval.

Receipt: [PHASE_GW_0A_GREEN_RECEIPT.md](PHASE_GW_0A_GREEN_RECEIPT.md)
