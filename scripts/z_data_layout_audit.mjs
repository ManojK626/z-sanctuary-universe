import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const POLICY_PATH = path.join(ROOT, 'config', 'z_data_layout_policy.json');
const OUT_JSON = path.join(ROOT, 'data', 'reports', 'z_data_layout_audit.json');
const OUT_MD = path.join(ROOT, 'data', 'reports', 'z_data_layout_audit.md');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function shouldSkip(relPath, excludes) {
  const normalized = relPath.replaceAll('\\', '/');
  return excludes.some((token) => normalized.includes(token));
}

function walkFiles(absRoot, relRoot, excludes, out = []) {
  if (!fs.existsSync(absRoot)) return out;
  const entries = fs.readdirSync(absRoot, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(absRoot, entry.name);
    const rel = path.join(relRoot, entry.name).replaceAll('\\', '/');
    if (shouldSkip(rel, excludes)) continue;
    if (entry.isDirectory()) {
      walkFiles(abs, rel, excludes, out);
    } else if (entry.isFile()) {
      out.push(rel);
    }
  }
  return out;
}

function extOf(file) {
  const ext = path.extname(file).toLowerCase();
  return ext || '(none)';
}

function classifyByGroup(ext, groups) {
  for (const [group, list] of Object.entries(groups)) {
    if (list.includes(ext)) return group;
  }
  return 'unknown';
}

function topEntries(mapObj, limit = 20) {
  return Object.entries(mapObj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, value]) => ({ key, value }));
}

function run() {
  const policy = readJson(POLICY_PATH, {});
  const scanRoots = Array.isArray(policy.scan_roots) ? policy.scan_roots : [];
  const excludes = Array.isArray(policy.exclude_contains) ? policy.exclude_contains : [];
  const groups = policy.groups || {};
  const checksCfg = policy.checks || {};

  const files = [];
  for (const relRoot of scanRoots) {
    const absRoot = path.join(ROOT, relRoot);
    walkFiles(absRoot, relRoot, excludes, files);
  }

  const byRoot = {};
  const byExtension = {};
  const byGroup = {};
  const unknownFiles = [];
  const ungroupedFiles = [];

  for (const relPath of files) {
    const root = relPath.split('/')[0] || 'root';
    const ext = extOf(relPath);
    const group = classifyByGroup(ext, groups);

    byRoot[root] = (byRoot[root] || 0) + 1;
    byExtension[ext] = (byExtension[ext] || 0) + 1;
    byGroup[group] = (byGroup[group] || 0) + 1;

    if (group === 'unknown') unknownFiles.push(relPath);
    if (!scanRoots.some((r) => relPath.startsWith(`${r}/`) || relPath === r)) {
      ungroupedFiles.push(relPath);
    }
  }

  const checks = [
    {
      id: 'unknown_files_limit',
      pass: unknownFiles.length <= Number(checksCfg.max_unknown_files || 0),
      note: `unknown=${unknownFiles.length}, limit=${checksCfg.max_unknown_files ?? 0}`,
    },
    {
      id: 'ungrouped_files_limit',
      pass: ungroupedFiles.length <= Number(checksCfg.max_ungrouped_files || 0),
      note: `ungrouped=${ungroupedFiles.length}, limit=${checksCfg.max_ungrouped_files ?? 0}`,
    },
    {
      id: 'roots_scanned',
      pass: scanRoots.length > 0,
      note: `roots=${scanRoots.length}`,
    },
  ];

  const status = checks.every((c) => c.pass) ? 'green' : 'hold';
  const payload = {
    generated_at: new Date().toISOString(),
    status,
    policy_version: policy.version || 'unknown',
    files_scanned: files.length,
    root_count: Object.keys(byRoot).length,
    group_count: Object.keys(byGroup).length,
    checks,
    summary: {
      by_root: byRoot,
      by_group: byGroup,
      top_extensions: topEntries(byExtension, 25),
    },
    unknown: {
      count: unknownFiles.length,
      samples: unknownFiles.slice(0, 50),
    },
    ungrouped: {
      count: ungroupedFiles.length,
      samples: ungroupedFiles.slice(0, 50),
    },
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));

  const md = [
    '# Z Data Layout Audit',
    '',
    `Generated: ${payload.generated_at}`,
    `Status: ${payload.status.toUpperCase()}`,
    `Files scanned: ${payload.files_scanned}`,
    '',
    '## Checks',
    ...checks.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.id}: ${c.note}`),
    '',
    '## By Group',
    ...Object.entries(byGroup).map(([k, v]) => `- ${k}: ${v}`),
    '',
    '## Top Extensions',
    ...payload.summary.top_extensions.map((x) => `- ${x.key}: ${x.value}`),
    '',
    `Unknown files: ${payload.unknown.count}`,
    ...payload.unknown.samples.slice(0, 15).map((x) => `- ${x}`),
    '',
    `Ungrouped files: ${payload.ungrouped.count}`,
    ...payload.ungrouped.samples.slice(0, 15).map((x) => `- ${x}`),
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'));

  console.log(`Z data layout audit written: ${OUT_JSON}`);
}

run();
