# Z-Atlas Seed Inventory (current evidence only)

**Gate:** `Z-ATLAS-0-LIVING-MULTI-PROJECT-TOPOLOGY-CONSTITUTION`  
**Date:** 2026-09-10  
**Method:** Allowlisted path tests + existing registries/reports. **No PC crawl.**  
**This inventory is incomplete by design.** Absence from this list is not proof of non-existence.

Sources:

- Organiser `z-eaii-registry.json` (`generated_at` 2026-07-10; `lastUpdated` 2026-08-21)
- Hub `data/z_pc_root_projects.json` (potentially dirty; includes post-pointer `zwheel-cracker` row on this worktree)
- `docs/reconciliation/Z_WHEEL_HUB_POINTER_RECONCILIATION.md` (`HUB_POINTER_VALIDATION: PASS`)
- `docs/reconciliation/Z_ROULETTE_PRODUCT_IDENTITY_RECOVERY_AND_HUB_PATH_MAP.md`
- `docs/Z_WHEEL_CRACKER_EXTERNAL_SOVEREIGN_POINTER.md`
- `docs/Z_MULTI_PROJECT_DEPLOYMENT_READINESS_MATRIX.md`
- `Test-Path` of documented candidate paths on 2026-09-10 (this gate)

The four `docs/...` paths above are historical/source-worktree evidence references. They are not included in this Atlas custody PR and are not available as canonical-main links at this gate. Exact filenames/paths are preserved for traceability. Absence from this PR does not invalidate that historical evidence.

---

## 1. Proven roots

| Root | Class | Authority notes | Evidence |
| --- | --- | --- | --- |
| `C:\Cursor Projects Organiser` | `REGISTERED_ACTIVE` (pc_root / Organiser room) | Container, not a product | `z-eaii-registry.json`; `z_pc_root_projects.json` `pc_root` |
| `C:\Cursor Projects Organiser\Z_Sanctuary_Universe` | `REGISTERED_ACTIVE` | Canonical hub folder on disk | EAII registry; pc_root `zsanctuary-universe`; path exists |
| `C:\Cursor Projects Organiser\Z_Sanctuary_Universe 2` | `REGISTERED_ACTIVE` | Continuation tree; **not** SSWS hub | EAII + pc_root; path exists |
| `C:\Cursor Projects Organiser\Z-OMNI-Sanctuary` | `REGISTERED_ACTIVE` | Distinct Flask roulette dashboard | EAII + pc_root + identity recovery; path exists |
| `C:\Cursor Projects Organiser\Z_Labs` | `REGISTERED_ACTIVE` | Satellite | EAII + pc_root; path exists |
| `C:\Cursor Projects Organiser\AT Princess&Blackie Copilot` | `REGISTERED_ACTIVE` | Member | EAII + pc_root; path exists |
| `C:\Cursor Projects Organiser\Z-Sister Aisling Sol` | `REGISTERED_ACTIVE` | ÉirMind lineage on disk | EAII + pc_root; path exists |
| `C:\Cursor Projects Organiser\Z-SANCTUARY AI SKYSCRAPER` | `REGISTERED_ACTIVE` | Member | EAII + pc_root; path exists |
| `C:\Cursor Projects Organiser\Z-Sanctuary Claude` | `REGISTERED_ACTIVE` | Member | EAII + pc_root; path exists |
| `C:\Cursor Projects Organiser\z-Sanctuary-Aimanity` | `REGISTERED_ACTIVE` | Member | EAII + pc_root; path exists |
| `C:\Cursor Projects Organiser\Z-Sanctuary_Replit` | `REGISTERED_ACTIVE` | Parent of local RDA | EAII + pc_root; path exists |
| `C:\Cursor Projects Organiser\Z-Sanctuary_Replit\Roulette-Data-Analyzer` | `REGISTERED_ACTIVE` (nested product root) | **DISTINCT PRODUCT**; nested git; hub member | Identity recovery; path exists |
| `C:\Cursor Projects Organiser\Amk-Goku Vaults` | `REGISTERED_ACTIVE` | Member | EAII + pc_root; path exists |
| `C:\Cursor Projects Organiser\Z-Sanctuary G` | `REGISTERED_ACTIVE` | Member | EAII + pc_root; path exists |
| `C:\Cursor Projects Organiser\Z-Sanctuary Gem` | `REGISTERED_ACTIVE` | Member | EAII + pc_root; path exists |
| `C:\Cursor Projects Organiser\Z-WorkSphere_Marketplace_Hub` | `REGISTERED_ACTIVE` | Commerce HOLD (existing posture) | EAII + pc_root; path exists |
| `C:\Cursor Projects Organiser\Z-sanctuary External PaaS` | `REGISTERED_ACTIVE` | Hosting experiments; no deploy without charter | EAII + pc_root; path exists |
| `C:\Cursor Projects Organiser\Z-Sancurary _Pets Care Compassion` | `REGISTERED_ACTIVE` (stub visibility) | Stub member | EAII + pc_root; path exists |
| `C:\Cursor Projects Organiser\Extras & Tools` | `REGISTERED_ACTIVE` (sink, not product) | Installers/tools sink | EAII + pc_root; path exists |
| `C:\Z-Wheel Cracker` | `EXTERNAL_SOVEREIGN` | Product **ZWheel Cracker**; ZW-v37; hub source **NONE** | Pointer recon + pointer doc + path exists |
| `C:\ZGame Intelligence` | `EXTERNAL_SOVEREIGN` | Commercial umbrella; not ZWheel source | Identity recovery + readiness matrix + path exists |
| `C:\Z-Wheel Traker` | `LEGACY_READ_ONLY` | WheelTrack predecessor evidence | Identity recovery + path exists |
| `C:\Z-Wheel-Cracker-PRE-ORGANISER-BACKUP` | `ARCHIVAL_BACKUP` | Superseded copy; not current v37 authority | Identity recovery + path exists |
| `C:\Cursor Projects Organiser\Super-Saiyan-Roulette-Pro-App` | `EXTERNAL_SOVEREIGN` | **DISTINCT PRODUCT**; Organiser sibling git; **not** in EAII project list; **not** a pc_root member path | Identity recovery + path exists |

