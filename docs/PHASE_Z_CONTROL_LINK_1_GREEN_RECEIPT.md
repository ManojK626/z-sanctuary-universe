# Phase Z-CONTROL-LINK-1 — Green receipt (satellite control link sync)

**Scope.** Hub-owned script that syncs the **thin** canonical bridge file `docs/Z_SANCTUARY_CONTROL_LINK.md` into **manifest-approved** satellite project folders only. No scanning of arbitrary PC trees; no package, secret, env, git, deploy, NAS-mutation, or Cursor-settings changes.

## Deliverables

| Item | Path |
| -------------------------- | ----------------------------------------------------------------------------------------------- |
| Manifest | [`data/z_satellite_control_link_manifest.json`](../data/z_satellite_control_link_manifest.json) |
| Sync script | [`scripts/z_sync_control_links.mjs`](../scripts/z_sync_control_links.mjs) |
| Reports (generated) | `data/reports/z_control_link_sync_report.json`, `data/reports/z_control_link_sync_report.md` |
| Template (source of truth) | [`docs/Z_SANCTUARY_CONTROL_LINK.md`](Z_SANCTUARY_CONTROL_LINK.md) |

## Behavior summary

| Mode | CLI |
| ----------------- | ------------------------------------------------------------------------ |
| Dry-run (default) | `npm run z:control-links:dry` or `node scripts/z_sync_control_links.mjs` |
| Apply writes | `npm run z:control-links:apply` |

Guard rules:

- Targets come **only** from the manifest (`satellites[]`).
- `bridge_path` must stay under the satellite root (no `..` segments, no absolute bridge paths).
- Entries with `enabled: false`, `status: RED`, missing NAS root (`NAS_WAIT` / `nas_required`), or invalid paths are skipped with reasons in the report.
- Writes are **only** the bridge markdown file; `docs/` is created under the satellite root when applying.

## Gates run

- `npm run verify:md`
- `npm run z:control-links:dry`
- `npm run z:traffic`
- `npm run z:car2`

### Evidence

```text
2026-05-11: npm run verify:md — pass
2026-05-11: npm run z:control-links:dry — ok (dry-run; reports under data/reports/)
2026-05-11: npm run z:traffic — ok (signal per machine state)
2026-05-11: npm run z:car2 — ok; files_scanned: 3251
```

## Posture checklist

| Check | Confirm |
| ---------------------------------------------------- | ------- |
| No writes outside manifest paths | Yes |
| No package/env/git/deploy/NAS/Cursor config mutation | Yes |
| Default is dry-run | Yes |

**Seal:** Control-link sync is a **bridge file** tool only; hub governance and sacred-move gates remain unchanged.
