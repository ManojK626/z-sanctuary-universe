#!/usr/bin/env node
/**
 * Phase 2A — Read-only ZunoTaskPlan JSON linter. No execution, no providers, no network.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.join(__dirname, '..');
const REPO_ROOT = path.join(PACKAGE_ROOT, '..', '..');
const REPORTS_DIR = path.join(REPO_ROOT, 'data', 'reports');
const DEFAULT_INPUT = path.join(PACKAGE_ROOT, 'examples', 'zuno_task_plan.example.json');

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

/** Structural / policy errors → exit 1 */
const DESC_ERROR_PATTERNS = [
  { re: /\bpayment(s)?\b|\bpayout\b|\bcommerce\s+wiring\b/i, msg: 'forbidden commerce/payment wording' },
  { re: /\bauto-?merge\b|\bauto-?deploy\b|\bproduction\s+deploy\b/i, msg: 'forbidden deploy/merge automation wording' },
  { re: /\bapi\s*key\b|\bclient_secret\b|\bbearer\s+[a-z0-9+/=]{20,}/i, msg: 'forbidden secret/API material wording' },
  {
    re: /\bgambling\s+automation\b|\bbaby\s+predictor\b|\bsoulmate\s+predictor\b/i,
    msg: 'forbidden sensitive modality wording',
  },
];

/** Heuristic warnings (report-only unless paired with structural issues) */
const DESC_WARN_PATTERNS = [
  { re: /\bexecute\s+(the\s+)?(task\s+)?plan\b|\binvoke\s+orchestrator\b|\brun\s+this\s+plan\s+automatically\b/i, msg: 'possible execution claim in description' },
];

function stripDocKeys(value) {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(stripDocKeys);
  const out = {};
  for (const [k, v] of Object.entries(value)) {
    if (k.startsWith('_')) continue;
    out[k] = stripDocKeys(v);
  }
  return out;
}

function collectErrors(errors, msg) {
  errors.push(msg);
}

function validateDrp(drp, errors, label) {
  if (!drp || typeof drp !== 'object') {
    collectErrors(errors, `${label}: drpPreview missing or not object`);
    return;
  }
  if (typeof drp.overall !== 'string' || !DRP_OVERALL.has(drp.overall)) {
    collectErrors(errors, `${label}: invalid drpPreview.overall`);
  }
  if (drp.dimensions != null) {
    if (typeof drp.dimensions !== 'object' || Array.isArray(drp.dimensions)) {
      collectErrors(errors, `${label}: drpPreview.dimensions must be object`);
    } else {
      for (const [, v] of Object.entries(drp.dimensions)) {
        if (!DRP_DIM.has(v)) collectErrors(errors, `${label}: invalid dimension value "${v}"`);
      }
    }
  }
}

function scanDescriptions(steps, errors, warnings) {
  if (!Array.isArray(steps)) return;
  steps.forEach((s, i) => {
    const desc = typeof s?.description === 'string' ? s.description : '';
    const label = `steps[${i}].description`;
    for (const { re, msg } of DESC_ERROR_PATTERNS) {
      if (re.test(desc)) collectErrors(errors, `${label}: ${msg}`);
    }
    for (const { re, msg } of DESC_WARN_PATTERNS) {
      if (re.test(desc)) warnings.push(`${label}: ${msg}`);
    }
  });
}

function findEnabledProviderShapes(obj, basePath, errors) {
  if (obj === null || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => findEnabledProviderShapes(item, `${basePath}[${i}]`, errors));
    return;
  }
  const looksLikeAdapter =
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    Array.isArray(obj.capabilities) &&
    typeof obj.riskClass === 'string';
  if (looksLikeAdapter && obj.enabled === true) {
    collectErrors(errors, `${basePath}: enabled provider-like adapter object (forbidden in task plans)`);
  }
  for (const [k, v] of Object.entries(obj)) {
    findEnabledProviderShapes(v, `${basePath}.${k}`, errors);
  }
}

