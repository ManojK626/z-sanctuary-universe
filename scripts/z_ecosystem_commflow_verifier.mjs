#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_ecosystem_commflow_verifier.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_ecosystem_commflow_verifier.md');

function nowIso() {
  return new Date().toISOString();
}

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function normalizeStatusColor(raw) {
  const value = String(raw || '').toLowerCase();
  if (!value) return 'unknown';
  if (['green', 'ok', 'ready', 'go', 'allow_progress', 'stable-green', 'clear', 'enabled', 'pass'].includes(value)) {
    return 'green';
  }
  if (['watch', 'warn', 'attention', 'pending', 'planned', 'unknown'].includes(value)) {
    return 'amber';
  }
  if (['red', 'alert', 'hold', 'block', 'blocked', 'no-go', 'not-ready', 'fail', 'failed'].includes(value)) {
    return 'red';
  }
  return 'amber';
}

function stageFromColor(color) {
  if (color === 'green') return 'complete';
  if (color === 'red') return 'blocked';
  if (color === 'amber') return 'verify';
  return 'observe';
}

function handoffFromColor(color) {
  return color === 'green';
}

function pushLeaf(nodes, rawNode) {
  const color = normalizeStatusColor(rawNode.status_color);
  nodes.push({
    system_id: rawNode.system_id,
    system_name: rawNode.system_name || rawNode.system_id,
    status_color: color,
    stage: rawNode.stage || stageFromColor(color),
    last_updated_at: rawNode.last_updated_at || nowIso(),
    evidence_ref: rawNode.evidence_ref,
    next_required_action: rawNode.next_required_action || (color === 'red' ? 'Run remediation and re-verify' : 'Continue monitoring'),
    followup_owner: rawNode.followup_owner || (color === 'red' ? 'Z-Super Overseer' : 'Observer Lane'),
    handoff_ready: typeof rawNode.handoff_ready === 'boolean' ? rawNode.handoff_ready : handoffFromColor(color),
    details: rawNode.details || '',
  });
}

function countsByColor(nodes) {
  return nodes.reduce(
    (acc, node) => {
      acc[node.status_color] = (acc[node.status_color] || 0) + 1;
      return acc;
    },
    { green: 0, amber: 0, red: 0, unknown: 0 }
  );
}

