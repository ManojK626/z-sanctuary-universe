# LAWGRID-1A — Read-only governance observatory

**Module ID:** LAWGRID-1A
**Surfaces:** Static HTML + CSS + JSON ingest only (no APIs, orchestration, billing, deploy triggers, or legal automation).

## Purpose

Provide a **calm observatory** layout for the Z-Sanctuary ecosystem: **universe spine**, **constellation map** (illustrative relational lines), **signal pills**, **observatory summary cards**, **human review queue**, and **links to doctrine**. It extends the **Z-Governance intelligence** story as **visibility only** — aligned with [Z_UNIVERSAL_INTERACTION_LANGUAGE.md](design/Z_UNIVERSAL_INTERACTION_LANGUAGE.md) (Z-UIL) and the Z-VIL hub pointer ([Z_VISUAL_INTERACTION_LANGUAGE.md](design/Z_VISUAL_INTERACTION_LANGUAGE.md)).

## Non-goals

| Forbidden |
| ----------------------------------------------------------------------------- |
| Execution buttons, dispatch, webhooks, CI triggers |
| Billing, pricing changes, entitlement grants |
| Provider or model calls |
| Legal conclusions, certification language, “auto-launch OK” implications |
| Flashing strobes or motion-heavy spectacle (observe `prefers-reduced-motion`) |

## Hard laws (copy + behaviour)

1. **Capability ≠ entitlement.** Catalogue and capability rows describe what exists — not what the visitor may purchase or access.
2. **Readiness ≠ launch permission.** SSWS signals and benchmark rows do not waive human release gates.
3. **GREEN ≠ auto-deploy.** Indicator and internal GREEN states stay advisory unless release control receipts say otherwise.
4. Constellation SVG lines are **illustrative doctrine links**, not network topology or live coupling.

## Files

| Path | Role |
| ---------------------------------------------------- | ------------------------------------------------------------- |
| `dashboard/Html/z-lawgrid-observatory.html` | Shell + regions + footer sources |
| `dashboard/scripts/z-lawgrid-readonly.js` | Fetch + render |
| `dashboard/styles/z-lawgrid.css` | Observatory chrome; reduced-motion safe |
| `dashboard/data/z_lawgrid_observatory_registry.json` | Spine layers, constellation node positions, edges, foot links |

## Input JSON (read-only)

| Source | Typical use |
| ----------------------------------------------------- | ------------------------------------------------- |
| `dashboard/data/z_universe_service_catalog.json` | Service counts · bridge summaries |
| `dashboard/data/z_legal_benchmark_readiness.json` | Benchmark tallies · legend · BLUE/RED queue rows |
| `data/z_cross_project_capability_index.json` | Capability posture excerpts |
| `data/z_magical_visual_capability_registry.json` | ZMV golden law excerpt · row count |
| `data/reports/z_ssws_launch_requirements_report.json` | Overall signal · issues · notification candidates |
| `dashboard/data/amk_project_indicators.json` | Law note · BLUE/RED indicator samples |

All paths are resolved from **repo root** over HTTP (`fetch`). Open the HTML through the same hosting pattern used for NAV-1 / ecosphere maps.

## Human review queue

Merged from SSWS BLUE/RED items, benchmark categories marked BLUE/RED, and RED/BLUE AMK indicators (capped). It is **not** a ticketing system — triage stays with AMK and counsel per existing gates.

## Verification

From hub root:

- `npm run verify:md`

Manual: Serve the repo locally, load `dashboard/Html/z-lawgrid-observatory.html`, confirm all six ingest files load (partial load is surfaced in status).

## Rollback

Delete or revert LAWGRID paths listed above plus this doc and **PHASE_LAWGRID_1A_GREEN_RECEIPT.md**.
