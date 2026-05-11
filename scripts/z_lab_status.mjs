import fs from 'node:fs';
import path from 'node:path';
import { resolveLabRoot } from './z_lab_root_resolver.mjs';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_lab_status.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_lab_status.md');
const { labRoot: LAB_ROOT, policy } = resolveLabRoot(ROOT);

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function listModuleDirs(baseDir) {
  if (!fs.existsSync(baseDir)) return [];
  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(baseDir, entry.name));
}

function summarizeModule(dirPath) {
  const files = fs.existsSync(dirPath) ? fs.readdirSync(dirPath) : [];
  const hasDraftManifest = files.includes('module_manifest.draft.json');
  const hasNotes = files.includes('notes') || fs.existsSync(path.join(dirPath, 'notes'));
  const hasReadme = files.some((name) => name.toLowerCase() === 'readme.md');
  return {
    id: path.basename(dirPath),
    path: dirPath.replace(/\\/g, '/'),
    has_draft_manifest: hasDraftManifest,
    has_notes: hasNotes,
    has_readme: hasReadme,
  };
}

const draftRoot = path.join(LAB_ROOT, 'modules_draft');
const protoRoot = path.join(LAB_ROOT, 'module_prototypes');
const draftModules = listModuleDirs(draftRoot).map(summarizeModule);
const protoModules = listModuleDirs(protoRoot).map(summarizeModule);

const payload = {
  generated_at: new Date().toISOString(),
  status: fs.existsSync(LAB_ROOT) ? 'ready' : 'missing',
  lab_root: LAB_ROOT.replace(/\\/g, '/'),
  lab_policy: policy,
  draft_modules_count: draftModules.length,
  prototype_modules_count: protoModules.length,
  draft_modules: draftModules,
  prototype_modules: protoModules,
  notes:
    'Lab status is read-only. No production runtime folders were modified by this command.',
};

ensureDir(REPORTS_DIR);
fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
fs.writeFileSync(
  OUT_MD,
  `# Z Lab Status

- Generated: ${payload.generated_at}
- Status: ${payload.status}
- Lab root: ${payload.lab_root}
- Draft modules: ${payload.draft_modules_count}
- Prototype modules: ${payload.prototype_modules_count}

## Draft Modules
${draftModules.length ? draftModules.map((m) => `- ${m.id} (manifest=${m.has_draft_manifest})`).join('\n') : '- none'}

## Prototype Modules
${protoModules.length ? protoModules.map((m) => `- ${m.id} (manifest=${m.has_draft_manifest})`).join('\n') : '- none'}
`,
  'utf8'
);

console.log(`Z Lab status written: ${OUT_JSON}`);
