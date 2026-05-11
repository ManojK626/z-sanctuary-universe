# AI ecosphere (ledger & health)

- Config: [data/z_ai_ecosphere_config.json](../../../data/z_ai_ecosphere_config.json)
- Ledger: [data/reports/z_ai_ecosphere_ledger.json](../../../data/reports/z_ai_ecosphere_ledger.json)
- Dashboard: [dashboard/z-ai-ecosphere/index.html](../../../dashboard/z-ai-ecosphere/index.html)
- Refresh: `npm run ai:ecosphere:ledger` (after reports); link check: `npm run vault:spine:verify`
- **Cursor / activation roadmap:** [Z-NEXT-ROADMAP-CURSOR-AUTO.md](../../Z-NEXT-ROADMAP-CURSOR-AUTO.md) — phased FEED → COMMS → VERIFY → SCAN playbooks and report template for agents.
- **Capability card (per sibling):** [Z-ECOSYSTEM-CAPABILITY-CARD-TEMPLATE.md](../../Z-ECOSYSTEM-CAPABILITY-CARD-TEMPLATE.md) — copy and fill for each PC-root project.
- **Ecosystem status (read-only emit):** `npm run ecosystem:status-emit` → [data/reports/z_ecosystem_status.md](../../../data/reports/z_ecosystem_status.md) from `z_pc_root_projects.json` + on-disk checks.
- **Safe next-steps backlog:** [Z-NEXT-STEPS-SAFE-BACKLOG.md](../../Z-NEXT-STEPS-SAFE-BACKLOG.md) — ordered phases (read-only → capability cards → comms → feed → one scan → checklist sign-off).
- **Z-KRTAAO (pedagogy / curriculum layer):** [Z-KRTAAO-DESIGN.md](../../Z-KRTAAO-DESIGN.md) — links formulas, 14 DRP, AI Tower & colony, learning spine; phased; advisory only.
- **Z-KRTAAO emit:** `npm run krtaa:curriculum-emit` → [data/reports/z_krtaa_curriculum.json](../../../data/reports/z_krtaa_curriculum.json) + `.md`; optional mirror: [dashboard/z-ai-ecosphere/index.html](../../../dashboard/z-ai-ecosphere/index.html).
- **Z-KRTAAO prompt packs (v3):** [z-krtaa-prompt-packs/README.md](../../z-krtaa-prompt-packs/README.md) — copy-paste; HODP Quick links + Blueprint also point here.
- **Z-PAPAO (pre-alert & precautions):** [Z-PAPAO-DESIGN.md](../../Z-PAPAO-DESIGN.md) · `npm run papao:precaution-emit` → [data/reports/z_papao_precaution_brief.json](../../../data/reports/z_papao_precaution_brief.json) + `.md` · panel on [z-ai-ecosphere](../../../dashboard/z-ai-ecosphere/index.html).
