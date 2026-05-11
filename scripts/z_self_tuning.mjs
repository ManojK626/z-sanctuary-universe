#!/usr/bin/env node
/**
 * Z-Self-Tuning Intelligence (STIL) — Phase 6.5
 * Aggregates z_ai_learning_log.jsonl into effectiveness stats. Advisory only.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const REPORTS = path.join(ROOT, 'data', 'reports');
const LOG = path.join(ROOT, 'data', 'logs', 'z_ai_learning_log.jsonl');
const OUT_JSON = path.join(REPORTS, 'z_self_tuning.json');
const OUT_MD = path.join(REPORTS, 'z_self_tuning.md');

function readJson(file, fb = null) {
  try {
    if (!fs.existsSync(file)) return fb;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fb;
  }
}

const DOMAIN_TO_STRATEGY = {
  signal: 'increase_signal',
  communication: 'fix_communication',
  consistency: 'resolve_consistency',
  garage: 'address_garage_pressure',
  ops: 'maintain_cadence',
};

function readJsonLines(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8');
  const rows = [];
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t) continue;
    try {
      rows.push(JSON.parse(t));
    } catch {
      /* skip */
    }
  }
  return rows;
}

function strategyKey(row) {
  const s = String(row.strategy || '').trim();
  if (s) return s;
  const d = String(row.domain || '').trim().toLowerCase();
  return DOMAIN_TO_STRATEGY[d] || d || 'unknown';
}

function main() {
  const generatedAt = new Date().toISOString();
  const coherence = readJson(path.join(REPORTS, 'z_system_coherence.json'), null);
  const signal = readJson(path.join(REPORTS, 'z_ai_signal_health.json'), null);
  const adaptive = readJson(path.join(REPORTS, 'z_adaptive_coherence.json'), null);
  const events = readJsonLines(LOG);
  const learning_cycles = events.length;

  const byStrategy = {};
  for (const row of events) {
    const key = strategyKey(row);
    if (!byStrategy[key]) {
      byStrategy[key] = { attempts: 0, successes: 0, impacts: [] };
    }
    const b = byStrategy[key];
    b.attempts += 1;
    if (row.successful === true) b.successes += 1;
    const imp = Number(row.impact_score);
    if (Number.isFinite(imp)) b.impacts.push(imp);
  }

  const effectiveness_by_strategy = {};
  for (const [key, v] of Object.entries(byStrategy)) {
    const success_rate = v.attempts ? v.successes / v.attempts : 0;
    const avg_impact =
      v.impacts.length > 0
        ? Number((v.impacts.reduce((a, x) => a + x, 0) / v.impacts.length).toFixed(1))
        : 0;
    effectiveness_by_strategy[key] = {
      attempts: v.attempts,
      success_rate: Number(success_rate.toFixed(3)),
      avg_impact,
    };
  }

  const sorted = Object.entries(effectiveness_by_strategy).sort(
    (a, b) => b[1].success_rate * b[1].avg_impact - a[1].success_rate * a[1].avg_impact
  );
  const top_strategies = sorted.slice(0, 5).map(([k]) => k);
  const low_impact = sorted
    .filter(([, v]) => v.attempts >= 2 && v.success_rate < 0.35)
    .map(([k]) => k);

  let system_learning_state = 'early_learning';
  let confidence = 'early';
  if (learning_cycles >= 40 && top_strategies.length >= 2) {
    system_learning_state = 'mature';
    confidence = 'high';
  } else if (learning_cycles >= 20) {
    system_learning_state = 'stable_learning';
    confidence = 'stable';
  } else if (learning_cycles >= 10) {
    system_learning_state = 'learning';
    confidence = 'growing';
  } else if (learning_cycles > 0) {
    confidence = 'growing';
  }

  const best = sorted[0];
  const payload = {
    generated_at: generatedAt,
    schema_version: 1,
    governance_note:
      'Learning is observational — append-only log; no auto-execution or governance override.',
    learning_log: 'data/logs/z_ai_learning_log.jsonl',
    inputs_echo: {
      coherence_score: typeof coherence?.coherence_score === 'number' ? coherence.coherence_score : null,
      coherence_status: coherence?.status ?? null,
      signal_health: signal?.signal_health ?? null,
      adaptive_top_domain: adaptive?.summary?.top_domain ?? null,
      adaptive_risk: adaptive?.prediction?.risk_level ?? null,
    },
    learning_cycles,
    effectiveness_by_strategy,
    top_strategies,
    avoid_strategies: low_impact,
    system_learning_state,
    confidence,
    best_strategy: best ? { name: best[0], ...best[1] } : null,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-Self-Tuning Intelligence (STIL)',
    '',
    `- Generated: ${generatedAt}`,
    `- Learning cycles (events): **${learning_cycles}**`,
    `- State: **${system_learning_state}** · confidence: **${confidence}**`,
    '',
    '## Top strategies (by success × impact)',
    ...(top_strategies.length ? top_strategies.map((s) => `- ${s}`) : ['- none yet — append JSONL events']),
    '',
    '## Log format (one JSON object per line)',
    'See `data/logs/z_ai_learning_log.jsonl` — fields: `timestamp`, `strategy` or `domain`, `source`, `before`, `after`, `impact_score`, `successful`.',
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(`✅ Z-Self-Tuning: ${OUT_JSON} cycles=${learning_cycles} state=${system_learning_state}`);
}

main();
