import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const registryPath = resolve('data', 'z_legal_ops_registry.json');
const policyPath = resolve('data', 'z_legal_ops_policy.json');
const samplesPath = resolve('data', 'examples', 'z_legal_ops_review_samples.json');
const reportJsonPath = resolve('data', 'reports', 'z_legal_ops_report.json');
const reportMdPath = resolve('data', 'reports', 'z_legal_ops_report.md');

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

const RED_PHRASES = [
  'give legal advice',
  'solicitor endorsement',
  'named lawyer endorsement',
  'client intake form',
  'client upload',
  'upload evidence',
  'auto email',
  'court filing',
  'payment activation',
  'deploy now',
  'public lawyer profile'
];

function textBlob(sample) {
  return `${sample.prompt ?? ''} ${sample.proposed_behavior ?? ''}`.toLowerCase();
}

function classifySample(sample) {
  const t = textBlob(sample);
  const outs = new Set(toArray(sample.proposed_outputs).map(String));

  const redOutputs = [
    'legal_advice_claim',
    'lawyer_impersonation',
    'public_endorsement_claim',
    'client_data_collection',
    'evidence_upload_runtime',
    'gdpr_sar_auto_send',
    'court_filing',
    'email_sending',
    'payment_activation',
    'provider_call',
    'deployment',
    'named_lawyer_ui_without_consent'
  ];
  for (const ro of redOutputs) {
    if (outs.has(ro)) return { signal: 'RED', reasons: [`Forbidden output present: ${ro}.`] };
  }
  for (const phrase of RED_PHRASES) {
    if (t.includes(phrase)) return { signal: 'RED', reasons: [`Forbidden phrase matched: "${phrase}".`] };
  }

  if (sample.flags?.requires_contract_decision === true || sample.flags?.requires_written_consent === true) {
    return { signal: 'BLUE', reasons: ['Real lawyer identity/contract decision requires AMK + legal human review.'] };
  }
  if (
    t.includes('retention') &&
    (t.includes('missing') || t.includes('not yet') || t.includes('gap') || t.includes('incomplete'))
  ) {
    return { signal: 'YELLOW', reasons: ['Missing retention/metadata detail; concept is incomplete.'] };
  }

  return { signal: 'GREEN', reasons: ['Concept-only legal governance posture; no runtime legal lane.'] };
}

function validateRegistry(registry, policy) {
  const out = { passed: [], advisory: [], red: [] };

  if (registry.schema !== 'z.legal.ops.registry.v1') out.red.push('schema must be z.legal.ops.registry.v1');
  else out.passed.push('registry schema ok.');
  if (policy.schema !== 'z.legal.ops.policy.v1') out.red.push('policy schema must be z.legal.ops.policy.v1');
  else out.passed.push('policy schema ok.');
  if (registry.mode !== 'legal_governance_concept_only') out.red.push('mode must be legal_governance_concept_only.');
  else out.passed.push('mode legal_governance_concept_only.');

  const mustTrue = [
    'no_legal_advice_claim',
    'no_lawyer_endorsement_without_signed_agreement',
    'no_real_lawyer_names_public_ui_without_consent',
    'no_client_data_intake_phase_1',
    'no_evidence_upload_phase_1',
    'no_case_management_runtime_phase_1',
    'no_public_launch_phase_1',
    'no_privileged_data_storage_phase_1',
    'ai_must_recommend_qualified_professional',
    'human_lawyer_review_required_for_legal_advice'
  ];
  const miss = mustTrue.filter((k) => policy[k] !== true);
  if (miss.length) out.red.push(`policy true flags missing: ${miss.join(', ')}`);
  else out.passed.push('policy boundary flags complete.');

  const identity = registry.advisor_identity_policy || {};
  if (
    identity.no_real_names_without_written_consent !== true ||
    identity.no_endorsement_without_contract !== true ||
    identity.no_ai_impersonation !== true ||
    identity.placeholder_personas_only !== true
  ) {
    out.red.push('advisor_identity_policy requires strict consent/contract/no-impersonation truths.');
  } else {
    out.passed.push('advisor identity policy locked.');
  }

  const legalBoundary = registry.legal_boundary || {};
  if (
    legalBoundary.ai_does_not_give_legal_advice !== true ||
    legalBoundary.lawyers_decide_legal_advice !== true ||
    legalBoundary.humans_decide_sharing !== true
  ) {
    out.red.push('legal_boundary must preserve human legal authority.');
  } else {
    out.passed.push('legal boundary retains human legal authority.');
  }

  const layers = toArray(registry.layers);
  if (layers.length < 4) out.red.push('layers list incomplete.');
  else out.passed.push('layers list present.');

  const panels = toArray(registry.dashboard_panels);
  if (panels.length < 8) out.advisory.push('dashboard_panels is sparse; consider adding missing concept panels.');
  else out.passed.push('dashboard panel list populated.');

  return out;
}