function buildPayload() {
  const enforcerPath = path.join(REPORTS_DIR, 'z_execution_enforcer.json');
  const releasePath = path.join(REPORTS_DIR, 'z_release_gate_summary.json');
  const goNoGoPath = path.join(REPORTS_DIR, 'z_go_no_go_release_checklist.json');
  const crossProjectPath = path.join(REPORTS_DIR, 'z_cross_project_observer.json');
  const aiStatusPath = path.join(REPORTS_DIR, 'z_ai_status.json');
  const zunoPath = path.join(REPORTS_DIR, 'zuno_system_state_report.json');
  const trustPath = path.join(REPORTS_DIR, 'z_trust_scorecard.json');
  const bridgePath = path.join(REPORTS_DIR, 'z_bridge_intelligence_summary.json');
  const ideGuardPath = path.join(REPORTS_DIR, 'z_ide_commflow_guard.json');
  const labBoostPath = path.join(REPORTS_DIR, 'z_lab_folder_manager_boost.json');
  const qosmeiPath = path.join(REPORTS_DIR, 'z_qosmei_core_signal.json');
  const communicationHealthPath = path.join(REPORTS_DIR, 'z_communication_health.json');

  const enforcer = readJson(enforcerPath, {});
  const release = readJson(releasePath, {});
  const goNoGo = readJson(goNoGoPath, {});
  const crossProject = readJson(crossProjectPath, {});
  const aiStatus = readJson(aiStatusPath, {});
  const zuno = readJson(zunoPath, {});
  const trust = readJson(trustPath, {});
  const bridge = readJson(bridgePath, {});
  const ideGuard = readJson(ideGuardPath, {});
  const labBoost = readJson(labBoostPath, {});
  const qosmei = readJson(qosmeiPath, {});
  const communicationHealth = readJson(communicationHealthPath, {});

  const nodes = [];
  const readinessPass = Number(enforcer?.checks?.readiness_pass ?? zuno?.current?.metrics?.readiness_gates_pass ?? 0);
  const readinessTotal = Number(enforcer?.checks?.readiness_total ?? zuno?.current?.metrics?.readiness_gates_total ?? 4);
  const p1Open = Number(enforcer?.checks?.p1_open ?? zuno?.current?.metrics?.task_p1_open ?? 0);
  const trustScore = Number(trust?.trust_score ?? release?.trust?.score ?? 0);
  const bridgeBlocked = Number(bridge?.allocations_blocked ?? 0);
  const bridgeSuccess = Number(bridge?.allocations_success ?? 0);
  const qosmeiComposite = Number(qosmei?.score?.composite ?? 0);
  const qosmeiPosture = String(qosmei?.posture || 'unknown').toLowerCase();
  const qosmeiColor = qosmeiComposite >= 75 ? 'green' : qosmeiComposite >= 50 ? 'amber' : 'red';
  const commFlowHealthy =
    String(communicationHealth?.flow_status || '').toLowerCase() === 'healthy' &&
    Number(communicationHealth?.health_score ?? 0) >= 80;
  const goNoGoGo = String(goNoGo?.verdict || '').toUpperCase() === 'GO';
  const zunoInternalRaw = String(zuno?.executive_status?.internal_operations || '').toLowerCase();
  const zunoAdvisorySoftHold =
    zunoInternalRaw === 'hold' &&
    readinessPass >= readinessTotal &&
    p1Open === 0 &&
    qosmeiPosture === 'clear' &&
    trustScore >= 85;
  const zunoAdvisoryPromoteGreen = zunoAdvisorySoftHold && commFlowHealthy && goNoGoGo;
  const zunoCoreColor = zunoAdvisoryPromoteGreen ? 'green' : zunoAdvisorySoftHold ? 'amber' : zunoInternalRaw;
  const miniBotsAllOnline = Array.isArray(aiStatus?.miniai) && aiStatus.miniai.every((x) => x.online);
  const miniBotsAdvisoryPromoteGreen =
    !miniBotsAllOnline &&
    commFlowHealthy &&
    goNoGoGo &&
    qosmeiPosture === 'clear' &&
    trustScore >= 85;
  const goNoGoBlockers = Array.isArray(goNoGo?.blockers) ? goNoGo.blockers : [];
  const advisoryOnlyBridgeNoGo =
    String(goNoGo?.verdict || '').toUpperCase() === 'NO-GO' &&
    goNoGoBlockers.length === 1 &&
    goNoGoBlockers[0].includes('bridge_blocked_ratio') &&
    qosmeiPosture === 'clear' &&
    trustScore >= 85;

  /** blocked_fairness events in logs (≤4 amber band): promote to advisory green only when successes ≥ 2× blocks and hygiene gates mirror other comm-flow advisories — does not mutate bridge JSON. */
  const bridgeIntelAdvisoryGreen =
    bridgeBlocked > 2 &&
    bridgeBlocked <= 4 &&
    bridgeSuccess >= bridgeBlocked * 2 &&
    readinessPass >= readinessTotal &&
    p1Open === 0 &&
    qosmeiPosture === 'clear' &&
    trustScore >= 85 &&
    commFlowHealthy &&
    goNoGoGo;
  const bridgeIntelStatusColor =
    bridgeBlocked <= 2 ? 'green' : bridgeIntelAdvisoryGreen ? 'green' : bridgeBlocked <= 4 ? 'amber' : 'red';

  pushLeaf(nodes, {
    system_id: 'z_execution_enforcer',
    system_name: 'Z-Execution Enforcer',
    status_color: enforcer?.action === 'ALLOW_PROGRESS' ? 'green' : enforcer?.action === 'BLOCK' ? 'red' : 'amber',
    last_updated_at: enforcer?.generated_at,
    evidence_ref: 'data/reports/z_execution_enforcer.json',
    next_required_action:
      enforcer?.action === 'BLOCK' ? 'Clear P1/readiness/release blockers then rerun enforcer' : 'Keep enforcer checks current',
    followup_owner: 'Z-Super Overseer',
    details: enforcer?.reason || '',
  });

  pushLeaf(nodes, {
    system_id: 'release_gate',
    system_name: 'Release Gate',
    status_color: String(release?.verdict || release?.release_gate || '').toLowerCase(),
    last_updated_at: release?.generated_at,
    evidence_ref: 'data/reports/z_release_gate_summary.json',
    next_required_action: 'Remediate freshness and trust blockers, then rerun release gate',
    followup_owner: 'Z-EAII',
    details: Array.isArray(release?.top_blockers) ? release.top_blockers.join(' | ') : '',
  });

  pushLeaf(nodes, {
    system_id: 'go_no_go',
    system_name: 'GO/NO-GO Checklist',
    status_color: advisoryOnlyBridgeNoGo ? 'amber' : goNoGo?.verdict,
    last_updated_at: goNoGo?.generated_at,
    evidence_ref: 'data/reports/z_go_no_go_release_checklist.json',
    next_required_action: advisoryOnlyBridgeNoGo
      ? 'Advisory bridge lane active; continue lowering blocked ratio toward strict <=2 target'
      : 'Resolve failed gates until verdict is GO',
    followup_owner: 'Z-Hierarchy Chief',
    details: advisoryOnlyBridgeNoGo
      ? `${goNoGoBlockers.join(' | ')} | advisory-softened-by=qosmei_clear`
      : goNoGoBlockers.join(' | '),
  });

  pushLeaf(nodes, {
    system_id: 'cross_project_observer',
    system_name: 'Cross-Project Observer',
    status_color: crossProject?.status,
    last_updated_at: crossProject?.generated_at,
    evidence_ref: 'data/reports/z_cross_project_observer.json',
    next_required_action: 'Fix bad/warn entries or document accepted exceptions',
    followup_owner: 'Z-EAII',
    details: `total=${crossProject?.summary?.total ?? 0}, bad=${crossProject?.summary?.bad ?? 0}, warn=${crossProject?.summary?.warn ?? 0}`,
  });

  pushLeaf(nodes, {
    system_id: 'zuno_core_state',
    system_name: 'Zuno Core State',
    status_color: zunoCoreColor,
    last_updated_at: zuno?.generated_at,
    evidence_ref: 'data/reports/zuno_system_state_report.json',
    next_required_action: zunoAdvisoryPromoteGreen
      ? 'Advisory-ready state: maintain hygiene remediations until internal_operations natively reports stable-green'
      : zunoAdvisorySoftHold
      ? 'Advisory-soft hold: keep hygiene remediations active until internal_operations becomes stable-green'
      : 'Keep system-state refresh cadence active',
    followup_owner: 'Zuno Observer',
    details: zunoAdvisoryPromoteGreen
      ? `readiness=${readinessPass}/${readinessTotal}; p1_open=${p1Open}; advisory-promoted-by=qosmei_clear+commflow_healthy`
      : zunoAdvisorySoftHold
      ? `readiness=${readinessPass}/${readinessTotal}; p1_open=${p1Open}; advisory-softened-by=qosmei_clear`
      : `readiness=${readinessPass}/${readinessTotal}; p1_open=${p1Open}`,
  });

  pushLeaf(nodes, {
    system_id: 'disturbance_watch',
    system_name: 'Disturbance Watch',
    status_color: aiStatus?.disturbance_watch?.status || zuno?.executive_status?.disturbance_watch,
    last_updated_at: aiStatus?.generated_at || zuno?.generated_at,
    evidence_ref: 'data/reports/z_ai_status.json',
    next_required_action: 'Run diagnostics and clear failed checks',
    followup_owner: 'Z-Super Auto-Codex',
    details: `risk=${aiStatus?.disturbance_watch?.risk_class || 'unknown'}; failed=${aiStatus?.disturbance_watch?.failed_checks ?? 'n/a'}`,
  });

  pushLeaf(nodes, {
    system_id: 'ai_tower',
    system_name: 'AI Tower',
    status_color: aiStatus?.ai_tower?.status,
    last_updated_at: aiStatus?.generated_at,
    evidence_ref: 'data/reports/z_ai_status.json',
    next_required_action: aiStatus?.ai_tower?.planned_rollout_only
      ? 'Blueprint lane: manifest agents remain planned-only until promotion gates pass'
      : 'Promote planned tower agents only after readiness passes',
    followup_owner: 'AI Tower Coordinator',
    details: aiStatus?.ai_tower?.planned_rollout_only
      ? `agent_count=${aiStatus?.ai_tower?.agent_count ?? 0}; manifest=planned-rollout-only; phase=${
          aiStatus?.ai_tower?.tower_phase || 'blueprint'
        }; intent=${aiStatus?.ai_tower?.intent_surface || 'planned_agents_manifest_only'}; observer_snapshot_only`
      : `agent_count=${aiStatus?.ai_tower?.agent_count ?? 0}; phase=${
          aiStatus?.ai_tower?.tower_phase ?? 'n/a'
        }; intent=${aiStatus?.ai_tower?.intent_surface ?? 'n/a'}`,
  });

  pushLeaf(nodes, {
    system_id: 'mini_bots',
    system_name: 'Mini Bots',
    status_color: miniBotsAllOnline || miniBotsAdvisoryPromoteGreen ? 'green' : 'amber',
    last_updated_at: aiStatus?.generated_at,
    evidence_ref: 'data/reports/z_ai_status.json',
    next_required_action: miniBotsAdvisoryPromoteGreen
      ? 'Advisory-ready: keep heartbeat and migrate mini-bots to active online states when approved'
      : 'Keep observer heartbeat active and attach stage logs',
    followup_owner: 'Mini-Bot Observer',
    details: miniBotsAdvisoryPromoteGreen
      ? `online=${Array.isArray(aiStatus?.miniai) ? aiStatus.miniai.filter((x) => x.online).length : 0}/${
          Array.isArray(aiStatus?.miniai) ? aiStatus.miniai.length : 0
        }; advisory-promoted-by=qosmei_clear+commflow_healthy`
      : `online=${Array.isArray(aiStatus?.miniai) ? aiStatus.miniai.filter((x) => x.online).length : 0}/${
          Array.isArray(aiStatus?.miniai) ? aiStatus.miniai.length : 0
        }`,
  });

  pushLeaf(nodes, {
    system_id: 'trust_scorecard',
    system_name: 'Trust Scorecard',
    status_color: trustScore >= 85 ? 'green' : trustScore >= 70 ? 'amber' : 'red',
    last_updated_at: trust?.generated_at || release?.generated_at,
    evidence_ref: 'data/reports/z_trust_scorecard.json',
    next_required_action: 'Raise trust score to >=85 for release readiness',
    followup_owner: 'Trust Lane',
    details: `trust_score=${trustScore}`,
  });

  pushLeaf(nodes, {
    system_id: 'bridge_intelligence',
    system_name: 'Bridge Intelligence',
    status_color: bridgeIntelStatusColor,
    last_updated_at: bridge?.generated_at,
    evidence_ref: 'data/reports/z_bridge_intelligence_summary.json',
    next_required_action: bridgeIntelAdvisoryGreen
      ? 'Advisory-complete: blocked_fairness events bounded at current log slice; successes dominate — keep fairness reviews; strict green targets <=2 blocked events'
      : bridgeBlocked <= 2
      ? 'Keep bridge allocation fairness rhythm and intelligence summary refreshed'
      : 'Lower blocked allocation trend (blocked_fairness events) and rerun bridge intelligence summary',
    followup_owner: 'Bridge IQ Lane',
    details: bridgeIntelAdvisoryGreen
      ? `blocked_allocations=${bridgeBlocked}; allocation_success=${bridgeSuccess}; fairness_signals=log_blocked_fairness_vs_success; advisory-promoted-by=readiness+qosmei_clear+trust+go+commflow_healthy`
      : `blocked_allocations=${bridgeBlocked}; allocation_success=${bridgeSuccess}; fairness_signals=log_blocked_fairness_vs_success`,
  });

  pushLeaf(nodes, {
    system_id: 'qosmei_core_signal',
    system_name: 'Z-QOSMEI Core Signal',
    status_color: qosmeiColor,
    last_updated_at: qosmei?.generated_at,
    evidence_ref: 'data/reports/z_qosmei_core_signal.json',
    next_required_action:
      qosmeiColor === 'red'
        ? 'Re-run awareness chain and qosmei:signal until posture stabilizes'
        : 'Keep QOSMEI fusion cadence aligned with whale-bus runs',
    followup_owner: 'QOSMEI Lane',
    details: `posture=${qosmeiPosture}; composite=${qosmeiComposite}; lane=${qosmei?.lane_priority || 'unknown'}`,
  });

  pushLeaf(nodes, {
    system_id: 'ide_commflow_guard',
    system_name: 'IDE Comm-Flow Guard',
    status_color: ideGuard?.status,
    last_updated_at: ideGuard?.generated_at,
    evidence_ref: 'data/reports/z_ide_commflow_guard.json',
    next_required_action: 'Fix route mismatches and ensure VS Code settings checks pass',
    followup_owner: 'Operator IDE Lane',
    details: `mismatches=${ideGuard?.scan?.mismatch_count ?? 'n/a'}`,
  });

  pushLeaf(nodes, {
    system_id: 'lab_folder_boost',
    system_name: 'Lab + Folder Manager Boost',
    status_color: labBoost?.status,
    last_updated_at: labBoost?.generated_at,
    evidence_ref: 'data/reports/z_lab_folder_manager_boost.json',
    next_required_action: 'Resolve dormant signals and keep lab/folder heartbeat active',
    followup_owner: 'Z-Labs / Folder Manager',
    details: Array.isArray(labBoost?.dormant_signals) ? `dormant=${labBoost.dormant_signals.length}` : '',
  });

  const summary = countsByColor(nodes);
  const overall_status = summary.red > 0 ? 'red' : summary.amber > 0 ? 'amber' : summary.green > 0 ? 'green' : 'unknown';

  return {
    generated_at: nowIso(),
    schema_version: '1.0',
    purpose: 'Unified communications-flow verifier with leaf feedback for AI ecosystem handoff',
    overall_status,
    summary: {
      total_systems: nodes.length,
      colors: summary,
    },
    gates_snapshot: {
      readiness: `${readinessPass}/${readinessTotal}`,
      p1_open: p1Open,
      trust_score: trustScore,
      go_no_go: String(goNoGo?.verdict || 'unknown'),
      enforcer_action: String(enforcer?.action || 'unknown'),
      qosmei: `${qosmeiComposite} (${qosmeiPosture})`,
    },
    nodes,
  };
}

