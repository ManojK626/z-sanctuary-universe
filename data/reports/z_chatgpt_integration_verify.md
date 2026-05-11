# ChatGPT integration verify

Generated: 2026-04-17T20:47:37.233Z

## Summary

- Entries tracked: **28**
- Duplicate hub paths: **0**
- Manifest similarity warnings: **11**
- Rename history rows: **0**
- Folders under docs/chatgpt_exports/: **0**
- Export folder drift (sidecar vs `export_folder`): **0**
- Sidecar unknown id: **0** · duplicate id: **0**
- Tracking `export_folder` missing on disk: **0** · orphan export folders: **0**

## Export folders (automatic alignment)

Sidecar file per folder: `docs/chatgpt_exports/<folder>/.z-chatgpt-tracking.json` with `{ "ZFormat": "v1", "id": "<entry id>" }`. After a **rename on disk**, update **`export_folder`** in tracking to match; the sidecar **id** stays the same so verify can detect drift.

### Drift / alignment

- none

### Sidecar errors

- none

### Missing export folder on disk

- none

### Orphan export folders (no export_folder + no valid sidecar link)

- none

### Fuzzy link suggestions (confirm manually)

- none

## Duplicate hub_doc_path (must fix)

- none

## Manifest overlap warnings (sample)

- **more-super-saiyans-z-blood-eng** ↔ `autopilot-engine` (super, super)
- **more-super-saiyans-z-blood-eng** ↔ `z-super-chat-orchestrator` (super, super)
- **more-z-sanctuary-super-saiyan** ↔ `autopilot-engine` (super, saiyan, super, saiyan)
- **more-z-sanctuary-super-saiyan** ↔ `z-super-chat-orchestrator` (super, super)
- **more-super-saiyans-roulette** ↔ `autopilot-engine` (super, super)
- **more-super-saiyans-roulette** ↔ `roulette-calculator` (roulette, roulette)
- **more-super-saiyans-roulette** ↔ `roulette` (roulette, roulette)
- **more-super-saiyans-roulette** ↔ `z-super-chat-orchestrator` (super, super)
- **more-humans-generation-minds** ↔ `z-cursor-folder-blueprint` (humans, humans)
- **more-z-sanctuary-blood-engine-5** ↔ `core-energy-response` (engine, engine)
- **more-z-sanctuary-blood-engine-5** ↔ `autopilot-engine` (engine, engine)

## Rename tracking

- none (add previous_names when ChatGPT renames a folder)

## Suggested operator order

- Fix duplicate hub_doc_path entries before importing.
- Fix invalid sidecar ids (unknown id) or duplicate sidecar ids on disk.
- Resolve export_folder drift: update data/z_chatgpt_projects_tracking.json so export_folder matches the folder name (sidecar id is stable across renames).
- Resolve manifest overlap warnings by linking entry.manifest_zid or skipping redundant docs.
- After ChatGPT UI rename: update display_name + previous_names in tracking JSON.
- Run npm run folder:align or Z: Folder Manager tasks when docs/ tree changes per policy.

Full JSON: `data/reports/z_chatgpt_integration_verify.json`
Export folder index: `data/reports/z_chatgpt_export_folder_index.json`