function signalRank(sig) {
  const s = String(sig || '').toUpperCase();
  if (s === 'RED') return 0;
  if (s === 'BLUE') return 1;
  if (s === 'YELLOW') return 2;
  return 3;
}

function worstSignal(registryRed, results) {
  if (registryRed.length > 0) return 'RED';
  let w = 'GREEN';
  for (const r of results) {
    if (signalRank(r.signal) < signalRank(w)) w = r.signal;
  }
  return w;
}

function buildMd(report) {
  const lines = [
    '# Z-Legal Ops Report',
    '',
    `- Signal: **${report.signal}**`,
    `- Mode: ${report.mode}`,
    `- Generated: ${report.generated_at}`,
    '- Phase posture: concept/docs/policy/report only.',
    '',
    '## Registry and policy checks',
    ''
  ];
  for (const p of report.registry_validation.passed) lines.push(`- PASS: ${p}`);
  for (const a of report.registry_validation.advisory) lines.push(`- ADVISORY: ${a}`);
  for (const r of report.registry_validation.red) lines.push(`- RED: ${r}`);
  lines.push('', '## Sample summary', '', JSON.stringify(report.summary, null, 2), '', '## Sample rows', '');
  for (const row of report.sample_results) {
    lines.push(`### ${row.sample_id}`);
    lines.push(`- Signal: **${row.signal}**`);
    lines.push(`- ${row.reasons.join('; ')}`);
    lines.push('');
  }
  lines.push('## Locked law', '');
  for (const l of report.locked_law) lines.push(`- ${l}`);
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  const policy = JSON.parse(await readFile(policyPath, 'utf8'));
  const samplesDoc = JSON.parse(await readFile(samplesPath, 'utf8'));

  const validation = validateRegistry(registry, policy);
  const includeRed = process.env.Z_LEGAL_OPS_INCLUDE_RED_FIXTURE === '1';
  let samples = toArray(samplesDoc.samples);
  if (includeRed) samples = [...samples, ...toArray(samplesDoc.fixture_samples_red)];

  const sample_results = samples.map((sample) => {
    const verdict = classifySample(sample);
    return {
      sample_id: sample.sample_id,
      signal: verdict.signal,
      reasons: verdict.reasons,
      outputs_declared: toArray(sample.proposed_outputs)
    };
  });

  const signal = worstSignal(validation.red, sample_results);
  const summary = {
    green: sample_results.filter((x) => x.signal === 'GREEN').length,
    yellow: sample_results.filter((x) => x.signal === 'YELLOW').length,
    blue: sample_results.filter((x) => x.signal === 'BLUE').length,
    red: sample_results.filter((x) => x.signal === 'RED').length
  };

  const report = {
    schema: 'z.legal.ops.report.v1',
    module_id: 'z_legal_ops_workstation',
    signal,
    mode: registry.mode,
    generated_at: new Date().toISOString(),
    phase: 'Z-LEGAL-OPS-1',
    runtime_features_enabled: false,
    fixtures_red_included: includeRed,
    registry_validation: validation,
    summary,
    sample_results,
    locked_law: toArray(registry.locked_law)
  };

  await mkdir(dirname(reportJsonPath), { recursive: true });
  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(reportMdPath, `${buildMd(report)}\n`, 'utf8');

  console.log(`Z-Legal Ops signal: ${signal}`);
  process.exit(signal === 'RED' ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
