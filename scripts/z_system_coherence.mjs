#!/usr/bin/env node
/**
 * Z-System Coherence — unified cross-layer truth score (advisory only).
 * Reads structural health, signal, communication flow, consistency alerts, garage pressure.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const REPORTS = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS, 'z_system_coherence.json');
const OUT_MD = path.join(REPORTS, 'z_system_coherence.md');

function readJson(file, fb = null) {
  try {
    if (!fs.existsSync(file)) return fb;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fb;
  }
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function main() {
  const generatedAt = new Date().toISOString();
  const systemHealth = readJson(path.join(REPORTS, 'z_system_health.json'), null);
  const signalHealth = readJson(path.join(REPORTS, 'z_ai_signal_health.json'), null);
  const comm = readJson(path.join(REPORTS, 'z_communication_health.json'), null);
  const consistency = readJson(path.join(REPORTS, 'z_ai_consistency_alerts.json'), null);
  const garage = readJson(path.join(REPORTS, 'z_garage_upgrade_plan.json'), null);
  const zci = readJson(path.join(REPORTS, 'z_ci_intelligence.json'), null);

  const structuralScore = Number(systemHealth?.health_score ?? 0);
  const sysStatus = String(systemHealth?.status || '').toLowerCase();
  const signalLevel = String(signalHealth?.signal_health || '').toLowerCase();
  const flowStatus = String(comm?.flow_status || '').toLowerCase();
  const consStatus = String(consistency?.status || '').toLowerCase();
  const alerts = Array.isArray(consistency?.alerts) ? consistency.alerts : [];
  const highSeverity = alerts.filter((a) => String(a?.severity || '').toLowerCase() === 'high');
  const garagePressure = String(garage?.pressure || '').toLowerCase();
  const zciLow = Number(zci?.summary?.low_priority ?? 0);

  let score = Number.isFinite(structuralScore) && structuralScore > 0 ? structuralScore : 55;
  const contradictions = [];

  if (sysStatus === 'stable' && signalLevel === 'low') {
    score -= 15;
    contradictions.push('low_signal_vs_high_structure');
  }

  if (flowStatus === 'broken') {
    score -= 30;
    contradictions.push('communication_broken');
  } else if (flowStatus === 'degraded') {
    score -= 15;
    contradictions.push('communication_degraded');
  }

  if (highSeverity.length > 0) {
    score -= 25;
    contradictions.push('consistency_high_severity');
  } else if (consStatus === 'watch') {
    score -= 10;
    contradictions.push('consistency_watch');
  }

  if (garagePressure === 'high' && sysStatus === 'stable') {
    score -= 20;
    contradictions.push('high_upgrade_pressure_vs_stable_structure');
  }

  if (zciLow > 5 && sysStatus === 'stable') {
    score -= 10;
    contradictions.push('many_low_zci_projects_vs_stable_structure');
  }

  score = clamp(Math.round(score), 0, 100);

  let status = 'misaligned';
  if (score >= 85) status = 'coherent';
  else if (score >= 65) status = 'minor_drift';
  else if (score >= 40) status = 'misaligned';
  else status = 'unstable';

  let confidence = 'medium';
  if (score >= 85 && flowStatus === 'healthy') confidence = 'high';
  else if (flowStatus === 'broken' || score < 45 || highSeverity.length > 0) confidence = 'low';

  const signals = {
    system_health: systemHealth?.status ?? 'unknown',
    system_health_score: structuralScore || null,
    signal_health: signalLevel || 'unknown',
    communication_flow: flowStatus || 'unknown',
    consistency: consStatus || 'unknown',
    garage_pressure: garagePressure || 'unknown',
  };

  let note = '';
  if (status === 'coherent') {
    note = 'Layers largely agree — safe to treat as a single coherent posture.';
  } else if (status === 'minor_drift') {
    note = 'Minor cross-layer tension — review contradictions before large changes.';
  } else if (status === 'misaligned') {
    note = 'Several layers disagree — investigate signal, flow, or consistency before scaling.';
  } else {
    note = 'Strong cross-layer conflict — stabilize structure, comms, or governance signals.';
  }

  const payload = {
    generated_at: generatedAt,
    schema_version: 1,
    governance_note: 'Advisory coherence score — does not override Enforcer, DRP, or release gates.',
    coherence_score: score,
    status,
    confidence,
    contradictions: [...new Set(contradictions)],
    signals,
    note,
    sources: {
      system_health: 'data/reports/z_system_health.json',
      signal_health: 'data/reports/z_ai_signal_health.json',
      communication_health: 'data/reports/z_communication_health.json',
      consistency_alerts: 'data/reports/z_ai_consistency_alerts.json',
      garage_upgrade_plan: 'data/reports/z_garage_upgrade_plan.json',
      z_ci_intelligence: 'data/reports/z_ci_intelligence.json',
    },
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-System Coherence',
    '',
    `- Generated: ${generatedAt}`,
    `- Coherence score: **${score}%** · status: **${status}** · confidence: **${confidence}**`,
    '',
    '## Contradictions',
    ...(payload.contradictions.length
      ? payload.contradictions.map((c) => `- ${c}`)
      : ['- none']),
    '',
    '## Layer signals',
    ...Object.entries(signals).map(([k, v]) => `- ${k}: ${v}`),
    '',
    note,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(`✅ Z-System Coherence: ${OUT_JSON} score=${score} status=${status}`);
}

main();
