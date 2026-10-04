#!/usr/bin/env node
/**
 * Readiness integrity validator.
 * Hashes the gate-module and override bytes on disk. Not a provenance engine.
 * generated_at is recorded and excluded from freshness and equality.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export const ATTESTATION_VERSION = 'readiness-integrity-0';
export const CANONICAL_GATES_MODULE = 'products/Z-OCTAVE/integration/readiness-gates.js';
export const CANONICAL_OVERRIDE_FILE = 'data/reports/z_octave_gate_overrides.json';
export const GENERATOR = 'scripts/z_octave_readiness_refresh.mjs';
export const OVERRIDE_ABSENT_FINGERPRINT = 'NONE';
export const PILOT_SEED_REL = 'data/reports/z_octave_pilot_seed.json';

const HEX64 = /^[0-9a-f]{64}$/;

export function sha256Hex(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function canonicalGateVector(gates) {
  const list = Array.isArray(gates) ? gates : [];
  return list
    .map((gate) => ({ id: String(gate.id), pass: gate.pass === true }))
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

function vectorsEqual(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right) || left.length !== right.length) return false;
  for (let i = 0; i < left.length; i += 1) {
    const a = left[i];
    const b = right[i];
    if (!a || !b || a.id !== b.id || a.pass !== b.pass) return false;
  }
  return true;
}

/**
 * ABSENT is ENOENT only. Any other read or parse failure is INVALID and keeps a content hash.
 * @param {Buffer} bytes
 * @param {Set<string>|null} sourceIds
 */
export function classifyOverrideBytes(bytes, sourceIds) {
  const fingerprint = sha256Hex(bytes);
  let parsed;
  try {
    parsed = JSON.parse(Buffer.from(bytes).toString('utf8'));
  } catch {
    return { state: 'INVALID', fingerprint, parsed: null, reason: 'parse' };
  }
  if (!isPlainObject(parsed)) {
    return { state: 'INVALID', fingerprint, parsed: null, reason: 'not_object' };
  }
  if (Object.prototype.hasOwnProperty.call(parsed, 'ready_override') && typeof parsed.ready_override !== 'boolean') {
    return { state: 'INVALID', fingerprint, parsed: null, reason: 'ready_override' };
  }
  if (Object.prototype.hasOwnProperty.call(parsed, 'gates')) {
    if (!Array.isArray(parsed.gates)) {
      return { state: 'INVALID', fingerprint, parsed: null, reason: 'gates' };
    }
    const seen = new Set();
    for (const gate of parsed.gates) {
      if (!isPlainObject(gate) || typeof gate.id !== 'string' || gate.id.length === 0 || typeof gate.pass !== 'boolean') {
        return { state: 'INVALID', fingerprint, parsed: null, reason: 'gate_shape' };
      }
      if (seen.has(gate.id)) {
        return { state: 'INVALID', fingerprint, parsed: null, reason: 'duplicate' };
      }
      seen.add(gate.id);
      if (sourceIds && !sourceIds.has(gate.id)) {
        return { state: 'INVALID', fingerprint, parsed: null, reason: 'unknown_id' };
      }
    }
  }
  return { state: 'VALID', fingerprint, parsed, reason: null };
}

export function readOverride(overridePath, sourceIds) {
  let bytes;
  try {
    bytes = fs.readFileSync(overridePath);
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      return {
        state: 'ABSENT',
        fingerprint: OVERRIDE_ABSENT_FINGERPRINT,
        parsed: null,
        reason: 'enoent',
      };
    }
    return {
      state: 'INVALID',
      fingerprint: sha256Hex(Buffer.alloc(0)),
      parsed: null,
      reason: 'read_error',
    };
  }
  return classifyOverrideBytes(bytes, sourceIds);
}

