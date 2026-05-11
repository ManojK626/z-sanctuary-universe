#!/usr/bin/env node
/**
 * OMNAI core engine simulation — single tick, cartesian matrix (capped), manifest batch, or chained merge.
 * See: core/omnai/* — deterministic only; no orchestration, providers, or deploy.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { runOmnaiCoreTick } from '../core/omnai/omnai_kernel.js';
import { matrixIndexRange, decodeMatrixScenario, MATRIX_DIMENSIONS_PRODUCT } from '../core/omnai/omnai_matrix.js';
import { runOmnaiCoreChain } from '../core/omnai/omnai_chain.js';
import { worstPlanningPosture } from '../core/omnai/omnai_rollups.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const DEFAULT_SCENARIO = path.join(ROOT, 'data', 'z_omnai_core_engine_scenario_default.json');
const DEFAULT_MANIFEST = path.join(ROOT, 'data', 'examples', 'z_omnai_core_engine_scenarios.manifest.json');
const DEFAULT_CHAIN = path.join(ROOT, 'data', 'examples', 'z_omnai_core_engine_chain_demo.json');
const OUT_TICK_JSON = path.join(ROOT, 'data', 'reports', 'z_omnai_core_engine_tick_report.json');
const OUT_MATRIX_SUMMARY_JSON = path.join(ROOT, 'data', 'reports', 'z_omnai_core_engine_matrix_summary.json');
const OUT_MATRIX_FULL_JSON = path.join(ROOT, 'data', 'reports', 'z_omnai_core_engine_matrix_report.full.json');
const OUT_CHAIN_JSON = path.join(ROOT, 'data', 'reports', 'z_omnai_core_engine_chain_report.json');
const OUT_INDICATOR_OVERLAY_JSON = path.join(ROOT, 'data', 'reports', 'z_omnai_core_engine_indicator_overlay.json');

function parseArgs(argv) {
  const out = {
    mode: 'tick',
    scenarioPath: DEFAULT_SCENARIO,
    maxMatrix: 384,
    manifestPath: '',
    chainPath: '',
    matrix: false,
    matrixFull: false,
    manifest: false,
    chain: false,
    all: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--matrix') out.matrix = true;
    if (a === '--matrix-full') {
      out.matrix = true;
      out.matrixFull = true;
    }
    else if (a === '--manifest') {
      out.manifest = true;
      const next = argv[i + 1];
      if (next && !next.startsWith('-')) {
        out.manifestPath = path.resolve(ROOT, next);
        i++;
      } else {
        out.manifestPath = DEFAULT_MANIFEST;
      }
    } else if (a === '--chain') {
      out.chain = true;
      const next = argv[i + 1];
      if (next && !next.startsWith('-')) {
        out.chainPath = path.resolve(ROOT, next);
        i++;
      } else {
        out.chainPath = DEFAULT_CHAIN;
      }
    } else if (a === '--all') out.all = true;
    else if (a === '--max' && argv[i + 1]) {
      out.maxMatrix = Math.max(1, parseInt(argv[i + 1], 10) || 384);
      i++;
    } else if ((a === '--scenario' || a === '-s') && argv[i + 1]) {
      out.scenarioPath = path.resolve(ROOT, argv[i + 1]);
      i++;
    }
  }
  if (out.all) {
    out.matrix = true;
    out.matrixFull = false;
    out.manifest = true;
    out.manifestPath = DEFAULT_MANIFEST;
    out.chain = true;
    out.chainPath = DEFAULT_CHAIN;
    out.mode = 'all';
  } else if (out.matrix || out.manifest || out.chain) {
    out.mode = 'batch';
  }
  return out;
}

function readJsonFile(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function mdFromReport(report, scenarioRel) {
  const r = /** @type {any} */ (report);
  const lines = [
    '# OMNAI core engine tick (simulation)',
    '',
    `Scenario: \`${String(scenarioRel).replace(/\\/g, '/')}\``,
    '',
    '| Block | Summary |',
    '| --- | --- |',
    `| Ω tier | ${r?.omega?.tier} (RSI cycles ${r?.omega?.rsi_cycles}, mult ${r?.omega?.multiplier}) |`,
    `| GMB | ${r?.gmb?.posture}; clone advisory: ${(r?.gmb?.suggested_clone || []).length} brain(s) |`,
    `| Spine | ${r?.quad_spine?.route?.spine} → failsafe ${r?.quad_spine?.failsafe} |`,
    `| Pathway | ${r?.pathway?.signal} — ${r?.pathway?.note} |`,
    `| Entity | ${r?.entity_lane?.lane}: ${r?.entity_lane?.allowed ? 'allowed' : 'blocked'} (${r?.entity_lane?.reason}) |`,
    `| Ant posture | ${r?.octo_ant?.posture}; veto advisory: ${r?.octo_ant?.veto_recommended} |`,
    `| Planning rollup | ${r?.rollup?.planning_posture} |`,
    '',
    `**Note:** ${r?.rollup?.suggested_operator_note}`,
    '',
  ];
  return lines.join('\n');
}

