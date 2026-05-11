# PHASE_Z_DASH_LIVING_NEON_1B — Green receipt

## Scope

Phase: `Z-DASH-LIVING-NEON-1B`
Mode: high-fidelity UI shell reconstruction for lawyer workstation.

Primary target:

- `dashboard/Html/z-legal-lawyer-workstation.html`
- `dashboard/scripts/z-legal-lawyer-workstation-readonly.js`
- `dashboard/styles/z-legal-lawyer-workstation.css`

## Before/after intent

- Before: structurally correct but visually compressed and underpowered at normal zoom.
- After: wider immersive neon shell with larger cards, stronger color separation, richer center overview, and wider right review center.

## High-fidelity improvements

- Wide immersive container (`max-width` near 1560px) with deeper neon shell.
- Strong header row with large gradient title and larger top metric cards.
- Distinct governance card row (Locked Law, Receipt Strip, Governance Posture).
- Enhanced 3-column cockpit proportions:
  - left dock: stronger color identity
  - center: richer overview sections
  - right: wider review center
- Center overview now includes:
  - KPI cards with progress bars
  - legal review timeline
  - product family status matrix
  - risk radar/octagon panel
  - synthetic demo data banner
- Right review center improved with badge cards and cleaner queue layout.
- Bottom action strip remains colorful mock controls (disabled/no-op).

## Overflow/responsive fixes

- Queue cards now wrap safely and remain inside panel boundaries.
- Applied queue-safe rules:
  - `overflow-wrap:anywhere`
  - `word-break:break-word`
  - `min-width:0`
  - `max-width:100%`
  - `line-height:1.35`
- Internal panel scrolling only where needed.
- Zoom/readability note: screenshots at `50%` zoom can appear compressed; acceptance should be judged at `100%`, with lower zoom as stress tests.

## Safety confirmation

UI-only enhancement; no runtime behavior added:

- no client data intake
- no uploads
- no OCR/video processing runtime
- no legal advice runtime
- no provider/API calls
- no auth/accounts
- no payments
- no deployment
- no product launch/manufacturing actions
- no runtime authority
- no auto-execution

## Locked law

- High-fidelity UI != runtime authority.
- Mock buttons != actions.
- Synthetic demo data != client data.
- AI assistant demo != legal advice.
- Radar/map != live tracking.
- GREEN != launch.
- AMK-Goku owns sacred moves.
