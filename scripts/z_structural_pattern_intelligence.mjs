#!/usr/bin/env node
/**
 * Z-Structural Pattern Intelligence (SPI) — advisory-only.
 * Cross-reads catalog diff, decision log, pattern bot, guardian, decisions, optional QOSMEI snapshot.
 * Emits data/reports/z_structural_patterns.{json,md}
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const LOGS_DIR = path.join(ROOT, 'data', 'logs');
const OUT_JSON = path.join(REPORTS_DIR, 'z_structural_patterns.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_structural_patterns.md');
const OUT_GUARDIAN_PRE = path.join(REPORTS_DIR, 'z_spi_guardian_pre_warnings.json');
const ADAPTIVE_LEARNING = path.join(REPORTS_DIR, 'z_adaptive_learning_state.json');

const DECISION_LOG = path.join(LOGS_DIR, 'z_decision_history.jsonl');

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function num(v, fb = 0) {
  const x = Number(v);
  return Number.isFinite(x) ? x : fb;
}

function countDecisionLinesSince(isoSince, logPath) {
  if (!isoSince) return 0;
  const since = Date.parse(isoSince);
  if (!Number.isFinite(since)) return 0;
  let n = 0;
  try {
    const raw = fs.readFileSync(logPath, 'utf8');
    for (const line of raw.split('\n')) {
      if (!line.trim()) continue;
      let o;
      try {
        o = JSON.parse(line);
      } catch {
        continue;
      }
      const t = Date.parse(o.ts || o.timestamp || '');
      if (Number.isFinite(t) && t >= since) n += 1;
    }
  } catch {
    return 0;
  }
  return n;
}

function countDecisionLinesLastDays(days, logPath) {
  const cutoff = Date.now() - days * 86400000;
  let n = 0;
  try {
    const raw = fs.readFileSync(logPath, 'utf8');
    for (const line of raw.split('\n')) {
      if (!line.trim()) continue;
      let o;
      try {
        o = JSON.parse(line);
      } catch {
        continue;
      }
      const t = Date.parse(o.ts || o.timestamp || '');
      if (Number.isFinite(t) && t >= cutoff) n += 1;
    }
  } catch {
    return 0;
  }
  return n;
}

function sumReopenCount(patternsDoc) {
  const list = Array.isArray(patternsDoc?.patterns) ? patternsDoc.patterns : [];
  return list.reduce((acc, p) => acc + num(p?.reopen_count, 0), 0);
}

function highPatternCount(patternsDoc) {
  const list = Array.isArray(patternsDoc?.patterns) ? patternsDoc.patterns : [];
  return list.filter((p) => String(p?.pattern_severity || '').toUpperCase() === 'HIGH').length;
}

function build() {
  const diff = readJson(path.join(REPORTS_DIR, 'z_pc_root_dirent_catalog_diff.json'), null);
  const patterns = readJson(path.join(REPORTS_DIR, 'z_bot_patterns.json'), {});
  const guardian = readJson(path.join(REPORTS_DIR, 'z_bot_guardian.json'), {});
  const decisions = readJson(path.join(REPORTS_DIR, 'z_bot_decisions.json'), {});
  const alerts = readJson(path.join(REPORTS_DIR, 'z_bot_alerts.json'), {});
  const qosmei = readJson(path.join(REPORTS_DIR, 'z_qosmei_core_signal.json'), null);

  const added = num(diff?.added_count, 0);
  const removed = num(diff?.removed_count, 0);
  const renames = Array.isArray(diff?.rename_suspects) ? diff.rename_suspects : [];
  const structuralDelta = added + removed + renames.length;
  const diffSince = diff?.generated_at || null;
  const decisionsAfterDiff = diffSince ? countDecisionLinesSince(diffSince, DECISION_LOG) : countDecisionLinesLastDays(7, DECISION_LOG);

  const missingPaths = num(guardian?.summary?.missing, 0);
  const decisionList = Array.isArray(decisions?.decisions) ? decisions.decisions : [];
  const pendingDecisions = decisionList.filter((d) => String(d?.status || '').toLowerCase() === 'pending').length;
  const totalAlerts =
    typeof alerts?.total_alerts === 'number' ? num(alerts.total_alerts, 0) : Array.isArray(alerts?.alerts) ? alerts.alerts.length : 0;

  const reopenSum = sumReopenCount(patterns);
  const highPat = highPatternCount(patterns);
  const log7d = fs.existsSync(DECISION_LOG) ? countDecisionLinesLastDays(7, DECISION_LOG) : 0;

  const qosComposite = num(qosmei?.score?.composite, NaN);
  const qosPosture = String(qosmei?.posture || '').toLowerCase();

  const structural_patterns = [];

  // 1) Rename instability
  if (renames.length >= 2 || (renames.length >= 1 && (missingPaths > 0 || reopenSum >= 1 || highPat > 0))) {
    structural_patterns.push({
      type: 'rename_instability',
      confidence: clamp(0.55 + renames.length * 0.12 + (missingPaths > 0 ? 0.1 : 0), 0.45, 0.9),
      impact: renames.length >= 2 || missingPaths > 0 ? 'high' : 'medium',
      evidence: [
        `rename_suspects=${renames.length}`,
        missingPaths > 0 ? `guardian_missing=${missingPaths}` : null,
        reopenSum > 0 ? `pattern_reopen_sum=${reopenSum}` : null,
      ].filter(Boolean),
    });
  }

  // 2) Phantom project (registry/disk/catalog churn)
  if (missingPaths > 0 && (added + removed > 0 || renames.length > 0)) {
    structural_patterns.push({
      type: 'phantom_project',
      confidence: clamp(0.6 + (added + removed) * 0.05, 0.5, 0.88),
      impact: 'high',
      evidence: [`missing_paths=${missingPaths}`, `catalog_delta=${added + removed}`, `rename_suspects=${renames.length}`],
    });
  }

  // 3) Silent drift — catalog changed, no decision log after diff timestamp
  if (structuralDelta > 0 && decisionsAfterDiff === 0 && diffSince) {
    structural_patterns.push({
      type: 'silent_drift',
      severity: 'HIGH',
      confidence: clamp(0.62 + structuralDelta * 0.03, 0.5, 0.87),
      impact: 'high',
      evidence: [`structural_delta=${structuralDelta}`, 'decision_log_entries_after_diff=0'],
      note: 'Structure changed vs baseline; no JSONL decision entries after catalog diff timestamp.',
    });
  }

  // 4) Over-control — healthy signal surface but governance backlog
  if (pendingDecisions > 0 && missingPaths === 0 && totalAlerts === 0) {
    const qosLooksClear = Number.isFinite(qosComposite) ? qosComposite >= 72 && qosPosture === 'clear' : false;
    if (qosLooksClear || (Number.isFinite(qosComposite) && qosComposite >= 80)) {
      structural_patterns.push({
        type: 'over_control',
        confidence: clamp(0.5 + pendingDecisions * 0.08, 0.45, 0.82),
        impact: 'medium',
        evidence: [`pending_decisions=${pendingDecisions}`, `qosmei_composite=${Number.isFinite(qosComposite) ? Math.round(qosComposite) : 'n/a'}`],
        note: 'Operational surface looks clear but decisions remain pending (governance friction).',
      });
    }
  }

  // 5) Stability convergence
  if (structuralDelta === 0 && missingPaths === 0 && pendingDecisions === 0 && totalAlerts === 0) {
    structural_patterns.push({
      type: 'stability_convergence',
      confidence: clamp(0.7 + (log7d < 5 ? 0.08 : 0), 0.55, 0.9),
      impact: 'low',
      evidence: ['no_catalog_delta', 'no_guardian_misses', 'no_pending_decisions', 'no_rollout_alerts'],
    });
  }

  let system_phase = 'stabilizing';
  if (structural_patterns.some((p) => p.type === 'rename_instability' || p.type === 'phantom_project')) system_phase = 'unstable';
  else if (structural_patterns.some((p) => p.type === 'silent_drift')) system_phase = 'learning';
  else if (structural_patterns.some((p) => p.type === 'over_control')) system_phase = 'stabilizing';
  else if (structural_patterns.some((p) => p.type === 'stability_convergence')) system_phase = 'optimized';

  /** Long-horizon lifecycle (advisory). `adaptive` reserved for future bounded learning. */
  let evolution_phase = 'stabilizing';
  if (system_phase === 'unstable') evolution_phase = 'reactive';
  else if (system_phase === 'learning') evolution_phase = 'learning';
  else if (system_phase === 'stabilizing') evolution_phase = 'stabilizing';
  else if (system_phase === 'optimized') {
    const onlyStability =
      structural_patterns.length === 1 && structural_patterns[0]?.type === 'stability_convergence';
    evolution_phase = onlyStability ? 'baseline' : 'optimized';
  }

  const silent_drift_detected = structural_patterns.some((p) => p.type === 'silent_drift');
  const rename_instability_detected = structural_patterns.some((p) => p.type === 'rename_instability');
  const stability_convergence_detected = structural_patterns.some((p) => p.type === 'stability_convergence');
  const phantom_project_detected = structural_patterns.some((p) => p.type === 'phantom_project');
  const over_control_detected = structural_patterns.some((p) => p.type === 'over_control');

  const predictive_signals = {
    silent_drift_detected,
    rename_instability_detected,
    stability_convergence_detected,
    phantom_project_detected,
    over_control_detected,
  };

  const drift_detected = structuralDelta > 0;

  const pre_warnings = renames.slice(0, 12).map((r) => ({
    type: 'rename_risk',
    path: `${r.removed} → ${r.added}`,
    from_name: r.removed,
    to_name: r.added,
    confidence: clamp(0.92 - num(r.levenshtein, 2) * 0.04, 0.55, 0.95),
    note: 'Catalog heuristic: possible folder rename; registry may drift until human alignment. No auto-rename.',
  }));

  const pendingFirst = decisionList.find((d) => String(d?.status || '').toLowerCase() === 'pending');

  const decision_suggestions = [];
  if (rename_instability_detected && renames.length) {
    const top = renames[0];
    decision_suggestions.push({
      target: 'investigate_missing_project',
      suggested_action: 'verify_registry_alignment',
      confidence: clamp(0.78 + (1 - num(top.levenshtein, 3) / 8), 0.55, 0.92),
      reason: `Rename suspects (${renames.length}): "${top.removed}" vs "${top.added}" — align registry to disk after confirm.`,
    });
  }
  if (silent_drift_detected) {
    decision_suggestions.push({
      target: 'structural_follow_up',
      suggested_action: 'ack',
      confidence: 0.72,
      reason: 'Catalog diff shows structural change with no decision JSONL after diff timestamp — acknowledge drift or log intent.',
    });
  }
  if (phantom_project_detected) {
    decision_suggestions.push({
      target: pendingFirst?.id || 'investigate_missing_project',
      suggested_action: 'verify_registry_alignment',
      confidence: 0.8,
      reason: 'Guardian misses while catalog shows add/remove/rename churn — verify registry vs disk.',
    });
  }
  if (over_control_detected && pendingFirst?.id) {
    decision_suggestions.push({
      target: String(pendingFirst.id),
      suggested_action: 'resolve',
      confidence: 0.65,
      reason: 'Signals clear but governance queue pending — resolve or dismiss with note when safe.',
    });
  }

  let risk_band = 'low';
  if (system_phase === 'unstable') risk_band = 'high';
  else if (system_phase === 'learning') risk_band = 'high';
  else if (system_phase === 'stabilizing') risk_band = 'medium';

  let score = 100;
  for (const p of structural_patterns) {
    if (p.type === 'rename_instability') score -= p.impact === 'high' ? 20 : 12;
    if (p.type === 'phantom_project') score -= 18;
    if (p.type === 'silent_drift') score -= 22;
    if (p.type === 'over_control') score -= 10;
    if (p.type === 'stability_convergence') score += 8;
  }
  score = Math.round(clamp(score, 0, 100));
  const score_baseline = score;

  const alState = readJson(ADAPTIVE_LEARNING, null);
  const w0 = { rename_instability: 1, silent_drift: 1, stability_convergence: 1, phantom_project: 1, over_control: 1, ...(alState?.weights || {}) };
  const activeTypes = structural_patterns.map((p) => p.type);
  let prod = 1;
  let nW = 0;
  for (const t of activeTypes) {
    const wt = num(w0[t], 1);
    if (wt < 0.5) continue;
    prod *= clamp(wt, 0.5, 1.5);
    nW += 1;
  }
  const damper = 0.22;
  const blend = nW === 0 ? 1 : 1 + (Math.pow(prod, 1 / nW) - 1) * damper;
  const structural_patterns_score = Math.round(clamp(score_baseline * blend, 0, 100));
  const adaptive_learning = {
    present: Boolean(alState?.schema_version),
    learning_cycles: alState?.learning_cycles ?? 0,
    last_updated: alState?.last_updated ?? null,
    structural_patterns_score_baseline: score_baseline,
    structural_patterns_score_tuned: structural_patterns_score,
    weight_blend: Number(blend.toFixed(4)),
    drp_note: alState
      ? 'Bounded multipliers from data/reports/z_adaptive_learning_state.json (remove file to reset).'
      : 'No adaptive state — optional: npm run learning:eval then learning:tune.',
  };

  const top = [...structural_patterns].sort((a, b) => {
    const w = { high: 3, medium: 2, low: 1 };
    return (w[b.impact] || 0) - (w[a.impact] || 0);
  })[0];
  const top_note = top
    ? `${top.type.replace(/_/g, ' ')} (${top.impact} confidence=${top.confidence.toFixed(2)})`
    : 'No strong cross-layer structural pattern this run.';

  const generated_at = new Date().toISOString();

  return {
    schema_version: 2,
    generated_at,
    advisory_only: true,
    drp_note:
      'SPI is heuristic and advisory. Confirm rename_suspects and catalog deltas on disk before registry edits. No auto-fix.',
    system_phase,
    evolution_phase,
    predictive_signals,
    risk_band,
    top_note,
    structural_patterns_score,
    adaptive_learning,
    structural_patterns,
    decision_suggestions,
    pre_warnings,
    inputs: {
      diff_file: 'data/reports/z_pc_root_dirent_catalog_diff.json',
      diff_present: Boolean(diff),
      added_count: added,
      removed_count: removed,
      rename_suspects_count: renames.length,
      structural_delta: structuralDelta,
      diff_generated_at: diffSince,
      decision_log_entries_last_7d: log7d,
      decision_log_entries_after_diff: decisionsAfterDiff,
      guardian_missing: missingPaths,
      pending_decisions: pendingDecisions,
      rollup_alerts: totalAlerts,
      pattern_reopen_sum: reopenSum,
      high_severity_patterns: highPat,
      qosmei_composite_snapshot: Number.isFinite(qosComposite) ? Math.round(qosComposite) : null,
      drift_detected: drift_detected,
    },
  };
}

