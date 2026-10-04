import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  acceptProgress,
  assessTechnical,
  buildReadinessPayload,
  compareAttestation,
  deriveAttestation,
  evaluateDeployment,
  readOverride,
} from '../scripts/z_readiness_attestation.mjs';
import { evaluateStoredReport } from '../scripts/z_execution_enforcer_gate.mjs';
import { refreshOctaveReadiness } from '../scripts/z_octave_readiness_refresh.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FIXED = '2026-10-04T00:00:00.000Z';
const LIVE_ZUNO = path.join(ROOT, 'data', 'reports', 'zuno_system_state_report.json');
const LIVE_ENFORCER = path.join(ROOT, 'data', 'reports', 'z_execution_enforcer.json');
const LIVE_OCTAVE = path.join(ROOT, 'data', 'reports', 'z_octave_readiness.json');
const LIVE_CONTROL = path.join(ROOT, 'data', 'z_release_control.json');

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function signature(filePath) {
  const stat = fs.statSync(filePath);
  return {
    sha256: sha256(fs.readFileSync(filePath)),
    mtimeMs: stat.mtimeMs,
    size: stat.size,
  };
}

function makeTemp() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'z-readiness-integrity-'));
}

function cleanup(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function gateSource(passes) {
  const gates = [
    { id: 'core_stability', label: 'Core stability', pass: passes.core_stability === true, note: 'n' },
    { id: 'ethics_lock', label: 'Ethics lock', pass: passes.ethics_lock === true, note: 'n' },
    { id: 'pilot_ready', label: 'Pilot readiness', pass: passes.pilot_ready === true, note: 'n' },
    { id: 'governance_signal', label: 'SKK/RKPK green', pass: passes.governance_signal === true, note: 'n' },
  ];
  return `const gates = ${JSON.stringify(gates, null, 2)};
export function getZOctaveReadinessGates() {
  return gates.map((gate) => ({ ...gate }));
}
export function isZOctavePublicReady() {
  return gates.every((gate) => gate.pass === true);
}
`;
}

const ALL_PASS = {
  core_stability: true,
  ethics_lock: true,
  pilot_ready: true,
  governance_signal: true,
};
const NONE_PASS = {
  core_stability: false,
  ethics_lock: false,
  pilot_ready: false,
  governance_signal: false,
};

function writeGates(dir, source) {
  const gatesPath = path.join(dir, 'products', 'Z-OCTAVE', 'integration', 'readiness-gates.js');
  fs.mkdirSync(path.dirname(gatesPath), { recursive: true });
  fs.writeFileSync(gatesPath, source);
  return gatesPath;
}

function overridePath(dir) {
  return path.join(dir, 'data', 'reports', 'z_octave_gate_overrides.json');
}

function writeOverride(dir, text) {
  const target = overridePath(dir);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text);
  return target;
}

