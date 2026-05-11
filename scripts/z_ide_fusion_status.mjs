#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const REGISTRY_PATH = path.join(ROOT, 'data', 'z_ide_fusion_control_registry.json');
const ACTIVE_SESSIONS_PATH = path.join(ROOT, 'data', 'ide-fusion', 'active_sessions.json');
const HANDOFF_PATH = path.join(ROOT, 'data', 'ide-fusion', 'handoff_journal.jsonl');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_ide_fusion_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_ide_fusion_report.md');

const HIGH_RISK_FILES = new Set([
  'package.json',
  'data/z_autonomy_task_policy.json',
  'dashboard/data/amk_project_indicators.json',
  'data/amk_operator_notifications.json',
]);

function rank(signal) {
  const s = String(signal || '').toUpperCase();
  if (s === 'RED') return 4;
  if (s === 'BLUE') return 3;
  if (s === 'YELLOW') return 2;
  if (s === 'GREEN') return 1;
  return 0;
}

function maxSignal(a, b) {
  return rank(b) > rank(a) ? b : a;
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return { missing: true };
  try {
    return { data: JSON.parse(fs.readFileSync(filePath, 'utf8')) };
  } catch (error) {
    return { error: error.message };
  }
}

function normalizePath(p) {
  return String(p || '').replace(/\\/g, '/').toLowerCase();
}

