# Z-Sanctuary NAS Architecture Blueprint

**Purpose:** Match your **PC (MKTIGER)** and **UGREEN NASync DXP4800 Plus** into a single future-ready setup, define the Sanctuary layout on the NAS, and make the ecosystem **fully auto-manageable by AI** using your existing Z-Sanctuary design (Zuno, module registry, folder manager, tasks, dashboard).

**Status:** Blueprint — execute after drives are installed, RAID created, and local-only hardening is done.

---

## Part 1 — PC vs NAS: Capability Match (Future-Ready)

### Your PC (MKTIGER) — Operator Terminal + Local AI Brain

| Spec | Value | Role in Sanctuary |
| -------- | ---------------------------- | ----------------------------------------------------------------------------- |
| **OS** | Windows 11 Home (10.0.26200) | Primary development and Cursor host. |
| **CPU** | AMD Ryzen 7 7840HS, 3.8 GHz | Strong single/multi-core: IDE, Docker, scripts, local AI inference. |
| **GPU** | Radeon 780M (integrated) | Light GPU acceleration for local AI/tools if needed. |
| **RAM** | **64 GB** | Ample for many containers, VMs, and heavy AI workloads locally. |
| **Arch** | x64, UEFI, Secure Boot | Standard compatibility. |
| **Role** | **Terminal + local compute** | Cursor, Git, runs Zuno/registry/hygiene scripts; mounts NAS as network drive. |

**Verdict:** Your laptop is **more than capable** as the “brain” that runs Cursor, automation scripts, and local AI while the NAS is the **central storage and always-on hub**.

---

### UGREEN NASync DXP4800 Plus — Central Hub (Storage + Services)

| Spec | Value | Role in Sanctuary |
| -------------- | ----------------------------------------------- | ---------------------------------------------------------- |
| **CPU** | Intel Pentium Gold 8505 (5-core, turbo 4.4 GHz) | Mini server: Docker, DBs, automation, light AI. |
| **RAM** | 8 GB DDR5 (expandable to **64 GB**) | Start at 8 GB; expand when Docker/workloads grow. |
| **OS drive** | 128 GB internal SSD | **UGOS Pro only** — not data storage. |
| **Data** | 4× SATA (2.5"/3.5") | e.g. 4×8 TB → ~24 TB usable (RAID 5). |
| **RAID** | 0 / 1 / 5 / 6 / 10 / JBOD | **RAID 5** recommended: one drive can fail, data survives. |
| **Network** | 2.5GbE + **10GbE** | Fast PC↔NAS link (use 10GbE direct when possible). |
| **Docker** | Docker 26.1 (UGOS Pro) | Run services: DBs, sync jobs, monitoring, light AI. |
| **Automation** | SSH, cron, Docker Compose | Scripts and scheduled tasks on NAS. |
| **Snapshots** | Schedule + versioning | Protect Z-Vault; restore on mistake or failure. |

**Verdict:** NAS = **brain of storage and always-on services**. PC = **where you code and command**; NAS = **where data and background jobs live**.

---

### How They Fit Together (Future-Ready)

```text
                    ┌─────────────────────────────────────────┐
                    │  PC (MKTIGER)                            │
                    │  · Cursor (swarm dev assistant)          │
                    │  · Git clone / workspace on NAS mount    │
                    │  · Zuno State Report, Module Registry,   │
                    │    Folder Manager, Hygiene, Z-EAII     │
                    │  · 64 GB RAM = heavy local AI OK         │
                    └──────────────────┬──────────────────────┘
                                       │ 10GbE (or 2.5GbE)
                                       ▼
                    ┌─────────────────────────────────────────┐
                    │  UGREEN NAS (DXP4800 Plus)               │
                    │  · Z-Sanctuary Universe (repo + data)   │
                    │  · Z_AI_Engines, Z_Projects, Z_Backups   │
                    │  · Z_Archives, Z_Datasets               │
                    │  · Docker: reports_vault_refresh,       │
                    │    core_engine_audit, sync, DBs         │
                    │  · Snapshots + RAID 5                   │
                    └─────────────────────────────────────────┘
```

