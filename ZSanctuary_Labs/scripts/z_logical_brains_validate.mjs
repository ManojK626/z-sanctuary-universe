import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const registryPath = resolve('data', 'z_logical_brains_capability_registry.json');
const safetyPath = resolve('data', 'z_logical_brains_safety_policy.json');
const reportJsonPath = resolve('data', 'reports', 'z_logical_brains_report.json');
const reportMdPath = resolve('data', 'reports', 'z_logical_brains_report.md');
const indicatorPath = resolve('dashboard', 'data', 'amk_project_indicators.json');

const requiredStages = ['infancy', 'childhood', 'adolescence', 'adulthood', 'senior_reflection'];
const requiredCategories = ['physical', 'cognitive', 'emotional', 'social', 'vocational', 'spiritual', 'ecological'];
const requiredForbiddenClaims = ['medical diagnosis', 'therapy', 'brain treatment', 'future prediction certainty'];
const requiredFutureGates = ['secure_vault_runtime', 'personal_ai_memory', 'cloud_sync', 'voice_input', 'multiplayer_classroom'];
const requiredBlueTriggers = ['public_release', 'child_data', 'vault_runtime', 'cloud_sync', 'provider_calls', 'voice_input'];

function hasAll(haystack, required) {
  return required.every((item) => haystack.includes(item));
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

function computeSignal(checks) {
  if (checks.red.length > 0) {
    return 'RED';
  }
  if (checks.blue.length > 0) {
    return 'BLUE';
  }
  if (checks.yellow.length > 0) {
    return 'YELLOW';
  }
  return 'GREEN';
}

function buildMarkdown(report) {
  const lines = [
    '# Z Logical Brains Validation Report',
    '',
    `- Signal: ${report.signal}`,
    `- Mode: ${report.mode}`,
    `- Timestamp: ${report.generated_at}`,
    ''
  ];

  lines.push('## Checks');
  lines.push('');
  for (const check of report.checks.passed) {
    lines.push(`- PASS: ${check}`);
  }
  for (const check of report.checks.yellow) {
    lines.push(`- YELLOW: ${check}`);
  }
  for (const check of report.checks.blue) {
    lines.push(`- BLUE: ${check}`);
  }
  for (const check of report.checks.red) {
    lines.push(`- RED: ${check}`);
  }

  lines.push('');
  lines.push('## Guardrails');
  lines.push('');
  lines.push('- Logical Brains != medical device.');
  lines.push('- Learning pathway != diagnosis.');
  lines.push('- Self-reflection != therapy.');
  lines.push('- Future planning != prediction certainty.');
  lines.push('- GREEN != deploy.');
  lines.push('- BLUE requires AMK gate.');
  lines.push('- RED blocks movement.');

  return `${lines.join('\n')}\n`;
}

async function syncIndicator(signal) {
  try {
    const indicatorDoc = await readJson(indicatorPath);
    const indicators = asArray(indicatorDoc.indicators);
    const index = indicators.findIndex((item) => item.id === 'z_logical_brains_learning_pathway');
    if (index >= 0) {
      indicators[index].signal = signal;
      indicatorDoc.indicators = indicators;
      await writeFile(indicatorPath, `${JSON.stringify(indicatorDoc, null, 2)}\n`, 'utf8');
    }
  } catch {
    // Indicator file is optional for validator success.
  }
}

async function main() {
  const registry = await readJson(registryPath);
  const safety = await readJson(safetyPath);
  const checks = { passed: [], yellow: [], blue: [], red: [] };

  if (registry.mode === 'non_clinical_learning_visualization') {
    checks.passed.push('Mode is non-clinical.');
  } else {
    checks.red.push('Mode must be non_clinical_learning_visualization.');
  }

  const stages = asArray(registry.learning_stages);
  if (hasAll(stages, requiredStages)) {
    checks.passed.push('Learning stages are complete.');
  } else {
    checks.red.push('Missing required learning stages.');
  }

  const categories = asArray(registry.knowledge_categories);
  if (hasAll(categories, requiredCategories)) {
    checks.passed.push('Knowledge categories are complete.');
  } else {
    checks.red.push('Missing required knowledge categories.');
  }

  const forbiddenClaims = asArray(registry.forbidden_claims);
  if (hasAll(forbiddenClaims, requiredForbiddenClaims)) {
    checks.passed.push('Forbidden medical/therapy/prediction claims are listed.');
  } else {
    checks.red.push('Forbidden claims list is incomplete.');
  }

  const futureGated = asArray(registry.future_gated_capabilities);
  if (hasAll(futureGated, requiredFutureGates)) {
    checks.passed.push('Sensitive capabilities are future-gated.');
  } else {
    checks.red.push('Sensitive capabilities must remain future-gated.');
  }

  const childRules = asArray(safety.child_safety_rules);
  if (childRules.includes('no_child_data_collection_by_default')) {
    checks.passed.push('Child data collection is forbidden in Phase 1.');
  } else {
    checks.red.push('Child data collection must be forbidden in Phase 1.');
  }

  const allowedPhase1 = asArray(safety.allowed_phase_1_actions);
  const forbiddenFlow = asArray(safety.forbidden_data_flows);
  const requestedBlueTriggers = requiredBlueTriggers.filter((trigger) => {
    if (trigger === 'child_data') {
      return !childRules.includes('no_child_data_collection_by_default');
    }
    if (trigger === 'cloud_sync') {
      return !forbiddenFlow.includes('child_data_to_cloud');
    }
    if (trigger === 'provider_calls') {
      return !asArray(safety.privacy_rules).includes('no_provider_calls_phase_1');
    }
    if (trigger === 'voice_input') {
      return !asArray(safety.privacy_rules).includes('no_voice_camera_gps');
    }
    if (trigger === 'vault_runtime') {
      return !futureGated.includes('secure_vault_runtime');
    }
    if (trigger === 'public_release') {
      return !allowedPhase1.includes('set_dashboard_indicator');
    }
    return false;
  });

  if (requestedBlueTriggers.length > 0) {
    checks.blue.push(`Blocked lane requested or missing safeguards: ${requestedBlueTriggers.join(', ')}.`);
  }

  const optionalDocs = asArray(registry.related_docs);
  if (optionalDocs.length < 3) {
    checks.yellow.push('Optional related docs list appears incomplete.');
  }

  const signal = computeSignal(checks);
  const report = {
    module_id: 'z_logical_brains_learning_pathway',
    signal,
    mode: registry.mode ?? 'unknown',
    generated_at: new Date().toISOString(),
    checks
  };

  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(reportMdPath, buildMarkdown(report), 'utf8');
  await syncIndicator(signal);

  console.log(`Z Logical Brains signal: ${signal}`);
  process.exit(signal === 'RED' ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
