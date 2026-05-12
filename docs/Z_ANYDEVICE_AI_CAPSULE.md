# Z Any Device Manager — AI Capsule (Phase Z-ANYDEVICE-AI-CAPSULE-1)

This phase **connects the Z Any Device Manager concept** to **Z-SSWS**, **Casa AI Builder**, and **Cloudflare governance** as a **safe device capability and trust-classification layer**. It is **documentation and metadata first**: no live device fabric, no scanning, no endpoint security product claims.

## Scope (this phase)

- **In scope:** docs, registry JSON (`data/z_anydevice_ai_capsule_registry.json`), and read-only posture alignment with existing hub doctrine.
- **Out of scope:** real device connection, network scanning, antivirus replacement, secrets, deploy, driver install, NAS mutation, automatic restore, or Cloudflare production bind.

Canonical machine fields and enums live in the registry file; this page is the human map.

## Device identity (declared fields)

Operators and tools record **declared** facts only (no silent inventory). Fields:

| Field | Purpose |
| -------------------- | ----------------------------------------------------------------------------- |
| `device_id` | Opaque stable id (avoid raw serials in repo unless policy explicitly allows). |
| `device_type` | Form factor / class (laptop, phone, NAS, etc.). |
| `os` | OS family/version label as declared. |
| `cpu` | Optional coarse CPU description. |
| `gpu` | Optional GPU / integrated flag. |
| `ram` | Optional tier (e.g. 16GB). |
| `storage` | Optional declared storage posture (not volume enumeration). |
| `network_capability` | Declared label only (offline, local_only, etc.) — **not** a probe result. |
| `trusted_status` | Trust state (see below). |
| `risk_signal` | Optional advisory rollup; does **not** auto-enforce quarantine. |
| `ecosystem_role` | Hub role bucket (see role map below). |

## Trust states

| State | Meaning |
| ---------- | ------------------------------------------------------------------- |
| GREEN | Aligned with policy for declared read-only / cockpit use. |
| YELLOW | Caution; expand role only after human review. |
| BLUE | Governance sequencing; docs and checklists until cleared. |
| RED | Not trusted for sensitive workflows; no automatic expansion. |
| QUARANTINE | Unknown or conflicted; **no** assumed trust or connect authority. |
| NAS_WAIT | NAS-adjacent posture not verified; no NAS writes from this capsule. |

## Allowed vs forbidden (capsule law)

**Allowed:** read declared capability; classify role; recommend use; produce report.

**Forbidden:** connect automatically; scan private files; run antivirus claims; install drivers; open ports; write secrets; bind Cloudflare; deploy; mutate NAS.

## Ecosystem role map

| Role | Role in stack |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Z-SSWS cockpit node | SSWS-aligned dashboards, tasks, read-only reports — no new execution hooks from registry alone. |
| Z-Lab supervised analysis node | Supervised analysis and docs under Z-Lab discipline. |
| Cloudflare preview controller | Preview / posture **review** in governance docs only — no device access, no secrets, no production deploy. |
| NAS cold mirror candidate | Future compare-only posture; stays gated until mount + human verify. |
| dashboard display node | HODP-style read-only visualization surfaces. |
| local AI inference node | Declared local inference context; suggestions only via Casa-style flows, not device authority. |
| quarantine / unknown device | Awareness and restriction narrative; no auto-connect. |

## Z-SSWS

Z-SSWS remains the **cockpit and doctrine spine** for how operators work. The Any Device registry is a **classification and declaration layer** consumed for documentation, checklists, and future read-only validators — not a new SSWS execution channel. Align with existing SSWS and comms docs in the hub.

## Casa AI Builder

Casa AI Builder may:

- read `data/z_anydevice_ai_capsule_registry.json`;
- suggest **safe** device use cases and operator checklists;
- generate docs, prompts, and checklists **without** direct device authority.

Casa must **not** change `trusted_status` without a human gate, open connections to devices, or imply endpoint control from this registry.

## Cloudflare AI (governance)

Cloudflare-facing AI work stays **preview/runtime posture review** in line with hub precautions: **no device access**, **no secrets**, **no production deployment** driven from this capsule.

## Related artifacts

| Artifact | Role |
| ------------------------------------------------------ | ------------------------------------------------------------------------ |
| `data/z_anydevice_ai_capsule_registry.json` | Canonical enums, fields, roles, Casa/CF role blocks, synthetic examples. |
| `docs/PHASE_Z_ANYDEVICE_AI_CAPSULE_1_GREEN_RECEIPT.md` | Phase receipt and verification notes. |

## Read-only checks (first)

Until a dedicated validator script is chartered, **read-only checks** mean: human or CI review that this file and linked governance docs stay consistent; optional JSON parse in existing hub verify pipelines when added. **Do not** add network probes or device SDKs under this phase id without a separate charter and gates.
