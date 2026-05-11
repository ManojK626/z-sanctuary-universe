#!/usr/bin/env node
/**
 * Z-XBUS-GATE-1 — read-only external connector registry + policy validator.
 * No live calls, webhooks, secrets, payment, provider execution.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const REG = path.join(ROOT, 'data', 'z_xbus_connector_registry.json');
const POL = path.join(ROOT, 'data', 'z_xbus_connector_policy.json');
const SAMPLES = path.join(ROOT, 'data', 'examples', 'z_xbus_connector_samples.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_xbus_connector_gate_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_xbus_connector_gate_report.md');

const RANK = { RED: 4, BLUE: 3, YELLOW: 2, GREEN: 1 };

function maxSignal(a, b) {
  return RANK[b] > RANK[a] ? b : a;
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function forbiddenLiveFromFlags(flags) {
  if (!flags || typeof flags !== 'object') return false;
  return Boolean(
    flags.live_external_connection ||
      flags.payment_activation ||
      flags.provider_calls_live ||
      flags.webhook_execution_enabled ||
      flags.customer_data_flow ||
      flags.stores_secrets_in_registry ||
      flags.production_deploy_connector ||
      flags.external_write_actions_enabled,
  );
}

/** Classify a connector-like object (flags + hints) for sample rows. */
function classifySample(s) {
  const flags = s.flags || {};
  if (forbiddenLiveFromFlags(flags)) return 'RED';
  if (flags.requires_amk_for_future_activation || flags.minor_facing_future_connector) return 'BLUE';
  return 'GREEN';
}

function registryEntrySignal(entry) {
  const flags = entry.flags || {};
  if (forbiddenLiveFromFlags(flags)) return 'RED';
  const cls = String(entry.xbus_classification || '');
  if (cls === 'BLUE_AMK_DECISION_REQUIRED' || cls === 'FUTURE_CHARTER_REQUIRED') return 'BLUE';
  if (cls === 'RED_BLOCKED') return 'RED';
  if (entry.metadata_complete === false) return 'YELLOW';
  return 'GREEN';
}

function validatePolicy(policy, issues) {
  const requiredTrue = [
    'no_live_connector_in_phase_1',
    'no_secret_storage',
    'no_customer_data_flow',
    'no_payment_activation',
    'no_provider_calls',
    'no_webhook_execution',
    'no_external_write_actions',
    'mock_only_allowed',
  ];
  for (const k of requiredTrue) {
    if (policy[k] !== true) {
      issues.push({ signal: 'RED', code: 'policy_phase1_breach', message: `policy.${k} must be true for Phase 1` });
    }
  }
}