function applyValidOverlay(sourceGates, override) {
  const gates = Array.isArray(override?.parsed?.gates) ? override.parsed.gates : [];
  if (override?.state !== 'VALID' || gates.length === 0) {
    return sourceGates.map((gate) => ({ ...gate }));
  }
  const map = new Map(gates.map((gate) => [gate.id, gate]));
  return sourceGates.map((gate) => {
    const overlay = map.get(gate.id);
    if (!overlay) return { ...gate };
    return {
      ...gate,
      pass: overlay.pass,
      note: overlay.note ?? gate.note,
    };
  });
}

function readyFromOverlay(appliedGates, override) {
  const computed = appliedGates.every((gate) => gate.pass === true);
  if (override?.state === 'VALID' && typeof override.parsed?.ready_override === 'boolean') {
    return override.parsed.ready_override;
  }
  return computed;
}

function buildAttestation({ gatesHash, override, vector, ready, generatedAt }) {
  const gatesPass = vector.filter((gate) => gate.pass === true).length;
  return {
    attestation_version: ATTESTATION_VERSION,
    canonical_source: {
      gates_module: CANONICAL_GATES_MODULE,
      override_file: CANONICAL_OVERRIDE_FILE,
    },
    source_fingerprints: {
      gates_module_sha256: gatesHash,
      override_sha256: override.fingerprint,
    },
    override_state: override.state,
    gate_vector: vector,
    ready,
    gates_pass: gatesPass,
    gates_total: vector.length,
    generator: GENERATOR,
    generated_at: generatedAt,
  };
}

async function importGateModule(gatesPath, gatesHash) {
  const href = `${pathToFileURL(gatesPath).href}?att=${gatesHash}`;
  return import(href);
}

export async function deriveAttestation(options = {}) {
  const root = options.root || process.cwd();
  const gatesPath = options.gatesPath || path.join(root, CANONICAL_GATES_MODULE);
  const overridePath = options.overridePath || path.join(root, CANONICAL_OVERRIDE_FILE);
  const generatedAt = options.generatedAt || new Date().toISOString();

  if (!fs.existsSync(gatesPath)) {
    return { ok: false, code: 'SOURCE_MISSING', attestation: null, override: null };
  }

  let gatesBytes;
  try {
    gatesBytes = fs.readFileSync(gatesPath);
  } catch {
    return { ok: false, code: 'SOURCE_INVALID', attestation: null, override: readOverride(overridePath, null) };
  }
  const gatesHash = sha256Hex(gatesBytes);

  let mod;
  try {
    mod = await importGateModule(gatesPath, gatesHash);
  } catch {
    return {
      ok: false,
      code: 'SOURCE_INVALID',
      attestation: null,
      override: readOverride(overridePath, null),
      gates_module_sha256: gatesHash,
    };
  }

  if (typeof mod.getZOctaveReadinessGates !== 'function' || typeof mod.isZOctavePublicReady !== 'function') {
    return {
      ok: false,
      code: 'SOURCE_INVALID',
      attestation: null,
      override: readOverride(overridePath, null),
      gates_module_sha256: gatesHash,
    };
  }

  let sourceGates;
  let baseReady;
  try {
    sourceGates = mod.getZOctaveReadinessGates();
    baseReady = mod.isZOctavePublicReady();
  } catch {
    return {
      ok: false,
      code: 'SOURCE_INVALID',
      attestation: null,
      override: readOverride(overridePath, null),
      gates_module_sha256: gatesHash,
    };
  }

  if (
    !Array.isArray(sourceGates) ||
    sourceGates.some((gate) => !isPlainObject(gate) || typeof gate.id !== 'string' || typeof gate.pass !== 'boolean')
  ) {
    return {
      ok: false,
      code: 'SOURCE_INVALID',
      attestation: null,
      override: readOverride(overridePath, null),
      gates_module_sha256: gatesHash,
    };
  }

  const sourceIds = new Set(sourceGates.map((gate) => gate.id));
  if (sourceIds.size !== sourceGates.length) {
    return {
      ok: false,
      code: 'SOURCE_INVALID',
      attestation: null,
      override: readOverride(overridePath, null),
      gates_module_sha256: gatesHash,
    };
  }

  const override = readOverride(overridePath, sourceIds);
  const applied = applyValidOverlay(sourceGates, override);
  const vector = canonicalGateVector(applied);
  const ready = readyFromOverlay(applied, override);
  const attestation = buildAttestation({ gatesHash, override, vector, ready, generatedAt });

  return {
    ok: true,
    code: 'OK',
    attestation,
    gates: applied,
    baseReady: baseReady === true,
    override,
    gates_module_sha256: gatesHash,
  };
}

