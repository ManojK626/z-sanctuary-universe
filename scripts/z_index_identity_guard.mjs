#!/usr/bin/env node
/**
 * Z-Index Identity Guard — READ-ONLY scan of dashboard index HTML identity.
 * Does not edit files.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORT_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORT_DIR, 'z_index_identity_report.json');
const OUT_MD = path.join(REPORT_DIR, 'z_index_identity_report.md');

const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  'safe_pack',
  'uploads',
  'vault',
  '.next',
  'dist',
  'coverage',
  'archive',
]);

/** Skip path segments matching any of these (substring match on posix rel path). */
const SKIP_PATH_HINTS = [
  '/fixtures/',
  '/__tests__/',
  '/test/',
  'node_modules/',
  '-snippet',
  '.min.html',
];

const MAX_BYTES_READ = 120_000;

function relPosix(abs) {
  return path.relative(ROOT, abs).split(path.sep).join('/');
}

function shouldSkipDir(name) {
  return SKIP_DIRS.has(name);
}

function shouldSkipRel(rel) {
  const r = '/' + rel.split(path.sep).join('/') + '/';
  for (const h of SKIP_PATH_HINTS) {
    if (r.includes(h) || rel.includes(h)) return true;
  }
  return false;
}

function collectHtmlFiles(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = relPosix(full);
    if (e.isDirectory()) {
      if (shouldSkipDir(e.name)) continue;
      if (shouldSkipRel(rel)) continue;
      collectHtmlFiles(full, out);
      continue;
    }
    const lower = e.name.toLowerCase();
    if (lower !== 'index.html') continue;
    if (shouldSkipRel(rel)) continue;
    out.push(full);
  }
}

/** Primary HODP / hub dashboards not named index.html */
const EXTRA_CANDIDATE_PATHS = [
  path.join(ROOT, 'dashboard', 'Html', 'index-skk-rkpk.html'),
  path.join(ROOT, 'dashboard', 'Html', 'shadow', 'index-skk-rkpk.workbench.html'),
].map((p) => path.normalize(p));

function isExplicitExtra(absPath) {
  const n = path.normalize(absPath);
  return EXTRA_CANDIDATE_PATHS.some((ex) => n === ex);
}

function isMainDashboardCandidate(absPath, rel, contentPreview) {
  const lower = rel.toLowerCase().replace(/\\/g, '/');
  if (/dashboard[/\\]html[/\\](index-sk[kk]?-rkpk[^/]*|index)\.html$/i.test(lower)) return true;
  if (/dashboard[/\\][^/\\]+[/\\]*index\.html$/i.test(lower)) return true;
  if (/[/\\](docs[/\\]public[/\\]|apps[/\\])/i.test(lower) && lower.endsWith('/index.html')) {
    const hasDashSignals =
      /<html[\s\S]{0,4000}(z-hive-root|dashboard-edge-bar|skk-dashboard|z-panel)/i.test(
        contentPreview,
      ) || contentPreview.length > 8000;
    if (hasDashSignals) return true;
  }
  return false;
}

function detectRedirectStub(content) {
  const head = content.slice(0, 4500).toLowerCase();
  const hasRefresh =
    head.includes('http-equiv="refresh"') || head.includes('http-equiv=\'refresh\'');
  const modest = content.length < 1400 || (hasRefresh && !/<(?:main|iframe|div[^>]*z-hive)/i.test(content));
  return hasRefresh && modest;
}

function checkContent(rel, raw, classification) {
  const headSnippet = raw.slice(0, Math.min(MAX_BYTES_READ, raw.length));
  const stripComments = headSnippet.replace(/<!--[\s\S]*?-->/g, '');
  const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(stripComments);
  const titleText = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '';
  const hasTitle = titleText.length >= 6 && !/^index$/i.test(titleText);

  const projectIdMeta = /<meta\s+[^>]*name\s*=\s*["']z-project-id["'][^>]*>/i.exec(
    stripComments,
  );
  const projectId =
    projectIdMeta &&
    /\bcontent\s*=\s*["']([^"']+)["']/i.exec(projectIdMeta[0])?.[1]?.trim();

  const roleMeta = /<meta\s+[^>]*name\s*=\s*["']z-dashboard-role["'][^>]*>/i.exec(
    stripComments,
  );
  const dashboardRole =
    roleMeta &&
    /\bcontent\s*=\s*["']([^"']+)["']/i.exec(roleMeta[0])?.[1]?.trim();

  const familyMeta = /<meta\s+[^>]*name\s*=\s*["']z-project-family["'][^>]*>/i.exec(
    stripComments,
  );
  const projectFamily =
    familyMeta &&
    /\bcontent\s*=\s*["']([^"']+)["']/i.exec(familyMeta[0])?.[1]?.trim();

  const hasHeaderProject =
    /<header[^>]*\bdata-z-project\s*=\s*["'][^"']+["'][^>]*>/i.test(stripComments) ||
    /<body[^>]*\bdata-z-project\s*=/i.test(stripComments);
  const h1Early = /<h1[^>]*>[\s\S]*?<\/h1>/i.exec(stripComments.slice(0, 25_000));

  let pass = false;
  const missing = [];

  if (classification === 'redirect_stub') {
    if (!hasTitle) missing.push('title_meaningful');
    pass = Boolean(hasTitle);
    return {
      classification,
      pass,
      checks: {
        title_meaningful: hasTitle,
        z_project_id: Boolean(projectId),
        z_dashboard_role: Boolean(dashboardRole),
        z_project_family: Boolean(projectFamily),
        header_data_z_project: hasHeaderProject,
        visible_h1: Boolean(h1Early),
      },
      missing,
      titlePreview: titleText.slice(0, 120),
    };
  }

  if (!hasTitle) missing.push('title_meaningful');
  if (!projectId) missing.push('z-project-id meta');
  if (!dashboardRole) missing.push('z-dashboard-role meta');
  if (!projectFamily) missing.push('z-project-family meta (recommended)');
  if (!hasHeaderProject) missing.push('header (or body) data-z-project');
  if (!h1Early) missing.push('early <h1>');

  pass =
    hasTitle &&
    Boolean(projectId) &&
    Boolean(dashboardRole) &&
    hasHeaderProject &&
    Boolean(h1Early);

  return {
    classification,
    pass,
    checks: {
      title_meaningful: hasTitle,
      z_project_id: Boolean(projectId),
      z_dashboard_role: Boolean(dashboardRole),
      z_project_family: Boolean(projectFamily),
      header_data_z_project: hasHeaderProject,
      visible_h1: Boolean(h1Early),
    },
    missing,
    snippets: {
      title: titleText.slice(0, 140),
      z_project_id: projectId || null,
      z_dashboard_role: dashboardRole || null,
      z_project_family: projectFamily || null,
    },
  };
}

