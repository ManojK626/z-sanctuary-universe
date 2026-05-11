/**
 * DBZ-style segment import — single pass over the file stream (works in Node tests + browsers).
 */

import { WHEEL_EU, WHEEL_US, isValidPocket } from './z_qosmei_observation.js';

const PREFIX_LINES = 800;
const DEFAULT_MAX_SPINS = 250_000;
const MAX_TRIPLE_SAMPLES = 24;

/**
 * @param {File} file
 */
async function* linesOfFile(file) {
  const reader = file.stream().getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buffer.indexOf('\n')) >= 0) {
        const raw = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 1);
        yield raw.replace(/\r$/, '');
      }
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      /* ignore */
    }
  }
  if (buffer.length) yield buffer.replace(/\r$/, '');
}

function parseTuple(line) {
  const t = line.trim();
  const m = t.match(/^\(([^)]*)\)\s*$/);
  if (!m) return null;
  return m[1].split(',').map((s) => s.trim());
}

function isPlainSpinLine(line) {
  const s = line.trim();
  if (!s || s.includes('(')) return false;
  if (s === '00') return true;
  return /^\d+$/.test(s);
}

function parsePlainSpin(line) {
  const s = line.trim();
  if (s === '00') return 37;
  return Number(s);
}

function probePlainRatio(lines) {
  let n = 0;
  let plain = 0;
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    n++;
    if (isPlainSpinLine(line)) plain++;
  }
  return n ? plain / n : 0;
}

function resizePocket(arr, n) {
  const next = new Array(n).fill(0);
  for (let i = 0; i < Math.min(arr.length, n); i++) next[i] = arr[i];
  return next;
}

function parseStructuredFromLines(lines) {
  /** @type {Record<string, string>} */
  const meta = {};
  let rValue = null;
  /** @type {number[] | null} */
  let pocketCounts = null;
  let sawPocket37 = false;
  const tripleSamples = [];
  /** @type {Set<number>} */
  const seen = new Set();

  for (const line of lines) {
    const parts = parseTuple(line);
    if (!parts) continue;
    if (parts.length === 2) {
      const [a, b] = parts;
      if (b === 'p' || b === 'a' || b === 'm' || b === 'd' || b === 'l') {
        meta[b] = a;
        continue;
      }
      if (a === 'r' && /^\d+$/.test(b)) {
        rValue = Number(b);
        continue;
      }
      if (/^\d+$/.test(a) && /^\d+$/.test(b)) {
        const pi = Number(a);
        const cnt = Number(b);
        if (pi >= 0 && pi <= 36) {
          if (!pocketCounts) pocketCounts = new Array(37).fill(0);
          pocketCounts = resizePocket(pocketCounts, Math.max(37, pocketCounts.length));
          pocketCounts[pi] = cnt;
          seen.add(pi);
        } else if (pi === 37) {
          sawPocket37 = true;
          if (!pocketCounts) pocketCounts = new Array(38).fill(0);
          pocketCounts = resizePocket(pocketCounts, 38);
          pocketCounts[37] = cnt;
          seen.add(37);
        }
      }
    }
    if (
      parts.length === 3 &&
      parts.every((x) => /^\d+$/.test(x)) &&
      tripleSamples.length < MAX_TRIPLE_SAMPLES
    ) {
      tripleSamples.push({
        a: Number(parts[0]),
        b: Number(parts[1]),
        c: Number(parts[2]),
      });
    }
  }

  let complete = true;
  for (let i = 0; i < 37; i++) {
    if (!seen.has(i)) complete = false;
  }

  return { meta, rValue, pocketCounts, tripleSamples, sawPocket37, complete };
}

/**
 * @param {File} file
 * @param {{ maxSpins?: number, prefixLines?: number, onProgress?: (o: { phase: string; lines: number }) => void }} [options]
 */
