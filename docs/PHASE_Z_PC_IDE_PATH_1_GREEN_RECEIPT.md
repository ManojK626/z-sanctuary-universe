# PHASE Z-PC-IDE-PATH-1 — Green receipt

Scope delivered:

- read-only IDE path checker (`npm run z:pc:ide-path`)
- doctrine doc for Explorer vs CLI vs doorway posture
- report outputs (`data/reports/z_pc_ide_path_*`)
- package script + doorway registry pointer + indicators row + INDEX / doorway / AI Builder links

Forbidden in this phase: Windows registry edits, software install/repair automation, IDE auto-launch, secrets, bridges, billing, vault runtime, `.cursor/projects` edits, deploy.

## Core artifacts

- `docs/Z_PC_IDE_PATH_HEALTH_CHECK.md`
- `scripts/z_pc_ide_path_check.mjs`
- `data/reports/z_pc_ide_path_report.json`
- `data/reports/z_pc_ide_path_report.md`

## Commands

```bash
npm run z:pc:ide-path
npm run verify:md
npm run z:traffic
npm run z:car2
```

## Acceptance

- Checker exits **0** on GREEN/YELLOW; **1** only on RED.
- `npm run verify:md` passes after docs land.
- No automated registry or installer behavior added.

## Rollback

Remove `z:pc:ide-path` script and rollback files touched in this phase (script, docs, doorway registry snippet, indicators row, INDEX/AI*BUILDER_CONTEXT/DOORWAY references), delete generated reports under `data/reports/z_pc_ide_path*\*`, then rerun `npm run verify:md`and`npm run dashboard:registry-verify`.
