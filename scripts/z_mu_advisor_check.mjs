import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const policyPath = resolve('data', 'z_mu_advisor_policy.json');
const templatesPath = resolve('data', 'z_mu_advisor_answer_templates.json');
const samplesPath = resolve('data', 'examples', 'z_mu_advisor_sample_questions.json');
const reportJsonPath = resolve('data', 'reports', 'z_mu_advisor_report.json');
const reportMdPath = resolve('data', 'reports', 'z_mu_advisor_report.md');
const indicatorPath = resolve('dashboard', 'data', 'amk_project_indicators.json');

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

const BOOL_SAFE = [
  'no_live_ai_provider',
  'no_public_launch',
  'no_user_memory',
  'no_personal_data_collection',
  'no_legal_advice_claim',
  'no_government_impersonation',
  'no_protest_coordination',
  'no_harassment_or_doxxing',
  'no_illegal_leak_guidance',
  'no_ethnic_or_religious_blame'
];

const TEMPLATE_KEYS = [
  'template_id',
  'mode',
  'allowed_use',
  'required_sources',
  'truth_label',
  'safety_signal',
  'refusal_condition',
  'safe_response_pattern',
  'audit_fields'
];

const VALID_TEMPLATE_SAFETY = new Set(['GREEN', 'YELLOW', 'BLUE', 'RED']);

function validatePolicy(policy) {
  const ok = [];
  const advisory = [];
  const red = [];

  if (policy.mode === 'advisor_framework_only') ok.push('mode is advisor_framework_only.');
  else red.push('mode must be advisor_framework_only.');

  for (const k of BOOL_SAFE) {
    if (policy[k] === true) ok.push(`${k} is true.`);
    else red.push(`${k} must be true for Phase 1 safety posture.`);
  }

  const labels = new Set(toArray(policy.required_answer_labels).map(String));
  const needLabels = ['verified', 'needs_citation', 'procedural', 'policy_proposal', 'blocked', 'human_review'];
  const missL = needLabels.filter((x) => !labels.has(x));
  if (missL.length === 0) ok.push('required_answer_labels complete.');
  else red.push(`required_answer_labels missing: ${missL.join(', ')}`);

  const modes = new Set(toArray(policy.allowed_modes).map(String));
  if (modes.size >= 8) ok.push('allowed_modes populated.');
  else advisory.push('allowed_modes count lower than expected — verify list.');
  const forbidden = toArray(policy.forbidden_user_message_substrings).map((x) => String(x).toLowerCase());
  if (forbidden.length >= 5) ok.push('forbidden_user_message_substrings present.');
  else advisory.push('forbidden_user_message_substrings short — expand with AMK review.');

  return { ok, advisory, red, labels, modes, forbidden };
}

function validateTemplates(templatesDoc, labels, modes) {
  const ok = [];
  const red = [];
  const templates = toArray(templatesDoc.templates);
  if (templates.length === 0) {
    red.push('templates array empty.');
    return { ok, red, templates: [] };
  }
  ok.push(`templates count: ${templates.length}.`);

  for (const t of templates) {
    const miss = TEMPLATE_KEYS.filter((k) => t[k] === undefined || t[k] === null);
    if (miss.length) {
      red.push(`template ${t.template_id ?? '(no id)'} missing: ${miss.join(', ')}`);
      continue;
    }
    if (!labels.has(String(t.truth_label)))
      red.push(`template ${t.template_id} truth_label not in policy required_answer_labels.`);
    if (!modes.has(String(t.mode))) red.push(`template ${t.template_id} mode not in allowed_modes.`);
    if (!VALID_TEMPLATE_SAFETY.has(String(t.safety_signal)))
      red.push(`template ${t.template_id} safety_signal invalid.`);
    if (!Array.isArray(t.required_sources)) red.push(`template ${t.template_id} required_sources must be array.`);
    if (!Array.isArray(t.audit_fields) || t.audit_fields.length === 0)
      red.push(`template ${t.template_id} audit_fields must be non-empty array.`);
  }
  return { ok, red, templates };
}

function classifySample(sample, forbiddenSubs) {
  const msg = String(sample.user_message ?? '').toLowerCase();
  const reasons = [];

  for (const sub of forbiddenSubs) {
    if (sub && msg.includes(sub)) return { signal: 'RED', reasons: [`forbidden pattern in user_message: ${sub}`] };
  }

  if (sample.flags?.requires_human_review === true)
    return { signal: 'BLUE', reasons: ['human/legal/ethics review required for this prompt shape'] };

  if (msg.includes('naming') && msg.includes('corruption') && msg.includes('rumor'))
    return { signal: 'BLUE', reasons: ['serious accusation / publication intent — gate before any assistant output'] };

  if (sample.mode === 'claim_checker') {
    if (msg.includes('flyer') || msg.includes('state') || msg.includes('fact'))
      return { signal: 'YELLOW', reasons: ['public claim requires citation — needs_citation truth path'] };
    return { signal: 'YELLOW', reasons: ['claim_checker defaults to evidence-first / needs_citation posture'] };
  }

  if (sample.mode === 'citation_helper') return { signal: 'YELLOW', reasons: ['citation helper implies needs_citation until sources attached'] };

  if (sample.mode === 'policy_explainer') return { signal: 'GREEN', reasons: ['policy scenario OK if labeled not prediction'] };

  if (sample.mode === 'learn_governance' || sample.mode === 'evidence_checklist')
    return { signal: 'GREEN', reasons: ['procedural / educational framing'] };

  if (sample.mode === 'understand_my_situation')
    return { signal: 'GREEN', reasons: ['neutral clarification mode — still no PII logging in live phase'] };

  if (sample.mode === 'safe_wording_rewrite')
    return { signal: 'GREEN', reasons: ['safe wording path if input passes escalation filter'] };

  if (sample.mode === 'escalation_filter') return { signal: 'GREEN', reasons: ['mode is filter — sample text should be clean in default set'] };

  return { signal: 'YELLOW', reasons: ['unmapped sample mode — review'] };
}