export async function parseDbzSegmentFile(file, options = {}) {
  const maxSpins = options.maxSpins ?? DEFAULT_MAX_SPINS;
  const prefixLines = options.prefixLines ?? PREFIX_LINES;
  const onProgress = options.onProgress ?? (() => {});

  const warnings = [];
  /** @type {string[]} */
  const prefix = [];
  /** @type {number[]} */
  const spins = [];
  let wheel = WHEEL_EU;
  let linesRead = 0;
  let mode = /** @type {'undecided' | 'spins' | 'aggregate' | 'empty'} */ ('undecided');

  const pushSpin = (line) => {
    if (!isPlainSpinLine(line)) return;
    const v = parsePlainSpin(line);
    if (v === 37) wheel = WHEEL_US;
    if (!isValidPocket(wheel, v)) return;
    spins.push(v);
    if (spins.length % 25000 === 0) onProgress({ phase: 'spins', lines: spins.length });
  };

  const decide = (lines) => {
    const structured = parseStructuredFromLines(lines);
    const plainRatio = probePlainRatio(lines);
    const spinLikely = plainRatio >= 0.88 && !structured.complete;
    if (spinLikely) return { kind: 'spins', structured };
    if (structured.complete && structured.pocketCounts) return { kind: 'aggregate', structured };
    return { kind: 'empty', structured };
  };

  for await (const line of linesOfFile(file)) {
    linesRead++;
    if (mode === 'undecided') {
      prefix.push(line);
      if (prefix.length < prefixLines) continue;

      const d = decide(prefix);
      if (d.kind === 'spins') {
        mode = 'spins';
        for (const l of prefix) {
          pushSpin(l);
          if (spins.length >= maxSpins) break;
        }
        if (spins.length >= maxSpins) warnings.push(`Truncated at ${maxSpins.toLocaleString()} spins.`);
        onProgress({ phase: 'spins', lines: spins.length });
        continue;
      }
      if (d.kind === 'aggregate') {
        mode = 'aggregate';
        warnings.push(
          'Loaded frequency snapshot (no spin order in this export). Paste an ordered spin list for drought / LPBS.'
        );
        const w = d.structured.pocketCounts.length === 38 || d.structured.sawPocket37 ? WHEEL_US : WHEEL_EU;
        return {
          mode: 'aggregate',
          wheel: w,
          meta: d.structured.meta,
          rValue: d.structured.rValue,
          pocketCounts: d.structured.pocketCounts,
          spins: null,
          tripleSamples: d.structured.tripleSamples,
          linesRead: prefix.length,
          warnings,
        };
      }
      mode = 'empty';
      return {
        mode: 'empty',
        wheel: WHEEL_EU,
        meta: d.structured.meta,
        rValue: d.structured.rValue,
        pocketCounts: d.structured.pocketCounts,
        spins: null,
        tripleSamples: d.structured.tripleSamples,
        linesRead: prefix.length,
        warnings: [...warnings, 'No recognizable aggregate block in prefix; try increasing prefix or check format.'],
      };
    }

    if (mode === 'spins') {
      pushSpin(line);
      if (spins.length >= maxSpins) {
        warnings.push(`Truncated at ${maxSpins.toLocaleString()} spins.`);
        break;
      }
    }
  }

  if (mode === 'undecided' && prefix.length) {
    const d = decide(prefix);
    if (d.kind === 'spins') {
      for (const l of prefix) pushSpin(l);
      if (spins.some((x) => x === 37)) wheel = WHEEL_US;
      onProgress({ phase: 'spins', lines: spins.length });
      return {
        mode: spins.length ? 'spins' : 'empty',
        wheel,
        meta: d.structured.meta,
        rValue: d.structured.rValue,
        pocketCounts: null,
        spins: spins.length ? spins : null,
        tripleSamples: d.structured.tripleSamples,
        linesRead,
        warnings,
      };
    }
    if (d.kind === 'aggregate' && d.structured.pocketCounts) {
      const w = d.structured.pocketCounts.length === 38 || d.structured.sawPocket37 ? WHEEL_US : WHEEL_EU;
      warnings.push(
        'Loaded frequency snapshot (no spin order). Paste an ordered spin list for drought / LPBS.'
      );
      return {
        mode: 'aggregate',
        wheel: w,
        meta: d.structured.meta,
        rValue: d.structured.rValue,
        pocketCounts: d.structured.pocketCounts,
        spins: null,
        tripleSamples: d.structured.tripleSamples,
        linesRead: prefix.length,
        warnings,
      };
    }
    return {
      mode: 'empty',
      wheel: WHEEL_EU,
      meta: d.structured.meta,
      rValue: d.structured.rValue,
      pocketCounts: d.structured.pocketCounts,
      spins: null,
      tripleSamples: d.structured.tripleSamples,
      linesRead: prefix.length,
      warnings: [...warnings, 'Short file — no full aggregate block found.'],
    };
  }

  if (mode === 'spins') {
    if (spins.some((x) => x === 37)) wheel = WHEEL_US;
    onProgress({ phase: 'spins', lines: spins.length });
    return {
      mode: spins.length ? 'spins' : 'empty',
      wheel,
      meta: {},
      rValue: null,
      pocketCounts: null,
      spins: spins.length ? spins : null,
      tripleSamples: [],
      linesRead,
      warnings,
    };
  }

  return {
    mode: 'empty',
    wheel: WHEEL_EU,
    meta: {},
    rValue: null,
    pocketCounts: null,
    spins: null,
    tripleSamples: [],
    linesRead,
    warnings: ['Empty file.'],
  };
}
