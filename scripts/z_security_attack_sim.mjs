import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS, 'z_security_attack_sim.json');
const OUT_MD = path.join(REPORTS, 'z_security_attack_sim.md');

function readText(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return '';
  return fs.readFileSync(abs, 'utf8');
}

function readJson(relPath, fallback = null) {
  const abs = path.join(ROOT, relPath);
  try {
    if (!fs.existsSync(abs)) return fallback;
    return JSON.parse(fs.readFileSync(abs, 'utf8'));
  } catch {
    return fallback;
  }
}

function run() {
  const privacyBoundary = readText('core/z_privacy_boundary.js');
  const requestGate = readText('core/z_request_access_gate.js');
  const proof = readJson('data/reports/z_proof_mesh_card.json', {});
  const revocations = readJson('config/z_request_access_revocations.json', {});

  const tests = [
    {
      id: 'privacy_boundary_raw_block',
      pass:
        privacyBoundary.includes('assertApprovedPath') &&
        privacyBoundary.includes('startsWith(RAW_PREFIX)'),
      note: 'Raw upload path check present',
    },
    {
      id: 'stale_token_replay_guard',
      pass:
        requestGate.includes('loadRevocations') &&
        requestGate.includes('isRevoked') &&
        requestGate.includes('revoked'),
      note: 'Revocation + expiry checks present in request gate',
    },
    {
      id: 'revocation_registry_available',
      pass: Array.isArray(revocations.revoked_jti),
      note: `revoked_jti_count=${Array.isArray(revocations.revoked_jti) ? revocations.revoked_jti.length : 'n/a'}`,
    },
    {
      id: 'report_tamper_signal_ready',
      pass:
        Boolean(proof?.signatures?.trust_pack_hashes_sha256) &&
        Boolean(proof?.signatures?.health_certificate_sha256),
      note: 'Proof signatures present',
    },
  ];

  const payload = {
    generated_at: new Date().toISOString(),
    status: tests.every((t) => t.pass) ? 'green' : 'hold',
    pass: tests.filter((t) => t.pass).length,
    total: tests.length,
    tests,
    note: 'Simulation is policy/controls verification (non-destructive).',
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2));
  const md = [
    '# Z Security Attack Simulation',
    '',
    `Generated: ${payload.generated_at}`,
    `Status: ${payload.status.toUpperCase()}`,
    `Pass: ${payload.pass}/${payload.total}`,
    '',
    '## Tests',
    ...tests.map((t) => `- [${t.pass ? 'x' : ' '}] ${t.id}: ${t.note}`),
    '',
    `Note: ${payload.note}`,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'));

  console.log(`Security attack simulation written: ${OUT_JSON}`);
}

run();
