#!/usr/bin/env node
/**
 * Z Super Chat — Phase A + B (read-only search; optional gated npm runs)
 * Local HTTP: static UI + POST /api/query cross-root search with citations.
 * Optional: Z_SUPER_CHAT_ALLOW_TASK_EXECUTE=1 enables challenge-gated npm run
 * for hooks with allowServerExecute (never super-chat:readonly / verify:probe).
 */
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getAIResponse, formatFormulaPostureBlock } from '../../packages/z-sanctuary-core/ai/engine.js';
import { formatCompanionInsight, interpretSystem } from '../../packages/z-sanctuary-core/ai/systemInterpreter.js';
import { buildGuardianSuggestions } from '../../packages/z-sanctuary-core/ai/guardianSuggestions.js';
import { createMemoryStore, prependMemoryContext } from './ai_memory_store.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HUB_ROOT = path.resolve(__dirname, '..', '..');
const memoryStore = createMemoryStore(HUB_ROOT);
const PC_PROJECTS_JSON = path.join(HUB_ROOT, 'data', 'z_pc_root_projects.json');
const SYSTEM_STATUS_JSON = path.join(HUB_ROOT, 'data', 'system-status.json');
const GUARDIAN_REPORT_JSON = path.join(HUB_ROOT, 'data', 'reports', 'z_guardian_report.json');
const OPERATOR_DIGEST_JSON = path.join(HUB_ROOT, 'data', 'reports', 'z_operator_digest.json');
const PUBLIC_DIR = path.join(HUB_ROOT, 'docs', 'public', 'super_chat');
const EVIDENCE_LOG = path.join(HUB_ROOT, 'data', 'reports', 'z_super_chat_evidence.jsonl');
const TASK_HOOKS_JSON = path.join(HUB_ROOT, 'data', 'z_super_chat_task_hooks.json');
const PACKAGE_JSON = path.join(HUB_ROOT, 'package.json');

const PORT = Number(process.env.Z_SUPER_CHAT_PORT || process.env.PORT || 5510);
const ALLOW_TASK_EXECUTE = process.env.Z_SUPER_CHAT_ALLOW_TASK_EXECUTE === '1';
const TASK_TIMEOUT_MS = Number(process.env.Z_SUPER_CHAT_TASK_TIMEOUT_MS || 300000);
const NPM_CMD = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const SCRIPT_NAME_RE = /^[a-zA-Z0-9:_-]+$/;
/** Never run from this process (self-host deadlock or long-running server). */
const FORBIDDEN_NPM_SCRIPTS = new Set(['super-chat:readonly', 'super-chat:verify:probe']);

/** @type {Map<string, number>} */
const challenges = new Map();

/** Skip indexing these path segments (vault-adjacent, deps, caches). */
const PATH_DENY_SUBSTRINGS = [
  'vault',
  'safe_pack',
  'node_modules',
  '.git',
  '.pytest_cache',
  '.env',
  'credentials',
  'secret'
];

const ALLOW_EXT = new Set(['.md', '.json', '.txt', '.mjs', '.js', '.html', '.css']);
const MAX_FILE_BYTES = 512 * 1024;
const MAX_FILES_PER_ROOT = 1200;
const MAX_TOTAL_FILES = 8000;
const MAX_RESULTS = 24;
const MAX_WALK_DEPTH = 4;

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function loadSystemStatus() {
  try {
    if (!fs.existsSync(SYSTEM_STATUS_JSON)) return null;
    return readJson(SYSTEM_STATUS_JSON);
  } catch {
    return null;
  }
}

/** @returns {object | null} guardian `formula_posture` object */
function loadGuardianFormulaPosture() {
  try {
    if (!fs.existsSync(GUARDIAN_REPORT_JSON)) return null;
    const g = readJson(GUARDIAN_REPORT_JSON);
    const fp = g?.formula_posture;
    return fp && typeof fp === 'object' ? fp : null;
  } catch {
    return null;
  }
}

