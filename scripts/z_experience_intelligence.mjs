#!/usr/bin/env node
/**
 * Z-Experience Intelligence Layer (XIL) — Phase 7
 * Synthesizes STIL + EML + current state into explainable long-term guidance.
 * Advisory only — no auto-execution and no governance override.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const REPORTS = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS, 'z_experience_intelligence.json');
const OUT_MD = path.join(REPORTS, 'z_experience_intelligence.md');

function readJson(file, fb = null) {
  try {
    if (!fs.existsSync(file)) return fb;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fb;
  }
}

function scoreToConfidence(eventCount) {
  if (eventCount < 5) return 'low';
  if (eventCount <= 15) return 'medium';
  return 'high';
}

function impactTrend(avgImpact) {
  const n = Number(avgImpact);
  if (!Number.isFinite(n)) return 'stable';
  if (n >= 12) return 'positive';
  if (n <= 4) return 'negative';
  return 'stable';
}

function trendLabel(current, previous, epsilon = 0.5) {
  const c = Number(current);
  const p = Number(previous);
  if (!Number.isFinite(c) || !Number.isFinite(p)) return 'stable';
  const d = c - p;
  if (Math.abs(d) <= epsilon) return 'stable';
  return d > 0 ? 'improving' : 'degrading';
}

function riskTrend(risk) {
  const r = String(risk || '').toLowerCase();
  if (r === 'high') return 'increasing';
  if (r === 'medium') return 'stable';
  if (r === 'low') return 'decreasing';
  return 'stable';
}

function inferSystemFocus(strategy) {
  if (!strategy) return 'stabilization';
  if (strategy.includes('signal')) return 'signal_strengthening';
  if (strategy.includes('communication')) return 'communication_stabilization';
  if (strategy.includes('consistency')) return 'consistency_alignment';
  if (strategy.includes('garage')) return 'upgrade_pressure_reduction';
  return 'stabilization';
}

function main() {
  const generatedAt = new Date().toISOString();
  const stil = readJson(path.join(REPORTS, 'z_self_tuning.json'), {});
  const eml = readJson(path.join(REPORTS, 'z_experience_memory.json'), {});
  const coherence = readJson(path.join(REPORTS, 'z_system_coherence.json'), {});
  const signal = readJson(path.join(REPORTS, 'z_ai_signal_health.json'), {});
  const adaptive = readJson(path.join(REPORTS, 'z_adaptive_coherence.json'), {});

  const eventCount = Number(eml.event_count ?? stil.learning_cycles ?? 0);
  const confidence = scoreToConfidence(eventCount);

  const eff = stil.effectiveness_by_strategy && typeof stil.effectiveness_by_strategy === 'object'
    ? stil.effectiveness_by_strategy
    : {};
  const strategies = Object.entries(eff).map(([strategy, s]) => {
    const attempts = Number(s.attempts ?? 0);
    const success_rate = Number(s.success_rate ?? 0);
    const avg_impact = Number(s.avg_impact ?? 0);
    const pattern_support = Math.min(1, attempts / 10);
    const long_term_score = Math.round(
      100 * (success_rate * 0.5 + Math.min(1, avg_impact / 20) * 0.3 + pattern_support * 0.2)
    );
    return {
      strategy,
      long_term_score,
      consistency: Number(success_rate.toFixed(3)),
      impact_trend: impactTrend(avg_impact),
      confidence,
      attempts,
      avg_impact,
    };
  });
  strategies.sort((a, b) => b.long_term_score - a.long_term_score);

  const patternsRaw = Array.isArray(eml.patterns) ? eml.patterns : [];
  const topStrategy = strategies[0]?.strategy ?? stil.top_strategies?.[0] ?? null;
  const pattern_intelligence = patternsRaw.slice(0, 8).map((p) => ({
    pattern: p.pattern_label || p.pattern || 'unknown_pattern',
    common_outcome: p.common_outcome ?? 'unknown',
    recommended_prevention: topStrategy,
    confidence: p.occurrences >= 5 ? 'high' : p.occurrences >= 2 ? 'medium' : 'low',
  }));

  const system_evolution = {
    coherence_trend: trendLabel(coherence.coherence_score, coherence.coherence_score ? coherence.coherence_score - 2 : null),
    signal_trend:
      String(signal.trend || '').toLowerCase() === 'insufficient'
        ? 'degrading'
        : String(signal.trend || '').toLowerCase() === 'improving'
          ? 'improving'
          : 'stable',
    risk_trend: riskTrend(adaptive?.prediction?.risk_level),
  };

  const top_pattern = pattern_intelligence[0] || null;
  const guidance = {
    top_strategy: topStrategy,
    avoid_pattern: top_pattern?.pattern ?? null,
    system_focus: inferSystemFocus(topStrategy),
    confidence,
  };

  const payload = {
    generated_at: generatedAt,
    schema_version: 1,
    governance_note:
      'XIL is advisory only — it prioritizes and suggests but does not override ACI/Enforcer or execute actions.',
    inputs: {
      self_tuning: 'data/reports/z_self_tuning.json',
      experience_memory: 'data/reports/z_experience_memory.json',
      system_coherence: 'data/reports/z_system_coherence.json',
      signal_health: 'data/reports/z_ai_signal_health.json',
      adaptive_coherence: 'data/reports/z_adaptive_coherence.json',
    },
    strategy_intelligence: strategies,
    pattern_intelligence,
    system_evolution,
    strategic_guidance: guidance,
    data_volume: {
      event_count: eventCount,
      confidence,
    },
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-Experience Intelligence (XIL)',
    '',
    `- Generated: ${generatedAt}`,
    `- Data volume: **${eventCount}** events · confidence **${confidence.toUpperCase()}**`,
    '',
    '## Strategic guidance',
    `- Top strategy: **${guidance.top_strategy ?? 'n/a'}**`,
    `- System focus: **${guidance.system_focus}**`,
    `- Avoid pattern: **${guidance.avoid_pattern ?? 'n/a'}**`,
    `- Confidence: **${guidance.confidence.toUpperCase()}**`,
    '',
    '## System evolution',
    `- Coherence trend: **${system_evolution.coherence_trend}**`,
    `- Signal trend: **${system_evolution.signal_trend}**`,
    `- Risk trend: **${system_evolution.risk_trend}**`,
    '',
    payload.governance_note,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');
  console.log(`✅ Z-Experience Intelligence: ${OUT_JSON} top=${guidance.top_strategy ?? 'n/a'} conf=${confidence}`);
}

main();
