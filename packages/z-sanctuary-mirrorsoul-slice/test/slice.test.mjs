import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { processMirrorSoulEntry, getZesState, resolveHubForChildWorkspace, resolveValidationV2 } from '../index.mjs';

test('processMirrorSoulEntry writes entry and updates zes', async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ms-'));
  const entries = path.join(tmp, 'entries');
  const hubRoot = tmp;
  const out = await processMirrorSoulEntry({
    text: 'I feel hope today, tired but grateful.',
    user_id: 'u1',
    hubRoot,
    mirrorsoulDataDir: entries,
  });
  assert.ok(out.entry_id);
  assert.ok(out.ai_reflection);
  assert.ok(out.emotion_tags.length);
  assert.equal(out.zes.trust_score > 50, true);
  const zed = getZesState('u1', tmp);
  assert.equal(zed.trust_score, out.zes.trust_score);
  fs.rmSync(tmp, { recursive: true, force: true });
});

test('resolveHubForChildWorkspace finds repo when cwd is temp', () => {
  const r = resolveHubForChildWorkspace(path.join(os.tmpdir(), 'x'));
  assert.ok(typeof r === 'string');
});

test('resolveValidationV2 appends resolution', () => {
  const tmp2 = fs.mkdtempSync(path.join(os.tmpdir(), 'ms-val-'));
  const pid = 'p1';
  const logF = path.join(tmp2, 'data', 'logs', 'z_prediction_validation.jsonl');
  fs.mkdirSync(path.dirname(logF), { recursive: true });
  fs.writeFileSync(
    logF,
    JSON.stringify({ type: 'pending', id: pid, status: 'pending' }) + '\n',
    'utf8'
  );
  const o = resolveValidationV2(tmp2, { prediction_id: pid, outcome: 'divergent', notes: 'test' });
  assert.equal(o.outcome, 'divergent');
  const raw = fs.readFileSync(logF, 'utf8');
  assert.ok(raw.includes('resolution'));
  fs.rmSync(tmp2, { recursive: true, force: true });
});
