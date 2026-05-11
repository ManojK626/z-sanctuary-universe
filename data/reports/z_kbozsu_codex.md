# Z-KBOZSU — Knowledge Book (Phase A + B)

**Generated:** 2026-04-24T19:21:19.942Z

**Phase A** — index of manifests, registry docs, key reports, vault pointers (no payloads).

**Phase B** — SHA-256 of core JSON manifests; workspace drift from `z_cursor_workspace_lint.json`.

## Workspace / multi-root drift

```json
{
  "present": true,
  "generated_at": "2026-04-24T16:35:11.499Z",
  "status": "no_workspace_file",
  "aligned": null,
  "files_checked": 0,
  "no_workspace_file": true,
  "workspace_files_scanned": [],
  "drift_files": []
}
```

## Core manifest hashes (SHA-256)

| path | bytes | sha256 (prefix) |
| ---------------------------------- | ----- | ----------------- |
| `data/z_pc_root_projects.json` | 3452 | 745f38fd15a9380d… |
| `data/z_module_manifest.json` | 9662 | 2485c6e9fc06edbe… |
| `data/z_ssws_shadow_manifest.json` | 2500 | afb27e4404b9945f… |
| `data/z_whale_bus_spine.json` | 5007 | 5eb68011e1889165… |
| `data/z_ai_ecosphere_config.json` | 2621 | 377391c129a168c3… |

## Core slices (summary)

```json
{
  "pc_root_projects": {
    "pc_root": "C:/Cursor Projects Organiser",
    "hub": "ZSanctuary_Universe",
    "project_count": 11,
    "project_ids": [
      "zsanctuary-universe",
      "replit-roulette-z-amk-goku-mdcp",
      "amk-goku-dashboards-2",
      "amk-goku-vaults",
      "at-princess-blackie-copitol",
      "sister-aisling-sol",
      "z-omni-sanctuary",
      "z-sanctuary-ai-skyscraper",
      "z-sanctuary-browser-z-saiyan-lumina",
      "z-sanctuary-claude-core",
      "z-sanctuary-aimanity"
    ],
    "updated_at": "2026-04-17T00:00:00Z"
  },
  "module_manifest": {
    "format": "v1",
    "updated_at": "2026-04-24T17:00:00.000Z",
    "module_count": 31,
    "module_ids": [
      "core-dashboard",
      "core-status-console",
      "core-energy-response",
      "core-emotion-filter",
      "core-chronicle",
      "core-chronicle-hud",
      "autopilot-engine",
      "sepc-governance",
      "skk-companion",
      "rkpk-companion",
      "ai-tower",
      "ai-agent-scribe",
      "ai-agent-protector",
      "ai-agent-designer",
      "ai-agent-navigator",
      "roulette-calculator",
      "social-arena",
      "roulette",
      "z-soundscape-living-pulse",
      "z-super-chat-orchestrator",
      "z-ai-qadp",
      "z-cursor-folder-blueprint",
      "z-sanctuary-core-wrapper",
      "z-papao-precautions-advisor",
      "z-krtaa-curriculum-emitter",
      "z-fhmff-lite",
      "z-zecce-confirmations",
      "z-ecosphere-transparency-report",
      "z-whale-bus-spine",
      "z-kbozsu",
      "z-mini-bots-phase1"
    ]
  },
  "ssws_shadows": {
    "manifest_version": 3,
    "generated_at": "2026-04-23T17:30:30.325Z",
    "shadow_count": 9,
    "shadow_project_ids": [
      "amk-goku-dashboards-2",
      "amk-goku-vaults",
      "at-princess-blackie-copitol",
      "sister-aisling-sol",
      "z-omni-sanctuary",
      "z-sanctuary-ai-skyscraper",
      "z-sanctuary-browser-z-saiyan-lumina",
      "z-sanctuary-claude-core",
      "z-sanctuary-aimanity"
    ]
  },
  "whale_bus": {
    "deck_ids": ["comms_sync", "surface_reinforce"],
    "note": null
  },
  "ai_ecosphere": {
    "title": "Z AI Ecosphere — SSWS · Formulas · Tower · Shadows",
    "ring_ids": ["z_ssws", "z_mega_formulas", "ai_tower", "shadow_minibots"]
  },
  "mini_bots": {
    "guardian": {
      "generated_at": "2026-04-24T19:19:29.008Z",
      "missing": 1,
      "present": 9
    },
    "sync": {
      "generated_at": "2026-04-24T19:19:29.391Z",
      "latest_snapshot_dir": "data/reports/bot_sync_snapshots/2026-04-24T19-19-29-390Z"
    },
    "health": {
      "generated_at": "2026-04-24T19:19:29.797Z",
      "memory_used_pct": 48.8
    }
  },
  "cross_references": {
    "zuno_state_present": true,
    "prior_kbozsu_generated_at": "2026-04-24T16:10:39.887Z",
    "note": "Zuno and prior KBOZSU files read for presence only; refresh order: bots → kbozsu:refresh → zuno:state for full chain."
  }
}
```

