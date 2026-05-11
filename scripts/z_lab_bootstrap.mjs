import fs from 'node:fs';
import path from 'node:path';
import { resolveLabRoot } from './z_lab_root_resolver.mjs';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const REPORT_JSON = path.join(REPORTS_DIR, 'z_lab_bootstrap.json');
const REPORT_MD = path.join(REPORTS_DIR, 'z_lab_bootstrap.md');

function parseArgs(argv) {
  const out = { labPath: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--path' && argv[i + 1]) {
      out.labPath = argv[i + 1];
      i += 1;
    }
  }
  return out;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFileIfMissing(filePath, content) {
  if (fs.existsSync(filePath)) {
    return false;
  }
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

function normalizeRel(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

const args = parseArgs(process.argv.slice(2));
const { labRoot: resolvedLabRoot, policy } = resolveLabRoot(ROOT);
const defaultLabPath = resolvedLabRoot;
const labRoot = path.resolve(args.labPath || defaultLabPath);

const folders = [
  labRoot,
  path.join(labRoot, 'modules_draft'),
  path.join(labRoot, 'ai_experiments'),
  path.join(labRoot, 'roadmap_designs'),
  path.join(labRoot, 'storage_blueprints'),
  path.join(labRoot, 'module_prototypes'),
  path.join(labRoot, 'notes'),
  path.join(labRoot, 'exports'),
];

folders.forEach(ensureDir);

const createdFiles = [];
const existingFiles = [];

const protocolPath = path.join(labRoot, 'Z_AGENT_PROTOCOL.md');
const protocolCreated = writeFileIfMissing(
  protocolPath,
  `# Z Agent Protocol - Lab Mode

Scope: Z_Labs only.

Rules:
1. Never modify ZSanctuary_Universe directory.
2. Never modify production scripts from this workspace.
3. All generated modules stay inside /modules_draft or /module_prototypes.
4. No auto-execution scripts allowed.
5. Output is spec-first unless explicit approval is given.
6. No file promotion to Sanctuary without manual review.
7. No live ingestion from Sanctuary internal logs.
8. Confirm before adding dependencies.
9. Keep changes reversible and documented.
`
);
(protocolCreated ? createdFiles : existingFiles).push(protocolPath);

const deployPath = path.join(labRoot, 'Z_DEPLOYMENT_PIPELINE.md');
const deployCreated = writeFileIfMissing(
  deployPath,
  `# Z Deployment Pipeline - Lab to Sanctuary

Promotion path:
1. Build in Z_Labs (/modules_draft or /module_prototypes).
2. Review architecture/spec and security constraints.
3. Promote manually into ZSanctuary_Universe/modules as disabled.
4. Run gates:
   - npm run lint
   - npm run cycle:routine
   - npm run maintain:daily
5. Enable only after governance approval.

Safety:
- No direct runtime link from lab to production.
- No silent overwrite of Sanctuary files.
- Every promotion must leave an audit note.
`
);
(deployCreated ? createdFiles : existingFiles).push(deployPath);

const readmePath = path.join(labRoot, 'README.md');
const readmeCreated = writeFileIfMissing(
  readmePath,
  `# Z_Labs Workspace

Purpose:
- Isolated build zone for new modules and experiments.
- No direct runtime effect on Z-Sanctuary production.

Primary folders:
- modules_draft/
- module_prototypes/
- ai_experiments/
- roadmap_designs/
- storage_blueprints/

This workspace is designed for calm, reversible, governance-first development.
`
);
(readmeCreated ? createdFiles : existingFiles).push(readmePath);

const gitignorePath = path.join(labRoot, '.gitignore');
const gitignoreCreated = writeFileIfMissing(
  gitignorePath,
  `node_modules/
.DS_Store
Thumbs.db
*.log
*.tmp
`
);
(gitignoreCreated ? createdFiles : existingFiles).push(gitignorePath);

const report = {
  generated_at: new Date().toISOString(),
  status: 'ready',
  lab_root: labRoot,
  lab_policy: policy,
  folders_created: folders.map((f) => f.replace(/\\/g, '/')),
  files_created: createdFiles.map((f) => f.replace(/\\/g, '/')),
  files_already_present: existingFiles.map((f) => f.replace(/\\/g, '/')),
  notes: 'Z_Labs bootstrap completed without modifying existing Sanctuary runtime folders.',
};

ensureDir(REPORTS_DIR);
fs.writeFileSync(REPORT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
fs.writeFileSync(
  REPORT_MD,
  `# Z Labs Bootstrap

- Generated: ${report.generated_at}
- Status: ${report.status}
- Lab root: ${report.lab_root}

## Created Files
${report.files_created.length ? report.files_created.map((f) => `- ${f}`).join('\n') : '- none'}

## Existing Files
${report.files_already_present.length ? report.files_already_present.map((f) => `- ${f}`).join('\n') : '- none'}

## Report Paths
- ${normalizeRel(REPORT_JSON)}
- ${normalizeRel(REPORT_MD)}
`,
  'utf8'
);

console.log(`Z_Labs bootstrap complete: ${labRoot}`);
