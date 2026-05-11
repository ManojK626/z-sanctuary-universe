# Phase AAL-1 — GREEN receipt (manual)

**Scope:** Read-only dashboard UI + `dashboard/data/amk_autonomous_approval_ladder.json` + docs. **No** backend, auth, LLM API, voice engine, provider calls, billing, deployment, bridge execution, auto-merge, or live Cursor task dispatch.

## Manual checklist

- [ ] `node -e "JSON.parse(require('fs').readFileSync('dashboard/data/amk_autonomous_approval_ladder.json','utf8')); console.log('AAL JSON OK')"` exits 0.
- [ ] `npm run verify:md` exits 0.
- [ ] `npm run dashboard:registry-verify` exits 0.
- [ ] `npm run z:traffic` exits 0.
- [ ] `npm run z:car2` exits 0.
- [ ] Serve hub from repo root; open `dashboard/Html/amk-goku-main-control.html` — **Zuno Advisor Console** section shows ladder, both lane lists, query box, guidance output, future-gated notes, and localStorage acknowledgement only.
- [ ] Confirm **Kids** / **Public Visitor** lenses hide the advisor section (`amk_control_dashboard_map.json`).
- [ ] Confirm no button runs npm, deploy, or API calls.

## Rollback

1. Remove advisor `<details>` block, CSS link, and script tag from `dashboard/Html/amk-goku-main-control.html`.
2. Remove `advisor` from `hidden_section_ids` in `dashboard/data/amk_control_dashboard_map.json` if reverting domain behavior.
3. Remove the `z_aal_advisor` row from `dashboard/data/amk_project_indicators.json` if fully reverting cross-surface indicator.
4. Delete `dashboard/data/amk_autonomous_approval_ladder.json`, `dashboard/scripts/amk-zuno-advisor-readonly.js`, `dashboard/styles/amk-zuno-advisor.css`, and AAL docs if removing the feature.

## Evidence

- [AMK_AUTONOMOUS_APPROVAL_LADDER.md](./AMK_AUTONOMOUS_APPROVAL_LADDER.md)
- [AMK_ZUNO_ADVISOR_CONSOLE.md](./AMK_ZUNO_ADVISOR_CONSOLE.md)
