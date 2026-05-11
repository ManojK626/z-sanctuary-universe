import fs from 'node:fs';
import path from 'node:path';

const LAB_ROOT = path.resolve(process.argv[2] || path.join(process.cwd(), '..'));
const MANIFEST_PATH = path.join(LAB_ROOT, 'lab_manifest.json');
const REGISTRY_DIR = path.join(LAB_ROOT, 'registry');
const REGISTRY_JSON = path.join(REGISTRY_DIR, 'lab_registry.json');
const REGISTRY_MD = path.join(REGISTRY_DIR, 'lab_registry.md');
const HISTORY_JSONL = path.join(REGISTRY_DIR, 'lab_registry_history.jsonl');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, payload) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function listDirs(rootPath) {
  if (!fs.existsSync(rootPath)) return [];
  return fs
    .readdirSync(rootPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(rootPath, entry.name));
}

function moduleSummary(dirPath, track) {
  const id = path.basename(dirPath);
  const files = fs.existsSync(dirPath) ? fs.readdirSync(dirPath) : [];
  const manifestPath = path.join(dirPath, 'module_manifest.json');
  const manifest = readJson(manifestPath, null);
  const hasManifest = Boolean(manifest);
  const hasModuleDoc = files.includes('MODULE.md');
  const hasRoadmap = files.includes('roadmap.md');
  const hasRisks = files.includes('risks.md');
  const hasDecisions = files.includes('decisions.log');

  return {
    id,
    track,
    path: dirPath.replace(/\\/g, '/'),
    status: hasManifest ? String(manifest.status || 'draft') : 'draft',
    runtime_linked: false,
    approval_required: true,
    has_manifest: hasManifest,
    has_module_doc: hasModuleDoc,
    has_roadmap: hasRoadmap,
    has_risks: hasRisks,
    has_decisions_log: hasDecisions,
    last_seen_at: new Date().toISOString(),
  };
}

function scoreCompleteness(module) {
  const checks = [
    module.has_manifest,
    module.has_module_doc,
    module.has_roadmap,
    module.has_risks,
    module.has_decisions_log,
  ];
  const passed = checks.filter(Boolean).length;
  return Math.round((passed / checks.length) * 100);
}

function toMd(payload) {
  const lines = [
    '# Z Labs Registry',
    '',
    `- Generated: ${payload.generated_at}`,
    `- Status: ${payload.status}`,
    `- Total modules: ${payload.total_modules}`,
    `- Draft track: ${payload.by_track.modules_draft}`,
    `- Prototype track: ${payload.by_track.module_prototypes}`,
    '',
    '## Modules',
  ];

  if (!payload.modules.length) {
    lines.push('- none');
    return `${lines.join('\n')}\n`;
  }

  payload.modules.forEach((m) => {
    lines.push(
      `- ${m.id} | track=${m.track} | status=${m.status} | completeness=${m.completeness_pct}% | manifest=${m.has_manifest}`
    );
  });

  return `${lines.join('\n')}\n`;
}

const draftRoot = path.join(LAB_ROOT, 'modules_draft');
const protoRoot = path.join(LAB_ROOT, 'module_prototypes');

const modules = [
  ...listDirs(draftRoot).map((dir) => moduleSummary(dir, 'modules_draft')),
  ...listDirs(protoRoot).map((dir) => moduleSummary(dir, 'module_prototypes')),
].map((m) => ({ ...m, completeness_pct: scoreCompleteness(m) }));

const payload = {
  generated_at: new Date().toISOString(),
  status: 'ready',
  lab_root: LAB_ROOT.replace(/\\/g, '/'),
  total_modules: modules.length,
  by_track: {
    modules_draft: modules.filter((m) => m.track === 'modules_draft').length,
    module_prototypes: modules.filter((m) => m.track === 'module_prototypes').length,
  },
  modules: modules.sort((a, b) => a.id.localeCompare(b.id)),
  notes: 'Lab-only simulation registry. No Sanctuary runtime linkage.',
};

const manifest = readJson(MANIFEST_PATH, {
  lab_name: 'Z-Sanctuary Labs',
  mode: 'contained',
  rules: {
    no_core_writes: true,
    no_autorun: true,
    approval_required_for_execution: true,
  },
  modules: [],
});

manifest.modules = payload.modules.map((m) => ({
  id: m.id,
  track: m.track,
  path: m.path,
  status: m.status,
  runtime_linked: false,
  approval_required: true,
  completeness_pct: m.completeness_pct,
  last_seen_at: m.last_seen_at,
}));
manifest.last_registry_sync_at = payload.generated_at;

ensureDir(REGISTRY_DIR);
writeJson(REGISTRY_JSON, payload);
writeJson(MANIFEST_PATH, manifest);
fs.writeFileSync(REGISTRY_MD, toMd(payload), 'utf8');
fs.appendFileSync(
  HISTORY_JSONL,
  `${JSON.stringify({ ts: payload.generated_at, total_modules: payload.total_modules })}\n`,
  'utf8'
);

console.log(`Z Labs registry synced: ${REGISTRY_JSON}`);