function overallSignal(regRed, results) {
  if (regRed.length > 0) return 'RED';
  if (results.some((r) => r.signal === 'RED')) return 'RED';
  if (results.some((r) => r.signal === 'BLUE')) return 'BLUE';
  if (results.some((r) => r.signal === 'YELLOW')) return 'YELLOW';
  return 'GREEN';
}

function mdReport(report) {
  const lines = [
    '# Z-MU Civic Knowledge Advisor Report',
    '',
    `- Signal: **${report.signal}**`,
    `- Mode: ${report.policy_mode}`,
    `- Timestamp: ${report.generated_at}`,
    '',
    '## Policy / template checks',
    ''
  ];
  for (const x of report.registry_checks.passed) lines.push(`- PASS: ${x}`);
  for (const x of report.registry_checks.advisory) lines.push(`- ADVISORY: ${x}`);
  for (const x of report.registry_checks.red) lines.push(`- RED: ${x}`);
  lines.push('', '## Sample question classifications', '');
  for (const row of report.sample_results) {
    lines.push(`### ${row.question_id}`, '');
    lines.push(`- Signal: **${row.signal}**`);
    lines.push(`- Mode: ${row.mode}`);
    if (row.reasons && row.reasons.length) lines.push(`- Notes: ${row.reasons.join('; ')}`);
    lines.push('');
  }
  lines.push('## Summary', '', JSON.stringify(report.summary, null, 2), '', '## Locked law', '');
  for (const l of report.locked_law) lines.push(`- ${l}`);
  return `${lines.join('\n')}\n`;
}

async function syncIndicator(signal) {
  try {
    const doc = JSON.parse(await readFile(indicatorPath, 'utf8'));
    const indicators = toArray(doc.indicators);
    const ix = indicators.findIndex((row) => row.id === 'z_mu_civic_knowledge_advisor');
    if (ix >= 0) {
      indicators[ix].signal = signal;
      doc.indicators = indicators;
      await writeFile(indicatorPath, `${JSON.stringify(doc, null, 2)}\n`, 'utf8');
    }
  } catch {
    // optional
  }
}

async function main() {
  const policy = JSON.parse(await readFile(policyPath, 'utf8'));
  const templatesDoc = JSON.parse(await readFile(templatesPath, 'utf8'));
  const samplesDoc = JSON.parse(await readFile(samplesPath, 'utf8'));

  const regVal = validatePolicy(policy);
  const tmplVal = validateTemplates(templatesDoc, regVal.labels, regVal.modes);

  const regChecks = {
    passed: [...regVal.ok, ...tmplVal.ok],
    advisory: [...regVal.advisory],
    red: [...regVal.red, ...tmplVal.red]
  };

  const includeRedFixture = process.env.Z_MU_ADVISOR_INCLUDE_RED_FIXTURE === '1';
  let samples = toArray(samplesDoc.samples);
  if (includeRedFixture) samples = [...samples, ...toArray(samplesDoc.fixture_samples_red)];

  const sampleResults = [];
  for (const s of samples) {
    const qid = s.question_id ?? '(missing question_id)';
    if (!s.user_message || !s.mode) {
      sampleResults.push({
        question_id: qid,
        mode: s.mode,
        signal: 'RED',
        reasons: ['missing user_message or mode']
      });
      continue;
    }
    const out = classifySample(s, regVal.forbidden);
    sampleResults.push({
      question_id: s.question_id,
      mode: s.mode,
      signal: out.signal,
      reasons: out.reasons
    });
  }

  const signal = overallSignal(regChecks.red, sampleResults);
  const summary = {
    green: sampleResults.filter((x) => x.signal === 'GREEN').length,
    yellow: sampleResults.filter((x) => x.signal === 'YELLOW').length,
    blue: sampleResults.filter((x) => x.signal === 'BLUE').length,
    red: sampleResults.filter((x) => x.signal === 'RED').length
  };

  const report = {
    schema: 'z.mu.advisor.report.v1',
    module_id: 'z_mu_civic_knowledge_advisor',
    signal,
    policy_mode: policy.mode ?? 'unknown',
    generated_at: new Date().toISOString(),
    fixtures_included: includeRedFixture,
    registry_checks: regChecks,
    template_count: toArray(templatesDoc.templates).length,
    sample_results: sampleResults,
    summary,
    locked_law: [
      'Civic advisor is not government authority.',
      'Explanation is not legal advice.',
      'Source link is not proof.',
      'Answer log is not surveillance.',
      'User question is not consent to store personal data.',
      'GREEN is not public launch.',
      'BLUE requires human/legal/ethics review.',
      'RED blocks movement.',
      'AMK-Goku owns sacred moves.'
    ]
  };

  await mkdir(dirname(reportJsonPath), { recursive: true });
  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(reportMdPath, mdReport(report), 'utf8');
  await syncIndicator(signal);

  console.log(`Z-MU Civic Knowledge Advisor signal: ${signal}`);
  process.exit(signal === 'RED' ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
