# Z-Project Identity Observe Status (PID-1B)

**Generated:** 2026-08-20T08:21:22.036Z
**Signal:** BLUE
**Case tests:** PASS

## Marking

```text
DERIVED · READ-ONLY · REBUILDABLE · LOCAL_ONLY · NOT A REGISTRY · NOT MEMBERSHIP AUTHORITY · NOT CANONICAL AUTHORITY
```

## Authority

- Contract: `docs/Z_PROJECT_IDENTITY_RELATIONSHIP_CONTRACT.md`
- Trusted input map: `docs/Z_PROJECT_IDENTITY_TRUSTED_INPUT_MAP.md`
- Not connected to: Overseer, Cycle Observe, indicators, Doorway, Mission Control, Lifeboat apply

## Git worktrees

Primary: `C:\Cursor Projects Organiser\Z_Sanctuary_Universe`
Linked (WORKTREE_OF): **3**

- `C:/Cursor Projects Organiser/Z_Sanctuary_Universe_wt_ggaesp_evolve_e1` · refs/heads/cursor/zsanctuary/ggaesp-evolve-e3-fusion-mock · `36c396b5017f50f93cb2421a197c5c813b856d9d`
- `C:/Cursor Projects Organiser/Z_Sanctuary_Universe_wt_integrity_reverify` · refs/heads/cursor/zsanctuary/integrity-audit-reverify-2026 · `36c396b5017f50f93cb2421a197c5c813b856d9d`
- `C:/Cursor Projects Organiser/Z_Sanctuary_Universe_wt_sidework0` · refs/heads/cursor/zsanctuary/amk-cursor-steward-protocol-1 · `6590f407147fce412eac40d11d99169c6f9e29ab`

## Registry summary

- Empty path: amk-goku-dashboards-2, eirmind-ireland-projects-missing, replit-roulette-z-amk-goku-mdcp, z-sanctuary-browser-z-saiyan-lumina
- Declared path missing on disk: (none)
- U2 HOLD: z-sanctuary-universe-2, z-sanctuary-universe-2-continuation

## Case tests

| Case | Expected | Pass |
| --- | --- | --- |
| case_hub_worktrees | WORKTREE_OF · not members | PASS |
| case_lumina_missing_path | CANONICAL_PATH_MISSING · no promote | PASS |
| case_universe_2_hold | HOLD_UNCLASSIFIED · not CONTINUATION_OF | PASS |
| case_gem_d2_similarity | POSSIBLE_RELATIONSHIP · no bind | PASS |
| case_ssr_family_awareness | KNOWN awareness · not MEMBER | PASS |
| case_astralis_oisela_external | EXTERNAL · NOT MISSING | PASS |

## Findings (conservative)

### WORKTREE_OF · `C:/Cursor Projects Organiser/Z_Sanctuary_Universe_wt_ggaesp_evolve_e1`

- case: hub_worktree
- trust: TRUSTED_STRUCTURAL
- related_to: `z-sanctuary-universe`
- note: Worktree ≠ organism · not a PC-root member
- evidence: git worktree · branch=refs/heads/cursor/zsanctuary/ggaesp-evolve-e3-fusion-mock · HEAD=36c396b5017f50f93cb2421a197c5c813b856d9d

### WORKTREE_OF · `C:/Cursor Projects Organiser/Z_Sanctuary_Universe_wt_integrity_reverify`

- case: hub_worktree
- trust: TRUSTED_STRUCTURAL
- related_to: `z-sanctuary-universe`
- note: Worktree ≠ organism · not a PC-root member
- evidence: git worktree · branch=refs/heads/cursor/zsanctuary/integrity-audit-reverify-2026 · HEAD=36c396b5017f50f93cb2421a197c5c813b856d9d

### WORKTREE_OF · `C:/Cursor Projects Organiser/Z_Sanctuary_Universe_wt_sidework0`

- case: hub_worktree
- trust: TRUSTED_STRUCTURAL
- related_to: `z-sanctuary-universe`
- note: Worktree ≠ organism · not a PC-root member
- evidence: git worktree · branch=refs/heads/cursor/zsanctuary/amk-cursor-steward-protocol-1 · HEAD=6590f407147fce412eac40d11d99169c6f9e29ab

