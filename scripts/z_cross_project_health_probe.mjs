#!/usr/bin/env node
/**
 * Read-only health probe for every folder listed in data/z_pc_root_projects.json.
 * Writes ONLY under data/reports/ in this repo (never modifies member projects).
 * Aligns with config/z_growth_safe_operations.json (growth-safe, observe-first).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const PC_ROOT_JSON = path.join(ROOT, 'data', 'z_pc_root_projects.json');
const POLICY_PATH = path.join(ROOT, 'config', 'z_growth_safe_operations.json');
const OUT_JSON = path.join(REPORTS_DIR, 'z_cross_project_observer.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_cross_project_observer.md');

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

function probeProject(absPath, meta) {
  const issues = [];
  if (!absPath) {
    issues.push({ code: 'empty_path', severity: 'bad' });
    return { ...meta, absPath: '', ok: false, issues };
  }
  if (!fs.existsSync(absPath)) {
    issues.push({ code: 'missing', severity: 'bad', detail: 'folder not found' });
    return { ...meta, absPath, ok: false, issues };
  }
  const st = fs.statSync(absPath);
  if (!st.isDirectory()) {
    issues.push({ code: 'not_directory', severity: 'bad' });
    return { ...meta, absPath, ok: false, issues };
  }
  const pkg = path.join(absPath, 'package.json');
  const requiresNodePackage = meta?.role === 'hub' || Boolean(meta?.ssws);
  if (requiresNodePackage && !fs.existsSync(pkg)) {
    issues.push({ code: 'no_package_json', severity: 'warn', detail: 'required for hub/SSWS Node flows' });
  }
  const maxSeverity = issues.some((i) => i.severity === 'bad') ? 'bad' : issues.length ? 'warn' : 'ok';
  return {
    ...meta,
    absPath,
    ok: maxSeverity !== 'bad',
    issues,
    severity: maxSeverity,
  };
}

function main() {
  const policy = readJson(POLICY_PATH);
  const data = readJson(PC_ROOT_JSON);
  if (!data || !Array.isArray(data.projects)) {
    console.error('Missing or invalid', PC_ROOT_JSON);
    process.exit(1);
  }

  const pcRoot = path.resolve(String(data.pc_root || path.join(ROOT, '..')).replace(/\//g, path.sep));
  const rows = data.projects.map((p) => {
    const rel = p.path || p.id || '';
    const abs = rel ? path.join(pcRoot, rel) : '';
    return probeProject(abs, {
      id: p.id,
      name: p.name,
      role: p.role,
      ssws: Boolean(p.ssws),
      ssws_shadow: Boolean(p.ssws_shadow),
      formula_aware: Boolean(p.formula_aware),
    });
  });

  const bad = rows.filter((r) => r.severity === 'bad').length;
  const warn = rows.filter((r) => r.severity === 'warn').length;
  const status = bad > 0 ? 'hold' : warn > 0 ? 'watch' : 'green';

  const payload = {
    generated_at: new Date().toISOString(),
    status,
    policy_probe_mode: policy?.cross_project?.probe_mode || 'read_only',
    pc_root: pcRoot,
    hub: data.hub || 'ZSanctuary_Universe',
    summary: { total: rows.length, bad, warn, ok: rows.filter((r) => r.severity === 'ok').length },
    projects: rows,
    autonomy_note:
      'This probe never writes outside ZSanctuary_Universe/data/reports. Hub autonomous repair stays in hub; member fixes require human or EAII-approved flows.',
  };

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z Cross-Project Observer (read-only)',
    '',
    `Generated: ${payload.generated_at}`,
    `Status: **${status}** · projects: ${rows.length} · bad: ${bad} · warn: ${warn}`,
    '',
    '| Name | Role | Severity | Notes |',
    '|------|------|----------|-------|',
    ...rows.map((r) => {
      const note = (r.issues || []).map((i) => i.code).join(', ') || '—';
      return `| ${r.name || r.id} | ${r.role || '—'} | ${r.severity || '—'} | ${note} |`;
    }),
    '',
    payload.autonomy_note,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(`Cross-project observer: ${OUT_JSON} status=${status}`);
}

main();
