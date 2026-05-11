# NAV-1 — Universal Workstation Navigator · Green Receipt

## Summary

| Item | Status |
| ------------------------------------- | ------------------------------------- |
| `z_universe_service_catalog.json` | Added |
| Navigator scripts + CSS | Added |
| Wired into `Html/index-skk-rkpk.html` | Done |
| Read-only posture | Enforced (links only, no run buttons) |
| Memory / cloud / API | Not added |
| Docs (this folder) | Added |

## Verify commands (hub root)

```bash
npm run dashboard:registry-verify
npm run z:car2
npm run z:ai-builder:refresh
```

Expect `dashboard:registry-verify` exit **0**. Other commands should match your local toolchain health.

## Manual checklist

| Check | Pass |
| ------------------------------------------------------------------------------------------ | ---- |
| Dashboard loads over HTTP (not file://) | ☐ |
| Left navigator rail visible | ☐ |
| Expand/collapse toggles width | ☐ |
| Service click opens right panel | ☐ |
| Doc/report links resolve when served from root | ☐ |
| Escape closes detail panel | ☐ |
| No workflow execution buttons added | ☐ |
| Reduced motion / Low-Sensory: no harsh transitions (CSS respects `prefers-reduced-motion`) | ☐ |

## Operator sign-off

| Role | Name | Date |
| -------- | ---- | ---- |
| Operator | | |

## Rollback

1. Remove `dashboard/data/z_universe_service_catalog.json`, `dashboard/styles/z-universe-navigator.css`, `dashboard/scripts/z-universe-service-map.js`, `dashboard/scripts/z-universe-navigator-readonly.js`.
2. Revert `dashboard/Html/index-skk-rkpk.html` stylesheet + script tags.
3. Remove `docs/dashboard/Z_UNIVERSE_*.md` if reverting documentation.
