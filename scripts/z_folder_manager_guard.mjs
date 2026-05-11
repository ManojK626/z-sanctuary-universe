import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const POLICY_PATH = path.join(ROOT, 'data', 'z_folder_manager_policy.json');
const REGISTRY_PATH = path.join(ROOT, 'rules', 'Z_FORMULA_REGISTRY.json');
const SECURITY_POLICY_PATH = path.join(ROOT, 'rules', 'Z_SANCTUARY_SECURITY_POLICY.md');
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const STATUS_PATH = path.join(REPORTS_DIR, 'z_folder_manager_status.json');
const STATUS_MD_PATH = path.join(REPORTS_DIR, 'z_folder_manager_status.md');
const ALIGNMENT_PATH = path.join(REPORTS_DIR, 'z_folder_structure_alignment.json');
const ALIGNMENT_MD_PATH = path.join(REPORTS_DIR, 'z_folder_structure_alignment.md');
const RELOCATION_PLAN_PATH = path.join(REPORTS_DIR, 'z_folder_relocation_plan.json');
const RELOCATION_PLAN_MD_PATH = path.join(REPORTS_DIR, 'z_folder_relocation_plan.md');

const VAULT_ROOT = path.join(ROOT, 'safe_pack', 'z_sanctuary_vault', 'folder_manager');
const SNAPSHOT_ROOT = path.join(VAULT_ROOT, 'snapshots');
const LATEST_MANIFEST = path.join(VAULT_ROOT, 'latest_manifest.json');
const PROTECTED_ENTRYPOINTS = new Set(['core/index.html']);

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
}

function normalizeRel(relPath) {
  return String(relPath || '').replace(/\\/g, '/');
}

function isProtectedEntrypoint(relPath) {
  return PROTECTED_ENTRYPOINTS.has(normalizeRel(relPath));
}

