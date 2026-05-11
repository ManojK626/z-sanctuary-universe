Sync **hub Cursor slash commands + subagents** to **PC root** (`pc_root` from `data/z_pc_root_projects.json`) so `/z-*` works when you open only the Organiser folder.

From ZSanctuary_Universe root, run in order:

1. **Dry-run (default):** `npm run cursor:sync-pc-root-config`
2. **Apply (skip existing files):** `npm run cursor:sync-pc-root-config:apply`
3. **Apply + overwrite:** `npm run cursor:sync-pc-root-config:apply-force`

The script refuses to run unless the current repo path equals `pc_root` + hub folder (safety). It only copies `.cursor/commands/*.md` and `.cursor/agents/*.md` — not rules.

After apply, restart Cursor or reload the window so new commands appear.
