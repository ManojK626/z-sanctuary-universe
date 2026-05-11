import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const ledgerPath = resolve('data', 'z_mu_claim_ledger.json');
const policyPath = resolve('data', 'z_mu_source_policy.json');
const samplesPath = resolve('data', 'examples', 'z_mu_claim_samples.json');
const reportJsonPath = resolve('data', 'reports', 'z_mu_truth_report.json');
const reportMdPath = resolve('data', 'reports', 'z_mu_truth_report.md');
const indicatorPath = resolve('dashboard', 'data', 'amk_project_indicators.json');

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizePolicy(policy) {
  const phrases = toArray(policy.forbidden_escalation_phrases).map((p) => String(p).toLowerCase());
  const required = toArray(policy.required_claim_fields).map(String);
  return { phrases, required };
}

function blob(claim) {
  return `${claim.claim_summary ?? ''} ${claim.public_wording ?? ''} ${claim.internal_notes ?? ''}`.toLowerCase();
}

function matchesForbiddenPhrase(text, phrases) {
  const hits = phrases.filter((p) => p && text.includes(p));
  return hits;
}

function missingFields(claim, required) {
  return required.filter((k) => claim[k] === undefined || claim[k] === null || String(claim[k]).trim() === '');
}

/** @returns {{signal: string, reasons: string[]}} */
function classifyClaim(claim, phrases, required, policyPeacefulCats) {
  const reasons = [];

  const miss = missingFields(claim, required);
  if (miss.length) return { signal: 'RED', reasons: [`missing required fields: ${miss.join(', ')}`] };

  const b = blob(claim);
  const hits = matchesForbiddenPhrase(b, phrases);
  if (hits.length) return { signal: 'RED', reasons: [`forbidden escalation phrase(s): ${hits.join('; ')}`] };

  if (String(claim.source_status || '') === 'blocked_escalatory_content')
    return { signal: 'RED', reasons: ['source_status blocked_escalatory_content'] };

  if (String(claim.safety_class || '') === 'blocked_escalation')
    return { signal: 'RED', reasons: ['safety_class blocked_escalation'] };

  const traitAccusFact = claim.flags?.serious_named_accusation_without_verified_public_fact === true;
  if (traitAccusFact) return { signal: 'RED', reasons: ['serious named accusation stated as fact without verified public evidence'] };

  const flags = claim.flags || {};
  if (flags.serious_named_accusation_requires_review === true) {
    return { signal: 'BLUE', reasons: ['human/legal/ethics gate before any distribution'] };
  }

  const cat = String(claim.category || '');
  if (!policyPeacefulCats.has(cat)) reasons.push(`category '${cat}' not in peaceful_categories allowlist — review`);

  if (reasons.some((x) => x.includes('allowlist'))) return { signal: 'YELLOW', reasons };

  if (String(claim.source_status || '') === 'legal_or_ethics_human_review_required')
    return { signal: 'BLUE', reasons: ['legal or ethics human review required'] };

  if (String(claim.source_status || '') === 'needs_verification')
    return { signal: 'YELLOW', reasons: ['evidence gap — needs official or Rank A–C anchor'] };

  if (String(claim.source_status || '') === 'verified_official_neutral_language')
    return { signal: 'GREEN', reasons: ['official-neutral posture and peaceful wording'] };

  return { signal: 'YELLOW', reasons: ['source_status not mapped — treat as evidence gap'] };
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
    '# Z-MU Truth Engine Report',
    '',
    `- Signal: **${report.signal}**`,
    `- Mode: ${report.ledger_mode}`,
    `- Timestamp: ${report.generated_at}`,
    '',
    '## Policy / ledger checks',
    ''
  ];
  for (const x of report.registry_checks.passed) lines.push(`- PASS: ${x}`);
  for (const x of report.registry_checks.advisory) lines.push(`- ADVISORY: ${x}`);
  for (const x of report.registry_checks.red) lines.push(`- RED: ${x}`);
  lines.push('', '## Claim classifications', '');
  for (const row of report.claim_results) {
    lines.push(`### ${row.claim_id}`, '');
    lines.push(`- Signal: **${row.signal}**`);
    lines.push(`- Category: ${row.category}`);
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
    const ix = indicators.findIndex((row) => row.id === 'z_mu_truth_civic_engine');
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
  const ledger = JSON.parse(await readFile(ledgerPath, 'utf8'));
  const policy = JSON.parse(await readFile(policyPath, 'utf8'));
  const samplesDoc = JSON.parse(await readFile(samplesPath, 'utf8'));

  const includeRedFixture = process.env.Z_MU_TRUTH_INCLUDE_RED_FIXTURE === '1';
  let claims = [...toArray(ledger.claims), ...toArray(samplesDoc.claims)];
  if (includeRedFixture) claims = [...claims, ...toArray(samplesDoc.fixture_claims_red_only)];

  const { phrases, required } = normalizePolicy(policy);
  const peacefulCats = new Set(toArray(policy.peaceful_categories).map(String));

  const regChecks = { passed: [], advisory: [], red: [] };

  if (ledger.mode === 'civic_claim_ledger_metadata_only') regChecks.passed.push('ledger mode is civic_claim_ledger_metadata_only.');
  else regChecks.red.push('ledger mode must be civic_claim_ledger_metadata_only.');

  if (ledger.no_external_runtime === true) regChecks.passed.push('no_external_runtime is true.');
  else regChecks.red.push('no_external_runtime must be true for Phase 1.');

  if (required.length >= 4) regChecks.passed.push('source policy lists required claim fields.');
  else regChecks.red.push('required_claim_fields missing or too small.');

  if (phrases.length >= 3) regChecks.passed.push('forbidden_escalation_phrases present.');
  else regChecks.advisory.push('forbidden_escalation_phrases unusually short — expand with AMK review.');

  const claimResults = [];
  for (const c of claims) {
    const out = classifyClaim(c, phrases, required, peacefulCats);
    claimResults.push({
      claim_id: c.claim_id,
      category: c.category,
      source_status: c.source_status,
      signal: out.signal,
      reasons: out.reasons
    });
  }

  const signal = overallSignal(regChecks.red, claimResults);
  const summary = {
    green: claimResults.filter((x) => x.signal === 'GREEN').length,
    yellow: claimResults.filter((x) => x.signal === 'YELLOW').length,
    blue: claimResults.filter((x) => x.signal === 'BLUE').length,
    red: claimResults.filter((x) => x.signal === 'RED').length
  };

  const report = {
    schema: 'z.mu.truth.report.v1',
    module_id: 'z_mu_truth_civic_engine',
    signal,
    ledger_mode: ledger.mode ?? 'unknown',
    phase: ledger.phase ?? 'Z-MU-TRUTH-1',
    generated_at: new Date().toISOString(),
    fixtures_included: includeRedFixture,
    registry_checks: regChecks,
    claim_results: claimResults,
    summary,
    locked_law: [
      'Civic truth is not incitement.',
      'Awareness is not harassment.',
      'Evidence is not rumor.',
      'Policy simulation is not prediction.',
      'Complaint pathway notes are not legal advice.',
      'GREEN is not campaign launch.',
      'BLUE requires AMK / legal / human review.',
      'RED blocks movement.',
      'AMK-Goku owns sacred moves.'
    ]
  };

  await mkdir(dirname(reportJsonPath), { recursive: true });
  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(reportMdPath, mdReport(report), 'utf8');
  await syncIndicator(signal);

  console.log(`Z-MU Truth Engine signal: ${signal}`);
  process.exit(signal === 'RED' ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
