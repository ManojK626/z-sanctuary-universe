#!/usr/bin/env node
/**
 * Z-CREATOR-P2A — Creation Intake Binding (thin adapter).
 * Parses one intake envelope that embeds existing ZunoRequest + ZunoTaskPlan shapes.
 * Does not execute plans, spawn agents, call providers, or write reports.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

const ALLOWED_DOMAIN = 'DOCUMENTATION_SPECIFICATION';
const ALLOWED_VERIFY = 'npm run aafrtc:ci';
const ALLOWED_PATH_PREFIXES = [
  'docs/creator/',
  'docs/reconciliation/Z_CREATOR_P2A',
  'docs/reconciliation/PHASE_Z_CREATOR_P2A',
  'data/reconciliation/z_creator_p2a',
  'scripts/z_creator_intake_bind',
];
const ALWAYS_FORBIDDEN_PATHS = new Set(['docs/INDEX.md', 'package.json']);

function fail(errors, msg) {
  errors.push(msg);
}

function isPlainObject(v) {
  return v != null && typeof v === 'object' && !Array.isArray(v);
}

function normalizeRel(p) {
  return String(p || '').replaceAll('\\', '/').replace(/^\.\//, '');
}

function pathForbidden(rel) {
  const p = normalizeRel(rel);
  if (!p) return 'empty path';
  if (p.includes('..')) return 'path traversal';
  if (path.isAbsolute(p) || /^[A-Za-z]:/.test(p)) return 'absolute path';
  if (ALWAYS_FORBIDDEN_PATHS.has(p)) return `always-forbidden path ${p}`;
  if (!ALLOWED_PATH_PREFIXES.some((pre) => p === pre || p.startsWith(pre))) {
    return `path outside allowed prefixes: ${p}`;
  }
  return null;
}

function validateCapability(c, errors, label) {
  if (!isPlainObject(c)) {
    fail(errors, `${label}: capability must be object`);
    return;
  }
  if (typeof c.family !== 'string' || !CAPABILITY_FAMILIES.has(c.family)) {
    fail(errors, `${label}: invalid capability.family`);
  }
  if (c.labels != null && !Array.isArray(c.labels)) {
    fail(errors, `${label}: capability.labels must be array when present`);
  }
}

function validateRequest(req, errors) {
  if (!isPlainObject(req)) {
    fail(errors, 'missing request ID: request object required');
    return;
  }
  if (req._non_executable !== true) {
    fail(errors, 'request: _non_executable must be true');
  }
  if (typeof req.id !== 'string' || !req.id.trim()) {
    fail(errors, 'missing request ID');
  }
  if (typeof req.intentSummary !== 'string' || !req.intentSummary) {
    fail(errors, 'request: intentSummary required');
  }
  if (typeof req.projectScope !== 'string' || !req.projectScope) {
    fail(errors, 'request: projectScope required');
  }
  if (!Array.isArray(req.capabilitiesSought) || req.capabilitiesSought.length === 0) {
    fail(errors, 'request: capabilitiesSought must be non-empty array');
  } else {
    req.capabilitiesSought.forEach((c, i) => validateCapability(c, errors, `request.capabilitiesSought[${i}]`));
  }
}

function validateTaskPlan(plan, requestId, errors) {
  if (!isPlainObject(plan)) {
    fail(errors, 'missing task-plan ID: task_plan object required');
    return;
  }
  if (plan._non_executable !== true) {
    fail(errors, 'task_plan: _non_executable must be true');
  }
  if (typeof plan.planId !== 'string' || !plan.planId.trim()) {
    fail(errors, 'missing task-plan ID');
  }
  if (typeof plan.requestId !== 'string' || !plan.requestId.trim()) {
    fail(errors, 'task_plan: requestId required');
  } else if (requestId && plan.requestId !== requestId) {
    fail(errors, 'task_plan.requestId must match request.id');
  }
  if (!Array.isArray(plan.steps) || plan.steps.length === 0) {
    fail(errors, 'task_plan: steps must be non-empty array');
  } else {
    let human = false;
    plan.steps.forEach((s, i) => {
      const p = `task_plan.steps[${i}]`;
      if (!isPlainObject(s)) {
        fail(errors, `${p}: must be object`);
        return;
      }
      if (typeof s.stepId !== 'string' || !s.stepId) fail(errors, `${p}: stepId required`);
      if (typeof s.description !== 'string' || !s.description) fail(errors, `${p}: description required`);
      if (typeof s.requiresHumanApproval !== 'boolean') {
        fail(errors, `${p}: requiresHumanApproval must be boolean`);
      } else if (s.requiresHumanApproval) human = true;
      validateCapability(s.capability, errors, `${p}.capability`);
    });
    if (!human) fail(errors, 'task_plan: at least one step must require human approval');
  }
  if (plan.drpPreview != null) {
    const d = plan.drpPreview;
    if (!isPlainObject(d)) {
      fail(errors, 'task_plan.drpPreview must be object');
    } else {
      if (typeof d.overall !== 'string' || !DRP_OVERALL.has(d.overall)) {
        fail(errors, 'task_plan.drpPreview: invalid overall');
      }
      if (d.dimensions != null) {
        if (!isPlainObject(d.dimensions)) {
          fail(errors, 'task_plan.drpPreview.dimensions must be object');
        } else {
          for (const [k, v] of Object.entries(d.dimensions)) {
            if (!DRP_DIM.has(v)) fail(errors, `task_plan.drpPreview.dimensions.${k} invalid`);
          }
        }
      }
    }
  }
}

/**
 * @param {object} record
 * @param {{ checkCharterFile?: boolean, hubRoot?: string }} [options]
 */
