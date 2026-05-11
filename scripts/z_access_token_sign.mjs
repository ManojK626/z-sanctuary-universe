import fs from 'node:fs';
import path from 'node:path';
import { createPrivateKey, sign as signRaw } from 'node:crypto';

const ROOT = process.cwd();
const DEFAULT_PRIVATE = path.join(ROOT, 'vault', 'personal', 'z_request_access_private.pem');

function base64Url(input) {
  const data = typeof input === 'string' ? Buffer.from(input, 'utf8') : Buffer.from(input);
  return data.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function parseArg(name, fallback = null) {
  const prefix = `--${name}=`;
  const arg = process.argv.find((x) => x.startsWith(prefix));
  if (!arg) return fallback;
  return arg.slice(prefix.length);
}

function usage() {
  console.log('Usage: node scripts/z_access_token_sign.mjs --scope=trust_portal_deep --hours=8 --path-prefix=/Amk_Goku%20Worldwide%20Loterry/ui/public_trust/ [--private=path]');
}

function run() {
  const scope = parseArg('scope', 'trust_portal_deep');
  const hours = Number(parseArg('hours', '8'));
  const pathPrefix = parseArg('path-prefix', '/Amk_Goku%20Worldwide%20Loterry/ui/public_trust/');
  const privatePath = parseArg('private', DEFAULT_PRIVATE);

  if (!fs.existsSync(privatePath)) {
    console.error(`Private key missing: ${privatePath}`);
    usage();
    process.exit(2);
  }

  const now = Math.floor(Date.now() / 1000);
  const jti = `${scope}:${now}:${Math.random().toString(16).slice(2, 10)}`;
  const payload = {
    scope,
    iat: now,
    exp: now + Math.max(1, hours) * 3600,
    path_prefix: decodeURIComponent(pathPrefix),
    jti,
    nonce: `${now}-${Math.random().toString(16).slice(2)}`,
  };

  const payloadB64 = base64Url(JSON.stringify(payload));
  const key = createPrivateKey(fs.readFileSync(privatePath, 'utf8'));
  const signature = signRaw('sha256', Buffer.from(payloadB64, 'utf8'), key);
  const sigB64 = base64Url(signature);
  const token = `${payloadB64}.${sigB64}`;

  console.log('Token generated:');
  console.log(token);
  console.log(`JTI: ${jti}`);
  console.log('');
  console.log('Use URL:');
  console.log(`...?z_access=${token}`);
}

run();
