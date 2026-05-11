import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const registryPath = resolve('data', 'z_numen_symbol_registry.json');
const bandsPath = resolve('data', 'z_numen_signal_bands.json');
const samplesPath = resolve('data', 'examples', 'z_numen_sample_inputs.json');
const reportJsonPath = resolve('data', 'reports', 'z_numen_signal_report.json');
const reportMdPath = resolve('data', 'reports', 'z_numen_signal_report.md');
const indicatorPath = resolve('dashboard', 'data', 'amk_project_indicators.json');

const requiredSymbolKeys = ['0', '3', '6', '9', '12', '13', '31', '333', '666', '999'];
const requiredBands = ['Quiet', 'Active', 'Amplified', 'Saturated'];

const forbiddenClaimChecks = [
  { substring: 'hidden control', phrase: 'hidden control proof' },
  { substring: 'secret societ', phrase: 'secret society confirmation' },
  { substring: 'supernatural', phrase: 'supernatural proof' },
  { substring: 'prediction', phrase: 'future prediction certainty' },
  { substring: 'diagnosis', phrase: 'diagnosis' },
  { substring: 'therapy', phrase: 'therapy' },
  { substring: 'psychological targeting', phrase: 'psychological targeting' },
  { substring: 'conspiracy', phrase: 'conspiracy proof' },
  { substring: 'danger by number', phrase: 'danger by number alone' }
];

const tripletKeys = ['333', '666', '999'];

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

function computeSignal(checks) {
  if (checks.red.length > 0) {
    return 'RED';
  }
  if (checks.blue.length > 0) {
    return 'BLUE';
  }
  if (checks.yellow.length > 0) {
    return 'YELLOW';
  }
  return 'GREEN';
}

function clamp01(n) {
  return Math.min(1, Math.max(0, n));
}

function countSubstring(str, sub) {
  if (!sub) {
    return 0;
  }
  let count = 0;
  let i = 0;
  while (true) {
    const idx = str.indexOf(sub, i);
    if (idx === -1) {
      break;
    }
    count += 1;
    i = idx + sub.length;
  }
  return count;
}

function bandForRepetition(r) {
  if (r <= 0.3) return 'Quiet';
  if (r <= 0.6) return 'Active';
  if (r <= 0.85) return 'Amplified';
  return 'Saturated';
}

function analyzeText(text, tripletMapping) {
  const tripletHits = {};
  let totalTriplets = 0;
  for (const key of tripletKeys) {
    const c = countSubstring(text, key);
    tripletHits[key] = c;
    totalTriplets += c;
  }
  const digits = text.replace(/\D/g, '');
  let digitRepeatPressure = 0;
  if (digits.length > 0) {
    const freq = {};
    for (const ch of digits) {
      freq[ch] = (freq[ch] ?? 0) + 1;
    }
    const maxFreq = Math.max(...Object.values(freq));
    digitRepeatPressure = maxFreq / digits.length;
  }
  const words = text.trim().split(/\s+/).filter(Boolean);
  let wordRepeatPressure = 0;
  if (words.length > 1) {
    const wfreq = {};
    for (const w of words.map((x) => x.toLowerCase())) {
      wfreq[w] = (wfreq[w] ?? 0) + 1;
    }
    const maxW = Math.max(...Object.values(wfreq));
    wordRepeatPressure = (maxW - 1) / (words.length - 1 || 1);
  }
  const R = clamp01(totalTriplets * 0.12 + digitRepeatPressure * 0.4 + wordRepeatPressure * 0.25);
  const band = bandForRepetition(R);
  const tripletSummaries = [];
  for (const key of tripletKeys) {
    if (tripletHits[key] > 0) {
      const mapped = tripletMapping[key] ?? 'triplet (literacy label)';
      tripletSummaries.push(`${key}x${tripletHits[key]} (${mapped})`);
    }
  }
  const grounding = 'Zero Core grounding: breathe, widen view, remember this is a perception pattern, not proof of hidden control.';
  const safe_interpretation =
    tripletSummaries.length > 0
      ? `Pattern literacy: salient repeats (${tripletSummaries.join('; ')}). ${grounding}`
      : `Low triplet salience in this snippet. ${grounding}`;

  return {
    repetition_intensity_R: Number(R.toFixed(3)),
    band,
    tripletHits,
    safe_interpretation,
    zero_core_statement: 'This is a perception pattern, not proof of hidden control.'
  };
}

