# Z-Atlas Root Registry Specification

**Gate:** `Z-ATLAS-0-LIVING-MULTI-PROJECT-TOPOLOGY-CONSTITUTION`  
**Model only.** No scanner, no automatic registration, no path repair.

Machine-readable topology instances belong to a later gate  
(`Z-ATLAS-0.5-MACHINE-READABLE-TOPOLOGY-REGISTRY`). This document defines the **allowlist law**.

Phase 0.5 slice (not authority; does not replace this spec): [Z_ATLAS_REGISTRY_V0_5.md](Z_ATLAS_REGISTRY_V0_5.md) · [../../data/z_atlas/z_atlas_registry_v0_5.json](../../data/z_atlas/z_atlas_registry_v0_5.json)

---

## 1. Allowlist law

```text
KNOWN ROOT → REGISTERED → OBSERVABLE
NEW ROOT  → DISCOVERED → UNREGISTERED → STEWARD REVIEW → REGISTER / REJECT
```

Never:

```text
DISCOVERED → AUTOMATICALLY TRUSTED
```

Discovery does not authorize ingestion. Similar folder names do not join the allowlist.

---

## 2. Root classification

Every proven root is exactly one of:

| Class | Meaning |
| --- | --- |
| `REGISTERED_ACTIVE` | Present on disk **and** present in an existing hub/Organiser registry as a living member or hub |
| `EXTERNAL_SOVEREIGN` | Proven product/commercial root whose source is **not** hub-owned |
| `LEGACY_READ_ONLY` | Predecessor evidence tree; observe only |
| `ARCHIVAL_BACKUP` | Superseded copy; not current authority |
| `UNRESOLVED` | Path mentioned or found, but identity/registration/authority not proven |

Do not coerce `UNRESOLVED` into `REGISTERED_ACTIVE` or `CANONICAL`.

---

## 3. Existing registries to reuse (not fork)

| Registry | Path | Atlas use |
| --- | --- | --- |
| Organiser master | `C:\Cursor Projects Organiser\z-eaii-registry.json` | PC-root project list / openAllPaths |
| Hub PC-root | `data/z_pc_root_projects.json` | Treat as **potentially dirty**; consume, do not edit in this gate |
| GitHub identity | `data/z_ecosystem_github_identity.json` | Remote identity, not local ownership |
| Module manifest / registry | `data/z_module_manifest.json` · `data/Z_module_registry.json` | Module pointers, including stale ones |

Atlas Phase 0.5 may **project** these into topology nodes. It must not replace them.

---

## 4. Schema limitations (inherited, not redesigned)

From historical/source-worktree evidence `docs/reconciliation/Z_WHEEL_HUB_POINTER_RECONCILIATION.md` (not included in this Atlas custody PR; not available as a canonical-main link at this gate):

1. `z_pc_root_projects.json` `path` is **Organiser-relative**. An absolute external root (e.g. `C:\Z-Wheel Cracker`) must **not** be stored as `path` (that would fake Organiser membership). Canonical external roots live in notes + pointer docs until a later schema charter.
2. There is no first-class `EXTERNAL_SOVEREIGN_PRODUCT` role enum today. Hub uses `role: external` + `hosting: link-only` + `migration_status: reference_only`.
3. Derived census files and Organiser master may lag hub pointer rows. Lag is a **documented drift**, not a license to auto-sync.

---

## 5. Observation scope

Observable means: **Test-Path or read of an allowlisted registered/documented root**.

Not allowed as Atlas runtime (and not created in Phase 0):

- recursive PC / `C:\` crawl
- background watcher
- autonomous scanner
- automatic project registration
- automatic path repair

---

## 6. Worktrees and branches

A worktree is **not** a new product root.

Example (this gate’s custody tree):

- Repository / hub folder: `C:\Cursor Projects Organiser\Z_Sanctuary_Universe`
- Evidence worktree: `C:\Cursor Projects Organiser\Z_Sanctuary_Universe_wt_sidework0`
- Edge: hub `HAS_WORKTREE` sidework0
- Branch (as recorded by pointer report): `cursor/zsanctuary/multi-project-deploy-readiness-audit-0`

Do not classify a worktree as `REGISTERED_ACTIVE` product merely because documentation was written there.

---

## 7. Seed application

See [Z_ATLAS_SEED_INVENTORY.md](Z_ATLAS_SEED_INVENTORY.md) for current-evidence classifications.  
That inventory is docs-only and incomplete by design.

---

## Verdict

```text
Z_ATLAS_ROOT_REGISTRY_SPEC: PASS
Z_ATLAS_ALLOWLIST_DISCOVERY_MODEL: PASS
```
