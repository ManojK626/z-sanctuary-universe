#!/usr/bin/env node
/**
 * Z-Adaptive Coherence Intelligence (ACI) — Phase 6.4
 * Explains contradictions, suggests ranked actions, forecasts drift risk. Advisory only.
 * Requires z_system_coherence.json (run ai:system:coherence first).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const REPORTS = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS, 'z_adaptive_coherence.json');
const OUT_MD = path.join(REPORTS, 'z_adaptive_coherence.md');
const TUNING_JSON = path.join(REPORTS, 'z_self_tuning.json');

/** Maps action.domain → strategy keys used by scripts/z_self_tuning.mjs */
const DOMAIN_TO_STRATEGY = {
  signal: 'increase_signal',
  communication: 'fix_communication',
  consistency: 'resolve_consistency',
  garage: 'address_garage_pressure',
  ops: 'maintain_cadence',
};

function readJson(file, fb = null) {
  try {
    if (!fs.existsSync(file)) return fb;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fb;
  }
}

/** @typedef {{ type: string, source: string, root_cause: string, confidence: string }} RootCause */

function mapContradictionToRoot(c) {
  const table = {
    low_signal_vs_high_structure: {
      type: 'underfed_system',
      root_cause: 'insufficient_real_activity',
      confidence: 'high',
    },
    communication_degraded: {
      type: 'communication_stress',
      root_cause: 'stale_comms_or_sync',
      confidence: 'medium',
    },
    communication_broken: {
      type: 'communication_failure',
      root_cause: 'missing_or_invalid_comms_artifacts',
      confidence: 'high',
    },
    consistency_watch: {
      type: 'cross_signal_noise',
      root_cause: 'misaligned_refresh_or_layer_mismatch',
      confidence: 'medium',
    },
    consistency_high_severity: {
      type: 'cross_layer_conflict',
      root_cause: 'high_severity_consistency_alert',
      confidence: 'high',
    },
    high_upgrade_pressure_vs_stable_structure: {
      type: 'hidden_upgrade_debt',
      root_cause: 'garage_pressure_vs_calm_structure',
      confidence: 'medium',
    },
    many_low_zci_projects_vs_stable_structure: {
      type: 'zci_debt',
      root_cause: 'weak_projects_under_strong_shell',
      confidence: 'medium',
    },
  };
  const m = table[c];
  if (!m) {
    return {
      type: 'unknown_tension',
      source: c,
      root_cause: 'unmapped_contradiction',
      confidence: 'low',
    };
  }
  return { type: m.type, source: c, root_cause: m.root_cause, confidence: m.confidence };
}

function buildRecommendedActions(coherence, signal, comm, consistency, garage) {
  const actions = [];
  const seen = new Set();
  const add = (priority, action, impact, domain) => {
    const key = `${domain}:${action.slice(0, 48)}`;
    if (seen.has(key)) return;
    seen.add(key);
    actions.push({ priority, action, impact, domain });
  };

  const sig = String(signal?.signal_health || '').toLowerCase();
  const flow = String(comm?.flow_status || '').toLowerCase();
  const garagePressure = String(garage?.pressure || '').toLowerCase();
  const alerts = Array.isArray(consistency?.alerts) ? consistency.alerts : [];

  if (sig === 'low' || sig === 'insufficient') {
    add(
      1,
      'Append real creator + business lines to task JSONL logs (features, fixes, decisions) then re-run full scan.',
      'high',
      'signal'
    );
  }

  if (flow === 'degraded' || flow === 'broken') {
    add(
      2,
      'Refresh GitHub + Cloudflare comms manifests and AAFRTC context (`comms:github-ai`, `comms:cloudflare-ai`, `z_aafrtc_resolve`); verify manifest ok flags.',
      'high',
      'communication'
    );
  }

  if (alerts.length > 0) {
    add(
      3,
      'Resolve or accept each row in z_ai_consistency_alerts.json; re-run npm run ai:consistency:check.',
      'medium',
      'consistency'
    );
  }

  if (garagePressure === 'high') {
    add(
      2,
      'Review z_garage_upgrade_plan.json critical patterns before expanding scope.',
      'high',
      'garage'
    );
  }

  if (actions.length === 0) {
    add(1, 'Maintain cadence: npm run z:garage:full-scan after material changes.', 'low', 'ops');
  }

  actions.sort((a, b) => a.priority - b.priority);
  return actions.map((a, i) => ({ ...a, priority: i + 1 }));
}

/**
 * Re-ranks ties using prior STIL effectiveness (same-scan uses last run’s z_self_tuning.json).
 * Advisory — does not execute actions.
 */
function applyLearningWeights(actions, tuning) {
  if (!tuning?.effectiveness_by_strategy || typeof tuning.effectiveness_by_strategy !== 'object') {
    return actions;
  }
  const eff = tuning.effectiveness_by_strategy;
  const scored = actions.map((a) => {
    const sid = DOMAIN_TO_STRATEGY[a.domain] || a.domain;
    const e = eff[sid];
    const boost = e ? e.success_rate * (e.avg_impact || 1) : 0;
    const learning_hint =
      e && e.attempts > 0
        ? `${sid}: ${Math.round(e.success_rate * 100)}% success (n=${e.attempts}), avg impact ${e.avg_impact}`
        : null;
    return { ...a, learning_boost: boost, learning_hint, learning_strategy: sid };
  });
  scored.sort((x, y) => {
    if (x.priority !== y.priority) return x.priority - y.priority;
    return y.learning_boost - x.learning_boost;
  });
  return scored.map((a, i) => ({
    ...a,
    priority: i + 1,
  }));
}