function writeSnapshotRedirectEntrypoint(destPath) {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Z Snapshot Redirect</title>
    <meta http-equiv="refresh" content="0; url=/core/index.html" />
    <script>
      location.replace('/core/index.html');
    </script>
    <style>
      body {
        margin: 0;
        background: #020b2b;
        color: #00d9ff;
        font-family: Consolas, "Segoe UI", Arial, sans-serif;
        display: grid;
        min-height: 100vh;
        place-items: center;
      }
      a { color: #00d9ff; }
    </style>
  </head>
  <body>
    <main>
      <p>Redirecting to canonical dashboard...</p>
      <p><a href="/core/index.html">Open Z Main Dashboard</a></p>
    </main>
  </body>
</html>
`;
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, html, 'utf8');
}

function protectSnapshotEntrypoints(snapshotDir) {
  const replaced = [];
  for (const rel of PROTECTED_ENTRYPOINTS) {
    const filePath = path.join(snapshotDir, rel);
    writeSnapshotRedirectEntrypoint(filePath);
    replaced.push(rel);
  }
  return replaced;
}

function ensureGuards(policy) {
  const registry = readJson(REGISTRY_PATH, {});
  const checks = [
    {
      id: 'registry_internal_only',
      pass: String(registry?.status || '').toLowerCase() === 'internal-only',
      note: `registry status=${registry?.status || 'unknown'}`
    },
    {
      id: 'registry_miniai_authorized',
      pass: Array.isArray(registry?.access) && registry.access.includes('Mini-AI'),
      note: 'registry access includes Mini-AI'
    },
    {
      id: 'security_policy_present',
      pass: fs.existsSync(SECURITY_POLICY_PATH),
      note: 'security policy file present'
    },
    {
      id: 'policy_internal_mode',
      pass: String(policy?.mode || '').toLowerCase() === 'internal-only',
      note: `policy mode=${policy?.mode || 'unknown'}`
    }
  ];
  const failed = checks.filter((c) => !c.pass);
  return { checks, failed };
}

function shouldSkip(relPath, policy) {
  const normalized = normalizeRel(relPath);
  const excludes = Array.isArray(policy?.exclude_contains) ? policy.exclude_contains : [];
  return excludes.some((token) => normalized.includes(token));
}

function walkFiles(absRoot, relRoot, policy, out = []) {
  if (!fs.existsSync(absRoot)) return out;
  const entries = fs.readdirSync(absRoot, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(absRoot, entry.name);
    const rel = path.join(relRoot, entry.name);
    if (shouldSkip(rel, policy)) continue;
    if (entry.isDirectory()) {
      walkFiles(abs, rel, policy, out);
      continue;
    }
    if (!entry.isFile()) continue;
    out.push(rel);
  }
  return out;
}

function hashFile(absPath, algorithm = 'sha256') {
  const hash = crypto.createHash(algorithm);
  hash.update(fs.readFileSync(absPath));
  return hash.digest('hex');
}

function snapshot(policy) {
  const now = new Date().toISOString();
  const stamp = now.replace(/[:.]/g, '-');
  const snapshotDir = path.join(SNAPSHOT_ROOT, stamp);
  fs.mkdirSync(snapshotDir, { recursive: true });
  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const allowedRoots = Array.isArray(policy?.allowed_roots) ? policy.allowed_roots : [];
  const maxBytes = Number(policy?.max_file_size_mb || 5) * 1024 * 1024;
  const hashAlg = policy?.hash_algorithm || 'sha256';

  const files = [];
  for (const relRoot of allowedRoots) {
    const absRoot = path.join(ROOT, relRoot);
    if (!fs.existsSync(absRoot)) continue;
    const found = walkFiles(absRoot, relRoot, policy);
    files.push(...found);
  }

  const copied = [];
  const skipped = [];

  for (const relFile of files) {
    const normalizedRel = normalizeRel(relFile);
    if (isProtectedEntrypoint(normalizedRel)) {
      skipped.push({ path: normalizedRel, reason: 'protected_entrypoint' });
      continue;
    }
    const src = path.join(ROOT, relFile);
    const stat = fs.statSync(src);
    if (stat.size > maxBytes) {
      skipped.push({ path: normalizedRel, reason: 'size_limit' });
      continue;
    }
    const dest = path.join(snapshotDir, relFile);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    copied.push({
      path: normalizedRel,
      bytes: stat.size,
      hash: hashFile(src, hashAlg)
    });
  }

  const protectedRedirects = protectSnapshotEntrypoints(snapshotDir);

  const manifest = {
    generated_at: now,
    mode: 'snapshot',
    policy_version: policy?.version || 'unknown',
    hash_algorithm: hashAlg,
    snapshot_rel: path.relative(ROOT, snapshotDir).replace(/\\/g, '/'),
    copied_count: copied.length,
    skipped_count: skipped.length,
    protected_redirects: protectedRedirects,
    files: copied,
    skipped
  };

  writeJson(path.join(snapshotDir, 'manifest.json'), manifest);
  writeJson(LATEST_MANIFEST, manifest);
  return manifest;
}

function recreate(policy, apply = false) {
  const now = new Date().toISOString();
  const latest = readJson(LATEST_MANIFEST, null);
  if (!latest?.snapshot_rel || !Array.isArray(latest?.files)) {
    throw new Error('No latest snapshot manifest found. Run snapshot first.');
  }
  const hashAlg = policy?.hash_algorithm || 'sha256';
  const sourceRoot = path.join(ROOT, latest.snapshot_rel);
  const changes = [];

  for (const item of latest.files) {
    const rel = normalizeRel(item.path);
    if (!rel) continue;
    if (isProtectedEntrypoint(rel)) continue;
    const dest = path.join(ROOT, rel);
    const src = path.join(sourceRoot, rel);
    if (!fs.existsSync(src)) continue;

    if (!fs.existsSync(dest)) {
      changes.push({ path: rel, action: 'create' });
      if (apply) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
      }
      continue;
    }
    const currentHash = hashFile(dest, hashAlg);
    if (currentHash !== item.hash) {
      changes.push({ path: rel, action: 'update' });
      if (apply) {
        fs.copyFileSync(src, dest);
      }
    }
  }

  return {
    generated_at: now,
    mode: apply ? 'recreate_apply' : 'recreate_dry_run',
    source_snapshot: latest.snapshot_rel,
    drift_warn_threshold: Number(policy?.drift_warn_threshold || 10),
    drift_warning: changes.length > Number(policy?.drift_warn_threshold || 10),
    candidate_changes: changes.length,
    changes: changes.slice(0, 200)
  };
}

function sanitizeSnapshots() {
  if (!fs.existsSync(SNAPSHOT_ROOT)) {
    return { scanned: 0, patched: 0, details: [] };
  }
  const entries = fs.readdirSync(SNAPSHOT_ROOT, { withFileTypes: true });
  const details = [];
  let patched = 0;
  let scanned = 0;
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    scanned += 1;
    const snapshotDir = path.join(SNAPSHOT_ROOT, entry.name);
    const target = path.join(snapshotDir, 'core', 'index.html');
    if (!fs.existsSync(target)) continue;
    writeSnapshotRedirectEntrypoint(target);
    patched += 1;
    details.push(path.relative(ROOT, target).replace(/\\/g, '/'));
  }
  return { scanned, patched, details: details.slice(0, 200) };
}

function canonicalName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function listTopLevelDirectories() {
  if (!fs.existsSync(ROOT)) return [];
  return fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

function findDuplicateLikeTopDirs() {
  const tops = listTopLevelDirectories();
  const grouped = new Map();
  for (const dir of tops) {
    const key = canonicalName(dir);
    if (!key) continue;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(dir);
  }
  const duplicateGroups = [];
  for (const [, names] of grouped.entries()) {
    if (names.length > 1) {
      duplicateGroups.push({
        canonical: canonicalName(names[0]),
        names: names.sort(),
      });
    }
  }
  return duplicateGroups.sort((a, b) => a.canonical.localeCompare(b.canonical));
}

function requiredDirectories(policy) {
  const configured = Array.isArray(policy?.required_directories) ? policy.required_directories : [];
  if (configured.length > 0) return configured;
  return [
    'data/reports',
    'data/reports/commflow',
    'data/reports/history',
    'safe_pack/z_sanctuary_vault/folder_manager/snapshots',
    'Z_Labs/modules_draft',
    'Z_Labs/module_prototypes',
  ];
}

function defaultRootFileHints() {
  return {
    '.md': 'docs/',
    '.json': 'data/',
    '.mjs': 'scripts/',
    '.js': 'core/ or scripts/',
    '.html': 'dashboard/Html/ or docs/public/',
    '.css': 'interface/ or dashboard/',
  };
}

function collectRootFileAssignments(policy) {
  const hints = { ...defaultRootFileHints(), ...(policy?.root_file_assignment_hints || {}) };
  const allowRootFiles = new Set(
    (Array.isArray(policy?.allow_root_files) ? policy.allow_root_files : []).map((x) => String(x || '').toLowerCase())
  );
  if (!fs.existsSync(ROOT)) return [];
  const out = [];
  const entries = fs.readdirSync(ROOT, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (allowRootFiles.has(String(entry.name || '').toLowerCase())) continue;
    const ext = path.extname(entry.name).toLowerCase();
    const suggested = hints[ext];
    if (!suggested) continue;
    out.push({
      file: entry.name,
      extension: ext,
      suggested_home: suggested,
      note: 'Root-level file detected; review placement for comm-flow clarity.',
    });
  }
  return out.slice(0, 200);
}

function relocationPriorityFor(fileHint) {
  const file = String(fileHint?.file || '');
  const ext = String(fileHint?.extension || '').toLowerCase();
  const lower = file.toLowerCase();
  if (lower.includes('{') || lower.includes(' ')) {
    return {
      priority: 'critical',
      safety: 'manual-only',
      reason: 'Suspicious root filename pattern; verify naming and ownership first.',
    };
  }
  if (ext === '.js' || ext === '.mjs') {
    return {
      priority: 'high',
      safety: 'manual-with-runtime-check',
      reason: 'Runtime-capable script at root; relocation can impact imports/launch flow.',
    };
  }
  if (ext === '.md' || ext === '.css' || ext === '.html') {
    return {
      priority: 'normal',
      safety: 'manual-safe',
      reason: 'Documentation or presentation asset; relocate with link updates if referenced.',
    };
  }
  return {
    priority: 'low',
    safety: 'manual-safe',
    reason: 'General root cleanup candidate.',
  };
}

function buildRelocationPlan(rootHints) {
  const steps = rootHints.map((hint, idx) => {
    const p = relocationPriorityFor(hint);
    return {
      order: idx + 1,
      file: hint.file,
      extension: hint.extension,
      suggested_home: hint.suggested_home,
      priority: p.priority,
      safety: p.safety,
      reason: p.reason,
      action: 'propose-move',
      mode: 'dry-run-only',
    };
  });
  const byPriority = {
    critical: steps.filter((s) => s.priority === 'critical'),
    high: steps.filter((s) => s.priority === 'high'),
    normal: steps.filter((s) => s.priority === 'normal'),
    low: steps.filter((s) => s.priority === 'low'),
  };
  return { steps, byPriority };
}

function writeRelocationPlan(plan) {
  const payload = {
    generated_at: new Date().toISOString(),
    mode: 'dry-run',
    status: plan.steps.length ? 'watch' : 'clear',
    totals: {
      all: plan.steps.length,
      critical: plan.byPriority.critical.length,
      high: plan.byPriority.high.length,
      normal: plan.byPriority.normal.length,
      low: plan.byPriority.low.length,
    },
    priorities: plan.byPriority,
    notes: [
      'This is a relocation proposal only; no file moves were executed.',
      'Apply relocation manually in small batches with verify checks between batches.',
      'Run `npm run verify:ci` after each high/critical batch.',
    ],
  };
  writeJson(RELOCATION_PLAN_PATH, payload);

  const toLines = (arr) =>
    arr.length
      ? arr.map((x) => `- ${x.file} -> ${x.suggested_home} [${x.priority} | ${x.safety}]`)
      : ['- none'];
  const md = [
    '# Z Folder Relocation Plan',
    '',
    `Generated: ${payload.generated_at}`,
    `Mode: ${payload.mode}`,
    `Status: **${String(payload.status).toUpperCase()}**`,
    '',
    '## Totals',
    `- all: ${payload.totals.all}`,
    `- critical: ${payload.totals.critical}`,
    `- high: ${payload.totals.high}`,
    `- normal: ${payload.totals.normal}`,
    `- low: ${payload.totals.low}`,
    '',
    '## Critical',
    ...toLines(payload.priorities.critical),
    '',
    '## High',
    ...toLines(payload.priorities.high),
    '',
    '## Normal',
    ...toLines(payload.priorities.normal),
    '',
    '## Low',
    ...toLines(payload.priorities.low),
    '',
  ];
  fs.writeFileSync(RELOCATION_PLAN_MD_PATH, md.join('\n'), 'utf8');
  return payload;
}

function alignStructure(policy, apply = false) {
  const now = new Date().toISOString();
  const mustExist = requiredDirectories(policy);
  const missing = [];
  const ensured = [];
  for (const rel of mustExist) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) {
      missing.push(rel);
      if (apply) {
        fs.mkdirSync(abs, { recursive: true });
        ensured.push(rel);
      }
    }
  }

  const duplicateLikeDirs = findDuplicateLikeTopDirs();
  const rootFileAssignments = collectRootFileAssignments(policy);
  const relocationPlan = buildRelocationPlan(rootFileAssignments);
  const relocationPayload = writeRelocationPlan(relocationPlan);
  const duplicateWarnings = duplicateLikeDirs.length;
  const assignmentWarnings = rootFileAssignments.length;

  const status =
    missing.length === 0 && duplicateWarnings === 0 && assignmentWarnings === 0
      ? 'aligned'
      : 'watch';

  const payload = {
    generated_at: now,
    mode: apply ? 'align_apply' : 'align_dry_run',
    status,
    required_directories_total: mustExist.length,
    missing_required_directories: missing,
    created_directories: ensured,
    duplicate_like_top_dirs: duplicateLikeDirs,
    root_file_assignment_hints: rootFileAssignments,
    relocation_plan_summary: relocationPayload.totals,
    relocation_plan_report: {
      json: path.relative(ROOT, RELOCATION_PLAN_PATH).replace(/\\/g, '/'),
      md: path.relative(ROOT, RELOCATION_PLAN_MD_PATH).replace(/\\/g, '/'),
    },
    notes: [
      'No file moves are auto-applied by align mode.',
      'Use this report to remove duplicate-like folder structures safely.',
      'Apply mode creates missing required communication-flow folders only.',
    ],
  };

  writeJson(ALIGNMENT_PATH, payload);
  const md = [
    '# Z Folder Structure Alignment',
    '',
    `Generated: ${payload.generated_at}`,
    `Mode: ${payload.mode}`,
    `Status: **${String(payload.status).toUpperCase()}**`,
    '',
    '## Required Directories',
    `- total: ${payload.required_directories_total}`,
    `- missing: ${payload.missing_required_directories.length}`,
    `- created (apply): ${payload.created_directories.length}`,
    ...payload.missing_required_directories.map((d) => `- missing: ${d}`),
    ...payload.created_directories.map((d) => `- created: ${d}`),
    '',
    '## Duplicate-like Top Directories',
    ...(payload.duplicate_like_top_dirs.length
      ? payload.duplicate_like_top_dirs.map((g) => `- ${g.names.join(' | ')}`)
      : ['- none']),
    '',
    '## Root File Placement Hints',
    ...(payload.root_file_assignment_hints.length
      ? payload.root_file_assignment_hints.map((x) => `- ${x.file} -> ${x.suggested_home}`)
      : ['- none']),
    '',
  ];
  fs.writeFileSync(ALIGNMENT_MD_PATH, md.join('\n'), 'utf8');
  return payload;
}

function writeStatus(status, checks) {
  const payload = {
    generated_at: new Date().toISOString(),
    status: checks.failed.length ? 'blocked' : 'ready',
    guard_checks: checks.checks,
    ...status
  };
  writeJson(STATUS_PATH, payload);
  const md = [
    '# Z Folder Manager Status',
    '',
    `Generated: ${payload.generated_at}`,
    `Status: ${payload.status}`,
    `Mode: ${payload.mode || 'status'}`,
    '',
    '## Guard Checks',
    ...payload.guard_checks.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.id}: ${c.note}`),
    '',
    '## Summary',
    `- copied_count: ${payload.copied_count ?? 'n/a'}`,
    `- skipped_count: ${payload.skipped_count ?? 'n/a'}`,
    `- candidate_changes: ${payload.candidate_changes ?? 'n/a'}`,
    `- drift_warn_threshold: ${payload.drift_warn_threshold ?? 'n/a'}`,
    `- drift_warning: ${payload.drift_warning ?? 'n/a'}`,
    ''
  ];
  fs.mkdirSync(path.dirname(STATUS_MD_PATH), { recursive: true });
  fs.writeFileSync(STATUS_MD_PATH, md.join('\n'), 'utf8');
}

