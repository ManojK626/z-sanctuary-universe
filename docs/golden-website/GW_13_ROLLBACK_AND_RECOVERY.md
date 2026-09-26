# GW-13 — Rollback and recovery

**Phase:** Golden Website GW-13
**Date:** 2026-08-27
**Twin live `records[]`:** **0** (must remain 0)

The Golden Website is a **public-safe derivative**. Rolling it back must not mutate canonical private registries, private runtime, NAS, or operator dashboards.

## Separation

| Layer                        | Location                                             | Rollback rule                                                                         |
| ---------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Golden Website shell         | `docs/golden-website/shell/`                         | Delete or restore those files. Local HTML only.                                       |
| Public-safe adapters         | `data/golden-website/public/`                        | Restore prior adapter/corpus JSON. Do not write Twin `records[]`.                     |
| Guide sandbox                | `guide-sandbox.html` + `golden-guide-*.js`           | Remove sandbox/critic/integrity JS; production Guide stays CLOSED.                    |
| Gateway                      | `gateway.html` + `gw11_gateway_*.json`               | Remove informational gateway. No forms exist to unwind.                               |
| Gallery / Museum             | `gallery.html` / `museum.html` + `gw7_exhibits.json` | Remove exhibits payload. Captures live under `docs/golden-website/gw-*/screenshots/`. |
| Map foundation               | `universe-map.html` + `gw_map_foundation.json`       | Remove six-node proof. Full 160-node map was never opened.                            |
| Canonical private registries | hub `data/` outside `golden-website/public/`         | **Do not touch** for Golden Website rollback.                                         |
| Private runtime              | ICIS, Zuno memory, HODP, NAS                         | **Do not touch.** Never ingested into the shell.                                      |

## Programme rollback map (latest first)

| Slice     | How to revert without private truth                                            |
| --------- | ------------------------------------------------------------------------------ |
| GW-13     | Delete audit docs/scripts/JSON and the blank human form. No runtime was added. |
| GW-12     | Remove Integrity mode, `ai-integrity.html`, integrity JSON/JS.                 |
| GW-11     | Remove Gateway page/JSON. Restore live-offering lock label if changed.         |
| GW-10     | Remove Critic mode JS/JSON. Sandbox returns to Normal Guide only.              |
| GW-9      | Remove sandbox engine payload. Runtime stays CLOSED.                           |
| GW-8      | Remove 22-record corpus. Twin stays empty.                                     |
| GW-7      | Remove Gallery/Museum pages and exhibit JSON.                                  |
| GW-6      | Remove inventories only.                                                       |
| GW-5      | Remove Map foundation page/JSON.                                               |
| GW-4A     | Restore two-record shell if needed. Adapter remains public-safe only.          |
| GW-1 Twin | Keep `records[]` empty. `publication_authorized` remains false.                |

## Confirm

- Twin live `records[]` remains **0**.
- No Cloudflare production bind was added.
- No external LLM was added.
- No investor form, CRM, account, or data room exists to revoke.
- Restoring the shell does not restore private Sanctuary content, because it was never copied into browser payloads.