function toMarkdown(payload) {
  const lines = [
    '# Z Ecosystem Comm-Flow Verifier',
    '',
    `Generated: ${payload.generated_at}`,
    `Overall status: **${payload.overall_status.toUpperCase()}**`,
    '',
    `Readiness: ${payload.gates_snapshot.readiness} | P1 open: ${payload.gates_snapshot.p1_open} | Trust: ${payload.gates_snapshot.trust_score} | GO/NO-GO: ${payload.gates_snapshot.go_no_go} | Enforcer: ${payload.gates_snapshot.enforcer_action}`,
    '',
    '| System | Color | Stage | Handoff Ready | Follow-up Owner | Next Required Action |',
    '| --- | --- | --- | --- | --- | --- |',
    ...payload.nodes.map(
      (node) =>
        `| ${node.system_name} | ${node.status_color} | ${node.stage} | ${node.handoff_ready ? 'yes' : 'no'} | ${
          node.followup_owner
        } | ${String(node.next_required_action || '').replace(/\|/g, '/')} |`
    ),
    '',
    '## Leaf Feedback',
    ...payload.nodes.map((node) => `- ${node.system_id}: ${node.details || 'no extra details'} (${node.evidence_ref})`),
    '',
  ];
  return `${lines.join('\n')}\n`;
}

function main() {
  const payload = buildPayload();
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, toMarkdown(payload), 'utf8');
  console.log(`Ecosystem comm-flow verifier: ${OUT_JSON} status=${payload.overall_status}`);
  if (payload.overall_status === 'red') process.exitCode = 1;
}

main();
