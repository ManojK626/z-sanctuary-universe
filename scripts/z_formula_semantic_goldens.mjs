#!/usr/bin/env node
/**
 * Z-SANCTUARY-FORMULA-SEMANTIC-GOLDENS-1
 * Permanent regression: canonical input → expected semantic → engine → assert.
 * Does not change formula mathematics. Does not merge Ultra Ω with OMNAI omega.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const GGAESP_GOLDENS = path.join(
  ROOT,
  'data/formula_semantic_goldens/ggaesp_v11_v19_goldens.json'
);
const OMNAI_GOLDENS = path.join(
  ROOT,
  'data/formula_semantic_goldens/omnai_omega_rsi_goldens.json'
);

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function pickGgaespSemantic(result) {
  return {
    decision: result.decision,
    polarity: result.polarity,
    metaScore: result.metaScore,
    confidence: result.confidence,
    energyMode: result.energyMode,
  };
}

function normalizeOmegaExpect(expect) {
  const out = { ...expect };
  if (out.multiplier === 'Infinity') out.multiplier = Number.POSITIVE_INFINITY;
  return out;
}

function normalizeOmegaActual(actual) {
  if (actual && typeof actual === 'object') return { ...actual };
  return actual;
}

async function runGgaespGoldens() {
  const pack = JSON.parse(fs.readFileSync(GGAESP_GOLDENS, 'utf8'));
  const { runGGAESP } = await import(
    pathToFileURL(path.join(ROOT, 'core_engine/browser/ggaesp_pipeline.js')).href
  );
  const results = [];
  for (const v of pack.vectors) {
    const runs = [1, 2, 3].map(() =>
      pickGgaespSemantic(
        runGGAESP({
          moduleId: v.moduleId,
          data: v.data,
          humanState: v.humanState,
        })
      )
    );
    const deterministic =
      deepEqual(runs[0], runs[1]) && deepEqual(runs[1], runs[2]);
    const match = deepEqual(runs[0], v.expect);
    results.push({
      id: v.id,
      lineage: pack.lineage,
      pass: match && deterministic,
      match,
      deterministic,
      expected: v.expect,
      actual: runs[0],
    });
  }
  return { pack_id: path.basename(GGAESP_GOLDENS), lineage: pack.lineage, results };
}

async function runOmnaiGoldens() {
  const pack = JSON.parse(fs.readFileSync(OMNAI_GOLDENS, 'utf8'));
  const mod = await import(
    pathToFileURL(path.join(ROOT, 'core/omnai/omega_formula.js')).href
  );
  const results = [];
  for (const v of pack.vectors) {
    const fn = mod[v.fn];
    if (typeof fn !== 'function') {
      results.push({
        id: v.id,
        lineage: pack.lineage,
        pass: false,
        error: `missing fn ${v.fn}`,
      });
      continue;
    }
    const runs = [1, 2, 3].map(() => {
      const raw = fn(...v.args);
      if (v.fn === 'rsiStep') return { value: raw };
      return normalizeOmegaActual(raw);
    });
    const expect = normalizeOmegaExpect(v.expect);
    const deterministic =
      deepEqual(
        JSON.parse(JSON.stringify(runs[0], (_k, val) => (val === Infinity ? 'Infinity' : val))),
        JSON.parse(JSON.stringify(runs[1], (_k, val) => (val === Infinity ? 'Infinity' : val)))
      ) &&
      deepEqual(
        JSON.parse(JSON.stringify(runs[1], (_k, val) => (val === Infinity ? 'Infinity' : val))),
        JSON.parse(JSON.stringify(runs[2], (_k, val) => (val === Infinity ? 'Infinity' : val)))
      );
    let match = false;
    if (v.fn === 'rsiStep') {
      match = Object.is(runs[0].value, expect.value);
    } else {
      match =
        runs[0].tier_key === expect.tier_key &&
        runs[0].tier_index === expect.tier_index &&
        runs[0].rsi_cycles === expect.rsi_cycles &&
        Object.is(runs[0].multiplier, expect.multiplier);
    }
    results.push({
      id: v.id,
      lineage: pack.lineage,
      pass: match && deterministic,
      match,
      deterministic,
      expected: v.expect,
      actual:
        v.fn === 'rsiStep'
          ? runs[0]
          : {
              ...runs[0],
              multiplier: runs[0].multiplier === Infinity ? 'Infinity' : runs[0].multiplier,
            },
    });
  }
  return { pack_id: path.basename(OMNAI_GOLDENS), lineage: pack.lineage, results };
}

async function main() {
  const ggaesp = await runGgaespGoldens();
  const omnai = await runOmnaiGoldens();
  const all = [...ggaesp.results, ...omnai.results];
  const failed = all.filter((r) => !r.pass);
  const summary = {
    gate: 'Z-SANCTUARY-FORMULA-SEMANTIC-GOLDENS-1',
    ok: failed.length === 0,
    total: all.length,
    passed: all.filter((r) => r.pass).length,
    failed: failed.length,
    packs: [ggaesp, omnai],
    formula_semantics_changed: false,
    ultra_omega_merged: false,
    note: 'GGAESP advisory lineage and OMNAI RSI omega lineage asserted separately.',
  };
  console.log(JSON.stringify(summary, null, 2));
  if (failed.length) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
