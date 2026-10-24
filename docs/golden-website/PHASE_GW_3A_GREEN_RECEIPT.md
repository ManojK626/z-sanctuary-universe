# Phase GW-3A — GREEN receipt

**Slice:** Golden Website — Visual & Accessibility Acceptance
**Date:** 2026-08-27
**Status:** GREEN-SCOPED for **local interactive review + shell polish only**. Twin live records = **0**. Publication = **NOT_YET_AUTHORIZED**. Deploy = **none**.

## Steward seal (2026-08-27)

> GW-3A — Visual Acceptance GREEN
> First-minute identity holds · QUALIFIED ≠ VERIFIED · Evidence Mode obvious · Navigator not production · locked doors explained · keyboard and 1440/768/390 pass.

Human NVDA/VoiceOver remains required **before any public pilot**. GW-4 (Public Knowledge Surface Expansion) is shortlist and capsules only. It does not publish, deploy, or insert Twin records.

**Authority inherited:** GW-3 accepted as local visual foundation.

## Steward decision

Sealed as Visual Acceptance GREEN (2026-08-27). This receipt does **not** authorize publication.

## Pages / surfaces reviewed

Home, Core, Navigator, Evidence Mode, locked future surfaces. Same two approved records only.

## Screenshots generated

| File                                                                 | What                          |
| -------------------------------------------------------------------- | ----------------------------- |
| `docs/golden-website/gw-3a/screenshots/01-home-desktop.png`          | Home hero + vocabulary        |
| `docs/golden-website/gw-3a/screenshots/02-home-evidence-board.png`   | Evidence Mode board           |
| `docs/golden-website/gw-3a/screenshots/03-home-evidence-desktop.png` | Home with Evidence Mode on    |
| `docs/golden-website/gw-3a/screenshots/04-core-desktop.png`          | Core QUALIFIED / not VERIFIED |
| `docs/golden-website/gw-3a/screenshots/05-navigator-desktop.png`     | Sanitized preview             |
| `docs/golden-website/gw-3a/screenshots/06-home-skip-focus.png`       | Skip link focused             |
| `docs/golden-website/gw-3a/screenshots/07-home-tablet.png`           | 768px Home                    |
| `docs/golden-website/gw-3a/screenshots/08-home-mobile.png`           | 390px Home                    |
| `docs/golden-website/gw-3a/screenshots/09-navigator-mobile.png`      | 390px Navigator               |
| `docs/golden-website/gw-3a/screenshots/10-home-locked-doors.png`     | Nine locked future surfaces   |

## Private records exposed

**0**

## Security findings

No new leak class. Shell still forbids local IPs, Windows paths, operator HTML, and iframes.

## Accessibility checks

| Check                                       | Result                                            |
| ------------------------------------------- | ------------------------------------------------- |
| Interactive browser pass (file:// Chromium) | **PASS** (`node scripts/z_gw_3a_visual_pass.mjs`) |
| Keyboard skip / evidence / rail             | **PASS**                                          |
| Overflow 1440 / 768 / 390                   | **PASS** (none)                                   |
| Named buttons and links                     | **PASS**                                          |
| Screen-reader product (NVDA/VoiceOver)      | Not run                                           |

## Unresolved limitations

- Local files only; not a public host.
- No dedicated screen-reader operator session.
- Nested evidence cards are visually boxy; left as-is (not a claim defect).
- Hub `npx playwright test` against the shared e2e webServer was not the receipt method in this session.

## Validators

| Command                                | Result                                      |
| -------------------------------------- | ------------------------------------------- |
| `node scripts/z_gw_3a_visual_pass.mjs` | **PASS**                                    |
| `node scripts/z_gw_3_shell_smoke.mjs`  | **PASS**                                    |
| markdownlint GW-3A docs                | **PASS**                                    |
| `npm run dashboard:registry-verify`    | **GREEN**                                   |
| `npm run alias:audit`                  | **GREEN**                                   |
| `npm run security:data-leak-audit`     | **GREEN** (0 findings)                      |
| `npm run z:monster:registry-verify`    | **PASS**                                    |
| `npm run verify:md`                    | Repo-wide MD060 pre-existing. Not repaired. |

## Rollback

Revert shell HTML/CSS/JS polish, delete `docs/golden-website/gw-3a/`, `scripts/z_gw_3a_visual_pass.mjs`, and `e2e/gw-3a-visual-acceptance.spec.js`. Twin records were never filled.

## Sign-off line

Operator: \***\*\*\*\*\***\_\_\_\_\***\*\*\*\*\*** Date: \***\*\_\_\*\***
