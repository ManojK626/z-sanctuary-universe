import test from 'node:test';
import assert from 'node:assert/strict';

test('GET /api/dashboard/state returns SKK/RKPK companion shape', async () => {
  const { GET } = await import('../src/app/api/dashboard/state/route.js');
  const res = await GET();
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(typeof data.mood === 'string' && data.mood.length > 0);
  assert.ok(typeof data.message === 'string');
  assert.ok(typeof data.completionPct === 'number');
  assert.ok(typeof data.skk === 'string');
  assert.ok(typeof data.rkpk === 'string');
});
