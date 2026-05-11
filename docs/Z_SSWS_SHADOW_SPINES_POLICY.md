# Z-SSWSs — shadow and satellite workspace spines

## Purpose

**Z-SSWSs** denotes **shadow**, **staging**, and **mirror** workspace spines alongside the main **Z-SSWS** spine. In **Z-SSWS-LINK-1** they exist as **registry lanes and JSON fields only** — no orchestration, no automatic workspace duplication, and no silent sync to production.

## Registry fields

- `shadow_workspace_allowed` — boolean hint whether a mirrored or secondary workspace is allowed under charter.
- `shadow_workspace_notes` — operator guidance (e.g. shadow dashboard path, read-only mirror).

## Safety

- Shadow HTML and JSON mirrors **do not** imply deploy rights or shared production entitlements.
- Opening extra ports or syncing credentials into a shadow tree stays **human-gated**.

## Related

- [Z_SSWS_WORKSPACE_SPINE.md](Z_SSWS_WORKSPACE_SPINE.md)
- [Z-SSWS-MINI-BOT-AI-TOWER-MARKDOWN-RELAY.md](Z-SSWS-MINI-BOT-AI-TOWER-MARKDOWN-RELAY.md)
