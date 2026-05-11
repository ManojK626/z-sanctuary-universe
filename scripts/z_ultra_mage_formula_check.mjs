import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const registryPath = resolve('data', 'z_ultra_mage_formula_registry.json');
const samplesPath = resolve('data', 'examples', 'z_ultra_mage_formula_samples.json');
const reportJsonPath = resolve('data', 'reports', 'z_ultra_mage_formula_report.json');
const reportMdPath = resolve('data', 'reports', 'z_ultra_mage_formula_report.md');
const indicatorPath = resolve('dashboard', 'data', 'amk_project_indicators.json');

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function truthyRisk(obj) {
  if (!obj || typeof obj !== 'object') return false;
  return Object.values(obj).some((v) => v === true || v === 'true' || v === 1 || v === '1');
}

function validateRegistry(registry) {
  const ok = [];
  const advisory = [];
  const red = [];

  if (registry.mode === 'formula_governance_only') ok.push('mode is formula_governance_only.');
  else red.push('mode must be formula_governance_only.');

  const engagements = registry.forbidden_output_engagements;
  if (Array.isArray(engagements) && engagements.length === 0) ok.push('forbidden_output_engagements is empty.');
  else red.push('forbidden_output_engagements must be an empty array — no forbidden output may be activated here.');

  const layers = toArray(registry.formula_layers);
  const requiredLayers = [
    'omega_symbolic_expansion',
    'z_ultra_alignment',
    'mage_multiverse_alignment_governance',
    'mod_dist_routing',
    'xbus_connector_permission',
    'replica_fabric_governance',
    'traffic_signal_law',
    'amk_sacred_gate'
  ];
  const lset = new Set(layers.map(String));
  const missingLayer = requiredLayers.filter((x) => !lset.has(x));
  if (missingLayer.length === 0) ok.push('formula_layers lists required canon set.');
  else red.push(`formula_layers missing: ${missingLayer.join(', ')}`);

  const allowed = new Set(toArray(registry.allowed_outputs).map(String));
  if (allowed.size >= 5) ok.push('allowed_outputs present.');
  else red.push('allowed_outputs incomplete.');

  const forbidden = toArray(registry.forbidden_outputs);
  const forbiddenRequired = [
    'live_self_replication',
    'autonomous_deployment',
    'provider_call',
    'payment_activation',
    'secret_write',
    'production_connector',
    'child_data_flow',
    'auto_merge',
    'unbounded_loop'
  ];
  const fset = new Set(forbidden.map(String));
  const missingF = forbiddenRequired.filter((x) => !fset.has(x));
  if (missingF.length === 0) ok.push('forbidden_outputs covers mandated set.');
  else red.push(`forbidden_outputs missing: ${missingF.join(', ')}`);

  const blues = new Set(toArray(registry.source_blueprints));
  if (blues.size >= 4) ok.push('source_blueprints populated.');
  else advisory.push('source_blueprints list is shorter than typical — optional review.');

  return { ok, advisory, red, allowed_outputs: allowed, forbidden_keys: forbidden.map(String), layer_set: lset };
}

function classifySample(sample, allowedOutputs, formulaLayerSet, forbiddenRegistryKeys) {
  const flags = [];

  const layers = toArray(sample.layers_invoked);
  const unknownLayers = layers.filter((x) => !formulaLayerSet.has(String(x)));
  if (unknownLayers.length) flags.push(`unknown formula_layers referenced: ${unknownLayers.join(', ')}`);

  const outs = toArray(sample.declared_outputs);
  const unknownOut = outs.filter((o) => !allowedOutputs.has(String(o)));
  if (unknownOut.length) flags.push(`declared_outputs not in codex: ${unknownOut.join(', ')}`);

  const gate = sample.amk_gate;
  if (!gate || String(gate).trim() === '') flags.push('amk_gate missing');

  const rb = sample.rollback_note !== undefined ? String(sample.rollback_note).trim() : null;
  if (sample.proposal_flags?.charter_for_live_engine && rb !== undefined && rb === '')
    flags.push('rollback_note empty while charter proposal present');

  const prop = sample.proposal_flags ?? {};
  const wantsEngine = prop.charter_for_live_engine === true;
  const wantsExternal = prop.persistent_external_lane === true;

  const risk = sample.execution_risk && typeof sample.execution_risk === 'object' ? sample.execution_risk : {};
  /** @type {Record<string, unknown>} */
  const riskAgainstForbidden = {};
  for (const fk of forbiddenRegistryKeys) {
    if (risk[fk]) riskAgainstForbidden[fk] = risk[fk];
  }
  const unknownRiskTruthy = Object.keys(risk).filter((k) => !forbiddenRegistryKeys.includes(k) && risk[k]);
  if (unknownRiskTruthy.length)
    flags.push(`execution_risk uses unknown/forbidden-registry keys with truthy values: ${unknownRiskTruthy.join(', ')}`);

  return { layers, outs, unknownLayers, unknownOut, flags, wantsEngine, wantsExternal, gate, rb, risk, riskAgainstForbidden };
}

