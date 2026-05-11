import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const POLICY_PATH = path.join(ROOT, 'config', 'z_storage_hygiene_policy.json');
const REPORT_JSON = path.join(ROOT, 'data', 'reports', 'z_storage_hygiene_audit.json');
const REPORT_MD = path.join(ROOT, 'data', 'reports', 'z_storage_hygiene_audit.md');
const QUARANTINE_ROOT = path.join(
  ROOT,
  'safe_pack',
  'z_sanctuary_vault',
  'storage_hygiene',
  'quarantine'
);

const APPLY = process.argv.includes('--apply');
const CONFIRM = process.argv.includes('--confirm');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function shouldSkip(relPath, excludes) {
  const p = relPath.replaceAll('\\', '/');
  return excludes.some((token) => p.includes(token));
}

function walk(rootAbs, rootRel, excludes, files, dirs) {
  if (!fs.existsSync(rootAbs)) return;
  dirs.push(rootRel.replaceAll('\\', '/'));
  const entries = fs.readdirSync(rootAbs, { withFileTypes: true });
  for (const entry of entries) {
    const abs = path.join(rootAbs, entry.name);
    const rel = path.join(rootRel, entry.name).replaceAll('\\', '/');
    if (shouldSkip(rel, excludes)) continue;
    if (entry.isDirectory()) {
      walk(abs, rel, excludes, files, dirs);
    } else if (entry.isFile()) {
      files.push(rel);
    }
  }
}

function hashFile(absPath) {
  const h = crypto.createHash('sha256');
  h.update(fs.readFileSync(absPath));
  return h.digest('hex');
}

function firstCanonical(paths) {
  return [...paths].sort((a, b) => {
    if (a.length !== b.length) return a.length - b.length;
    return a.localeCompare(b);
  })[0];
}

function safeMove(relPath, stamp) {
  const src = path.join(ROOT, relPath);
  if (!fs.existsSync(src)) return null;
  const dst = path.join(QUARANTINE_ROOT, stamp, relPath);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.renameSync(src, dst);
  return {
    from: relPath,
    to: path.relative(ROOT, dst).replaceAll('\\', '/'),
  };
}

