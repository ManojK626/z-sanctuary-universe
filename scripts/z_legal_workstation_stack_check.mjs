import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const registryPath = resolve('data', 'z_legal_workstation_stack_registry.json');
const policyPath = resolve('data', 'z_legal_workstation_stack_policy.json');
const samplesPath = resolve('data', 'examples', 'z_legal_workstation_stack_samples.json');
const reportJsonPath = resolve('data', 'reports', 'z_legal_workstation_stack_report.json');
const reportMdPath = resolve('data', 'reports', 'z_legal_workstation_stack_report.md');

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

const RED_PHRASES = [
  'give legal advice now',
  'auto-send legal advice',
  'court filing',
  'client intake runtime',
  'upload privileged case files',
  'deploy legal workstation',
  'turn on live tracking',
  'lawyer endorsement guaranteed'
];

function textBlob(sample) {
  return `${sample.prompt ?? ''} ${sample.proposed_behavior ?? ''}`.toLowerCase();
}

function classifySample(sample) {
  const t = textBlob(sample);
  const outputs = new Set(toArray(sample.proposed_outputs).map(String));
  const redOutputs = [
    'legal_advice_runtime',
    'court_filing_automation',
    'email_dispatch_automation',
    'live_client_intake_runtime',
    'privileged_data_upload_runtime',
    'payment_or_billing_activation',
    'supplier_or_provider_api_call',
    'deployment',
    'surveillance_or_live_tracking',
    'lawyer_endorsement_claim',
    'final_legal_approval_by_ai'
  ];

  for (const out of redOutputs) {
    if (outputs.has(out)) return { signal: 'RED', reasons: [`Forbidden output present: ${out}.`] };
  }
  for (const phrase of RED_PHRASES) {
    if (t.includes(phrase)) return { signal: 'RED', reasons: [`Forbidden phrase matched: "${phrase}".`] };
  }

  if (
    sample.flags?.requires_human_legal_approval === true ||
    sample.flags?.requires_simulation_governance_decision === true
  ) {
    return { signal: 'BLUE', reasons: ['Human legal/simulation governance decision gate required.'] };
  }

  if (t.includes('missing') || t.includes('gap') || t.includes('incomplete')) {
    return { signal: 'YELLOW', reasons: ['Metadata or workflow requirement gap detected.'] };
  }

  return { signal: 'GREEN', reasons: ['Governance and requirements posture only; no runtime legal authority enabled.'] };
}

function validateRegistryPolicy(registry, policy) {
  const out = { passed: [], advisory: [], red: [] };

  if (registry.schema !== 'z.legal.workstation.stack.registry.v1') out.red.push('registry schema must be z.legal.workstation.stack.registry.v1');
  else out.passed.push('registry schema ok.');

  if (policy.schema !== 'z.legal.workstation.stack.policy.v1') out.red.push('policy schema must be z.legal.workstation.stack.policy.v1');
  else out.passed.push('policy schema ok.');

  if (registry.mode !== 'legal_workstation_governance_concept_only') out.red.push('mode must be legal_workstation_governance_concept_only.');
  else out.passed.push('mode legal_workstation_governance_concept_only.');

  const domains = toArray(registry.workstation_tool_domains);
  if (domains.length < 10) out.red.push('workstation_tool_domains incomplete.');
  else out.passed.push('workstation tool domains are mapped.');

  const requiredTrue = [
    'no_legal_advice_runtime',
    'no_human_lawyer_impersonation',
    'no_named_lawyer_profile_without_written_consent',
    'no_endorsement_claim_without_signed_agreement',
    'no_live_client_data_intake_phase_1',
    'no_privileged_data_runtime_storage_phase_1',
    'no_court_filing_automation_phase_1',
    'no_email_dispatch_automation_phase_1',
    'no_payment_or_billing_activation_phase_1',
    'no_provider_or_supplier_connector_phase_1',
    'no_deployment_phase_1',
    'no_surveillance_or_live_tracking_phase_1',
    'allow_ai_evidence_indexing_drafts_only',
    'allow_simulation_mode_with_synthetic_data_only',
    'human_lawyer_approval_required_for_any_legal_advice',
    'human_gate_required_for_external_sharing'
  ];
  const missing = requiredTrue.filter((key) => policy[key] !== true);
  if (missing.length > 0) out.red.push(`policy true flags missing: ${missing.join(', ')}`);
  else out.passed.push('policy safeguards complete.');

  const formats = toArray(registry.accepted_media_formats);
  if (!formats.includes('mp3') || !formats.includes('mp4') || !formats.includes('pdf')) {
    out.advisory.push('accepted_media_formats should include at least pdf, mp3, and mp4.');
  } else {
    out.passed.push('document + media format coverage present.');
  }

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
  for (const row of sampleResults) {
    if (signalRank(row.signal) < signalRank(current)) current = row.signal;
  }
  return current;
}

function mdReport(report) {
  const lines = [
    '# Z-Legal Workstation Stack Report',
    '',
    `- Signal: **${report.signal}**`,
    `- Mode: ${report.mode}`,
    `- Generated: ${report.generated_at}`,
    '- Posture: requirements and governance stack only (read-only).',
    '',
    '## Registry and policy checks',
    ''
  ];
  for (const x of report.registry_validation.passed) lines.push(`- PASS: ${x}`);
  for (const x of report.registry_validation.advisory) lines.push(`- ADVISORY: ${x}`);
  for (const x of report.registry_validation.red) lines.push(`- RED: ${x}`);
  lines.push('', '## Tool domains', '');
  for (const d of report.workstation_tool_domains) lines.push(`- ${d}`);
  lines.push('', '## Summary', '', JSON.stringify(report.summary, null, 2), '', '## Sample rows', '');
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
  const includeRedFixture = process.env.Z_LEGAL_WORKSTATION_STACK_INCLUDE_RED_FIXTURE === '1';
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
    schema: 'z.legal.workstation.stack.report.v1',
    module_id: 'z_legal_workstation_stack',
    phase: 'Z-LEGAL-WORKSTATION-STACK-1',
    mode: registry.mode,
    signal,
    generated_at: new Date().toISOString(),
    runtime_features_enabled: false,
    fixtures_red_included: includeRedFixture,
    workstation_tool_domains: toArray(registry.workstation_tool_domains),
    registry_validation: registryValidation,
    summary,
    sample_results: sampleResults,
    locked_law: toArray(registry.locked_law)
  };

  await mkdir(dirname(reportJsonPath), { recursive: true });
  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(reportMdPath, `${mdReport(report)}\n`, 'utf8');

  console.log(`Z-Legal Workstation Stack signal: ${signal}`);
  process.exit(signal === 'RED' ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
