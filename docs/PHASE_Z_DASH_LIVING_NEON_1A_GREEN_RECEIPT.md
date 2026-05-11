# PHASE_Z_DASH_LIVING_NEON_1A — Green receipt

## Scope

Phase: `Z-DASH-LIVING-NEON-1A`
Mode: UI/CSS/JS reconstruction pass to match Zuno neon mockup more closely.

Primary target:

- `dashboard/Html/z-legal-lawyer-workstation.html`

Light matching polish:

- `dashboard/Html/amk-goku-main-control.html`
- `dashboard/styles/amk-goku-main-control.css`

## Visual reconstruction completed

- Full app-shell style with wider viewport and neon panel framing
- Left vertical tool dock with strong color identity per tab
- Top header row with:
  - gradient title block
  - four metric cards (Legal Ops, Product Ops, Traffic, Registry)
- Second row governance cards:
  - Locked Law
  - Receipt Strip
  - Governance Posture
- Main cockpit layout:
  - tool dock
  - large center workstation view
  - right AI/review center
- Bottom mock action strip (disabled/no-op)
- Product family status matrix
- Legal review timeline
- Risk radar/octagon panel
- AI assistant demo card
- Synthetic demo data banners and governance-only footer line

## Overflow and containment fixes

- Queue item card layout added for contained wrapping
- Applied:
  - `overflow-wrap:anywhere`
  - `word-break:break-word`
  - `max-width` constraints
  - internal `overflow-y:auto` in right review panel
- Queue no longer spills beyond panel bounds

## Motion and accessibility

- Subtle neon border pulse and hover glow added
- Respects `prefers-reduced-motion: reduce` (animations/transitions disabled)

## Safety confirmation

This phase remains strictly mock/read-only:

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

- Beautiful dashboard != runtime authority.
- AI assistant mock != legal adviser.
- Synthetic data != client data.
- Action buttons != execution.
- Canvas/radar != live tracking.
- GREEN != launch.
- AMK-Goku owns sacred moves.