function main() {
  const command = (process.argv[2] || 'status').toLowerCase();
  const apply = process.argv.includes('--apply');
  const policy = readJson(POLICY_PATH, {});
  const checks = ensureGuards(policy);

  if (checks.failed.length) {
    writeStatus({ mode: command, notes: 'Guard check failed. Action blocked.' }, checks);
    console.error('Z Folder Manager blocked by guard checks.');
    process.exit(2);
  }

  if (command === 'snapshot') {
    const res = snapshot(policy);
    writeStatus(res, checks);
    console.log('Z Folder Manager snapshot complete.');
    return;
  }

  if (command === 'recreate') {
    const res = recreate(policy, apply);
    writeStatus(res, checks);
    console.log(`Z Folder Manager recreate ${apply ? 'apply' : 'dry-run'} complete.`);
    return;
  }

  if (command === 'sanitize-snapshots') {
    const res = {
      mode: 'sanitize-snapshots',
      ...sanitizeSnapshots()
    };
    writeStatus(res, checks);
    console.log('Z Folder Manager snapshot entrypoints sanitized.');
    return;
  }

  if (command === 'align') {
    const res = alignStructure(policy, apply);
    writeStatus(
      {
        mode: res.mode,
        alignment_status: res.status,
        missing_required_directories: res.missing_required_directories.length,
        created_directories: res.created_directories.length,
        duplicate_like_top_dirs: res.duplicate_like_top_dirs.length,
        root_file_assignment_hints: res.root_file_assignment_hints.length,
        alignment_report: path.relative(ROOT, ALIGNMENT_PATH).replace(/\\/g, '/'),
      },
      checks
    );
    console.log(`Z Folder Manager alignment ${apply ? 'applied' : 'dry-run'} complete.`);
    return;
  }

  const latest = readJson(LATEST_MANIFEST, null);
  writeStatus(
    {
      mode: 'status',
      latest_snapshot: latest?.snapshot_rel || null,
      copied_count: latest?.copied_count ?? null,
      skipped_count: latest?.skipped_count ?? null
    },
    checks
  );
  console.log('Z Folder Manager status written.');
}

main();
