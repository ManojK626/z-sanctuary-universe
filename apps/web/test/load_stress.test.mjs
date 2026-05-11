/**
 * Load / stress checks for Z-QOSMEI observation + DBZ import (opt-in heavy tier via env).
 * Run: `npm test` (light tier) or `Z_WEB_STRESS=1 npm test` (heavy tier).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { performance } from 'node:perf_hooks';
import { parseDbzSegmentFile } from '../src/lib/dbz_segment_import.js';
import {
  WHEEL_EU,
  droughtsAtEnd,
  perPocketCounts,
  sessionFingerprint,
} from '../src/lib/z_qosmei_observation.js';

const HEAVY = process.env.Z_WEB_STRESS === '1';
const SPIN_LINES = HEAVY ? 250_000 : 40_000;
const DROUGHT_SPINS = HEAVY ? 500_000 : 100_000;

/** Budgets (ms) — tune when CI machines change; log actual for improvisation. */
const BUDGET_DBZ_MS = HEAVY ? 120_000 : 35_000;
const BUDGET_DROUGHT_MS = HEAVY ? 60_000 : 18_000;

function makePlainSpinFile(lineCount) {
  const lines = new Array(lineCount);
  for (let i = 0; i < lineCount; i++) lines[i] = String(i % 37);
  return new File([lines.join('\n') + '\n'], `stress-${lineCount}.txt`, { type: 'text/plain' });
}

function makeUniformSpins(n) {
  const spins = new Array(n);
  for (let i = 0; i < n; i++) spins[i] = i % 37;
  return spins;
}

test(
  `stress: DBZ plain spin import (${SPIN_LINES.toLocaleString()} lines)`,
  { timeout: BUDGET_DBZ_MS + 15_000 },
  async () => {
    const file = makePlainSpinFile(SPIN_LINES);
    const t0 = performance.now();
    const r = await parseDbzSegmentFile(file, {
      prefixLines: 800,
      maxSpins: SPIN_LINES + 1,
    });
    const ms = performance.now() - t0;
    // eslint-disable-next-line no-console
    console.error(`[stress] DBZ parse ${SPIN_LINES} spins: ${ms.toFixed(0)} ms (budget ${BUDGET_DBZ_MS} ms)`);
    assert.equal(r.mode, 'spins');
    assert.equal(r.spins.length, SPIN_LINES);
    assert.ok(ms < BUDGET_DBZ_MS, `too slow: ${ms.toFixed(0)} ms`);
  }
);

test(
  `stress: observation drought + counts (${DROUGHT_SPINS.toLocaleString()} spins)`,
  { timeout: BUDGET_DROUGHT_MS + 15_000 },
  async () => {
    const spins = makeUniformSpins(DROUGHT_SPINS);
    const t0 = performance.now();
    perPocketCounts(WHEEL_EU, spins);
    droughtsAtEnd(WHEEL_EU, spins);
    sessionFingerprint(spins, 42);
    const ms = performance.now() - t0;
    // eslint-disable-next-line no-console
    console.error(
      `[stress] drought+counts+fingerprint ${DROUGHT_SPINS} spins: ${ms.toFixed(0)} ms (budget ${BUDGET_DROUGHT_MS} ms)`
    );
    assert.ok(ms < BUDGET_DROUGHT_MS, `too slow: ${ms.toFixed(0)} ms`);
  }
);

test('stress: aggregate prefix stays fast (no full-file scan)', async () => {
  const lines = [];
  lines.push('(1,p)');
  lines.push('(r,999)');
  for (let i = 0; i < 37; i++) {
    lines.push(`(${i},100)`);
  }
  const file = new File([lines.join('\n')], 'agg.txt', { type: 'text/plain' });
  const t0 = performance.now();
  const r = await parseDbzSegmentFile(file, { prefixLines: 800 });
  const ms = performance.now() - t0;
  // eslint-disable-next-line no-console
  console.error(`[stress] aggregate small file: ${ms.toFixed(1)} ms`);
  assert.equal(r.mode, 'aggregate');
  assert.ok(ms < 3000);
});
