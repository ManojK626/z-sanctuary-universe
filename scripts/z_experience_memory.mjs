#!/usr/bin/env node
/**
 * Z-Experience Memory Layer (EML) — Phase 6.6
 * Long-term pattern memory from learning log + current report echoes. Advisory only.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const REPORTS = path.join(ROOT, 'data', 'reports');
const LOG = path.join(ROOT, 'data', 'logs', 'z_ai_learning_log.jsonl');
const OUT_JSON = path.join(REPORTS, 'z_experience_memory.json');
const OUT_MD = path.join(REPORTS, 'z_experience_memory.md');

function readJson(file, fb = null) {
  try {
    if (!fs.existsSync(file)) return fb;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fb;
  }
}

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

function coherenceBucket(score) {
  const n = Number(score);
  if (!Number.isFinite(n)) return 'coherence_unknown';
  if (n < 50) return 'coherence_low';
  if (n < 65) return 'coherence_mid';
  return 'coherence_high';
}

function signalBucket(raw) {
  const s = String(raw || '').toLowerCase();
  if (s === 'low' || s === 'insufficient') return 'signal_low';
  if (s === 'medium') return 'signal_medium';
  if (s === 'high') return 'signal_high';
  return 'signal_unknown';
}

function flowBucket(raw) {
  const s = String(raw || '').toLowerCase();
  if (s === 'healthy') return 'flow_healthy';
  if (s === 'degraded') return 'flow_degraded';
  if (s === 'broken') return 'flow_broken';
  return 'flow_unknown';
}

function patternId(before) {
  if (!before || typeof before !== 'object') return 'unknown_context';
  const coh = coherenceBucket(before.coherence_score);
  const sig = signalBucket(before.signal_health);
  const flow = flowBucket(before.flow_status ?? before.communication_flow);
  return `${sig}_${coh}_${flow}`;
}

function patternLabel(id) {
  return id.replace(/_/g, ' ').replace(/\+/g, ' ');
}

function parseTs(row) {
  const t = row.timestamp || row.ts;
  if (!t) return null;
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? null : d;
}

function outcomeLabel(row) {
  const after = row.after;
  const before = row.before;
  if (after && typeof after === 'object') {
    if (after.status) return String(after.status);
    const ac = Number(after.coherence_score);
    const bc = Number(before?.coherence_score);
    if (Number.isFinite(ac) && Number.isFinite(bc)) {
      if (ac > bc + 3) return 'improved';
      if (ac < bc - 3) return 'worse';
    }
  }
  return row.successful === true ? 'success' : row.successful === false ? 'failure' : 'unknown';
}

function strategyKey(row) {
  const s = String(row.strategy || '').trim();
  if (s) return s;
  const d = String(row.domain || '').trim().toLowerCase();
  const map = {
    signal: 'increase_signal',
    communication: 'fix_communication',
    consistency: 'resolve_consistency',
    garage: 'address_garage_pressure',
    ops: 'maintain_cadence',
  };
  return map[d] || d || 'unknown';
}

function buildPatterns(rows) {
  const groups = {};
  for (const row of rows) {
    const before = row.before;
    const id = patternId(before);
    if (!groups[id]) {
      groups[id] = {
        pattern: id,
        pattern_label: patternLabel(id),
        occurrences: 0,
        coherence_scores: [],
        outcomes: [],
        timestamps: [],
      };
    }
    const g = groups[id];
    g.occurrences += 1;
    const cs = Number(before?.coherence_score);
    if (Number.isFinite(cs)) g.coherence_scores.push(cs);
    g.outcomes.push(outcomeLabel(row));
    const ts = parseTs(row);
    if (ts) g.timestamps.push(ts.getTime());
  }

  const patterns = [];
  for (const g of Object.values(groups)) {
    const avg =
      g.coherence_scores.length > 0
        ? Number(
            (g.coherence_scores.reduce((a, x) => a + x, 0) / g.coherence_scores.length).toFixed(1)
          )
        : null;
    const outcomeCounts = {};
    for (const o of g.outcomes) {
      outcomeCounts[o] = (outcomeCounts[o] || 0) + 1;
    }
    const common_outcome = Object.entries(outcomeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'unknown';
    patterns.push({
      pattern: g.pattern,
      pattern_label: g.pattern_label,
      occurrences: g.occurrences,
      avg_coherence: avg,
      common_outcome,
    });
  }
  patterns.sort((a, b) => b.occurrences - a.occurrences);
  return patterns;
}

function detectCycles(rows) {
  const byPattern = {};
  for (const row of rows) {
    const id = patternId(row.before);
    const ts = parseTs(row);
    if (!ts) continue;
    if (!byPattern[id]) byPattern[id] = [];
    byPattern[id].push(ts.getTime());
  }
  const cycles = [];
  for (const [pat, times] of Object.entries(byPattern)) {
    if (times.length < 3) continue;
    const sorted = [...new Set(times)].sort((a, b) => a - b);
    if (sorted.length < 3) continue;
    const gaps = [];
    for (let i = 1; i < sorted.length; i += 1) {
      gaps.push((sorted[i] - sorted[i - 1]) / (24 * 3600 * 1000));
    }
    if (gaps.length < 2) continue;
    const median = gaps.sort((a, b) => a - b)[Math.floor(gaps.length / 2)];
    if (median < 1 || median > 60) continue;
    const variance =
      gaps.reduce((s, g) => s + (g - median) ** 2, 0) / Math.max(gaps.length, 1);
    const spread = Math.sqrt(variance);
    const tight = spread < Math.max(median * 0.5, 2);
    if (!tight && gaps.length < 4) continue;
    const rounded = Math.max(1, Math.round(median));
    const confidence = Math.min(0.95, 0.35 + sorted.length * 0.08 + (tight ? 0.15 : 0));
    cycles.push({
      cycle: `${pat}_every_${rounded}_days_approx`,
      pattern: pat,
      median_gap_days: Number(median.toFixed(2)),
      samples: sorted.length,
      confidence: Number(confidence.toFixed(2)),
    });
  }
  cycles.sort((a, b) => b.confidence - a.confidence);
  return cycles.slice(0, 8);
}

function analyzeStrategies(rows) {
  const by = {};
  for (const row of rows) {
    const key = strategyKey(row);
    if (!by[key]) by[key] = { attempts: 0, successes: 0, impacts: [] };
    const b = by[key];
    b.attempts += 1;
    if (row.successful === true) b.successes += 1;
    const imp = Number(row.impact_score);
    if (Number.isFinite(imp)) b.impacts.push(imp);
  }
  const strategies = [];
  for (const [key, v] of Object.entries(by)) {
    const success_rate = v.attempts ? v.successes / v.attempts : 0;
    const avg_impact =
      v.impacts.length > 0
        ? Number((v.impacts.reduce((a, x) => a + x, 0) / v.impacts.length).toFixed(1))
        : 0;
    strategies.push({
      strategy: key,
      times_used: v.attempts,
      success_rate: Number(success_rate.toFixed(3)),
      avg_impact,
    });
  }
  strategies.sort((a, b) => b.times_used * b.success_rate - a.times_used * a.success_rate);
  return strategies;
}

function memoryConfidence(eventCount) {
  if (eventCount <= 3) return 'low';
  if (eventCount <= 10) return 'medium';
  return 'high';
}

function buildInsights(patterns, strategies, cycles, eventCount) {
  const insights = [];
  if (eventCount === 0) {
    insights.push('No learning log events yet — append data/logs/z_ai_learning_log.jsonl to build experience memory.');
    return insights;
  }
  const top = patterns[0];
  if (top && top.occurrences >= 1) {
    insights.push(
      `Most common pre-action context: "${top.pattern_label}" (${top.occurrences}x; avg coherence ${top.avg_coherence ?? 'n/a'}; typical outcome: ${top.common_outcome}).`
    );
  }
  const best = strategies[0];
  if (best && best.times_used > 0) {
    insights.push(
      `Strategy "${best.strategy}" used ${best.times_used}x with ${Math.round(best.success_rate * 100)}% success (avg impact ${best.avg_impact}).`
    );
  }
  if (cycles[0]) {
    insights.push(
      `Possible recurring interval for a pattern: ~${cycles[0].median_gap_days} days between events (heuristic confidence ${cycles[0].confidence}).`
    );
  }
  if (insights.length === 0) {
    insights.push('Collect more dated learning events to strengthen pattern and cycle detection.');
  }
  return insights.slice(0, 6);
}

function main() {
  const generatedAt = new Date().toISOString();
  const coherence = readJson(path.join(REPORTS, 'z_system_coherence.json'), null);
  const signal = readJson(path.join(REPORTS, 'z_ai_signal_health.json'), null);
  const adaptive = readJson(path.join(REPORTS, 'z_adaptive_coherence.json'), null);
  const rows = readJsonLines(LOG);
  const eventCount = rows.length;

  const patterns = buildPatterns(rows);
  const cycles_detected = detectCycles(rows);
  const strategies = analyzeStrategies(rows);
  const confidence = memoryConfidence(eventCount);
  const insights = buildInsights(patterns, strategies, cycles_detected, eventCount);

  const payload = {
    generated_at: generatedAt,
    schema_version: 1,
    governance_note:
      'Experience memory is observational — does not trigger actions, override ACI, or change governance.',
    learning_log: 'data/logs/z_ai_learning_log.jsonl',
    event_count: eventCount,
    confidence,
    patterns_detected: patterns.length,
    patterns,
    cycles_detected: cycles_detected.length,
    cycles: cycles_detected,
    strategies,
    insights,
    current_context: {
      coherence_score: typeof coherence?.coherence_score === 'number' ? coherence.coherence_score : null,
      coherence_status: coherence?.status ?? null,
      signal_health: signal?.signal_health ?? null,
      adaptive_risk: adaptive?.prediction?.risk_level ?? null,
      adaptive_top_action: adaptive?.summary?.top_action ?? null,
    },
    sources: {
      system_coherence: 'data/reports/z_system_coherence.json',
      signal_health: 'data/reports/z_ai_signal_health.json',
      adaptive_coherence: 'data/reports/z_adaptive_coherence.json',
    },
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const topInsight = insights[0] ?? 'n/a';
  const md = [
    '# Z-Experience Memory (EML)',
    '',
    `- Generated: ${generatedAt}`,
    `- Events in log: **${eventCount}** · memory confidence: **${String(confidence).toUpperCase()}**`,
    `- Patterns: **${patterns.length}** · cycles (heuristic): **${cycles_detected.length}**`,
    '',
    '## Top insight',
    `- ${topInsight}`,
    '',
    '## Governance',
    payload.governance_note,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(
    `✅ Z-Experience Memory: ${OUT_JSON} patterns=${patterns.length} cycles=${cycles_detected.length} confidence=${confidence}`
  );
}

main();