async function deriveDir(dir, generatedAt = FIXED) {
  return deriveAttestation({ root: dir, generatedAt });
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function writeReport(dir, report) {
  const target = path.join(dir, 'data', 'reports', 'z_execution_enforcer.json');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(report, null, 2)}\n`);
  return target;
}

function runGate(dir, args) {
  return spawnSync(
    process.execPath,
    [path.join(ROOT, 'scripts', 'z_execution_enforcer_gate.mjs'), ...args],
    { cwd: dir, encoding: 'utf8' }
  );
}

test('1 SOURCE_MISSING BLOCK', async () => {
  const dir = makeTemp();
  try {
    const fresh = await deriveAttestation({
      root: dir,
      gatesPath: path.join(dir, 'missing-gates.js'),
      overridePath: path.join(dir, 'missing-override.json'),
      generatedAt: FIXED,
    });
    assert.equal(fresh.ok, false);
    assert.equal(fresh.code, 'SOURCE_MISSING');
    const decision = acceptProgress({ action: 'ALLOW_PROGRESS', storedAttestation: null, fresh });
    assert.equal(decision.accept, false);
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.code, 'SOURCE_MISSING');
  } finally {
    cleanup(dir);
  }
});

test('2 SOURCE_INVALID BLOCK', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, 'function not a module {{{');
    const fresh = await deriveDir(dir);
    assert.equal(fresh.ok, false);
    assert.equal(fresh.code, 'SOURCE_INVALID');
    const decision = acceptProgress({ action: 'ALLOW_PROGRESS', storedAttestation: null, fresh });
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.code, 'SOURCE_INVALID');
  } finally {
    cleanup(dir);
  }
});

test('3 malformed override JSON is INVALID with content hash BLOCK', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(NONE_PASS));
    const raw = Buffer.from('{', 'utf8');
    writeOverride(dir, raw);
    const fresh = await deriveDir(dir);
    assert.equal(fresh.ok, true);
    assert.equal(fresh.override.state, 'INVALID');
    assert.notEqual(fresh.override.state, 'ABSENT');
    assert.equal(fresh.override.fingerprint, sha256(raw));
    assert.notEqual(fresh.override.fingerprint, 'NONE');
    assert.equal(fresh.attestation.source_fingerprints.override_sha256, sha256(raw));
    assert.equal(fresh.attestation.override_state, 'INVALID');
    const decision = acceptProgress({
      action: 'ALLOW_PROGRESS',
      storedAttestation: fresh.attestation,
      fresh,
    });
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.code, 'INVALID_OVERRIDE');
  } finally {
    cleanup(dir);
  }
});

test('4 PROVENANCE_MISSING BLOCK', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(ALL_PASS));
    const fresh = await deriveDir(dir);
    assert.equal(fresh.ok, true);
    const decision = acceptProgress({ action: 'ALLOW_PROGRESS', storedAttestation: null, fresh });
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.code, 'PROVENANCE_MISSING');
  } finally {
    cleanup(dir);
  }
});

test('5 PROVENANCE_MALFORMED BLOCK', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(ALL_PASS));
    const fresh = await deriveDir(dir);
    const decision = acceptProgress({
      action: 'ALLOW_PROGRESS',
      storedAttestation: { attestation_version: 'not-the-contract', ready: true },
      fresh,
    });
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.code, 'PROVENANCE_MALFORMED');
  } finally {
    cleanup(dir);
  }
});

test('6 HASH_MISMATCH BLOCK and dirty worktree bytes win', async () => {
  const dir = makeTemp();
  try {
    const gatesPath = writeGates(dir, gateSource(NONE_PASS));
    const first = await deriveDir(dir);
    const gitBlobLike = '0123456789abcdef'.repeat(4);
    fs.writeFileSync(gatesPath, `${gateSource(ALL_PASS)}\n// dirty worktree bytes\n`);
    const second = await deriveDir(dir);
    const currentBytes = fs.readFileSync(gatesPath);
    const contentHash = sha256(currentBytes);
    assert.equal(second.attestation.source_fingerprints.gates_module_sha256, contentHash);
    assert.notEqual(contentHash, gitBlobLike);
    assert.notEqual(contentHash, first.attestation.source_fingerprints.gates_module_sha256);
    assert.equal(compareAttestation(second.attestation, second.attestation).match, true);

    const recordedAsBlob = clone(second.attestation);
    recordedAsBlob.source_fingerprints.gates_module_sha256 = gitBlobLike;
    assert.equal(compareAttestation(recordedAsBlob, second.attestation).code, 'HASH_MISMATCH');
    const decision = acceptProgress({
      action: 'ALLOW_PROGRESS',
      storedAttestation: recordedAsBlob,
      fresh: second,
    });
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.code, 'HASH_MISMATCH');
  } finally {
    cleanup(dir);
  }
});

test('7 GATE_VECTOR_MISMATCH with equal pass/total counts BLOCK', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(ALL_PASS));
    const fresh = await deriveDir(dir);
    assert.equal(fresh.attestation.gates_pass, 4);
    assert.equal(fresh.attestation.gates_total, 4);
    const stored = clone(fresh.attestation);
    stored.gate_vector = stored.gate_vector.map((gate, index) =>
      index === 0 ? { id: 'alt_ready', pass: true } : { id: gate.id, pass: true }
    );
    assert.equal(stored.gates_pass, fresh.attestation.gates_pass);
    assert.equal(stored.gates_total, fresh.attestation.gates_total);
    assert.equal(compareAttestation(stored, fresh.attestation).code, 'GATE_VECTOR_MISMATCH');
    const decision = acceptProgress({ action: 'ALLOW_PROGRESS', storedAttestation: stored, fresh });
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.code, 'GATE_VECTOR_MISMATCH');
  } finally {
    cleanup(dir);
  }
});

test('8 COUNT_MISMATCH BLOCK', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(ALL_PASS));
    const fresh = await deriveDir(dir);
    const stored = clone(fresh.attestation);
    stored.gates_pass = 3;
    assert.equal(compareAttestation(stored, fresh.attestation).code, 'COUNT_MISMATCH');
    const decision = acceptProgress({ action: 'ALLOW_PROGRESS', storedAttestation: stored, fresh });
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.code, 'COUNT_MISMATCH');
  } finally {
    cleanup(dir);
  }
});

test('9 READY_MISMATCH BLOCK', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(ALL_PASS));
    const fresh = await deriveDir(dir);
    const stored = clone(fresh.attestation);
    stored.ready = false;
    assert.equal(compareAttestation(stored, fresh.attestation).code, 'READY_MISMATCH');
    const decision = acceptProgress({ action: 'ALLOW_PROGRESS', storedAttestation: stored, fresh });
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.code, 'READY_MISMATCH');
  } finally {
    cleanup(dir);
  }
});

