# Z-MDE — Module Deduplication & Evolution Engine

**Lane:** Z-MDE (doctrine + policy registry; advisory only)  
**Hub:** Z-Sanctuary Universe

## Purpose

Z-MDE is an **advisory engine** that checks **incoming module ideas** before build so the ecosystem does not silently duplicate capability, routes, or governance truth.

Z-MDE observes, compares, and recommends. **AMK-Goku** (or delegated human reviewers) decide what to build, merge, archive, or block.

## Standing law

```text
Observe → Verify → Suggest → Human decides
```

Overlap score ≠ permission to merge.  
Recommendation ≠ registry write.  
Research ≠ production deploy.

## Classification labels (required)

| Label | Meaning | Typical human action |
| --- | --- | --- |
| `NEW` | No material overlap in scanned registries | Proceed to charter + Turtle branch if approved |
| `OVERLAP` | Similar capability exists; not yet merge-safe | Review lead module; document boundary |
| `MERGE_CANDIDATE` | Docs/registry consolidation may suffice | Merge docs only first; code merge separate charter |
| `ARCHIVE_CANDIDATE` | Superseded or duplicate lane | Archive with receipt; do not delete silently |
| `RESEARCH_ONLY` | Symbolic, risky, or unchartered | Mock/docs/simulation only |
| `BLOCKED_UNSAFE` | Conflicts safety, payment, identity, deploy law | Stop lane; escalate to Hierarchy Chief |

## Scan surfaces (read-only inputs)

Z-MDE **reads** these truth sources; it does not mutate them without human-approved PRs:

| Surface | Path / command (operator) |
| --- | --- |
| Module manifest | `data/z_module_manifest.json` |
| Master Register | `docs/Z-MASTER-MODULES-REGISTER.md` |
| Engine registry | `data/z_core_engines_registry.json` |
| Dashboard routes / registry | `data/z_mdg_dashboard_registry.json`, `npm run dashboard:registry-verify` |
| Local gateway | `data/z_local_gateway_registry.json`, `npm run z:local:gateway:check` |
| Docs index | `docs/INDEX.md`, `docs/AI_BUILDER_CONTEXT.md` |
| PC root / EAII roster | `data/z_pc_root_projects.json` (when present) |
| Cross-project capability | `docs/Z_AI_FUSION_CAPABILITY_MAP.md` |
| Fusion dedup policy | `docs/Z_AI_FUSION_DEDUP_AND_ROLE_POLICY.md` |
| CAR² similarity (optional) | `npm run z:car2` → `data/reports/z_car2_similarity_report.json` |
| Monster project map | `data/z_sanctuary_monster_project_registry.json` |

Machine policy: `data/z_module_deduplication_policy.json`.

## Workflow

```text
Incoming idea/module
  → Registry scan (manifest, register, indexes)
  → Similarity check (CAR² / fusion map / manual diff)
  → Capability comparison (routes, ports, engines)
  → Governance check (14 DRP, Turtle Mode, sacred boundaries)
  → Recommendation + receipt
  → Human decision
```

## Allowed outputs

Z-MDE may produce (manual or future scripted receipts):

- module similarity report (markdown or JSON under `data/reports/` only when chartered)
- reuse recommendation (extend existing module vs fork)
- merge suggestion (**docs/registry first** by default)
- archive suggestion (with rollback note)
- **build new** recommendation when `NEW` and chartered
- affected project list (hub vs satellite)
- missing capability list (gaps for Full Build Checklist)

## Forbidden actions

Z-MDE must **not**:

- delete modules or folders
- auto-build or auto-deploy modules
- rename projects without charter
- rewrite registries silently
- merge code without PR and human review
- decide final truth over Hierarchy Chief or Z-Super Overseer posture

## Relationship to other layers

| Layer | Relationship |
| --- | --- |
| Z-PGMO | PGMO tracks project phase; MDE classifies **incoming modules** |
| Z-ACN/MTEH | New modules still follow register + manifest path after MDE `NEW` |
| Z-AI-FUSION-MAP | Fusion handles AI overlap; MDE handles **module** overlap |
| Z-CAR² | Quantitative similarity input; not automatic merge authority |
| Turtle Mode | One domain per PR; MDE advises before branch opens |

## Operator checklist (before build)

1. Record working title + one-line purpose.
2. Run registry scan paths in table above.
3. Assign one classification label (or `OVERLAP` + notes).
4. If `MERGE_CANDIDATE` or multi-entity overlap, run **Z-FUSION** second ([Z_FUSION_CO_DESIGN_ENGINE.md](./Z_FUSION_CO_DESIGN_ENGINE.md)) — MDE asks “does it exist?”; FUSION asks “should parts combine?”
5. If `MERGE_CANDIDATE`, default to **docs-only** merge PR first.
6. Log human decision in green receipt or phase doc.
7. Only then open `cursor/zsanctuary/…` implementation branch.

## Related

- [Z_FUSION_CO_DESIGN_ENGINE.md](./Z_FUSION_CO_DESIGN_ENGINE.md) — runs after MDE for co-design (not dedup)
- [Z_SAFE_BACKUP_AND_SOURCE_ARCHIVE_POLICY.md](./Z_SAFE_BACKUP_AND_SOURCE_ARCHIVE_POLICY.md)
- [Z_AI_FUSION_DEDUP_AND_ROLE_POLICY.md](./Z_AI_FUSION_DEDUP_AND_ROLE_POLICY.md)
- [Z-NEW-MODULE-DISCIPLINE.md](./Z-NEW-MODULE-DISCIPLINE.md)
- [data/z_module_deduplication_policy.json](../data/z_module_deduplication_policy.json)
