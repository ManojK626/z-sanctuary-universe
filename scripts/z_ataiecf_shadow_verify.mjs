#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_ataiecf_shadow_verify.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_ataiecf_shadow_verify.md');
const QA_RP_REGISTRY = path.join(ROOT, 'data', 'z_qa_rp_registry.json');
const FRESH_MINUTES = 240;

function nowIso() {
  return new Date().toISOString();
}

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function exists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function minutesSince(iso) {
  const t = Date.parse(String(iso || ''));
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / 60000);
}

function statusFromFreshness(ageMin) {
  if (ageMin === null) return 'watch';
  if (ageMin <= FRESH_MINUTES) return 'ok';
  if (ageMin <= FRESH_MINUTES * 2) return 'watch';
  return 'attention';
}

function summarizeFeed(id, relPath, generatedAt, statusHint = 'unknown') {
  const abs = path.join(ROOT, relPath);
  const present = exists(abs);
  const ageMin = minutesSince(generatedAt);
  const freshness = statusFromFreshness(ageMin);
  const status =
    !present ? 'attention' : freshness === 'attention' ? 'attention' : freshness === 'watch' ? 'watch' : statusHint;
  return {
    id,
    path: relPath,
    present,
    generated_at: generatedAt || null,
    age_minutes: ageMin,
    freshness,
    status,
  };
}

function paritySignal(currentObj, prevObj, keys) {
  if (!currentObj || !prevObj) {
    return { available: false, changed_keys: [], confidence: 'low' };
  }
  const changed = [];
  for (const key of keys) {
    if (JSON.stringify(currentObj?.[key]) !== JSON.stringify(prevObj?.[key])) changed.push(key);
  }
  return {
    available: true,
    changed_keys: changed,
    confidence: changed.length === 0 ? 'high' : changed.length <= 2 ? 'medium' : 'low',
  };
}

function buildDrpGateChecks(context) {
  const checks = {
    no_harm: context.enforcerAction !== 'BLOCK',
    protect_innocent: context.securitySentinelPresent,
    lift_others: context.qaRpPresent,
    disclosure: context.commsManifestPresent && context.commflowPresent,
    responsibility: context.enforcerPresent,
    protection_data_vault: context.securitySentinelPresent,
    consent_first: context.qaRpPresent,
    truth_in_verification: context.commflowPresent && context.aiStatusPresent,
    audibility: context.commflowPresent && context.shadowParityAvailable,
    accessibility_calm_ux: context.guardianPresent,
    fairness_value_flows: context.releaseGatePresent,
    sovereignty_policy: context.enforcerPresent && context.commsManifestPresent,
    registry_truth: context.ideGuardPresent,
    pause_threshold_z_ui: context.enforcerAction !== 'ALLOW_PROGRESS',
  };

  return Object.entries(checks).map(([gate_id, pass]) => ({
    gate_id,
    pass: Boolean(pass),
    status: pass ? 'ok' : 'watch',
  }));
}

