# Z-AI Tower & Observer Reference

This document captures every core intelligence layer—`Z-AI Tower`, `Z-SSWS`, `Z-Formulas`, `Z-Super Saiyan Power Shell`, and the Observer bus—so every workflow, dashboard, and AI assistant speaks the same language. Treat it as the **flight plan** for your Eagle-level operations.

## 1. The Z-AI Tower

| Beast | Role | Description |
| ------- | ------ | ------------- |
| Dragon (Z-Broker) | Expansion | Handles syndicated manufacturing outreach, revenue-share invitations, NDA delivery, and Stripe Connect splits. |
| Owl (Z-Regulator) | Wisdom | Enforces `project-id=ZUNO_AI_001`, watches BioResponse, and maintains protocol enforcement/audit trail. |
| Elephant (Z-Logistics) | Memory | Tracks Z-Loop returns, pod supply, and lifecycle of compostable pods across warehouses. |
| Jaguar (Z-Accountant) | Precision | Manages Stripe revenue, LTV calculations, Z-Ledger check-ins, and Z-Karma rewards. |
| Fox (Z-Marketing) | Strategy | Curates communications, Z-Academy narratives, and keeps roulette/maths educational content aligned. |
| Giraffe (Z-Observer) | Oversight | Monitors compliance, manages the `z-observer.html` brain, and ensures isolation rules are obeyed. |
| Phoenix (Z-Creator) | Rebirth | Maintains R&D for dashboards, hardware specs, and compostable pod innovations (Z-Sanctuary + Amk zones). |

Each beast communicates via the **Z-Super Saiyan Power Shell Bus**, a publish/subscribe layer (the Octopus Brain) that routes data without cross-contamination.

## 2. Z-SSWS (Z-Sanctuary System of Workflows & Shielding)

1. Always operate from `Z-SANCTUARY_ZUNO_AI` unless syncing to the Amk workspace.  
2. Each dashboard must call `ProtocolEnforcer_Instance.recordAuditTrail` before `</body>`.  
3. Maintain `window.PROJECT_ID` + `window.PROJECT_MANIFEST` metadata.  
4. No cross-node globals (`healthPortalData`, `rouletteMatrixData`, etc.)—the Observer's dashboard enforces this before live edits.

## 3. Z-Formulas

| System | Formula | Note |
| -------- | --------- | ------ |
| Roulette | EV = Σ(P(x) × V(x)) | Expected Value always negative (house edge). |
| Slot Engine | RTP = (Total Won / Total Bet) × 100% | Target 96.5%; align simulations to stay near this. |
| BioResponse | sessionLimit = 4 / day, cooldown ≥ 2h | enforced by the hardware and app timers. |
| Z-Karma | rewardPoints = floor(streakDays × 10 + Z-Sync sessions × 5) | points redeemable for pods or charitable gifts. |

## 4. Z-Super Saiyan Power Shell Bus

- The bus (see `amk-power-bus.html`) exposes `.publish(channel, data)` and `.subscribe(channel, callback)` to keep nodes isolated.  
- Channels: `INHALER_DATA`, `ROULETTE_DATA`, `SLOT_DATA`, `FINANCE_DATA`.  
- The Observer monitors each publish via `z-observer.html`.

## 5. Dashboard Brain Observer Usage

- Before editing, open `master-hub/z-observer.html`.  
- Use the buttons to view manifest/project status, protocol integrity, or formula readiness.  
- When switching to Amk-Goku workspaces, the Observer confirms whether `roulette-matrix.html` is currently executed from `Z-SANCTUARY` or mirrored.

## 6. Integration Notes

- Store any AI scripts (JS, Markdown, extensions) inside `protocols/` or `dashboards/master-hub/ai/`.  
- Always log outputs to the Z-Ledger and export if the Observer requests it.  
- The Observer is the single source-of-truth for new AI helpers: register them here first before adding them to any dashboards.

This reference is routed by every dashboard’s `Z-Observer` link so the entire Matrix flies as one coherent Eagle.