### Worktree (not a separate product root)

| Path | Relation | Class |
| --- | --- | --- |
| `C:\Cursor Projects Organiser\Z_Sanctuary_Universe_wt_sidework0` | Hub `HAS_WORKTREE` · branch `cursor/zsanctuary/multi-project-deploy-readiness-audit-0` | Checkout of hub; documentation custody for this gate |

Other ZSU worktrees were counted in identity recovery (38 observed via `git worktree list`) but are **not enumerated here**. Enumeration of all worktrees is Phase 1.5.

---

## 2. Proven missing / stale paths

| Path / id | Class | Notes |
| --- | --- | --- |
| `C:\Cursor Projects Organiser\ZSanctuary_Universe` (no underscore drift) | `MISSING` | Test-Path false; identity recovery |
| `C:\Cursor Projects Organiser\Z-Wheel Cracker` | `MISSING` / stale backup claim | Test-Path false; backup `CANONICAL_MOVED.md` deferred |
| Hub `apps/roulette` | `MISSING` / `STALE_REFERENCE` | Not recreated; module `ZStatus: stale` after pointer gate |
| pc_root `z-sanctuary-browser-z-saiyan-lumina` | `MISSING` (registry) | `path_missing` in pc_root; disk not re-crawled beyond registry |
| pc_root `eirmind-ireland-projects-missing` | `MISSING` (registry) | Former Ireland Projects path absent per pc_root notes |
| pc_root `amk-goku-dashboards-2` | `UNRESOLVED` | `path` empty; `path_unregistered`; no invented root |

---

## 3. Discovered but unregistered (do not auto-trust)

