import { createRequire } from 'node:module';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const {
  isSecurityClassification,
  isDataSensitivity,
  detectSensitiveFields,
  detectUnknownFields,
  validateNoUnknownFields,
  validateRequiredFields,
  wrapInputValidation,
  wrapOutputValidation,
  meetsTrustLevel,
  evaluateTrustLevel,
  validateZeroTrustPolicy,
  createZeroTrustPolicyDescriptor,
  assertSafeObject,
  validationSuccess,
} = require('../dist/index.js');

test('valid security classification', () => {
  assert.equal(isSecurityClassification('confidential'), true);
  assert.equal(isSecurityClassification('top_secret'), false);
});

test('invalid data sensitivity rejected', () => {
  assert.equal(isDataSensitivity('extreme'), false);
  assert.equal(isDataSensitivity('high'), true);
});

test('sensitive field detection by key name', () => {
  const fields = detectSensitiveFields({
    user: 'ok',
    api_key: 'hidden',
    nested: { refresh_token: 'x' },
  }, { deep: true });
  assert.ok(fields.includes('api_key'));
  assert.ok(fields.includes('nested.refresh_token'));
});

test('unknown property detection', () => {
  const unknown = detectUnknownFields({ a: 1, b: 2 }, ['a']);
  assert.deepEqual(unknown, ['b']);
  const result = validateNoUnknownFields({ a: 1 }, ['a']);
  assert.equal(result.ok, true);
});

test('validation success for required fields', () => {
  const result = validateRequiredFields({ id: '1', name: 'x' }, ['id', 'name']);
  assert.equal(result.ok, true);
});

test('validation failure for missing required field', () => {
  const result = validateRequiredFields({ id: '1' }, ['id', 'name']);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.violations[0].code, 'REQUIRED_FIELD_MISSING');
  }
});

test('trust level evaluation', () => {
  assert.equal(meetsTrustLevel('verified', 'limited'), true);
  assert.equal(meetsTrustLevel('limited', 'verified'), false);
  const evalResult = evaluateTrustLevel('elevated', 'verified');
  assert.equal(evalResult.allowed, true);
});

test('zero trust policy object validation', () => {
  const valid = validateZeroTrustPolicy({
    id: 'zt-vile-read',
    name: 'VILE read boundary',
    verifyBeforeTrust: true,
    leastPrivilegeLabel: 'traveller-read',
    requiredTrustLevel: 'limited',
    allowedClassifications: ['public', 'internal'],
    explicitValidationRequired: true,
    immutableResult: true,
  });
  assert.equal(valid.ok, true);

  const invalid = validateZeroTrustPolicy({
    id: '',
    verifyBeforeTrust: false,
  });
  assert.equal(invalid.ok, false);
});

test('createZeroTrustPolicyDescriptor enforces zero trust flags', () => {
  const policy = createZeroTrustPolicyDescriptor({
    id: 'zt-1',
    name: 'Test',
    leastPrivilegeLabel: 'ops',
    requiredTrustLevel: 'verified',
    allowedClassifications: ['internal'],
  });
  assert.equal(policy.verifyBeforeTrust, true);
  assert.equal(policy.immutableResult, true);
});

test('wrapInputValidation rejects non-object', () => {
  const result = wrapInputValidation('bad', () => validationSuccess({}));
  assert.equal(result.ok, false);
});

test('wrapOutputValidation rejects sensitive keys in output', () => {
  const result = wrapOutputValidation({ message: 'ok', password: 'nope' });
  assert.equal(result.ok, false);
});

test('assertSafeObject throws on failure', () => {
  const fail = validateRequiredFields({}, ['id']);
  assert.throws(() => assertSafeObject(fail), /Security assertion failed/);
});
