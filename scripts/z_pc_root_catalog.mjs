#!/usr/bin/env node
/**
 * Read-only catalog of pc_root directory names (and optional shallow children).
 * Writes data/reports/z_pc_root_dirent_catalog.json.
 *
 * Usage (from hub root):
 *   npm run pc-root:catalog
 *   npm run pc-root:catalog -- --depth 2 --max-children 100
 *   npm run pc-root:catalog -- --compare-baseline data/reports/z_pc_root_dirent_catalog_baseline.json
 *   npm run pc-root:catalog -- --save-baseline
 *
 * --save-baseline writes the freshly generated catalog to
 *   data/reports/z_pc_root_dirent_catalog_baseline.json (after main catalog).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { levenshtein } from '../bots/_lib/registry_scan.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REGISTRY = path.join(ROOT, 'data', 'z_pc_root_projects.json');
const OUT_CATALOG = path.join(ROOT, 'data', 'reports', 'z_pc_root_dirent_catalog.json');
const OUT_BASELINE = path.join(ROOT, 'data', 'reports', 'z_pc_root_dirent_catalog_baseline.json');
const OUT_DIFF = path.join(ROOT, 'data', 'reports', 'z_pc_root_dirent_catalog_diff.json');

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function argValue(name, def) {
  const i = process.argv.indexOf(name);
  if (i === -1 || !process.argv[i + 1]) return def;
  return process.argv[i + 1];
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function safeStat(full) {
  try {
    const st = fs.statSync(full);
    return {
      kind: st.isDirectory() ? 'directory' : st.isFile() ? 'file' : 'other',
      mtime_ms: Math.floor(st.mtimeMs),
      size_bytes: st.isFile() ? st.size : null
    };
  } catch {
    return { kind: 'unknown', mtime_ms: null, size_bytes: null };
  }
}

function listChildren(dirAbs, maxChildren) {
  let dirents = [];
  try {
    dirents = fs.readdirSync(dirAbs, { withFileTypes: true });
  } catch {
    return [];
  }
  const out = [];
  let n = 0;
  for (const d of dirents) {
    if (n >= maxChildren) break;
    const name = d.name;
    if (name === '.' || name === '..') continue;
    const full = path.join(dirAbs, name);
    const meta = safeStat(full);
    out.push({
      name,
      relative: name,
      kind: d.isDirectory() ? 'directory' : d.isFile() ? 'file' : meta.kind,
      mtime_ms: meta.mtime_ms,
      size_bytes: meta.size_bytes
    });
    n += 1;
  }
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

function scanPcRoot(pcRootNorm, maxDepth, maxChildren) {
  const entries = [];
  let top;
  try {
    top = fs.readdirSync(pcRootNorm, { withFileTypes: true });
  } catch (e) {
    return { error: String(e.message || e), entries: [] };
  }

  for (const d of top) {
    const name = d.name;
    if (name === '.' || name === '..') continue;
    const full = path.join(pcRootNorm, name);
    const meta = safeStat(full);
    const row = {
      name,
      relative: name,
      kind: d.isDirectory() ? 'directory' : d.isFile() ? 'file' : meta.kind,
      mtime_ms: meta.mtime_ms,
      size_bytes: meta.size_bytes
    };
    if (maxDepth >= 2 && d.isDirectory()) {
      const kids = listChildren(full, maxChildren);
      if (maxDepth >= 3) {
        let nestedBudget = 120;
        for (const ch of kids) {
          if (nestedBudget <= 0) break;
          if (ch.kind !== 'directory') continue;
          const cap = Math.min(40, maxChildren);
          const nAbs = path.join(full, ch.name);
          ch.nested = listChildren(nAbs, cap);
          ch.nested_truncated = ch.nested.length >= cap;
          nestedBudget -= ch.nested.length;
        }
      }
      row.children = kids;
      row.children_truncated = kids.length >= maxChildren;
    }
    entries.push(row);
  }
  entries.sort((a, b) => a.name.localeCompare(b.name));
  return { error: null, entries };
}

function nameSet(entries) {
  return new Set((entries || []).map((e) => e.name));
}

function compareCatalogs(baseline, current) {
  const bNames = nameSet(baseline.entries);
  const cNames = nameSet(current.entries);
  const added = (current.entries || []).filter((e) => !bNames.has(e.name));
  const removed = (baseline.entries || []).filter((e) => !cNames.has(e.name));
  const unchanged = (current.entries || []).filter((e) => bNames.has(e.name)).length;

  const renameSuspects = [];
  const rDirs = removed.filter((e) => e.kind === 'directory');
  const aDirs = added.filter((e) => e.kind === 'directory');
  for (const r of rDirs) {
    for (const a of aDirs) {
      const dist = levenshtein(r.name.toLowerCase(), a.name.toLowerCase());
      if (dist > 0 && dist <= 4 && Math.abs(r.name.length - a.name.length) <= 6) {
        renameSuspects.push({
          removed: r.name,
          added: a.name,
          levenshtein: dist
        });
      }
    }
  }
  renameSuspects.sort((x, y) => x.levenshtein - y.levenshtein);
  const dedup = [];
  const seen = new Set();
  for (const p of renameSuspects) {
    const k = `${p.removed}→${p.added}`;
    if (seen.has(k)) continue;
    seen.add(k);
    dedup.push(p);
    if (dedup.length >= 25) break;
  }

  return {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    baseline_file: baseline._catalog_path || 'unknown',
    baseline_generated_at: baseline.generated_at || null,
    current_generated_at: current.generated_at,
    pc_root: current.pc_root,
    added,
    removed,
    unchanged_count: unchanged,
    added_count: added.length,
    removed_count: removed.length,
    rename_suspects: dedup,
    drp_note:
      'Diff is heuristic (rename_suspects from string distance). Confirm on disk before registry edits. No auto-fix.'
  };
}

function main() {
  const reg = readJson(REGISTRY);
  const pcRootRaw = reg?.pc_root ? String(reg.pc_root) : '';
  if (!pcRootRaw) {
    console.error('z_pc_root_catalog: missing pc_root in data/z_pc_root_projects.json');
    process.exit(1);
  }
  const pcRoot = path.normalize(pcRootRaw);
  if (!fs.existsSync(pcRoot)) {
    console.error(`z_pc_root_catalog: pc_root does not exist: ${pcRoot}`);
    process.exit(1);
  }

  const maxDepth = Math.min(3, Math.max(1, parseInt(argValue('--depth', '1'), 10) || 1));
  const maxChildren = Math.min(500, Math.max(20, parseInt(argValue('--max-children', '150'), 10) || 150));

  const { error, entries } = scanPcRoot(pcRoot, maxDepth, maxChildren);
  if (maxDepth > 1 && entries.length > 400) {
    console.warn('z_pc_root_catalog: many top-level entries; depth>1 may be slow.');
  }
  if (error) {
    console.error('z_pc_root_catalog:', error);
    process.exit(1);
  }

  const catalog = {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    name: 'z-pc-root-dirent-catalog',
    advisory: true,
    drp_note:
      'Read-only inventory of pc_root. Does not modify disk or registry. Use Guardian + registry edits for authority.',
    registry_source: 'data/z_pc_root_projects.json',
    pc_root: pcRoot.replace(/\\/g, '/'),
    max_depth: maxDepth,
    max_children_per_dir: maxChildren,
    entry_count: entries.length,
    entries
  };

  fs.mkdirSync(path.dirname(OUT_CATALOG), { recursive: true });
  fs.writeFileSync(OUT_CATALOG, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  console.log(`✅ PC root catalog: ${OUT_CATALOG} (${entries.length} top-level entries, depth ${maxDepth})`);

  if (hasFlag('--save-baseline')) {
    fs.writeFileSync(OUT_BASELINE, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
    console.log(`✅ Baseline saved: ${OUT_BASELINE}`);
  }

  const baselinePathArg = argValue('--compare-baseline', '');
  if (baselinePathArg) {
    const baselinePath = path.isAbsolute(baselinePathArg)
      ? baselinePathArg
      : path.resolve(ROOT, baselinePathArg.replace(/\//g, path.sep));
    if (!fs.existsSync(baselinePath)) {
      console.error(`z_pc_root_catalog: baseline not found: ${baselinePath}`);
      process.exit(1);
    }
    const baselineRaw = readJson(baselinePath);
    if (!baselineRaw || !Array.isArray(baselineRaw.entries)) {
      console.error('z_pc_root_catalog: baseline file missing entries[]');
      process.exit(1);
    }
    const baseline = { ...baselineRaw, entries: baselineRaw.entries, _catalog_path: path.relative(ROOT, baselinePath).replace(/\\/g, '/') };
    const diff = compareCatalogs(baseline, catalog);
    fs.writeFileSync(OUT_DIFF, `${JSON.stringify(diff, null, 2)}\n`, 'utf8');
    console.log(
      `✅ Catalog diff: ${OUT_DIFF} (added ${diff.added_count}, removed ${diff.removed_count}, rename_suspects ${diff.rename_suspects.length})`
    );
  }
}

main();