function forbiddenClaimRedFlags(registry, bands) {
  const candidates = [...asArray(registry.allowed_claims), ...asArray(bands.allowed_claims), ...asArray(registry.approved_phrases)];
  const issues = [];
  for (const item of candidates) {
    const low = String(item).toLowerCase();
    for (const { substring, phrase } of forbiddenClaimChecks) {
      if (low.includes(substring)) {
        issues.push(`Forbidden framing appears inside allow-listed phrases: ${phrase}`);
      }
    }
  }
  return issues;
}

function validateSamplesForBlue(samplesDoc, checks) {
  const samples = asArray(samplesDoc.samples);
  const blueTriggers = [];
  for (const s of samples) {
    const flags = s.flags ?? {};
    if (flags.request_public_deploy || flags.deploy || flags.deployment) {
      blueTriggers.push(`Sample ${s.id}: requests deployment/public release.`);
    }
    if (flags.request_user_profiling || flags.profiling) {
      blueTriggers.push(`Sample ${s.id}: requests user profiling.`);
    }
    if (flags.social_scraping || flags.scrape || flags.scraping) {
      blueTriggers.push(`Sample ${s.id}: requests scraping.`);
    }
    if (flags.psychological_targeting) {
      blueTriggers.push(`Sample ${s.id}: requests psychological targeting.`);
    }
    const blob = `${s.label ?? ''} ${s.text ?? ''}`.toLowerCase();
    if (blob.includes('deploy to production') || blob.includes('public release now')) {
      blueTriggers.push(`Sample ${s.id}: textual deploy/public-release cue.`);
    }
  }
  if (samplesDoc.phase_1_requires_profiling === true) {
    blueTriggers.push('Sample manifest marks profiling required.');
  }
  for (const msg of blueTriggers) {
    checks.blue.push(msg);
  }
}

function validateRegistryOperationalBlue(registry, checks) {
  if (registry.enable_profiling === true || registry.public_deployment === true) {
    checks.blue.push('Registry requests profiling or public deployment flags.');
  }
}

function buildMarkdown(report) {
  const lines = [
    '# Z-NUMEN Signal Report',
    '',
    `- Signal: ${report.signal}`,
    `- Module: ${report.module_id}`,
    `- Mode: ${report.mode}`,
    `- Timestamp: ${report.generated_at}`,
    '',
    '## Checks',
    ''
  ];
  for (const check of report.checks.passed) {
    lines.push(`- PASS: ${check}`);
  }
  for (const check of report.checks.yellow) {
    lines.push(`- YELLOW: ${check}`);
  }
  for (const check of report.checks.blue) {
    lines.push(`- BLUE: ${check}`);
  }
  for (const check of report.checks.red) {
    lines.push(`- RED: ${check}`);
  }
  lines.push('');
  lines.push('## Sample interpretations (educational)');
  lines.push('');
  for (const row of report.sample_results ?? []) {
    lines.push(`### ${row.id}`);
    lines.push('');
    lines.push(`- R (local repetition intensity): ${row.repetition_intensity_R}`);
    lines.push(`- Band: ${row.band}`);
    lines.push(`- Interpretation: ${row.safe_interpretation}`);
    lines.push('');
  }
  lines.push('## Locked law');
  lines.push('');
  lines.push('- Z-NUMEN teaches patterns; it does not exploit patterns.');
  lines.push('- Pattern awareness ≠ conspiracy proof.');
  lines.push('- Symbolic geometry ≠ supernatural evidence.');
  lines.push('- Signal score ≠ danger.');
  lines.push('- Repetition ≠ destiny.');
  lines.push('- GREEN ≠ deploy.');
  lines.push('- BLUE requires AMK.');
  lines.push('- RED blocks movement.');
  return `${lines.join('\n')}\n`;
}

async function syncIndicator(signal) {
  try {
    const indicatorDoc = await readJson(indicatorPath);
    const indicators = asArray(indicatorDoc.indicators);
    const index = indicators.findIndex((item) => item.id === 'z_numen_cognitive_geometry');
    if (index >= 0) {
      indicators[index].signal = signal;
      indicatorDoc.indicators = indicators;
      await writeFile(indicatorPath, `${JSON.stringify(indicatorDoc, null, 2)}\n`, 'utf8');
    }
  } catch {
    // optional
  }
}

