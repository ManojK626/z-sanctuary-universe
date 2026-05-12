# Z AnyDevice — Synthetic Device Simulation (Phase Z-ANYDEVICE-2)

This phase adds a **safe simulation layer** so **Z-SSWS**, **Casa AI Builder**, and **Cloudflare governance** can reason about **device capability and trust states** using **fiction-only JSON** plus a **read-only simulator**. Nothing touches real hardware.

## Scope

| In scope | Out of scope |
| ---------------------------------------------------- | ----------------------------------------- |
| Docs, synthetic scenario JSON, read-only simulator | Real device scanning or pairing |
| Reports under `data/reports/` only from simulator | Antivirus or security product claims |
| Classification strings for training operators and AI | Network probing, drivers, secrets |
| | Cloudflare production changes, NAS writes |

**Inputs (read-only):**

- `data/z_anydevice_synthetic_devices.json` — seven named synthetic scenarios.
- `data/z_anydevice_ai_capsule_registry.json` — forbidden action list and ecosystem role ids.

**Outputs (simulator writes only these):**

- `data/reports/z_anydevice_simulation_report.json`
- `data/reports/z_anydevice_simulation_report.md`

**Command:** `npm run z:anydevice:simulate` (runs `scripts/z_anydevice_simulate.mjs`).

## Synthetic scenarios (ids)

| device_id | Intent |
| --------------------------- | ---------------------------------------------------------- |
| `ssws_prime_node` | Primary SSWS cockpit-style posture (local-only, GREEN). |
| `z_lab_background_node` | Z-Lab supervised analysis (YELLOW review). |
| `cloudflare_preview_edge` | Edge preview / governance sequencing (BLUE, AMK gate). |
| `nas_cold_mirror_candidate` | NAS cold-mirror candidate (NAS_WAIT until mount + verify). |
| `unknown_usb_device` | Unclassified attach (QUARANTINE / block). |
| `dashboard_display_node` | Read-only dashboard display (GREEN). |
| `local_ai_inference_node` | Local inference context (YELLOW; Casa suggests only). |

## Simulation rules (rollup)

| trusted_status | Meaning in simulator |
| -------------- | ------------------------------------------------------------------------------------ |
| GREEN | **Allowed** for declared `ecosystem_role` only — stay within read-only hub doctrine. |
| YELLOW | **Review required** before role expansion or new surfaces. |
| BLUE | **AMK decision** — governance sequencing; docs / preview posture until cleared. |
| RED | **Block** — `simulation_blocked` true; no sensitive hub workflows. |
| QUARANTINE | **Block** — same as RED for capability expansion; no auto-connect. |
| NAS_WAIT | **Hold** until NAS mount and operator verify; no NAS writes from simulation. |

`risk_signal` in the report elevates to **RED** when `trusted_status` is **RED** or **QUARANTINE** (advisory rollup).

Each simulation row includes **`forbidden_actions`** copied from the capsule registry (reference list for Casa/docs). **`recommended_action`** and **`required_human_gate`** are derived strings, not executable policy.

## Casa AI Builder

May **read** `z_anydevice_simulation_report.json`, **suggest safe checklists**, and **suggest docs/prompts only**. Must **not** exercise device authority or change trust without a human gate.

## Cloudflare AI

May **review preview/runtime posture** in governance-doc sense only. **No** device authority, **no** secrets, **no** production deploy driven from this simulation.

## Related

| Doc / data | Role |
| ------------------------------------------- | ------------------------------- |
| `docs/Z_ANYDEVICE_AI_CAPSULE.md` | Phase 1 capsule law and fields. |
| `docs/PHASE_Z_ANYDEVICE_2_GREEN_RECEIPT.md` | Receipt and verification. |
