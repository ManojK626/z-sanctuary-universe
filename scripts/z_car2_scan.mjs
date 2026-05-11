#!/usr/bin/env node
/**
 * Z-CAR² — Phase 1 read-only scan (Compressor · Analyzer · Reformatter · Restructurer).
 * SCAN → GROUP → COMPARE → SCORE → RECOMMEND (report only; no writes, no auto-refactor).
 *
 * Run from hub root: node scripts/z_car2_scan.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_car2_similarity_report.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_car2_similarity_report.md');

const EXTENSIONS = new Set(['.md', '.js', '.mjs', '.cjs', '.json', '.html', '.ps1', '.css', '.ts', '.tsx']);
const MAX_FILE_BYTES = 380_000;
const WINDOW_LINES = 4;
const MIN_WINDOW_CHARS = 96;
const MIN_LINE_CHARS = 16;
const MAX_LINE_GROUPS = 120;
const MAX_WINDOW_GROUPS = 100;
const MAX_LOCS_PER_GROUP = 10;

const IGNORE_DIR_NAMES = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'out',
  'build',
  '__pycache__',
  '.pytest_cache',
  'coverage',
  '.turbo',
  '.cache',
  'coverage-final'
]);

function shouldSkipDir(relPosix, baseName) {
  if (IGNORE_DIR_NAMES.has(baseName)) return true;
  if (baseName === 'safe_pack') return true;
  if (relPosix.includes('Amk_Goku Worldwide Loterry/exports/')) return true;
  if (relPosix.includes('/.git/')) return true;
  return false;
}

/** Skip lockfiles and IDE workspace JSON — high duplicate noise, low structural signal for Z-CAR². */
function shouldSkipFile(relPosix) {
  const p = relPosix.replace(/\\/g, '/');
  if (p.includes('/.vscode/')) return true;
  if (p.endsWith('/package-lock.json') || p.endsWith('/pnpm-lock.yaml') || p.endsWith('/yarn.lock')) return true;
  return false;
}

function djb2(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h * 33) ^ str.charCodeAt(i);
  }
  return String(h >>> 0);
}

function normalizeLine(line) {
  return String(line).trim().replace(/\s+/g, ' ');
}

function isTrivialLine(norm) {
  if (norm.length < MIN_LINE_CHARS) return true;
  if (/^[\s{}[\];,:]+$/u.test(norm)) return true;
  if (/^(import|export)\s+/.test(norm) && norm.length < 50) return true;
  return false;
}

function classifyCategory(relPaths, sample) {
  const paths = relPaths.join(' ').toLowerCase();
  const s = (sample || '').toLowerCase();
  if (paths.includes('docs/safety') || paths.includes('/safety/')) return 'safety';
  if (paths.includes('/data/') && paths.includes('.json')) return 'registry';
  if (paths.includes('/dashboard/') || paths.includes('/panels/')) return 'dashboard';
  if (paths.includes('/scripts/') || paths.includes('/apps/')) return 'script';
  if (paths.includes('/docs/') || paths.endsWith('.md')) return 'docs';
  if (/disclaimer|boundary|consent|gambling|gps|camera|microphone|non-medical/i.test(s)) return 'safety';
  return 'unknown';
}

function classifyRisk(relPaths, category) {
  const paths = relPaths.join(' ').toLowerCase();
  if (paths.includes('safe_pack')) return 'BLACK';
  if (category === 'safety' || paths.includes('docs/safety')) return 'RED';
  if (/payment|stripe|paypal|hipaa|diagnos|prescription|emergency[-_ ]?only/i.test(paths)) return 'RED';
  if (category === 'registry' || category === 'script' || category === 'dashboard') return 'ORANGE';
  if (category === 'docs') return 'YELLOW';
  return 'YELLOW';
}

function recommendationForGroup(category, risk, kind) {
  if (risk === 'BLACK' || risk === 'RED') {
    return 'Report only — no automated merge or delete; human + policy review before any structural change.';
  }
  if (kind === 'line' && category === 'script') {
    return 'Consider a shared helper under scripts/lib/ after tests — not in Phase 1.';
  }
  if (kind === 'window' && category === 'dashboard') {
    return 'Consider a shared dashboard partial or template — verify in browser after any extraction.';
  }
  if (category === 'docs') {
    return 'Consider a shared doc fragment or single canonical page with links — preserve legal/historical intent.';
  }
  return 'Review manually; dedupe only after confirming meaning is identical.';
}

