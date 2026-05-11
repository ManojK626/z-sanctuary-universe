#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { resolveLabRoot } from './z_lab_root_resolver.mjs';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_lab_module_new.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_lab_module_new.md');

function parseArgs(argv) {
  const out = {
    id: '',
    lane: 'CHAT_ONLY',
    type: 'draft',
    dryRun: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') out.dryRun = true;
    else if (arg.startsWith('--id=')) out.id = arg.slice('--id='.length);
    else if (arg === '--id' && argv[i + 1]) {
      out.id = argv[i + 1];
      i += 1;
    } else if (arg.startsWith('--lane=')) out.lane = arg.slice('--lane='.length);
    else if (arg === '--lane' && argv[i + 1]) {
      out.lane = argv[i + 1];
      i += 1;
    } else if (arg.startsWith('--type=')) out.type = arg.slice('--type='.length);
    else if (arg === '--type' && argv[i + 1]) {
      out.type = argv[i + 1];
      i += 1;
    }
  }
  return out;
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function slugify(input) {
  return String(input || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function normalizeLane(lane) {
  const value = String(lane || '').trim().toUpperCase();
  const allowed = new Set(['CORRESPONDENCE', 'INACCORDANCE', 'CHAT_ONLY']);
  return allowed.has(value) ? value : 'CHAT_ONLY';
}

function normalizeType(type) {
  const value = String(type || '').trim().toLowerCase();
  return value === 'prototype' ? 'prototype' : 'draft';
}

function writeFile(filePath, content, dryRun) {
  if (dryRun) return;
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const moduleId = slugify(args.id);
  if (!moduleId) {
    console.error('Missing module id. Use --id <name> (example: --id z_bridge_router_v2).');
    process.exit(1);
  }

  const lane = normalizeLane(args.lane);
  const type = normalizeType(args.type);
  const { labRoot, policy } = resolveLabRoot(ROOT);
  const baseDir = type === 'prototype' ? path.join(labRoot, 'module_prototypes') : path.join(labRoot, 'modules_draft');
  const moduleDir = path.join(baseDir, moduleId);
  const exists = fs.existsSync(moduleDir);

  const manifest = {
    module_id: moduleId,
    module_type: type,
    lane,
    status: 'draft',
    created_at: new Date().toISOString(),
    owner: 'Z_Labs',
    promotion_state: 'not_promoted',
    promotion_gate: {
      requires_manual_review: true,
      requires_lane_confirmation: true,
      requires_governance_approval: true,
    },
    links: {
      readiness_report: 'data/reports/z_lab_readiness.json',
      lab_status_report: 'data/reports/z_lab_status.json',
    },
  };

  const readme = `# ${moduleId}

Type: ${type}
Lane: ${lane}
Status: draft

## Purpose

Describe the module objective and expected system benefit.

## Scope

- Build and iterate only inside Z_Labs.
- No direct runtime impact on Sanctuary production until manual promotion.

## Next Steps

1. Fill module design notes in \`notes/plan.md\`.
2. Keep acceptance checks in \`checklists/promotion_checklist.md\`.
3. Use \`npm run lab:readiness\` before promotion review.
`;

  const plan = `# ${moduleId} Plan

## Context

- Why this module exists
- Which ecosystem links it needs

## Build Phases

1. Design
2. Prototype
3. Verification
4. Promotion request

## Risks

- Data coupling risk:
- Runtime regression risk:
- Governance/approval risk:
`;

  const checklist = `# Promotion Checklist - ${moduleId}

- [ ] Lane remains correct (${lane})
- [ ] module_manifest.draft.json updated
- [ ] README and plan are current
- [ ] Readiness gate ran (\`npm run lab:readiness\`)
- [ ] Manual governance review requested
- [ ] No direct cross-project linking introduced
`;

  if (exists && !args.dryRun) {
    console.error(`Module already exists: ${moduleDir}`);
    process.exit(1);
  }

  writeFile(path.join(moduleDir, 'module_manifest.draft.json'), `${JSON.stringify(manifest, null, 2)}\n`, args.dryRun);
  writeFile(path.join(moduleDir, 'README.md'), `${readme}\n`, args.dryRun);
  writeFile(path.join(moduleDir, 'notes', 'plan.md'), `${plan}\n`, args.dryRun);
  writeFile(path.join(moduleDir, 'checklists', 'promotion_checklist.md'), `${checklist}\n`, args.dryRun);

  const report = {
    generated_at: new Date().toISOString(),
    status: exists ? 'already_exists' : 'created',
    dry_run: args.dryRun,
    module_id: moduleId,
    lane,
    type,
    lab_root: String(labRoot).replace(/\\/g, '/'),
    lab_policy: policy,
    module_path: String(moduleDir).replace(/\\/g, '/'),
    files: [
      'module_manifest.draft.json',
      'README.md',
      'notes/plan.md',
      'checklists/promotion_checklist.md',
    ],
    notes: args.dryRun ? ['Dry-run only. No files were created.'] : ['Starter created in Z_Labs only.'],
  };

  ensureDir(REPORTS_DIR);
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(
    OUT_MD,
    `# Z Lab Module Starter

- Generated: ${report.generated_at}
- Dry run: ${report.dry_run}
- Module id: ${report.module_id}
- Type: ${report.type}
- Lane: ${report.lane}
- Status: ${report.status}
- Path: ${report.module_path}

## Files
${report.files.map((f) => `- ${f}`).join('\n')}
`,
    'utf8'
  );

  console.log(
    `Z Lab module starter ${args.dryRun ? 'dry-run' : 'done'}: ${report.module_id} (${report.type}/${report.lane})`
  );
}

main();