function main() {
  const generatedAt = new Date().toISOString();
  const issues = [];
  let registry;
  let policy;
  let samplesDoc;

  try {
    registry = readJson(REG);
  } catch (e) {
    issues.push({ signal: 'RED', code: 'registry_parse', message: String(e.message) });
  }
  try {
    policy = readJson(POL);
  } catch (e) {
    issues.push({ signal: 'RED', code: 'policy_parse', message: String(e.message) });
  }
  try {
    samplesDoc = readJson(SAMPLES);
  } catch (e) {
    issues.push({ signal: 'RED', code: 'samples_parse', message: String(e.message) });
  }

  let registryOverall = 'GREEN';
  const entryResults = [];

  if (registry && policy) validatePolicy(policy, issues);

  if (registry && Array.isArray(registry.connector_entries)) {
    for (const entry of registry.connector_entries) {
      const sig = registryEntrySignal(entry);
      registryOverall = maxSignal(registryOverall, sig);
      entryResults.push({
        id: entry.id,
        overall_signal: sig,
        classification: entry.xbus_classification ?? null,
        forbidden_live_flags: forbiddenLiveFromFlags(entry.flags),
      });
      if (forbiddenLiveFromFlags(entry.flags)) {
        issues.push({
          signal: 'RED',
          code: 'registry_forbidden_live',
          message: `connector ${entry.id}: Phase 1 forbids live external/payment/provider/webhook/customer-data/secret/deploy flags`,
        });
      }
    }
  } else if (registry) {
    issues.push({ signal: 'RED', code: 'registry_shape', message: 'connector_entries must be an array' });
    registryOverall = 'RED';
  }

  const sampleResults = [];
  let fixtureMismatch = false;
  const samples = samplesDoc && Array.isArray(samplesDoc.samples) ? samplesDoc.samples : [];
  if (!samples.length && samplesDoc) {
    issues.push({
      signal: 'YELLOW',
      code: 'samples_empty',
      message: 'No samples array or empty — classifier smoke weak',
    });
    registryOverall = maxSignal(registryOverall, 'YELLOW');
  }

  for (const s of samples) {
    const computed = classifySample(s);
    const expected = String(s.expected_signal || '').toUpperCase();
    const ok = computed === expected;
    if (!ok) fixtureMismatch = true;
    sampleResults.push({
      id: s.id,
      computed_signal: computed,
      expected_signal: expected,
      match: ok,
    });
    if (!ok) {
      issues.push({
        signal: 'RED',
        code: 'fixture_class_mismatch',
        message: `sample ${s.id}: expected ${expected}, computed ${computed}`,
      });
    }
  }

  let overall = registryOverall;
  if (fixtureMismatch) overall = 'RED';
  for (const i of issues) {
    if (i.signal) overall = maxSignal(overall, i.signal);
  }

  const blueDecisions = [
    ...(registry?.connector_entries || [])
      .filter((e) => ['BLUE_AMK_DECISION_REQUIRED', 'FUTURE_CHARTER_REQUIRED'].includes(String(e.xbus_classification)))
      .map((e) => ({ id: e.id, classification: e.xbus_classification })),
  ];

  const redBlocks = sampleResults.filter((r) => r.computed_signal === 'RED');

  const payload = {
    schema: 'z_xbus_connector_gate_report_v1',
    generated_at: generatedAt,
    overall_signal: overall,
    registry_overall_signal: registryOverall,
    phase: 'Z-XBUS-GATE-1',
    policy_phase1: policy
      ? {
          no_live_connector_in_phase_1: policy.no_live_connector_in_phase_1,
          no_secret_storage: policy.no_secret_storage,
          no_customer_data_flow: policy.no_customer_data_flow,
        }
      : null,
    registry_entry_results: entryResults,
    registry_entry_count: entryResults.length,
    sample_results: sampleResults,
    sample_count: sampleResults.length,
    fixtures_all_match_expected: !fixtureMismatch,
    blue_registry_decisions: blueDecisions,
    sample_red_classifications_fixture: redBlocks.map((r) => r.id),
    issues,
    locked_law: [
      'Connector registry ≠ live connector.',
      'API plan ≠ API call.',
      'MVP route ≠ production service.',
      'Mock data ≠ customer data.',
      'Provider idea ≠ provider permission.',
      'Payment idea ≠ billing activation.',
      'GREEN ≠ deploy.',
      'BLUE requires AMK.',
      'RED blocks movement.',
      'AMK-Goku owns sacred moves.',
    ],
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-XBUS-GATE-1 report',
    '',
    `- Generated: ${generatedAt}`,
    `- Overall signal: **${overall}**`,
    `- Registry overall: **${registryOverall}**`,
    `- Fixtures match expected: **${!fixtureMismatch}**`,
    `- Phase: **Z-XBUS-GATE-1** (read-only governance)`,
    '',
    '## Registry entries',
    '',
    ...(entryResults.length
      ? entryResults.map((e) => `- **${e.id}** — ${e.overall_signal} (${e.classification || 'n/a'})`)
      : ['- (none)']),
    '',
    '## Sample classifications',
    '',
    ...(sampleResults.length
      ? sampleResults.map(
          (r) => `- **${r.id}** — computed ${r.computed_signal}, expected ${r.expected_signal} ${r.match ? 'OK' : 'FAIL'}`,
        )
      : ['- (none)']),
    '',
    '## BLUE registry decisions (metadata)',
    '',
    ...(blueDecisions.length ? blueDecisions.map((b) => `- ${b.id} — ${b.classification}`) : ['- (none)']),
    '',
    '## Issues',
    '',
    ...(issues.length ? issues.map((i) => `- [${i.signal}] **${i.code}**: ${i.message}`) : ['- (none)']),
    '',
    '## Locked law',
    '',
    ...payload.locked_law.map((line) => `- ${line}`),
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(JSON.stringify({ ok: overall !== 'RED', overall_signal: overall, out_json: OUT_JSON, out_md: OUT_MD }, null, 2));
  process.exit(overall === 'RED' ? 1 : 0);
}

main();