test('10 action UNKNOWN BLOCK', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(ALL_PASS));
    const fresh = await deriveDir(dir);
    const decision = acceptProgress({
      action: 'UNKNOWN',
      storedAttestation: fresh.attestation,
      fresh,
    });
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.code, 'ACTION_NOT_ALLOW_PROGRESS');
  } finally {
    cleanup(dir);
  }
});

test('11 STALE generated_at is not freshness BLOCK', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(ALL_PASS));
    const fresh = await deriveDir(dir);
    const timeOnly = clone(fresh.attestation);
    timeOnly.generated_at = '2099-01-01T00:00:00.000Z';
    assert.equal(compareAttestation(timeOnly, fresh.attestation).match, true);
    assert.equal(compareAttestation(timeOnly, fresh.attestation).code, 'MATCH');

    const stale = clone(fresh.attestation);
    stale.generated_at = '2099-01-01T00:00:00.000Z';
    stale.source_fingerprints.gates_module_sha256 = 'b'.repeat(64);
    assert.equal(compareAttestation(stale, fresh.attestation).code, 'STALE');
    const decision = acceptProgress({ action: 'ALLOW_PROGRESS', storedAttestation: stale, fresh });
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.code, 'STALE');
  } finally {
    cleanup(dir);
  }
});

test('12 generator or canonical path MISMATCH BLOCK', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(ALL_PASS));
    const fresh = await deriveDir(dir);
    const generatorDrift = clone(fresh.attestation);
    generatorDrift.generator = 'scripts/somewhere_else.mjs';
    assert.equal(generatorDrift.source_fingerprints.gates_module_sha256, fresh.attestation.source_fingerprints.gates_module_sha256);
    assert.equal(compareAttestation(generatorDrift, fresh.attestation).code, 'MISMATCH');

    const pathDrift = clone(fresh.attestation);
    pathDrift.canonical_source.gates_module = 'products/Z-OCTAVE/integration/other-gates.js';
    assert.equal(compareAttestation(pathDrift, fresh.attestation).code, 'MISMATCH');
    const decision = acceptProgress({ action: 'ALLOW_PROGRESS', storedAttestation: pathDrift, fresh });
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.code, 'MISMATCH');
  } finally {
    cleanup(dir);
  }
});

test('13 action BLOCK stays BLOCK', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(ALL_PASS));
    const fresh = await deriveDir(dir);
    const decision = acceptProgress({
      action: 'BLOCK',
      storedAttestation: fresh.attestation,
      fresh,
    });
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.accept, false);
  } finally {
    cleanup(dir);
  }
});

test('14 FORCE_DIAGNOSTICS BLOCK', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(ALL_PASS));
    const fresh = await deriveDir(dir);
    const decision = acceptProgress({
      action: 'FORCE_DIAGNOSTICS',
      storedAttestation: fresh.attestation,
      fresh,
    });
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.code, 'ACTION_NOT_ALLOW_PROGRESS');
  } finally {
    cleanup(dir);
  }
});

test('15 ALLOW_PROGRESS plus INVALID override BLOCK', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(ALL_PASS));
    writeOverride(dir, '{');
    const fresh = await deriveDir(dir);
    assert.equal(fresh.attestation.override_state, 'INVALID');
    const decision = acceptProgress({
      action: 'ALLOW_PROGRESS',
      storedAttestation: fresh.attestation,
      fresh,
    });
    assert.equal(decision.accept, false);
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.code, 'INVALID_OVERRIDE');
    assert.equal(decision.technical_pass, false);
  } finally {
    cleanup(dir);
  }
});

test('16 fresh all-pass is technical pass and deployment denied without binding', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(ALL_PASS));
    const fresh = await deriveDir(dir);
    const stored = clone(fresh.attestation);
    stored.generated_at = '1999-01-01T00:00:00.000Z';
    const decision = acceptProgress({
      action: 'ALLOW_PROGRESS',
      storedAttestation: stored,
      fresh,
      releaseControl: { manual_release: true, approved_by: 'AMK-Goku', timestamp: '2026-04-26T01:52:00Z' },
    });
    assert.equal(decision.accept, true);
    assert.equal(decision.technical_pass, true);
    assert.equal(decision.action, 'ALLOW_PROGRESS');
    assert.equal(decision.deploy_allowed, false);
    assert.equal(decision.deployment_code, 'UNBOUND');
    assert.equal(assessTechnical(fresh.attestation).pass, true);
  } finally {
    cleanup(dir);
  }
});