function walkFiles() {
  const out = [];
  const stack = [''];

  while (stack.length) {
    const rel = stack.pop();
    const abs = path.join(ROOT, rel);
    let entries;
    try {
      entries = fs.readdirSync(abs, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const ent of entries) {
      const name = ent.name;
      if (name === '.' || name === '..') continue;
      const relPosix = rel ? `${rel}/${name}`.replace(/\\/g, '/') : name.replace(/\\/g, '/');
      if (ent.isDirectory()) {
        if (shouldSkipDir(relPosix, name)) continue;
        stack.push(relPosix);
      } else if (ent.isFile()) {
        const ext = path.extname(name).toLowerCase();
        if (!EXTENSIONS.has(ext)) continue;
        if (shouldSkipFile(relPosix)) continue;
        out.push(relPosix);
      }
    }
  }
  return out.sort();
}

function readFileLimited(rel) {
  const abs = path.join(ROOT, rel);
  try {
    const st = fs.statSync(abs);
    if (!st.isFile()) return { skip: true, reason: 'not_file' };
    if (st.size > MAX_FILE_BYTES) return { skip: true, reason: 'too_large', size: st.size };
    const buf = fs.readFileSync(abs);
    if (buf.includes(0)) return { skip: true, reason: 'binary' };
    const text = buf.toString('utf8');
    return { skip: false, text, lines: text.split(/\r?\n/), size: st.size };
  } catch {
    return { skip: true, reason: 'read_error' };
  }
}

/** Pass 1: global counts + scan stats */
function accumulateCounts(files) {
  const lineCounts = new Map();
  const winCounts = new Map();
  let bytesScanned = 0;
  let filesScanned = 0;
  let filesSkipped = 0;
  const skipReasons = {};

  for (const rel of files) {
    const r = readFileLimited(rel);
    if (r.skip) {
      filesSkipped += 1;
      const rs = r.reason || 'unknown';
      skipReasons[rs] = (skipReasons[rs] || 0) + 1;
      continue;
    }
    filesScanned += 1;
    bytesScanned += r.size || 0;
    const { lines } = r;
    for (const line of lines) {
      const norm = normalizeLine(line);
      if (isTrivialLine(norm)) continue;
      const h = djb2(norm);
      lineCounts.set(h, (lineCounts.get(h) || 0) + 1);
    }
    for (let i = 0; i + WINDOW_LINES <= lines.length; i++) {
      const chunk = [];
      for (let j = 0; j < WINDOW_LINES; j++) {
        const t = normalizeLine(lines[i + j]);
        if (t.length < 4) {
          chunk.length = 0;
          break;
        }
        chunk.push(t);
      }
      if (chunk.length !== WINDOW_LINES) continue;
      const joined = chunk.join('\n');
      if (joined.length < MIN_WINDOW_CHARS) continue;
      const wh = djb2(joined);
      winCounts.set(wh, (winCounts.get(wh) || 0) + 1);
    }
  }

  return { lineCounts, winCounts, bytesScanned, filesScanned, filesSkipped, skipReasons };
}

function hotHashes(counts, minCount) {
  const s = new Set();
  for (const [h, c] of counts) {
    if (c >= minCount) s.add(h);
  }
  return s;
}

function collectLineGroups(files, lineHot) {
  const locMap = new Map();
  for (const rel of files) {
    const r = readFileLimited(rel);
    if (r.skip) continue;
    r.lines.forEach((line, idx) => {
      const norm = normalizeLine(line);
      if (isTrivialLine(norm)) return;
      const h = djb2(norm);
      if (!lineHot.has(h)) return;
      if (!locMap.has(h)) locMap.set(h, []);
      const arr = locMap.get(h);
      if (arr.length >= MAX_LOCS_PER_GROUP) return;
      arr.push({ path: rel, line: idx + 1, preview: norm.slice(0, 140) });
    });
  }
  const groups = [];
  for (const [h, locs] of locMap) {
    if (locs.length < 2) continue;
    const paths = [...new Set(locs.map((l) => l.path))];
    if (paths.length < 2) continue;
    const sample = locs[0].preview;
    const category = classifyCategory(paths, sample);
    const risk = classifyRisk(paths, category);
    groups.push({
      group_id: `line_${h}`,
      kind: 'exact_line',
      occurrence_count: locs.length,
      file_count: paths.length,
      similarity_score: 100,
      category,
      risk_level: risk,
      locations: locs,
      recommendation: recommendationForGroup(category, risk, 'line')
    });
  }
  groups.sort((a, b) => b.file_count * b.occurrence_count - a.file_count * a.occurrence_count);
  return groups.slice(0, MAX_LINE_GROUPS);
}

function collectWindowGroups(files, winHot) {
  const locMap = new Map();
  for (const rel of files) {
    const r = readFileLimited(rel);
    if (r.skip) continue;
    const { lines } = r;
    for (let i = 0; i + WINDOW_LINES <= lines.length; i++) {
      const chunk = [];
      for (let j = 0; j < WINDOW_LINES; j++) {
        const t = normalizeLine(lines[i + j]);
        if (t.length < 4) {
          chunk.length = 0;
          break;
        }
        chunk.push(t);
      }
      if (chunk.length !== WINDOW_LINES) continue;
      const joined = chunk.join('\n');
      if (joined.length < MIN_WINDOW_CHARS) continue;
      const wh = djb2(joined);
      if (!winHot.has(wh)) continue;
      if (!locMap.has(wh)) locMap.set(wh, []);
      const arr = locMap.get(wh);
      if (arr.length >= MAX_LOCS_PER_GROUP) continue;
      arr.push({
        path: rel,
        start_line: i + 1,
        end_line: i + WINDOW_LINES,
        preview: joined.slice(0, 200).replace(/\n/g, ' · ')
      });
    }
  }
  const groups = [];
  for (const [h, locs] of locMap) {
    if (locs.length < 2) continue;
    const paths = [...new Set(locs.map((l) => l.path))];
    if (paths.length < 2) continue;
    const sample = locs[0].preview;
    const category = classifyCategory(paths, sample);
    const risk = classifyRisk(paths, category);
    groups.push({
      group_id: `win_${h}`,
      kind: 'four_line_window',
      occurrence_count: locs.length,
      file_count: paths.length,
      similarity_score: 100,
      category,
      risk_level: risk,
      locations: locs,
      recommendation: recommendationForGroup(category, risk, 'window')
    });
  }
  groups.sort((a, b) => b.file_count * b.occurrence_count - a.file_count * a.occurrence_count);
  return groups.slice(0, MAX_WINDOW_GROUPS);
}

function registryCrossCheck() {
  const out = { note: 'Lightweight read-only cross-read; not a full schema diff.' };
  try {
    const regPath = path.join(ROOT, 'data', 'Z_module_registry.json');
    const manPath = path.join(ROOT, 'data', 'z_module_manifest.json');
    const reg = JSON.parse(fs.readFileSync(regPath, 'utf8'));
    const man = JSON.parse(fs.readFileSync(manPath, 'utf8'));
    const regIds = new Set((reg.ZModules || []).map((m) => m.ZId).filter(Boolean));
    const manIds = new Set((man.ZModules || []).map((m) => m.ZId).filter(Boolean));
    const onlyReg = [...regIds].filter((id) => !manIds.has(id));
    const onlyMan = [...manIds].filter((id) => !regIds.has(id));
    out.registry_zid_count = regIds.size;
    out.manifest_zid_count = manIds.size;
    out.ids_only_in_Z_module_registry = onlyReg.slice(0, 40);
    out.ids_only_in_z_module_manifest = onlyMan.slice(0, 40);
    out.ids_only_in_Z_module_registry_count = onlyReg.length;
    out.ids_only_in_z_module_manifest_count = onlyMan.length;
  } catch (e) {
    out.error = String(e?.message || e);
  }
  return out;
}

function buildMarkdown(payload) {
  const s = payload.summary;
  const L = [];
  L.push('# Z-CAR² similarity report (Phase 1 — read-only)');
  L.push('');
  L.push(`Generated: ${payload.generated_at}`);
  L.push('');
  L.push('## Summary');
  L.push('');
  L.push('| Metric | Value |');
  L.push('| --- | ---: |');
  L.push(`| Files scanned | ${s.files_scanned} |`);
  L.push(`| Bytes scanned | ${s.bytes_scanned} |`);
  L.push(`| Files skipped | ${s.files_skipped} |`);
  L.push(`| Duplicate line groups (capped) | ${s.duplicate_line_groups} |`);
  L.push(`| Duplicate window groups (capped) | ${s.duplicate_window_groups} |`);
  L.push(`| Risk mix (line groups) | ${s.risk_histogram_line} |`);
  L.push(`| Risk mix (window groups) | ${s.risk_histogram_window} |`);
  L.push(`| Safe auto-fix candidates | ${s.safe_auto_fix_candidates} |`);
  L.push('');
  L.push('## Posture');
  L.push('');
  L.push('- **No files were modified.** Advisory scan only.');
  L.push('- **RED / BLACK** clusters stay report-only until explicit human policy.');
  L.push('- Ritual pairing: `npm run zuno:coverage && npm run zuno:phase3-plan && npm run z:car2`.');
  L.push('');
  L.push('## Registry / manifest ID drift');
  L.push('');
  const rc = payload.registry_cross_check || {};
  L.push(`- Z_module_registry ZIds: **${rc.registry_zid_count ?? '—'}**`);
  L.push(`- z_module_manifest ZIds: **${rc.manifest_zid_count ?? '—'}**`);
  L.push(`- Only in registry: **${rc.ids_only_in_Z_module_registry_count ?? '—'}** · Only in manifest: **${rc.ids_only_in_z_module_manifest_count ?? '—'}**`);
  L.push('');
  L.push('## Sample duplicate line groups');
  L.push('');
  L.push('| Group | Files | Risk | Category | Preview |');
  L.push('| --- | ---: | --- | --- | --- |');
  for (const g of (payload.duplicate_line_groups || []).slice(0, 25)) {
    const prev = (g.locations[0]?.preview || '—').replace(/\|/g, '\\|').slice(0, 80);
    L.push(
      `| ${g.group_id} | ${g.file_count} | ${g.risk_level} | ${g.category} | ${prev}… |`
    );
  }
  L.push('');
  L.push('## Sample duplicate window groups');
  L.push('');
  L.push('| Group | Files | Risk | Category | Preview |');
  L.push('| --- | ---: | --- | --- | --- |');
  for (const g of (payload.duplicate_window_groups || []).slice(0, 20)) {
    const prev = (g.locations[0]?.preview || '—').replace(/\|/g, '\\|').slice(0, 72);
    L.push(
      `| ${g.group_id} | ${g.file_count} | ${g.risk_level} | ${g.category} | ${prev}… |`
    );
  }
  L.push('');
  L.push('Full JSON: `data/reports/z_car2_similarity_report.json`.');
  L.push('');
  return L.join('\n');
}

function riskHistogram(groups) {
  const o = { GREEN: 0, YELLOW: 0, ORANGE: 0, RED: 0, BLACK: 0 };
  for (const g of groups) {
    const k = g.risk_level;
    if (o[k] !== undefined) o[k] += 1;
  }
  return Object.entries(o)
    .map(([k, v]) => `${k}:${v}`)
    .join(', ');
}

function main() {
  const files = walkFiles();
  const { lineCounts, winCounts, bytesScanned, filesScanned, filesSkipped, skipReasons } = accumulateCounts(files);

  const lineHot = hotHashes(lineCounts, 2);
  const winHot = hotHashes(winCounts, 2);

  const lineGroups = collectLineGroups(files, lineHot);
  const winGroups = collectWindowGroups(files, winHot);
  const registry = registryCrossCheck();

  const payload = {
    generated_at: new Date().toISOString(),
    mode: 'z_car2_phase1_read_only',
    principle: 'SCAN → GROUP → COMPARE → SCORE → RECOMMEND (human approves before any restructure)',
    scan: {
      root: ROOT,
      extensions: [...EXTENSIONS].sort(),
      files_eligible: files.length,
      files_scanned: filesScanned,
      bytes_scanned: bytesScanned,
      files_skipped: filesSkipped,
      skip_reasons: skipReasons,
      excluded_note:
        'Skipped dirs: node_modules, .git, .next, dist, safe_pack, lottery exports, __pycache__, .pytest_cache. Skipped files: .vscode/*, package-lock.json, pnpm-lock.yaml, yarn.lock (IDE / lock noise).'
    },
    summary: {
      files_scanned: filesScanned,
      bytes_scanned: bytesScanned,
      files_skipped: filesSkipped,
      duplicate_line_groups: lineGroups.length,
      duplicate_window_groups: winGroups.length,
      risk_histogram_line: riskHistogram(lineGroups),
      risk_histogram_window: riskHistogram(winGroups),
      safe_auto_fix_candidates: 0
    },
    duplicate_line_groups: lineGroups,
    duplicate_window_groups: winGroups,
    registry_cross_check: registry,
    readme:
      'Z-CAR² Phase 1 does not edit, delete, or refactor files. RED/BLACK clusters require human policy before action.'
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), 'utf8');
  fs.writeFileSync(OUT_MD, buildMarkdown(payload), 'utf8');

  console.log(
    JSON.stringify(
      {
        ok: true,
        out_json: 'data/reports/z_car2_similarity_report.json',
        out_md: 'data/reports/z_car2_similarity_report.md',
        line_groups: lineGroups.length,
        window_groups: winGroups.length,
        files_scanned: filesScanned
      },
      null,
      2
    )
  );
}

main();
