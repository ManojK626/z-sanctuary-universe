#!/usr/bin/env node
/**
 * Z-SSWS-LINK-1 — Workspace spine launch requirements (read-only).
 * Validates registry + policy; no extension install, server start, deploy, or child project edits.
 * Exit 1 only when overall_signal is RED.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const REG_PATH = path.join(ROOT, 'data', 'z_ssws_workspace_spine_registry.json');
const POL_PATH = path.join(ROOT, 'data', 'z_ssws_launch_requirements_policy.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_ssws_launch_requirements_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_ssws_launch_requirements_report.md');

const SCHEMA_REPORT = 'z_ssws_launch_requirements_report_v1';

const PROJECT_KEYS = [
  'project_id',
  'display_name',
  'project_path_or_external_note',
  'workspace_type',
  'launch_profile',
  'required_extensions',
  'recommended_extensions',
  'required_node_version',
  'package_manager',
  'install_command',
  'start_command',
  'verify_commands',
  'smoke_commands',
  'api_readiness_ref',
  'api_spine_ref',
  'awareness_ref',
  'indicator_ref',
  'shadow_workspace_allowed',
  'shadow_workspace_notes',
  'local_ports',
  'local_port_share_with',
  'secrets_required',
  'data_sensitivity',
  'child_safety_relevance',
  'deployment_status',
  'cloudflare_status',
  'autonomy_level',
  'required_for_daily_status',
  'required_for_launch',
  'deploy_lane_doc_ref',
  'allowed_auto_checks',
  'human_gated_actions',
  'forbidden_auto_actions',
  'related_docs',
  'related_reports',
  'known_hold_reason',
];

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    return { __error: e.message };
  }
}

function rankSeverity(s) {
  const u = String(s || '').toUpperCase();
  if (u === 'RED') return 4;
  if (u === 'BLUE') return 3;
  if (u === 'YELLOW') return 2;
  if (u === 'GREEN') return 1;
  return 0;
}

function maxSeverity(a, b) {
  return rankSeverity(a) >= rankSeverity(b) ? a : b;
}

function isNonEmptyArray(a) {
  return Array.isArray(a) && a.some((x) => String(x || '').trim());
}

function validatePolicy(pol) {
  const issues = [];
  if (!pol || pol.__error) {
    issues.push({ project_id: '—', severity: 'RED', code: 'policy_parse', message: pol?.__error || 'Policy missing.' });
    return issues;
  }
  if (!pol.alert_policy) {
    issues.push({ project_id: '—', severity: 'YELLOW', code: 'alert_policy', message: 'alert_policy block missing.' });
  }
  return issues;
}

function validateRegistryTop(reg) {
  const issues = [];
  if (!reg || reg.__error) {
    issues.push({ project_id: '—', severity: 'RED', code: 'registry_parse', message: reg?.__error || 'Registry missing.' });
    return issues;
  }
  if (reg.schema !== 'z_ssws_workspace_spine_registry_v1') {
    issues.push({ project_id: '—', severity: 'YELLOW', code: 'registry_schema', message: 'Unexpected registry schema.' });
  }
  if (!Array.isArray(reg.spines)) {
    issues.push({ project_id: '—', severity: 'RED', code: 'spines', message: 'spines must be an array.' });
  }
  if (!Array.isArray(reg.projects)) {
    issues.push({ project_id: '—', severity: 'RED', code: 'projects', message: 'projects must be an array.' });
  }
  return issues;
}

function validateProjectRow(p) {
  const issues = [];
  const id = p?.project_id || '—';
  for (const k of PROJECT_KEYS) {
    if (!(k in p)) {
      issues.push({ project_id: id, severity: 'RED', code: 'project_field', message: `Missing field: ${k}` });
    }
  }
  if (typeof p.shadow_workspace_allowed !== 'boolean') {
    issues.push({ project_id: id, severity: 'RED', code: 'shadow_flag', message: 'shadow_workspace_allowed must be boolean.' });
  }
  if (typeof p.secrets_required !== 'boolean') {
    issues.push({ project_id: id, severity: 'RED', code: 'secrets_flag', message: 'secrets_required must be boolean.' });
  }
  if (typeof p.child_safety_relevance !== 'boolean') {
    issues.push({ project_id: id, severity: 'RED', code: 'child_flag', message: 'child_safety_relevance must be boolean.' });
  }
  if (typeof p.required_for_daily_status !== 'boolean') {
    issues.push({ project_id: id, severity: 'RED', code: 'rfd', message: 'required_for_daily_status must be boolean.' });
  }
  if (typeof p.required_for_launch !== 'boolean') {
    issues.push({ project_id: id, severity: 'RED', code: 'rfl', message: 'required_for_launch must be boolean.' });
  }
  const arrKeys = [
    'required_extensions',
    'recommended_extensions',
    'verify_commands',
    'smoke_commands',
    'local_ports',
    'local_port_share_with',
    'allowed_auto_checks',
    'human_gated_actions',
    'forbidden_auto_actions',
    'related_docs',
    'related_reports',
  ];
  for (const k of arrKeys) {
    if (!Array.isArray(p[k])) {
      issues.push({ project_id: id, severity: 'RED', code: k, message: `${k} must be an array.` });
    }
  }
  if (p.forbidden_auto_actions && p.forbidden_auto_actions.length === 0) {
    issues.push({
      project_id: id,
      severity: 'YELLOW',
      code: 'forbidden_empty',
      message: 'forbidden_auto_actions is empty — add explicit forbidden patterns for launch posture.',
    });
  }
  const ws = String(p.workspace_type || '').toLowerCase();
  const isRef = ws === 'reference_only';
  if (!isRef) {
    if (!String(p.required_node_version || '').trim()) {
      issues.push({ project_id: id, severity: 'YELLOW', code: 'node_version', message: 'Missing required_node_version hint for non-reference project.' });
    }
    if (!String(p.package_manager || '').trim()) {
      issues.push({ project_id: id, severity: 'YELLOW', code: 'package_manager', message: 'Missing package_manager hint for non-reference project.' });
    }
  }
  if (Array.isArray(p.required_extensions) && p.required_extensions.length > 0) {
    issues.push({
      project_id: id,
      severity: isRef ? 'YELLOW' : 'YELLOW',
      code: 'extension_manifest',
      message: 'required_extensions non-empty — operator must confirm installs; no auto-install in LINK-1.',
    });
  }
  if (p.required_for_launch && (!Array.isArray(p.required_extensions) || p.required_extensions.length === 0)) {
    issues.push({
      project_id: id,
      severity: 'YELLOW',
      code: 'launch_ext_manifest',
      message: 'required_for_launch true but required_extensions empty — clarify extension posture.',
    });
  }
  if (p.required_for_daily_status) {
    const hold = String(p.known_hold_reason || '').trim();
    if (!isNonEmptyArray(p.verify_commands) && !hold) {
      issues.push({
        project_id: id,
        severity: 'RED',
        code: 'daily_verify',
        message: 'required_for_daily_status true but verify_commands empty without known_hold_reason.',
      });
    }
    if (!isNonEmptyArray(p.smoke_commands) && !hold) {
      issues.push({
        project_id: id,
        severity: 'RED',
        code: 'daily_smoke',
        message: 'required_for_daily_status true but smoke_commands empty without known_hold_reason.',
      });
    }
  }
  if (p.secrets_required) {
    issues.push({
      project_id: id,
      severity: 'BLUE',
      code: 'secrets_human',
      message: 'secrets_required true — AMK/human confirms vault and CI posture before launch.',
    });
  }
  const deployActive = /^(LIVE|GO|STAGING_OPEN|PUBLISHED)$/i.test(String(p.deployment_status || ''));
  if (deployActive && !String(p.deploy_lane_doc_ref || '').trim()) {
    issues.push({
      project_id: id,
      severity: 'BLUE',
      code: 'deploy_lane',
      message: 'deployment_status implies active lane without deploy_lane_doc_ref — AMK charter required.',
    });
  }
  const cf = String(p.cloudflare_status || '');
  if (cf === 'LIVE' || cf === 'BOUND') {
    issues.push({
      project_id: id,
      severity: 'BLUE',
      code: 'cloudflare_human',
      message: 'cloudflare_status indicates edge bind — AMK decision and charter required.',
    });
  }
  return issues;
}

function duplicateProjectIds(projects) {
  const seen = new Map();
  for (const p of projects) {
    const id = String(p.project_id || '');
    if (!id) continue;
    seen.set(id, (seen.get(id) || 0) + 1);
  }
  return [...seen.entries()].filter(([, c]) => c > 1).map(([id]) => id);
}

function portCollisions(projects) {
  const portMap = new Map();
  for (const p of projects) {
    const ports = Array.isArray(p.local_ports) ? p.local_ports : [];
    for (const raw of ports) {
      const n = String(raw || '').replace(/\/tcp$/i, '').trim();
      if (!n || !/^\d+$/.test(n)) continue;
      if (!portMap.has(n)) portMap.set(n, []);
      portMap.get(n).push(p);
    }
  }
  const collisions = [];
  for (const [port, list] of portMap) {
    if (list.length < 2) continue;
    const ids = list.map((x) => x.project_id);
    let ok = true;
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < list.length; j++) {
        if (i === j) continue;
        const a = list[i];
        const b = list[j];
        const share = Array.isArray(a.local_port_share_with) ? a.local_port_share_with.map(String) : [];
        if (!share.includes(String(b.project_id))) ok = false;
      }
    }
    if (ok) continue;
    const anyApproved = list.some((x) => String(x.launch_profile || '') === 'approved_local_dev');
    collisions.push({
      port,
      project_ids: ids,
      severity: anyApproved ? 'RED' : 'YELLOW',
      code: anyApproved ? 'port_collision_approved_dev' : 'port_collision_advisory',
    });
  }
  return collisions;
}

function main() {
  const generatedAt = new Date().toISOString();
  const reg = readJson(REG_PATH);
  const pol = readJson(POL_PATH);

  let issues = [];
  issues = issues.concat(validatePolicy(pol));
  issues = issues.concat(validateRegistryTop(reg));

  const projects = reg && Array.isArray(reg.projects) ? reg.projects : [];
  const summaries = [];
  const extensionGaps = [];

  for (const p of projects) {
    issues = issues.concat(validateProjectRow(p));
    summaries.push({
      project_id: p.project_id,
      display_name: p.display_name,
      workspace_type: p.workspace_type,
      launch_profile: p.launch_profile,
      secrets_required: p.secrets_required,
      deployment_status: p.deployment_status,
    });
    const extIssue = issues.find((i) => i.project_id === p.project_id && i.code === 'extension_manifest');
    if (extIssue) extensionGaps.push({ project_id: p.project_id, detail: extIssue.message });
  }

  const dupIds = duplicateProjectIds(projects);
  for (const id of dupIds) {
    issues.push({ project_id: id, severity: 'RED', code: 'duplicate_project_id', message: `Duplicate project_id: ${id}` });
  }

  const portCols = portCollisions(projects);
  for (const c of portCols) {
    issues.push({
      project_id: c.project_ids.join('|'),
      severity: c.severity,
      code: c.code,
      message: `Port ${c.port} shared by ${c.project_ids.join(', ')} without mutual local_port_share_with.`,
    });
  }

  let overall = 'GREEN';
  for (const iss of issues) {
    overall = maxSeverity(overall, iss.severity);
  }

  const notificationCandidates = [];
  for (const iss of issues) {
    if (iss.severity === 'RED' || iss.severity === 'BLUE') {
      notificationCandidates.push({
        signal: iss.severity,
        title: `${iss.severity}: ${iss.code}`,
        detail: `${iss.project_id}: ${iss.message}`,
      });
    }
  }

  const dedup = [];
  const seen = new Set();
  for (const n of notificationCandidates) {
    const k = `${n.signal}|${n.title}|${n.detail}`;
    if (seen.has(k)) continue;
    seen.add(k);
    dedup.push(n);
  }

  const payload = {
    schema: SCHEMA_REPORT,
    generated_at: generatedAt,
    overall_signal: overall,
    registry_path: path.relative(ROOT, REG_PATH).split(path.sep).join('/'),
    policy_path: path.relative(ROOT, POL_PATH).split(path.sep).join('/'),
    projects: summaries,
    extension_gaps: extensionGaps,
    port_collision_notes: portCols,
    issues,
    notification_candidates_red_blue_only: dedup.filter((n) => n.signal === 'RED' || n.signal === 'BLUE'),
    law_note: pol && !pol.__error ? pol.law_note : '',
    note: 'YELLOW extension or metadata gaps stay off AMK notifications by default. No auto-launch in SSWS-LINK-1.',
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-SSWS-LINK-1 — Launch requirements report',
    '',
    `- Generated: ${generatedAt}`,
    `- Overall signal: **${overall}**`,
    `- Registry: \`${payload.registry_path}\``,
    `- Policy: \`${payload.policy_path}\``,
    '',
    '## Projects',
    '',
    ...summaries.map(
      (r) =>
        `- **${r.project_id}** — ${r.display_name} (${r.workspace_type}, profile=${r.launch_profile}, secrets=${r.secrets_required}, deploy=${r.deployment_status})`,
    ),
    '',
    '## Extension advisory gaps',
    '',
    ...(extensionGaps.length ? extensionGaps.map((g) => `- **${g.project_id}**: ${g.detail}`) : ['- (none)']),
    '',
    '## Port collisions',
    '',
    ...(portCols.length ? portCols.map((c) => `- **${c.severity}** port ${c.port}: ${c.project_ids.join(', ')}`) : ['- (none)']),
    '',
    '## Issues',
    '',
    ...(issues.length ? issues.map((i) => `- [${i.severity}] **${i.project_id}** ${i.code}: ${i.message}`) : ['- (none)']),
    '',
    '## AMK notification candidates (RED / BLUE only)',
    '',
    ...(payload.notification_candidates_red_blue_only.length
      ? payload.notification_candidates_red_blue_only.map((n) => `- **${n.signal}** ${n.title} — ${n.detail}`)
      : ['- (none)']),
    '',
    payload.law_note ? `## Law\n\n${payload.law_note}\n` : '',
    '',
    payload.note,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(JSON.stringify({ ok: true, overall_signal: overall, out_json: OUT_JSON, out_md: OUT_MD }, null, 2));

  process.exit(overall === 'RED' ? 1 : 0);
}

main();
