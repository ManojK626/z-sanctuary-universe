#!/usr/bin/env node
/**
 * Z-Fusion Council (Phase 8.1)
 * Read-only advisory synthesis across core intelligence reports.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const REPORTS = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS, 'z_fusion_council.json');
const OUT_MD = path.join(REPORTS, 'z_fusion_council.md');

const CONF = { high: 1, medium: 0.7, low: 0.4 };
const ACTION_MAP = {
  signal: 'signal_strengthening',
  communication: 'communication_stability',
  consistency: 'consistency_alignment',
  garage: 'garage_stabilization',
  increase_signal: 'signal_strengthening',
  fix_communication: 'communication_stability',
  resolve_consistency: 'consistency_alignment',
  reduce_pressure: 'garage_stabilization',
  address_garage_pressure: 'garage_stabilization',
};

function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function report(name) {
  return readJson(path.join(REPORTS, name));
}

function normalizeAction(raw) {
  const key = String(raw || '').trim().toLowerCase();
  return ACTION_MAP[key] || key || null;
}

function addVote(votes, rawAction, weight, confidence = 'medium') {
  const action = normalizeAction(rawAction);
  if (!action) return;
  votes[action] = (votes[action] || 0) + weight * (CONF[String(confidence || '').toLowerCase()] || 0.7);
}

function topFromVotes(votes) {
  const entries = Object.entries(votes).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return { primary: null, consensus: 0, conflicts: [] };
  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  const [topAction, topScore] = entries[0];
  const consensus = total ? topScore / total : 0;
  const conflicts = entries
    .slice(1)
    .filter(([, v]) => v > topScore * 0.6)
    .map(([a]) => a);
  return { primary: topAction, consensus, conflicts };
}

function confFromConsensus(c) {
  if (c > 0.75) return 'high';
  if (c > 0.5) return 'medium';
  return 'low';
}

function pretty(action) {
  return String(action || 'no_clear_consensus').replace(/_/g, ' ');
}

function main() {
  const aci = report('z_adaptive_coherence.json');
  const xil = report('z_experience_intelligence.json');
  const sys = report('z_system_health.json');
  const comm = report('z_communication_health.json');
  const sig = report('z_ai_signal_health.json');

  const votes = {};
  const inputs_used = [];

  if (aci?.recommended_actions?.length) {
    const top = aci.recommended_actions[0];
    addVote(votes, top.domain || top.action, 0.3, aci?.confidence || 'medium');
    inputs_used.push('adaptive_coherence');
  }
  if (xil?.strategic_guidance?.top_strategy) {
    addVote(votes, xil.strategic_guidance.top_strategy, 0.3, xil?.strategic_guidance?.confidence || 'low');
    inputs_used.push('experience_intelligence');
  }
  if (sys && sys?.status === 'stable' && Number(sys?.health_score) > 80) {
    addVote(votes, 'increase_signal', 0.15, 'medium');
    inputs_used.push('system_health');
  }
  if (comm && ['degraded', 'broken'].includes(String(comm?.flow_status || '').toLowerCase())) {
    addVote(votes, 'fix_communication', 0.15, 'medium');
    inputs_used.push('communication_health');
  }
  if (sig && String(sig?.signal_health || '').toLowerCase() === 'low') {
    addVote(votes, 'increase_signal', 0.1, 'high');
    inputs_used.push('signal_health');
  }

  const { primary, consensus, conflicts } = topFromVotes(votes);
  const confidence = confFromConsensus(consensus);
  const recommendation = primary
    ? `Focus on ${pretty(primary)} before secondary actions.`
    : 'No clear consensus from available inputs.';

  const out = {
    generated_at: new Date().toISOString(),
    votes,
    primary_focus: primary,
    consensus: Number(consensus.toFixed(2)),
    confidence,
    conflicts,
    final_recommendation: recommendation,
    inputs_used,
    governance_note: 'Advisory only — no execution or overrides.',
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(out, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-Fusion Council',
    '',
    `- Generated: ${out.generated_at}`,
    `- Primary focus: **${out.primary_focus ?? 'n/a'}**`,
    `- Consensus: **${out.consensus}** · confidence: **${out.confidence.toUpperCase()}**`,
    `- Conflicts: **${out.conflicts.length ? out.conflicts.join(', ') : 'none'}**`,
    `- Final recommendation: ${out.final_recommendation}`,
    '',
    out.governance_note,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');
  console.log(`✅ Z-Fusion Council: ${OUT_JSON} primary=${out.primary_focus ?? 'n/a'} consensus=${out.consensus}`);
}

main();
