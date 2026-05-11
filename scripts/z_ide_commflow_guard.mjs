#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_ide_commflow_guard.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_ide_commflow_guard.md');

const MAX_SCAN_FILES = 4000;
const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  'safe_pack',
  'uploads',
  'vault',
  '.next',
  'dist',
  'coverage',
]);

const EXEMPT_TOPS = new Set([
  'z_workspace',
  'z_notebooks',
  'z_colour',
  'Z_Labs',
  'ZSanctuary_Labs',
  'tools',
  'super_ghost',
  'src',
  // Mixed/legacy project zones kept advisory-only in hub scans.
  'Z_Sanctuary_Universe 2',
  'Z-SANCTUARY_ZUNO_AI',
  'ui',
  'templates',
  'schemas',
  'sandbox',
  'rules',
  'releases',
  'exports',
  'products',
  'miniai',
  'martial-platform',
  'interface',
  'harisha',
  'gemini',
  'extensions',
  'nas_ready',
]);

const ROUTING = [
  {
    ext: '.md',
    allowedTop: new Set(['docs', 'data', '.cursor', '.vscode', 'core', 'packages', 'apps', 'dashboard', 'scripts']),
  },
  {
    ext: '.js',
    allowedTop: new Set(['core', 'scripts', 'dashboard', 'interface', 'packages', 'apps', 'z_workspace', 'z_notebooks']),
  },
  { ext: '.mjs', allowedTop: new Set(['scripts', 'tools']) },
  { ext: '.cjs', allowedTop: new Set(['scripts', 'packages', 'apps', 'super_ghost', 'z_workspace']) },
  {
    ext: '.json',
    allowedTop: new Set(['data', '.vscode', '.cursor', 'config', 'rules', 'apps', 'packages', 'scripts']),
  },
  { ext: '.ts', allowedTop: new Set(['packages', 'apps']) },
  { ext: '.tsx', allowedTop: new Set(['apps', 'packages']) },
  { ext: '.css', allowedTop: new Set(['interface', 'dashboard', 'apps', 'packages', 'core']) },
  { ext: '.html', allowedTop: new Set(['dashboard', 'core', 'docs', 'apps', 'scripts']) },
];

function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function relPosix(absPath) {
  return path.relative(ROOT, absPath).replace(/\\/g, '/');
}

function firstSegment(relPath) {
  const normalized = String(relPath || '').replace(/\\/g, '/');
  const idx = normalized.indexOf('/');
  return idx === -1 ? normalized : normalized.slice(0, idx);
}

function findRoute(ext) {
  return ROUTING.find((x) => x.ext === ext) || null;
}

function walkFiles(baseDir) {
  const files = [];
  const stack = [baseDir];
  while (stack.length > 0 && files.length < MAX_SCAN_FILES) {
    const current = stack.pop();
    let entries = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      const rel = relPosix(full);
      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        if (rel.startsWith('.cursor/rules') || rel.startsWith('.cursor/commands') || rel.startsWith('.cursor/agents')) {
          continue;
        }
        stack.push(full);
        continue;
      }
      if (entry.isFile()) {
        files.push(full);
        if (files.length >= MAX_SCAN_FILES) break;
      }
    }
  }
  return files;
}

function checkVsCodeSettings() {
  const settingsPath = path.join(ROOT, '.vscode', 'settings.json');
  const settings = readJson(settingsPath, {});
  const checks = [
    {
      id: 'task_allow_automatic_tasks_on',
      pass: String(settings?.['task.allowAutomaticTasks'] || '') === 'on',
      note: `task.allowAutomaticTasks=${String(settings?.['task.allowAutomaticTasks'] || 'missing')}`,
    },
    {
      id: 'terminal_default_profile_powershell',
      pass: String(settings?.['terminal.integrated.defaultProfile.windows'] || '') === 'PowerShell',
      note: `terminal.integrated.defaultProfile.windows=${String(
        settings?.['terminal.integrated.defaultProfile.windows'] || 'missing'
      )}`,
    },
    {
      id: 'files_autosave_after_delay',
      pass: String(settings?.['files.autoSave'] || '') === 'afterDelay',
      note: `files.autoSave=${String(settings?.['files.autoSave'] || 'missing')}`,
    },
  ];
  return checks;
}

