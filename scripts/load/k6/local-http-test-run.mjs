/**
 * End-to-end local HTTP load test: build web app → next start on ephemeral port → k6 → teardown.
 *
 * Usage (repo root):
 *   npm run test:run:http-smoke
 *   npm run test:run:http-heavy
 *
 * Options:
 *   --skip-build   Skip `npm run build --workspace=z-sanctuary-web` (use existing .next)
 */
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { resolveK6Binary } from './resolve-k6.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..', '..');
const webDir = path.join(repoRoot, 'apps', 'web');

function getNextBin() {
  const candidates = [
    path.join(repoRoot, 'node_modules', 'next', 'dist', 'bin', 'next'),
    path.join(webDir, 'node_modules', 'next', 'dist', 'bin', 'next'),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

function allocLocalPort() {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.once('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const addr = s.address();
      const port = typeof addr === 'object' && addr ? addr.port : null;
      s.close((err) => {
        if (err) reject(err);
        else if (port) resolve(port);
        else reject(new Error('Could not allocate port'));
      });
    });
  });
}

async function waitForHttpOk(url, timeoutMs) {
  const start = Date.now();
  let lastErr;
  while (Date.now() - start < timeoutMs) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (r.ok) return;
      lastErr = new Error(`HTTP ${r.status}`);
    } catch (e) {
      lastErr = e;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not become ready: ${url} (${lastErr?.message || 'timeout'})`);
}

function killProcessTree(child) {
  if (!child?.pid) return;
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    child.kill('SIGTERM');
  }
}

const args = process.argv.slice(2);
const heavy = args.includes('--heavy');
const skipBuild = args.includes('--skip-build');

const k6 = resolveK6Binary();
if (!k6) {
  console.error(
    '[test:run:http-*] k6 not found. Install: https://k6.io/docs/get-started/installation/ (Windows: winget install GrafanaLabs.k6)',
  );
  process.exit(1);
}

const nextBin = getNextBin();
if (!nextBin) {
  console.error('[test:run:http-*] Next.js binary not found under node_modules. Run npm ci from repo root.');
  process.exit(1);
}

if (!skipBuild) {
  console.error('[test:run:http-*] Building z-sanctuary-web…');
  const b = spawnSync('npm', ['run', 'build', '--workspace=z-sanctuary-web'], {
    cwd: repoRoot,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (b.status !== 0) process.exit(b.status ?? 1);
}

async function main() {
const port = await allocLocalPort();
const baseUrl = `http://127.0.0.1:${port}`;
console.error(`[test:run:http-*] Starting next start on ${baseUrl} …`);

const server = spawn(process.execPath, [nextBin, 'start', '-p', String(port)], {
  cwd: webDir,
  env: { ...process.env, NODE_ENV: 'production', PORT: String(port) },
  stdio: 'inherit',
});

let k6Status = 1;
try {
  await waitForHttpOk(`${baseUrl}/api/z-qosmei/manifest`, 120_000);
  console.error(`[test:run:http-*] Running k6 (${heavy ? 'heavy' : 'smoke'})…`);

  const scriptPath = path.join(__dirname, 'web-smoke.js');
  const env = {
    ...process.env,
    BASE_URL: baseUrl,
    K6_PROFILE: heavy ? 'heavy' : 'smoke',
  };

  const r = spawnSync(k6, ['run', scriptPath], {
    stdio: 'inherit',
    env,
    cwd: repoRoot,
  });
  k6Status = r.status === null ? 1 : r.status;
} finally {
  console.error('[test:run:http-*] Stopping server…');
  killProcessTree(server);
}

process.exit(k6Status);
}

main().catch((error) => {
  console.error(`[test:run:http-*] failed: ${error?.message || String(error)}`);
  process.exit(1);
});