test('17 bound human approval authorizes deployment in memory only', async () => {
  const dir = makeTemp();
  const before = signature(LIVE_CONTROL);
  try {
    writeGates(dir, gateSource(ALL_PASS));
    const fresh = await deriveDir(dir);
    const releaseControl = {
      manual_release: true,
      approved_by: 'AMK-Goku',
      timestamp: '2026-04-26T01:52:00Z',
      bound_attestation: {
        gates_module_sha256: fresh.attestation.source_fingerprints.gates_module_sha256,
        override_sha256: fresh.attestation.source_fingerprints.override_sha256,
        override_state: fresh.attestation.override_state,
        gate_vector: fresh.attestation.gate_vector,
        ready: fresh.attestation.ready,
      },
    };
    const deployment = evaluateDeployment({
      attestation: fresh.attestation,
      releaseControl,
      technicalPass: true,
    });
    assert.equal(deployment.deploy_allowed, true);
    assert.equal(deployment.code, 'AUTHORIZED');
    const decision = acceptProgress({
      action: 'ALLOW_PROGRESS',
      storedAttestation: fresh.attestation,
      fresh,
      releaseControl,
    });
    assert.equal(decision.technical_pass, true);
    assert.equal(decision.deploy_allowed, true);
    assert.equal(fs.existsSync(path.join(dir, 'data', 'z_release_control.json')), false);
    assert.deepEqual(signature(LIVE_CONTROL), before);
  } finally {
    cleanup(dir);
  }
});

test('18 unbound manual_release does not authorize deployment', async () => {
  const before = signature(LIVE_CONTROL);
  const dir = makeTemp();
  try {
    const liveControl = JSON.parse(fs.readFileSync(LIVE_CONTROL, 'utf8'));
    assert.equal(liveControl.manual_release, true);
    assert.equal(liveControl.approved_by, 'AMK-Goku');
    assert.ok(liveControl.timestamp);
    assert.equal(Object.prototype.hasOwnProperty.call(liveControl, 'bound_attestation'), false);

    writeGates(dir, gateSource(ALL_PASS));
    const fresh = await deriveDir(dir);
    const unbound = evaluateDeployment({
      attestation: fresh.attestation,
      releaseControl: liveControl,
      technicalPass: true,
    });
    assert.equal(unbound.deploy_allowed, false);
    assert.equal(unbound.code, 'UNBOUND');

    const different = evaluateDeployment({
      attestation: fresh.attestation,
      releaseControl: {
        ...liveControl,
        bound_attestation: {
          gates_module_sha256: 'd'.repeat(64),
          override_sha256: 'NONE',
          override_state: 'ABSENT',
          gate_vector: fresh.attestation.gate_vector,
          ready: true,
        },
      },
      technicalPass: true,
    });
    assert.equal(different.deploy_allowed, false);
    assert.equal(different.code, 'BINDING_MISMATCH');
    assert.deepEqual(signature(LIVE_CONTROL), before);
  } finally {
    cleanup(dir);
  }
});

test('19 missing override file is ABSENT with fingerprint NONE', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(NONE_PASS));
    const fresh = await deriveDir(dir);
    assert.equal(fresh.override.state, 'ABSENT');
    assert.equal(fresh.override.fingerprint, 'NONE');
    assert.equal(fresh.attestation.override_state, 'ABSENT');
    assert.equal(fresh.attestation.source_fingerprints.override_sha256, 'NONE');
    assert.deepEqual(
      fresh.attestation.gate_vector.map((gate) => gate.id),
      ['core_stability', 'ethics_lock', 'governance_signal', 'pilot_ready']
    );
    const missing = readOverride(path.join(dir, 'no-such-override.json'), new Set(['core_stability']));
    assert.equal(missing.state, 'ABSENT');
    assert.equal(missing.fingerprint, 'NONE');
  } finally {
    cleanup(dir);
  }
});