- **PC:** Run all Z-Sanctuary scripts (Zuno, module registry sync, folder manager snapshot, hygiene, Z-EAII). Workspace can live on NAS (e.g. `\\NAS\Sanctuary_Core\ZSanctuary_Universe` or mount).
- **NAS:** Single source of truth for repos, reports, backups, archives; Docker runs scheduled and background jobs so the ecosystem **auto-manages** even when the PC is off.

---

## Part 2 — Recommended Sanctuary Layout on NAS

When drives are in and RAID/volume is created, create one main share (e.g. **Z-Vault** or **Sanctuary**) and under it:

```text
/Sanctuary_Core/                    # Core repos and config
   ZSanctuary_Universe/              # This repo (Git clone or sync)
   Z-OMNI-Sanctuary/                # OMNI stack if present
   Z-SANCTUARY-AI-SKYSCRAPER/       # AI Skyscraper if present
   config/                          # Shared config (env, secrets refs)

/Z_AI_Engines/                      # AI models, runtimes, container configs
   models/                          # Optional: cached models
   docker/                          # Compose files for NAS-side AI jobs

/Z_Projects/                        # Active project clones (Amk-Goku, etc.)
   Amk-Goku-Dashboards/
   …

/Z_Backups/                         # PC and NAS backup targets
   pc_mktiger/                      # Backups from PC (e.g. Cursor Projects Organiser)
   nas_snapshots_export/            # Optional: snapshot exports

/Z_Archives/                        # Cold storage, old snapshots, releases
   folder_manager_snapshots/        # Old z_sanctuary_vault snapshots
   releases/                        # Tagged release bundles

/Z_Datasets/                        # Bulk data for AI/training/analytics
   public/                          # Safe, shareable
   private/                         # Access-controlled
```