### CANONICAL_PATH_MISSING · `amk-goku-dashboards-2`

- case: empty_registry_path
- trust: TRUSTED_STRUCTURAL
- note: No auto-promote of another disk copy
- evidence: pc_root.path empty
- evidence: hosting=link-only
- evidence: migration_status=path_unregistered

### CANONICAL_PATH_MISSING · `eirmind-ireland-projects-missing`

- case: empty_registry_path
- trust: TRUSTED_STRUCTURAL
- note: No auto-promote of another disk copy
- evidence: pc_root.path empty
- evidence: hosting=missing
- evidence: migration_status=path_missing

### CANONICAL_PATH_MISSING · `replit-roulette-z-amk-goku-mdcp`

- case: empty_registry_path
- trust: TRUSTED_STRUCTURAL
- note: No auto-promote of another disk copy
- evidence: pc_root.path empty
- evidence: hosting=replit
- evidence: migration_status=registered_linked

### HOLD_UNCLASSIFIED · `z-sanctuary-universe-2`

- case: universe_2_ambiguity
- trust: DIRTY_UNSEALED
- related_to: `z-sanctuary-universe`
- note: Dirty/unsealed U2 labels ignored as governance authority · HOLD
- evidence: registry.role=continuation_active (not sealed CONTINUATION_OF / BACKUP_OF)
- evidence: path=Z_Sanctuary_Universe 2

### HOLD_UNCLASSIFIED · `z-sanctuary-universe-2-continuation`

- case: universe_2_ambiguity
- trust: DIRTY_UNSEALED
- related_to: `z-sanctuary-universe`
- note: Dirty/unsealed U2 labels ignored as governance authority · HOLD
- evidence: registry.role=hub_backup_slice (not sealed CONTINUATION_OF / BACKUP_OF)
- evidence: path=Z_Sanctuary_Universe/Z_Sanctuary_Universe 2

### CANONICAL_PATH_MISSING · `z-sanctuary-browser-z-saiyan-lumina`

- case: empty_registry_path
- trust: TRUSTED_STRUCTURAL
- note: No auto-promote of another disk copy
- evidence: pc_root.path empty
- evidence: hosting=missing
- evidence: migration_status=path_missing

### POSSIBLE_RELATIONSHIP · `z-sanctuary-gem`

- case: gem_d2_package_similarity
- trust: OBSERVATIONAL_ONLY
- related_to: `amk-goku-dashboards-2`
- note: PACKAGE NAME ≠ CANONICAL AUTHORITY · no SAME_PROJECT / alias
- evidence: package.json name=amk-goku-dashboards-2
- evidence: ≠ identity bind to registry id amk-goku-dashboards-2

### HOLD_UNCLASSIFIED · `super-saiyan-roulette-pro-app`

- case: known_awareness_not_member
- trust: TRUSTED_STRUCTURAL
- note: SSR: known awareness state · no membership grant
- evidence: disk_exists=true
- evidence: path=C:\Cursor Projects Organiser\Super-Saiyan-Roulette-Pro-App
- evidence: pc_root_member_row=false
- evidence: KNOWN ≠ MEMBER

### HOLD_UNCLASSIFIED · `z-family-health`

- case: known_awareness_not_member
- trust: TRUSTED_STRUCTURAL
- note: Z-Family Health: known awareness state · no membership grant
- evidence: disk_exists=true
- evidence: path=C:\Cursor Projects Organiser\Z-Family Health
- evidence: pc_root_member_row=false
- evidence: KNOWN ≠ MEMBER

### EXTERNAL · `astralis`

- case: external_not_missing
- trust: TRUSTED_CANON
- note: ASTRALIS: external organism · not a missing Sanctuary citizen
- evidence: PID-0.5 case table · EXTERNAL ≠ MISSING
- evidence: No Organiser incorporation · no registry membership inferred

### EXTERNAL · `z-oisela`

- case: external_not_missing
- trust: TRUSTED_CANON
- note: Z-Oisela: external organism · not a missing Sanctuary citizen
- evidence: PID-0.5 case table · EXTERNAL ≠ MISSING
- evidence: No Organiser incorporation · no registry membership inferred

## Rebuild

```bash
npm run z:project-identity:observe
```