function bumpHistogram(map, key) {
  const k = String(key ?? 'UNKNOWN');
  map[k] = (map[k] || 0) + 1;
}

/** Slim tick for summaries (avoid multi‑MB arrays). */
function slimTickPart(tick) {
  const t = /** @type {any} */ (tick);
  return {
    planning_posture: t?.rollup?.planning_posture,
    pathway_signal: t?.pathway?.signal,
    veto_recommended: t?.octo_ant?.veto_recommended,
    ant_posture: t?.octo_ant?.posture,
    spine: t?.quad_spine?.route?.spine,
    omega_tier: t?.omega?.tier,
    entity_allowed: t?.entity_lane?.allowed,
    gmb_posture: t?.gmb?.posture,
  };
}

function worstHistogramPosture(runList) {
  let w = 'GREEN';
  for (const row of runList) {
    const tk = /** @type {any} */ (row).tick;
    if (tk?.rollup?.planning_posture) w = worstPlanningPosture(w, tk.rollup.planning_posture);
  }
  return w;
}

/**
 * @param {{
 *   tick_posture?: string|null,
 *   chain_final?: string|null,
 *   manifest_worst?: string|null,
 *   matrix_executions?: number,
 *   matrix_red_fraction?: number|null,
 * }} ctx
 */
function buildIndicatorOverlay(ctx) {
  let signal = 'UNKNOWN';
  const parts = [ctx.tick_posture, ctx.chain_final, ctx.manifest_worst].filter(Boolean);
  for (const p of parts) {
    signal = signal === 'UNKNOWN' ? String(p).toUpperCase() : worstPlanningPosture(signal, p);
  }
  const mrf = ctx.matrix_red_fraction;
  if (mrf != null && mrf >= 0.42 && signal !== 'RED') {
    signal = worstPlanningPosture(signal === 'UNKNOWN' ? 'GREEN' : signal, 'YELLOW');
  }
  if (signal === 'UNKNOWN') {
    if (ctx.matrix_executions > 0) {
      signal = mrf != null && mrf > 0.08 ? worstPlanningPosture('GREEN', 'YELLOW') : 'GREEN';
    } else if (parts.length === 0) signal = 'UNKNOWN';
  }
  return {
    schema: 'z_omnai_core_engine_indicator_overlay_v1',
    advisory_only: true,
    signal,
    basis: {
      tick_posture: ctx.tick_posture ?? null,
      chain_final_posture: ctx.chain_final ?? null,
      manifest_worst_posture: ctx.manifest_worst ?? null,
      matrix_executions: ctx.matrix_executions ?? 0,
      matrix_red_fraction: mrf ?? null,
    },
    posture_law_lines: [
      'Simulation receipts only — GREEN ≠ execution',
      'Veto advisory or ANT-RED review aligns kernel rollup to RED in strict mode',
      'High RED share across matrix harness is exploratory — indicator can lift to YELLOW for visibility',
    ],
    generated_unix_ms: Date.now(),
  };
}

/** @returns {{ runs: object[], histograms: Record<string, Record<string, number>> }} */
function runMatrix(maxCount) {
  const ids = matrixIndexRange(maxCount);
  const histograms = {
    planning_posture: {},
    pathway_signal: {},
    ant_posture: {},
    veto_recommended: {},
    spine: {},
  };

  /** @type {object[]} */
  const runs = [];
  for (const i of ids) {
    const scenario = decodeMatrixScenario(i);
    const tick = runOmnaiCoreTick(scenario);
    bumpHistogram(histograms.planning_posture, tick.rollup.planning_posture);
    bumpHistogram(histograms.pathway_signal, tick.pathway.signal);
    bumpHistogram(histograms.ant_posture, tick.octo_ant.posture);
    bumpHistogram(histograms.veto_recommended, String(tick.octo_ant.veto_recommended));
    bumpHistogram(histograms.spine, tick.quad_spine.route.spine);
    runs.push({
      matrix_index: i,
      axes: scenario.matrix_axes,
      tick,
    });
  }

  return { runs, histograms };
}

