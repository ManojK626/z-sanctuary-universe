#!/usr/bin/env node
/**
 * Z-PC-IDE-PATH-1 — read-only VS Code / Cursor install and PATH sanity for AMK doorway.
 * Does not edit registry, install software, or launch editors.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_pc_ide_path_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_pc_ide_path_report.md');

const HUB_ROOT = ROOT;
const LABS_ROOT = path.join(ROOT, 'ZSanctuary_Labs');

function normalizeCompare(p) {
  return String(p || '')
    .replace(/\\/g, '/')
    .toLowerCase();
}

function cwdUnderCursorProjectsArchive(cwd) {
  const n = normalizeCompare(cwd);
  return n.includes('/.cursor/projects') || n.includes('/.cursor/projects/');
}

function commandOnPath(name) {
  if (process.platform === 'win32') {
    try {
      execFileSync('where.exe', [name], { stdio: ['ignore', 'pipe', 'pipe'] });
      return true;
    } catch {
      return false;
    }
  }
  try {
    execFileSync('which', [name], { stdio: ['ignore', 'pipe', 'pipe'] });
    return true;
  } catch {
    return false;
  }
}

function main() {
  const generatedAt = new Date().toISOString();
  const cwd = process.cwd();
  const cwdArchive = cwdUnderCursorProjectsArchive(cwd);

  const hubExists = fs.existsSync(HUB_ROOT);
  const labsExists = fs.existsSync(LABS_ROOT);

  const la = process.env.LOCALAPPDATA || '';
  const vsLocal = path.join(la, 'Programs', 'Microsoft VS Code', 'Code.exe');
  const vsPf = path.join(process.env['ProgramFiles'] || 'C:\\Program Files', 'Microsoft VS Code', 'Code.exe');
  const cursorLocal = path.join(la, 'Programs', 'cursor', 'Cursor.exe');

  const vsExeLocalExists = fs.existsSync(vsLocal);
  const vsExePfExists = fs.existsSync(vsPf);
  const cursorExeExists = fs.existsSync(cursorLocal);

  const codeOnPath = commandOnPath('code');
  const cursorOnPath = commandOnPath('cursor');

  const vscodeDetected = codeOnPath || vsExeLocalExists || vsExePfExists;
  const cursorDetected = cursorOnPath || cursorExeExists;

  const warnings = [];
  const notes = [];

  if (cwdArchive) {
    warnings.push('process.cwd() is under `.cursor/projects` — archive/agent workspace; use real hub root for authoritative work.');
  }
  if (!labsExists) {
    warnings.push('ZSanctuary_Labs folder not found beside hub (`ZSanctuary_Labs`).');
  }
  if (vscodeDetected && !codeOnPath && (vsExeLocalExists || vsExePfExists)) {
    notes.push('VS Code executable found but `code` not on PATH — reinstall with “Add to PATH” or call `Code.exe` by full path.');
  }
  if (cursorDetected && !cursorOnPath && cursorExeExists) {
    notes.push('Cursor executable found but `cursor` not on PATH — confirm Cursor shell command install.');
  }

  let overall = 'GREEN';
  if (!hubExists || cwdArchive) {
    overall = 'RED';
  } else if (!vscodeDetected && !cursorDetected) {
    overall = 'RED';
    warnings.push('Neither VS Code nor Cursor detected (PATH + common Windows install paths).');
  } else if (!vscodeDetected || !cursorDetected) {
    overall = 'YELLOW';
  }

  if (overall === 'GREEN' && !labsExists) {
    overall = 'YELLOW';
  }

  const payload = {
    schema: 'z_pc_ide_path_report_v1',
    generated_at: generatedAt,
    overall_signal: overall,
    process_cwd: cwd,
    paths: {
      hub_root: HUB_ROOT,
      hub_exists: hubExists,
      labs_root: LABS_ROOT,
      labs_exists: labsExists,
    },
    vscode: {
      code_on_path: codeOnPath,
      code_exe_localappdata: vsLocal,
      code_exe_localappdata_exists: vsExeLocalExists,
      code_exe_programfiles: vsPf,
      code_exe_programfiles_exists: vsExePfExists,
      detected: vscodeDetected,
    },
    cursor: {
      cursor_on_path: cursorOnPath,
      cursor_exe_localappdata: cursorLocal,
      cursor_exe_localappdata_exists: cursorExeExists,
      detected: cursorDetected,
    },
    archive_build_root_warning: cwdArchive,
    warnings,
    notes,
    locked_law: [
      'Explorer context menu ≠ project health.',
      'CLI path proof beats Explorer right-click menus.',
      '.cursor/projects is archive/cache — not authoritative hub.',
      'This checker does not edit registry or install software.',
      'GREEN ≠ deploy.',
    ],
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const mdLines = [
    '# Z-PC-IDE-PATH-1 report',
    '',
    `- Generated: ${generatedAt}`,
    `- Overall signal: **${overall}**`,
    `- Hub exists: **${hubExists}**`,
    `- Labs exists: **${labsExists}**`,
    `- VS Code detected: **${vscodeDetected}**`,
    `- Cursor detected: **${cursorDetected}**`,
    `- CWD under .cursor/projects: **${cwdArchive}**`,
    '',
    '## Paths',
    '',
    `- Hub: \`${HUB_ROOT}\``,
    `- Labs: \`${LABS_ROOT}\``,
    '',
    '## Warnings',
    '',
    ...(warnings.length ? warnings.map((w) => `- ${w}`) : ['- (none)']),
    '',
    '## Notes',
    '',
    ...(notes.length ? notes.map((n) => `- ${n}`) : ['- (none)']),
    '',
  ];
  fs.writeFileSync(OUT_MD, mdLines.join('\n'), 'utf8');

  console.log(JSON.stringify({ ok: overall !== 'RED', overall_signal: overall, out_json: OUT_JSON, out_md: OUT_MD }, null, 2));
  process.exit(overall === 'RED' ? 1 : 0);
}

main();
