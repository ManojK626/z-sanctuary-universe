# PHASE_Z_SSWS_COCKPIT_1 — Green receipt

**Phase:** Z-SSWS-COCKPIT-1
**Intent:** Workspace cockpit orchestration (registry + read-only checker + reports + dashboard indicator).
**Sacred stance:** Same as Turtle Mode hub doctrine — **no auto-launch, no mounts, no deploy, no provider calls, no secrets automation.**

## Sealed artifacts

| Artifact | Responsibility |
| --- | --- |
| `docs/Z_SSWS_SUPER_SAIYAN_WORKSPACE_COCKPIT.md` | Doctrine + cockpit vs deep-work model |
| `data/z_ssws_cockpit_registry.json` | Machine-truth posture for disks, modes, storage declarations |
| `scripts/z_ssws_cockpit_status.mjs` | Validator that mirrors IDE PATH + fusion reports |
| `data/reports/z_ssws_cockpit_report.{json,md}` | Operator evidence |
| Dashboard row `z_ssws_super_saiyan_cockpit` | Read-only posture chip surface |

## Commands

```bash
node -e "JSON.parse(require('fs').readFileSync('data/z_ssws_cockpit_registry.json','utf8')); console.log('Z SSWS cockpit registry OK')"
npm run z:ssws:cockpit
```

## Acceptance checklist

- Cockpit checker writes reports under `data/reports/` only.
- **No** scripting change opens IDEs automatically from this validator.
- **No** NAS or Cloudflare live enablement ships from Phase 1 JSON defaults.
- **Exit 1** occurs only when **RED** posture (Phase 1 law breach).
- BLUE may appear when registry declares **commercial / AMK-blue** placements while still respecting dry-run posture.

## Rollback

Revert `data/z_ssws_cockpit_registry.json`, this receipt, cockpit script/doc links, autonomy row, npm script entry, dashboard indicator overlay, and `amk_workspace_doorway_registry.json` / `amk_cursor_workspace_profiles.json` pointer blocks added for this phase.
