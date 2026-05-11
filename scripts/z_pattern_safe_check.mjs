import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const registryPath = resolve('data', 'z_pattern_safe_registry.json');
const samplesPath = resolve('data', 'examples', 'z_pattern_safe_samples.json');
const reportJsonPath = resolve('data', 'reports', 'z_pattern_safe_report.json');
const reportMdPath = resolve('data', 'reports', 'z_pattern_safe_report.md');
const indicatorPath = resolve('dashboard', 'data', 'amk_project_indicators.json');

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

const GAMBLE_OR_BANKROLL = new Set(['gambling_related_prediction', 'bankroll_or_money_management']);

const RED_LANGUAGE = [
  'guaranteed prediction',
  'bet on red',
  'knows the next roulette',
  'bet on ',
  'this ai knows the next'
];

/** @returns {{ signal: string, reasons: string[] }} */
function classifySample(sample, allowed, gated) {
  const text = `${sample.use_case ?? ''} ${sample.description ?? ''}`.toLowerCase();
  const reasons = [];

  const flags = sample.flags && typeof sample.flags === 'object' ? sample.flags : {};
  if (flags.live_money_enabled === true)
    return { signal: 'RED', reasons: ['live_money_enabled flag — sacred / charter-only'] };
  if (flags.deploy_public_surface === true)
    return { signal: 'RED', reasons: ['deploy_public_surface flag — blocked in pattern_governance_only'] };
  if (flags.gambling_instruction_export === true)
    return { signal: 'RED', reasons: ['gambling_instruction_export flag — blocked'] };

  for (const phrase of RED_LANGUAGE) {
    if (phrase === 'bet on ') {
      if (/\bbet\s+on\s+\w/.test(text)) return { signal: 'RED', reasons: [`instructional wager language matched`] };
      continue;
    }
    if (text.includes(phrase)) return { signal: 'RED', reasons: [`forbidden escalation language: "${phrase}"`] };
  }
  if (/guaranteed\s+(win|outcome)/i.test(sample.description ?? ''))
    return { signal: 'RED', reasons: ['guaranteed outcome language'] };

  const domain = String(sample.domain ?? '');
  if (gated.has(domain)) {
    reasons.push(`gated domain: ${domain} — AMK/human gate before outward claim`);
    return { signal: 'BLUE', reasons };
  }

  if (allowed.has(domain)) {
    const posture = String(sample.posture ?? '');
    if (domain === 'uncertainty_simulation' && posture.includes('concept_stub'))
      return { signal: 'YELLOW', reasons: ['simulation vocabulary without evidence pack attached'] };
    reasons.push(`allowed domain ${domain} — educate/simulate/report framing`);
    return { signal: 'GREEN', reasons };
  }

  return { signal: 'YELLOW', reasons: ['domain not in registry lists — remap required'] };
}

function validateRegistry(reg) {
  /** @type {{ passed: string[], advisory: string[], red: string[] }} */
  const out = { passed: [], advisory: [], red: [] };

  if (reg.schema !== 'z.pattern.safe.registry.v1') out.red.push('schema must be z.pattern.safe.registry.v1.');
  else out.passed.push('schema matches registry v1.');

  if (reg.mode !== 'pattern_governance_only')
    out.red.push('mode must be pattern_governance_only.');
  else out.passed.push('mode is pattern_governance_only.');

  if (reg.registry_name?.includes?.('Z-Pattern Safe')) out.passed.push('registry_name present.');
  else out.advisory.push('registry_name wording should identify Z-Pattern Safe governance.');

  const allowed = new Set(toArray(reg.allowed_domains).map(String));
  const gated = new Set(toArray(reg.gated_domains).map(String));
  if (allowed.size >= 6) out.passed.push('allowed_domains populated.');
  else out.red.push('allowed_domains incomplete.');

  if (gated.size >= 6) out.passed.push('gated_domains populated.');
  else out.red.push('gated_domains incomplete.');

  const forbidden = toArray(reg.forbidden_claims);
  if (forbidden.length >= 6) out.passed.push('forbidden_claims list present.');
  else out.red.push('forbidden_claims list incomplete.');

  const enabledPaths = toArray(reg.forbidden_claim_paths_enabled);
  if (enabledPaths.length === 0) out.passed.push('no forbidden_claim_paths_enabled (correct for Phase 1).');
  else out.red.push('forbidden_claim_paths_enabled must be empty until separately chartered.');

  const hr = reg.high_risk_runtime_flags && typeof reg.high_risk_runtime_flags === 'object' ? reg.high_risk_runtime_flags : {};
  for (const [k, v] of Object.entries(hr)) {
    if (v !== false)
      out.red.push(`high_risk_runtime_flags.${k} must be false in pattern_governance_only (got ${v}).`);
  }
  if (!out.red.some((x) => x.includes('high_risk_runtime_flags')))
    out.passed.push('high_risk_runtime_flags all false.');

  if (!reg.signal_rules || typeof reg.signal_rules !== 'object') out.red.push('signal_rules object required.');
  else {
    const need = ['GREEN', 'YELLOW', 'BLUE', 'RED'];
    const miss = need.filter((k) => !reg.signal_rules[k]);
    if (miss.length) out.red.push(`signal_rules missing: ${miss.join(', ')}`);
    else out.passed.push('signal_rules has GREEN/YELLOW/BLUE/RED.');
  }

  return { ...out, allowed, gated };
}

