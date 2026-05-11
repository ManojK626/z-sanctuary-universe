#!/usr/bin/env node
/**
 * Registry-driven snapshot: each PC-root project path, presence, and optional git head age.
 * Never fails CI: missing paths or git errors become structured fields, exit 0 always.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HUB = path.resolve(__dirname, '..');
const PC_PATH = path.join(HUB, 'data', 'z_pc_root_projects.json');
const OUT_PATH = path.join(HUB, 'data', 'reports', 'z_project_freshness.json');

function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function daysSince(iso) {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / 86400000);
}

function gitLines(cwd, args) {
  const r = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 2 * 1024 * 1024,
    windowsHide: true
  });
  if (r.error || r.status !== 0) return { ok: false, out: '', err: r.stderr?.trim() || r.error?.message || 'git failed' };
  return { ok: true, out: (r.stdout || '').trim(), err: '' };
}

function scanProject(pcRoot, proj) {
  const rel = String(proj.path || '');
  const abs = path.resolve(pcRoot, rel);
  const base = {
    id: proj.id || '',
    name: proj.name || '',
    role: proj.role || '',
    registry_path: rel,
    absolute_path: abs
  };

  if (!rel) {
    return { ...base, presence: 'no_path', git: null };
  }
  if (!fs.existsSync(abs)) {
    return { ...base, presence: 'missing', git: null };
  }
  if (!fs.statSync(abs).isDirectory()) {
    return { ...base, presence: 'not_directory', git: null };
  }

  const gitDir = path.join(abs, '.git');
  if (!fs.existsSync(gitDir)) {
    return { ...base, presence: 'ok', git: { ok: false, head_commit_at: null, days_since_commit: null, dirty: false, reason: 'no_git' } };
  }

  const log = gitLines(abs, ['log', '-1', '--format=%cI']);
  const headAt = log.ok ? log.out || null : null;
  const st = gitLines(abs, ['status', '--porcelain']);
  const dirty = st.ok && Boolean(st.out);

  return {
    ...base,
    presence: 'ok',
    git: {
      ok: log.ok,
      head_commit_at: headAt,
      days_since_commit: daysSince(headAt),
      dirty,
      reason: log.ok ? '' : log.err
    }
  };
}

const reg = readJsonSafe(PC_PATH);
const pcRoot = reg?.pc_root ? path.normalize(reg.pc_root) : '';
const projects = Array.isArray(reg?.projects) ? reg.projects : [];

const rows = pcRoot ? projects.map((p) => scanProject(pcRoot, p)) : [];

let present = 0;
let missing = 0;
let withGit = 0;
let dirty = 0;
let maxDays = null;
let stale30 = 0;

for (const r of rows) {
  if (r.presence === 'ok') present += 1;
  if (r.presence === 'missing') missing += 1;
  const g = r.git;
  if (g?.ok && g.head_commit_at) {
    withGit += 1;
    const d = g.days_since_commit;
    if (d != null) {
      if (maxDays == null || d > maxDays) maxDays = d;
      if (d > 30) stale30 += 1;
    }
  }
  if (g?.dirty) dirty += 1;
}

const payload = {
  generated_at: new Date().toISOString(),
  hub_root: HUB,
  pc_root: pcRoot || null,
  registry_source: reg?.source || null,
  projects: rows,
  summary: {
    projects_scanned: rows.length,
    present,
    missing,
    with_git_heads: withGit,
    dirty_worktrees: dirty,
    max_days_since_commit: maxDays,
    stale_heads_over_30d: stale30
  }
};

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(
  `✅ Project freshness: ${OUT_PATH} (${rows.length} scanned, ${present} present, ${missing} missing, ${withGit} git heads)`
);
