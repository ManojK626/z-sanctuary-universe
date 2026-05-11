# AMK Workspace Doorway status

**Generated:** 2026-05-04T17:23:35.609Z

**Overall signal:** BLUE

## Cursor CLI probe

- **Available:** true
- **Command:** `where cursor`

## Duplicate paths (informational)

- `C:/Cursor Projects Organiser/Z_Sanctuary_Universe` → main_ssws_lab_workspace, z_lab_workspace_only, hub_zsanctuary

## Projects

| project_id | signal | path_exists | workspace_ok | notes |
| ---------- | ------ | ----------- | ------------- | ----- |
| main_ssws_lab_workspace | YELLOW | yes | yes | YELLOW: duplicate path shared with another project_id (informational). |
| z_lab_workspace_only | YELLOW | yes | yes | YELLOW: duplicate path shared with another project_id (informational). |
| hub_zsanctuary | YELLOW | yes | yes | YELLOW: duplicate path shared with another project_id (informational). |
| z_questra | GREEN | yes | n/a | — |
| franed_at_princess | GREEN | yes | n/a | — |
| lumina_browser | YELLOW | no | n/a | YELLOW: optional path missing on disk. |
| z_omni_sanctuary | GREEN | yes | n/a | — |
| z_labs_pc | GREEN | yes | n/a | — |
| z_skyscraper | BLUE | yes | n/a | BLUE: human_gate_required — AMK decision before treating as launch-ready. |
| pc_eaii_all_projects_workspace | GREEN | yes | yes | — |
| xl2_placeholder | BLUE | n/a | n/a | BLUE: human_gate_required — AMK decision before treating as launch-ready. |
| zquestcraft_placeholder | BLUE | n/a | n/a | BLUE: human_gate_required — AMK decision before treating as launch-ready. |
| nas_synology_reference | BLUE | n/a | n/a | BLUE: secrets or NAS declaration — manual AMK posture; doorway does not mount or read vault. |

## Law

Doorway ≠ auto-launch. Open folder ≠ start server. NAS reference ≠ mount.