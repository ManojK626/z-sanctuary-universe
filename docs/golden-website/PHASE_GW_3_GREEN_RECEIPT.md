# Phase GW-3 — GREEN receipt

**Slice:** Golden Website — Golden Foundation Shell
**Date:** 2026-08-27
**Status:** GREEN-SCOPED for **local visual shell only**. Twin live records = **0**. Publication = **NOT_YET_AUTHORIZED**. Deploy = **none**.

## Steward seal (2026-08-27)

> GW-3 — ACCEPTED · LOCAL VISUAL FOUNDATION GREEN
> Scope preserved · claims disciplined · private exposure 0 · no deploy · no publication.

GW-3A (Visual & Accessibility Acceptance) is the next local review slice. It does not publish or deploy.

**Authority inherited:** GW-2A accepted. Core public-safe sentence approved. Both records `APPROVED_PUBLIC_SAFE`.

## Scope locked

- Surfaces consume the two-record public-safe adapter only.
- No Golden Guide AI runtime, no Universe Map, no other 158 records.
- No deploy, no public endpoints.

## Pages / surfaces created

| Surface                            | Path                                                                        |
| ---------------------------------- | --------------------------------------------------------------------------- |
| Golden Home                        | `docs/golden-website/shell/index.html`                                      |
| Z-Sanctuary Core page              | `docs/golden-website/shell/core.html`                                       |
| Navigator page + sanitized preview | `docs/golden-website/shell/navigator.html`                                  |
| Evidence Mode                      | Site-wide toggle (Show Me What's Real)                                      |
| Shared CSS/JS                      | `docs/golden-website/shell/css/golden-website.css` · `js/golden-website.js` |
| Public-safe adapter                | `data/golden-website/public/gw_approved_public_safe_adapter.json`           |
| Shell data copy                    | `docs/golden-website/shell/data/gw-approved-public-safe.js`                 |
| Architecture doc                   | `docs/golden-website/GW_3_GOLDEN_FOUNDATION_SHELL.md`                       |

## Approved records consumed

2: `z_sanctuary_core`, `univ_workstation_navigator`

## Private records exposed

**0**

Twin `records[]` length: **0**

## Files also changed

GW-2A receipt seal, Core capsule classification, Twin metadata (classifications only), INDEX, Master Register §15.

## Accessibility checks (static)

| Check                          | Result                                                      |
| ------------------------------ | ----------------------------------------------------------- |
| Skip link                      | Present                                                     |
| `prefers-reduced-motion`       | Present                                                     |
| Evidence toggle `aria-pressed` | Present                                                     |
| Locked future items            | GW-3A: non-interactive list, not dead buttons               |
| Interactive browser pass       | Completed in GW-3A (`node scripts/z_gw_3a_visual_pass.mjs`) |

## Screenshots generated

See [PHASE_GW_3A_GREEN_RECEIPT.md](PHASE_GW_3A_GREEN_RECEIPT.md) (`docs/golden-website/gw-3a/screenshots/`).

## Unresolved limitations

- Shell must be opened as local files; it is not a public host.
- Navigator preview is a sanitized two-record rail, not the operator dashboard.
- Thin Core smoke-test limitation remains in the internal capsule only, not on the public shell.
- GW-4 not opened.

## Validators

| Command                               | Result                                                              |
| ------------------------------------- | ------------------------------------------------------------------- |
| `node scripts/z_gw_3_shell_smoke.mjs` | **PASS**                                                            |
| markdownlint GW-3 docs                | **PASS**                                                            |
| `npm run dashboard:registry-verify`   | **GREEN**                                                           |
| `npm run alias:audit`                 | **GREEN**                                                           |
| `npm run security:data-leak-audit`    | **GREEN** (0 findings)                                              |
| `npm run z:monster:registry-verify`   | **PASS**                                                            |
| `npm run verify:md`                   | Repo-wide MD060 pre-existing. Not repaired. GW-3 markdown is clean. |

## Rollback

Delete `docs/golden-website/shell/` and GW-3 adapter/docs/scripts. Revert classification/Twin metadata/INDEX/register. Twin records were never filled.

## Sign-off line

Operator: \***\*\*\*\*\***\_\_\_\_\***\*\*\*\*\*** Date: \***\*\_\_\*\***
