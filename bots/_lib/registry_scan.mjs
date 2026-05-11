import fs from 'node:fs';
import path from 'node:path';

/** Cheap string distance for short folder names (hints only). */
export function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

export function similarDirNames(pcRoot, targetRel, { max = 5 } = {}) {
  if (!pcRoot || !targetRel || !fs.existsSync(pcRoot)) return [];
  let entries = [];
  try {
    entries = fs.readdirSync(pcRoot, { withFileTypes: true }).filter((d) => d.isDirectory());
  } catch {
    return [];
  }
  const target = path.basename(targetRel);
  const scored = [];
  for (const e of entries) {
    const name = e.name;
    if (name === target) continue;
    const dist = levenshtein(target.toLowerCase(), name.toLowerCase());
    if (dist <= 0 || dist > 6) continue;
    scored.push({ name, dist });
  }
  scored.sort((a, b) => a.dist - b.dist);
  return [...new Set(scored.slice(0, max).map((s) => s.name))];
}

/**
 * One registry row in z_bot_guardian.json `results[]` shape (schema v2).
 */
export function scanRegistryProject(pcRoot, proj) {
  const id = proj.id || '';
  const name = proj.name || '';
  const role = proj.role || '';
  const relRaw = proj.path;
  const rel = relRaw == null ? '' : String(relRaw).trim();

  const base = { id, name };

  if (!rel) {
    return {
      ...base,
      path_relative: null,
      absolute: null,
      status: 'skipped_external',
      severity: 'LOW',
      role: role || 'external',
      note: 'no pc_root path (external or link-only)'
    };
  }

  const absolute = path.resolve(pcRoot, rel);
  const exists = fs.existsSync(absolute) && fs.statSync(absolute).isDirectory();

  if (!exists) {
    return {
      ...base,
      path_relative: rel,
      absolute,
      status: 'missing',
      severity: 'HIGH',
      similar_names: similarDirNames(pcRoot, rel)
    };
  }

  return {
    ...base,
    path_relative: rel,
    absolute,
    status: 'present',
    severity: 'NONE'
  };
}

export function buildGuardianReport(pcRoot, projects) {
  const results = projects.map((p) => scanRegistryProject(pcRoot, p));
  let present = 0;
  let missing = 0;
  let skipped_external = 0;
  const severity = { HIGH: 0, MEDIUM: 0, LOW: 0, NONE: 0 };
  for (const r of results) {
    if (r.status === 'present') present += 1;
    if (r.status === 'missing') missing += 1;
    if (r.status === 'skipped_external') skipped_external += 1;
    const s = r.severity || 'NONE';
    if (severity[s] != null) severity[s] += 1;
  }
  const highest =
    missing > 0 ? 'HIGH' : severity.MEDIUM > 0 ? 'MEDIUM' : severity.LOW > 0 ? 'LOW' : 'NONE';
  return {
    results,
    summary: {
      total: results.length,
      present,
      missing,
      skipped_external,
      severity,
      highest_severity: highest
    }
  };
}