function lintTaskPlan(stripped, errors, warnings) {
  if (typeof stripped.planId !== 'string' || !stripped.planId) {
    collectErrors(errors, 'planId required');
  }
  if (typeof stripped.requestId !== 'string' || !stripped.requestId) {
    collectErrors(errors, 'requestId required');
  }
  if (!Array.isArray(stripped.steps) || stripped.steps.length === 0) {
    collectErrors(errors, 'steps must be non-empty array');
  } else {
    stripped.steps.forEach((s, i) => {
      const p = `steps[${i}]`;
      if (!s || typeof s !== 'object') return collectErrors(errors, `${p}: must be object`);
      if (typeof s.stepId !== 'string' || !s.stepId) collectErrors(errors, `${p}: stepId required`);
      if (typeof s.description !== 'string' || !s.description) collectErrors(errors, `${p}: description required`);
      if (typeof s.requiresHumanApproval !== 'boolean') {
        collectErrors(errors, `${p}: requiresHumanApproval must be boolean`);
      }
      const c = s.capability;
      if (!c || typeof c.family !== 'string' || !CAPABILITY_FAMILIES.has(c.family)) {
        collectErrors(errors, `${p}: invalid capability.family`);
      }
      if (c.labels != null && !Array.isArray(c.labels)) {
        collectErrors(errors, `${p}: capability.labels must be array when present`);
      }
    });
    scanDescriptions(stripped.steps, errors, warnings);
  }

  if (stripped.drpPreview == null) {
    collectErrors(errors, 'drpPreview required (Phase 2A posture gate)');
  } else {
    validateDrp(stripped.drpPreview, errors, 'drpPreview');
  }

  findEnabledProviderShapes(stripped, '$', errors);

  const extraKeys = Object.keys(stripped).filter((k) => !['planId', 'requestId', 'steps', 'drpPreview'].includes(k));
  if (extraKeys.length) {
    warnings.push(`unexpected top-level keys (allowed drift for forward compat): ${extraKeys.join(', ')}`);
  }
}

function main() {
  const inputPath = path.resolve(process.argv[2] || DEFAULT_INPUT);
  const generatedAt = new Date().toISOString();
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(inputPath)) {
    errors.push(`Input file missing: ${inputPath}`);
  }

  let raw = '';
  let parsed = null;
  let stripped = null;

  if (!errors.length) {
    try {
      raw = fs.readFileSync(inputPath, 'utf8');
      parsed = JSON.parse(raw);
    } catch (e) {
      errors.push(`JSON parse failed: ${e.message}`);
    }
  }

  if (parsed != null) {
    if (parsed._non_executable !== true && inputPath.includes(`${path.sep}examples${path.sep}`)) {
      warnings.push('File under examples/ should include "_non_executable": true for fixture hygiene');
    }
    stripped = stripDocKeys(parsed);
    lintTaskPlan(stripped, errors, warnings);
  }

  const ok = errors.length === 0;
  const payload = {
    schema: 'zuno_task_plan_lint_report_v1',
    generated_at: generatedAt,
    ok,
    input_path: path.relative(REPO_ROOT, inputPath).split(path.sep).join('/'),
    errors,
    warnings,
  };

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const jsonPath = path.join(REPORTS_DIR, 'zuno_task_plan_lint_report.json');
  const mdPath = path.join(REPORTS_DIR, 'zuno_task_plan_lint_report.md');
  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const mdLines = [
    '# Zuno task plan lint (read-only)',
    '',
    `- Generated: ${generatedAt}`,
    `- Input: \`${payload.input_path}\``,
    `- Status: ${ok ? 'PASS' : 'FAIL'}`,
    '',
  ];
  if (warnings.length) {
    mdLines.push('## Warnings', '', ...warnings.map((w) => `- ${w}`), '');
  }
  if (errors.length) {
    mdLines.push('## Errors', '', ...errors.map((e) => `- ${e}`), '');
  }
  fs.writeFileSync(mdPath, mdLines.join('\n'), 'utf8');

  console.log(ok ? '✅ Task plan lint PASS' : '❌ Task plan lint FAIL');
  console.log(`Report: ${jsonPath}`);
  process.exit(ok ? 0 : 1);
}

main();
