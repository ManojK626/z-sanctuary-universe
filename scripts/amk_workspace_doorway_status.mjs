#!/usr/bin/env node
/**
 * Z-SSWS-DOOR-1 — AMK Workspace Doorway: read-only status + reports.
 * Does not open folders, start servers, install extensions, or touch NAS/secrets.
 *
 * Usage (hub root):
 *   node scripts/amk_workspace_doorway_status.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.cwd();
const REG_PATH = path.join(ROOT, 'data', 'amk_workspace_doorway_registry.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'amk_workspace_doorway_status.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'amk_workspace_doorway_status.md');
const SCHEMA = 'amk_workspace_doorway_status_v1';

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function normPath(p) {
  if (p == null) return '';
  return String(p).trim().replace(/\\/g, '/');
}

function existsCaseAware(p) {
  const n = normPath(p);
  if (!n) return false;
  try {
    return fs.existsSync(n);
  } catch {
    return false;
  }
}

function resolveWorkspaceFull(project) {
  const base = normPath(project.path);
  const wf = String(project.workspace_file || '').trim();
  if (!wf) return '';
  if (path.isAbsolute(wf)) return normPath(wf);
  if (!base) return normPath(wf);
  return normPath(path.join(base, wf));
}

function cursorCliProbe() {
  const isWin = process.platform === 'win32';
  const cmd = isWin ? 'where' : 'which';
  const res = spawnSync(cmd, ['cursor'], {
    shell: isWin,
    encoding: 'utf8',
    windowsHide: true,
  });
  const ok = res.status === 0 && String(res.stdout || '').trim().length > 0;
  return {
    available: ok,
    command: `${cmd} cursor`,
    exitCode: res.status === null ? -1 : res.status,
    stdout_tail: String(res.stdout || '').trim().slice(0, 800),
    stderr_tail: String(res.stderr || '').trim().slice(0, 800),
  };
}

const SIGNAL_ORDER = { RED: 4, BLUE: 3, YELLOW: 2, GREEN: 1 };

function maxSignal(a, b) {
  const sa = SIGNAL_ORDER[a] ?? 0;
  const sb = SIGNAL_ORDER[b] ?? 0;
  return sa >= sb ? a : b;
}

function main() {
  const generated_at = new Date().toISOString();
  let reg;
  try {
    reg = readJson(REG_PATH);
  } catch (e) {
    const payload = {
      schema: SCHEMA,
      generated_at,
      overall_signal: 'RED',
      exit_hint: 1,
      error: `Cannot read registry: ${e?.message || e}`,
    };
    fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
    fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), 'utf8');
    fs.writeFileSync(
      OUT_MD,
      `# AMK Workspace Doorway status\n\n**Signal:** RED\n\n${payload.error}\n`,
      'utf8',
    );
    process.exit(1);
  }

  const projects = Array.isArray(reg.projects) ? reg.projects : [];
  const profiles = Array.isArray(reg.profiles) ? reg.profiles : [];
  const pathById = new Map();
  for (const p of projects) {
    if (p?.project_id) pathById.set(p.project_id, normPath(p.path));
  }
  const duplicatePaths = [];
  const invMap = new Map();
  for (const [id, fp] of pathById) {
    if (!fp) continue;
    if (!invMap.has(fp)) invMap.set(fp, []);
    invMap.get(fp).push(id);
  }
  for (const [fp, ids] of invMap) {
    if (ids.length > 1) duplicatePaths.push({ path: fp, project_ids: ids });
  }

  const cursor = cursorCliProbe();
  const rows = [];
  let worst = 'GREEN';

  for (const p of projects) {
    const tier = p.path_tier === 'optional' ? 'optional' : 'required';
    const wsTier = p.workspace_tier === 'optional' ? 'optional' : 'required';
    const pPath = normPath(p.path);
    const wsFull = resolveWorkspaceFull(p);

    let rowSignal = 'GREEN';
    const issues = [];

    if (p.secrets_required || p.nas_dependency) {
      rowSignal = maxSignal(rowSignal, 'BLUE');
      issues.push('BLUE: secrets or NAS declaration — manual AMK posture; doorway does not mount or read vault.');
    }
    if (p.human_gate_required) {
      rowSignal = maxSignal(rowSignal, 'BLUE');
      issues.push('BLUE: human_gate_required — AMK decision before treating as launch-ready.');
    }

    if (pPath) {
      if (!existsCaseAware(pPath)) {
        if (tier === 'required') {
          rowSignal = maxSignal(rowSignal, 'RED');
          issues.push('RED: required path missing on disk.');
        } else {
          rowSignal = maxSignal(rowSignal, 'YELLOW');
          issues.push('YELLOW: optional path missing on disk.');
        }
      }
    } else if (tier === 'required') {
      rowSignal = maxSignal(rowSignal, 'RED');
      issues.push('RED: required path empty in registry.');
    }

    if (String(p.workspace_file || '').trim()) {
      if (!existsCaseAware(wsFull)) {
        if (wsTier === 'required') {
          rowSignal = maxSignal(rowSignal, 'RED');
          issues.push('RED: workspace file missing.');
        } else {
          rowSignal = maxSignal(rowSignal, 'YELLOW');
          issues.push('YELLOW: workspace file missing (optional tier).');
        }
      }
    }

    if (duplicatePaths.some((d) => d.project_ids.includes(p.project_id))) {
      rowSignal = maxSignal(rowSignal, 'YELLOW');
      issues.push('YELLOW: duplicate path shared with another project_id (informational).');
    }

    worst = maxSignal(worst, rowSignal);

    rows.push({
      project_id: p.project_id,
      display_name: p.display_name,
      path: pPath,
      path_exists: pPath ? existsCaseAware(pPath) : null,
      workspace_resolved: wsFull || null,
      workspace_exists: wsFull ? existsCaseAware(wsFull) : null,
      path_tier: tier,
      workspace_tier: wsTier,
      signal: rowSignal,
      issues,
      nas_dependency: Boolean(p.nas_dependency),
      secrets_required: Boolean(p.secrets_required),
    });
  }

  if (!cursor.available) worst = maxSignal(worst, 'YELLOW');

  const profileSummaries = profiles.map((pr) => ({
    id: pr.id,
    display_name: pr.display_name,
    project_ids: pr.project_ids || [],
    open_dashboard_default: Boolean(pr.open_dashboard_default),
  }));

  const exitCode = worst === 'RED' ? 1 : 0;
  const payload = {
    schema: SCHEMA,
    generated_at,
    doorway_name: reg.doorway_name,
    mode: reg.mode,
    registry_schema: reg.schema,
    overall_signal: worst,
    duplicate_paths: duplicatePaths,
    cursor_cli: cursor,
    profiles: profileSummaries,
    projects: rows,
    nas_note:
      'NAS dependencies are declarations only; this script does not mount volumes or read credentials.',
    exit_hint: exitCode,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), 'utf8');

  const mdLines = [
    '# AMK Workspace Doorway status',
    '',
    `**Generated:** ${generated_at}`,
    '',
    `**Overall signal:** ${worst}`,
    '',
    '## Cursor CLI probe',
    '',
    `- **Available:** ${cursor.available}`,
    `- **Command:** \`${cursor.command}\``,
    '',
    '## Duplicate paths (informational)',
    '',
    duplicatePaths.length
      ? duplicatePaths.map((d) => `- \`${d.path}\` → ${d.project_ids.join(', ')}`).join('\n')
      : '- None detected',
    '',
    '## Projects',
    '',
    '| project_id | signal | path_exists | workspace_ok | notes |',
    '| ---------- | ------ | ----------- | ------------- | ----- |',
  ];
  for (const r of rows) {
    const wsOk =
      r.workspace_resolved == null ? 'n/a' : r.workspace_exists ? 'yes' : 'no';
    const pEx = r.path === '' ? 'n/a' : r.path_exists ? 'yes' : 'no';
    const note = (r.issues && r.issues[0]) || '—';
    mdLines.push(`| ${r.project_id} | ${r.signal} | ${pEx} | ${wsOk} | ${note.replace(/\|/g, '/')} |`);
  }
  mdLines.push('', '## Law', '', 'Doorway ≠ auto-launch. Open folder ≠ start server. NAS reference ≠ mount.');
  fs.writeFileSync(OUT_MD, mdLines.join('\n'), 'utf8');

  console.log(`AMK doorway status: ${worst} (exit ${exitCode})`);
  process.exit(exitCode);
}

main();