async function main() {
  const registry = await readJson(registryPath);
  const bands = await readJson(bandsPath);
  const samplesDoc = await readJson(samplesPath);
  const checks = { passed: [], yellow: [], blue: [], red: [] };

  if (registry.mode === 'educational_pattern_literacy') {
    checks.passed.push('Mode is educational pattern literacy.');
  } else {
    checks.red.push('Mode must be educational_pattern_literacy.');
  }

  const symbols = registry.core_symbols ?? {};
  const symbolKeys = Object.keys(symbols);
  const missingSymbols = requiredSymbolKeys.filter((k) => !symbolKeys.includes(k));
  if (missingSymbols.length === 0) {
    checks.passed.push('Core symbol keys are complete.');
  } else {
    checks.red.push(`Missing core symbol keys: ${missingSymbols.join(', ')}.`);
  }

  const bandList = asArray(bands.bands);
  const bandNames = bandList.map((b) => b.name);
  const missingBands = requiredBands.filter((n) => !bandNames.includes(n));
  if (missingBands.length === 0) {
    checks.passed.push('Signal bands are present.');
  } else {
    checks.red.push(`Missing signal bands: ${missingBands.join(', ')}.`);
  }

  const tripletMap = bands.triplet_mapping ?? {};
  const missingTriplet = tripletKeys.filter((k) => !(k in tripletMap));
  if (missingTriplet.length === 0) {
    checks.passed.push('Triplet mapping includes 333/666/999.');
  } else {
    checks.red.push(`Triplet mapping incomplete: ${missingTriplet.join(', ')}.`);
  }

  const formulas = registry.formulas ?? {};
  if (formulas.documentation_only === true && formulas.not_for_profiling === true) {
    checks.passed.push('Formulas marked documentation-only / not for profiling.');
  } else {
    checks.red.push('Formulas must be documentation_only and not_for_profiling.');
  }

  const forbidden = asArray(registry.forbidden_claims).map((x) => String(x).toLowerCase());
  const missingForbidden = forbiddenClaimChecks.filter((c) => !forbidden.some((f) => f.includes(c.substring)));
  if (missingForbidden.length === 0) {
    checks.passed.push('Forbidden claims cover conspiracy/supernatural/prediction/diagnosis/therapy.');
  } else {
    checks.red.push(`Forbidden claims missing: ${missingForbidden.map((m) => m.phrase).join('; ')}.`);
  }

  const redFromAllow = forbiddenClaimRedFlags(registry, bands);
  for (const msg of redFromAllow) {
    checks.red.push(msg);
  }

  validateRegistryOperationalBlue(registry, checks);
  validateSamplesForBlue(samplesDoc, checks);

  const rules = bands.safe_output_rules ?? {};
  if (asArray(rules.do_say).length === 0 || asArray(rules.do_not_say).length === 0) {
    checks.yellow.push('safe_output_rules appear thin; expand do_say/do_not_say for operators.');
  } else {
    checks.passed.push('safe_output_rules lists are populated.');
  }

  const engineMods = asArray(registry.engine_modules);
  const requiredEngines = ['ZeroCore', 'TriangleBuilder', 'TetraNetwork', 'SignalDetector', 'FlowTracker', 'VisualEngine3D', 'GuardianInterpreter'];
  const missingEngines = requiredEngines.filter((e) => !engineMods.includes(e));
  if (missingEngines.length === 0) {
    checks.passed.push('Engine module roll call is complete.');
  } else {
    checks.red.push(`Missing engine modules: ${missingEngines.join(', ')}.`);
  }

  const tripletMapping = bands.triplet_mapping ?? {};
  const sampleResults = [];
  for (const sample of asArray(samplesDoc.samples)) {
    const text = String(sample.text ?? '');
    const analysis = analyzeText(text, tripletMapping);
    sampleResults.push({
      id: sample.id,
      label: sample.label,
      ...analysis
    });
  }

  const signal = computeSignal(checks);
  const report = {
    module_id: 'z_numen_cognitive_geometry',
    signal,
    mode: registry.mode ?? 'unknown',
    generated_at: new Date().toISOString(),
    checks,
    sample_results: sampleResults,
    related_module: registry.related_module ?? 'z_logical_brains_learning_pathway'
  };

  await writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  await writeFile(reportMdPath, buildMarkdown(report), 'utf8');
  await syncIndicator(signal);

  console.log(`Z-NUMEN signal: ${signal}`);
  process.exit(signal === 'RED' ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
