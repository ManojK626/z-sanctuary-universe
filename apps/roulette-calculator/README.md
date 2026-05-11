<!-- Z: apps\roulette-calculator\README.md -->

# 🎰 Super Saiyan Roulette — Public Capability Overview (Z-Sanctuary)

This module is part of **Z-Sanctuary Universe & the AMK-Goku legacy**.
It provides **roulette spin tracking, analytics, and visualization** across multiple roulette variants.

> **Important (Public + Safety):** This project is designed for **entertainment, learning, and statistical observation**.
> It does **not** claim guaranteed wins or casino exploitation. Use responsible limits.

---

## What this module does

### 1 Multi-Table Tracking

- Track multiple roulette tables independently (each table has its own history and state).
- Table naming, quick switching, and side-by-side comparison when enabled.
- Per-table stats: last spins, streaks, droughts, and distribution over time.

### 2 Spin History + Persistence

- Record spins and keep history across sessions (via local storage or backend persistence).
- Reset controls (per table or global) with audit logging hooks so actions can be traced.

### 3 Z-Style Pattern Categories (Public Description)

This codebase supports “Z-style” analytics: **observation of grouped occurrence and non-occurrence behavior**.
Publicly described at a high level as:

- **Z1…Zn:** group counts representing “gap windows” or “non-appearance stretches.”
- **Zx Multipliers:** amplitude labels describing repeated group patterns over time.
- **Pattern States:** ACTIVE / COOLED / TRIGGERED / EXPIRED based on configurable thresholds.

> Specific creator techniques, proprietary combos, and paid-only logic are **not described here**.

### 4 Heatmaps & Hot/Cold Zones

- Hot/cold classification of roulette numbers based on configurable history windows.
- Five-zone mapping (Extremely Cold → Medium Cold → Normal → Hot → Extremely Hot).
- Filter views by last N spins, time bucket, or tracked table.

### 5 Bankroll + Win/Loss Journaling

- Record wagers, trailing stops, streak sensitivity, and session summaries.
- Track capital, profit, loss, drawdown, and streak length with optional logging.

### 6 Simulation Mode (Training)

- Simulate spins at adjustable speed to test UI, analytics, and risk guards without live play.
- Useful for verifying safe pack behaviors or calibrating LPBS steps.

### 7 Dashboards & Governance Hooks

- Registry integration surfaces READY / PARTIAL / BLOCKED chips per module.
- Insight cards summarize module health, warnings, and next recommended tasks.
- Hooks for Chronicle/Replay systems (Super Ghost layer) when enabled include timestamped events and reflection-driven narratives.

---

## Roulette Variants Supported (Conceptual)

Depending on configuration, the system can support:

- European roulette (single zero)
- American roulette (0 + 00)
- Lightning-style multiplier variants (multiplier tracking layers)
- Custom “Wonderland” variants (group patterns + special events)

Variant logic is isolated behind format/config boundaries whenever possible.

---

## Architecture Notes (Public)

- **UI Layer:** Browser-only scripts that touch `window` / `document` and render dashboards.
- **Core Engine:** Pattern, heat, and statistic calculators operating on spin arrays.
- **Safe Pack / Governance:** Allowlist-driven activation, risk controls, and audit events.
- **Chronicle / Replay:** Event stream plus time-based reflection outputs (optional, permissioned layer).

---

## Responsible Play Guardrails

- Session limits and cooldown reminders.
- Transparent “no guarantee” messaging.
- Spend caps, loss caps, and clear logs.
- Prompt reminders before escalating bet sizes or switching strategies.

---

## Quick Start (Developer)

1. `npm install`
2. `npm run dev` (or your project’s defined development flow)
3. Open `http://localhost:3000` (or the port the server reports)

---

## Non-Private Promise

This README is intentionally **public-friendly**. It describes capabilities without exposing protected creator IP, paid techniques, or sensitive tuning thresholds.
