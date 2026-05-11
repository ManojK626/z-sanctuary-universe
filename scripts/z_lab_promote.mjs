import fs from 'node:fs';
import path from 'node:path';
import { resolveLabRoot } from './z_lab_root_resolver.mjs';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_lab_promote.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_lab_promote.md');
const { labRoot: LAB_ROOT, policy } = resolveLabRoot(ROOT);

function parseArgs(argv) {
  const result = {
    module: null,
    source: 'modules_draft',
    target: 'staging_modules',
    apply: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--module' && argv[i + 1]) {
      result.module = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--source' && argv[i + 1]) {
      result.source = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--target' && argv[i + 1]) {
      result.target = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === '--apply') {
      result.apply = true;
      continue;
    }
    if (arg === '--dry-run') {
      result.apply = false;
    }
  }
  return result;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDirRecursive(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else if (entry.isFile()) {
      ensureDir(path.dirname(destPath));
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function moduleExists(modulePath) {
  return fs.existsSync(modulePath) && fs.statSync(modulePath).isDirectory();
}

const args = parseArgs(process.argv.slice(2));
const sourceRoot = path.join(LAB_ROOT, args.source);
const sourceModulePath = args.module ? path.join(sourceRoot, args.module) : null;
const targetRoot = path.resolve(ROOT, args.target);
const targetModulePath = args.module ? path.join(targetRoot, args.module) : null;

const checks = [
  {
    id: 'lab_root_exists',
    pass: fs.existsSync(LAB_ROOT),
    note: LAB_ROOT.replace(/\\/g, '/'),
  },
  {
    id: 'source_root_exists',
    pass: fs.existsSync(sourceRoot),
    note: sourceRoot.replace(/\\/g, '/'),
  },
  {
    id: 'module_provided',
    pass: Boolean(args.module),
    note: args.module || 'missing',
  },
  {
    id: 'module_exists_in_source',
    pass: Boolean(sourceModulePath && moduleExists(sourceModulePath)),
    note: sourceModulePath ? sourceModulePath.replace(/\\/g, '/') : 'n/a',
  },
];

const failedChecks = checks.filter((check) => !check.pass);
let promoted = false;
let overwritten = false;
let copiedFiles = 0;

if (!failedChecks.length && targetModulePath) {
  overwritten = moduleExists(targetModulePath);
  if (args.apply) {
    copyDirRecursive(sourceModulePath, targetModulePath);
    promoted = true;
    copiedFiles = fs.readdirSync(sourceModulePath, { recursive: true }).length;
  }
}

const payload = {
  generated_at: new Date().toISOString(),
  mode: args.apply ? 'apply' : 'dry-run',
  status: failedChecks.length ? 'blocked' : 'ready',
  lab_policy: policy,
  source_root: sourceRoot.replace(/\\/g, '/'),
  target_root: targetRoot.replace(/\\/g, '/'),
  module: args.module,
  source_module_path: sourceModulePath ? sourceModulePath.replace(/\\/g, '/') : null,
  target_module_path: targetModulePath ? targetModulePath.replace(/\\/g, '/') : null,
  checks,
  promoted,
  overwritten_target: overwritten,
  copied_entries_estimate: copiedFiles,
  notes: args.apply
    ? 'Promotion applied to staging target only. No runtime linking performed.'
    : 'Dry-run only. No files changed.',
};

ensureDir(REPORTS_DIR);
fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
fs.writeFileSync(
  OUT_MD,
  `# Z Lab Promote

- Generated: ${payload.generated_at}
- Mode: ${payload.mode}
- Status: ${payload.status}
- Module: ${payload.module || 'n/a'}
- Source: ${payload.source_module_path || 'n/a'}
- Target: ${payload.target_module_path || 'n/a'}
- Promoted: ${payload.promoted}
- Overwrote target: ${payload.overwritten_target}

## Checks
${checks.map((check) => `- [${check.pass ? 'x' : ' '}] ${check.id} (${check.note})`).join('\n')}

## Notes
- ${payload.notes}
`,
  'utf8'
);

if (failedChecks.length) {
  console.error('Z Lab promote blocked by validation checks.');
  process.exit(2);
}

console.log(
  `Z Lab promote ${args.apply ? 'applied' : 'dry-run'} complete: ${args.module} -> ${payload.target_root}`
);
