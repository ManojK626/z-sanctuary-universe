import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const registryPath = resolve('data', 'z_reality_navigation_registry.json');
const policyPath = resolve('data', 'z_reality_navigation_policy.json');
const reportJsonPath = resolve('data', 'reports', 'z_reality_navigation_report.json');
const reportMdPath = resolve('data', 'reports', 'z_reality_navigation_report.md');

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function validate(registry, policy) {
  const passed = [];
  const advisory = [];
  const red = [];

  if (registry.schema !== 'z.reality.navigation.registry.v1') {
    red.push('registry schema must be z.reality.navigation.registry.v1');
  } else passed.push('registry schema ok');

  if (policy.schema !== 'z.reality.navigation.policy.v1') {
    red.push('policy schema must be z.reality.navigation.policy.v1');
  } else passed.push('policy schema ok');

  if (registry.mode !== 'architecture_doctrine_only') {
    red.push('registry mode must be architecture_doctrine_only');
  } else passed.push('mode architecture_doctrine_only');

  if (policy.mode !== 'architecture_doctrine_only') {
    red.push('policy mode must be architecture_doctrine_only');
  } else passed.push('policy mode architecture_doctrine_only');

  if (registry.phase !== 'Z-RNS-ARCH-1') {
    advisory.push(`registry phase is ${registry.phase}; expected Z-RNS-ARCH-1 for this check`);
  } else passed.push('phase Z-RNS-ARCH-1');

  const layers = toArray(registry.layers);
  if (layers.length < 3) red.push('registry must define at least 3 layers');
  else passed.push(`layers count: ${layers.length}`);

  const requiredLayerIds = [
    'z_justice_games',
    'z_legal_evidence_core',
    'z_life_navigation_ecosystem',
  ];
  for (const id of requiredLayerIds) {
    if (!layers.some((l) => l.id === id)) red.push(`missing layer id: ${id}`);
  }
  if (red.length === 0) passed.push('required layers present');

  if (toArray(registry.phases).length < 8) {
    advisory.push('fewer than 8 phases documented; master roadmap may be incomplete');
  } else passed.push('phase roadmap present');

  if (policy.legal_boundary?.ai_summaries_not_legal_clearance !== true) {
    red.push('policy must set ai_summaries_not_legal_clearance true');
  } else passed.push('legal boundary: AI summaries ≠ legal clearance');

  if (policy.simulation_boundary?.synthetic_data_only !== true) {
    red.push('policy must require synthetic_data_only for simulation');
  } else passed.push('simulation boundary: synthetic only');

  if (toArray(registry.forbidden_runtime_in_arch_phase).length === 0) {
    red.push('forbidden_runtime_in_arch_phase must be non-empty');
  } else passed.push('arch-phase forbidden runtime list present');

  return { passed, advisory, red };
}

async function main() {
  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  const policy = JSON.parse(await readFile(policyPath, 'utf8'));
  const result = validate(registry, policy);
  const signal = result.red.length > 0 ? 'RED' : result.advisory.length > 0 ? 'BLUE' : 'GREEN';

  const report = {
    schema: 'z.reality.navigation.report.v1',
    generated_at: new Date().toISOString(),
    phase: registry.phase,
    signal,
    mode: registry.mode,
    passed: result.passed,
    advisory: result.advisory,
    red: result.red,
    layers: toArray(registry.layers).map((l) => ({ id: l.id, status: l.status })),
    next_safe_build: 'Z-RNS-FOUNDATION-1 — Timeline + Evidence Vault local UI prototype',
  };

  await mkdir(dirname(reportJsonPath), { recursive: true });
  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-Reality Navigation System Report',
    '',
    `**Signal:** ${signal}`,
    `**Phase:** ${registry.phase}`,
    `**Mode:** ${registry.mode}`,
    '',
    '## Passed',
    ...result.passed.map((p) => `- ${p}`),
    '',
    '## Advisory',
    ...(result.advisory.length ? result.advisory.map((a) => `- ${a}`) : ['- none']),
    '',
    '## Red',
    ...(result.red.length ? result.red.map((r) => `- ${r}`) : ['- none']),
    '',
    '## Next safe build',
    '',
    report.next_safe_build,
    '',
  ].join('\n');

  await writeFile(reportMdPath, md, 'utf8');

  console.log(`Z-RNS arch signal: ${signal}`);
  if (result.red.length) {
    for (const r of result.red) console.error(`RED: ${r}`);
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
