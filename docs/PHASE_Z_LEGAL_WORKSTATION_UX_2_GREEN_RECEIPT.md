# Phase Z-LEGAL-WORKSTATION-UX-2 — Green receipt

Phase focus: compact protector view modes, collapsible receipts/export drawer, and Historical Simulation Case drill (all synthetic, governance-only).

Work completed in `ZSanctuary_Universe`.

## Scope sealed

| Area | Allowed | Notes |
| --------------------------------- | ------- | ------------------------------------------------------------------------- |
| HTML / CSS / JS for workstation | Yes | `dashboard/Html/z-legal-lawyer-workstation.html` and linked assets |
| Synthetic demo narrative / labels | Yes | Historical Simulation Case panel, BLUE queue from existing reports |
| `localStorage` | Yes | Key `zLegalWorkstationProtectorView` only (`julianne`, `tom`, or `graph`) |
| Drawer UI | Yes | Receipt/export mock list, disabled buttons, rollback note, doctrine links |

Forbidden in this phase: client data intake, uploads, OCR/video runtime, live AI/legal advice, auth/accounts, payments, external APIs, deployment, product launch/manufacturing actions, autonomous execution, real lawyer endorsement, court filing/dispatch/export runtime.

## What shipped

- **Layout compression:** tighter header titles, protector selector row, condensed law/receipt strips, cockpit panels capped with internal scroll (`min-height`/viewport-aware).
- **Tool drawer:** bottom toolbar button opens a **right-hand drawer** (`DRAFT MOCK — NO COURT FILING OR DISPATCH RUNTIME`) containing draft packet list, read-only links, disabled mock export buttons, rollback note.
- **Protector views:** selectable modes stored in **`localStorage` key `zLegalWorkstationProtectorView`**:

| Mode | Behaviour (UI-only) |
| -------- | ---------------------------------------------------------------------- |
| Julianne | Stronger magenta/cyan presence, fuller glow on cockpit chrome |
| Tom | Denser typography, tighter tool/button metrics |
| Graph | Overview emphasises enlarged risk octagon + split cards + product grid |

- **Legal AI duo + dual spine:** persisted from AI-SPINE-1; wording tuned for UX-2 (synthetic personas, no endorsement).
- **Historical Simulation Case:** synthetic past→present timeline; explicit “not evidence / workflow test only” rules.
- **Photophobia posture:** tinted neon text preserved via `body[data-comfort="photophobia"]`; avoid pure `#fff` dominance.

## Safety statements

- Protector mode ≠ endorsement of any real advisor.
- Z-Tom / Z-Julianne labels = **internal synthetic mentor personas only**.
- Simulation case ≠ privileged or court-grade evidence.
- Export drawer ≠ filing, mailing, privileged storage, or runtime export.

## Verification (operator)

From repo root: `npm run verify:md` · `npm run z:traffic` · `npm run z:car2` · `npm run dashboard:registry-verify`

## Rollback

Revert changes under `dashboard/Html/z-legal-lawyer-workstation.html`, `dashboard/scripts/z-legal-lawyer-workstation-readonly.js`, `dashboard/styles/z-legal-lawyer-workstation.css`, and this receipt plus index pointers. Optionally clear **`localStorage` key `zLegalWorkstationProtectorView`** in the browser profile.
