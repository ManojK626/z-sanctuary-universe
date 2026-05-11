import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const referencePath = resolve('data', 'z_logical_brains_hub_reference.json');
const reportJsonPath = resolve('data', 'reports', 'z_logical_brains_hub_reference_report.json');
const reportMdPath = resolve('data', 'reports', 'z_logical_brains_hub_reference_report.md');
const indicatorPath = resolve('dashboard', 'data', 'amk_project_indicators.json');

const requiredLanes = [
  'secure_vault_runtime',
  'personal_ai_memory',
  'cloud_sync',
  'teacher_dashboard',
  'parent_dashboard',
  'voice_input',
  'live_ai_provider',
  'multiplayer_classroom'
];

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function buildMd(report) {
  const lines = [
    '# Z Logical Brains Hub Reference Report',
    '',
    `- Signal: ${report.signal}`,
    `- Timestamp: ${report.generated_at}`,
    `- Project: ${report.project_id}`,
    `- Module: ${report.module_id}`,
    ''
  ];

  lines.push('## Checks', '');
  for (const item of report.checks.passed) lines.push(`- PASS: ${item}`);
  for (const item of report.checks.yellow) lines.push(`- YELLOW: ${item}`);
  for (const item of report.checks.blue) lines.push(`- BLUE: ${item}`);
  for (const item of report.checks.red) lines.push(`- RED: ${item}`);
  lines.push('', '## Locked law', '');
  lines.push('- Hub capsule != runtime bridge.');
  lines.push('- Labs GREEN != public release.');
  lines.push('- GREEN != deploy.');
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
    const index = indicators.findIndex((row) => row.id === 'z_logical_brains_hub_reference');
    if (index >= 0) {
      indicators[index].signal = signal;
      indicatorDoc.indicators = indicators;
      await writeFile(indicatorPath, `${JSON.stringify(indicatorDoc, null, 2)}\n`, 'utf8');
    }
  } catch {
    // Indicator sync is best-effort and does not block report generation.
  }
}

async function main() {
  const ref = JSON.parse(await readFile(referencePath, 'utf8'));
  const checks = { passed: [], yellow: [], blue: [], red: [] };

  if (ref.project_id === 'zsanctuary_labs') checks.passed.push('Project ID is zsanctuary_labs.');
  else checks.red.push('project_id must be zsanctuary_labs.');

  if (ref.module_id === 'z_logical_brains_learning_pathway') checks.passed.push('Module ID matches expected value.');
  else checks.red.push('module_id must be z_logical_brains_learning_pathway.');

  if (ref.go_no_go === 'NON_CLINICAL_PLANNING_ONLY') checks.passed.push('Go/No-Go is non-clinical planning only.');
  else checks.red.push('go_no_go must be NON_CLINICAL_PLANNING_ONLY.');

  if (ref.public_release === 'NO_GO') checks.passed.push('Public release remains NO_GO.');
  else checks.red.push('public_release must remain NO_GO.');

  if (ref.runtime_bridge_enabled === false) checks.passed.push('Runtime bridge is closed.');
  else checks.red.push('runtime_bridge_enabled must be false.');

  if (ref.deploy_enabled === false) checks.passed.push('Deploy lane is closed.');
  else checks.red.push('deploy_enabled must be false.');

  if (ref.provider_enabled === false) checks.passed.push('Provider lane is closed.');
  else checks.red.push('provider_enabled must be false.');

  if (ref.child_data_collection_enabled === false) checks.passed.push('Child data collection is disabled.');
  else checks.red.push('child_data_collection_enabled must be false.');

  const lanes = toArray(ref.future_gated_lanes);
  const missingLanes = requiredLanes.filter((lane) => !lanes.includes(lane));
  if (missingLanes.length === 0) checks.passed.push('Future-gated lanes remain listed.');
  else checks.red.push(`Missing future-gated lanes: ${missingLanes.join(', ')}.`);

  const requiresAmkDecision = toArray(ref.requires_amk_decision_if_any);
  if (requiresAmkDecision.length > 0) {
    checks.blue.push(`AMK decision needed for: ${requiresAmkDecision.join(', ')}.`);
  }

  const signal = computeSignal(checks);
  const report = {
    module_id: 'z_logical_brains_hub_reference',
    project_id: ref.project_id ?? null,
    signal,
    generated_at: new Date().toISOString(),
    checks
  };

  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(reportMdPath, buildMd(report), 'utf8');
  await syncIndicator(signal);

  console.log(`Z Logical Brains hub reference signal: ${signal}`);
  process.exit(signal === 'RED' ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
