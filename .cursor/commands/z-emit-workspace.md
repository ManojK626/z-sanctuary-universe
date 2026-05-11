Regenerate the **VS Code multi-root workspace** at the PC root from `data/z_pc_root_projects.json` so Cursor sees all EAII-listed folders.

From ZSanctuary_Universe root:

```powershell
npm run workspace:emit-pc-root
```

Optional dry-run first: `npm run workspace:emit-pc-root:dry-run`

Tell the user to open **`Z_All_Projects.code-workspace`** under their `pc_root` (see JSON) via **File → Open Workspace from File…**. Remind: full **Z: SSWS Auto Boot** should stay tied to the **hub** repo only.