export function bindIntake(record, options = {}) {
  const errors = [];
  const hubRoot = options.hubRoot || process.cwd();

  if (!isPlainObject(record)) {
    return { ok: false, errors: ['intake must be an object'], bound: null };
  }
  if (record._non_executable !== true) {
    fail(errors, 'intake: _non_executable must be true');
  }

  const charter = record.charter;
  if (!isPlainObject(charter) || typeof charter.id !== 'string' || !charter.id.trim()) {
    fail(errors, 'missing human charter');
  } else if (typeof charter.path !== 'string' || !charter.path.trim()) {
    fail(errors, 'missing human charter');
  } else {
    const cRel = normalizeRel(charter.path);
    const cBad = pathForbidden(cRel);
    if (cBad) fail(errors, `charter.path: ${cBad}`);
    if (options.checkCharterFile) {
      const abs = path.join(hubRoot, cRel);
      if (!fs.existsSync(abs)) fail(errors, `missing human charter file: ${cRel}`);
    }
  }

  if (record.domain !== ALLOWED_DOMAIN) {
    fail(errors, `unsupported domain: ${String(record.domain || '') || '(empty)'}`);
  }

  const authority = record.authority;
  if (!isPlainObject(authority)) {
    fail(errors, 'authority object required');
  } else {
    if (authority.runtime !== 'NONE') {
      fail(errors, 'runtime/deploy authority requested');
    }
    if (authority.deployment !== 'NONE') {
      fail(errors, 'runtime/deploy authority requested');
    }
    if (authority.human_approval_required !== true) {
      fail(errors, 'authority.human_approval_required must be true');
    }
  }

  const artefact = normalizeRel(record.requested_artefact);
  if (!artefact) fail(errors, 'requested_artefact required');

  const scope = record.scope;
  if (!isPlainObject(scope) || !Array.isArray(scope.allowed_paths) || scope.allowed_paths.length === 0) {
    fail(errors, 'scope.allowed_paths required');
  } else {
    for (const raw of scope.allowed_paths) {
      const bad = pathForbidden(raw);
      if (bad) fail(errors, `forbidden path: ${normalizeRel(raw)} (${bad})`);
    }
    if (artefact && !scope.allowed_paths.map(normalizeRel).includes(artefact)) {
      fail(errors, `forbidden path: requested_artefact not in allowed_paths (${artefact})`);
    }
  }
  if (artefact) {
    const aBad = pathForbidden(artefact);
    if (aBad) fail(errors, `forbidden path: ${artefact} (${aBad})`);
  }

  const verification = record.verification;
  if (!isPlainObject(verification) || verification.command !== ALLOWED_VERIFY) {
    fail(errors, `verification.command must be exactly "${ALLOWED_VERIFY}"`);
  }

  const req = record.request;
  validateRequest(req, errors);
  validateTaskPlan(record.task_plan, req && typeof req.id === 'string' ? req.id : '', errors);

  const ok = errors.length === 0;
  return {
    ok,
    errors,
    bound: ok
      ? {
          request_id: req.id,
          task_plan_id: record.task_plan.planId,
          charter_id: record.charter.id,
          domain: record.domain,
          requested_artefact: artefact,
          verification: ALLOWED_VERIFY,
          runtime_authority: 'NONE',
          deployment_authority: 'NONE',
          executable: false,
        }
      : null,
  };
}

function main(argv) {
  const idx = argv.indexOf('--intake');
  if (idx === -1 || !argv[idx + 1]) {
    process.stderr.write('Usage: node scripts/z_creator_intake_bind.mjs --intake <path>\n');
    process.exit(1);
  }
  const intakeRel = argv[idx + 1];
  const abs = path.resolve(process.cwd(), intakeRel);
  if (!fs.existsSync(abs)) {
    process.stderr.write(`Intake file not found: ${intakeRel}\n`);
    process.exit(1);
  }
  let record;
  try {
    record = JSON.parse(fs.readFileSync(abs, 'utf8'));
  } catch (e) {
    process.stderr.write(`Invalid JSON: ${e.message}\n`);
    process.exit(1);
  }
  const result = bindIntake(record, { checkCharterFile: true, hubRoot: process.cwd() });
  if (!result.ok) {
    process.stderr.write('CREATION INTAKE REJECTED\n');
    for (const err of result.errors) process.stderr.write(`- ${err}\n`);
    process.exit(1);
  }
  process.stdout.write(`${JSON.stringify({ status: 'ACCEPTED', bound: result.bound }, null, 2)}\n`);
}

const thisFile = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === thisFile) {
  main(process.argv);
}
