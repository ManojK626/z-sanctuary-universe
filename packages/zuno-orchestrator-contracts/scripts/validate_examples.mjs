#!/usr/bin/env node
/**
 * Phase 1C — Validate example JSON fixtures only (local fs). No network, no providers, no execution.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.join(__dirname, '..');
const EXAMPLES_DIR = path.join(PACKAGE_ROOT, 'examples');
const REPO_ROOT = path.join(PACKAGE_ROOT, '..', '..');
const REPORTS_DIR = path.join(REPO_ROOT, 'data', 'reports');

const CAPABILITY_FAMILIES = new Set([
  'text_reasoning',
  'code',
  'image',
  'audio',
  'music',
  'video',
  'pdf_document',
  'research',
  'automation_script',
  'evaluation_verify',
  'accessibility',
  'governance',
]);

const DRP_OVERALL = new Set(['pass', 'pending_human', 'blocked']);
const DRP_DIM = new Set(['ok', 'review', 'blocked']);
const RISK = new Set(['low', 'medium', 'high']);
const VERIFY_LAYER = new Set(['syntactic', 'grounded', 'safe', 'scoped', 'honest']);

const EXPECTED_FILES = [
  'zuno_request.example.json',
  'zuno_task_plan.example.json',
  'provider_adapter_manifest.example.json',
  'drp_decision.example.json',
  'verification_result.example.json',
];

function fail(errors, msg) {
  errors.push(msg);
}

function requireNonExecutable(obj, errors, label) {
  if (obj._non_executable !== true) {
    fail(errors, `${label}: missing or false "_non_executable" (must be true)`);
  }
}

function validateCapability(c, errors, label) {
  if (!c || typeof c !== 'object') {
    fail(errors, `${label}: capability must be object`);
    return;
  }
  if (typeof c.family !== 'string' || !CAPABILITY_FAMILIES.has(c.family)) {
    fail(errors, `${label}: invalid capability.family "${c.family}"`);
  }
  if (c.labels != null && !Array.isArray(c.labels)) {
    fail(errors, `${label}: capability.labels must be array when present`);
  }
}

function validateRequest(o, errors) {
  requireNonExecutable(o, errors, 'zuno_request');
  if (typeof o.id !== 'string' || !o.id) fail(errors, 'zuno_request: id required');
  if (typeof o.intentSummary !== 'string' || !o.intentSummary) fail(errors, 'zuno_request: intentSummary required');
  if (typeof o.projectScope !== 'string' || !o.projectScope) fail(errors, 'zuno_request: projectScope required');
  if (!Array.isArray(o.capabilitiesSought) || o.capabilitiesSought.length === 0) {
    fail(errors, 'zuno_request: capabilitiesSought must be non-empty array');
  } else {
    o.capabilitiesSought.forEach((c, i) => validateCapability(c, errors, `zuno_request.capabilitiesSought[${i}]`));
  }
  if (o.formulaRef != null) {
    const f = o.formulaRef;
    if (typeof f !== 'object' || typeof f.id !== 'string' || !f.id) {
      fail(errors, 'zuno_request: formulaRef.id required when formulaRef present');
    }
  }
}

function validateDrp(o, errors, label) {
  if (typeof o.overall !== 'string' || !DRP_OVERALL.has(o.overall)) {
    fail(errors, `${label}: invalid overall "${o.overall}"`);
  }
  if (o.dimensions != null) {
    if (typeof o.dimensions !== 'object' || Array.isArray(o.dimensions)) {
      fail(errors, `${label}: dimensions must be object`);
    } else {
      for (const [k, v] of Object.entries(o.dimensions)) {
        if (!DRP_DIM.has(v)) fail(errors, `${label}: dimensions.${k} invalid "${v}"`);
      }
    }
  }
  if (o.rationale != null && !Array.isArray(o.rationale)) {
    fail(errors, `${label}: rationale must be array when present`);
  }
}

function validateTaskPlan(o, errors) {
  requireNonExecutable(o, errors, 'zuno_task_plan');
  if (typeof o.planId !== 'string' || !o.planId) fail(errors, 'zuno_task_plan: planId required');
  if (typeof o.requestId !== 'string' || !o.requestId) fail(errors, 'zuno_task_plan: requestId required');
  if (!Array.isArray(o.steps) || o.steps.length === 0) {
    fail(errors, 'zuno_task_plan: steps must be non-empty array');
  } else {
    o.steps.forEach((s, i) => {
      const p = `zuno_task_plan.steps[${i}]`;
      if (!s || typeof s !== 'object') return fail(errors, `${p}: must be object`);
      if (typeof s.stepId !== 'string' || !s.stepId) fail(errors, `${p}: stepId required`);
      if (typeof s.description !== 'string' || !s.description) fail(errors, `${p}: description required`);
      if (typeof s.requiresHumanApproval !== 'boolean') fail(errors, `${p}: requiresHumanApproval must be boolean`);
      validateCapability(s.capability, errors, `${p}.capability`);
    });
  }
  if (o.drpPreview != null) validateDrp(o.drpPreview, errors, 'zuno_task_plan.drpPreview');
}

function validateManifest(o, errors) {
  requireNonExecutable(o, errors, 'provider_manifest');
  if (!Array.isArray(o.adapters)) {
    fail(errors, 'provider_manifest: adapters must be array');
    return;
  }
  if (o.adapters.length === 0) fail(errors, 'provider_manifest: adapters must be non-empty');
  o.adapters.forEach((a, i) => {
    const p = `provider_manifest.adapters[${i}]`;
    if (!a || typeof a !== 'object') return fail(errors, `${p}: must be object`);
    if (typeof a.id !== 'string' || !a.id) fail(errors, `${p}: id required`);
    if (typeof a.name !== 'string' || !a.name) fail(errors, `${p}: name required`);
    if (!Array.isArray(a.capabilities)) fail(errors, `${p}: capabilities must be array`);
    if (typeof a.riskClass !== 'string' || !RISK.has(a.riskClass)) {
      fail(errors, `${p}: invalid riskClass "${a.riskClass}"`);
    }
    if (a.enabled !== false) {
      fail(errors, `${p}: enabled must be false for fixtures`);
    }
  });
}

function validateDrpStandalone(o, errors) {
  requireNonExecutable(o, errors, 'drp_decision');
  validateDrp(o, errors, 'drp_decision');
}

function validateVerification(o, errors) {
  requireNonExecutable(o, errors, 'verification_result');
  if (typeof o.ok !== 'boolean') fail(errors, 'verification_result: ok must be boolean');
  if (typeof o.layer !== 'string' || !VERIFY_LAYER.has(o.layer)) {
    fail(errors, `verification_result: invalid layer "${o.layer}"`);
  }
  if (o.messages != null && !Array.isArray(o.messages)) {
    fail(errors, 'verification_result: messages must be array when present');
  }
}

function validateByFilename(name, obj, errors) {
  if (name === 'zuno_request.example.json') validateRequest(obj, errors);
  else if (name === 'zuno_task_plan.example.json') validateTaskPlan(obj, errors);
  else if (name === 'provider_adapter_manifest.example.json') validateManifest(obj, errors);
  else if (name === 'drp_decision.example.json') validateDrpStandalone(obj, errors);
  else if (name === 'verification_result.example.json') validateVerification(obj, errors);
}

function underscoreFixtureFieldsOk(obj, errors, label) {
  for (const key of Object.keys(obj)) {
    if (key.startsWith('_') && !['_fixture', '_non_executable', '_description'].includes(key)) {
      fail(errors, `${label}: unknown underscore field "${key}" (fixture meta must use _fixture | _non_executable | _description)`);
    }
  }
}

function main() {
  const generatedAt = new Date().toISOString();
  const checks = [];
  const errors = [];

  for (const file of EXPECTED_FILES) {
    const fp = path.join(EXAMPLES_DIR, file);
    if (!fs.existsSync(fp)) {
      errors.push(`Missing file: examples/${file}`);
      checks.push({ file, ok: false, detail: 'file missing' });
      continue;
    }

    let raw;
    try {
      raw = fs.readFileSync(fp, 'utf8');
    } catch (e) {
      errors.push(`Read failed ${file}: ${e.message}`);
      checks.push({ file, ok: false, detail: 'read error' });
      continue;
    }

    let obj;
    try {
      obj = JSON.parse(raw);
    } catch (e) {
      errors.push(`JSON parse failed ${file}: ${e.message}`);
      checks.push({ file, ok: false, detail: 'invalid JSON' });
      continue;
    }

    const fileErrors = [];
    underscoreFixtureFieldsOk(obj, fileErrors, file);
    validateByFilename(file, obj, fileErrors);

    if (fileErrors.length) {
      fileErrors.forEach((m) => errors.push(`${file}: ${m}`));
      checks.push({ file, ok: false, detail: fileErrors.join('; ') });
    } else {
      checks.push({ file, ok: true, detail: 'structure + non-executable guard ok' });
    }
  }

  const ok = errors.length === 0;
  const payload = {
    schema: 'zuno_orchestrator_contract_examples_check_v1',
    generated_at: generatedAt,
    ok,
    package: '@z-sanctuary/zuno-orchestrator-contracts',
    checks,
    errors,
  };

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const jsonPath = path.join(REPORTS_DIR, 'zuno_orchestrator_contract_examples_check.json');
  const mdPath = path.join(REPORTS_DIR, 'zuno_orchestrator_contract_examples_check.md');
  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const mdLines = [
    '# Zuno orchestrator contract examples check',
    '',
    `- Generated: ${generatedAt}`,
    `- Status: ${ok ? 'PASS' : 'FAIL'}`,
    '',
    '## Checks',
    '',
    ...checks.map((c) => `- **${c.file}:** ${c.ok ? 'ok' : 'fail'} — ${c.detail}`),
    '',
  ];
  if (errors.length) {
    mdLines.push('## Errors', '', ...errors.map((e) => `- ${e}`), '');
  }
  fs.writeFileSync(mdPath, mdLines.join('\n'), 'utf8');

  console.log(ok ? '✅ Examples check PASS' : '❌ Examples check FAIL');
  console.log(`Report: ${jsonPath}`);
  process.exit(ok ? 0 : 1);
}

main();
