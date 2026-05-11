import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const registryPath = resolve('data', 'z_legal_product_ops_registry.json');
const policyPath = resolve('data', 'z_legal_product_ops_policy.json');
const samplesPath = resolve('data', 'examples', 'z_legal_product_review_samples.json');
const reportJsonPath = resolve('data', 'reports', 'z_legal_product_ops_report.json');
const reportMdPath = resolve('data', 'reports', 'z_legal_product_ops_report.md');

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

const RED_PHRASES = [
  'launch now',
  'manufacturing order',
  'supplier api',
  'pay supplier',
  'medical claim',
  'certified safe',
  'patent filed',
  'trademark registered',
  'legal endorsement',
  'collect client data',
  'upload evidence',
  'live map tracking',
  'world tracking',
  'cloudflare deploy'
];

function textBlob(sample) {
  return `${sample.prompt ?? ''} ${sample.proposed_behavior ?? ''}`.toLowerCase();
}

function classifySample(sample) {
  const t = textBlob(sample);
  const outputs = new Set(toArray(sample.proposed_outputs).map(String));

  const redOuts = [
    'product_launch',
    'manufacturing_order',
    'supplier_api_call',
    'payment_activation',
    'medical_claim_publication',
    'safety_certification_claim',
    'patent_filing_claim',
    'trademark_registration_claim',
    'legal_advice_claim',
    'lawyer_endorsement_claim',
    'client_data_collection',
    'evidence_upload_runtime',
    'world_tracking_or_surveillance',
    'cloudflare_deploy'
  ];
  for (const out of redOuts) {
    if (outputs.has(out)) return { signal: 'RED', reasons: [`Forbidden output present: ${out}.`] };
  }
  for (const phrase of RED_PHRASES) {
    if (t.includes(phrase)) {
      const negated = t.includes(`no ${phrase}`) || t.includes(`not ${phrase}`) || t.includes(`without ${phrase}`);
      if (!negated) return { signal: 'RED', reasons: [`Forbidden phrase matched: "${phrase}".`] };
    }
  }

  if (
    sample.flags?.requires_health_claim_review === true ||
    sample.flags?.requires_supplier_contract_gate === true ||
    sample.flags?.requires_ip_professional_review === true
  ) {
    return { signal: 'BLUE', reasons: ['Lawyer/IP/product-safety human decision gate required before any widening.'] };
  }

  if (t.includes('safety') && (t.includes('missing') || t.includes('incomplete') || t.includes('gap'))) {
    return { signal: 'YELLOW', reasons: ['Safety metadata incomplete; review panel needs completion.'] };
  }

  return { signal: 'GREEN', reasons: ['Governance concept only; no product launch or legal runtime enabled.'] };
}

function validateRegistryPolicy(registry, policy) {
  const out = { passed: [], advisory: [], red: [] };

  if (registry.schema !== 'z.legal.product.ops.registry.v1')
    out.red.push('registry schema must be z.legal.product.ops.registry.v1');
  else out.passed.push('registry schema ok.');

  if (policy.schema !== 'z.legal.product.ops.policy.v1') out.red.push('policy schema must be z.legal.product.ops.policy.v1');
  else out.passed.push('policy schema ok.');

  if (registry.mode !== 'product_legal_governance_concept_only')
    out.red.push('mode must be product_legal_governance_concept_only.');
  else out.passed.push('mode product_legal_governance_concept_only.');

  const worlds = toArray(registry.workstation_worlds);
  if (worlds.length < 6) out.red.push('workstation_worlds incomplete.');
  else out.passed.push('six governance worlds mapped.');

  const families = toArray(registry.product_families);
  if (families.length < 8) out.red.push('product_families incomplete.');
  else out.passed.push('product family map present.');

  const requiredTrue = [
    'no_product_launch_phase_1',
    'no_manufacturing_commitment_phase_1',
    'no_supplier_connector_phase_1',
    'no_medical_or_health_claims_without_review',
    'no_certification_claims_without_evidence',
    'no_ip_registration_claims_without_filing_evidence',
    'no_lawyer_endorsement_without_signed_agreement',
    'no_client_data_intake_phase_1',
    'no_live_map_tracking',
    'no_cloudflare_deploy_phase_1',
    'canvas_is_visual_governance_only',
    'human_lawyer_review_required'
  ];
  const missing = requiredTrue.filter((key) => policy[key] !== true);
  if (missing.length > 0) out.red.push(`policy true flags missing: ${missing.join(', ')}`);
  else out.passed.push('policy gates complete.');

  const amkGates = toArray(policy.AMK_gate_required_for);
  if (amkGates.length < 8) out.advisory.push('AMK gate list is sparse.');
  else out.passed.push('AMK gate list populated.');

  return out;
}

