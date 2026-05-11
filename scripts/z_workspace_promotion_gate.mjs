import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_workspace_promotion_gate.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_workspace_promotion_gate.md');

function parseArgs(argv) {
  const out = {
    peerRoot: null,
    promote: false
  };
  for (const arg of argv) {
    if (arg.startsWith('--peer-root=')) out.peerRoot = path.resolve(arg.slice('--peer-root='.length));
    if (arg === '--promote') out.promote = true;
  }
  return out;
}

function readJson(absPath) {
  return JSON.parse(fs.readFileSync(absPath, 'utf8'));
}

function safeRead(absPath) {
  if (!fs.existsSync(absPath)) return null;
  return readJson(absPath);
}

const args = parseArgs(process.argv.slice(2));
if (!args.peerRoot) {
  console.error('Usage: node scripts/z_workspace_promotion_gate.mjs --peer-root=<path> [--promote]');
  process.exit(2);
}

const policy = safeRead(path.join(ROOT, 'config', 'z_multi_workspace_policy.json'));
const identity = safeRead(path.join(ROOT, 'config', 'z_workspace_identity.json'));
const localVersion = safeRead(path.join(ROOT, 'z_workspace_version.json'));
const peerVersion = safeRead(path.join(args.peerRoot, 'z_workspace_version.json'));

const checks = [];
checks.push({
  id: 'promotion_flag_explicit',
  pass: args.promote,
  note: args.promote ? '--promote provided' : '--promote flag missing'
});
checks.push({
  id: 'local_workspace_version_present',
  pass: !!localVersion,
  note: localVersion ? `local_version=${localVersion.version}` : 'missing local z_workspace_version.json'
});
checks.push({
  id: 'peer_workspace_version_present',
  pass: !!peerVersion,
  note: peerVersion ? `peer_version=${peerVersion.version}` : 'missing peer z_workspace_version.json'
});

const requireMatch = policy?.version_control?.require_version_match_for_merge === true;
const versionsMatch =
  !!localVersion && !!peerVersion && String(localVersion.version) === String(peerVersion.version);
checks.push({
  id: 'version_match_for_merge',
  pass: !requireMatch || versionsMatch,
  note: `require_match=${String(requireMatch)} local=${localVersion?.version || 'n/a'} peer=${peerVersion?.version || 'n/a'}`
});

const status = checks.every((c) => c.pass) ? 'approved' : 'blocked';
const payload = {
  generated_at: new Date().toISOString(),
  status,
  workspace: identity?.id || 'UNKNOWN',
  peer_root: args.peerRoot.replace(/\\/g, '/'),
  checks
};

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
fs.writeFileSync(
  OUT_MD,
  [
    '# Z Workspace Promotion Gate',
    '',
    `- Generated: ${payload.generated_at}`,
    `- Status: ${payload.status.toUpperCase()}`,
    `- Workspace: ${payload.workspace}`,
    `- Peer Root: ${payload.peer_root}`,
    '',
    '## Checks',
    ...checks.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.id}: ${c.note}`),
    ''
  ].join('\n'),
  'utf8'
);

if (status !== 'approved') {
  console.error('Promotion blocked. Review report and re-run with required conditions.');
  process.exit(1);
}

console.log(`Promotion gate approved: ${OUT_JSON}`);
