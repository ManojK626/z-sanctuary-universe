# Z-FPSMC — Z-Free PowerShell Multi-Containers

**Status:** PREPARE ONLY / BUILD LITE (Phase 1 — read-only storage map)

**Z-FPSMC** = **Z-Free PowerShell Multi-Containers**: a Windows/PowerShell-oriented layer to **orchestrate awareness** of disks, project roots, and (later) worker containers. It is **not** a storage vault. Containers are **organized workers** that connect to real storage (NAS, PC disks, external drives, cloud buckets) **safely**, not a substitute for them.

## Architecture intent

```text
NAS / PC disks / external drives / cloud buckets
        ↓
Z-FPSMC PowerShell controller (read-only by default in Phase 1)
        ↓
Future: containers for scan, backup, verify, build, report
        ↓
Zuno / QOSMEI / Guardian reports
```

**Containers are not “huge storage.”** The main durable store remains **PC / NAS / backups**. Z-FPSMC starts as **intelligence and receipts**, not bulk sync.

## Zuno gate

| Phase | Posture |
| -------- | ------------------------------------------------------------------- |
| Phase 1 | Read-only map |
| Phase 2+ | Multi-container worker lanes (design only until rollback is proven) |

Do **not** build a massive storage or auto-migration system under Z-FPSMC until **backup, rollback, and operator approval** are in place.

## Phase 1 — Read-only storage map (implemented)

| Artifact | Purpose |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/powershell/z_fpsmc_scan.ps1` | Collects drives, free space, EAII `pc_root` project paths, best-effort Docker/Podman volume hints. **No writes** except the report JSON. |
| `scripts/powershell/z_fpsmc_report.ps1` | Renders `data/reports/z_fpsmc_storage_map.md` from the JSON. |
| `data/reports/z_fpsmc_storage_map.json` | Machine-readable map for Zuno/Guardian. |

### npm (from repo root)

```text
npm run fpsmc:scan
npm run fpsmc:report
```

Requires **PowerShell 7+** (`pwsh`) for `npm` scripts, or run the `.ps1` files manually with **Windows PowerShell 5.1+**.

## Phase 2 — Multi-container worker lanes (future, not auto-enabled)

| Lane | Purpose |
| ------------------ | ---------------------------- |
| `z-scan-worker` | Read-only folder inventory |
| `z-backup-checker` | Hash/snapshot compare |
| `z-build-worker` | Isolated build/test |
| `z-report-worker` | Report generation |
| `z-media-worker` | Later: media safety pipeline |

One container, one job. No ad-hoc “do everything” images.

## Phase 3 — Storage pool awareness (future)

Awareness of **PC root**, **NAS root**, **external backup**, **container volumes**, **R2/edge later**, **GitHub** as code backup — without auto-syncing everything until **hash receipts and rollback** are proven.

## Hard safety rules (all phases)

**Default Phase 1 behavior:**

- READ ONLY: list, measure, report.
- **No** delete, move, overwrite, or format.
- **No** automatic sync of huge trees.
- **No** `node_modules` / secret bulk copy.
- **No** changing Docker/Podman install or daemon config from these scripts.
- **No** deployment, release-gate, or `package.json` mutation from `fpsmc:*` (only JSON + markdown under `data/reports/` for Phase 1).

**If write-capable tools are ever added (not Phase 1):**

- Require `--confirm`, `--dry-run` first, receipt file, backup manifest, and Zuno visibility before any write.

## JSON schema (Phase 1)

`data/reports/z_fpsmc_storage_map.json` uses:

- `drives` — fixed disks and basic size/free metadata.
- `containers` — Docker/Podman volume list lines or install-path presence (read-only).
- `project_roots` — resolved from `data/z_pc_root_projects.json` when present.
- `free_space` — map of drive key → free bytes (when available).
- `warnings` — e.g. low free space, missing paths (no destructive action).
- `generated_at` — ISO-8601 UTC.
- `schema_version` — `"1"` for forward compatibility.

## Related

- `data/z_pc_root_projects.json` — EAII PC root and project list (read by scan).
- `data/reports/zuno_system_state_report.md` — Zuno; ingest FPSMC JSON when you wire a bridge.

## Changelog

- **2026-04-27** — Phase 1: `z_fpsmc_scan.ps1`, `z_fpsmc_report.ps1`, `fpsmc:scan` / `fpsmc:report`, storage map + markdown summary.
