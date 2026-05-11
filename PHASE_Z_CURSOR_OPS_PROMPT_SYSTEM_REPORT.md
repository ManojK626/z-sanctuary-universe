# Phase report — Z-Cursor Ops prompt command system

**Repo:** ZSanctuary_Universe
**Scope:** Documentation-only workflow organization (Z-Sanctuary railway). **XL2** `docs/cursor-ops/` is **not** created here — apply the parallel prompt in the XL2 repo when ready.

## Files added

| Path | Purpose |
| -------------------------------------------------- | ------------------------------- |
| `docs/z-cursor-ops/README.md` | Entry, main law, workflow |
| `docs/z-cursor-ops/Z_MASTER_REQUIREMENTS_QUEUE.md` | READY vs BLOCKED master list |
| `docs/z-cursor-ops/Z_PROJECT_DEPENDENCY_MAP.md` | Dependency edges |
| `docs/z-cursor-ops/Z_CURSOR_AGENT_RULES.md` | Agent binding rules |
| `docs/z-cursor-ops/Z_TASK_STATUS_BOARD.md` | Living status table |
| `docs/z-cursor-ops/Z_PROMPT_TEMPLATE.md` | Copy scaffold for new prompts |
| `docs/z-cursor-ops/Z_HANDOFF_TEMPLATE.md` | Paste-back handoff |
| `docs/z-cursor-ops/prompts/00`–`08` | Executable / gated prompt specs |

## Safety boundaries

- No product feature implementation; no live UI change; no merge/deploy/connect automation added.
- XL2 coupling remains **reference-only** in doctrine; no XL2 tree merged into this change set.
- Sacred moves remain **human-gated** per Z-MAOS consent doctrine.

## Verification results

Run locally after landing:

```bash
npx markdownlint-cli -c .markdownlint.json docs/z-cursor-ops/**/*.md PHASE_Z_CURSOR_OPS_PROMPT_SYSTEM_REPORT.md
node scripts/z_sanctuary_structure_verify.mjs
```

## Next recommended phase

- Run READY prompts **00 → 03** in order when doing ops hygiene.
- Keep **04–08** at `BLOCKED` until AMK promotes with explicit scope and file lists.
- In **XL2 repo**, add mirror `docs/cursor-ops/` with Track A browser GREEN as sole READY (separate report there).
