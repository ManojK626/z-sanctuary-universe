# Phase Z-MU-ADVISOR-1 green receipt

## Delivered

- `docs/Z_MU_CIVIC_KNOWLEDGE_ADVISOR.md` — civic knowledge advisor doctrine.
- `docs/Z_MU_ADVISOR_SAFETY_AND_AUDIT_POLICY.md` — safety and audit rules.
- `data/z_mu_advisor_policy.json` — `advisor_framework_only` + safety booleans + labels/modes.
- `data/z_mu_advisor_answer_templates.json` — template library with audit fields.
- `data/examples/z_mu_advisor_sample_questions.json` — sample prompts + optional RED fixture.
- `scripts/z_mu_advisor_check.mjs` — validator; `data/reports/z_mu_advisor_report.{json,md}`; syncs AMK indicator **signal**.
- Hub wiring: `package.json` (`z:mu:advisor`), `docs/INDEX.md`, `docs/AI_BUILDER_CONTEXT.md`, `data/z_autonomy_task_policy.json`, truth/safety doc cross-links, indicator `z_mu_civic_knowledge_advisor`, dashboard overlay `z_mu_advisor`.

## Acceptance

- No live chatbot, provider, API, scraping, payments, deploy, user accounts, or PII collection in this phase.
- Validator exit **0** for GREEN/YELLOW/BLUE overall; **1** for RED (or use `Z_MU_ADVISOR_INCLUDE_RED_FIXTURE=1` to exercise fixture).
- Run `npm run verify:md` before merge when docs change.

## Rollback

1. Remove advisor docs, JSON, script, and generated reports.
2. Remove `z:mu:advisor` from `package.json`.
3. Remove indicator `z_mu_civic_knowledge_advisor` and dashboard `z_mu_advisor` fetch/overlay.
4. Revert INDEX, AI_BUILDER_CONTEXT, autonomy policy, and cross-links in Mauritius docs.
