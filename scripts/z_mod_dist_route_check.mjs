import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const registryPath = resolve('data', 'z_mod_dist_routing_registry.json');
const samplesPath = resolve('data', 'examples', 'z_mod_dist_sample_inputs.json');
const reportJsonPath = resolve('data', 'reports', 'z_mod_dist_report.json');
const reportMdPath = resolve('data', 'reports', 'z_mod_dist_report.md');
const indicatorPath = resolve('dashboard', 'data', 'amk_project_indicators.json');

const requiredForbiddenSubstrings = [
  'permission',
  'certainty',
  'deployment',
  'entitlement',
  'green',
  'automatic',
  'auto_merge',
  'auto_deploy'
];

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function blobFor(sample) {
  return `${sample.title ?? ''} ${sample.summary ?? ''} ${toArray(sample.tags).join(' ')}`.toLowerCase();
}

function matchRule(rules, sample) {
  const type = sample.input_type ?? '';
  const b = blobFor(sample);
  for (const rule of rules) {
    const typesAny = toArray(rule.input_types_any);
    const kws = toArray(rule.keywords_any);
    const typeOk = typesAny.length === 0 || typesAny.includes(type);
    const kwOk = kws.length === 0 || kws.some((k) => b.includes(String(k).toLowerCase()));
    if (typeOk && kwOk) {
      return rule;
    }
  }
  return null;
}

function scoreSample(sample, rules, workspaces) {
  const flags = sample.flags ?? {};
  if (flags.request_deploy || flags.request_billing || flags.request_provider_calls) {
    return {
      safety_signal: 'RED',
      recommended_workspace: null,
      recommended_phase: 'blocked',
      required_gates: ['amk_human_gate'],
      forbidden_lanes: ['deploy', 'billing', 'provider_without_charter'],
      next_safe_action: 'Stop: remove deploy/billing/provider intent or obtain explicit AMK charter and gates.',
      matched_rule_id: null,
      workspace_label: null
    };
  }
  if (flags.runtime_bridge_without_charter || flags.child_data_live_pipeline) {
    return {
      safety_signal: 'RED',
      recommended_workspace: null,
      recommended_phase: 'blocked',
      required_gates: ['charter_before_bridge', 'child_data_safeguarding'],
      forbidden_lanes: ['runtime_bridge', 'child_data_pipeline'],
      next_safe_action: 'Do not open bridge or child-data lanes without charter and AMK gate.',
      matched_rule_id: null,
      workspace_label: null
    };
  }
  if (flags.requires_amk_charter || flags.uncertain_cross_repo_boundary) {
    const rule = matchRule(rules, sample);
    return {
      safety_signal: 'BLUE',
      recommended_workspace: rule?.recommended_workspace ?? 'main_hub',
      recommended_phase: rule?.recommended_phase ?? 'charter_review',
      required_gates: ['amk_charter', ...toArray(rule?.required_gates)],
      forbidden_lanes: toArray(rule?.forbidden_lanes),
      next_safe_action:
        rule?.next_safe_action ??
        'Freeze scope; document charter ask; no execution until AMK approves boundary.',
      matched_rule_id: rule?.id ?? null,
      workspace_label: rule ? workspaces[rule.recommended_workspace] ?? rule.recommended_workspace : null
    };
  }

  const rule = matchRule(rules, sample);
  if (!rule) {
    return {
      safety_signal: 'YELLOW',
      recommended_workspace: 'unspecified',
      recommended_phase: 'clarify_module_intent',
      required_gates: ['hierarchy_chief_alignment'],
      forbidden_lanes: ['assumed_auto_placement'],
      next_safe_action: 'Add tags or input_type so a routing rule matches; treat as planning-only.',
      matched_rule_id: null,
      workspace_label: null
    };
  }

  return {
    safety_signal: 'GREEN',
    recommended_workspace: rule.recommended_workspace,
    recommended_phase: rule.recommended_phase,
    required_gates: toArray(rule.required_gates),
    forbidden_lanes: toArray(rule.forbidden_lanes),
    next_safe_action: rule.next_safe_action,
    matched_rule_id: rule.id,
    workspace_label: workspaces[rule.recommended_workspace] ?? rule.recommended_workspace
  };
}

function forbiddenListCoversClaims(forbidden) {
  const lower = forbidden.map((x) => String(x).toLowerCase());
  return requiredForbiddenSubstrings.every((sub) => lower.some((entry) => entry.includes(sub)));
}

function computeOverall(checks, sampleResults) {
  if (checks.red.length > 0) return 'RED';
  if (sampleResults.some((s) => s.safety_signal === 'RED')) return 'RED';
  if (sampleResults.some((s) => s.safety_signal === 'BLUE')) return 'BLUE';
  if (sampleResults.some((s) => s.safety_signal === 'YELLOW')) return 'YELLOW';
  if (checks.yellow.length > 0) return 'YELLOW';
  return 'GREEN';
}