function predictNext(coherenceScore, status, contradictions, flow, signal) {
  const c = contradictions.length;
  const flowBad = flow === 'broken' || flow === 'degraded';
  const sigLow = signal === 'low' || signal === 'insufficient';

  let next_state = 'coherent';
  let risk_level = 'low';
  let reason = 'Layers appear aligned; keep refresh cadence.';

  if (coherenceScore < 40 || status === 'unstable') {
    next_state = 'unstable';
    risk_level = 'high';
    reason = 'Coherence score is very low — stabilize signal, comms, or consistency before scaling.';
  } else if (coherenceScore < 65 || status === 'misaligned') {
    next_state = sigLow && flowBad ? 'unstable' : 'minor_drift';
    risk_level = sigLow && flowBad ? 'high' : 'medium';
    reason =
      sigLow && flowBad
        ? 'Low activity plus weak comm flow — drift toward instability if unchanged.'
        : 'Cross-layer tension may deepen without fresh activity or comms refresh.';
  } else if (status === 'minor_drift') {
    next_state = 'misaligned';
    risk_level = c >= 3 ? 'medium' : 'low';
    reason = 'Minor drift may widen if contradictions accumulate.';
  }

  return { next_state, risk_level, reason };
}

function main() {
  const generatedAt = new Date().toISOString();
  const coherence = readJson(path.join(REPORTS, 'z_system_coherence.json'), null);
  const signal = readJson(path.join(REPORTS, 'z_ai_signal_health.json'), null);
  const comm = readJson(path.join(REPORTS, 'z_communication_health.json'), null);
  const consistency = readJson(path.join(REPORTS, 'z_ai_consistency_alerts.json'), null);
  const garage = readJson(path.join(REPORTS, 'z_garage_upgrade_plan.json'), null);

  if (!coherence || typeof coherence.coherence_score !== 'number') {
    console.error('Missing or invalid data/reports/z_system_coherence.json — run npm run ai:system:coherence first.');
    process.exit(1);
  }

  const contradictions = Array.isArray(coherence.contradictions) ? coherence.contradictions : [];
  const root_causes = contradictions.map((x) => mapContradictionToRoot(x));

  const tuning = readJson(TUNING_JSON, null);
  const recommended_actions = applyLearningWeights(
    buildRecommendedActions(coherence, signal, comm, consistency, garage),
    tuning
  );

  const flow = String(coherence.signals?.communication_flow || comm?.flow_status || '').toLowerCase();
  const sig = String(coherence.signals?.signal_health || signal?.signal_health || '').toLowerCase();
  const prediction = predictNext(
    coherence.coherence_score,
    String(coherence.status || ''),
    contradictions,
    flow,
    sig
  );

  const topAction = recommended_actions[0]?.action ?? 'No specific action; maintain observability.';

  const payload = {
    generated_at: generatedAt,
    schema_version: 1,
    governance_note:
      'Advisory guidance only — does not auto-fix, deploy, or override Enforcer / DRP / release control.',
    coherence_score: coherence.coherence_score,
    status: coherence.status,
    confidence: coherence.confidence,
    root_causes,
    recommended_actions,
    prediction,
    summary: {
      top_action: topAction,
      top_domain: recommended_actions[0]?.domain ?? 'ops',
    },
    sources: {
      system_coherence: 'data/reports/z_system_coherence.json',
      signal_health: 'data/reports/z_ai_signal_health.json',
      communication_health: 'data/reports/z_communication_health.json',
      consistency_alerts: 'data/reports/z_ai_consistency_alerts.json',
      garage_upgrade_plan: 'data/reports/z_garage_upgrade_plan.json',
      self_tuning: 'data/reports/z_self_tuning.json',
    },
    self_tuning_applied: Boolean(tuning?.effectiveness_by_strategy),
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-Adaptive Coherence Intelligence',
    '',
    `- Generated: ${generatedAt}`,
    `- Coherence: **${coherence.coherence_score}%** · ${coherence.status} · confidence **${coherence.confidence}**`,
    '',
    '## Top action',
    `- ${topAction}`,
    ...(payload.self_tuning_applied
      ? ['- Learning-weighted ranking applied (see `learning_hint` on actions).', '']
      : ['- No prior `z_self_tuning.json` effectiveness — run `npm run ai:self:tuning` after logging events.', '']),
    '## Prediction',
    `- Next state (forecast): **${prediction.next_state}** · risk: **${prediction.risk_level}**`,
    `- ${prediction.reason}`,
    '',
    '## Root causes',
    ...(root_causes.length
      ? root_causes.map((r) => `- **${r.type}** ← \`${r.source}\` (${r.confidence}) — ${r.root_cause}`)
      : ['- none mapped']),
    '',
    payload.governance_note,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(`✅ Z-Adaptive Coherence: ${OUT_JSON} risk=${prediction.risk_level}`);
}

main();