function loadOperatorDigest() {
  try {
    if (!fs.existsSync(OPERATOR_DIGEST_JSON)) return null;
    return readJson(OPERATOR_DIGEST_JSON);
  } catch {
    return null;
  }
}

function loadProjectNames() {
  try {
    const d = readJson(PC_PROJECTS_JSON);
    return Array.isArray(d.projects) ? d.projects.map((p) => p.name).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function loadTaskHooksManifest() {
  try {
    if (!fs.existsSync(TASK_HOOKS_JSON)) {
      return { ok: false, error: 'manifest_missing', hooks: [] };
    }
    const data = readJson(TASK_HOOKS_JSON);
    const hooks = Array.isArray(data.hooks) ? data.hooks : [];
    return {
      ok: true,
      read_only: true,
      version: data.version ?? 1,
      description: data.description || '',
      hooks
    };
  } catch {
    return { ok: false, error: 'manifest_invalid', hooks: [] };
  }
}

function pruneChallenges() {
  const now = Date.now();
  for (const [id, exp] of challenges) {
    if (exp < now) challenges.delete(id);
  }
}

function mintChallenge() {
  pruneChallenges();
  const id = crypto.randomBytes(16).toString('hex');
  challenges.set(id, Date.now() + 120_000);
  return id;
}

function loadPackageScriptNames() {
  try {
    const pkg = readJson(PACKAGE_JSON);
    const s = pkg.scripts;
    if (!s || typeof s !== 'object') return [];
    return Object.keys(s);
  } catch {
    return [];
  }
}

function hookById(hookId) {
  const { hooks } = loadTaskHooksManifest();
  return hooks.find((h) => h.id === hookId) || null;
}

async function readRequestBody(req) {
  let body = '';
  for await (const chunk of req) body += chunk;
  return body;
}

function isDeniedPath(absPath) {
  const lower = absPath.replaceAll('\\', '/').toLowerCase();
  return PATH_DENY_SUBSTRINGS.some((d) => lower.includes(d));
}

function loadProjectRoots() {
  const data = readJson(PC_PROJECTS_JSON);
  const pcRoot = String(data.pc_root || '').replaceAll('/', path.sep);
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const roots = [];
  for (const p of projects) {
    const relPath = p.path;
    if (!relPath || typeof relPath !== 'string') continue;
    const abs = path.isAbsolute(relPath) ? relPath : path.join(pcRoot, relPath);
    roots.push({ name: p.name || p.id || relPath, abs: path.resolve(abs) });
  }
  return { pcRoot: path.resolve(pcRoot), roots };
}

/**
 * Collect file paths under rootAbs up to budget files (DFS).
 * @param {string} rootAbs
 * @param {string[]} out
 * @param {number} budget
 * @returns {number} files added
 */
function collectFilesFromRoot(rootAbs, out, budget) {
  if (budget <= 0 || !fs.existsSync(rootAbs)) return 0;
  let added = 0;
  /** @type {Array<[string, number]>} */
  const stack = [[rootAbs, 0]];
  while (stack.length > 0 && added < budget && out.length < MAX_TOTAL_FILES) {
    const [dir, depth] = stack.pop();
    if (depth > MAX_WALK_DEPTH) continue;
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (added >= budget || out.length >= MAX_TOTAL_FILES) break;
      const full = path.join(dir, e.name);
      if (isDeniedPath(full)) continue;
      if (e.isDirectory()) {
        stack.push([full, depth + 1]);
      } else if (e.isFile()) {
        const ext = path.extname(e.name).toLowerCase();
        if (!ALLOW_EXT.has(ext)) continue;
        out.push(path.resolve(full));
        added += 1;
      }
    }
  }
  return added;
}

function tokenize(q) {
  return String(q || '')
    .toLowerCase()
    .split(/[^a-z0-9_/-]+/g)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2)
    .slice(0, 12);
}

function scoreFile(content, tokens) {
  const lower = content.toLowerCase();
  let score = 0;
  for (const t of tokens) {
    let pos = 0;
    let hits = 0;
    while (pos < lower.length) {
      const i = lower.indexOf(t, pos);
      if (i < 0) break;
      hits += 1;
      pos = i + t.length;
      if (hits > 500) break;
    }
    score += hits * (1 + Math.min(t.length, 20) * 0.01);
  }
  return score;
}