function buildMd(report) {
  const lines = [
    '# Z-MOD-DIST Routing Report',
    '',
    `- Signal: ${report.signal}`,
    `- Mode: ${report.mode}`,
    `- Timestamp: ${report.generated_at}`,
    '',
    '## Registry checks',
    ''
  ];
  for (const x of report.registry_checks.passed) lines.push(`- PASS: ${x}`);
  for (const x of report.registry_checks.yellow) lines.push(`- YELLOW: ${x}`);
  for (const x of report.registry_checks.blue) lines.push(`- BLUE: ${x}`);
  for (const x of report.registry_checks.red) lines.push(`- RED: ${x}`);
  lines.push('', '## Sample routes (advisory)', '');
  for (const row of report.sample_results) {
    lines.push(`### ${row.id}`, '');
    lines.push(`- Safety: **${row.safety_signal}**`);
    lines.push(`- Workspace: ${row.recommended_workspace ?? '—'}`);
    lines.push(`- Phase: ${row.recommended_phase ?? '—'}`);
    lines.push(`- Matched rule: ${row.matched_rule_id ?? '—'}`);
    lines.push(`- Next safe action: ${row.next_safe_action}`);
    lines.push('');
  }
  lines.push('## Locked law', '');
  lines.push('- Routing suggestion is not permission.');
  lines.push('- Module forecast is not future certainty.');
  lines.push('- GREEN is not deploy.');
  lines.push('- BLUE requires AMK.');
  lines.push('- RED blocks movement.');
  return `${lines.join('\n')}\n`;
}

async function syncIndicator(signal) {
  try {
    const indicatorDoc = JSON.parse(await readFile(indicatorPath, 'utf8'));
    const indicators = toArray(indicatorDoc.indicators);
    const index = indicators.findIndex((row) => row.id === 'z_mod_dist_routing_advisor');
    if (index >= 0) {
      indicators[index].signal = signal;
      indicatorDoc.indicators = indicators;
      await writeFile(indicatorPath, `${JSON.stringify(indicatorDoc, null, 2)}\n`, 'utf8');
    }
  } catch {
    // optional
  }
}

async function main() {
  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  const samplesDoc = JSON.parse(await readFile(samplesPath, 'utf8'));
  const includeFixtures = process.env.Z_MOD_DIST_INCLUDE_FIXTURES === '1';
  let samples = toArray(samplesDoc.samples);
  if (includeFixtures) {
    samples = [...samples, ...toArray(samplesDoc.fixture_samples)];
  }

  const regChecks = { passed: [], yellow: [], blue: [], red: [] };

  if (registry.mode === 'read_only_routing_advisor') regChecks.passed.push('Mode is read_only_routing_advisor.');
  else regChecks.red.push('mode must be read_only_routing_advisor.');

  const forbidden = toArray(registry.forbidden_routing_claims);
  if (forbidden.length >= 6 && forbiddenListCoversClaims(forbidden))
    regChecks.passed.push('forbidden_routing_claims covers advisory law.');
  else regChecks.red.push('forbidden_routing_claims incomplete or too weak.');

  const rules = toArray(registry.routing_rules);
  if (rules.length > 0) regChecks.passed.push('routing_rules present.');
  else regChecks.red.push('routing_rules must be non-empty.');

  const workspaces = registry.known_workspaces && typeof registry.known_workspaces === 'object' ? registry.known_workspaces : {};
  if (Object.keys(workspaces).length > 0) regChecks.passed.push('known_workspaces defined.');
  else regChecks.yellow.push('known_workspaces empty or missing.');

  const sampleResults = samples.map((sample) => {
    const route = scoreSample(sample, rules, workspaces);
    return {
      id: sample.id,
      title: sample.title,
      input_type: sample.input_type,
      ...route
    };
  });

  const signal = computeOverall(regChecks, sampleResults);
  const report = {
    schema: 'z.mod.dist.report.v1',
    module_id: 'z_mod_dist_routing_advisor',
    signal,
    mode: registry.mode ?? 'unknown',
    router_name: registry.router_name ?? 'Z-MOD-DIST',
    generated_at: new Date().toISOString(),
    registry_checks: regChecks,
    sample_results: sampleResults,
    fixtures_included: includeFixtures,
    related_docs: toArray(registry.related_docs),
    related_reports: toArray(registry.related_reports)
  };

  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(reportMdPath, buildMd(report), 'utf8');
  await syncIndicator(signal);

  console.log(`Z-MOD-DIST signal: ${signal}`);
  process.exit(signal === 'RED' ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