## Entry index

| id | kind | spine | class | present | path |
| --------------------------- | ------------- | --------- | -------------- | ------- | --------------------------------------------- |
| master-modules-register | registry | cognitive | public_ref | yes | `docs/Z-MASTER-MODULES-REGISTER.md` |
| full-build-checklist | registry | cognitive | public_ref | yes | `docs/Z-FULL-BUILD-CHECKLIST.md` |
| hierarchy-chief | registry | cognitive | public_ref | yes | `docs/Z-HIERARCHY-CHIEF-AND-OBSERVER-VIEW.md` |
| z-pc-root-projects-json | manifest | data | internal | yes | `data/z_pc_root_projects.json` |
| z-module-manifest-json | manifest | data | internal | yes | `data/z_module_manifest.json` |
| z-ssws-shadow-manifest-json | manifest | data | internal | yes | `data/z_ssws_shadow_manifest.json` |
| z-whale-bus-spine-json | manifest | data | internal | yes | `data/z_whale_bus_spine.json` |
| z-ai-ecosphere-config-json | manifest | data | internal | yes | `data/z_ai_ecosphere_config.json` |
| z_kbozsu_codex | report | oversight | internal | yes | `data/reports/z_kbozsu_codex.json` |
| z_zecce_confirmations | report | oversight | internal | yes | `data/reports/z_zecce_confirmations.json` |
| z_pam_sicmns_bridge | report | oversight | internal | yes | `data/reports/z_pam_sicmns_bridge.json` |
| z_sicmns_maturity_probe | report | oversight | internal | yes | `data/reports/z_sicmns_maturity_probe.json` |
| z_cursor_workspace_lint | report | oversight | internal | yes | `data/reports/z_cursor_workspace_lint.json` |
| z_ssws_boot_report | report | oversight | internal | yes | `data/reports/z_ssws_boot_report.json` |
| z_communication_health | report | oversight | internal | yes | `data/reports/z_communication_health.json` |
| z_traffic_intelligence | report | oversight | internal | yes | `data/reports/z_traffic_intelligence.json` |
| z_fhmff_lite | report | oversight | internal | yes | `data/reports/z_fhmff_lite.json` |
| zuno_system_state_report | report | oversight | internal | yes | `data/reports/zuno_system_state_report.json` |
| z_bot_guardian | report | oversight | internal | yes | `data/reports/z_bot_guardian.json` |
| z_bot_sync | report | oversight | internal | yes | `data/reports/z_bot_sync.json` |
| z_bot_health | report | oversight | internal | yes | `data/reports/z_bot_health.json` |
| vault-access-map | vault_pointer | oversight | vault_ref_only | yes | `docs/vault/Vault_Access_Map.md` |
| security-policy | policy_ref | oversight | public_ref | yes | `rules/Z_SANCTUARY_SECURITY_POLICY.md` |

**Entries:** 23 · **Reports present (watchlist):** 13

---

_`npm run kbozsu:refresh` — optional `node scripts/z_kbozsu_refresh.mjs --refresh-workspace-lint` to re-run workspace lint first._
