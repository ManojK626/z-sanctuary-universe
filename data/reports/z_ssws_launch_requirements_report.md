# Z-SSWS-LINK-1 — Launch requirements report

- Generated: 2026-05-12T17:29:40.395Z
- Overall signal: **BLUE**
- Registry: `data/z_ssws_workspace_spine_registry.json`
- Policy: `data/z_ssws_launch_requirements_policy.json`

## Projects

- **zs_hub_universe** — ZSanctuary_Universe hub (hub, profile=manual_only, secrets=false, deploy=HOLD)
- **at_princess_blackie** — AT Princess & Blackie / Franed AI (reference_only, profile=future_gated, secrets=true, deploy=HOLD)
- **z_questra** — Z-QUESTRA (frontend, profile=manual_only, secrets=false, deploy=HOLD)
- **z_saiyan_lumina** — Z-Saiyan Lumina Browser (electron_app, profile=future_gated, secrets=false, deploy=UNKNOWN)
- **z_omnai_scripts** — Z-OMNAI creative production scripts (script_service, profile=checklist_only, secrets=false, deploy=HOLD)
- **z_susbv_scripts** — Z-SUSBV Benchmark Overseer scripts (script_service, profile=checklist_only, secrets=false, deploy=HOLD)
- **z_api_spine_gate** — Z-API-SPINE / Z-API-GATE (hub registry) (script_service, profile=manual_only, secrets=false, deploy=HOLD)
- **zquestcraft** — ZQuestCraft placeholder (reference_only, profile=future_gated, secrets=false, deploy=NO_GO)
- **xl2_lane** — XL2 reference-only lane (reference_only, profile=future_gated, secrets=false, deploy=UNKNOWN)

## Extension advisory gaps

- (none)

## Port collisions

- (none)

## Issues

- [BLUE] **at_princess_blackie** secrets_human: secrets_required true — AMK/human confirms vault and CI posture before launch.
- [YELLOW] **z_saiyan_lumina** node_version: Missing required_node_version hint for non-reference project.
- [YELLOW] **z_saiyan_lumina** package_manager: Missing package_manager hint for non-reference project.

## AMK notification candidates (RED / BLUE only)

- **BLUE** BLUE: secrets_human — at_princess_blackie: secrets_required true — AMK/human confirms vault and CI posture before launch.

## Law

Launch requirement ≠ launch permission. Extension requirement ≠ auto-install. Start command ≠ execution. Shadow workspace ≠ deploy. GREEN ≠ auto-launch. BLUE requires AMK. RED blocks movement. AMK-Goku owns sacred moves.


YELLOW extension or metadata gaps stay off AMK notifications by default. No auto-launch in SSWS-LINK-1.