function writeMd(payload) {
  const lines = [
    '# Z-Structural Pattern Intelligence (SPI)',
    '',
    `Generated: ${payload.generated_at}`,
    `System phase: **${payload.system_phase}** · evolution: **${payload.evolution_phase ?? 'n/a'}** · risk: **${payload.risk_band}** · SPI score: **${payload.structural_patterns_score}**${
      payload.adaptive_learning?.structural_patterns_score_baseline != null &&
      payload.adaptive_learning.structural_patterns_score_baseline !== payload.structural_patterns_score
        ? ` (baseline ${payload.adaptive_learning.structural_patterns_score_baseline} → tuned)`
        : ''
    }`,
    '',
    '## Summary',
    payload.top_note,
    '',
    '## Decision suggestions (advisory)',
    ...(payload.decision_suggestions?.length
      ? payload.decision_suggestions.map(
          (s) =>
            `- **${s.target}** → ${s.suggested_action} (${(s.confidence * 100).toFixed(0)}%) — ${s.reason}`
        )
      : ['- (none)']),
    '',
    '## Patterns',
    ...(payload.structural_patterns.length
      ? payload.structural_patterns.map(
          (p) =>
            `- **${p.type}** · impact ${p.impact} · confidence ${p.confidence.toFixed(2)} · evidence: ${(p.evidence || []).join('; ')}`
        )
      : ['- (none)']),
    '',
    '## Refresh',
    '`npm run spi:analyze` · run before `npm run qosmei:signal` for fused scoring.',
    '',
  ];
  fs.writeFileSync(OUT_MD, lines.join('\n'), 'utf8');
}

function main() {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  const payload = build();
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  writeMd(payload);
  const prePayload = {
    schema_version: 1,
    generated_at: payload.generated_at,
    advisory_only: true,
    drp_note: 'SPI rename-risk hints for Guardian merge. Confirm on disk; no auto-fix.',
    pre_warnings: Array.isArray(payload.pre_warnings) ? payload.pre_warnings : [],
  };
  fs.writeFileSync(OUT_GUARDIAN_PRE, `${JSON.stringify(prePayload, null, 2)}\n`, 'utf8');
  console.log(
    `Z-SPI written: ${OUT_JSON} phase=${payload.system_phase} evolution=${payload.evolution_phase} score=${payload.structural_patterns_score} patterns=${payload.structural_patterns.length} pre_warnings=${prePayload.pre_warnings.length}`
  );
}

main();
