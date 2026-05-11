import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDbzSegmentFile } from '../src/lib/dbz_segment_import.js';
import { WHEEL_EU, WHEEL_US } from '../src/lib/z_qosmei_observation.js';

test('aggregate: DBZ-style prefix with full pocket block', async () => {
  const text = `(10,p)
(20,a)
(5,m)
(8,d)
(9,l)
(r,100)
(0,50)
(1,50)
(2,50)
(3,50)
(4,50)
(5,50)
(6,50)
(7,50)
(8,50)
(9,50)
(10,50)
(11,50)
(12,50)
(13,50)
(14,50)
(15,50)
(16,50)
(17,50)
(18,50)
(19,50)
(20,50)
(21,50)
(22,50)
(23,50)
(24,50)
(25,50)
(26,50)
(27,50)
(28,50)
(29,50)
(30,50)
(31,50)
(32,50)
(33,50)
(34,50)
(35,50)
(36,50)
`;
  const file = new File([text], 'seg.txt', { type: 'text/plain' });
  const r = await parseDbzSegmentFile(file, { prefixLines: 200 });
  assert.equal(r.mode, 'aggregate');
  assert.equal(r.wheel, WHEEL_EU);
  assert.equal(r.pocketCounts[3], 50);
  assert.equal(r.rValue, 100);
});

test('spins: plain list file', async () => {
  const lines = [];
  for (let i = 0; i < 120; i++) lines.push(String(i % 37));
  const file = new File([lines.join('\n')], 'spins.txt', { type: 'text/plain' });
  const r = await parseDbzSegmentFile(file, { prefixLines: 400 });
  assert.equal(r.mode, 'spins');
  assert.equal(r.wheel, WHEEL_EU);
  assert.equal(r.spins.length, 120);
  assert.equal(r.spins[0], 0);
});

test('american 00 in spin list', async () => {
  const file = new File(['00\n12\n37\n'], 'x.txt', { type: 'text/plain' });
  const r = await parseDbzSegmentFile(file, { prefixLines: 50 });
  assert.equal(r.mode, 'spins');
  assert.equal(r.wheel, WHEEL_US);
  assert.ok(r.spins.includes(37));
});
