#!/usr/bin/env node
/**
 * Z-SSWS-LAB-1 — Validate AMK Cursor workspace profiles + .code-workspace files.
 * Read-only: no server start, installs, deploy, secrets, or NAS.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.cwd();
const PROFILES_PATH = path.join(ROOT, 'data', 'amk_cursor_workspace_profiles.json');
const DOORWAY_PATH = path.join(ROOT, 'data', 'amk_workspace_doorway_registry.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'amk_cursor_workspace_profiles_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'amk_cursor_workspace_profiles_report.md');
const SCHEMA = 'amk_cursor_workspace_profiles_report_v1';

const SIGNAL_ORDER = { RED: 4, BLUE: 3, YELLOW: 2, GREEN: 1 };

function maxSignal(a, b) {
  const sa = SIGNAL_ORDER[a] ?? 0;
  const sb = SIGNAL_ORDER[b] ?? 0;
  return sa >= sb ? a : b;
}

function norm(p) {
  if (p == null) return '';
  return path.normalize(String(p).trim().replace(/\\/g, path.sep));
}

function exists(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

function resolveFolderPath(workspaceFile, folderPath) {
  const raw = String(folderPath || '').trim();
  if (!raw) return '';
  if (path.isAbsolute(raw)) return norm(raw);
  const base = path.dirname(workspaceFile);
  return norm(path.join(base, raw));
}

function isDedicatedNodeModulesRoot(abs) {
  const b = norm(abs);
  const leaf = b.split(path.sep).filter(Boolean).pop() || '';
  return leaf === 'node_modules';
}

function isDedicatedDistOrBuildRoot(abs) {
  const leaf = norm(abs).split(path.sep).filter(Boolean).pop() || '';
  return leaf === 'dist' || leaf === 'build';
}

function scanTasksForFolderOpen(ws) {
  const tasks = ws.tasks;
  if (!tasks || !Array.isArray(tasks.tasks)) return [];
  const hits = [];
  for (const t of tasks.tasks) {
    const ro = t?.runOptions?.runOn;
    if (ro === 'folderOpen') hits.push({ label: t.label || t.type || 'task', runOn: ro });
  }
  return hits;
}

function validateWorkspaceFile(wsAbs, label) {
  const issues = [];
  let signal = 'GREEN';
  if (!exists(wsAbs)) {
    return {
      label,
      workspace_file: wsAbs,
      signal: 'RED',
      issues: [{ level: 'RED', text: 'Workspace file missing.' }],
      folders: [],
      duplicate_folder_roots: [],
      folder_open_tasks: [],
    };
  }
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(wsAbs, 'utf8'));
  } catch (e) {
    return {
      label,
      workspace_file: wsAbs,
      signal: 'RED',
      issues: [{ level: 'RED', text: `Invalid JSON: ${e?.message || e}` }],
      folders: [],
      duplicate_folder_roots: [],
      folder_open_tasks: [],
    };
  }
  if (!parsed || !Array.isArray(parsed.folders)) {
    issues.push({ level: 'RED', text: 'Missing folders array.' });
    signal = maxSignal(signal, 'RED');
  }
  const folderAbs = [];
  const folders = parsed.folders || [];
  for (const f of folders) {
    const rel = f?.path;
    const abs = resolveFolderPath(wsAbs, rel);
    if (!abs) {
      issues.push({ level: 'YELLOW', text: 'Empty folder path entry.' });
      signal = maxSignal(signal, 'YELLOW');
      continue;
    }
    folderAbs.push(abs);
    if (!exists(abs)) {
      issues.push({ level: 'YELLOW', text: `Folder missing on disk: ${abs}` });
      signal = maxSignal(signal, 'YELLOW');
    }
    if (isDedicatedNodeModulesRoot(abs)) {
      issues.push({ level: 'RED', text: `Dedicated node_modules root is forbidden: ${abs}` });
      signal = maxSignal(signal, 'RED');
    }
    if (isDedicatedDistOrBuildRoot(abs)) {
      issues.push({ level: 'YELLOW', text: `Dedicated dist/build root (noisy): ${abs}` });
      signal = maxSignal(signal, 'YELLOW');
    }
  }
  const seen = new Map();
  const dups = [];
  for (const a of folderAbs) {
    const k = a.toLowerCase();
    seen.set(k, (seen.get(k) || 0) + 1);
  }
  for (const [k, n] of seen) {
    if (n > 1) dups.push(k);
  }
  const dupDisplay = dups.length ? dups.join('; ') : '';
  if (dups.length) {
    issues.push({ level: 'YELLOW', text: `Duplicate folder roots: ${dupDisplay}` });
    signal = maxSignal(signal, 'YELLOW');
  }
  const hubRoot = norm(ROOT);
  for (const a of folderAbs) {
    if (a === hubRoot || a === `${hubRoot}${path.sep}`) {
      issues.push({
        level: 'YELLOW',
        text: 'Hub root included as a folder — acceptable with search.exclude; watch Cursor load.',
      });
      signal = maxSignal(signal, 'YELLOW');
    }
  }
  const fo = scanTasksForFolderOpen(parsed);
  if (fo.length) {
    issues.push({
      level: 'RED',
      text: `Tasks with runOn folderOpen present (${fo.length}) — auto-run risk.`,
    });
    signal = maxSignal(signal, 'RED');
  }
  const se = parsed.settings?.['search.exclude'];
  if (!se || typeof se !== 'object' || Object.keys(se).length < 2) {
    issues.push({
      level: 'YELLOW',
      text: 'settings.search.exclude thin or missing — recommend node_modules/dist exclusions.',
    });
    signal = maxSignal(signal, 'YELLOW');
  }
  return {
    label,
    workspace_file: wsAbs,
    signal,
    issues,
    folders: folderAbs,
    duplicate_folder_roots: dups,
    folder_open_tasks: fo,
  };
}

function loadDoorwayProjectsById() {
  try {
    const d = JSON.parse(fs.readFileSync(DOORWAY_PATH, 'utf8'));
    const map = new Map();
    for (const p of d.projects || []) {
      if (p?.project_id) map.set(p.project_id, p);
    }
    return { map, ok: true };
  } catch {
    return { map: new Map(), ok: false };
  }
}

function main() {
  const generated_at = new Date().toISOString();
  let reg;
  try {
    reg = JSON.parse(fs.readFileSync(PROFILES_PATH, 'utf8'));
  } catch (e) {
    const fail = {
      schema: SCHEMA,
      generated_at,
      overall_signal: 'RED',
      exit_hint: 1,
      error: String(e?.message || e),
    };
    fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
    fs.writeFileSync(OUT_JSON, JSON.stringify(fail, null, 2), 'utf8');
    fs.writeFileSync(OUT_MD, `# AMK cursor workspace profiles\n\n**RED** — ${fail.error}\n`, 'utf8');
    console.error(fail.error);
    process.exit(1);
  }

  const { map: doorwayById, ok: doorwayOk } = loadDoorwayProjectsById();
  let worst = 'GREEN';
  const notes = [];

  if (!doorwayOk) notes.push('YELLOW: doorway registry not loaded for cross-checks.');

  const mainRel = reg.main_workspace?.workspace_relative;
  const mainWs = mainRel ? norm(path.join(ROOT, mainRel)) : '';
  const mainResult = mainWs
    ? validateWorkspaceFile(mainWs, 'main_control')
    : {
        label: 'main_control',
        workspace_file: '',
        signal: 'RED',
        issues: [{ level: 'RED', text: 'main_workspace.workspace_relative missing.' }],
        folders: [],
        duplicate_folder_roots: [],
        folder_open_tasks: [],
      };
  worst = maxSignal(worst, mainResult.signal);

  const deepResults = [];
  for (const d of reg.deep_work_profiles || []) {
    if (d.workspace_relative) {
      const wsAbs = norm(path.join(ROOT, d.workspace_relative));
      const r = validateWorkspaceFile(wsAbs, d.id);
      deepResults.push({ ...r, id: d.id, kind: 'workspace_file' });
      worst = maxSignal(worst, r.signal);
    } else if (d.doorway_project_id) {
      const proj = doorwayById.get(d.doorway_project_id);
      if (!proj) {
        worst = maxSignal(worst, 'YELLOW');
        deepResults.push({
          id: d.id,
          kind: 'doorway_project',
          doorway_project_id: d.doorway_project_id,
          signal: 'YELLOW',
          issues: [{ level: 'YELLOW', text: 'doorway_project_id not found in doorway registry.' }],
        });
        continue;
      }
      const pPath = norm(proj.path || '');
      let sig = 'GREEN';
      const iss = [];
      if (!pPath) {
        sig = maxSignal(sig, 'BLUE');
        iss.push({ level: 'BLUE', text: 'Empty path — AMK path decision required.' });
      } else if (!exists(pPath)) {
        const tier = proj.path_tier === 'optional' ? 'optional' : 'required';
        if (tier === 'required') {
          sig = maxSignal(sig, 'RED');
          iss.push({ level: 'RED', text: 'Required doorway path missing.' });
        } else {
          sig = maxSignal(sig, 'YELLOW');
          iss.push({ level: 'YELLOW', text: 'Optional doorway path missing.' });
        }
      }
      deepResults.push({
        id: d.id,
        kind: 'doorway_project',
        doorway_project_id: d.doorway_project_id,
        path: pPath,
        path_exists: pPath ? exists(pPath) : false,
        signal: sig,
        issues: iss,
      });
      worst = maxSignal(worst, sig);
    } else {
      worst = maxSignal(worst, 'YELLOW');
      deepResults.push({
        id: d.id,
        kind: 'unknown',
        signal: 'YELLOW',
        issues: [{ level: 'YELLOW', text: 'Neither workspace_relative nor doorway_project_id set.' }],
      });
    }
  }

  if (!doorwayOk) worst = maxSignal(worst, 'YELLOW');

  const exitCode = worst === 'RED' ? 1 : 0;
  const payload = {
    schema: SCHEMA,
    generated_at,
    phase: reg.phase,
    profile_name: reg.profile_name,
    overall_signal: worst,
    main_workspace_check: mainResult,
    deep_work_checks: deepResults,
    laws: reg.laws || [],
    notes,
    exit_hint: exitCode,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), 'utf8');

  const md = [
    '# AMK Cursor workspace profiles (Z-SSWS-LAB-1)',
    '',
    `**Generated:** ${generated_at}`,
    '',
    `**Overall signal:** ${worst}`,
    '',
    '## Main workspace',
    '',
    `- **Signal:** ${mainResult.signal}`,
    `- **File:** \`${mainResult.workspace_file}\``,
    '',
    '## Deep work / doorway cross-checks',
    '',
    '| id | kind | signal | notes |',
    '| -- | ---- | ------ | ----- |',
  ];
  for (const row of deepResults) {
    const n = (row.issues && row.issues[0] && row.issues[0].text) || '—';
    md.push(`| ${row.id} | ${row.kind} | ${row.signal} | ${String(n).replace(/\|/g, '/')} |`);
  }
  md.push('', '## Law', '', 'Workspace merge ≠ repo merge. Open workspace ≠ run project.');
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(`AMK workspace profiles: ${worst} (exit ${exitCode})`);
  process.exit(exitCode);
}

main();
