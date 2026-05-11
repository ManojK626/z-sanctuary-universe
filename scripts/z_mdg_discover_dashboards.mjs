#!/usr/bin/env node
/**
 * Discover HTML dashboards under each PC-root project folder (sibling of hub).
 * Output: data/reports/z_mdg_dashboard_discovery.json
 * Run from hub: node scripts/z_mdg_discover_dashboards.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const PC_JSON = path.join(ROOT, 'data', 'z_pc_root_projects.json');
const OUT = path.join(ROOT, 'data', 'reports', 'z_mdg_dashboard_discovery.json');

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'coverage',
  '__pycache__',
  '.pytest_cache',
  'safe_pack',
]);

const MAX_DEPTH = 6;
const MAX_PER_PROJECT = 22;
const MAX_TOTAL = 220;

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function relToUrlPath(relFromOrganiser) {
  const parts = relFromOrganiser.split(/[/\\]/).filter(Boolean);
  return `/${parts.map((s) => encodeURIComponent(s)).join('/')}`;
}

function scorePath(relLower) {
  let s = 0;
  if (relLower.includes('dashboard')) s += 15;
  if (relLower.includes('control')) s += 8;
  if (relLower.includes('creator')) s += 8;
  if (relLower.includes('amk') || relLower.includes('goku')) s += 5;
  if (relLower.endsWith('index.html')) s += 4;
  if (relLower.includes('ui')) s += 3;
  return s;
}

function walkProject(projectAbs, organiserRoot) {
  const found = [];
  function walk(dir, depth) {
    if (depth > MAX_DEPTH) return;
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const name = e.name;
      if (name.startsWith('.')) continue;
      const full = path.join(dir, name);
      if (e.isDirectory()) {
        if (IGNORE_DIRS.has(name.toLowerCase())) continue;
        walk(full, depth + 1);
        continue;
      }
      if (!e.isFile() || !name.toLowerCase().endsWith('.html')) continue;
      const rel = path.relative(organiserRoot, full);
      const relPosix = rel.split(path.sep).join('/');
      found.push({
        rel: relPosix,
        relLower: relPosix.toLowerCase(),
        score: scorePath(relPosix.toLowerCase()),
      });
    }
  }
  walk(projectAbs, 0);
  found.sort((a, b) => b.score - a.score || a.rel.length - b.rel.length);
  return found.slice(0, MAX_PER_PROJECT);
}

function main() {
  const pc = readJson(PC_JSON);
  const organiserRoot = path.resolve(pc.pc_root || path.join(ROOT, '..'));
  const hubFolder = pc.hub || 'ZSanctuary_Universe';

  const projectsOut = [];
  let totalHtml = 0;
  const list = Array.isArray(pc.projects) ? pc.projects : [];

  for (const p of list) {
    const folder = (p.path || '').trim();
    if (!folder) {
      projectsOut.push({
        id: p.id,
        name: p.name,
        folder: '',
        found: false,
        skip: 'no local path (external or link-only)',
        html_files: [],
      });
      continue;
    }

    const projectAbs = path.join(organiserRoot, folder);
    if (!fs.existsSync(projectAbs) || !fs.statSync(projectAbs).isDirectory()) {
      projectsOut.push({
        id: p.id,
        name: p.name,
        folder,
        found: false,
        skip: 'folder not found on disk',
        html_files: [],
      });
      continue;
    }

    const raw = walkProject(projectAbs, organiserRoot);
    const html_files = [];
    for (const r of raw) {
      if (totalHtml >= MAX_TOTAL) break;
      const urlPath = relToUrlPath(r.rel);
      const shortPath = r.rel.includes('/')
        ? r.rel.split('/').slice(1).join('/')
        : r.rel;
      html_files.push({
        title: `${p.name} · ${shortPath}`,
        rel: r.rel,
        href: urlPath,
        score: r.score,
      });
      totalHtml++;
    }

    projectsOut.push({
      id: p.id,
      name: p.name,
      folder,
      found: true,
      html_files,
    });
  }

  const payload = {
    generated_at: new Date().toISOString(),
    organiser_root: organiserRoot.replace(/\\/g, '/'),
    hub_folder: hubFolder,
    serve_instructions: `cd "${organiserRoot}" && npx serve .`,
    mega_dashboard_url: `/${encodeURIComponent(hubFolder)}/dashboard/z-mdgev/index.html`,
    note:
      'Open the mega_dashboard_url from ONE static server run at Organiser root so all project paths are same-origin and iframes work.',
    projects: projectsOut,
    totals: {
      projects_with_paths: projectsOut.filter((x) => x.folder).length,
      html_indexed: totalHtml,
    },
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  console.log('Z-MDGEV discovery written:', OUT);
  console.log('Organiser root:', payload.organiser_root);
  console.log('HTML files indexed:', totalHtml);
  console.log('');
  console.log('To see ALL projects in the mega grid with working embeds:');
  console.log(' ', payload.serve_instructions);
  console.log('Then open e.g. http://127.0.0.1:3000' + payload.mega_dashboard_url);
}

main();
