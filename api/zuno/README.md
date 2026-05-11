# ZUNO-A1 — API folder (read-only, no hub HTTP server)

This directory holds **Node ESM helpers** for Zuno snapshot awareness. The Z-Sanctuary **hub root** does not start an HTTP API from here.

| File | Role |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `state.mjs` | Read `data/zuno_state_snapshot.json`; export `readZunoAwareness` / `readZunoStateSnapshot`; CLI prints slim JSON when run directly |

## Flow

1. Edit the canonical markdown: `docs/z_zuno_technology_snapshot.md`
2. Regenerate JSON: `npm run zuno:snapshot`
3. Read slim bundle: `npm run zuno:snapshot:awareness` (or `node api/zuno/state.mjs` from hub root)
4. Optional ZUNO-A2: **A2a** baseline diff — `npm run zuno:snapshot:baseline` then `npm run zuno:snapshot:diff`; **A2b** truth-layer alignment — `npm run zuno:snapshot:truth-align`
5. Optional ZUNO-A3 aggregated posture — `npm run zuno:awareness-score` (see `docs/ZUNO_A3_AWARENESS_SCORE.md`)
6. When A3 is RED — ZUNO-A3R recovery gate receipt — `npm run zuno:a3r:receipt` (see `docs/ZUNO_A3R_AWARENESS_RECOVERY_RECEIPT.md`)

Next.js or other apps may import `api/zuno/state.mjs` from a monorepo-relative path if they need the same read-only bundle (no write, no side effects).