function snippet(content, tokens) {
  const lower = content.toLowerCase();
  let idx = -1;
  for (const t of tokens) {
    const i = lower.indexOf(t);
    if (i >= 0 && (idx < 0 || i < idx)) idx = i;
  }
  if (idx < 0) idx = 0;
  const start = Math.max(0, idx - 80);
  const slice = content.slice(start, start + 240).replace(/\s+/g, ' ');
  return (start > 0 ? '…' : '') + slice + (start + 240 < content.length ? '…' : '');
}

function projectForPath(fileAbs, roots) {
  const f = path.resolve(fileAbs);
  for (const r of roots) {
    const base = r.abs.endsWith(path.sep) ? r.abs.slice(0, -1) : r.abs;
    if (f === base || f.startsWith(base + path.sep)) return r.name;
  }
  return 'unknown';
}

function searchAcrossRoots(query) {
  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return { ok: true, tokens: [], hits: [], note: 'no_search_tokens' };
  }

  const { roots } = loadProjectRoots();
  const files = [];
  for (const { abs } of roots) {
    if (!fs.existsSync(abs)) continue;
    collectFilesFromRoot(abs, files, MAX_FILES_PER_ROOT);
  }

  const hits = [];
  for (const file of files) {
    let st;
    try {
      st = fs.statSync(file);
    } catch {
      continue;
    }
    if (!st.isFile() || st.size > MAX_FILE_BYTES) continue;
    let raw;
    try {
      raw = fs.readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    const sc = scoreFile(raw, tokens);
    if (sc <= 0) continue;
    hits.push({
      path: file,
      project: projectForPath(file, roots),
      score: sc,
      snippet: snippet(raw, tokens)
    });
  }

  hits.sort((a, b) => b.score - a.score);
  return { ok: true, tokens, hits: hits.slice(0, MAX_RESULTS) };
}