export async function buildReadinessPayload(options = {}) {
  const root = options.root || process.cwd();
  const derived = await deriveAttestation(options);
  if (!derived.ok) return derived;
  const pilotSeedPath = options.pilotSeedPath || path.join(root, PILOT_SEED_REL);
  const pilotSeed = fs.existsSync(pilotSeedPath);
  const override = derived.override;
  let overridesField = null;
  if (override.state === 'VALID') {
    overridesField = { updated_at: override.parsed?.updated_at || null };
  } else if (override.state === 'INVALID') {
    overridesField = { state: 'INVALID', updated_at: null };
  }
  const payload = {
    generated_at: derived.attestation.generated_at,
    product: 'Z-OCTAVE',
    ready: derived.attestation.ready,
    gates: derived.gates,
    overrides: overridesField,
    base_ready: derived.baseReady,
    pilot_seed: pilotSeed,
    attestation: derived.attestation,
  };
  return { ok: true, code: 'OK', payload, attestation: derived.attestation, override };
}

export function attestationShapeError(stored) {
  if (stored == null) return 'PROVENANCE_MISSING';
  if (!isPlainObject(stored)) return 'PROVENANCE_MALFORMED';
  if (stored.attestation_version !== ATTESTATION_VERSION) return 'PROVENANCE_MALFORMED';
  if (!isPlainObject(stored.canonical_source)) return 'PROVENANCE_MALFORMED';
  if (typeof stored.canonical_source.gates_module !== 'string' || typeof stored.canonical_source.override_file !== 'string') {
    return 'PROVENANCE_MALFORMED';
  }
  if (!isPlainObject(stored.source_fingerprints)) return 'PROVENANCE_MALFORMED';
  const gatesHash = stored.source_fingerprints.gates_module_sha256;
  const overrideHash = stored.source_fingerprints.override_sha256;
  if (typeof gatesHash !== 'string' || !HEX64.test(gatesHash)) return 'PROVENANCE_MALFORMED';
  if (overrideHash !== OVERRIDE_ABSENT_FINGERPRINT && (typeof overrideHash !== 'string' || !HEX64.test(overrideHash))) {
    return 'PROVENANCE_MALFORMED';
  }
  if (!['ABSENT', 'VALID', 'INVALID'].includes(stored.override_state)) return 'PROVENANCE_MALFORMED';
  if (stored.override_state === 'ABSENT' && overrideHash !== OVERRIDE_ABSENT_FINGERPRINT) return 'PROVENANCE_MALFORMED';
  if (stored.override_state !== 'ABSENT' && overrideHash === OVERRIDE_ABSENT_FINGERPRINT) return 'PROVENANCE_MALFORMED';
  if (!Array.isArray(stored.gate_vector)) return 'PROVENANCE_MALFORMED';
  if (typeof stored.ready !== 'boolean') return 'PROVENANCE_MALFORMED';
  if (!Number.isInteger(stored.gates_pass) || !Number.isInteger(stored.gates_total)) return 'PROVENANCE_MALFORMED';
  if (typeof stored.generator !== 'string' || stored.generator.length === 0) return 'PROVENANCE_MALFORMED';
  if (typeof stored.generated_at !== 'string' || stored.generated_at.length === 0) return 'PROVENANCE_MALFORMED';
  return null;
}

