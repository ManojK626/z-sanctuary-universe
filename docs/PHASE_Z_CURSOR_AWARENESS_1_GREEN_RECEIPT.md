# Phase Z-CURSOR-AWARENESS-1 — Green receipt (Cursor control-link awareness)

**Formal scope:** Cursor and hub AI guidance updated so **Z-CONTROL-LINK-1** (sealed on `main`) is explicit: **`Z_Sanctuary_Universe` is the canonical control root**; satellites hold **thin** `docs/Z_SANCTUARY_CONTROL_LINK.md` bridges only; sync is **manifest-bound** and **dry-run by default**.

## Deliverables

| Item | Location |
| --- | --- |
| Cursor rule | [`.cursor/rules/z_control_root_awareness.mdc`](../.cursor/rules/z_control_root_awareness.mdc) |
| AI Builder context | [`docs/AI_BUILDER_CONTEXT.md`](AI_BUILDER_CONTEXT.md) |
| This receipt | [`docs/PHASE_Z_CURSOR_AWARENESS_1_GREEN_RECEIPT.md`](PHASE_Z_CURSOR_AWARENESS_1_GREEN_RECEIPT.md) |

## Normative references (already on main)

| Asset | Role |
| --- | --- |
| [`docs/Z_SANCTUARY_CONTROL_LINK.md`](Z_SANCTUARY_CONTROL_LINK.md) | Hub template for satellite bridge markdown |
| [`data/z_satellite_control_link_manifest.json`](../data/z_satellite_control_link_manifest.json) | Approved satellite roots and bridge path |
| [`scripts/z_sync_control_links.mjs`](../scripts/z_sync_control_links.mjs) | Dry-run / apply bridge sync (no arbitrary PC scan) |

## Posture checklist

| Check | Confirm |
| --- | --- |
| Canonical control root is the hub (`Z_Sanctuary_Universe`) | Yes |
| Satellites: thin bridge file path only (`docs/Z_SANCTUARY_CONTROL_LINK.md`) | Yes |
| Default sync mode is dry-run (`npm run z:control-links:dry`) | Yes |
| No writes outside manifest-approved targets | Yes — enforced in sync script |
| No deploy / domain bind / secrets / extensions / services / NAS mutation from this lane | Yes — policy + operator discipline |
| NAS targets remain NAS_WAIT until mounted and verified | Yes — manifest + script outcomes |
| Z-DOORWAY-2: open approved workspaces only, no builds or deploys | Yes — see [`AMK_PROJECT_DOORWAY_LAUNCHER.md`](AMK_PROJECT_DOORWAY_LAUNCHER.md) |

## Gates run (required)

- `npm run verify:md`
- `npm run z:control-links:dry`
- `npm run z:traffic`
- `npm run z:car2`

Evidence (hub gates from repo root):

```text
2026-05-11: verify:md pass; z:control-links:dry ok (mode=dry-run); z:traffic overall_signal GREEN; z:car2 ok (files_scanned: 3252)
```

Re-run the four commands above and refresh this block after edits to this receipt or to the awareness docs.

## Rollback

Revert the three deliverable files on your branch or `git restore` them; no runtime state is changed by this phase alone (apply sync is a separate, explicit operator step).