function run() {
  const policy = readJson(POLICY_PATH, {});
  const roots = Array.isArray(policy.scan_roots) ? policy.scan_roots : [];
  const excludes = Array.isArray(policy.exclude_contains) ? policy.exclude_contains : [];
  const patterns = (policy.unrelated_name_patterns || []).map((x) => String(x).toLowerCase());
  const allowedDuplicate = (policy.allowed_duplicate_contains || []).map((x) =>
    String(x).toLowerCase()
  );
  const pruneEmptyDirContains = (policy.prune_empty_dir_contains || []).map((x) =>
    String(x).toLowerCase()
  );
  const maxHashBytes = Number(policy.max_hash_size_mb || 20) * 1024 * 1024;
  const limits = policy.limits || {};

  const files = [];
  const dirs = [];
  for (const relRoot of roots) {
    walk(path.join(ROOT, relRoot), relRoot, excludes, files, dirs);
  }

  const emptyFiles = [];
  const unrelatedFlags = [];
  const basenameMap = new Map();
  const hashMap = new Map();

  for (const rel of files) {
    const abs = path.join(ROOT, rel);
    const stat = fs.statSync(abs);
    if (stat.size === 0) emptyFiles.push(rel);

    const base = path.basename(rel).toLowerCase();
    const basenameList = basenameMap.get(base) || [];
    basenameList.push(rel);
    basenameMap.set(base, basenameList);

    const relLc = rel.toLowerCase();
    const fileBase = path.basename(relLc);
    const stem = fileBase.replace(/\.[^.]+$/, '');
    const flagUnrelated = patterns.some((p) => {
      const token = String(p).toLowerCase();
      if (token === 'tmp' || token === 'temp' || token === 'backup') {
        const re = new RegExp(`(^|[\\s._\\-])${token}([\\s._\\-]|$)`, 'i');
        return re.test(stem);
      }
      return relLc.includes(token);
    });
    if (flagUnrelated) unrelatedFlags.push(rel);

    if (stat.size > 0 && stat.size <= maxHashBytes) {
      const hash = hashFile(abs);
      const list = hashMap.get(hash) || [];
      list.push(rel);
      hashMap.set(hash, list);
    }
  }

  const duplicateFileGroups = [];
  for (const [hash, list] of hashMap.entries()) {
    if (list.length <= 1) continue;
    const keep = firstCanonical(list);
    const dupes = list.filter((x) => x !== keep);
    duplicateFileGroups.push({ hash, keep, duplicates: dupes, count: list.length });
  }

  function isAllowedDupGroup(group) {
    const allPaths = [group.keep, ...group.duplicates].map((p) => p.toLowerCase());
    return allPaths.every((p) => allowedDuplicate.some((token) => p.includes(token)));
  }

  const allowedDuplicateGroups = duplicateFileGroups.filter(isAllowedDupGroup);
  const actionableDuplicateGroups = duplicateFileGroups.filter((g) => !isAllowedDupGroup(g));

  const duplicateNameGroups = [];
  for (const [base, list] of basenameMap.entries()) {
    if (list.length > 1) duplicateNameGroups.push({ name: base, count: list.length, files: list.slice(0, 20) });
  }

  const dirNameMap = new Map();
  for (const d of dirs) {
    const name = path.basename(d).toLowerCase();
    if (!name) continue;
    const list = dirNameMap.get(name) || [];
    list.push(d);
    dirNameMap.set(name, list);
  }

  const duplicateFolderNameGroups = [];
  for (const [name, list] of dirNameMap.entries()) {
    if (list.length > 1) duplicateFolderNameGroups.push({ name, count: list.length, folders: list.slice(0, 20) });
  }

  const emptyDirs = dirs.filter((rel) => {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) return false;
    const entries = fs.readdirSync(abs, { withFileTypes: true });
    const visible = entries.filter((e) => !shouldSkip(path.join(rel, e.name), excludes));
    return visible.length === 0;
  });

  const checks = [
    {
      id: 'duplicate_file_groups_limit',
      pass: actionableDuplicateGroups.length <= Number(limits.max_duplicate_file_groups || 0),
      note: `actionable_groups=${actionableDuplicateGroups.length}, allowed_groups=${allowedDuplicateGroups.length}, limit=${limits.max_duplicate_file_groups ?? 0}`,
    },
    {
      id: 'empty_files_limit',
      pass: emptyFiles.length <= Number(limits.max_empty_files || 0),
      note: `empty_files=${emptyFiles.length}, limit=${limits.max_empty_files ?? 0}`,
    },
    {
      id: 'empty_dirs_limit',
      pass: emptyDirs.length <= Number(limits.max_empty_dirs || 0),
      note: `empty_dirs=${emptyDirs.length}, limit=${limits.max_empty_dirs ?? 0}`,
    },
    {
      id: 'unrelated_flags_limit',
      pass: unrelatedFlags.length <= Number(limits.max_unrelated_flags || 0),
      note: `unrelated=${unrelatedFlags.length}, limit=${limits.max_unrelated_flags ?? 0}`,
    },
  ];

  const status = checks.every((c) => c.pass) ? 'green' : 'hold';

  const applyLog = [];
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  if (APPLY && CONFIRM) {
    // Move duplicate copies, empty files, unrelated flags to quarantine.
    for (const group of actionableDuplicateGroups) {
      for (const rel of group.duplicates) {
        const moved = safeMove(rel, stamp);
        if (moved) applyLog.push({ type: 'duplicate_file', ...moved });
      }
    }
    for (const rel of emptyFiles) {
      const moved = safeMove(rel, stamp);
      if (moved) applyLog.push({ type: 'empty_file', ...moved });
    }
    for (const rel of unrelatedFlags) {
      if (applyLog.find((x) => x.from === rel)) continue;
      const moved = safeMove(rel, stamp);
      if (moved) applyLog.push({ type: 'unrelated_flag', ...moved });
    }
    // Empty dirs can be safely removed after file moves.
    for (const rel of emptyDirs.sort((a, b) => b.length - a.length)) {
      const relLc = rel.toLowerCase();
      const shouldPrune = pruneEmptyDirContains.some((token) => relLc.includes(token));
      if (!shouldPrune) continue;
      const abs = path.join(ROOT, rel);
      try {
        fs.rmdirSync(abs);
        applyLog.push({ type: 'empty_dir_removed', from: rel, to: null });
      } catch {
        // ignore
      }
    }
  }

  const payload = {
    generated_at: new Date().toISOString(),
    mode: APPLY && CONFIRM ? 'apply' : 'audit',
    status,
    policy_version: policy.version || 'unknown',
    files_scanned: files.length,
    dirs_scanned: dirs.length,
    checks,
    metrics: {
      duplicate_file_groups: duplicateFileGroups.length,
      duplicate_file_groups_actionable: actionableDuplicateGroups.length,
      duplicate_file_groups_allowed: allowedDuplicateGroups.length,
      duplicate_name_groups: duplicateNameGroups.length,
      duplicate_folder_name_groups: duplicateFolderNameGroups.length,
      empty_files: emptyFiles.length,
      empty_dirs: emptyDirs.length,
      unrelated_flags: unrelatedFlags.length,
    },
    samples: {
      duplicate_file_groups: duplicateFileGroups.slice(0, 20),
      duplicate_file_groups_actionable: actionableDuplicateGroups.slice(0, 20),
      duplicate_file_groups_allowed: allowedDuplicateGroups.slice(0, 20),
      duplicate_name_groups: duplicateNameGroups.slice(0, 20),
      duplicate_folder_name_groups: duplicateFolderNameGroups.slice(0, 20),
      empty_files: emptyFiles.slice(0, 50),
      empty_dirs: emptyDirs.slice(0, 50),
      unrelated_flags: unrelatedFlags.slice(0, 50),
    },
    apply_actions: applyLog,
    note:
      APPLY && !CONFIRM
        ? 'Apply mode requires --confirm. No actions executed.'
        : APPLY && CONFIRM
          ? 'Safe moves performed to quarantine.'
          : 'Audit only. No filesystem changes.',
  };

  fs.mkdirSync(path.dirname(REPORT_JSON), { recursive: true });
  fs.writeFileSync(REPORT_JSON, JSON.stringify(payload, null, 2));

  const md = [
    '# Z Storage Hygiene Audit',
    '',
    `Generated: ${payload.generated_at}`,
    `Mode: ${payload.mode}`,
    `Status: ${payload.status.toUpperCase()}`,
    `Files scanned: ${payload.files_scanned}`,
    `Dirs scanned: ${payload.dirs_scanned}`,
    '',
    '## Checks',
    ...checks.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.id}: ${c.note}`),
    '',
    '## Metrics',
    `- duplicate_file_groups: ${payload.metrics.duplicate_file_groups}`,
    `- duplicate_name_groups: ${payload.metrics.duplicate_name_groups}`,
    `- duplicate_folder_name_groups: ${payload.metrics.duplicate_folder_name_groups}`,
    `- empty_files: ${payload.metrics.empty_files}`,
    `- empty_dirs: ${payload.metrics.empty_dirs}`,
    `- unrelated_flags: ${payload.metrics.unrelated_flags}`,
    '',
    `Note: ${payload.note}`,
    '',
  ];
  fs.writeFileSync(REPORT_MD, md.join('\n'));

  console.log(`Z storage hygiene ${payload.mode} written: ${REPORT_JSON}`);
  if (APPLY && !CONFIRM) {
    console.log('No actions executed. Re-run with --apply --confirm to move items to quarantine.');
  }
}

run();
