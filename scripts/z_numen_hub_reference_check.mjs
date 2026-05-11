import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const referencePath = resolve('data', 'z_numen_hub_reference.json');
const reportJsonPath = resolve('data', 'reports', 'z_numen_hub_reference_report.json');
const reportMdPath = resolve('data', 'reports', 'z_numen_hub_reference_report.md');
const indicatorPath = resolve('dashboard', 'data', 'amk_project_indicators.json');

const requiredFutureLanes = [
  'canvas_3d_visual_runtime',
  'classroom_mode',
  'live_ai_provider',
  'public_demo',
  'hub_runtime_bridge'
];

const requiredForbiddenPhrases = [
  'conspiracy proof',
  'hidden control proof',
  'supernatural evidence',
  'future prediction certainty',
  'diagnosis',
  'therapy',
  'danger by number alone'
];

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function buildMd(report) {
  const lines = [
    '# Z-NUMEN Hub Reference Report',
    '',
    `- Signal: ${report.signal}`,
    `- Timestamp: ${report.generated_at}`,
    `- Project: ${report.project_id}`,
    `- Module: ${report.module_id}`,
    `- Mode: ${report.mode}`,
    '',
    '## Checks',
    ''
  ];
  for (const item of report.checks.passed) lines.push(`- PASS: ${item}`);
  for (const item of report.checks.yellow) lines.push(`- YELLOW: ${item}`);
  for (const item of report.checks.blue) lines.push(`- BLUE: ${item}`);
  for (const item of report.checks.red) lines.push(`- RED: ${item}`);
  lines.push('', '## Locked law', '');
  lines.push('- Z-NUMEN is not a conspiracy detector.');
  lines.push('- Hub reference is not a runtime bridge.');
  lines.push('- Companion map is not a runtime merge.');
  lines.push('- GREEN is not deploy.');
  lines.push('- BLUE requires AMK.');
  lines.push('- RED blocks movement.');
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function computeSignal(checks) {
  if (checks.red.length > 0) return 'RED';
  if (checks.blue.length > 0) return 'BLUE';
  if (checks.yellow.length > 0) return 'YELLOW';
  return 'GREEN';
}

async function syncIndicator(signal) {
  try {
    const indicatorDoc = JSON.parse(await readFile(indicatorPath, 'utf8'));
    const indicators = toArray(indicatorDoc.indicators);
    const index = indicators.findIndex((row) => row.id === 'z_numen_hub_reference');
    if (index >= 0) {
      indicators[index].signal = signal;
      indicatorDoc.indicators = indicators;
      await writeFile(indicatorPath, `${JSON.stringify(indicatorDoc, null, 2)}\n`, 'utf8');
    }
  } catch {
    // best-effort
  }
}

function forbiddenClaimsComplete(forbidden) {
  const lower = forbidden.map((f) => String(f).toLowerCase());
  return requiredForbiddenPhrases.every((phrase) =>
    lower.some((entry) => entry.includes(phrase.toLowerCase()))
  );
}

async function main() {
  const ref = JSON.parse(await readFile(referencePath, 'utf8'));
  const checks = { passed: [], yellow: [], blue: [], red: [] };

  if (ref.project_id === 'zsanctuary_labs') checks.passed.push('project_id is zsanctuary_labs.');
  else checks.red.push('project_id must be zsanctuary_labs.');

  if (ref.module_id === 'z_numen_cognitive_geometry') checks.passed.push('module_id is z_numen_cognitive_geometry.');
  else checks.red.push('module_id must be z_numen_cognitive_geometry.');

  if (ref.mode === 'educational_pattern_literacy_reference_only')
    checks.passed.push('mode is educational_pattern_literacy_reference_only.');
  else checks.red.push('mode must be educational_pattern_literacy_reference_only.');

  if (typeof ref.companion_map_source === 'string' && ref.companion_map_source.trim().length > 0)
    checks.passed.push('companion_map_source is set.');
  else checks.red.push('companion_map_source must be listed (non-empty).');

  const boolChecks = [
    ['runtime_bridge_enabled', ref.runtime_bridge_enabled],
    ['deploy_enabled', ref.deploy_enabled],
    ['provider_enabled', ref.provider_enabled],
    ['profiling_enabled', ref.profiling_enabled],
    ['social_scraping_enabled', ref.social_scraping_enabled],
    ['psychological_targeting_enabled', ref.psychological_targeting_enabled],
    ['canvas_runtime_enabled', ref.canvas_runtime_enabled]
  ];

  for (const [label, val] of boolChecks) {
    if (val === false) checks.passed.push(`${label} is false.`);
    else checks.red.push(`${label} must be false (reference-only posture).`);
  }

  if (ref.public_release === 'NO_GO') checks.passed.push('public_release is NO_GO.');
  else checks.red.push('public_release must be NO_GO.');

  const forbidden = toArray(ref.forbidden_claims);
  if (forbiddenClaimsComplete(forbidden)) checks.passed.push('Forbidden claims list covers required conspiracy/medical/proof lanes.');
  else checks.red.push('forbidden_claims must include required proof/diagnosis/therapy/danger-number phrases.');

  const lanes = toArray(ref.future_gated_lanes);
  const missingLanes = requiredFutureLanes.filter((lane) => !lanes.includes(lane));
  if (missingLanes.length === 0) checks.passed.push('future_gated_lanes list is complete.');
  else checks.red.push(`Missing future_gated_lanes: ${missingLanes.join(', ')}.`);

  if (ref.go_no_go === 'EDUCATIONAL_PATTERN_LITERACY_ONLY') checks.passed.push('go_no_go is EDUCATIONAL_PATTERN_LITERACY_ONLY.');
  else checks.red.push('go_no_go must be EDUCATIONAL_PATTERN_LITERACY_ONLY.');

  const amkLanes = toArray(ref.requires_amk_decision_if_any);
  if (amkLanes.length > 0) {
    checks.blue.push(`AMK decision flagged for: ${amkLanes.join(', ')}.`);
  }

  for (const relPath of [
    ref.labs_signal_source,
    ref.companion_map_source,
    ref.labs_symbol_registry_source,
    ref.labs_signal_bands_source
  ].filter(Boolean)) {
    const p = resolve(relPath);
    if (!existsSync(p)) checks.yellow.push(`Evidence path missing on disk (expected from hub root): ${relPath}`);
  }

  const signal = computeSignal(checks);
  const report = {
    module_id: 'z_numen_hub_reference',
    project_id: ref.project_id ?? null,
    mode: ref.mode ?? null,
    signal,
    generated_at: new Date().toISOString(),
    checks
  };

  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(reportMdPath, buildMd(report), 'utf8');
  await syncIndicator(signal);

  console.log(`Z-NUMEN hub reference signal: ${signal}`);
  process.exit(signal === 'RED' ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
