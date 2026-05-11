#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ORGANISER_ROOT = path.resolve(ROOT, '..');
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const PC_ROOT_PATH = path.join(ROOT, 'data', 'z_pc_root_projects.json');
const REGISTRY_PATH = path.join(ORGANISER_ROOT, 'z-eaii-registry.json');
const OUT_JSON = path.join(REPORTS_DIR, 'z_boundary_service_ownership.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_boundary_service_ownership.md');

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function norm(p) {
  return String(p || '')
    .replace(/\//g, '\\')
    .toLowerCase()
    .trim();
}

function relFromPcRoot(absPath) {
  const rel = path.relative(ORGANISER_ROOT, absPath);
  return rel === '' ? '' : rel.replace(/\//g, '\\');
}

const payload = {
  generated_at: new Date().toISOString(),
  status: 'green',
  violations: [],
  checks: [],
};

const pcRoot = readJson(PC_ROOT_PATH);
if (!pcRoot || !Array.isArray(pcRoot.projects)) {
  payload.status = 'hold';
  payload.violations.push({
    code: 'pc_root_projects_invalid',
    severity: 'critical',
    detail: 'data/z_pc_root_projects.json missing or invalid',
  });
}

const registry = readJson(REGISTRY_PATH);
if (!registry || !Array.isArray(registry.projects)) {
  payload.status = 'hold';
  payload.violations.push({
    code: 'organiser_registry_invalid',
    severity: 'critical',
    detail: 'z-eaii-registry.json missing or invalid',
  });
}

if (payload.violations.length === 0) {
  const hubRows = pcRoot.projects.filter((p) => p.role === 'hub');
  if (hubRows.length !== 1) {
    payload.violations.push({
      code: 'hub_role_count',
      severity: 'critical',
      detail: `Expected exactly one hub role, got ${hubRows.length}`,
    });
  } else {
    payload.checks.push(`hub role: ${hubRows[0].name}`);
  }

  const sswsRows = pcRoot.projects.filter((p) => Boolean(p.ssws));
  if (sswsRows.length !== 1) {
    payload.violations.push({
      code: 'ssws_owner_count',
      severity: 'critical',
      detail: `Expected exactly one ssws owner, got ${sswsRows.length}`,
    });
  } else {
    payload.checks.push(`ssws owner: ${sswsRows[0].name}`);
  }

  const seenRel = new Map();
  for (const row of pcRoot.projects) {
    const rel = norm(row.path);
    if (!rel) continue;
    if (seenRel.has(rel)) {
      payload.violations.push({
        code: 'duplicate_pc_relative_path',
        severity: 'critical',
        detail: `${row.name} and ${seenRel.get(rel)} share path ${row.path}`,
      });
    } else {
      seenRel.set(rel, row.name || row.id || row.path);
    }
  }

  const registryByName = new Map(
    registry.projects.map((p) => [norm(p.name), p]).filter(([k]) => Boolean(k))
  );

  for (const row of pcRoot.projects) {
    if (!String(row.path || '').trim()) {
      continue;
    }
    const reg = registryByName.get(norm(row.name));
    if (!reg?.path) {
      payload.violations.push({
        code: 'registry_missing_for_pc_project',
        severity: 'critical',
        detail: `${row.name} not found in organiser registry by name`,
      });
      continue;
    }
    const regRel = norm(relFromPcRoot(reg.path));
    const pcRel = norm(row.path);
    if (regRel !== pcRel) {
      payload.violations.push({
        code: 'path_mismatch_registry_vs_pc',
        severity: 'critical',
        detail: `${row.name}: pc_root path="${row.path}" registry path="${relFromPcRoot(reg.path)}"`,
      });
    }
  }

  const portMap = registry.portRules?.map || {};
  const duplicates = new Map();
  for (const [port, owner] of Object.entries(portMap)) {
    const key = norm(owner);
    if (duplicates.has(key)) duplicates.set(key, [...duplicates.get(key), port]);
    else duplicates.set(key, [port]);
  }
  payload.checks.push(`port rules tracked: ${Object.keys(portMap).length}`);
}

if (payload.violations.length > 0) payload.status = 'hold';

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const md = [
  '# Z Boundary Service Ownership Check',
  '',
  `Generated: ${payload.generated_at}`,
  `Status: **${payload.status}**`,
  '',
  '## Checks',
  ...(payload.checks.length ? payload.checks.map((c) => `- ${c}`) : ['- none']),
  '',
  '## Violations',
  ...(payload.violations.length
    ? payload.violations.map((v) => `- [${v.severity}] ${v.code}: ${v.detail}`)
    : ['- none']),
  '',
];
fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

if (payload.status !== 'green') {
  console.error(`Boundary ownership check FAILED: ${payload.violations.length} violation(s)`);
  process.exit(1);
}

console.log(`Boundary ownership check passed: ${OUT_JSON}`);
