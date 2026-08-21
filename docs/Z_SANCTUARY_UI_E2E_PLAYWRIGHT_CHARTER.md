# Z-Sanctuary UI E2E — Playwright charter (hub)

**Gate:** `Z-SANCTUARY-UI-E2E-PLAYWRIGHT-CHARTER-1`  
**Mode:** Test infrastructure + UI reality validation only  
**Authority:** Localhost / `127.0.0.1` only — no production bind, wake, deploy, or formula change

## Commands

```bash
# Preferred in this hub (programmatic Chromium runner — writes test-results/e2e-reality-map.json)
npm run test:e2e:reality-run

# Spec suite (Playwright Test CLI). May hang in some agent shells on Node 24;
# use locally/CI when the CLI worker path is healthy:
npm run test:e2e:smoke
npm run test:e2e:reality
npm run test:e2e
```

Static server: `scripts/z_local_static_server.mjs` on **`127.0.0.1:5519`** (Playwright `webServer` or the programmatic runner).

## Layout

| Path | Role |
| --- | --- |
| `playwright.config.mjs` | Config · Chromium · localhost webServer |
| `scripts/z_e2e_reality_runner.mjs` | Programmatic inventory + click/link/governance/responsive/a11y/GGAESP UI |
| `e2e/smoke.spec.js` | Browser + shell smoke |
| `e2e/reality-map.spec.js` | Page/control inventory + safe clicks/links |
| `e2e/governance.spec.js` | HOLD / no-wake negative checks |
| `e2e/responsive-a11y.spec.js` | Viewport + basic a11y probes |
| `e2e/ggaesp-ui.spec.js` | GGAESP panel presentation vs GO/PREPARE/BLOCK |
| `test-results/` | Temporary evidence (gitignored) |

## Laws

- Discover and classify — **do not auto-repair** UI in this gate.
- Sensitive wake/deploy controls are **not activated**.
- Temporary screenshots/traces stay under `test-results/` / `playwright-report/`.
- Coverage % is exercised / discovered — never claim 100% unless every safe control was exercised.
