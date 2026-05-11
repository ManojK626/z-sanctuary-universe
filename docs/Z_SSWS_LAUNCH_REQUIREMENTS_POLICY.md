# Z-SSWS launch requirements policy

## Purpose

Machine-readable policy for **Z-SSWS-LINK-1** lives in `data/z_ssws_launch_requirements_policy.json`. It defines **signals**, **extension and launch profile rules**, **shadow workspace rules**, **allowed automatic checks** (evidence scripts only), **human-gated actions**, **forbidden auto actions**, and **AMK alert defaults** (RED and BLUE only).

## Signals

| Signal | Meaning |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| GREEN | Required rows validate; no RED-class collisions. |
| YELLOW | Optional metadata gaps, empty forbidden list advisory, extension manifest to confirm. |
| BLUE | Secrets required, active deploy or Cloudflare bind without lane doc, or other human gate. |
| RED | Malformed required fields, duplicate `project_id`, or `required_for_daily_status` without verify/smoke and no `known_hold_reason`. |

## Extension rules

- `required_extensions` is **advisory**; the hub does not verify VS Code or Cursor install state in LINK-1.
- **Auto-install** of extensions is **forbidden** in this phase.

## Launch profiles

| Profile | Meaning |
| -------------------- | ----------------------------------------------------- |
| `manual_only` | Operator runs `start_command` by hand. |
| `checklist_only` | Future checklist generator; no execution here. |
| `approved_local_dev` | Metadata for a future chartered lane; not auto-start. |
| `future_gated` | No local launch until a later phase and AMK approval. |

## Shadow workspace

See [Z_SSWS_SHADOW_SPINES_POLICY.md](Z_SSWS_SHADOW_SPINES_POLICY.md). Shadow allowed flags are **policy hints**, not permission to copy secrets or auto-open ports.

## DRP / DOP

Sacred surfaces, children, billing, bridges, and staged rollout remain human-gated per existing completion and verification docs.

## Related

- [Z_SSWS_WORKSPACE_SPINE.md](Z_SSWS_WORKSPACE_SPINE.md)
- [AMK_WORKSPACE_DOORWAY.md](AMK_WORKSPACE_DOORWAY.md) — Z-SSWS-DOOR-1 local doorway (open folders/workspaces only; no auto-launch)
- [data/z_ssws_launch_requirements_policy.json](../data/z_ssws_launch_requirements_policy.json)