test('20 override transitions ABSENT VALID INVALID', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(NONE_PASS));
    const absent = await deriveDir(dir);
    assert.equal(absent.override.state, 'ABSENT');
    assert.equal(absent.override.fingerprint, 'NONE');

    writeOverride(dir, JSON.stringify({ updated_at: '2026-04-13T00:00:00.000Z', gates: [] }));
    const validEmpty = await deriveDir(dir);
    assert.equal(validEmpty.override.state, 'VALID');
    assert.notEqual(validEmpty.override.fingerprint, 'NONE');
    assert.equal(validEmpty.attestation.gates_pass, 0);
    assert.equal(validEmpty.attestation.ready, false);
    const absentToValid = acceptProgress({
      action: 'ALLOW_PROGRESS',
      storedAttestation: absent.attestation,
      fresh: validEmpty,
    });
    assert.equal(absentToValid.action, 'BLOCK');

    fs.rmSync(overridePath(dir));
    const validToAbsent = await deriveDir(dir);
    assert.equal(validToAbsent.override.state, 'ABSENT');
    assert.equal(validToAbsent.override.fingerprint, 'NONE');

    writeOverride(
      dir,
      JSON.stringify({
        gates: [{ id: 'core_stability', pass: true }],
      })
    );
    const validOverlay = await deriveDir(dir);
    assert.equal(validOverlay.override.state, 'VALID');
    assert.equal(validOverlay.attestation.gate_vector.find((gate) => gate.id === 'core_stability').pass, true);
    assert.equal(validOverlay.attestation.gates_pass, 1);

    writeOverride(dir, '{');
    const validToInvalid = await deriveDir(dir);
    assert.equal(validToInvalid.override.state, 'INVALID');
    assert.notEqual(validToInvalid.override.fingerprint, 'NONE');
    assert.equal(validToInvalid.attestation.gates_pass, 0);
    const acrossInvalid = acceptProgress({
      action: 'ALLOW_PROGRESS',
      storedAttestation: validOverlay.attestation,
      fresh: validToInvalid,
    });
    assert.equal(acrossInvalid.action, 'BLOCK');

    writeOverride(dir, JSON.stringify({ gates: [] }));
    const invalidToValid = await deriveDir(dir);
    assert.equal(invalidToValid.override.state, 'VALID');
    assert.equal(invalidToValid.attestation.gates_pass, 0);

    fs.rmSync(overridePath(dir));
    const absentAgain = await deriveDir(dir);
    assert.equal(absentAgain.override.state, 'ABSENT');
    writeOverride(dir, 'not-json');
    const absentToInvalid = await deriveDir(dir);
    assert.equal(absentToInvalid.override.state, 'INVALID');
    assert.notEqual(absentToInvalid.override.fingerprint, 'NONE');
    assert.notEqual(absentToInvalid.override.state, 'ABSENT');

    writeOverride(
      dir,
      JSON.stringify({
        gates: [
          { id: 'core_stability', pass: true },
          { id: 'core_stability', pass: false },
        ],
      })
    );
    const duplicate = await deriveDir(dir);
    assert.equal(duplicate.override.state, 'INVALID');
    assert.notEqual(duplicate.override.fingerprint, 'NONE');

    writeOverride(dir, JSON.stringify({ gates: [{ id: 'unknown_gate', pass: true }] }));
    const unknown = await deriveDir(dir);
    assert.equal(unknown.override.state, 'INVALID');

    writeOverride(dir, JSON.stringify({ gates: [], ready_override: null }));
    const badReady = await deriveDir(dir);
    assert.equal(badReady.override.state, 'INVALID');
    assert.notEqual(badReady.override.fingerprint, 'NONE');
  } finally {
    cleanup(dir);
  }
});

test('21 fresh 4/4 derivation does not write manual_release or authorize deployment', async () => {
  const dir = makeTemp();
  const controlBefore = signature(LIVE_CONTROL);
  const octaveBefore = signature(LIVE_OCTAVE);
  try {
    writeGates(dir, gateSource(ALL_PASS));
    const built = await buildReadinessPayload({ root: dir, generatedAt: FIXED });
    assert.equal(built.ok, true);
    assert.equal(built.payload.ready, true);
    assert.equal(built.payload.attestation.gates_pass, 4);
    assert.equal(fs.existsSync(path.join(dir, 'data', 'z_release_control.json')), false);

    const pilot = path.join(dir, 'data', 'reports', 'z_octave_pilot_seed.json');
    fs.mkdirSync(path.dirname(pilot), { recursive: true });
    fs.writeFileSync(pilot, '{"pilot":"metadata-only"}');
    const withPilot = await buildReadinessPayload({ root: dir, generatedAt: FIXED });
    assert.equal(withPilot.payload.pilot_seed, true);
    assert.equal(
      withPilot.attestation.source_fingerprints.gates_module_sha256,
      built.attestation.source_fingerprints.gates_module_sha256
    );
    assert.equal(
      withPilot.attestation.source_fingerprints.override_sha256,
      built.attestation.source_fingerprints.override_sha256
    );
    assert.deepEqual(withPilot.attestation.gate_vector, built.attestation.gate_vector);

    const written = await refreshOctaveReadiness({
      root: dir,
      outPath: path.join(dir, 'tmp-readiness.json'),
      generatedAt: FIXED,
    });
    assert.equal(written.ok, true);
    assert.equal(fs.existsSync(path.join(dir, 'tmp-readiness.json')), true);
    assert.equal(fs.existsSync(path.join(dir, 'data', 'z_release_control.json')), false);

    const deployment = evaluateDeployment({
      attestation: built.attestation,
      releaseControl: {},
      technicalPass: true,
    });
    assert.equal(deployment.deploy_allowed, false);

    const cli = spawnSync(
      process.execPath,
      [
        path.join(ROOT, 'scripts', 'z_readiness_attestation.mjs'),
        '--require-deployment',
        '--root',
        dir,
      ],
      { encoding: 'utf8' }
    );
    assert.notEqual(cli.status, 0);
    assert.match(cli.stderr || '', /denied/);
    assert.doesNotMatch(cli.stdout || '', /authorized/);

    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    const guard = 'node scripts/z_readiness_attestation.mjs --require-deployment && ';
    assert.equal(pkg.scripts['deploy:cf-z-bridge:pages:preview'].startsWith(guard), true);
    assert.equal(pkg.scripts['deploy:cf-z-bridge:pages:production'].startsWith(guard), true);
    assert.equal(pkg.scripts['deploy:cf-z-bridge:pages'], 'npm run deploy:cf-z-bridge:pages:preview');

    assert.deepEqual(signature(LIVE_CONTROL), controlBefore);
    assert.deepEqual(signature(LIVE_OCTAVE), octaveBefore);
  } finally {
    cleanup(dir);
  }
});

