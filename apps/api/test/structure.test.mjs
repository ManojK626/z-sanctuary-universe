import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('api server entry exists', async () => {
  const serverPath = path.join(__dirname, '..', 'src', 'server.js');
  const info = await stat(serverPath);
  assert.ok(info.isFile(), 'expected src/server.js to exist');
});

test('api exposes a health route', async () => {
  const serverPath = path.join(__dirname, '..', 'src', 'server.js');
  const raw = await readFile(serverPath, 'utf-8');
  assert.ok(raw.includes('\'/health\'') || raw.includes('"/health"'), 'expected /health route definition');
});

test('api health endpoint responds', async () => {
  process.env.NODE_ENV = 'test';
  const { createApp, verifyEnvironment } = await import('../src/server.js');
  verifyEnvironment();
  const app = await createApp();
  const server = app.listen(0);
  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}/health`);
  const json = await res.json();
  server.close();
  assert.equal(json.status, 'ok');
  assert.equal(typeof json.env, 'string');
  assert.equal(typeof json.timestamp, 'number');
});

const require = createRequire(import.meta.url);
let Ajv = null;
try {
  Ajv = require('ajv');
} catch {
  Ajv = null;
}

test('api health response matches schema', { skip: !Ajv }, async () => {
  process.env.NODE_ENV = 'test';
  const { createApp, verifyEnvironment } = await import('../src/server.js');
  verifyEnvironment();
  const app = await createApp();
  const server = app.listen(0);
  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}/health`);
  const json = await res.json();
  server.close();

  const ajv = new Ajv();
  const schema = {
    type: 'object',
    required: ['status', 'env', 'timestamp'],
    properties: {
      status: { type: 'string' },
      env: { type: 'string' },
      timestamp: { type: 'number' }
    },
    additionalProperties: true
  };
  const validate = ajv.compile(schema);
  const ok = validate(json);
  assert.ok(ok, `schema validation failed: ${JSON.stringify(validate.errors)}`);
});

test('api POST /api/mirrorsoul returns entry + zes', async () => {
  process.env.NODE_ENV = 'test';
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'api-mirrorsoul-'));
  const prev = process.env.Z_SANCTUARY_HUB_ROOT;
  process.env.Z_SANCTUARY_HUB_ROOT = tmp;
  await mkdir(path.join(tmp, 'data', 'reports'), { recursive: true });
  try {
    const { createApp, verifyEnvironment } = await import('../src/server.js');
    verifyEnvironment();
    const app = await createApp();
    const server = app.listen(0);
    const { port } = server.address();
    const res = await fetch(`http://127.0.0.1:${port}/api/mirrorsoul`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'grateful and a little tired', user_id: 'test-user' }),
    });
    const json = await res.json();
    server.close();
    assert.equal(res.status, 200, JSON.stringify(json));
    assert.ok(json.entry_id);
    assert.ok(json.ai_reflection);
    assert.ok(json.zes && typeof json.zes.trust_score === 'number');
  } finally {
    if (prev === undefined) delete process.env.Z_SANCTUARY_HUB_ROOT;
    else process.env.Z_SANCTUARY_HUB_ROOT = prev;
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test('api v2 POST /api/mirrorsoul/entry and /api/mirrorsoul/reflect', async () => {
  process.env.NODE_ENV = 'test';
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'api-ms-v2-'));
  const prev = process.env.Z_SANCTUARY_HUB_ROOT;
  process.env.Z_SANCTUARY_HUB_ROOT = tmp;
  await mkdir(path.join(tmp, 'data', 'reports'), { recursive: true });
  try {
    const { createApp, verifyEnvironment } = await import('../src/server.js');
    verifyEnvironment();
    const app = await createApp();
    const server = app.listen(0);
    const { port } = server.address();
    const b = { user_id: 't2', text: 'I feel stuck and excited' };
    const e = await fetch(`http://127.0.0.1:${port}/api/mirrorsoul/entry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(b),
    });
    const ej = await e.json();
    assert.equal(e.status, 200, JSON.stringify(ej));
    assert.ok(ej.id);
    const r = await fetch(`http://127.0.0.1:${port}/api/mirrorsoul/reflect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(b),
    });
    const rj = await r.json();
    assert.equal(r.status, 200, JSON.stringify(rj));
    assert.ok(rj.reflection);
    assert.ok(typeof rj.confidence === 'number');
    assert.ok(rj.prediction_id && rj.prediction_id.startsWith('pred_ms_'));
    assert.ok(typeof rj.reflection_id === 'number');
    assert.equal(rj.validation_status, 'pending');
    const v = await fetch(`http://127.0.0.1:${port}/api/mirrorsoul/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prediction_id: rj.prediction_id, user_feedback: 'accurate' }),
    });
    const vj = await v.json();
    assert.equal(v.status, 200, JSON.stringify(vj));
    assert.equal(vj.status, 'recorded');
    assert.equal(vj.prediction_id, rj.prediction_id);
    const hist = path.join(tmp, 'data', 'logs', 'z_prediction_validation_history.jsonl');
    const tail = fs.readFileSync(hist, 'utf8');
    assert.ok(tail.includes('"source":"human"') && tail.includes('accurate'));
    server.close();
  } finally {
    if (prev === undefined) delete process.env.Z_SANCTUARY_HUB_ROOT;
    else process.env.Z_SANCTUARY_HUB_ROOT = prev;
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