function overallSignal(registryRed, results) {
  if (registryRed.length > 0) return 'RED';
  if (results.some((r) => r.signal === 'RED')) return 'RED';
  if (results.some((r) => r.signal === 'BLUE')) return 'BLUE';
  if (results.some((r) => r.signal === 'YELLOW')) return 'YELLOW';
  return 'GREEN';
}

function enforceGamblingMoneyNotGreen(sample, classified) {
  const domain = String(sample.domain ?? '');
  if (!GAMBLE_OR_BANKROLL.has(domain)) return null;
  if (classified.signal === 'GREEN')
    return `Sample ${sample.sample_id}: domain ${domain} must not classify GREEN — use BLUE (gated simulation) or RED (instruction).`;
  return null;
}

function mdReport(report) {
  const lines = [
    '# Z-Pattern Safe Governance Report',
    '',
    `- Signal: **${report.signal}**`,
    `- Mode: ${report.registry_mode}`,
    `- Timestamp: ${report.generated_at}`,
    '',
    '## Registry checks',
    ''
  ];
  for (const x of report.registry_checks.passed) lines.push(`- PASS: ${x}`);
  for (const x of report.registry_checks.advisory) lines.push(`- ADVISORY: ${x}`);
  for (const x of report.registry_checks.red) lines.push(`- RED: ${x}`);
  lines.push('', '## Sample classifications', '');
  for (const row of report.sample_results) {
    lines.push(`### ${row.sample_id}`, '');
    lines.push(`- Signal: **${row.signal}**`);
    lines.push(`- Domain: ${row.domain}`);
    if (row.reasons?.length) lines.push(`- Notes: ${row.reasons.join('; ')}`);
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
    const ix = indicators.findIndex((row) => row.id === 'z_pattern_safe_governance');
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
  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  const samplesDoc = JSON.parse(await readFile(samplesPath, 'utf8'));

  const rv = validateRegistry(registry);
  const registryChecks = {
    passed: rv.passed,
    advisory: rv.advisory,
    red: [...rv.red]
  };

  const includeRedFixture = process.env.Z_PATTERN_SAFE_INCLUDE_RED_FIXTURE === '1';
  let samples = toArray(samplesDoc.samples);
  if (includeRedFixture) samples = [...samples, ...toArray(samplesDoc.fixture_samples_red)];

  /** @type {Array<{sample_id: string, domain: string, signal: string, reasons: string[]}>} */
  const sampleResults = [];

  for (const s of samples) {
    const sid = s.sample_id ?? '(missing sample_id)';
    if (!s.domain) {
      sampleResults.push({ sample_id: sid, domain: s.domain, signal: 'RED', reasons: ['missing domain'] });
      continue;
    }

    let out = classifySample(s, rv.allowed, rv.gated);
    const gambleMoneyViolation = enforceGamblingMoneyNotGreen(s, out);
    if (gambleMoneyViolation) {
      registryChecks.red.push(gambleMoneyViolation);
      out = { signal: 'RED', reasons: [...out.reasons, 'governance posture violation: gamble/money domain was GREEN'] };
    }

    sampleResults.push({
      sample_id: sid,
      domain: s.domain,
      signal: out.signal,
      reasons: out.reasons
    });
  }

  const signal = overallSignal(registryChecks.red, sampleResults.map((x) => ({ signal: x.signal })));
  const summary = {
    green: sampleResults.filter((x) => x.signal === 'GREEN').length,
    yellow: sampleResults.filter((x) => x.signal === 'YELLOW').length,
    blue: sampleResults.filter((x) => x.signal === 'BLUE').length,
    red: sampleResults.filter((x) => x.signal === 'RED').length
  };

  const report = {
    schema: 'z.pattern.safe.report.v1',
    module_id: 'z_pattern_safe_governance',
    signal,
    registry_mode: registry.mode ?? 'unknown',
    generated_at: new Date().toISOString(),
    fixtures_included: includeRedFixture,
    registry_checks: registryChecks,
    sample_results: sampleResults,
    summary,
    locked_law: [
      'Pattern ≠ prediction certainty.',
      'Simulation ≠ betting advice.',
      'Confidence score ≠ guarantee.',
      'Bankroll math ≠ financial advice.',
      'Game pattern ≠ casino edge.',
      'GREEN ≠ deploy.',
      'BLUE requires AMK.',
      'RED blocks movement.',
      'AMK-Goku owns sacred moves.'
    ]
  };

  await mkdir(dirname(reportJsonPath), { recursive: true });
  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(reportMdPath, mdReport(report), 'utf8');
  await syncIndicator(signal);

  console.log(`Z-Pattern Safe signal: ${signal}`);
  process.exit(signal === 'RED' ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
