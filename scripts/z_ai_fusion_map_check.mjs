import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const registryPath = resolve('data', 'z_ai_fusion_capability_registry.json');
const samplesPath = resolve('data', 'examples', 'z_ai_fusion_capability_samples.json');
const reportJsonPath = resolve('data', 'reports', 'z_ai_fusion_map_report.json');
const reportMdPath = resolve('data', 'reports', 'z_ai_fusion_map_report.md');
const indicatorPath = resolve('dashboard', 'data', 'amk_project_indicators.json');
const packagePath = resolve('package.json');

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function tokenizeWords(text) {
  return new Set(
    String(text ?? '')
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

function jaccard(aSet, bSet) {
  if (!aSet.size && !bSet.size) return 0;
  let inter = 0;
  for (const x of aSet) if (bSet.has(x)) inter++;
  const union = aSet.size + bSet.size - inter;
  return union === 0 ? 0 : inter / union;
}

function overlapScore(capA, capB) {
  let s = 0;
  if (capA.primary_domain === capB.primary_domain) s += 0.22;
  const pur = jaccard(tokenizeWords(capA.purpose), tokenizeWords(capB.purpose));
  s += pur * 0.28;
  const outA = toArray(capA.outputs).join(' ');
  const outB = toArray(capB.outputs).join(' ');
  s += jaccard(tokenizeWords(outA), tokenizeWords(outB)) * 0.22;
  const fA = toArray(capA.forbidden_actions).join(' ');
  const fB = toArray(capB.forbidden_actions).join(' ');
  s += jaccard(tokenizeWords(fA), tokenizeWords(fB)) * 0.13;
  const cmdsA = new Set(toArray(capA.related_commands).map(String));
  const cmdsB = new Set(toArray(capB.related_commands).map(String));
  let ci = 0;
  for (const c of cmdsA) if (cmdsB.has(c)) ci++;
  if (ci > 0) s += 0.1;
  const ida = capA.dashboard_indicator_id;
  const idb = capB.dashboard_indicator_id;
  if (ida && idb && ida === idb) s += 0.2;
  return Math.min(1, s + 1e-6);
}

/** @returns {'GREEN'|'YELLOW'|'BLUE'} */
function bandFromNumericScore(score) {
  if (score <= 0.3) return 'GREEN';
  if (score <= 0.6) return 'YELLOW';
  if (score <= 0.8) return 'YELLOW';
  return 'BLUE';
}

function deriveFusionRecommendation(signal, hint, score, capA, capB, fusionTypesSet) {
  if (signal === 'RED') return 'RED_BLOCKED';
  const hNorm = hint ? String(hint).trim().toUpperCase() : '';
  if (hNorm && fusionTypesSet.has(hNorm)) return hNorm;
  if (signal === 'BLUE') return 'BLUE_AMK_REVIEW';
  if (signal === 'YELLOW') {
    if (capA.primary_domain === capB.primary_domain)
      return score > 0.45 ? 'LEAD_SUPPORT' : 'KEEP_SEPARATE';
    if (score > 0.55) return 'BLUE_AMK_REVIEW';
    return 'MERGE_DOCS_ONLY';
  }
  return 'KEEP_SEPARATE';
}

function validateRegistry(reg) {
  /** @type {{ passed: string[], advisory: string[], red: string[] }} */
  const out = { passed: [], advisory: [], red: [] };

  if (reg.schema !== 'z.ai.fusion.capability.registry.v1')
    out.red.push('schema must be z.ai.fusion.capability.registry.v1.');
  else out.passed.push('schema matches fusion registry v1.');

  if (reg.mode !== 'read_only_capability_governance')
    out.red.push('mode must be read_only_capability_governance.');
  else out.passed.push('mode is read_only_capability_governance.');

  const domainSet = new Set(toArray(reg.capability_domains).map(String));
  if (domainSet.size >= 8) out.passed.push('capability_domains populated.');
  else out.red.push('capability_domains incomplete.');

  const ftypes = toArray(reg.fusion_decision_types);
  if (ftypes.length >= 5) out.passed.push('fusion_decision_types present.');
  else out.red.push('fusion_decision_types incomplete.');

  const osr = reg.overlap_signal_rules;
  if (!osr || !osr.GREEN || !osr.BLUE || !osr.RED) out.red.push('overlap_signal_rules incomplete.');
  else out.passed.push('overlap_signal_rules present.');

  const caps = toArray(reg.ai_capabilities);
  if (caps.length < 8) out.red.push('ai_capabilities sparse.');
  else out.passed.push(`ai_capabilities count: ${caps.length}.`);

  const needCap = [
    'capability_id',
    'display_name',
    'primary_domain',
    'purpose',
    'inputs',
    'outputs',
    'allowed_actions',
    'forbidden_actions',
    'lead_status'
  ];
  const fusionHints = new Set(toArray(reg.fusion_decision_types).map(String));

  for (const c of caps) {
    const miss = needCap.filter((k) => {
      const v = c[k];
      if (v === undefined || v === null) return true;
      if (['purpose', 'display_name', 'lead_status', 'capability_id'].includes(k) && String(v).trim() === '')
        return true;
      return false;
    });
    if (miss.length) out.red.push(`capability ${c.capability_id ?? '?'} missing: ${miss.join(', ')}`);
    if (!domainSet.has(c.primary_domain)) out.red.push(`${c.capability_id}: primary_domain not in capability_domains.`);

    if (!Array.isArray(c.inputs) || c.inputs.length === 0) out.advisory.push(`${c.capability_id}: inputs array empty.`);

    const outs = toArray(c.outputs);
    const hasOutDocs = outs.length > 0 || toArray(c.related_reports).length > 0;
    if (!hasOutDocs) out.advisory.push(`${c.capability_id}: clarify outputs vs related_reports.`);

    const forb = toArray(c.forbidden_actions);
    if (forb.length === 0) out.advisory.push(`${c.capability_id}: forbidden_actions empty — deliberate?`);

    const ls = ['lead', 'support', 'reference_only', 'unknown'].includes(String(c.lead_status));

    if (!ls)
      out.red.push(`${c.capability_id}: invalid lead_status ${c.lead_status}`);
  }

  const idsFound = caps.map((c) => String(c.capability_id));
  if (new Set(idsFound).size !== idsFound.length) out.red.push('duplicate capability_id in registry.');

  return { ...out, caps, domainSet };
}

function capabilityMap(caps) {
  const m = new Map();
  for (const c of caps) m.set(String(c.capability_id), c);
  return m;
}

async function loadIndicators() {
  try {
    const doc = JSON.parse(await readFile(indicatorPath, 'utf8'));
    const ids = new Set(toArray(doc.indicators).map((r) => String(r.id ?? '')));
    return { ids, ok: true };
  } catch (e) {
    return { ids: new Set(), ok: false, err: String(e.message) };
  }
}

function signalRankOrder(sig) {
  const s = String(sig || '').toUpperCase();
  if (s === 'RED') return 0;
  if (s === 'BLUE') return 1;
  if (s === 'YELLOW') return 2;
  if (s === 'GREEN') return 3;
  return 4;
}

function overallSignal(registryRed, sampleSignals) {
  if (registryRed.length > 0) return 'RED';
  let best = 'GREEN';
  for (const x of sampleSignals) {
    if (signalRankOrder(x) < signalRankOrder(best)) best = x;
  }
  return best;
}

function mdReport(report) {
  const lines = [
    '# Z-AI Fusion Map Report',
    '',
    `- Overall signal: **${report.signal}**`,
    `- Mode: ${report.registry_mode}`,
    `- Generated: ${report.generated_at}`,
    '- Phase 1: **no automatic merge/runtime** — recommendations only.',
    '',
    '## Hub reads',
    '',
    `- Indicator rows scanned: ${report.hub_reads.indicator_row_count}`,
    `- NPM script z:ai:fusion-map registered: **${report.hub_reads.script_present}**`,
    '',
    '## Registry validation',
    ''
  ];
  for (const x of report.registry_validation.passed) lines.push(`- PASS: ${x}`);
  for (const x of report.registry_validation.advisory) lines.push(`- ADVISORY: ${x}`);
  for (const x of report.registry_validation.red) lines.push(`- RED: ${x}`);
  lines.push('', '## Pair analyses', '');
  for (const row of report.pair_results) {
    lines.push(`### ${row.sample_id}`, '');
    lines.push(`- Pair: ${row.capability_pair.join(' + ')}`);
    lines.push(`- Overlap numeric score: **${row.overlap_numeric_score?.toFixed(3)}**`);
    lines.push(`- Band signal (score-based): ${row.numeric_band}`);
    lines.push(`- Final signal: **${row.signal}**`);
    lines.push(`- Fusion recommendation: **${row.fusion_recommended_decision}**`);
    if (row.notes?.length) lines.push(`- Notes: ${row.notes.join('; ')}`);
    lines.push('', '---', '');
  }
  lines.push('## Locked law', '');
  for (const l of report.locked_law || []) lines.push(`- ${l}`);
  return `${lines.join('\n')}\n`;
}

async function main() {
  const registry = JSON.parse(await readFile(registryPath, 'utf8'));
  const samplesDoc = JSON.parse(await readFile(samplesPath, 'utf8'));
  const pkg = JSON.parse(await readFile(packagePath, 'utf8'));

  const regVal = validateRegistry(registry);
  const fusionTypesValid = new Set(toArray(registry.fusion_decision_types).map(String));
  const cmap = capabilityMap(regVal.caps);
  const ind = await loadIndicators();

  /** @type {string[]} */
  const indicatorAdv = [];

  if (!ind.ok) indicatorAdv.push(`Indicators read skipped: ${ind.err}`);
  else {
    for (const c of regVal.caps) {
      const did = c.dashboard_indicator_id;
      if (did && !ind.ids.has(String(did)))
        indicatorAdv.push(`dashboard_indicator_id ${did} (${c.capability_id}) missing from AMK indicators JSON.`);
    }
    indicatorAdv.push(`Scanned indicator id count: ${ind.ids.size}.`);
  }

  const pair_results = [];

  const includeRed = process.env.Z_AI_FUSION_INCLUDE_RED_FIXTURE === '1';

  /** @type {object[]} */
  let pairs = toArray(samplesDoc.samples);
  if (includeRed) pairs = [...pairs, ...toArray(samplesDoc.fixture_samples_red)];

  if (pairs.length === 0)
    throw new Error('No fusion samples configured.');

  for (const s of pairs) {
    const pid = String(s.sample_id ?? '');
    const [ida, idb] = toArray(s.capability_pair).map(String);
    const notes = [];

    const capA = cmap.get(ida);
    const capB = cmap.get(idb);
    if (!capA || !capB) {
      pair_results.push({
        sample_id: pid,
        capability_pair: [ida, idb],
        signal: 'YELLOW',
        numeric_band: 'YELLOW',
        overlap_numeric_score: 0,
        fusion_recommended_decision: 'BLUE_AMK_REVIEW',
        notes: [`unknown capability reference: missing ${capA ? '' : ida} ${capB ? '' : idb}`.trim()]
      });
      continue;
    }

    const unsafe = !!(s.flags && s.flags.unsafe_overlap === true);
    const ov = overlapScore(capA, capB);
    const numericBand = bandFromNumericScore(ov);
    /** @type {string} */
    let signal;

    if (unsafe) signal = 'RED';
    else if (numericBand === 'BLUE') signal = 'BLUE';
    else if (numericBand === 'YELLOW') signal = 'YELLOW';
    else signal = 'GREEN';

    const hint = s.expected_fusion_hint;
    const fusionRec = deriveFusionRecommendation(signal, hint, ov, capA, capB, fusionTypesValid);

    /** Human-scenario escalation: hinted BLUE consolidation wins over a low numeric heuristic. */
    let finalSignal = signal;
    const hintUpper = hint ? String(hint).trim().toUpperCase() : '';
    if (!unsafe && hintUpper === 'BLUE_AMK_REVIEW' && fusionRec === 'BLUE_AMK_REVIEW') finalSignal = 'BLUE';
    notes.push(String(s.scenario_notes || ''));

    if (unsafe)
      notes.push('unsafe_overlap flag — forbids imagining merged autonomous execution across external + routing lanes.');
    notes.push(`Score band from numeric heuristic: ${numericBand}`);
    notes.push(`Registry lead statuses: ${capA.lead_status} / ${capB.lead_status}`);

    pair_results.push({
      sample_id: pid,
      capability_pair: [ida, idb],
      overlap_numeric_score: Math.round(ov * 1000) / 1000,
      numeric_band: numericBand,
      signal: finalSignal,
      fusion_recommended_decision: fusionRec,
      notes: notes.filter(Boolean),
      overlap_score_bands_ref: registry.overlap_score_bands_doc || []
    });
  }

  const signal = overallSignal(regVal.red, pair_results.map((p) => p.signal));

  const script_present = !!(pkg.scripts && pkg.scripts['z:ai:fusion-map']);

  const report = {
    schema: 'z.ai.fusion.map.report.v1',
    module_id: 'z_ai_fusion_capability_map',
    signal,
    registry_mode: registry.mode,
    generated_at: new Date().toISOString(),
    phase: 'Z-AI-FUSION-MAP-1',
    auto_runtime_merge_applied: false,
    fixtures_red_included: includeRed,
    registry_validation: {
      passed: regVal.passed,
      advisory: [...regVal.advisory, ...indicatorAdv],
      red: regVal.red
    },
    hub_reads: {
      indicator_row_count: ind.ids?.size ?? 0,
      script_present
    },
    pair_results,
    fusion_decision_types: registry.fusion_decision_types,
    locked_law: registry.locked_law || []
  };

  await mkdir(dirname(reportJsonPath), { recursive: true });
  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(reportMdPath, mdReport(report), 'utf8');

  console.log(`Z-AI Fusion Map signal: ${signal}`);
  process.exit(signal === 'RED' ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
