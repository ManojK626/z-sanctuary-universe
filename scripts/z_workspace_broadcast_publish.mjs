import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const IDENTITY_PATH = path.join(ROOT, 'config', 'z_workspace_identity.json');
const BROADCAST_PATH = path.join(ROOT, 'z_workspace_broadcast.json');

function parseArgs(argv) {
  const out = {
    notice: null,
    version: null,
    impact: null,
    review: null
  };
  for (const arg of argv) {
    if (arg.startsWith('--notice=')) out.notice = arg.slice('--notice='.length);
    if (arg.startsWith('--version=')) out.version = arg.slice('--version='.length);
    if (arg.startsWith('--impact=')) out.impact = arg.slice('--impact='.length);
    if (arg.startsWith('--review=')) out.review = arg.slice('--review='.length);
  }
  return out;
}

function readJson(absPath) {
  return JSON.parse(fs.readFileSync(absPath, 'utf8'));
}

const args = parseArgs(process.argv.slice(2));
const identity = readJson(IDENTITY_PATH);
const current = fs.existsSync(BROADCAST_PATH)
  ? readJson(BROADCAST_PATH)
  : {
      workspace: identity.id,
      version: '0.2',
      upgrade_notice: 'No notice',
      impact_level: 'low',
      requires_manual_review: false
    };

const updated = {
  ...current,
  generated_at: new Date().toISOString(),
  workspace: identity.id,
  upgrade_notice: args.notice || current.upgrade_notice,
  version: args.version || current.version,
  impact_level: args.impact || current.impact_level,
  requires_manual_review:
    args.review === null ? current.requires_manual_review : args.review === 'true'
};

fs.writeFileSync(BROADCAST_PATH, `${JSON.stringify(updated, null, 2)}\n`, 'utf8');
console.log(`Broadcast updated: ${path.relative(ROOT, BROADCAST_PATH).replace(/\\/g, '/')}`);
