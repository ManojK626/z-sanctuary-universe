import { createRequire } from 'node:module';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const {
  ObservabilityEventBuilder,
  createObservabilityEventBuilder,
  validateObservabilityEvent,
  isObservabilitySeverity,
  isObservabilityEventKind,
} = require('../dist/index.js');

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';
const VALID_TS = '2026-07-01T12:00:00.000Z';

test('valid observability event passes schema validation', () => {
  const event = {
    id: VALID_UUID,
    kind: 'log',
    timestampIso: VALID_TS,
    service: 'vile-test',
    severity: 'info',
    correlationId: 'corr-001',
    message: 'fixture ok',
  };
  const result = validateObservabilityEvent(event);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.value.service, 'vile-test');
  }
});

test('invalid schema — additional property rejected', () => {
  const event = {
    id: VALID_UUID,
    kind: 'log',
    timestampIso: VALID_TS,
    service: 'vile-test',
    severity: 'info',
    extraField: 'not allowed',
  };
  const result = validateObservabilityEvent(event);
  assert.equal(result.ok, false);
});

test('missing required field fails validation', () => {
  const event = {
    id: VALID_UUID,
    kind: 'log',
    timestampIso: VALID_TS,
    service: 'vile-test',
  };
  const result = validateObservabilityEvent(event);
  assert.equal(result.ok, false);
});

test('invalid severity fails validation', () => {
  const event = {
    id: VALID_UUID,
    kind: 'log',
    timestampIso: VALID_TS,
    service: 'vile-test',
    severity: 'fatal',
  };
  const result = validateObservabilityEvent(event);
  assert.equal(result.ok, false);
  assert.equal(isObservabilitySeverity('fatal'), false);
});

test('invalid timestamp fails validation', () => {
  const event = {
    id: VALID_UUID,
    kind: 'log',
    timestampIso: 'not-a-date',
    service: 'vile-test',
    severity: 'info',
  };
  const result = validateObservabilityEvent(event);
  assert.equal(result.ok, false);
});

test('builder output is valid and includes correlation id', () => {
  const built = createObservabilityEventBuilder('vile-api', 'metric', 'warn')
    .withCorrelationId('corr-builder-1')
    .withMetric({ name: 'requests_total', value: 1, unit: 'count' })
    .withAttributes({ region: 'MU' })
    .build();

  assert.equal(built.kind, 'metric');
  assert.equal(built.correlationId, 'corr-builder-1');
  assert.equal(built.metric?.name, 'requests_total');

  const validated = validateObservabilityEvent(built);
  assert.equal(validated.ok, true);
});

test('ObservabilityEventBuilder rejects invalid timestamp at build time', () => {
  const builder = new ObservabilityEventBuilder({
    service: 'vile-test',
    kind: 'health',
    severity: 'debug',
    id: VALID_UUID,
    timestampIso: 'invalid-ts',
  });
  assert.throws(() => builder.build(), /Invalid timestampIso/);
});

test('event kind guard matches canonical enum', () => {
  assert.equal(isObservabilityEventKind('audit'), true);
  assert.equal(isObservabilityEventKind('unknown'), false);
});