test('22 stored zuno and enforcer JSON are not current authority', async () => {
  const before = {
    zuno: signature(LIVE_ZUNO),
    enforcer: signature(LIVE_ENFORCER),
    octave: signature(LIVE_OCTAVE),
    control: signature(LIVE_CONTROL),
  };
  try {
    const zuno = JSON.parse(fs.readFileSync(LIVE_ZUNO, 'utf8'));
    const enforcer = JSON.parse(fs.readFileSync(LIVE_ENFORCER, 'utf8'));
    const live = await deriveAttestation({ root: ROOT, generatedAt: FIXED });
    assert.equal(live.ok, true);
    assert.equal(live.attestation.ready, false);
    assert.equal(live.attestation.gates_pass, 0);
    assert.equal(live.attestation.gates_total, 4);

    const storedAttestation =
      enforcer.readiness_attestation ??
      zuno.current?.readiness_attestation ??
      zuno.readiness_attestation ??
      null;
    const decision = acceptProgress({
      action: enforcer.action,
      storedAttestation,
      fresh: live,
      releaseControl: JSON.parse(fs.readFileSync(LIVE_CONTROL, 'utf8')),
    });
    assert.equal(decision.accept, false);
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.deploy_allowed, false);

    const coherentOld = clone(live.attestation);
    coherentOld.ready = true;
    coherentOld.gates_pass = 4;
    coherentOld.gates_total = 4;
    coherentOld.gate_vector = coherentOld.gate_vector.map((gate) => ({ id: gate.id, pass: true }));
    const oldEnforcer = {
      action: 'ALLOW_PROGRESS',
      checks: { readiness_pass: 4, readiness_total: 4 },
      readiness_attestation: coherentOld,
    };
    assert.equal(oldEnforcer.checks.readiness_pass, 4);
    assert.equal(oldEnforcer.readiness_attestation.gates_pass, oldEnforcer.checks.readiness_pass);
    const replay = acceptProgress({
      action: oldEnforcer.action,
      storedAttestation: oldEnforcer.readiness_attestation,
      fresh: live,
      releaseControl: JSON.parse(fs.readFileSync(LIVE_CONTROL, 'utf8')),
    });
    assert.equal(replay.accept, false);
    assert.equal(replay.action, 'BLOCK');

    const octave = JSON.parse(fs.readFileSync(LIVE_OCTAVE, 'utf8'));
    assert.equal(octave.ready, false);
    assert.equal(octave.gates.filter((gate) => gate.pass === true).length, 0);
  } finally {
    assert.deepEqual(signature(LIVE_ZUNO), before.zuno);
    assert.deepEqual(signature(LIVE_ENFORCER), before.enforcer);
    assert.deepEqual(signature(LIVE_OCTAVE), before.octave);
    assert.deepEqual(signature(LIVE_CONTROL), before.control);
  }
});

test('23 empty action and WARN BLOCK', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(ALL_PASS));
    const fresh = await deriveDir(dir);
    const empty = acceptProgress({ action: '', storedAttestation: fresh.attestation, fresh });
    const warn = acceptProgress({ action: 'WARN', storedAttestation: fresh.attestation, fresh });
    assert.equal(empty.action, 'BLOCK');
    assert.equal(warn.action, 'BLOCK');
    assert.equal(empty.code, 'ACTION_NOT_ALLOW_PROGRESS');
    assert.equal(warn.code, 'ACTION_NOT_ALLOW_PROGRESS');
  } finally {
    cleanup(dir);
  }
});

test('24 stored ALLOW_PROGRESS with skip-refresh still recomputes and blocks', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(NONE_PASS));
    const fresh = await deriveDir(dir);
    assert.equal(fresh.attestation.gates_pass, 0);
    const stored = clone(fresh.attestation);
    stored.ready = true;
    stored.gates_pass = 4;
    stored.gates_total = 4;
    stored.gate_vector = stored.gate_vector.map((gate) => ({ id: gate.id, pass: true }));
    const report = {
      action: 'ALLOW_PROGRESS',
      readiness_attestation: stored,
    };
    const decision = evaluateStoredReport(report, fresh, null);
    assert.equal(decision.accept, false);
    assert.equal(decision.action, 'BLOCK');
    assert.notEqual(decision.code, 'ALLOW_PROGRESS');
  } finally {
    cleanup(dir);
  }
});

