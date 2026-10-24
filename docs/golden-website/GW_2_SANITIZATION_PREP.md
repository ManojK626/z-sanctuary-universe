# GW-2 — Public evidence and sanitization preparation

**Phase:** Golden Website GW-2
**Date:** 2026-08-27
**Scope:** Exactly two GW-1 candidates. All other overlay rows stay where GW-1 placed them.

| Canonical ID | Public-prep role |
| ------------ | ---------------- |
| `z_sanctuary_core` | First public **anchor** candidate (what Z-Sanctuary is) |
| `univ_workstation_navigator` | First public **explore** candidate (how to look around) |

## What this phase is

Prepare **public-safe capsules** and **sanitization diffs**, then park both on the **human approval queue**.

## What this phase is not

- Not a website
- Not Golden Guide AI
- Not Golden Universe Map runtime
- Not Twin publication
- Not promotion of the other 158 overlay records

## Capsule contents (only these)

Public name · simple purpose · evidence state · implementation state · what is demonstrably working · what remains non-public/unproven · public-safe evidence references · safe screenshots/prototype references if available · commercial status · ethical/public-benefit role · limitations · next milestone.

Each capsule ends with:

`PUBLICATION DECISION: PENDING STEWARD APPROVAL`

## Forbidden in capsules

Secrets, credentials, env vars, personal data, local/private IPs, internal file paths, raw telemetry, private datasets, unpublished sensitive IP, security topology, operator-only identifiers.

Removed or generalized material lives in the **sanitization diff**, not in the capsule.

## Artifacts

| File | Role |
| ---- | ---- |
| `data/golden-website/capsules/gw_capsule_z_sanctuary_core.json` | Machine capsule |
| `data/golden-website/capsules/gw_capsule_univ_workstation_navigator.json` | Machine capsule |
| `docs/golden-website/capsules/GW_CAPSULE_Z_SANCTUARY_CORE.md` | Steward-readable capsule |
| `docs/golden-website/capsules/GW_CAPSULE_UNIV_WORKSTATION_NAVIGATOR.md` | Steward-readable capsule |
| `data/golden-website/sanitization/gw_sanitization_diff_z_sanctuary_core.json` | What was stripped/generalized |
| `data/golden-website/sanitization/gw_sanitization_diff_univ_workstation_navigator.json` | What was stripped/generalized |
| `data/golden-website/gw_publication_approval_queue.json` | Human approval queue |
| [GW_2_PUBLICATION_PROOF_THRESHOLD.md](GW_2_PUBLICATION_PROOF_THRESHOLD.md) | Five gates |

Public Knowledge Twin `records[]` remains empty.