function appendEvidence(entry) {
  fs.mkdirSync(path.dirname(EVIDENCE_LOG), { recursive: true });
  fs.appendFileSync(EVIDENCE_LOG, `${JSON.stringify(entry)}\n`, 'utf8');
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function sendFile(res, filePath, type) {
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const body = fs.readFileSync(filePath);
  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': body.length,
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
    sendFile(res, path.join(PUBLIC_DIR, 'index.html'), 'text/html; charset=utf-8');
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJson(res, 200, {
      ok: true,
      read_only: !ALLOW_TASK_EXECUTE,
      taskExecuteEnabled: ALLOW_TASK_EXECUTE,
      phase: 'A+B',
      service: 'z-super-chat',
      port: PORT
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/system-status') {
    const st = loadSystemStatus();
    if (!st) {
      sendJson(res, 200, {
        ok: true,
        read_only: true,
        verify: 'UNKNOWN',
        projects: 0,
        last_check: '',
        status: 'unknown',
        hub: '',
        source: 'missing_file',
        note: 'Run npm run verify:ci or npm run system-status:refresh'
      });
      return;
    }
    sendJson(res, 200, { ok: true, read_only: true, ...st });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/operator-digest') {
    const d = loadOperatorDigest();
    if (!d) {
      sendJson(res, 200, {
        ok: true,
        read_only: true,
        missing: true,
        note: 'Run npm run operator:digest from ZSanctuary_Universe hub root.'
      });
      return;
    }
    sendJson(res, 200, { ok: true, read_only: true, ...d });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/ai-insight') {
    const st = loadSystemStatus();
    const names = loadProjectNames();
    const formulaPosture = loadGuardianFormulaPosture();
    const formulaPostureSnippet = formulaPosture ? formatFormulaPostureBlock(formulaPosture) : '';
    if (!st) {
      sendJson(res, 200, {
        ok: true,
        read_only: true,
        interpretation: interpretSystem(null),
        narrative: '',
        suggestions: buildGuardianSuggestions(null),
        formula_posture: formulaPosture,
        formula_posture_snippet: formulaPostureSnippet,
        note: 'missing system-status.json'
      });
      return;
    }
    sendJson(res, 200, {
      ok: true,
      read_only: true,
      interpretation: interpretSystem(st),
      narrative: formatCompanionInsight(st, names),
      suggestions: buildGuardianSuggestions(st),
      formula_posture: formulaPosture,
      formula_posture_snippet: formulaPostureSnippet
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/pc-root-projects') {
    try {
      if (!fs.existsSync(PC_PROJECTS_JSON)) {
        sendJson(res, 404, { ok: false, error: 'registry_missing' });
        return;
      }
      const data = readJson(PC_PROJECTS_JSON);
      sendJson(res, 200, { ok: true, ...data });
    } catch (e) {
      sendJson(res, 500, { ok: false, error: String(e?.message || e) });
    }
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/task-run-capability') {
    sendJson(res, 200, {
      ok: true,
      allowExecute: ALLOW_TASK_EXECUTE,
      read_only: !ALLOW_TASK_EXECUTE,
      reason: ALLOW_TASK_EXECUTE
        ? 'Gated npm run enabled for hooks with allowServerExecute.'
        : 'Set environment variable Z_SUPER_CHAT_ALLOW_TASK_EXECUTE=1 before starting this server to enable gated runs.'
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/approval-challenge') {
    if (!ALLOW_TASK_EXECUTE) {
      sendJson(res, 403, { ok: false, error: 'execute_disabled', read_only: true });
      return;
    }
    const challengeId = mintChallenge();
    sendJson(res, 200, {
      ok: true,
      challengeId,
      expiresInSec: 120,
      phraseRequired: 'EXECUTE',
      read_only: false
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/task-execute') {
    if (!ALLOW_TASK_EXECUTE) {
      sendJson(res, 403, { ok: false, error: 'execute_disabled', read_only: true });
      return;
    }
    const raw = await readRequestBody(req);
    let payload;
    try {
      payload = JSON.parse(raw || '{}');
    } catch {
      sendJson(res, 400, { ok: false, error: 'invalid_json' });
      return;
    }
    const hookId = String(payload.hookId || '').trim();
    const challengeId = String(payload.challengeId || '').trim();
    const approval = String(payload.approval || '').trim();
    if (approval !== 'EXECUTE') {
      sendJson(res, 400, { ok: false, error: 'approval_required', phraseRequired: 'EXECUTE' });
      return;
    }
    const exp = challenges.get(challengeId);
    if (!exp || Date.now() > exp) {
      sendJson(res, 400, { ok: false, error: 'invalid_or_expired_challenge' });
      return;
    }
    challenges.delete(challengeId);

    const hook = hookById(hookId);
    if (!hook || !hook.allowServerExecute) {
      sendJson(res, 400, { ok: false, error: 'hook_not_executable' });
      return;
    }
    const npmScript = String(hook.npmScript || '').trim();
    if (!SCRIPT_NAME_RE.test(npmScript) || FORBIDDEN_NPM_SCRIPTS.has(npmScript)) {
      sendJson(res, 400, { ok: false, error: 'script_not_allowed' });
      return;
    }
    const scriptNames = loadPackageScriptNames();
    if (!scriptNames.includes(npmScript)) {
      sendJson(res, 400, { ok: false, error: 'unknown_npm_script' });
      return;
    }

    const started = Date.now();
    const r = spawnSync(NPM_CMD, ['run', npmScript], {
      cwd: HUB_ROOT,
      encoding: 'utf8',
      maxBuffer: 12 * 1024 * 1024,
      timeout: TASK_TIMEOUT_MS,
      env: { ...process.env, FORCE_COLOR: '0' }
    });
    const elapsedMs = Date.now() - started;
    const stdout = String(r.stdout || '').slice(0, 48000);
    const stderr = String(r.stderr || '').slice(0, 48000);
    const timedOut = r.error?.code === 'ETIMEDOUT';

    appendEvidence({
      ts: new Date().toISOString(),
      phase: 'B',
      action: 'task_execute',
      hookId,
      npmScript,
      exitCode: r.status,
      signal: r.signal || null,
      timedOut,
      elapsedMs
    });

    sendJson(res, 200, {
      ok: !timedOut && !r.error && r.status === 0,
      read_only: false,
      exitCode: r.status,
      signal: r.signal,
      timedOut,
      elapsedMs,
      stdout: stdout.slice(0, 12000),
      stderr: stderr.slice(0, 8000)
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/task-hooks') {
    const manifest = loadTaskHooksManifest();
    sendJson(res, 200, {
      ok: manifest.ok,
      read_only: true,
      phase: 'B',
      note: 'Manifest only — no commands are executed from this endpoint.',
      ...manifest
    });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/ai-memory') {
    sendJson(res, 200, {
      ok: true,
      read_only: true,
      entries: memoryStore.getTail(20)
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/companion') {
    const body = await readRequestBody(req);
    let payload;
    try {
      payload = JSON.parse(body || '{}');
    } catch {
      sendJson(res, 400, { ok: false, error: 'invalid_json' });
      return;
    }
    const persona = String(payload.persona || 'zuno').trim();
    const message = String(payload.message || '').trim();
    if (message.length > 2000) {
      sendJson(res, 400, { ok: false, error: 'message_too_long' });
      return;
    }
    let reg;
    try {
      reg = readJson(PC_PROJECTS_JSON);
    } catch {
      sendJson(res, 500, { ok: false, error: 'registry_unreadable' });
      return;
    }
    const projects = Array.isArray(reg.projects) ? reg.projects : [];
    const projectNames = projects.map((p) => p.name).filter(Boolean);
    const recentBefore = memoryStore.getRecent(5);
    const baseReply = getAIResponse(persona, message, projectNames, projects, {
      pc_root: reg.pc_root,
      hub: reg.hub,
      systemStatus: loadSystemStatus(),
      formulaPosture: loadGuardianFormulaPosture(),
      operatorDigest: loadOperatorDigest()
    });
    const reply = prependMemoryContext(baseReply, recentBefore);
    memoryStore.append({
      ai: persona,
      message,
      reply,
      timestamp: Date.now()
    });
    appendEvidence({
      ts: new Date().toISOString(),
      phase: '2',
      action: 'companion',
      persona,
      messagePreview: message.slice(0, 160),
      memoryEntries: recentBefore.length
    });
    sendJson(res, 200, {
      ok: true,
      read_only: true,
      reply,
      persona,
      memoryContextCount: recentBefore.length
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/query') {
    const body = await readRequestBody(req);
    let payload;
    try {
      payload = JSON.parse(body || '{}');
    } catch {
      sendJson(res, 400, { ok: false, error: 'invalid_json' });
      return;
    }
    const query = String(payload.query || '').trim();
    if (query.length > 2000) {
      sendJson(res, 400, { ok: false, error: 'query_too_long' });
      return;
    }

    const result = searchAcrossRoots(query);
    appendEvidence({
      ts: new Date().toISOString(),
      phase: 'A',
      action: 'query',
      tokenCount: result.tokens?.length ?? 0,
      hitCount: result.hits?.length ?? 0,
      queryPreview: query.slice(0, 120)
    });

    sendJson(res, 200, {
      ok: true,
      policy: 'ok',
      read_only: true,
      tokens: result.tokens,
      hits: result.hits
    });
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Z Super Chat listening on http://127.0.0.1:${PORT}`);
  console.log(`Open UI: http://127.0.0.1:${PORT}/`);
  if (ALLOW_TASK_EXECUTE) {
    console.log('Task execute: ON (Z_SUPER_CHAT_ALLOW_TASK_EXECUTE=1) — gated npm run for allowlisted hooks only.');
  } else {
    console.log('Task execute: off (search + manifest only). Set Z_SUPER_CHAT_ALLOW_TASK_EXECUTE=1 to enable gated runs.');
  }
});
