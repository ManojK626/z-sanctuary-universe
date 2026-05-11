import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REVOCATION_PATH = path.join(ROOT, 'config', 'z_request_access_revocations.json');

function readJson(filePath, fallback = null) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function parseArg(name, fallback = null) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((x) => x.startsWith(prefix));
  if (!arg) return fallback;
  return arg.slice(prefix.length);
}

function writeJson(filePath, payload) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
}

function usage() {
  console.log('Usage:');
  console.log('  node scripts/z_access_token_revoke.mjs --jti=<token_jti>');
  console.log('  node scripts/z_access_token_revoke.mjs --revoke-before-now=1');
}

function run() {
  const jti = parseArg('jti', null);
  const revokeBeforeNow = parseArg('revoke-before-now', null);
  if (!jti && !revokeBeforeNow) {
    usage();
    process.exit(1);
  }

  const now = Math.floor(Date.now() / 1000);
  const current = readJson(REVOCATION_PATH, {
    version: '1.0.0',
    generated_at: new Date().toISOString(),
    revoked_before_epoch: 0,
    revoked_jti: [],
  });

  const revoked = new Set(Array.isArray(current.revoked_jti) ? current.revoked_jti : []);
  if (jti) revoked.add(jti);

  const payload = {
    version: current.version || '1.0.0',
    generated_at: new Date().toISOString(),
    revoked_before_epoch:
      revokeBeforeNow !== null ? now : Number(current.revoked_before_epoch || 0),
    revoked_jti: [...revoked].sort(),
  };

  writeJson(REVOCATION_PATH, payload);
  console.log(`Revocations updated: ${REVOCATION_PATH}`);
  console.log(`revoked_jti_count=${payload.revoked_jti.length}`);
  console.log(`revoked_before_epoch=${payload.revoked_before_epoch}`);
}

run();
