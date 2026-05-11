# PC root — Extras & Tools sink

**Folder (under PC root):** `Extras & Tools`
**Absolute example:** `C:\Cursor Projects Organiser\Extras & Tools` (when `pc_root` is `C:/Cursor Projects Organiser`)

## Purpose

Use **Extras & Tools** as the **single agreed place** for:

- Installers, portable apps, and helper binaries
- Large zips, exports, and scratch downloads
- Tooling that is **not** a Z product repo

Keep **product codebases** (hub + member projects) free of this clutter so roots stay navigable and backups stay predictable.

## Ecosystem awareness

| Surface | How it knows |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| **Z-EAII / Overseer** | Row `pc-root-extras-and-tools` in `data/z_pc_root_projects.json` |
| **Dashboard “All projects”** | Same JSON via `core/z_pc_root_projects_panel.js` |
| **Z-FPSMC** | After `npm run fpsmc:scan`, `project_roots` includes every path from that registry |
| **`npm run pc-root:catalog`** | Catalogues `pc_root`; registry row documents intent |

## Z-Folder Manager (important boundary)

- **Inside `ZSanctuary_Universe`:** `z_folder_manager_guard.mjs` + `data/z_folder_manager_policy.json` (`allowed_roots`, hints, snapshots) apply to **hub layout only**.
- **At PC root:** `Extras & Tools` is a **sibling** folder — it is **not** governed by hub `allowed_roots`. Policy file includes `pc_root_extras_sink` so operators and AI see the distinction in one place.

## Operator habit

1. New “extra” arrives (installer, zip, portable tool) → move or save under **`pc_root/Extras & Tools/`** (subfolders optional).
2. Do **not** drop those files into `ZSanctuary_Universe/` root or random member repos.
3. Re-run **`npm run fpsmc:scan`** when you want storage posture refreshed for Zuno.

## Related

- `docs/Z-FPSMC-FREE-POWERSHELL-MULTI-CONTAINERS.md` — read-only storage map
- `docs/Z-CREATOR-MANUAL.md` — PC root and hub overview

---

_Z-Sanctuary — PC root hygiene; no automatic moves; human + registry discipline._