function main() {
  const generated_at = new Date().toISOString();
  const indexFiles = [];
  collectHtmlFiles(ROOT, indexFiles);

  const scanned = new Set(indexFiles.map((p) => path.normalize(p)));
  for (const extra of EXTRA_CANDIDATE_PATHS) {
    if (fs.existsSync(extra)) scanned.add(extra);
  }

  const entries = [];

  for (const absPath of scanned) {
    const rel = relPosix(absPath);
    let raw = '';
    try {
      raw = fs.readFileSync(absPath, 'utf8');
    } catch {
      entries.push({ path: rel, error: 'read_failed', classification: 'error', pass: false });
      continue;
    }
    const preview = raw.slice(0, Math.min(MAX_BYTES_READ, raw.length));
    let classification = detectRedirectStub(raw) ? 'redirect_stub' : 'other';
    const candidate =
      isExplicitExtra(absPath) || isMainDashboardCandidate(absPath, rel, preview);
    if (!candidate && classification !== 'redirect_stub') {
      entries.push({
        path: rel,
        classification: 'skipped_not_main_candidate',
        pass: true,
        note: 'index.html outside main-dashboard heuristics — informational',
      });
      continue;
    }
    if (classification !== 'redirect_stub' && candidate) {
      classification = 'main_dashboard_candidate';
    }
    const detail = checkContent(rel, raw, classification);
    entries.push({
      path: rel,
      ...detail,
      pass_detail: detail.pass,
    });
  }

  entries.sort((a, b) => String(a.path).localeCompare(String(b.path)));

  const failed = entries.filter((e) => e.pass_detail === false);
  const mainFails = entries.filter(
    (e) => e.classification === 'main_dashboard_candidate' && e.pass_detail === false,
  );
  const status = mainFails.length === 0 ? 'green' : 'hold';

  const payload = {
    generated_at,
    hub_root: ROOT,
    mode: 'read_only_scan',
    summary: {
      files_scanned: entries.length,
      main_dashboard_candidates: entries.filter((e) => e.classification === 'main_dashboard_candidate')
        .length,
      failures_total: failed.length,
      failures_main_dashboard: mainFails.length,
      status,
    },
    entries,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z-Index Identity Report',
    '',
    `_Generated ${generated_at}_ · **READ-ONLY scan**`,
    '',
    `**Status:** \`${status}\``,
    '',
    '| Metric | Count |',
    '| --- | --- |',
    '| Files in report | ' + payload.summary.files_scanned + ' |',
    '| Main-dashboard candidates | ' + payload.summary.main_dashboard_candidates + ' |',
    '| Failures (main dashboards) | ' + payload.summary.failures_main_dashboard + ' |',
    '',
    '## Failures (main dashboards)',
    '',
  ];
  if (mainFails.length === 0) {
    md.push('_None._');
  } else {
    for (const f of mainFails) {
      md.push(`### \`${f.path}\``);
      md.push('');
      md.push('- **Missing / weak:** ' + (f.missing?.length ? f.missing.join('; ') : 'see JSON'));
      md.push('');
    }
  }

  md.push('', '---', '');
  md.push('Full JSON: data/reports/z_index_identity_report.json');
  md.push('', 'Governance bot spec: bots/z_index_identity_bot.md');
  md.push('');
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(
    `[z_index_identity_guard] ${status.toUpperCase()} · main-dashboard failures ${mainFails.length} →`,
    path.relative(ROOT, OUT_JSON),
  );
  if (mainFails.length) process.exitCode = 1;
}

main();