function parseJsonlIfExists(filePath) {
  if (!fs.existsSync(filePath)) return { missing: true, rows: [] };
  try {
    const lines = fs
      .readFileSync(filePath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const rows = lines.map((line) => JSON.parse(line));
    return { rows };
  } catch (error) {
    return { error: error.message, rows: [] };
  }
}

function main() {
  const generatedAt = new Date().toISOString();
  const issues = [];
  const notifications = [];
  let overall = 'GREEN';

  const regRead = readJsonIfExists(REGISTRY_PATH);
  if (regRead.missing) {
    issues.push({ signal: 'RED', code: 'registry_missing', message: 'Fusion registry is missing.' });
  } else if (regRead.error) {
    issues.push({ signal: 'RED', code: 'registry_parse', message: `Registry parse failed: ${regRead.error}` });
  }
  const registry = regRead.data || {};

  const sessionRead = readJsonIfExists(ACTIVE_SESSIONS_PATH);
  let sessions = [];
  if (sessionRead.missing) {
    issues.push({ signal: 'YELLOW', code: 'sessions_missing', message: 'active_sessions.json missing (advisory).' });
  } else if (sessionRead.error) {
    issues.push({ signal: 'RED', code: 'sessions_parse', message: `active_sessions.json parse failed: ${sessionRead.error}` });
  } else {
    sessions = Array.isArray(sessionRead.data?.sessions) ? sessionRead.data.sessions : [];
  }

  const handoffRead = parseJsonlIfExists(HANDOFF_PATH);
  let handoffs = [];
  if (handoffRead.missing) {
    issues.push({ signal: 'YELLOW', code: 'handoff_missing', message: 'handoff_journal.jsonl missing (advisory).' });
  } else if (handoffRead.error) {
    issues.push({ signal: 'RED', code: 'handoff_parse', message: `handoff_journal.jsonl parse failed: ${handoffRead.error}` });
  } else {
    handoffs = handoffRead.rows;
  }

  for (const s of sessions) {
    const sid = s.session_id || 'unknown_session';
    if (!s.ide) issues.push({ signal: 'RED', code: 'session_ide_missing', message: `${sid}: ide missing` });
    if (!s.repo_root) issues.push({ signal: 'RED', code: 'session_root_missing', message: `${sid}: repo_root missing` });
    if (!s.workspace_id) issues.push({ signal: 'RED', code: 'session_workspace_missing', message: `${sid}: workspace_id missing` });
    if (!s.intended_task) issues.push({ signal: 'RED', code: 'session_task_missing', message: `${sid}: intended_task missing` });
    if (s.forbidden_actions_acknowledged !== true) {
      issues.push({ signal: 'RED', code: 'session_forbidden_ack_missing', message: `${sid}: forbidden_actions_acknowledged must be true` });
    }

    const rr = normalizePath(s.repo_root);
    if (rr.includes('/.cursor/projects/') || rr.endsWith('/.cursor/projects')) {
      issues.push({ signal: 'RED', code: 'wrong_root_cursor_projects', message: `${sid}: repo_root points into .cursor/projects` });
      notifications.push({ signal: 'RED', title: 'Wrong repo root', detail: `${sid} uses .cursor/projects as root.` });
    }
    if (rr.includes('/archive') || rr.includes('/cache')) {
      const intent = normalizePath(s.intended_task);
      if (intent.includes('package.json') || intent.includes('npm init')) {
        issues.push({ signal: 'RED', code: 'package_init_archive', message: `${sid}: package action declared in archive/cache path` });
        notifications.push({ signal: 'RED', title: 'Unsafe package action path', detail: `${sid} declared package action in archive/cache.` });
      }
    }

    if (s.requires_amk_decision === true) {
      issues.push({ signal: 'BLUE', code: 'amk_decision_required', message: `${sid}: AMK decision explicitly required` });
      notifications.push({ signal: 'BLUE', title: 'AMK decision required', detail: `${sid} requested AMK decision gate.` });
    }
  }

  for (const s of sessions) {
    const sid = s.session_id || '';
    const hasHandoff = handoffs.some((h) => String(h.session_id || '') === String(sid));
    if (!hasHandoff) issues.push({ signal: 'YELLOW', code: 'session_no_handoff', message: `${sid || 'unknown'}: no handoff row yet` });
  }

  const sameProject = new Map();
  for (const s of sessions) {
    const project = String(s.project_id || '');
    if (!project) continue;
    if (!sameProject.has(project)) sameProject.set(project, []);
    sameProject.get(project).push(s);
  }
  for (const [project, list] of sameProject.entries()) {
    if (list.length > 1) {
      issues.push({ signal: 'YELLOW', code: 'same_project_parallel', message: `${project}: multiple active sessions (${list.length})` });
    }
  }

  const fileTouchMap = new Map();
  for (const s of sessions) {
    const sid = s.session_id || 'unknown_session';
    const files = Array.isArray(s.files_expected_to_touch) ? s.files_expected_to_touch : [];
    for (const f of files) {
      const key = normalizePath(f);
      if (!fileTouchMap.has(key)) fileTouchMap.set(key, []);
      fileTouchMap.get(key).push(sid);
    }
  }
  for (const [file, ids] of fileTouchMap.entries()) {
    if (ids.length > 1) {
      const base = file.split('/').pop();
      const isHighRisk = HIGH_RISK_FILES.has(base || '');
      const hasRecentHandoff = handoffs.length > 0;
      if (isHighRisk && !hasRecentHandoff) {
        issues.push({ signal: 'RED', code: 'high_risk_collision_no_handoff', message: `${file}: high-risk file touched by multiple sessions without handoff` });
        notifications.push({ signal: 'RED', title: 'Unsafe edit collision', detail: `${file} touched by ${ids.join(', ')}` });
      } else {
        issues.push({ signal: 'YELLOW', code: 'shared_file_watch', message: `${file}: shared touch across sessions` });
      }
    }
  }

  for (const i of issues) overall = maxSignal(overall, i.signal);
  if (sessions.length === 0 && !regRead.missing && !regRead.error && overall === 'GREEN') overall = 'GREEN';

  const latestHandoff = handoffs.length ? handoffs[handoffs.length - 1] : null;
  const payload = {
    schema: 'z_ide_fusion_report_v1',
    generated_at: generatedAt,
    overall_signal: overall,
    registry_valid: !regRead.missing && !regRead.error,
    active_sessions_status: sessionRead.missing ? 'UNKNOWN' : sessions.length > 0 ? 'ACTIVE' : 'IDLE',
    handoff_status: handoffRead.missing ? 'UNKNOWN' : handoffs.length > 0 ? 'PRESENT' : 'EMPTY',
    session_count: sessions.length,
    latest_handoff: latestHandoff
      ? {
          timestamp: latestHandoff.timestamp || null,
          summary: latestHandoff.summary || null,
          session_id: latestHandoff.session_id || null,
        }
      : null,
    conflict_risk: issues.some((i) => i.signal === 'RED') ? 'block' : issues.some((i) => i.signal === 'YELLOW') ? 'watch' : 'none',
    next_amk_action: issues.some((i) => i.signal === 'BLUE')
      ? 'review'
      : issues.some((i) => i.signal === 'RED')
        ? 'hold'
        : 'approve_continued_docs_checks',
    amk_notification_candidates: notifications,
    issues,
    locked_law: [
      'IDE fusion != IDE remote control.',
      'Shared handoff != execution.',
      'Shadow workspace != deploy.',
      'Active session != permission.',
      'GREEN != deploy.',
      'BLUE requires AMK.',
      'RED blocks movement.',
      'AMK-Goku owns sacred moves.',
    ],
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-IDE-FUSION-1 report',
    '',
    `- Generated: ${generatedAt}`,
    `- Overall signal: **${payload.overall_signal}**`,
    `- Active sessions: **${payload.active_sessions_status}** (${payload.session_count})`,
    `- Handoff status: **${payload.handoff_status}**`,
    `- Conflict risk: **${payload.conflict_risk}**`,
    `- Next AMK action: **${payload.next_amk_action}**`,
    '',
    '## Latest handoff',
    '',
    payload.latest_handoff
      ? `- ${payload.latest_handoff.timestamp || 'unknown time'} — ${payload.latest_handoff.summary || 'no summary'} (${payload.latest_handoff.session_id || 'unknown'})`
      : '- (none)',
    '',
    '## Notification candidates (RED/BLUE only)',
    '',
    ...(payload.amk_notification_candidates.length
      ? payload.amk_notification_candidates.map((n) => `- **${n.signal}** ${n.title}: ${n.detail}`)
      : ['- (none)']),
    '',
    '## Issues',
    '',
    ...(issues.length ? issues.map((i) => `- [${i.signal}] **${i.code}**: ${i.message}`) : ['- (none)']),
    '',
    '## Locked law',
    '',
    ...payload.locked_law.map((line) => `- ${line}`),
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(JSON.stringify({ ok: true, overall_signal: overall, out_json: OUT_JSON, out_md: OUT_MD }, null, 2));
  process.exit(overall === 'RED' ? 1 : 0);
}

main();
