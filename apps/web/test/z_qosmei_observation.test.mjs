import test from 'node:test';
import assert from 'node:assert/strict';
import {
  WHEEL_EU,
  WHEEL_US,
  clampNonNegative,
  droughtsAtEnd,
  generateDemoSpins,
  isValidPocket,
  lastRecurrenceGaps,
  maxRunLengthPerPocket,
  perPocketCounts,
  sessionFingerprint,
  stepDivide,
  stepMultiply,
  stepPlusMinus,
  validateSpins,
} from '../src/lib/z_qosmei_observation.js';

test('wheel validation and droughts (EU)', () => {
  assert.equal(isValidPocket(WHEEL_EU, 36), true);
  assert.equal(isValidPocket(WHEEL_EU, 37), false);
  const spins = [1, 2, 3, 1];
  assert.deepEqual(validateSpins(WHEEL_EU, spins), { ok: true });
  const d = droughtsAtEnd(WHEEL_EU, spins);
  assert.equal(d[1], 0);
  assert.equal(d[2], 2);
  assert.equal(d[4], 4);
});

test('American 00 encoded as 37', () => {
  assert.equal(isValidPocket(WHEEL_US, 37), true);
  const spins = [37, 1, 1];
  assert.deepEqual(validateSpins(WHEEL_US, spins), { ok: true });
  const c = perPocketCounts(WHEEL_US, spins);
  assert.equal(c[37], 1);
  assert.equal(c[1], 2);
});

test('max run lengths', () => {
  const spins = [4, 4, 4, 2, 2];
  const m = maxRunLengthPerPocket(WHEEL_EU, spins);
  assert.equal(m[4], 3);
  assert.equal(m[2], 2);
});

test('p/m/d clamp', () => {
  assert.equal(stepPlusMinus(0, -1), 0);
  assert.equal(stepMultiply(3), 6);
  assert.equal(stepDivide(5), 2);
  assert.equal(clampNonNegative(-9), 0);
});

test('recurrence gaps', () => {
  const spins = [1, 5, 5, 1, 9, 1];
  const g = lastRecurrenceGaps(WHEEL_EU, spins, 5);
  assert.deepEqual(g[1], [1, 2]);
});

test('demo stream length and fingerprint stability', () => {
  const a = generateDemoSpins(WHEEL_EU, 100, 99);
  assert.equal(a.length, 100);
  const f1 = sessionFingerprint(a, 99);
  const f2 = sessionFingerprint(a, 99);
  assert.equal(f1, f2);
});