function signalRank(signal) {
  const s = String(signal || '').toUpperCase();
  if (s === 'RED') return 0;
  if (s === 'BLUE') return 1;
  if (s === 'YELLOW') return 2;
  return 3;
}

function worstSignal(registryRed, sampleResults) {
  if (registryRed.length > 0) return 'RED';
  let current = 'GREEN';
  for (const sample of sampleResults) {
    if (signalRank(sample.signal) < signalRank(current)) current = sample.signal;
  }
  return current;
}

function buildReportMd(report) {
  const lines = [
    '# Z-Legal Product Ops Report',
    '',
    `- Signal: **${report.signal}**`,
    `- Mode: ${report.mode}`,
    `- Generated: ${report.generated_at}`,
    '- Posture: legal/product/IP governance concept only.',
    '',
    '## Registry and policy checks',
    ''
  ];
  for (const pass of report.registry_validation.passed) lines.push(`- PASS: ${pass}`);
  for (const adv of report.registry_validation.advisory) lines.push(`- ADVISORY: ${adv}`);
  for (const red of report.registry_validation.red) lines.push(`- RED: ${red}`);
  lines.push('', '## Product families', '');
  for (const family of report.product_families) lines.push(`- ${family}`);
  lines.push('', '## Sample summary', '', JSON.stringify(report.summary, null, 2), '', '## Sample rows', '');
  for (const row of report.sample_results) {
    lines.push(`### ${row.sample_id}`);
    lines.push(`- Signal: **${row.signal}**`);
    lines.push(`- ${row.reasons.join('; ')}`);
    lines.push('');
  }
  lines.push('## Locked law', '');
  for (const law of report.locked_law) lines.push(`- ${law}`);
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  const policy = JSON.parse(await readFile(policyPath, 'utf8'));
  const samplesDoc = JSON.parse(await readFile(samplesPath, 'utf8'));

  const registryValidation = validateRegistryPolicy(registry, policy);
  const includeRedFixture = process.env.Z_LEGAL_PRODUCT_OPS_INCLUDE_RED_FIXTURE === '1';

  let samples = toArray(samplesDoc.samples);
  if (includeRedFixture) samples = [...samples, ...toArray(samplesDoc.fixture_samples_red)];

  const sampleResults = samples.map((sample) => {
    const verdict = classifySample(sample);
    return {
      sample_id: sample.sample_id,
      signal: verdict.signal,
      reasons: verdict.reasons,
      outputs_declared: toArray(sample.proposed_outputs)
    };
  });

  const signal = worstSignal(registryValidation.red, sampleResults);
  const summary = {
    green: sampleResults.filter((x) => x.signal === 'GREEN').length,
    yellow: sampleResults.filter((x) => x.signal === 'YELLOW').length,
    blue: sampleResults.filter((x) => x.signal === 'BLUE').length,
    red: sampleResults.filter((x) => x.signal === 'RED').length
  };

  const report = {
    schema: 'z.legal.product.ops.report.v1',
    module_id: 'z_legal_product_ops_workstation',
    phase: 'Z-LEGAL-PRODUCT-OPS-1',
    mode: registry.mode,
    signal,
    generated_at: new Date().toISOString(),
    runtime_features_enabled: false,
    fixtures_red_included: includeRedFixture,
    product_families: toArray(registry.product_families),
    registry_validation: registryValidation,
    summary,
    sample_results: sampleResults,
    locked_law: toArray(registry.locked_law)
  };

  await mkdir(dirname(reportJsonPath), { recursive: true });
  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(reportMdPath, `${buildReportMd(report)}\n`, 'utf8');

  console.log(`Z-Legal Product Ops signal: ${signal}`);
  process.exit(signal === 'RED' ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
