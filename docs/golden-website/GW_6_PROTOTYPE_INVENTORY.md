# GW-6 — Prototype inventory

**Phase:** Golden Website GW-6
**Date:** 2026-08-27
**Machine file:** [data/golden-website/gw6_prototype_inventory.json](../../data/golden-website/gw6_prototype_inventory.json)
**Posture:** Classification only. **Do not iframe these into the Golden Website shell.**

Hub-scoped HTML count (`dashboard/` + `docs/public/` + Golden Website shell): **71**. This inventory classifies **16** named surfaces or clusters. 71 files ≠ 71 museum exhibits.

Prototype truth: WORKING frontend ≠ working backend. LOCAL prototype ≠ public service. HTML file ≠ product readiness.

## Counts

| Prototype class | Count |
| --- | ---: |
| WORKING | 5 |
| PARTIAL | 2 |
| PRIVATE | 6 |
| CONCEPT | 2 |
| SIMULATED | 1 |
| **Classified records** | **16** |

| Recommendation | Count |
| --- | ---: |
| READY_FOR_STEWARD_REVIEW | 1 |
| NEEDS_SANITIZATION | 4 |
| KEEP_PRIVATE | 9 |
| NEEDS_MORE_EVIDENCE | 1 |
| DO_NOT_PUBLISH | 1 |

## Named prototypes

### PROTO-GW-SHELL — Golden Website local foundation shell

| Field | Value |
| --- | --- |
| Class | WORKING |
| Canonical | z_sanctuary_core (plus the other five approved records) |
| Public-safe identity | The Golden Website |
| Local data | Sanitized adapter JS only |
| Live/private API | no |
| Sensitive paths | no |
| Telemetry risk | low |
| External network | no |
| Public-demo | local only after Steward |
| Recommendation | **READY_FOR_STEWARD_REVIEW** |
| Next action | May become the first Prototype Museum exhibit of the public-safe shell itself. |

### PROTO-CYCLE-DASHBOARD — Cycle Dashboard (read-only)

| Field | Value |
| --- | --- |
| Class | WORKING |
| Canonical | cycle_observe |
| Local data | GET operator report JSON |
| Sensitive paths | yes |
| Telemetry risk | high (reports can look like live ops) |
| Recommendation | **NEEDS_SANITIZATION** |
| Next action | If exhibited later, show a redacted demo dataset, never raw observer queues. |

### PROTO-KNOWLEDGE-ASK — Z-EAII Knowledge Ask

| Field | Value |
| --- | --- |
| Class | WORKING |
| Canonical | grounded_questions_qadp |
| Related | z_eaii |
| Public-safe identity | QADP family — **not Golden Guide AI** |
| Local data | operator knowledge index |
| Recommendation | **NEEDS_SANITIZATION** |
| Next action | Sanitize cite-or-admit UI. Do not open Golden Guide AI. |

### PROTO-ECOSPHERE-MAP — Living Ecosphere Map

| Field | Value |
| --- | --- |
| Class | WORKING |
| Canonical | none (`NEEDS_IDENTITY_REVIEW`) |
| Related | univ_workstation_navigator |
| Public-safe identity | **Not Golden Universe Map** |
| Local data | hub catalog JSON fetch |
| Recommendation | **NEEDS_SANITIZATION** |
| Next action | Keep identity split from the GW-5 six-node map. |

### PROTO-QA-RP — Z-Q&A&RP

| Field | Value |
| --- | --- |
| Class | PARTIAL |
| Canonical | grounded_questions_qadp |
| Related | fourteen_drp_protocols |
| Recommendation | **NEEDS_SANITIZATION** |
| Next action | Alias into one QADP public story. Not a second Q&A product. |

### PROTO-HODP-SKK — HODP operator dashboard

| Field | Value |
| --- | --- |
| Class | PRIVATE |
| Canonical | none (`NEEDS_IDENTITY_REVIEW`) |
| Flags | fetch, localhost, iframe |
| Telemetry risk | high |
| Recommendation | **KEEP_PRIVATE** |
| Next action | Never iframe into Golden Website. |

### PROTO-NAV-OPERATOR — Navigator operator cockpit

| Field | Value |
| --- | --- |
| Class | WORKING |
| Canonical | univ_workstation_navigator |
| Recommendation | **KEEP_PRIVATE** |
| Next action | Public-safe page already exists (`navigator.html`). Operator HTML stays private. |

### PROTO-MORNING-COCKPIT — SSWS Morning Cockpit

| Field | Value |
| --- | --- |
| Class | PRIVATE |
| Recommendation | **KEEP_PRIVATE** |
| Next action | Not a public operations centre. |

### PROTO-CRYSTAL-DNA — Crystal DNA map

| Field | Value |
| --- | --- |
| Class | PARTIAL |
| Identity | `NEEDS_IDENTITY_REVIEW` — not Golden Universe Map |
| Recommendation | **KEEP_PRIVATE** |

### PROTO-AMK-MAP — AMK-Goku Main Control Map

| Field | Value |
| --- | --- |
| Class | PRIVATE |
| Recommendation | **KEEP_PRIVATE** |
| Next action | Steward control map. Not the public Universe map. |

### PROTO-UCCR-CANVAS — Universal Canvas lite

| Field | Value |
| --- | --- |
| Class | CONCEPT |
| Recommendation | **NEEDS_MORE_EVIDENCE** |
| Next action | Stay visibly lite/concept. |

### PROTO-MDGEV — Z-MDGEV Eagle Eyes

| Field | Value |
| --- | --- |
| Class | PRIVATE |
| Flags | iframe |
| Recommendation | **KEEP_PRIVATE** |

### PROTO-CONSENT-EXPLAINER — Consent center / explainer

| Field | Value |
| --- | --- |
| Class | SIMULATED |
| Live/private API | **yes** (`/api/consent`, `/api/audit`, including POST) |
| Recommendation | **DO_NOT_PUBLISH** |
| Next action | Not a public consent product. |

### PROTO-DOCS-PUBLIC — docs/public HTML apps (4 files)

| Field | Value |
| --- | --- |
| Class | PRIVATE |
| Flags | localhost, Windows path strings, fetch |
| Recommendation | **KEEP_PRIVATE** |

### PROTO-ZILWA-CLUSTER — ZILWA HTML (26 files)

| Field | Value |
| --- | --- |
| Class | CONCEPT |
| Recommendation | **KEEP_PRIVATE** |
| Next action | Hospitality/life-hub cluster. Some surfaces touch family/children themes. Not first Golden exhibits. |

### PROTO-LEGAL-WORKSTATION — Legal / Lawgrid

| Field | Value |
| --- | --- |
| Class | PRIVATE |
| Recommendation | **KEEP_PRIVATE** |

## Scan notes (not an exhibit list)

Companion JS across HODP fetches many operator reports. Consent/explainer panels call hub APIs. Those files are why **WORKING UI ≠ working public service** and why most prototypes stay private.
