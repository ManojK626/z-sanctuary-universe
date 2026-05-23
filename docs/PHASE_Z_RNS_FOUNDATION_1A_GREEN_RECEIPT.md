# Phase Z-RNS-FOUNDATION-1A — Green Receipt (Cause → Effect Canvas Map)

**Phase:** Z-RNS-FOUNDATION-1A
**Builds on:** Z-RNS-FOUNDATION-1
**Date:** 2026-05-21
**Authority:** AMK-Goku / human review — **not** legal advice

## Scope

| In scope                                 | Out of scope              |
| ---------------------------------------- | ------------------------- |
| 2D Canvas cause → effect map             | Three.js / 3D             |
| Read-only visualisation from IndexedDB   | Data mutation from canvas |
| Node click → evidence metadata highlight | AI API                    |
| Zoom in / out / reset controls           | Cloud sync                |
| Orphan / unlinked root event list        | Voice capture             |
| Empty state when no cause links          | Court filing              |

## Deliverables

| Artifact                                          | Change                                      |
| ------------------------------------------------- | ------------------------------------------- |
| `dashboard/Html/z-rns-foundation-hub.html`        | Canvas map tab + panel                      |
| `dashboard/scripts/z-rns-foundation-hub.js`       | `renderCauseCanvasMap()` read-only renderer |
| `dashboard/styles/z-rns-foundation-hub.css`       | Canvas layout + evidence highlight          |
| `docs/PHASE_Z_RNS_FOUNDATION_1A_GREEN_RECEIPT.md` | This receipt                                |

## Acceptance

- [x] Existing foundation hub CRUD still works
- [x] Canvas renders chains from `cause_event_id` links
- [x] Arrows draw cause → child event
- [x] Unlinked root events listed separately
- [x] Node click highlights linked evidence in vault UI
- [x] Empty-state text when no cause links
- [x] Canvas is read-only (no IndexedDB writes from map)
- [x] `npm run z:rns:foundation` exits GREEN

## Verification

```bash
npm run z:rns:foundation
```

Open: `dashboard/Html/z-rns-foundation-hub.html` → **Canvas map** tab.

## Merge stack (operator)

1. [ ] `cursor/zsanctuary/z-rns-arch-1` → `main`
2. [ ] Rebase `cursor/zsanctuary/z-rns-foundation-1` on `origin/main`; `npm run z:rns:foundation`; merge → `main`
3. [ ] Rebase `cursor/zsanctuary/z-rns-foundation-1a` on `origin/main`; retarget PR to `main`; manual pass below; merge → `main`

## Manual browser green pass (operator — before final merge)

Open `dashboard/Html/z-rns-foundation-hub.html` via hub static server.

- [ ] Add timeline event A
- [ ] Add timeline event B
- [ ] Link B cause → A (Cause → Effect tab)
- [ ] Upload evidence linked to B (Evidence vault)
- [ ] Open **Canvas map** — chain A → B visible
- [ ] Click node B — evidence highlight + metadata panel
- [ ] Reload page — events, links, evidence, and map still persist

When all checked: mark **Z-RNS-FOUNDATION-1A GREEN** for human sign-off.


```text
Read-only visualisation — preparation and clarity, not blame games.
Process maps ≠ legal advice.
```

## Rollback

Revert canvas tab HTML, JS `renderCauseCanvasMap` block, CSS canvas section, and this receipt from Git history.