test('25 bridge PASS 4/4 does not enter octave fields', async () => {
  const { computeOctaveBridgeMetrics } = await import(
    pathToFileURL(path.join(ROOT, 'scripts', 'z_zuno_state_report.mjs')).href
  );
  const octaveGates = [
    { id: 'core_stability', pass: false },
    { id: 'ethics_lock', pass: false },
    { id: 'pilot_ready', pass: false },
    { id: 'governance_signal', pass: false },
  ];
  const attestation = { attestation_version: 'readiness-integrity-0', marker: 'copied' };
  const view = computeOctaveBridgeMetrics(
    { ready: false, gates: octaveGates, attestation },
    { summary: { status: 'PASS', gates_pass: 4, gates_total: 4 } }
  );
  assert.equal(view.readiness_ready, false);
  assert.equal(view.readiness_gates_pass, 0);
  assert.equal(view.readiness_gates_total, 4);
  assert.equal(view.bridge_ready, true);
  assert.equal(view.bridge_gates_pass, 4);
  assert.equal(view.bridge_gates_total, 4);
  assert.deepEqual(view.readiness_attestation, attestation);
  assert.notEqual(view.readiness_gates_pass, view.bridge_gates_pass);
});

test('26 ready_override true with a failing gate is attested and technical BLOCK', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource({ ...ALL_PASS, pilot_ready: false }));
    writeOverride(dir, JSON.stringify({ updated_at: '2026-04-13T00:00:00.000Z', gates: [], ready_override: true }));
    const fresh = await deriveDir(dir);
    assert.equal(fresh.ok, true);
    assert.equal(fresh.override.state, 'VALID');
    assert.equal(fresh.attestation.ready, true);
    assert.equal(fresh.attestation.gates_pass, 3);
    assert.equal(fresh.attestation.gates_total, 4);
    assert.equal(
      fresh.attestation.gate_vector.find((gate) => gate.id === 'pilot_ready').pass,
      false
    );
    assert.equal(assessTechnical(fresh.attestation).pass, false);
    const decision = acceptProgress({
      action: 'ALLOW_PROGRESS',
      storedAttestation: fresh.attestation,
      fresh,
    });
    assert.equal(decision.action, 'BLOCK');
    assert.equal(decision.technical_pass, false);
    assert.equal(decision.deploy_allowed, false);
  } finally {
    cleanup(dir);
  }
});

test('27 normal gate BLOCK is non-zero', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(NONE_PASS));
    const fresh = await deriveDir(dir);
    writeReport(dir, { action: 'BLOCK', readiness_attestation: fresh.attestation, enforcement: { deploy_allowed: true } });
    const cli = runGate(dir, ['--skip-refresh']);
    assert.notEqual(cli.status, 0);
    assert.match(cli.stderr || '', /BLOCKED/);
    assert.doesNotMatch(`${cli.stdout || ''}`, /Gate passed/);
  } finally {
    cleanup(dir);
  }
});

test('28 normal gate UNKNOWN is non-zero', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(NONE_PASS));
    const fresh = await deriveDir(dir);
    writeReport(dir, { action: 'UNKNOWN', readiness_attestation: fresh.attestation });
    const cli = runGate(dir, ['--skip-refresh']);
    assert.notEqual(cli.status, 0);
    assert.match(cli.stderr || '', /BLOCKED/);
    assert.doesNotMatch(`${cli.stdout || ''}`, /Gate passed/);
  } finally {
    cleanup(dir);
  }
});

test('29 normal gate FORCE_DIAGNOSTICS is non-zero', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(NONE_PASS));
    const fresh = await deriveDir(dir);
    writeReport(dir, { action: 'FORCE_DIAGNOSTICS', readiness_attestation: fresh.attestation });
    const cli = runGate(dir, ['--skip-refresh']);
    assert.notEqual(cli.status, 0);
    assert.match(cli.stderr || '', /BLOCKED/);
    assert.doesNotMatch(`${cli.stdout || ''}`, /Gate passed/);
  } finally {
    cleanup(dir);
  }
});

test('30 normal gate valid ALLOW_PROGRESS is a technical pass', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(ALL_PASS));
    const fresh = await deriveDir(dir);
    assert.equal(fresh.attestation.ready, true);
    assert.equal(fresh.attestation.gates_pass, 4);
    writeReport(dir, { action: 'ALLOW_PROGRESS', readiness_attestation: fresh.attestation });
    const cli = runGate(dir, ['--skip-refresh']);
    assert.equal(cli.status, 0);
    assert.match(cli.stdout || '', /Gate passed/);
    assert.doesNotMatch(`${cli.stderr || ''}`, /BLOCKED/);
  } finally {
    cleanup(dir);
  }
});

