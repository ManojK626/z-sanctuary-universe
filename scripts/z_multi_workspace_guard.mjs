import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_multi_workspace_guard.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_multi_workspace_guard.md');

function readJson(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return null;
  return JSON.parse(fs.readFileSync(abs, 'utf8'));
}

function check(id, pass, note) {
  return { id, pass, note };
}

const identity = readJson('config/z_workspace_identity.json');
const policy = readJson('config/z_multi_workspace_policy.json');
const broadcast = readJson('z_workspace_broadcast.json');
const version = readJson('z_workspace_version.json');

const checks = [];
checks.push(
  check(
    'identity_file_present',
    !!identity,
    identity ? `workspace=${identity.id}` : 'missing config/z_workspace_identity.json'
  )
);
checks.push(
  check(
    'policy_file_present',
    !!policy,
    policy ? `policy_version=${policy.version}` : 'missing config/z_multi_workspace_policy.json'
  )
);

if (identity) {
  checks.push(
    check(
      'identity_external_writes_disabled',
      identity.allow_external_writes === false,
      `allow_external_writes=${String(identity.allow_external_writes)}`
    )
  );
}

if (policy) {
  const mw = policy.multi_workspace || {};
  checks.push(check('multi_workspace_enabled', mw.enabled === true, `enabled=${String(mw.enabled)}`));
  checks.push(
    check('multi_workspace_strict_isolation', mw.isolation_mode === 'strict', `mode=${mw.isolation_mode}`)
  );
  checks.push(
    check(
      'cross_workspace_writes_disabled',
      mw.cross_workspace_writes === false,
      `cross_workspace_writes=${String(mw.cross_workspace_writes)}`
    )
  );
  checks.push(
    check(
      'promotion_requires_flag',
      mw.promotion_requires_explicit_flag === true,
      `promotion_requires_explicit_flag=${String(mw.promotion_requires_explicit_flag)}`
    )
  );

  const vc = policy.version_control || {};
  checks.push(
    check(
      'version_match_required_for_merge',
      vc.require_version_match_for_merge === true,
      `require_version_match_for_merge=${String(vc.require_version_match_for_merge)}`
    )
  );
}

if (identity && broadcast) {
  checks.push(
    check(
      'broadcast_workspace_matches_identity',
      broadcast.workspace === identity.id,
      `broadcast.workspace=${broadcast.workspace}`
    )
  );
} else {
  checks.push(check('broadcast_file_present', !!broadcast, 'z_workspace_broadcast.json'));
}

if (identity && version) {
  checks.push(
    check(
      'version_workspace_matches_identity',
      version.workspace === identity.id,
      `version.workspace=${version.workspace}`
    )
  );
} else {
  checks.push(check('version_file_present', !!version, 'z_workspace_version.json'));
}

const status = checks.every((x) => x.pass) ? 'green' : 'hold';
const payload = {
  generated_at: new Date().toISOString(),
  status,
  workspace: identity?.id || 'UNKNOWN',
  role: identity?.role || 'unknown',
  checks
};

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
fs.writeFileSync(
  OUT_MD,
  [
    '# Z Multi Workspace Guard',
    '',
    `- Generated: ${payload.generated_at}`,
    `- Status: ${payload.status.toUpperCase()}`,
    `- Workspace: ${payload.workspace}`,
    `- Role: ${payload.role}`,
    '',
    '## Checks',
    ...checks.map((c) => `- [${c.pass ? 'x' : ' '}] ${c.id}: ${c.note}`),
    ''
  ].join('\n'),
  'utf8'
);

if (status !== 'green') {
  console.error('Z multi-workspace guard failed.');
  process.exit(1);
}

console.log(`Z multi-workspace guard passed: ${OUT_JSON}`);