**Align with current PC layout:**
`C:\Cursor Projects Organiser\` maps conceptually to **Sanctuary_Core** + **Z_Projects**. After migration, those live on NAS; PC uses network mount or sync so Cursor opens the same paths.

---

## Part 3 — Backup and Snapshot Strategy

1. **On NAS (UGOS Pro)**
   - **RAID 5** on data pool.
   - **Snapshot schedule** (e.g. daily on Z-Vault/Sanctuary share).
   - **Retention:** e.g. 7 daily, 4 weekly (tune to space).

2. **PC → NAS**
   - **Z Folder Manager** (existing): `z_folder_manager_guard.mjs snapshot` → `safe_pack/z_sanctuary_vault/folder_manager/snapshots/`.
   - Sync or copy that snapshot tree to NAS `Z_Backups/pc_mktiger/` or `Z_Archives/folder_manager_snapshots/` on a schedule (e.g. task + robocopy/rsync from PC, or Docker job on NAS pulling from PC share).

3. **NAS → Offsite (optional)**
   - As in [ZALS_DELIVERABLE_1_SHOPPING_CHECKLIST.md](ZALS_DELIVERABLE_1_SHOPPING_CHECKLIST.md): signed read-only mirror (e.g. rclone in Docker to cloud).
   - Only after local hardening; no internet on NAS until then.

4. **Restore**
   - From NAS snapshot (UGOS UI) or from copied folder-manager snapshots.
   - Z-Sanctuary restore workflow: use `z_folder_manager_guard.mjs` + snapshot manifest; document in this blueprint or in [ZALS_DELIVERABLE_2_PROCUREMENT_PLAN.md](ZALS_DELIVERABLE_2_PROCUREMENT_PLAN.md).

---

## Part 4 — What Runs Where (PC vs NAS)

| Workload | Where | Notes |
| ---------------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Cursor IDE** | PC | Primary; workspace on NAS mount or sync. |
| **Zuno State Report** | PC | `node scripts/z_zuno_state_report.mjs` (VS Code task). |
| **Zuno Weekly Reflection** | PC | `python scripts/zuno_weekly_reflection.py`. |
| **Module Registry Sync** | PC | `node scripts/z_module_registry_sync.mjs`; writes to repo (on NAS). |
| **Folder Manager (snapshot)** | PC | `node scripts/z_folder_manager_guard.mjs snapshot`; vault can sync to NAS. |
| **Hygiene / Audits** | PC or NAS | PC: existing tasks. NAS: Docker jobs `reports_vault_refresh`, `core_engine_audit` (as in procurement plan). |
| **Git** | PC (clone on NAS) or NAS | Prefer PC for commit/push; NAS holds canonical clone + optional bare repo. |
| **Databases (e.g. Prisma, Redis)** | NAS (Docker) | Always-on; PC connects over LAN. |
| **Dashboards (live server)** | PC for dev | NAS can host read-only copy (e.g. static export) if desired. |
| **Z-EAII, Watchdog, Launcher** | PC | Can point to NAS paths for registry/ping targets. |
| **Heavy AI inference** | PC (64 GB RAM) | NAS can run lighter inference in Docker if needed. |

---

## Part 5 — AI Auto-Management: How the 100+ Modules Organize Themselves

Your existing Z-Sanctuary stack already provides the **logic** for AI-driven organization; the NAS adds **persistent storage and scheduled execution** so it stays manageable without constant manual work.

### 5.1 Building Blocks (Already in Repo)

| Component | Role in Auto-Management |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Zuno AI** | Daily/weekly state and reflection; single “state of the system” report. Feeds dashboard and governance. |
| **Module Registry** | `data/Z_module_registry.json` + `z_module_registry_sync.mjs` + audit. Single list of modules (id, name, layer, status, launchTask). Dashboard and scripts read it; **one source of truth** for “what exists.” |
| **Folder Manager** | Snapshots + policy; protects entrypoints; weekly retention. **Auto-archiving** of old snapshots (e.g. `z_folder_manager_weekly_retention.mjs --keep 30 --days 7`). |
| **Z-EAII** | Registry, ping, launcher, watchdog. Can treat NAS-mounted paths as targets; **auto-discovery** of services/modules. |
| **VS Code tasks** | Zuno State Report, Zuno Weekly Reflection, Folder Manager snapshot/recreate/status, Module Registry Sync, Hygiene, etc. **One-click or scheduled** from PC. |
| **Dashboard** | Control Centre, Panel Directory, Zuno 7-Day Trend. **Single pane** for operator; no need to hunt across folders. |

### 5.2 Automation Flows (Fully Auto-Manageable)

#### A) Daily (PC or NAS cron / Task Scheduler)

- Run **Z: Zuno State Report** → `zuno_system_state_report.json` + history.
- Run **Module Registry Sync** → refresh `Z_module_registry.json` and audit.
- Run **Folder Manager snapshot** (if policy says so) → new snapshot under vault; optional sync to NAS `Z_Archives/folder_manager_snapshots/`.
- Run **Hygiene / Storage Guard** → reports in `data/reports/`.

#### B) Weekly

- Run **Z: Zuno Weekly Reflection** → `z_weekly_reflection.md`.
- Run **Folder Manager weekly retention** → prune old snapshots; keep last N.
- Optional: **NAS Docker** job that pulls latest reports from PC (or reads from NAS-mounted repo) and refreshes a “vault” copy (reports_vault_refresh).

### C) On NAS (Docker + cron/SSH)

- **reports_vault_refresh:** Copy or sync `data/reports/` from workspace to NAS backup path; keeps NAS as report archive.
- **core_engine_audit:** Run audit script if deployed on NAS or trigger on NAS with repo mounted.
- **rsync/rclone:** PC → NAS backup of `Cursor Projects Organiser` or selected trees to `Z_Backups/pc_mktiger/`.
- **Snapshot schedule:** UGOS Pro native snapshots on Z-Vault share.

#### D) Module “self-organization”

- **Discovery:** Module registry is built from `Z_module_manifest.json` / `z_module_manifest.json`; add new modules there (or via future auto-scan), run **Module Registry Sync** → dashboard and all consumers see new/updated modules.
- **Classification:** Use `ZLayer`, `ZStatus`, `ZOwner` in manifest; dashboard and Zuno can show by layer/status. No need to manually move folders for “organization” — **organization is in the registry**.
- **Archiving:** Folder Manager retention + NAS `Z_Archives` = old snapshots and releases moved automatically; NAS holds long-term.

### 5.3 What “Fully Auto-Manageable by AI” Means Here

- **Zuno** = AI-observing layer: state and trends in one place; safe for daily review.
- **Registry + Dashboard** = one place to see and launch all modules; AI (or operator) uses the same registry.
- **Folder Manager + NAS** = snapshots and backups run on schedule; retention and archive are policy-driven.
- **Tasks + Docker** = no need to remember to run reports or backups; schedule them once.
- **Future:** Scripts or agents that **add/update manifest entries** from repo scan (e.g. new `docs/` or `apps/` folders) and then run Module Registry Sync → truly “modules organize themselves” as the repo grows.

---

## Part 6 — Security: Before Connecting NAS to Internet

Do in this order (as in your existing checklist):

1. Install drives and create RAID pool.
2. Create volume (e.g. Z-Vault) and folder layout (Part 2).
3. Create user accounts and permissions (least privilege).
4. Enable snapshots and backup targets.
5. Enable local-only mode; connect PC via 10GbE/2.5GbE.
6. Only **after** that consider external access (VPN, reverse proxy, or no internet at all for NAS).

---

## Part 7 — Product Notes (UGREEN NASync DXP4800 Plus)

- **Docker:** Docker 26.1 on UGOS Pro; Docker Compose supported. Use for reports_vault_refresh, core_engine_audit, DBs, rclone, etc.
- **Automation:** SSH + cron for custom scripts; UGOS snapshot scheduling in UI.
- **API:** No prominent public REST API; automate via SSH, SMB/NFS mounts from PC, and Docker containers.
- **AI features:** Device has AI-powered photo management (face/object, duplicates); for Z-Sanctuary, “AI” = your stack (Zuno, registry, dashboard, scripts) plus optional Dockerized inference on NAS.
- **Specs:** Intel Pentium Gold 8505, 8–64 GB DDR5, 2× M.2 NVMe (cache/index), 4× SATA, 10GbE + 2.5GbE — sufficient for Sanctuary as “data brain” and light services.

---

## Part 8 — References

| Doc | Content |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| [ZALS_DELIVERABLE_1_SHOPPING_CHECKLIST.md](ZALS_DELIVERABLE_1_SHOPPING_CHECKLIST.md) | NAS model, NVMe, HDD, UPS, 10GbE, integration order. |
| [ZALS_DELIVERABLE_2_PROCUREMENT_PLAN.md](ZALS_DELIVERABLE_2_PROCUREMENT_PLAN.md) | Waves A/B/C, burn-in gates, Docker jobs, timeline. |
| [Z-ZUNO-AI-FULL-REPORT.md](Z-ZUNO-AI-FULL-REPORT.md) | Zuno role, state report, dashboard, tasks. |
| [Z_SERVER_PATHWAY.md](Z_SERVER_PATHWAY.md) | Current local-only server path; NAS as next step. |
| `.vscode/tasks.json` | Z: Zuno State Report, Zuno Weekly Reflection, Folder Manager, Module Registry Sync. |

---

## Summary

- **PC (MKTIGER):** 64 GB RAM, Ryzen 7 7840HS — **future-ready** as terminal and local AI; runs Cursor, Zuno, registry, folder manager, hygiene.
- **NAS (DXP4800 Plus):** Central **storage + Docker** hub; RAID 5, snapshots, 10GbE; holds Sanctuary_Core, Z_AI_Engines, Z_Projects, Z_Backups, Z_Archives, Z_Datasets.
- **AI auto-management:** Zuno + Module Registry + Folder Manager + VS Code tasks + NAS Docker/cron = one coherent state, scheduled reports, snapshots, retention, and archive so the **100+ modules organize themselves** without you managing folders by hand.
- **Next step:** Install drives → RAID → layout (Part 2) → user accounts → snapshots → local-only PC link → then add Docker jobs and optional offsite mirror.

_Blueprint for Z-Sanctuary Universe. Integrate with Amk-Goku and existing AI design; update this doc as you deploy._
