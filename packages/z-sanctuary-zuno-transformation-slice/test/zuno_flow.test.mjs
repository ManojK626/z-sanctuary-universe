import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import {
  createSession,
  getSessionView,
  advance,
  postAnxiety,
  scoreAnxietyResponses,
} from '../zuno_transformation_core.mjs';

const tmp = path.join(os.tmpdir(), 'zuno-flow-test-' + Date.now());
fs.mkdirSync(path.join(tmp, 'data', 'reports'), { recursive: true });

test('anxiety scoring and band', () => {
  const s = scoreAnxietyResponses({ g1: 0, g2: 0, g3: 0, g4: 0, g5: 0, g6: 0, g7: 0 });
  assert.equal(s.sum, 0);
  assert.equal(s.band.band, 'low');
  const s2 = scoreAnxietyResponses({ g1: 3, g2: 3, g3: 3, g4: 2, g5: 1, g6: 0, g7: 0 });
  assert(s2.sum > 0);
});

test('session advance through anxiety', () => {
  const a = createSession(tmp, { user_id: 't' });
  assert(a.sessionId);
  let v = getSessionView(tmp, a.sessionId);
  assert(v.currentPhase);
  for (let i = 0; i < 3; i++) {
    v = advance(tmp, a.sessionId);
  }
  assert.equal(v.currentPhase.id, 'anxiety_profile_scientific');
  const v2 = postAnxiety(tmp, a.sessionId, {
    g1: 0,
    g2: 1,
    g3: 0,
    g4: 0,
    g5: 0,
    g6: 0,
    g7: 0,
  });
  assert.equal(typeof v2.anxiety.sum, 'number');
  const v3 = advance(tmp, a.sessionId);
  assert.equal(v3.currentPhase.id, 'diagnostic');
});