export function compareAttestation(stored, fresh) {
  const shape = attestationShapeError(stored);
  if (shape) return { match: false, code: shape };
  if (!isPlainObject(fresh)) return { match: false, code: 'PROVENANCE_MISSING' };

  if (
    stored.generator !== fresh.generator ||
    stored.canonical_source.gates_module !== fresh.canonical_source.gates_module ||
    stored.canonical_source.override_file !== fresh.canonical_source.override_file
  ) {
    return { match: false, code: 'MISMATCH' };
  }

  const hashDiffers =
    stored.source_fingerprints.gates_module_sha256 !== fresh.source_fingerprints.gates_module_sha256 ||
    stored.source_fingerprints.override_sha256 !== fresh.source_fingerprints.override_sha256;
  if (hashDiffers) {
    if (stored.generated_at !== fresh.generated_at) return { match: false, code: 'STALE' };
    return { match: false, code: 'HASH_MISMATCH' };
  }

  const countsDiffer = stored.gates_pass !== fresh.gates_pass || stored.gates_total !== fresh.gates_total;
  const vectorDiffers = !vectorsEqual(stored.gate_vector, fresh.gate_vector);
  if (vectorDiffers && !countsDiffer) return { match: false, code: 'GATE_VECTOR_MISMATCH' };
  if (countsDiffer || vectorDiffers) return { match: false, code: 'COUNT_MISMATCH' };
  if (stored.ready !== fresh.ready) return { match: false, code: 'READY_MISMATCH' };
  if (stored.override_state !== fresh.override_state) return { match: false, code: 'MISMATCH' };
  return { match: true, code: 'MATCH' };
}

export function assessTechnical(attestation) {
  if (!isPlainObject(attestation)) return { pass: false, code: 'PROVENANCE_MISSING' };
  if (attestation.override_state === 'INVALID') return { pass: false, code: 'INVALID_OVERRIDE' };
  if (attestation.override_state !== 'ABSENT' && attestation.override_state !== 'VALID') {
    return { pass: false, code: 'INVALID_OVERRIDE' };
  }
  const vector = Array.isArray(attestation.gate_vector) ? attestation.gate_vector : [];
  const passCount = vector.filter((gate) => gate && gate.pass === true).length;
  const allPass = vector.length > 0 && passCount === vector.length;
  if (
    !allPass ||
    attestation.ready !== true ||
    attestation.gates_pass !== passCount ||
    attestation.gates_pass !== attestation.gates_total
  ) {
    return { pass: false, code: 'NOT_READY' };
  }
  return { pass: true, code: 'ALLOW_PROGRESS' };
}

export function boundIdentity(attestation) {
  return {
    gates_module_sha256: attestation?.source_fingerprints?.gates_module_sha256,
    override_sha256: attestation?.source_fingerprints?.override_sha256,
    override_state: attestation?.override_state,
    gate_vector: attestation?.gate_vector,
    ready: attestation?.ready,
  };
}

export function evaluateDeployment({ attestation, releaseControl, technicalPass }) {
  if (technicalPass !== true || !isPlainObject(attestation)) {
    return { deploy_allowed: false, code: 'TECHNICAL_BLOCK' };
  }
  const control = isPlainObject(releaseControl) ? releaseControl : {};
  if (control.manual_release !== true) return { deploy_allowed: false, code: 'MANUAL_RELEASE_REQUIRED' };
  if (typeof control.approved_by !== 'string' || control.approved_by.trim() === '') {
    return { deploy_allowed: false, code: 'APPROVER_REQUIRED' };
  }
  if (control.timestamp == null || String(control.timestamp).trim() === '') {
    return { deploy_allowed: false, code: 'TIMESTAMP_REQUIRED' };
  }
  const bound = control.bound_attestation;
  if (!isPlainObject(bound)) return { deploy_allowed: false, code: 'UNBOUND' };
  if (bound.override_state !== 'ABSENT' && bound.override_state !== 'VALID') {
    return { deploy_allowed: false, code: 'BINDING_MISMATCH' };
  }
  if (attestation.override_state !== 'ABSENT' && attestation.override_state !== 'VALID') {
    return { deploy_allowed: false, code: 'BINDING_MISMATCH' };
  }
  const fresh = boundIdentity(attestation);
  const same =
    bound.gates_module_sha256 === fresh.gates_module_sha256 &&
    bound.override_sha256 === fresh.override_sha256 &&
    bound.override_state === fresh.override_state &&
    bound.ready === fresh.ready &&
    vectorsEqual(bound.gate_vector, fresh.gate_vector);
  if (!same) return { deploy_allowed: false, code: 'BINDING_MISMATCH' };
  return { deploy_allowed: true, code: 'AUTHORIZED' };
}