/** @param {string} manifestAbsolute */
function runManifestScenarios(manifestAbsolute) {
  const doc = readJsonFile(manifestAbsolute);
  const relPaths = Array.isArray(doc.scenarios) ? doc.scenarios : [];
  const histograms = {
    planning_posture: {},
    pathway_signal: {},
  };
  /** @type {object[]} */
  const runs = [];
  for (const rp of relPaths) {
    const abs = path.isAbsolute(String(rp)) ? String(rp) : path.resolve(ROOT, String(rp));
    const scenario = readJsonFile(abs);
    const tick = runOmnaiCoreTick(scenario);
    bumpHistogram(histograms.planning_posture, tick.rollup.planning_posture);
    bumpHistogram(histograms.pathway_signal, tick.pathway.signal);
    runs.push({
      scenario_path: path.relative(ROOT, abs),
      label: scenario.label || null,
      tick,
    });
  }
  return { runs, histograms };
}

function mdMatrixSummary(matrixReport) {
  const h = matrixReport.histograms || {};
  const lines = [
    '# OMNAI core matrix (cartesian combinations)',
    '',
    `Space size: ${matrixReport.matrix_space_total} — executions: ${matrixReport.matrix_executions}`,
    '',
    '## Histogram: planning posture',
    Object.entries(h.planning_posture || {})
      .map(([k, v]) => `- ${k}: ${v}`)
      .join('\n'),
    '',
    '## Histogram: pathway signal',
    Object.entries(h.pathway_signal || {})
      .map(([k, v]) => `- ${k}: ${v}`)
      .join('\n'),
    '',
    '## Histogram: spine',
    Object.entries(h.spine || {})
      .map(([k, v]) => `- ${k}: ${v}`)
      .join('\n'),
    '',
  ];
  return lines.join('\n');
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  ensureDir(OUT_TICK_JSON);

  /** @type {object[]} */
  const written = [];

  const overlayCtx = {
    tick_posture: /** @type {string|null} */ (null),
    chain_final: /** @type {string|null} */ (null),
    manifest_worst: /** @type {string|null} */ (null),
    matrix_executions: 0,
    matrix_red_fraction: /** @type {number|null} */ (null),
  };

  const runSingleTick =
    args.mode === 'tick' ||
    args.all ||
    (args.mode === 'batch' && !args.matrix && !args.manifest && !args.chain);

  if (runSingleTick) {
    let raw = '';
    try {
      raw = fs.readFileSync(args.scenarioPath, 'utf8');
    } catch {
      console.error(`Cannot read scenario: ${args.scenarioPath}`);
      process.exit(2);
    }
    const scenario = JSON.parse(raw);
    const tick = runOmnaiCoreTick(scenario);
    fs.writeFileSync(
      OUT_TICK_JSON,
      JSON.stringify({ ...tick, scenario_path: path.relative(ROOT, args.scenarioPath) }, null, 2),
      'utf8',
    );
    fs.writeFileSync(OUT_TICK_JSON.replace(/\.json$/, '.md'), mdFromReport(tick, path.relative(ROOT, args.scenarioPath)), 'utf8');
    written.push({ path: OUT_TICK_JSON, rollup: tick.rollup.planning_posture });
    overlayCtx.tick_posture = tick.rollup.planning_posture;
    console.log('Single tick:', tick.rollup.planning_posture);
  }

  if (args.matrix) {
    const { runs, histograms } = runMatrix(args.maxMatrix);
    const total = runs.length || 1;
    const reds = histograms.planning_posture.RED || 0;
    overlayCtx.matrix_executions = runs.length;
    overlayCtx.matrix_red_fraction = reds / total;

    const SAMPLE_CAP = 64;
    const runsSample = runs.slice(0, SAMPLE_CAP).map((r) => ({
      matrix_index: r.matrix_index,
      axes: r.axes,
      tick: slimTickPart(r.tick),
    }));

    const summaryPayload = {
      schema: 'z_omnai_core_engine_matrix_summary_v1',
      mode: 'cartesian capped',
      storage: 'histograms_and_slim_sample',
      matrix_full_available: !!args.matrixFull,
      full_report_relative: path.relative(ROOT, OUT_MATRIX_FULL_JSON),
      matrix_space_total: MATRIX_DIMENSIONS_PRODUCT,
      matrix_executions: runs.length,
      max_requested: args.maxMatrix,
      histograms,
      runs_sample: runsSample,
      runs_sample_cap: SAMPLE_CAP,
      matrix_red_fraction: overlayCtx.matrix_red_fraction,
      generated_unix_ms: Date.now(),
    };

    ensureDir(OUT_MATRIX_SUMMARY_JSON);
    fs.writeFileSync(OUT_MATRIX_SUMMARY_JSON, JSON.stringify(summaryPayload, null, 2), 'utf8');
    fs.writeFileSync(
      OUT_MATRIX_SUMMARY_JSON.replace(/\.json$/, '.md'),
      mdMatrixSummary({ ...summaryPayload, matrix_executions: runs.length }),
      'utf8',
    );
    written.push({ path: OUT_MATRIX_SUMMARY_JSON, executions: runs.length });

    if (args.matrixFull) {
      const fullPayload = {
        schema: 'z_omnai_core_engine_matrix_report_full_v1',
        matrix_space_total: MATRIX_DIMENSIONS_PRODUCT,
        matrix_executions: runs.length,
        max_requested: args.maxMatrix,
        histograms,
        runs,
        generated_unix_ms: Date.now(),
      };
      fs.writeFileSync(OUT_MATRIX_FULL_JSON, JSON.stringify(fullPayload, null, 2), 'utf8');
      written.push({ path: OUT_MATRIX_FULL_JSON });
    }

    console.log(`Matrix summary: ${runs.length} combos · slim sample (${runsSample.length}) · full ${args.matrixFull ? 'written' : 'skipped (--matrix-full)'}`);
  }

  if (args.manifest) {
    const mp = args.manifestPath || DEFAULT_MANIFEST;
    if (!mp || !fs.existsSync(mp)) {
      console.error('Manifest missing:', mp);
      process.exit(2);
    }
    const mf = runManifestScenarios(mp);
    const manifestPayload = {
      schema: 'z_omnai_core_engine_manifest_batch_v1',
      manifest: path.relative(ROOT, mp),
      count: mf.runs.length,
      histograms: mf.histograms,
      runs: mf.runs,
      generated_unix_ms: Date.now(),
    };
    const outM = path.join(ROOT, 'data', 'reports', 'z_omnai_core_engine_manifest_report.json');
    ensureDir(outM);
    fs.writeFileSync(outM, JSON.stringify(manifestPayload, null, 2), 'utf8');
    written.push({ path: outM, count: mf.runs.length });
    overlayCtx.manifest_worst = worstHistogramPosture(mf.runs);
    console.log(`Manifest scenarios: ${mf.runs.length}`);
  }

  if (args.chain) {
    const cp = args.chainPath || DEFAULT_CHAIN;
    if (!fs.existsSync(cp)) {
      console.error('Chain file missing:', cp);
      process.exit(2);
    }
    const chainDoc = readJsonFile(cp);
    const steps = chainDoc.steps;
    if (!Array.isArray(steps) || steps.length === 0) {
      console.error('Chain JSON needs non-empty steps[]');
      process.exit(2);
    }
    const seed = readJsonFile(DEFAULT_SCENARIO);
    const chainResult = runOmnaiCoreChain(seed, steps);
    chainResult.chain_source = path.relative(ROOT, cp);
    ensureDir(OUT_CHAIN_JSON);
    fs.writeFileSync(OUT_CHAIN_JSON, JSON.stringify(chainResult, null, 2), 'utf8');
    fs.writeFileSync(
      OUT_CHAIN_JSON.replace(/\.json$/, '.md'),
      [
        '# OMNAI core chain (merged steps)',
        '',
        `Source: ${path.relative(ROOT, cp)}`,
        `Steps: ${chainResult.step_count}`,
        '',
        '| Step | Rollup | Pathway | Veto advisory |',
        '| --- | --- | --- | --- |',
        ...chainResult.trace.map((/** @type {any} */ t) => {
          const tk = t.tick;
          return `| ${t.step_index} | ${tk.rollup.planning_posture} | ${tk.pathway.signal} | ${tk.octo_ant.veto_recommended} |`;
        }),
        '',
      ].join('\n'),
      'utf8',
    );
    written.push({ path: OUT_CHAIN_JSON, steps: chainResult.step_count });
    overlayCtx.chain_final = chainResult.final_rollup?.planning_posture ?? null;
    console.log(`Chain: ${chainResult.step_count} steps → ${chainResult.final_rollup?.planning_posture ?? '?'}`);
  }

  ensureDir(OUT_INDICATOR_OVERLAY_JSON);
  const indicatorOverlay = buildIndicatorOverlay(overlayCtx);
  fs.writeFileSync(OUT_INDICATOR_OVERLAY_JSON, JSON.stringify(indicatorOverlay, null, 2), 'utf8');
  console.log('Indicator overlay:', indicatorOverlay.signal, '→', path.relative(ROOT, OUT_INDICATOR_OVERLAY_JSON));

  if (args.all) {
    const rollup = {
      schema: 'z_omnai_core_engine_combo_rollup_v1',
      narrative:
        '--all: default tick + matrix summary (+ optional full via --matrix-full) + manifest + chain; indicator overlay refreshed.',
      artefacts: written,
      indicator_overlay_relative: path.relative(ROOT, OUT_INDICATOR_OVERLAY_JSON),
      generated_unix_ms: Date.now(),
    };
    const outR = path.join(ROOT, 'data', 'reports', 'z_omnai_core_engine_combo_summary.json');
    fs.writeFileSync(outR, JSON.stringify(rollup, null, 2), 'utf8');
    console.log('Combo summary:', path.relative(ROOT, outR));
  }

  process.exit(0);
}

main();