| Path | Class | Why not REGISTERED_ACTIVE |
| --- | --- | --- |
| `C:\Cursor Projects Organiser\Z-Family Health` | `UNRESOLVED` | Path exists (named in readiness matrix). **Not** in EAII `projects[]`. **Not** in sealed pc_root roster. Matrix: `IDENTITY_RECOVERY_REQUIRED`. Do not ingest. |

---

## 4. Gaming intelligence — kept separate

| Product | Root | Atlas class | Hub relationship |
| --- | --- | --- | --- |
| ZWheel Cracker | `C:\Z-Wheel Cracker` | `PRODUCT` `EXTERNAL_SOVEREIGN` | `REFERENCES` only (`zwheel-cracker` row, `path: ""`) |
| Super-Saiyan Roulette Pro App | `C:\Cursor Projects Organiser\Super-Saiyan-Roulette-Pro-App` | Distinct `PRODUCT` | GitHub identity pointer; not pc_root member |
| Roulette-Data-Analyzer | `…\Z-Sanctuary_Replit\Roulette-Data-Analyzer` | Distinct `PRODUCT` | Nested sovereign git; parent folder is hub member |
| Hub `roulette` / `roulette-calculator` | missing / stub | `MODULE` `REFERENCE_ONLY` | Metadata / historical; **not** the three products |

`ROULETTE_PRODUCT_IDENTITY_COLLAPSE: ABSENT` (pointer report).

Commercial: ZWheel → ZGame Intelligence (REGISTERED contract, `NOT_AUTHORIZED`). SSR/RDA ZGI placement remains candidate / undecided. **ZGI Commercial Core not activated.**

---

## 5. Registry drift / UNVERIFIED completeness

| Item | Status |
| --- | --- |
| Organiser `z-eaii-registry.json` vs hub `zwheel-cracker` row | Drift: Organiser master has **no** ZWheel project (pointer report SCHEMA_LIMITATION) |
| Nested hub copy `Z_Sanctuary_Universe/Z_Sanctuary_Universe 2` vs PC-root sibling | Dual continuation paths documented in pc_root; canonical continuation **UNRESOLVED** pending Steward |
| Duplicate pc_root ids `at-princess-blackie-copilot` / `at-princess-blackie-copitol` | Same path; consolidate when human-gated |
| Retired stub `ZSanctuary_Universe` pc_root row | Registry row exists; Organiser path `ZSanctuary_Universe` Test-Path **false** this session |
| Completeness of all PC folders | **UNVERIFIED** — this gate did not crawl Organiser or `C:\` |
| Live process health (ports 8080 / 5190 / 5502 / 8888) | **UNVERIFIED** this gate |
| DNS liveness of declared domains | **UNVERIFIED**. Domain ownership/current DNS state was not re-verified by this Atlas slice. ownership state: NOT RE-VERIFIED IN THIS SLICE · DNS liveness: UNVERIFIED · deployment state: NOT INFERRED |
| Named systems PID / Z-CLDO / Z-PACE | **UNVERIFIED** on this worktree |

---

## 6. Conflicts carried forward (no automatic fix)

From identity recovery / pointer reconciliation (selected):

| Conflict | Owner | Recommended posture |
| --- | --- | --- |
| ZGI start-here ZW-v35 vs on-disk ZW-v37 | ZGame Intelligence | Next identity gate on **that** tree — not Atlas auto-fix |
| Backup `CANONICAL_MOVED.md` Organiser path | Backup tree | Deferred; do not move |
| SSR README vs reconstruction FACT | SSR Pro App | Product-owned |
| RDA Stripe / staging HOLD | RDA | Product-owned |
| Port 8080 claimed by ZWheel and RDA API default | Both products | Collision, not sameness |
| SSR local path exists but not pc_root-registered | Hub registry (later) | Steward review — not auto-register |

---

## Caveat

Proven ≠ complete. Registered ≠ healthy. Existing ≠ canonical. Similar name ≠ same product.
