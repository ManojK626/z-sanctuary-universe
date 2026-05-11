#!/usr/bin/env node
/**
 * Phase A acceptance checks for Z Super Chat (static + optional live probe).
 * Verdict: PASS | GAPS | FAIL (printed + JSON line on stdout).
 * Exit: 0 = PASS, 1 = FAIL or GAPS when --strict (else GAPS exits 0).
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HUB = path.resolve(__dirname, '..', '..');
const args = new Set(process.argv.slice(2));
const probe = args.has('--probe');
const strict = args.has('--strict');
const port = Number(process.env.Z_SUPER_CHAT_PORT || process.env.PORT || 5510);

const failures = [];
const gaps = [];

function must(rel, label) {
  const p = path.join(HUB, ...rel.split('/'));
  if (!fs.existsSync(p)) failures.push(`${label}: missing ${rel}`);
}

function readText(rel) {
  try {
    return fs.readFileSync(path.join(HUB, ...rel.split('/')), 'utf8');
  } catch {
    return '';
  }
}

must('scripts/z_super_chat/readonly_chat_server.mjs', 'Server script');
must('docs/public/super_chat/index.html', 'Super Chat UI');
must('data/z_pc_root_projects.json', 'PC root projects');
must('data/z_super_chat_task_hooks.json', 'Task hooks manifest');
must('packages/z-sanctuary-core/ai/engine.js', 'Persona engine');
must('packages/z-sanctuary-core/ai/zuno.json', 'Persona zuno.json');
must('packages/z-sanctuary-core/ai/systemInterpreter.js', 'System interpreter');
must('packages/z-sanctuary-core/ai/guardianSuggestions.js', 'Guardian suggestions');
must('scripts/z_super_chat/ai_memory_store.mjs', 'AI memory store');
must('data/system-status.json', 'System status snapshot');
must('scripts/z_system_status_refresh.mjs', 'System status refresh script');
must('scripts/z_operator_digest_refresh.mjs', 'Operator digest refresh script');

const pkg = readText('package.json');
if (!pkg.includes('super-chat:readonly')) failures.push('package.json: missing super-chat:readonly script');
if (!pkg.includes('super-chat:verify')) failures.push('package.json: missing super-chat:verify script');
if (!pkg.includes('operator:digest')) failures.push('package.json: missing operator:digest script');

const serverSrc = readText('scripts/z_super_chat/readonly_chat_server.mjs');
if (!serverSrc.includes('PATH_DENY') || !serverSrc.toLowerCase().includes('\'vault\'')) {
  failures.push('Server: expected vault in path deny list');
}
if (!serverSrc.includes('read_only: true')) failures.push('Server: expected read_only response');
if (!serverSrc.includes('/api/health')) failures.push('Server: expected /api/health endpoint');
if (!serverSrc.includes('/api/pc-root-projects')) failures.push('Server: expected /api/pc-root-projects (companion registry)');
if (!serverSrc.includes('/api/companion')) failures.push('Server: expected /api/companion (persona engine)');
if (!serverSrc.includes('/api/ai-memory')) failures.push('Server: expected /api/ai-memory');
if (!serverSrc.includes('/api/system-status')) failures.push('Server: expected /api/system-status');
if (!serverSrc.includes('/api/operator-digest')) failures.push('Server: expected /api/operator-digest');
if (!serverSrc.includes('/api/ai-insight')) failures.push('Server: expected /api/ai-insight');
if (!serverSrc.includes('systemInterpreter')) failures.push('Server: expected systemInterpreter import');
if (!serverSrc.includes('ai_memory_store')) failures.push('Server: expected ai_memory_store');
if (!serverSrc.includes('z-sanctuary-core/ai/engine')) failures.push('Server: expected import from z-sanctuary-core/ai/engine');
if (!serverSrc.includes('/api/task-hooks')) failures.push('Server: expected /api/task-hooks endpoint');
if (!serverSrc.includes('/api/task-execute')) failures.push('Server: expected /api/task-execute endpoint');
if (!serverSrc.includes('/api/approval-challenge')) failures.push('Server: expected /api/approval-challenge endpoint');
if (!serverSrc.includes('Z_SUPER_CHAT_ALLOW_TASK_EXECUTE')) {
  failures.push('Server: expected Z_SUPER_CHAT_ALLOW_TASK_EXECUTE gate');
}

const ui = readText('docs/public/super_chat/index.html');
if (!ui.includes('/api/query')) failures.push('UI: expected fetch to /api/query');
if (!ui.includes('/api/companion')) failures.push('UI: expected fetch to /api/companion');
if (!ui.includes('/api/ai-memory')) failures.push('UI: expected fetch to /api/ai-memory');
if (!ui.includes('/api/system-status')) failures.push('UI: expected fetch to /api/system-status');
if (!ui.includes('systemStatusPanel')) failures.push('UI: expected system status panel');
if (!ui.includes('/api/ai-insight')) failures.push('UI: expected fetch to /api/ai-insight');
if (!ui.includes('insightText')) failures.push('UI: expected AI insight panel');
if (!ui.includes('guardianTips')) failures.push('UI: expected Guardian tips panel');
if (!ui.includes('historyList')) failures.push('UI: expected memory history panel');
if (!ui.includes('/api/pc-root-projects')) failures.push('UI: expected fetch to /api/pc-root-projects');

function probeHealth() {
  return new Promise((resolve) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: '/api/health',
        method: 'GET',
        timeout: 2000
      },
      (res) => {
        let body = '';
        res.on('data', (c) => {
          body += c;
        });
        res.on('end', () => {
          try {
            const j = JSON.parse(body);
            resolve(
              Boolean(
                res.statusCode === 200 &&
                  j.ok === true &&
                  (j.read_only === true || j.taskExecuteEnabled === true)
              )
            );
          } catch {
            resolve(false);
          }
        });
      }
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

async function probeQuery() {
  return new Promise((resolve) => {
    const payload = JSON.stringify({ query: 'Z-Sanctuary' });
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: '/api/query',
        method: 'POST',
        timeout: 120000,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      },
      (res) => {
        let body = '';
        res.on('data', (c) => {
          body += c;
        });
        res.on('end', () => {
          try {
            const j = JSON.parse(body);
            resolve(Boolean(res.statusCode === 200 && j.ok && j.read_only === true && Array.isArray(j.hits)));
          } catch {
            resolve(false);
          }
        });
      }
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.write(payload);
    req.end();
  });
}

async function main() {
  let verdict = 'PASS';
  if (failures.length) {
    verdict = 'FAIL';
  } else if (probe) {
    const healthOk = await probeHealth();
    const queryOk = healthOk ? await probeQuery() : false;
    if (!healthOk) gaps.push(`Live probe: no response on 127.0.0.1:${port} (start: npm run super-chat:readonly)`);
    else if (!queryOk) gaps.push('Live probe: /api/query did not return expected read-only JSON');
    if (gaps.length) verdict = 'GAPS';
  }

  const report = {
    verdict,
    hub: HUB,
    port,
    probe,
    failures,
    gaps,
    ts: new Date().toISOString()
  };

  console.log(`Z Super Chat Phase A verify — ${verdict}`);
  if (failures.length) failures.forEach((f) => console.log(`  FAIL: ${f}`));
  if (gaps.length) gaps.forEach((g) => console.log(`  GAP: ${g}`));
  console.log(`JSON:${JSON.stringify(report)}`);

  const exitCode =
    verdict === 'FAIL' || (strict && verdict === 'GAPS') ? 1 : 0;
  process.exit(exitCode);
}

main();
