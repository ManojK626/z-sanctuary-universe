/**
 * Z-QOSMEI observation layer — pure stats for spin history (research / journaling).
 * European: pockets 0–36. American: 0–36 plus 00, encoded as pocket 37 internally.
 */

export const WHEEL_EU = 'eu';
export const WHEEL_US = 'us';

/** @param {'eu'|'us'} wheel */
export function pocketCount(wheel) {
  return wheel === WHEEL_US ? 38 : 37;
}

/** @param {'eu'|'us'} wheel */
export function allPocketIndices(wheel) {
  const n = pocketCount(wheel);
  return Array.from({ length: n }, (_, i) => i);
}

/**
 * @param {'eu'|'us'} wheel
 * @param {number} p
 */
export function isValidPocket(wheel, p) {
  if (!Number.isInteger(p)) return false;
  if (wheel === WHEEL_EU) return p >= 0 && p <= 36;
  return (p >= 0 && p <= 36) || p === 37;
}

/**
 * @param {number} p
 * @returns {string}
 */
export function formatPocketLabel(p) {
  if (p === 37) return '00';
  return String(p);
}

/**
 * @param {'eu'|'us'} wheel
 * @param {number[]} spins
 * @returns {{ ok: true } | { ok: false, index: number, value: number }}
 */
export function validateSpins(wheel, spins) {
  for (let i = 0; i < spins.length; i++) {
    const v = spins[i];
    if (!isValidPocket(wheel, v)) {
      return { ok: false, index: i, value: v };
    }
  }
  return { ok: true };
}

/**
 * @param {number} x
 * @returns {number}
 */
export function clampNonNegative(x) {
  if (Number.isNaN(x) || x < 0) return 0;
  return x;
}

/** p: +1 / -1 step on a score (clamped). */
export function stepPlusMinus(score, delta) {
  return clampNonNegative(score + delta);
}

/** m: ×2 then clamp */
export function stepMultiply(score) {
  return clampNonNegative(score * 2);
}

/** d: ÷2 (half-units floored) then clamp */
export function stepDivide(score) {
  return clampNonNegative(Math.floor(score / 2));
}

/**
 * Occurrence counts per pocket index.
 * @param {'eu'|'us'} wheel
 * @param {number[]} spins
 */
export function perPocketCounts(wheel, spins) {
  const n = pocketCount(wheel);
  const counts = new Array(n).fill(0);
  for (const s of spins) {
    if (s >= 0 && s < n) counts[s]++;
  }
  return counts;
}

/**
 * Spins since last hit per pocket (current drought at end of stream).
 * If never hit, drought === spins.length.
 * @param {'eu'|'us'} wheel
 * @param {number[]} spins
 */
export function droughtsAtEnd(wheel, spins) {
  const n = pocketCount(wheel);
  const last = new Array(n).fill(-1);
  for (let i = 0; i < spins.length; i++) {
    const s = spins[i];
    if (s >= 0 && s < n) last[s] = i;
  }
  const len = spins.length;
  const out = new Array(n);
  for (let p = 0; p < n; p++) {
    out[p] = last[p] < 0 ? len : len - 1 - last[p];
  }
  return out;
}

/**
 * Max consecutive hits of the same pocket in history.
 * @param {'eu'|'us'} wheel
 * @param {number[]} spins
 */
export function maxRunLengthPerPocket(wheel, spins) {
  const n = pocketCount(wheel);
  const maxRun = new Array(n).fill(0);
  if (!spins.length) return maxRun;
  let cur = spins[0];
  let run = 1;
  maxRun[cur] = 1;
  for (let i = 1; i < spins.length; i++) {
    const s = spins[i];
    if (s === cur) {
      run++;
      if (s >= 0 && s < n) maxRun[s] = Math.max(maxRun[s], run);
    } else {
      cur = s;
      run = 1;
      if (s >= 0 && s < n) maxRun[s] = Math.max(maxRun[s], 1);
    }
  }
  return maxRun;
}

/**
 * Gap until next occurrence of the same pocket (recurrence gaps), last K gaps recorded per pocket.
 * "Is equal to" distance: spins between two hits of pocket p (exclusive of endpoints is one convention).
 * Here: if hits at i and j, gap = j - i - 1 (spins strictly between).
 * @param {'eu'|'us'} wheel
 * @param {number[]} spins
 * @param {number} [maxGaps=5]
 */
export function lastRecurrenceGaps(wheel, spins, maxGaps = 5) {
  const n = pocketCount(wheel);
  const lastIdx = new Array(n).fill(-1);
  /** @type {number[][]} */
  const gaps = Array.from({ length: n }, () => []);
  for (let i = 0; i < spins.length; i++) {
    const s = spins[i];
    if (s < 0 || s >= n) continue;
    if (lastIdx[s] >= 0) {
      const g = i - lastIdx[s] - 1;
      gaps[s].unshift(g);
      if (gaps[s].length > maxGaps) gaps[s].length = maxGaps;
    }
    lastIdx[s] = i;
  }
  return gaps;
}

/**
 * Simple mulberry32 PRNG for reproducible demo streams.
 * @param {number} seed
 */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * @param {'eu'|'us'} wheel
 * @param {number} length
 * @param {number} seed
 */
export function generateDemoSpins(wheel, length, seed) {
  const rand = mulberry32(seed);
  const max = pocketCount(wheel);
  const spins = [];
  for (let i = 0; i < length; i++) {
    spins.push(Math.floor(rand() * max));
  }
  return spins;
}

/** Reproducible 0–1 fingerprint for a stream + seed (not cryptographic). */
export function sessionFingerprint(spins, seed) {
  let h = seed >>> 0;
  const n = spins.length;
  h = (Math.imul(h, 17) ^ n) >>> 0;
  for (let i = 0; i < Math.min(n, 96); i++) {
    h = (Math.imul(h, 31) ^ spins[i]) >>> 0;
  }
  return (h % 10001) / 10000;
}

/**
 * @param {number[]} droughts
 * @param {number} cap e.g. 48 for LPBS window display
 */
export function capDroughtReport(droughts, cap) {
  return droughts.map((d) => Math.min(d, cap));
}