export function acceptProgress({ action, storedAttestation, fresh, releaseControl }) {
  const denied = (code) => ({
    accept: false,
    action: 'BLOCK',
    code,
    technical_pass: false,
    deploy_allowed: false,
  });
  if (action !== 'ALLOW_PROGRESS') return denied('ACTION_NOT_ALLOW_PROGRESS');
  if (!fresh || fresh.ok !== true) return denied(fresh?.code || 'SOURCE_MISSING');
  const attestation = fresh.attestation;
  if (attestation?.override_state === 'INVALID') return denied('INVALID_OVERRIDE');
  const compared = compareAttestation(storedAttestation, attestation);
  if (!compared.match) return denied(compared.code);
  const technical = assessTechnical(attestation);
  const deployment = evaluateDeployment({
    attestation,
    releaseControl,
    technicalPass: technical.pass,
  });
  if (!technical.pass) return denied(technical.code);
  return {
    accept: true,
    action: 'ALLOW_PROGRESS',
    code: 'ALLOW_PROGRESS',
    technical_pass: true,
    deploy_allowed: deployment.deploy_allowed === true,
    deployment_code: deployment.code,
  };
}

export async function requireDeployment(options = {}) {
  const root = options.root || process.cwd();
  const fresh = await deriveAttestation({ ...options, root });
  if (!fresh.ok) return { ok: false, deploy_allowed: false, code: fresh.code, attestation: null };
  const technical = assessTechnical(fresh.attestation);
  let control = options.releaseControl;
  if (control === undefined) {
    const controlPath = options.releaseControlPath || path.join(root, 'data', 'z_release_control.json');
    try {
      control = JSON.parse(fs.readFileSync(controlPath, 'utf8'));
    } catch {
      control = {};
    }
  }
  const deployment = evaluateDeployment({
    attestation: fresh.attestation,
    releaseControl: control,
    technicalPass: technical.pass,
  });
  return {
    ok: deployment.deploy_allowed === true,
    deploy_allowed: deployment.deploy_allowed === true,
    code: deployment.code,
    attestation: fresh.attestation,
    technical_pass: technical.pass,
  };
}

function invokedDirectly() {
  const arg = process.argv[1];
  if (!arg) return false;
  return import.meta.url === pathToFileURL(arg).href;
}

async function cli() {
  const argv = process.argv.slice(2);
  if (argv.includes('--require-deployment')) {
    const rootFlag = argv.indexOf('--root');
    const root = rootFlag >= 0 ? argv[rootFlag + 1] : process.cwd();
    const result = await requireDeployment({ root });
    if (!result.ok) {
      process.stderr.write(`readiness deployment denied: ${result.code}\n`);
      process.exit(1);
    }
    process.stdout.write('readiness deployment authorized\n');
    return;
  }
  const derived = await deriveAttestation({ root: process.cwd() });
  process.stdout.write(`${JSON.stringify(derived.attestation ?? { ok: false, code: derived.code })}\n`);
  if (!derived.ok) process.exit(1);
}

if (invokedDirectly()) {
  cli().catch((error) => {
    process.stderr.write(`z_readiness_attestation failed: ${error?.message || String(error)}\n`);
    process.exit(1);
  });
}
