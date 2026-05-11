#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const REPORTS = path.join(DATA, 'reports');
const INPUT = path.join(DATA, 'z_twin_roots_phase1_mock.json');
const OUT_JSON = path.join(REPORTS, 'z_twin_roots_status.json');
const OUT_MD = path.join(REPORTS, 'z_twin_roots_status.md');

function readJsonSafe(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function build() {
  const generatedAt = new Date().toISOString();
  const data = readJsonSafe(INPUT);
  const missing = [];
  if (!data) missing.push('data/z_twin_roots_phase1_mock.json');

  const mangoNodes = Array.isArray(data?.mango_tree_core?.nodes) ? data.mango_tree_core.nodes : [];
  const routes = Array.isArray(data?.tarzan_tree_core?.routes) ? data.tarzan_tree_core.routes : [];
  const blocked = Array.isArray(data?.tarzan_tree_core?.blocked_paths)
    ? data.tarzan_tree_core.blocked_paths
    : [];
  const helpers = Array.isArray(data?.tarzan_tree_core?.helper_registry)
    ? data.tarzan_tree_core.helper_registry
    : [];
  const mycelium = Array.isArray(data?.mycelium_layer?.micro_nodes)
    ? data.mycelium_layer.micro_nodes
    : [];
  const latestActivity = Array.isArray(data?.mango_tree_core?.latest_activity)
    ? data.mango_tree_core.latest_activity
    : [];

  let score = 100;
  if (missing.length) score -= 60;
  if (mangoNodes.length < 2) score -= 12;
  if (routes.length < 2) score -= 10;
  if (helpers.length < 1) score -= 8;
  if (mycelium.length < 3) score -= 10;
  score = Math.max(0, Math.min(100, score));
  const posture = score >= 90 ? 'strong' : score >= 75 ? 'watch' : score >= 50 ? 'caution' : 'hold';
  const activityLevel =
    latestActivity.length >= 2
      ? 'active'
      : latestActivity.length === 1
        ? 'light'
        : 'idle';
  const latestActivityTs =
    latestActivity
      .map((a) => (a && typeof a.ts === 'string' ? a.ts : null))
      .filter(Boolean)
      .sort()
      .pop() || generatedAt;

  return {
    schema_version: 1,
    name: 'z-twin-roots-status',
    generated_at: generatedAt,
    authority: data?.authority || 'advisory_only_no_auto_execution',
    readiness: {
      posture,
      score,
      missing_inputs: missing,
    },
    activity: {
      level: activityLevel,
      last_update_timestamp: latestActivityTs,
    },
    summary: {
      mango_nodes: mangoNodes.length,
      routes: routes.length,
      blocked_paths: blocked.length,
      helper_matches: helpers.length,
      mycelium_nodes: mycelium.length,
    },
    next_actions: [
      'Wire panel entry in dashboard tab/directory when approved.',
      'Map real activity feeds from reports_manifest and zuno summaries in Phase 2.',
      'Add optional route confidence and risk tiers per helper suggestion.',
    ],
  };
}

function toMarkdown(r) {
  return [
    '# Z-Twin Roots Architecture — status',
    '',
    `**Generated (UTC):** ${r.generated_at}`,
    `**Authority:** \`${r.authority}\``,
    `**Readiness:** **${r.readiness.posture.toUpperCase()}** · score **${r.readiness.score}/100**`,
    `**Activity:** **${String(r.activity.level || 'unknown').toUpperCase()}** · last update **${r.activity.last_update_timestamp || 'n/a'}**`,
    '',
    '## Summary',
    '',
    `- Mango nodes: **${r.summary.mango_nodes}**`,
    `- Routes: **${r.summary.routes}**`,
    `- Blocked paths: **${r.summary.blocked_paths}**`,
    `- Helper matches: **${r.summary.helper_matches}**`,
    `- Mycelium nodes: **${r.summary.mycelium_nodes}**`,
    '',
    '## Missing inputs',
    '',
    r.readiness.missing_inputs.length
      ? `- ${r.readiness.missing_inputs.join('\n- ')}`
      : '- None',
    '',
    '## Next actions',
    '',
    ...r.next_actions.map((n) => `- ${n}`),
    '',
    '---',
    '',
    'Phase 1 is local mock + visual architecture only.',
    '',
  ].join('\n');
}

const report = build();
fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
fs.writeFileSync(OUT_MD, toMarkdown(report), 'utf8');
console.log('OK: Twin Roots status written:');
console.log(' ', path.relative(ROOT, OUT_JSON));
console.log(' ', path.relative(ROOT, OUT_MD));
console.log(`posture=${report.readiness.posture} score=${report.readiness.score}`);
