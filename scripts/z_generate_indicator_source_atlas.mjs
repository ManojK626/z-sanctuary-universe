/**
 * One-shot: generate docs/Z_SANCTUARY_INDICATOR_SOURCE_ATLAS.md from indicators JSON.
 * Docs only — not a runtime service.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'dashboard', 'data', 'amk_project_indicators.json');
const out = path.join(root, 'docs', 'Z_SANCTUARY_INDICATOR_SOURCE_ATLAS.md');
const j = JSON.parse(fs.readFileSync(src, 'utf8'));
const rows = j.indicators || [];

function cadence(o) {
  if (!o || o === 'none') return 'Static JSON / phase receipt — refresh when docs change';
  return 'When overlay report is refreshed (manual steward cadence)';
}

function owner(domain) {
  const m = {
    operator_dashboard: 'AMK-Goku',
    human_confirmation: 'AMK-Goku',
    signals: 'AMK + lane steward',
    governance: 'AMK-Goku',
    backup: 'AMK-Goku',
    ecosystem: 'AMK + Overseer posture',
    workspace: 'AMK-Goku',
    strategy: 'AMK-Goku',
    ssws: 'AMK + SSWS',
  };
  return m[domain] || 'AMK-Goku (hub steward)';
}

const md = [];
md.push('# Indicator Source Atlas');
md.push('');
md.push('**Status:** ✅ v1 · Operating System Health · Super Turtle');
md.push(
  '**Date:** 2026-08-21 · **Gate:** `Z-SANCTUARY-INDICATOR-SOURCE-ATLAS-RECONCILIATION-1`'
);
md.push('**Authority:** AMK-Goku');
md.push('**Accepted with:** State of the OS first-pass (OS Health Report)');
md.push('**Source registry:** `dashboard/data/amk_project_indicators.json`');
md.push('**Overlay script:** `dashboard/scripts/amk-project-indicators-readonly.js`');
md.push(
  '**Law:** Indicator ≠ permission · Percentage ≠ certification · Go/No-Go ≠ deployment'
);
md.push(
  '**Law (vocabulary):** Shared vocabulary does not imply shared implementation.'
);
md.push(
  '**Parent:** [Scorecard](Z_SANCTUARY_STATE_OF_THE_OS_2026_SCORECARD.md) · [Indicators doctrine](AMK_PROJECT_INDICATORS_AND_GO_NO_GO.md) · [Registry Atlas](Z_SANCTUARY_REGISTRY_ATLAS.md)'
);
md.push(
  '**Reconciliation:** Live catalogue count must match this atlas row count (57 ↔ 57 after RECONCILIATION-1). Sealing identity ≠ promoting health. BLUE remains BLUE.'
);
md.push('');
md.push('---');
md.push('');
md.push('## Purpose');
md.push('');
md.push('Every dashboard indicator should answer:');
md.push('');
md.push('| Question | This atlas |');
md.push('| --- | --- |');
md.push('| What am I? | Name · id · domain |');
md.push('| Where do I come from? | Static signal + overlay + reports/docs |');
md.push('| Who owns me? | Steward owner |');
md.push('| How often should I change? | Expected cadence |');
md.push('| Can a human verify me? | Verify / human column |');
md.push('');
md.push('Trust document only — **not** a new runtime or auto-refresh service.');
md.push('');
md.push('---');
md.push('');
md.push('## Cloudflare Go/No-Go card (special)');
md.push('');
md.push('| Field | Value |');
md.push('| --- | --- |');
md.push('| What | Cloudflare / edge deploy posture |');
md.push('| Signal | HOLD · `NO_GO_FOR_DEPLOY` |');
md.push('| Source | `cloudflare_go_no_go` in indicators JSON |');
md.push('| Owner | AMK-Goku |');
md.push('| Cadence | Only when deployment charter changes |');
md.push('| Verify | JSON block + `docs/Z-CLOUDFLARE-AI-COMMS-PRECAUTIONS.md` |');
md.push('| Human verify | Yes (`human_approval_required`) |');
md.push('');
md.push('---');
md.push('');
md.push(`## Indicator catalogue (${rows.length} rows)`);
md.push('');
md.push(
  '| ID | Name | Signal (static) | Overlay | Related reports | Related docs (first) | Owner | Cadence | Human verify |'
);
md.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- |');

for (const r of rows) {
  const reps =
    (r.related_reports || [])
      .slice(0, 2)
      .map((x) => '`' + x + '`')
      .join('; ') || '—';
  const doc =
    r.related_docs && r.related_docs[0] ? '`' + r.related_docs[0] + '`' : '—';
  const ov = r.dynamic_overlay || 'none';
  const hv = r.human_confirmation_required ? 'Yes' : 'Advisory';
  const name = String(r.name || '').replace(/\|/g, '/');
  md.push(
    `| \`${r.id}\` | ${name} | ${r.signal || '—'} | \`${ov}\` | ${reps} | ${doc} | ${owner(r.domain)} | ${cadence(ov)} | ${hv} |`
  );
}

md.push('');
md.push('---');
md.push('');
md.push('## Overlay → report map (from UI script)');
md.push('');
md.push('| Overlay key | Typical report path |');
md.push('| --- | --- |');
const overlays = [
  ['z_traffic', 'data/reports/z_traffic_minibots_status.json'],
  ['z_susbv_overseer', 'data/reports/z_susbv_overseer_report.json'],
  ['z_car2', 'data/reports/z_car2_similarity_report.json'],
  ['zuno', 'data/reports/z_zuno_state_report.json (confirm path in overlay fetch)'],
  ['dashboard_registry', 'data/reports/z_dashboard_registry_verify.json'],
  ['deployment_readiness', 'data/reports/z_deployment_readiness_status.json'],
  ['z_ecosystem_awareness', 'data/reports/z_ecosystem_awareness_report.json'],
  ['z_api_spine', 'data/reports/z_api_spine_report.json'],
  ['z_ssws', 'data/reports/z_ssws_launch_requirements_report.json'],
  ['amk_workspace_doorway', 'data/reports/amk_workspace_doorway_status.json'],
  ['amk_cursor_workspace_profiles', 'data/reports/amk_cursor_workspace_profiles_report.json'],
  ['z_amk_gtai_strategy_council', 'data/reports/z_amk_gtai_strategy_report.json'],
];
for (const [k, v] of overlays) {
  md.push(`| \`${k}\` | \`${v}\` |`);
}

md.push('');
md.push('---');
md.push('');
md.push('## Gaps (recommendations — do not auto-fix)');
md.push('');
md.push('| Gap | Note |');
md.push('| --- | --- |');
md.push(
  '| Empty `related_reports` + overlay `none` | Trust rests on phase docs / `last_known_basis` |'
);
md.push('| Stale overlay reports | Colour may lag — pair with Freshness Cadence |');
md.push('| Fetch failure | UI must not fabricate GREEN |');
md.push('');
md.push('## Next rhythm (recorded, not automated)');
md.push('');
md.push('See [Freshness Cadence](Z_SANCTUARY_FRESHNESS_CADENCE.md) — Daily / Weekly / Monthly / Quarterly.');
md.push('');
md.push('*Atlas v1 · OS Health · strengthens Layers 3–5 · no new systems*');
md.push('');

fs.writeFileSync(out, md.join('\n'));
console.log('Wrote', path.relative(root, out), 'rows=', rows.length);
