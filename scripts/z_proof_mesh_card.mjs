import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'data', 'reports');
const POLICY_PATH = path.join(ROOT, 'config', 'z_proof_mesh_policy.json');
const OUT_JSON = path.join(REPORTS, 'z_proof_mesh_card.json');
const OUT_MD = path.join(REPORTS, 'z_proof_mesh_card.md');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function fileExists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

function hoursSince(ts) {
  if (!ts) return null;
  const t = Date.parse(ts);
  if (Number.isNaN(t)) return null;
  return Number(((Date.now() - t) / 3600000).toFixed(2));
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function scorePart(pass, weight) {
  return pass ? weight : 0;
}

function run() {
  const generatedAt = new Date().toISOString();
  const policy = readJson(POLICY_PATH, { rules: {}, weights: {} });
  const rules = policy.rules || {};
  const weights = policy.weights || {};

  const hygiene = readJson(path.join(REPORTS, 'z_hygiene_status.json'), {});
  const pending = readJson(path.join(REPORTS, 'z_pending_audit.json'), {});
  const moduleAudit = readJson(path.join(REPORTS, 'z_module_registry_audit.json'), {});
  const priorityAudit = readJson(path.join(REPORTS, 'z_priority_audit.json'), {});
  const readiness = readJson(path.join(REPORTS, 'z_octave_readiness.json'), {});
  const privacy = readJson(path.join(REPORTS, 'privacy', 'z_privacy_report.json'), {});
  const protection = readJson(path.join(REPORTS, 'z_protection_audit.json'), {});
  const research = readJson(path.join(REPORTS, 'z_research_intake.json'), {});

  const privacyAgeH = hoursSince(privacy.generated_at);
  const trustPackSigned = fileExists('exports/trust_pack_2026-01/verification/hashes.sha256');
  const healthCertSigned = fileExists('exports/trust_pack_2026-01/verification/health_certificate.sha256');

  const checks = [
    {
      id: 'hygiene_green',
      pass: String(hygiene.status || '').toLowerCase() === 'green',
      note: `status=${hygiene.status || 'unknown'}`,
    },
    {
      id: 'protection_audit_ok',
      pass: Number(protection.protected_count || 0) >= Number(protection.checked_count || 0),
      note: `protected=${protection.protected_count || 0}/${protection.checked_count || 0}`,
    },
    {
      id: 'privacy_report_recent',
      pass:
        typeof privacyAgeH === 'number' &&
        privacyAgeH <= Number(rules.require_privacy_report_recent_hours || 24),
      note: `age_h=${privacyAgeH ?? 'unknown'}`,
    },
    {
      id: 'pending_audit_limit',
      pass: Number(pending.total || 0) <= Number(rules.max_pending_audit || 0),
      note: `pending=${pending.total || 0}`,
    },
    {
      id: 'module_coverage_floor',
      pass: Number(moduleAudit.coverage_percent || 0) >= Number(rules.min_module_coverage_pct || 0),
      note: `coverage=${moduleAudit.coverage_percent ?? 0}%`,
    },
    {
      id: 'priority_open_limit',
      pass: Number(priorityAudit.open || 0) <= Number(rules.max_priority_open || 999999),
      note: `open=${priorityAudit.open ?? 0}`,
    },
    {
      id: 'readiness_tracking_present',
      pass: Array.isArray(readiness.gates) && readiness.gates.length > 0,
      note: `gates=${Array.isArray(readiness.gates) ? readiness.gates.length : 0}`,
    },
    {
      id: 'signature_hashes_present',
      pass: trustPackSigned && healthCertSigned,
      note: `trust_hash=${trustPackSigned ? 'yes' : 'no'}, health_hash=${healthCertSigned ? 'yes' : 'no'}`,
    },
    {
      id: 'research_intake_present',
      pass: Boolean(research.generated_at),
      note: `captured=${research.captured_count ?? 'n/a'}`,
    },
  ];

  const totalWeight =
    Number(weights.hygiene || 0) +
    Number(weights.protection || 0) +
    Number(weights.privacy_freshness || 0) +
    Number(weights.module_coverage || 0) +
    Number(weights.priority_backlog || 0) +
    Number(weights.readiness_tracking || 0);

  const weightedScore =
    scorePart(checks[0].pass, Number(weights.hygiene || 0)) +
    scorePart(checks[1].pass, Number(weights.protection || 0)) +
    scorePart(checks[2].pass, Number(weights.privacy_freshness || 0)) +
    scorePart(checks[4].pass, Number(weights.module_coverage || 0)) +
    scorePart(checks[5].pass, Number(weights.priority_backlog || 0)) +
    scorePart(checks[6].pass, Number(weights.readiness_tracking || 0));

  const scorePct = totalWeight > 0 ? Number(((weightedScore / totalWeight) * 100).toFixed(1)) : 0;
  const score = clamp(scorePct, 0, 100);

  const passCount = checks.filter((c) => c.pass).length;
  const status = score >= 85 ? 'green' : score >= 65 ? 'hold' : 'red';

  const card = {
    generated_at: generatedAt,
    status,
    score_pct: score,
    pass_count: passCount,
    total_checks: checks.length,
    policy_version: policy.version || '1.0.0',
    signatures: {
      trust_pack_hashes_sha256: trustPackSigned,
      health_certificate_sha256: healthCertSigned,
    },
    metrics: {
      hygiene_status: hygiene.status || 'unknown',
      pending_total: Number(pending.total || 0),
      module_coverage_pct: Number(moduleAudit.coverage_percent || 0),
      priority_open: Number(priorityAudit.open || 0),
      readiness_gates_total: Array.isArray(readiness.gates) ? readiness.gates.length : 0,
      privacy_report_age_hours: privacyAgeH,
      research_captured_count: Number(research.captured_count || 0),
    },
    checks,
    note:
      status === 'green'
        ? 'Proof posture is healthy.'
        : 'Proof posture requires review before external escalation.',
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(card, null, 2));

  const md = [
    '# Z-Proof Mesh Card',
    '',
    `Generated: ${generatedAt}`,
    `Status: ${status.toUpperCase()}`,
    `Score: ${score}%`,
    '',
    '## Checks',
    ...checks.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.id}: ${c.note}`),
    '',
    '## Metrics',
    `- hygiene_status: ${card.metrics.hygiene_status}`,
    `- pending_total: ${card.metrics.pending_total}`,
    `- module_coverage_pct: ${card.metrics.module_coverage_pct}`,
    `- priority_open: ${card.metrics.priority_open}`,
    `- readiness_gates_total: ${card.metrics.readiness_gates_total}`,
    `- privacy_report_age_hours: ${card.metrics.privacy_report_age_hours ?? 'unknown'}`,
    `- research_captured_count: ${card.metrics.research_captured_count}`,
    '',
    `Note: ${card.note}`,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'));

  console.log(`Z-Proof Mesh card written: ${OUT_JSON}`);
}

run();
