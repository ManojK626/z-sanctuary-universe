import fs from 'node:fs';
import path from 'node:path';
import { generateKeyPairSync } from 'node:crypto';

const ROOT = process.cwd();
const PRIVATE_PATH = path.join(ROOT, 'vault', 'personal', 'z_request_access_private.pem');
const PUBLIC_PATH = path.join(ROOT, 'config', 'z_request_access_public.pem');

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function run() {
  const { privateKey, publicKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  const privatePem = privateKey.export({ type: 'pkcs8', format: 'pem' });
  const publicPem = publicKey.export({ type: 'spki', format: 'pem' });

  ensureDir(PRIVATE_PATH);
  ensureDir(PUBLIC_PATH);

  fs.writeFileSync(PRIVATE_PATH, privatePem, { mode: 0o600 });
  fs.writeFileSync(PUBLIC_PATH, publicPem);

  console.log('Key pair generated.');
  console.log(`Private key: ${PRIVATE_PATH}`);
  console.log(`Public key:  ${PUBLIC_PATH}`);
}

run();
