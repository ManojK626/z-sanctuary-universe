import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, 'data', 'Z_module_manifest.json');
const MANIFEST_PATH_FALLBACK = path.join(ROOT, 'data', 'z_module_manifest.json');
const OUT_REGISTRY = path.join(ROOT, 'data', 'Z_module_registry.json');
const OUT_AUDIT_JSON = path.join(ROOT, 'data', 'reports', 'z_module_registry_audit.json');
const OUT_AUDIT_MD = path.join(ROOT, 'data', 'reports', 'z_module_registry_audit.md');

function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
}

const manifest = readJson(MANIFEST_PATH) || readJson(MANIFEST_PATH_FALLBACK) || {};
const modules = Array.isArray(manifest.ZModules) ? manifest.ZModules : Array.isArray(manifest.modules) ? manifest.modules : [];

const normalized = modules.map((mod) => ({
  id: mod.ZId || mod.id,
  name: mod.ZName || mod.name || mod.ZId || mod.id,
  layer: mod.ZLayer || mod.layer || 'unknown',
  owner: mod.ZOwner || mod.owner || 'system',
  status: String(mod.ZStatus || mod.status || 'planned').toLowerCase(),
  description: mod.ZDescription || mod.description || '',
  launchTask: mod.ZLaunchTask || mod.launchTask || '',
  openMode: mod.ZOpenMode || mod.openMode || '',
  entry: mod.ZEntry || mod.entry || '',
}));

const statusCounts = normalized.reduce((acc, mod) => {
  acc[mod.status] = (acc[mod.status] || 0) + 1;
  return acc;
}, {});

const layerCounts = normalized.reduce((acc, mod) => {
  acc[mod.layer] = (acc[mod.layer] || 0) + 1;
  return acc;
}, {});

const doneStatuses = new Set(['online', 'active', 'ready', 'imported']);
const doneCount = normalized.filter((m) => doneStatuses.has(m.status)).length;
const total = normalized.length;
const coverage = total ? Math.round((doneCount / total) * 100) : 0;

const registryPayload = {
  ZFormat: 'v1',
  ZUpdatedAt: new Date().toISOString(),
  ZModules: normalized.map((m) => ({
    ZId: m.id,
    ZName: m.name,
    ZLayer: m.layer,
    ZOwner: m.owner,
    ZStatus: m.status,
    ZDescription: m.description,
    ZLaunchTask: m.launchTask,
    ZOpenMode: m.openMode,
    ZEntry: m.entry,
  })),
};

writeJson(OUT_REGISTRY, registryPayload);

const auditPayload = {
  generated_at: new Date().toISOString(),
  total,
  done: doneCount,
  coverage_percent: coverage,
  status_counts: statusCounts,
  layer_counts: layerCounts,
  notes: total ? 'Registry synced from module manifest.' : 'No modules found in manifest.',
};

writeJson(OUT_AUDIT_JSON, auditPayload);

const md = [
  '# Z-Sanctuary Module Registry Audit',
  '',
  `Generated: ${auditPayload.generated_at}`,
  `Total modules: ${total}`,
  `Done/active/ready: ${doneCount}`,
  `Coverage: ${coverage}%`,
  '',
  '## Status counts',
  ...Object.entries(statusCounts).map(([k, v]) => `- ${k}: ${v}`),
  '',
  '## Layer counts',
  ...Object.entries(layerCounts).map(([k, v]) => `- ${k}: ${v}`),
  '',
];

fs.mkdirSync(path.dirname(OUT_AUDIT_MD), { recursive: true });
fs.writeFileSync(OUT_AUDIT_MD, md.join('\n'));

console.log('✅ Module registry synced:', OUT_REGISTRY);
