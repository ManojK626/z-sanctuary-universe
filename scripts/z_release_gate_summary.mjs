#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');

function readJson(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, name), 'utf8'));
  } catch {
    return null;
  }
}

function remediationHints(releaseGate, freshness, observer, trust, governanceSnap) {
  const hints = [];
  const blockers = Array.isArray(releaseGate?.blockers) ? releaseGate.blockers : [];

  if (blockers.some((b) => String(b).includes('freshness=hold')) || freshness?.status === 'hold') {
    hints.push('node scripts/z_report_freshness_check.mjs  # refresh freshness artifact');
  }
  if (observer?.status === 'watch' || observer?.status === 'hold') {
    hints.push('npm run monitor:cross-project  # refresh observer status');
  }
  if (Number(releaseGate?.checks?.boundary_violations || 0) > 0) {
    hints.push('npm run verify:boundary-ownership  # fail-fast on boundary drift');
  }
  if ((trust?.trust_score ?? 0) < 80 || trust?.release_gate === 'hold') {
    hints.push('npm run trust:scorecard  # recompute trust score after remediation');
  }
  if (
    !governanceSnap?.manual_release &&
    (governanceSnap?.technical_ready || (trust?.trust_score ?? 0) >= 80)
  ) {
    hints.push('npm run release:governance  # refresh snapshot; set data/z_release_control.json when you intentionally approve release');
  }
  hints.push('npm run release:gate  # final GO/HOLD verdict');

  return [...new Set(hints)].slice(0, 5);
}

const releaseGate = readJson('z_release_gate.json');
const governance = readJson('z_release_governance.json');
const trust = readJson('z_trust_scorecard.json');
const freshness = readJson('z_report_freshness.json');
const observer = readJson('z_cross_project_observer.json');

if (!releaseGate) {
  console.error('Missing data/reports/z_release_gate.json. Run: npm run release:gate');
  process.exit(1);
}

const summary = {
  generated_at: new Date().toISOString(),
  verdict: String(releaseGate.verdict || 'unknown').toUpperCase(),
  release_gate: String(governance?.effective_release_gate || 'unknown').toLowerCase(),
  top_blockers: (releaseGate.blockers || []).slice(0, 3),
  governance: governance
    ? {
        readiness: governance.readiness ?? null,
        p1_open: governance.p1_open ?? null,
        manual_release: governance.manual_release ?? null,
        technical_ready: governance.technical_ready ?? null,
        final_status: governance.final_status ?? null,
        approved_by: governance.approved_by ?? null,
        timestamp: governance.timestamp ?? null
      }
    : null,
  trust: {
    score: trust?.trust_score ?? null,
    grade: trust?.grade ?? null,
    release_gate: trust?.release_gate ?? null,
  },
  fastest_remediation: remediationHints(releaseGate, freshness, observer, trust, governance),
};

const outJson = path.join(REPORTS_DIR, 'z_release_gate_summary.json');
const outMd = path.join(REPORTS_DIR, 'z_release_gate_summary.md');
fs.writeFileSync(outJson, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');

const md = [
  '# Z Release Gate Summary',
  '',
  `Generated: ${summary.generated_at}`,
  `Verdict: **${summary.verdict}**`,
  `Trust: **${summary.trust.score ?? 'n/a'}** (${summary.trust.grade || 'n/a'})`,
  '',
  '## Top 3 Blockers',
  ...(summary.top_blockers.length ? summary.top_blockers.map((b) => `- ${b}`) : ['- none']),
  '',
  '## Fastest Remediation Commands',
  ...summary.fastest_remediation.map((c) => `- \`${c}\``),
  '',
];
fs.writeFileSync(outMd, md.join('\n'), 'utf8');

console.log(`Release gate summary: ${outJson}`);
console.log(`Verdict=${summary.verdict} Trust=${summary.trust.score ?? 'n/a'}(${summary.trust.grade || 'n/a'})`);
if (summary.top_blockers.length) {
  console.log(`Top blockers: ${summary.top_blockers.join(' | ')}`);
}