function finalizeSample(bundle) {
  if (truthyRisk(bundle.riskAgainstForbidden))
    return { signal: 'RED', reasons: ['execution_risk engages forbidden_outputs key(s)'] };

  const { wantsEngine, wantsExternal, flags } = bundle;

  if (wantsEngine || wantsExternal) {
    if (flags.length)
      return {
        signal: 'BLUE',
        reasons: [...flags, 'AMK charter decision required for widening scope']
      };
    const kind = wantsEngine ? 'charter_for_live_engine' : 'persistent_external_lane';
    return { signal: 'BLUE', reasons: [`proposal flagged: ${kind}`] };
  }

  if (flags.length) return { signal: 'YELLOW', reasons: flags };
  return { signal: 'GREEN', reasons: ['governance / report posture only'] };
}

function overallSignal(regVal, results) {
  if (regVal.red.length > 0) return 'RED';
  if (results.some((r) => r.signal === 'RED')) return 'RED';
  if (results.some((r) => r.signal === 'BLUE')) return 'BLUE';
  if (results.some((r) => r.signal === 'YELLOW')) return 'YELLOW';
  if (regVal.advisory.length > 0) return 'YELLOW';
  return 'GREEN';
}

function mdReport(report) {
  const lines = [
    '# Z-Ultra MAGE Formula Report',
    '',
    `- Signal: **${report.signal}**`,
    `- Mode: ${report.mode}`,
    `- Timestamp: ${report.generated_at}`,
    '',
    '## Registry validation',
    ''
  ];
  for (const x of report.registry_validation.passed) lines.push(`- PASS: ${x}`);
  for (const x of report.registry_validation.advisory) lines.push(`- ADVISORY: ${x}`);
  for (const x of report.registry_validation.red) lines.push(`- RED: ${x}`);
  lines.push('', '## Samples', '');
  for (const row of report.sample_results) {
    lines.push(`### ${row.formula_instance_id}`, '');
    lines.push(`- Title: ${row.title}`);
    lines.push(`- Signal: **${row.signal}**`);
    if (row.reasons && row.reasons.length) lines.push(`- Notes: ${row.reasons.join('; ')}`);
    lines.push('');
  }
  lines.push('## Summary counts', '');
  lines.push(JSON.stringify(report.summary, null, 2));
  lines.push('', '## Locked law', '');
  for (const l of report.locked_law) lines.push(`- ${l}`);
  return `${lines.join('\n')}\n`;
}

async function syncIndicator(signal) {
  try {
    const doc = JSON.parse(await readFile(indicatorPath, 'utf8'));
    const indicators = toArray(doc.indicators);
    const ix = indicators.findIndex((row) => row.id === 'z_ultra_mage_formula_codex');
    if (ix >= 0) {
      indicators[ix].signal = signal;
      doc.indicators = indicators;
      await writeFile(indicatorPath, `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
    }
  } catch {
    // optional environments
  }
}

async function main() {
  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  const samplesDoc = JSON.parse(await readFile(samplesPath, 'utf8'));
  const fixtures = process.env.Z_ULTRA_MAGE_INCLUDE_FIXTURES === '1';
  let samples = toArray(samplesDoc.samples);
  if (fixtures) samples = [...samples, ...toArray(samplesDoc.fixture_samples)];

  const regVal = validateRegistry(registry);
  /** @type {Array<{formula_instance_id: string; title: string; signal: string; reasons: string[]}>} */
  const sampleResults = [];
  const requiredKeys = ['formula_instance_id', 'title', 'layers_invoked', 'declared_outputs', 'execution_risk', 'amk_gate'];

  for (const s of samples) {
    const fid = s.formula_instance_id ?? '(missing id)';
    const missing = requiredKeys.filter((k) => s[k] === undefined || s[k] === null);
    if (missing.length) {
      sampleResults.push({
        formula_instance_id: fid,
        title: s.title ?? '',
        signal: 'RED',
        reasons: [`missing keys: ${missing.join(', ')}`]
      });
      continue;
    }

    const bundle = classifySample(s, regVal.allowed_outputs, regVal.layer_set, regVal.forbidden_keys.map(String));

    const out = finalizeSample(bundle);

    sampleResults.push({
      formula_instance_id: s.formula_instance_id,
      title: s.title,
      signal: out.signal,
      reasons: out.reasons || []
    });
  }

  const signal = overallSignal(regVal, sampleResults);
  const summary = {
    green: sampleResults.filter((x) => x.signal === 'GREEN').length,
    yellow: sampleResults.filter((x) => x.signal === 'YELLOW').length,
    blue: sampleResults.filter((x) => x.signal === 'BLUE').length,
    red: sampleResults.filter((x) => x.signal === 'RED').length
  };

  const report = {
    schema: 'z.ultra.mage.formula.report.v1',
    module_id: 'z_ultra_mage_formula_codex',
    signal,
    mode: registry.mode ?? 'unknown',
    registry_name: registry.registry_name ?? 'Z-Ultra MAGE Formula Codex',
    generated_at: new Date().toISOString(),
    fixtures_included: fixtures,
    registry_validation: {
      passed: regVal.ok,
      advisory: [...regVal.advisory],
      red: regVal.red
    },
    sample_results: sampleResults,
    summary,
    locked_law: toArray(registry.locked_law),
    related_docs: toArray(registry.related_docs),
    related_reports: toArray(registry.related_reports)
  };

  await mkdir(dirname(reportJsonPath), { recursive: true });
  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(reportMdPath, mdReport(report), 'utf8');
  await syncIndicator(signal);

  console.log(`Z-Ultra MAGE formula codex signal: ${signal}`);
  process.exit(signal === 'RED' ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
