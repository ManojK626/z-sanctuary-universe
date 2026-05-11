#!/usr/bin/env node
/**
 * Formula Sync 1.0 (advisory, read-only)
 * Verifies Z-Mega/formula posture, vault spine integrity, and base architecture health.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const REPORTS = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS, 'z_formula_sync_check.json');
const OUT_MD = path.join(REPORTS, 'z_formula_sync_check.md');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function checkStatus(ok, label, detail, source) {
  return { ok: Boolean(ok), label, detail, source };
}

function main() {
  const guardian = readJson(path.join(REPORTS, 'z_guardian_report.json'), null);
  const vault = readJson(path.join(REPORTS, 'z_vault_spine_manifest.json'), null);
  const systemStatus = readJson(path.join(ROOT, 'data', 'system-status.json'), null);
  const comms = readJson(path.join(REPORTS, 'z_communication_health.json'), null);
  const ecosphere = readJson(path.join(REPORTS, 'z_ai_ecosphere_ledger.json'), null);
  const sswsRing = Array.isArray(ecosphere?.rings)
    ? ecosphere.rings.find((r) => String(r?.id || '') === 'z_ssws')
    : null;
  const ecosphereOverallSync = Number(ecosphere?.overall?.sync_score ?? 0);
  const sswsSync = Number(sswsRing?.sync_score ?? sswsRing?.detail?.sync_score ?? 0);

  const formulaPosture = guardian?.formula_posture ?? null;
  const formulaScores = formulaPosture?.scores ?? {};

  const checks = [
    checkStatus(
      Boolean(formulaPosture),
      'formula_posture_present',
      formulaPosture ? `posture=${formulaPosture.posture}` : 'missing formula_posture in guardian report',
      'data/reports/z_guardian_report.json'
    ),
    checkStatus(
      Number(formulaScores.drp_filter ?? 0) >= 80,
      'drp_filter_strength',
      `drp_filter=${Number(formulaScores.drp_filter ?? 0)}`,
      'data/reports/z_guardian_report.json'
    ),
    checkStatus(
      Number(formulaScores.z_ui_readiness ?? 0) >= 80,
      'z_ui_readiness_strength',
      `z_ui_readiness=${Number(formulaScores.z_ui_readiness ?? 0)}`,
      'data/reports/z_guardian_report.json'
    ),
    checkStatus(
      String(vault?.status || '').toLowerCase() === 'green' && Number(vault?.totals?.broken ?? 1) === 0,
      'vault_spine_integrity',
      `status=${vault?.status ?? 'unknown'}, broken=${Number(vault?.totals?.broken ?? -1)}`,
      'data/reports/z_vault_spine_manifest.json'
    ),
    checkStatus(
      String(systemStatus?.verify || '').toUpperCase() === 'PASS',
      'base_architecture_verify',
      `verify=${systemStatus?.verify ?? 'unknown'}, status=${systemStatus?.status ?? 'unknown'}`,
      'data/system-status.json'
    ),
    checkStatus(
      ['healthy', 'degraded', 'broken'].includes(String(comms?.flow_status || '').toLowerCase()),
      'communication_signal_present',
      `flow_status=${comms?.flow_status ?? 'unknown'}`,
      'data/reports/z_communication_health.json'
    ),
    checkStatus(
      ecosphereOverallSync > 0 || sswsSync > 0,
      'ssws_ecosphere_sync_present',
      `overall.sync_score=${ecosphereOverallSync}, z_ssws.sync_score=${sswsSync}`,
      'data/reports/z_ai_ecosphere_ledger.json'
    ),
  ];

  const passCount = checks.filter((c) => c.ok).length;
  const confidence = passCount >= 6 ? 'high' : passCount >= 4 ? 'medium' : 'low';
  const status = passCount >= 6 ? 'ok' : passCount >= 4 ? 'watch' : 'attention';

  const out = {
    generated_at: new Date().toISOString(),
    summary: {
      checks_total: checks.length,
      checks_pass: passCount,
      status,
      confidence,
    },
    top_guidance:
      status === 'ok'
        ? 'Formula posture, spine integrity, and base architecture are aligned.'
        : 'Refresh failing formula/spine/base checks before relying on higher-level AI consensus.',
    checks,
    governance_note: 'Advisory only — formula sync check does not change authority or execute fixes.',
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(out, null, 2)}\n`, 'utf8');

  const md = [
    '# Z Formula Sync Check',
    '',
    `- Generated: ${out.generated_at}`,
    `- Status: **${status.toUpperCase()}** · confidence **${confidence.toUpperCase()}**`,
    `- Checks pass: **${passCount}/${checks.length}**`,
    '',
    '## Guidance',
    `- ${out.top_guidance}`,
    '',
    '## Checks',
    ...checks.map((c) => `- ${c.ok ? '[x]' : '[ ]'} ${c.label}: ${c.detail}`),
    '',
    out.governance_note,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');
  console.log(`✅ Z Formula Sync: ${OUT_JSON} status=${status} pass=${passCount}/${checks.length}`);
}

main();