function buildPayload() {
  const qaRp = readJson(QA_RP_REGISTRY, {});
  const commflow = readJson(path.join(REPORTS_DIR, 'z_ecosystem_commflow_verifier.json'), {});
  const enforcer = readJson(path.join(REPORTS_DIR, 'z_execution_enforcer.json'), {});
  const aiStatus = readJson(path.join(REPORTS_DIR, 'z_ai_status.json'), {});
  const guardian = readJson(path.join(REPORTS_DIR, 'z_guardian_report.json'), {});
  const ideGuard = readJson(path.join(REPORTS_DIR, 'z_ide_commflow_guard.json'), {});
  const releaseGate = readJson(path.join(REPORTS_DIR, 'z_release_gate_summary.json'), {});
  const secSentinel = readJson(path.join(REPORTS_DIR, 'z_security_sentinel.json'), {});
  const ghManifest = readJson(path.join(REPORTS_DIR, 'z_github_ai_comms_manifest.json'), {});
  const cfManifest = readJson(path.join(REPORTS_DIR, 'z_cloudflare_ai_comms_manifest.json'), {});
  const ledgerCurrent = readJson(path.join(REPORTS_DIR, 'z_ai_ecosphere_ledger.json'), {});
  const ledgerPrev = readJson(path.join(REPORTS_DIR, 'z_ai_ecosphere_ledger.prev.json'), null);

  const feeds = [
    summarizeFeed('commflow', 'data/reports/z_ecosystem_commflow_verifier.json', commflow?.generated_at, commflow?.overall_status || 'watch'),
    summarizeFeed('execution_enforcer', 'data/reports/z_execution_enforcer.json', enforcer?.generated_at, enforcer?.action === 'BLOCK' ? 'attention' : 'ok'),
    summarizeFeed('ai_status', 'data/reports/z_ai_status.json', aiStatus?.generated_at, aiStatus?.status || 'watch'),
    summarizeFeed('guardian', 'data/reports/z_guardian_report.json', guardian?.generated_at, 'ok'),
    summarizeFeed('ide_commflow_guard', 'data/reports/z_ide_commflow_guard.json', ideGuard?.generated_at, ideGuard?.status || 'watch'),
    summarizeFeed('github_ai_comms_manifest', 'data/reports/z_github_ai_comms_manifest.json', ghManifest?.generated_at, ghManifest?.ok ? 'ok' : 'attention'),
    summarizeFeed('cloudflare_ai_comms_manifest', 'data/reports/z_cloudflare_ai_comms_manifest.json', cfManifest?.generated_at, cfManifest?.ok ? 'ok' : 'attention'),
    summarizeFeed('release_gate_summary', 'data/reports/z_release_gate_summary.json', releaseGate?.generated_at, String(releaseGate?.verdict || '').toLowerCase() || 'watch'),
    summarizeFeed('security_sentinel', 'data/reports/z_security_sentinel.json', secSentinel?.generated_at, secSentinel?.status || 'watch'),
  ];

  const parity = paritySignal(ledgerCurrent, ledgerPrev, ['overall', 'rings']);
  const context = {
    enforcerAction: String(enforcer?.action || 'UNKNOWN').toUpperCase(),
    commflowPresent: Boolean(commflow?.generated_at),
    enforcerPresent: Boolean(enforcer?.generated_at),
    aiStatusPresent: Boolean(aiStatus?.generated_at),
    guardianPresent: Boolean(guardian?.generated_at),
    ideGuardPresent: Boolean(ideGuard?.generated_at),
    releaseGatePresent: Boolean(releaseGate?.generated_at),
    securitySentinelPresent: Boolean(secSentinel?.generated_at),
    commsManifestPresent: Boolean(ghManifest?.generated_at && cfManifest?.generated_at),
    qaRpPresent: Array.isArray(qaRp?.drp?.gate_ids) && qaRp.drp.gate_ids.length === 14,
    shadowParityAvailable: parity.available,
  };
  const drpChecks = buildDrpGateChecks(context);
  const failingCritical = drpChecks.filter((x) => !x.pass && ['no_harm', 'protect_innocent', 'protection_data_vault', 'consent_first', 'sovereignty_policy'].includes(x.gate_id));

  const watchCount = feeds.filter((f) => f.status === 'watch').length + drpChecks.filter((x) => x.status === 'watch').length;
  const attentionCount = feeds.filter((f) => f.status === 'attention').length;
  const status = failingCritical.length > 0 ? 'attention' : attentionCount > 0 ? 'attention' : watchCount > 0 ? 'watch' : 'ok';

  return {
    generated_at: nowIso(),
    system: 'Z-ATAIECF',
    mode: 'advisory_shadow_copy',
    governance_note: 'Read-only verifier. No autonomous mutation. Human approval required for operational changes.',
    summary: {
      status,
      feed_total: feeds.length,
      feed_attention: attentionCount,
      feed_watch: feeds.filter((f) => f.status === 'watch').length,
      drp_gates_total: drpChecks.length,
      drp_pass: drpChecks.filter((x) => x.pass).length,
      drp_watch: drpChecks.filter((x) => x.status === 'watch').length,
    },
    feeds,
    shadow_copy: {
      source: 'data/reports/z_ai_ecosphere_ledger.prev.json',
      parity,
      recommendation:
        parity.available && parity.changed_keys.length > 2
          ? 'Large shadow delta detected. Run focused criticism/review before release.'
          : 'Shadow parity stable for tracked keys.',
    },
    drp_alignment: {
      expected_gates: Array.isArray(qaRp?.drp?.gate_ids) ? qaRp.drp.gate_ids.length : 0,
      checks: drpChecks,
    },
    criticism_lane: {
      enabled: true,
      source_registry: 'data/z_qa_rp_registry.json',
      note: 'Use Q&A&RP templates to challenge recommendations before applying changes.',
      templates: Array.isArray(qaRp?.self_inquiry_templates) ? qaRp.self_inquiry_templates.slice(0, 4) : [],
    },
  };
}

function toMarkdown(payload) {
  const lines = [
    '# Z-ATAIECF Shadow Verify',
    '',
    `Generated: ${payload.generated_at}`,
    `Status: **${String(payload.summary.status).toUpperCase()}**`,
    `Mode: ${payload.mode}`,
    '',
    '## Summary',
    `- Feeds: ${payload.summary.feed_total} (attention ${payload.summary.feed_attention}, watch ${payload.summary.feed_watch})`,
    `- DRP: ${payload.summary.drp_pass}/${payload.summary.drp_gates_total} pass`,
    '',
    '## Feed Health',
    ...payload.feeds.map(
      (f) =>
        `- ${f.id}: ${String(f.status).toUpperCase()} | present=${f.present ? 'yes' : 'no'} | age=${f.age_minutes === null ? '--' : `${f.age_minutes}m`} | ${f.path}`
    ),
    '',
    '## Shadow Copy Parity',
    `- Available: ${payload.shadow_copy.parity.available ? 'yes' : 'no'}`,
    `- Changed keys: ${
      payload.shadow_copy.parity.changed_keys.length ? payload.shadow_copy.parity.changed_keys.join(', ') : 'none'
    }`,
    `- Recommendation: ${payload.shadow_copy.recommendation}`,
    '',
    '## DRP Gate Alignment',
    ...payload.drp_alignment.checks.map((c) => `- ${c.gate_id}: ${c.pass ? 'PASS' : 'WATCH'}`),
    '',
    '## Criticism Lane',
    ...payload.criticism_lane.templates.map((t) => `- ${t}`),
    '',
  ];
  return `${lines.join('\n')}\n`;
}

function main() {
  const payload = buildPayload();
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, toMarkdown(payload), 'utf8');
  console.log(`Z-ATAIECF shadow verify: ${OUT_JSON} status=${payload.summary.status}`);
}

main();
