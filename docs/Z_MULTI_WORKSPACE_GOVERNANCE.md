# Z Multi-Workspace Governance (v0.2)

## Objective

Keep workspaces aware of upgrades without coupling runtime or writes across roots.

## Workspace Identity

`config/z_workspace_identity.json` defines this workspace identity:

- `id`: unique workspace tag (`CORE`, `LAB`, `NAS`, `EXP`)
- `role`: `production` | `sandbox` | `staging` | `experimental`
- `linked_to`: informational graph only
- `allow_external_writes`: must remain `false`

## Broadcast Channel (Read-Only Across Workspaces)

`z_workspace_broadcast.json` is the local bulletin payload for other workspaces to read.

Rules:

- A workspace may publish only its own local broadcast file.
- Cross-workspace reads are allowed.
- Cross-workspace writes are forbidden.

Update command:

`npm run workspace:broadcast -- --notice="..." --version=0.2 --impact=low --review=false`

## Isolation Policy

`config/z_multi_workspace_policy.json` enforces:

- strict isolation mode
- cross-workspace reads enabled
- cross-workspace writes disabled
- promotion requires explicit flag
- version match required for promotion/merge

## Version Awareness

`z_workspace_version.json` is the local version source of truth.

Promotion gate command:

`npm run workspace:promotion-gate -- --peer-root=C:\\ZSanctuary_Labs --promote`

If `require_version_match_for_merge=true`, any mismatch blocks promotion.

## Guard Commands

- `npm run workspace:guard`
- `npm run workspace:broadcast`
- `npm run workspace:promotion-gate -- --peer-root=<path> --promote`

## Non-Negotiable Rules

- Never assume other workspace state unless explicitly provided.
- Never modify files outside workspace root directory.
- All promotions require manual confirmation.