test('31 verify-only coherent BLOCK exits 0 without authority', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(NONE_PASS));
    const fresh = await deriveDir(dir);
    const reportPath = writeReport(dir, {
      action: 'BLOCK',
      readiness_attestation: fresh.attestation,
      enforcement: { deploy_allowed: true },
    });
    const before = fs.readFileSync(reportPath);
    const cli = runGate(dir, ['--verify-only', '--skip-refresh']);
    assert.equal(cli.status, 0);
    assert.match(cli.stdout || '', /verify-only action=BLOCK/);
    assert.doesNotMatch(cli.stdout || '', /action=ALLOW_PROGRESS/);
    assert.match(cli.stdout || '', /deploy_allowed=false/);
    assert.doesNotMatch(cli.stdout || '', /deploy_allowed=true/);
    assert.match(cli.stdout || '', /execution_authority=none/);
    assert.match(cli.stdout || '', /No execution authority granted/);
    assert.doesNotMatch(`${cli.stdout || ''}`, /Gate passed/);
    assert.equal(fs.readFileSync(reportPath).equals(before), true);
    const stored = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    assert.equal(stored.action, 'BLOCK');
    assert.equal(stored.enforcement.deploy_allowed, true);
  } finally {
    cleanup(dir);
  }
});

test('32 verify-only cannot satisfy require-deployment', async () => {
  const dir = makeTemp();
  try {
    writeGates(dir, gateSource(ALL_PASS));
    const fresh = await deriveDir(dir);
    writeReport(dir, { action: 'ALLOW_PROGRESS', readiness_attestation: fresh.attestation });
    fs.mkdirSync(path.join(dir, 'data'), { recursive: true });
    fs.writeFileSync(
      path.join(dir, 'data', 'z_release_control.json'),
      `${JSON.stringify({ manual_release: true, approved_by: 'unbound-fixture', timestamp: FIXED })}\n`
    );
    const verify = runGate(dir, ['--verify-only', '--skip-refresh']);
    assert.notEqual(verify.status, 0);
    assert.match(verify.stdout || '', /deploy_allowed=false/);
    assert.match(verify.stdout || '', /execution_authority=none/);
    assert.doesNotMatch(`${verify.stdout || ''}`, /Gate passed/);
    assert.doesNotMatch(`${verify.stdout || ''}`, /authorized/);

    const deployment = spawnSync(
      process.execPath,
      [
        path.join(ROOT, 'scripts', 'z_readiness_attestation.mjs'),
        '--verify-only',
        '--require-deployment',
        '--root',
        dir,
      ],
      { encoding: 'utf8' }
    );
    assert.notEqual(deployment.status, 0);
    assert.match(deployment.stderr || '', /denied/);
    assert.doesNotMatch(`${deployment.stdout || ''}`, /authorized/);
    assert.equal(fs.existsSync(path.join(dir, 'data', 'z_release_control.json')), true);
    const control = JSON.parse(fs.readFileSync(path.join(dir, 'data', 'z_release_control.json'), 'utf8'));
    assert.equal(control.bound_attestation, undefined);
  } finally {
    cleanup(dir);
  }
});

test('33 verify-only rejects malformed or invalid attestation', async () => {
  const invalidOverride = makeTemp();
  const brokenSource = makeTemp();
  const malformedStored = makeTemp();
  try {
    writeGates(invalidOverride, gateSource(NONE_PASS));
    writeOverride(invalidOverride, '{');
    const invalid = await deriveDir(invalidOverride);
    assert.equal(invalid.override.state, 'INVALID');
    writeReport(invalidOverride, { action: 'BLOCK', readiness_attestation: invalid.attestation });
    const invalidCli = runGate(invalidOverride, ['--verify-only', '--skip-refresh']);
    assert.notEqual(invalidCli.status, 0);
    assert.match(invalidCli.stderr || '', /VERIFY FAILED: INVALID_OVERRIDE/);
    assert.doesNotMatch(`${invalidCli.stdout || ''}`, /Gate passed/);

    writeGates(brokenSource, 'function not a module {{{');
    writeReport(brokenSource, { action: 'BLOCK' });
    const brokenCli = runGate(brokenSource, ['--verify-only', '--skip-refresh']);
    assert.notEqual(brokenCli.status, 0);
    assert.match(brokenCli.stderr || '', /VERIFY FAILED: SOURCE_INVALID/);

    writeGates(malformedStored, gateSource(NONE_PASS));
    writeReport(malformedStored, {
      action: 'ALLOW_PROGRESS',
      readiness_attestation: { attestation_version: 'not-the-contract', ready: true },
    });
    const malformedCli = runGate(malformedStored, ['--verify-only', '--skip-refresh']);
    assert.notEqual(malformedCli.status, 0);
    assert.match(malformedCli.stderr || '', /VERIFY FAILED: PROVENANCE_MALFORMED/);
    assert.doesNotMatch(`${malformedCli.stdout || ''}`, /action=ALLOW_PROGRESS/);
  } finally {
    cleanup(invalidOverride);
    cleanup(brokenSource);
    cleanup(malformedStored);
  }
});