function buildProjectHints() {
  const pcRootList = readJson(path.join(ROOT, 'data', 'z_pc_root_projects.json'), {});
  const projects = Array.isArray(pcRootList?.projects) ? pcRootList.projects : [];
  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    role: project.role,
    suggested_entry: project.role === 'hub' ? 'Z: SSWS Auto Boot' : 'Z: Cross-Project Health Probe (read-only)',
    path_hint: `${pcRootList?.pc_root || 'C:/Cursor Projects Organiser'}/${project.path || project.id}`,
  }));
}

function buildPayload() {
  const files = walkFiles(ROOT);
  const routeIssues = [];
  for (const filePath of files) {
    const rel = relPosix(filePath);
    if (!rel.includes('/')) continue; // Ignore root-level files; they are often intentional configs/docs.
    const ext = path.extname(filePath).toLowerCase();
    const route = findRoute(ext);
    if (!route) continue;
    const top = firstSegment(rel);
    if (EXEMPT_TOPS.has(top)) continue; // Legacy/mixed zones are advisory-only.
    if (!route.allowedTop.has(top)) {
      routeIssues.push({
        file: rel,
        extension: ext,
        current_top: top || '.',
        expected_top_choices: Array.from(route.allowedTop),
      });
    }
  }

  const settingsChecks = checkVsCodeSettings();
  const failedSettings = settingsChecks.filter((x) => !x.pass);
  const mismatchCount = routeIssues.length;
  const status = failedSettings.length > 0 ? 'hold' : mismatchCount > 0 ? 'watch' : 'green';

  const operatorDirections = [
    'If project context is unclear, run `npm run workspace:emit-pc-root` then open `Z-EAII-PC-All-Projects.code-workspace`.',
    'For core verification, run `npm run verify:ci`; for full health, run `npm run stabilize:apply-and-verify`.',
    'If file routing mismatches appear, move files to suggested top-level folders before release checks.',
  ];

  return {
    generated_at: new Date().toISOString(),
    status,
    scan: {
      files_scanned: files.length,
      max_scan_files: MAX_SCAN_FILES,
      mismatch_count: mismatchCount,
    },
    settings_checks: settingsChecks,
    route_mismatches: routeIssues.slice(0, 120),
    operator_directions: operatorDirections,
    project_hints: buildProjectHints(),
    note: 'IDE comm-flow guard is advisory (non-destructive) and provides placement guidance for mixed-project operation.',
  };
}

function toMarkdown(payload) {
  const lines = [
    '# Z IDE Comm-Flow Guard',
    '',
    `Generated: ${payload.generated_at}`,
    `Status: **${String(payload.status).toUpperCase()}**`,
    `Files scanned: ${payload.scan.files_scanned}`,
    `Mismatches: ${payload.scan.mismatch_count}`,
    '',
    '## Settings Checks',
    ...payload.settings_checks.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.id}: ${c.note}`),
    '',
    '## Operator Directions',
    ...payload.operator_directions.map((d) => `- ${d}`),
    '',
    '## Routing Mismatches (sample)',
    ...(payload.route_mismatches.length
      ? payload.route_mismatches.map((x) => `- ${x.file} -> expected one of: ${x.expected_top_choices.join(', ')}`)
      : ['- none']),
    '',
  ];
  return `${lines.join('\n')}\n`;
}

function main() {
  const payload = buildPayload();
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  fs.writeFileSync(OUT_MD, toMarkdown(payload), 'utf8');
  console.log(`Z IDE comm-flow guard: ${OUT_JSON} status=${payload.status}`);
  if (payload.status === 'hold') process.exitCode = 1;
}

main();
