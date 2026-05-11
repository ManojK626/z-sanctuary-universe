import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'config', 'z_html_links_hub.json');
const REPORTS_DIR = path.join(ROOT, 'data', 'reports');
const OUT_JSON = path.join(REPORTS_DIR, 'z_web_readiness_check.json');
const OUT_MD = path.join(REPORTS_DIR, 'z_web_readiness_check.md');

function readJson(absPath, fallback = null) {
  try {
    if (!fs.existsSync(absPath)) return fallback;
    return JSON.parse(fs.readFileSync(absPath, 'utf8'));
  } catch {
    return fallback;
  }
}

function relPathToUrl(baseUrl, relPath) {
  const base = String(baseUrl || '').replace(/\/+$/, '');
  const encodedPath = String(relPath || '')
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
  return `${base}/${encodedPath}`;
}

function runOpenCoresNoOpen() {
  const result = spawnSync(process.execPath, ['scripts/z_open_html_cores.mjs', '--no-open'], {
    cwd: ROOT,
    encoding: 'utf8',
    windowsHide: true,
  });
  return {
    ok: (result.status ?? 1) === 0,
    exit: result.status ?? 1,
    stdout: String(result.stdout || '').trim(),
    stderr: String(result.stderr || '').trim(),
  };
}

async function fetchWithTimeout(url, timeoutMs = 5000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8' },
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, body: text };
  } catch (error) {
    return { ok: false, status: 0, error: error.message, body: '' };
  } finally {
    clearTimeout(timer);
  }
}

function buildUrlSet(cfg) {
  const activeProfile = cfg.activeProfile || 'core-only';
  const profileMap = cfg.profiles && typeof cfg.profiles === 'object' ? cfg.profiles : {};
  const startup = Array.isArray(profileMap[activeProfile]) ? profileMap[activeProfile] : [];
  const extras = [
    'core/index.html',
    'core/z_html_links_hub.html',
    'dashboard/index.html',
    'dashboard/panels/consent-center.html',
    'dashboard/panels/explainer.html',
    'docs/public/snapshot/index.html',
  ];
  return [...new Set([...startup, ...extras])];
}

function hasCompassMarker(html) {
  const text = String(html || '');
  if (/data-disable-auto-compass/i.test(text)) return true;
  return text.includes('/interface/z_auto_compass.js');
}

async function main() {
  const generatedAt = new Date().toISOString();
  const cfg = readJson(CONFIG_PATH, {});
  const baseUrl = cfg.baseUrl || 'http://127.0.0.1:5502';

  const warmup = runOpenCoresNoOpen();
  const relPages = buildUrlSet(cfg);
  const urls = relPages.map((rel) => ({ rel, url: relPathToUrl(baseUrl, rel) }));

  const checks = [];
  for (const page of urls) {
    const res = await fetchWithTimeout(page.url, 6000);
    const statusOk = res.ok && res.status >= 200 && res.status < 300;
    const compassOk = statusOk && hasCompassMarker(res.body);
    checks.push({
      id: page.rel,
      url: page.url,
      pass: statusOk && compassOk,
      status: res.status,
      compass_present: compassOk,
      note: statusOk
        ? compassOk
          ? 'ok'
          : 'missing auto-compass marker'
        : `http_error:${res.status || 'request_failed'}${res.error ? ` (${res.error})` : ''}`,
    });
  }

  const failed = checks.filter((c) => !c.pass);
  const status = warmup.ok && failed.length === 0 ? 'green' : 'hold';
  const payload = {
    generated_at: generatedAt,
    status,
    base_url: baseUrl,
    warmup,
    totals: {
      pages_checked: checks.length,
      passed: checks.length - failed.length,
      failed: failed.length,
    },
    checks,
    note:
      status === 'green'
        ? 'Web readiness OK: key pages reachable and auto-compass active.'
        : 'Web readiness has failures. Review report and fix server/page issues.',
  };

  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  const md = [
    '# Z Web Readiness Check',
    '',
    `- Generated: ${generatedAt}`,
    `- Status: ${status.toUpperCase()}`,
    `- Base URL: ${baseUrl}`,
    `- Warmup: ${warmup.ok ? 'OK' : `FAIL (exit=${warmup.exit})`}`,
    `- Pages checked: ${checks.length}`,
    `- Passed: ${checks.length - failed.length}`,
    `- Failed: ${failed.length}`,
    '',
    '## Checks',
    ...checks.map(
      (c) =>
        `- [${c.pass ? 'x' : ' '}] ${c.id} | status=${c.status} | compass=${c.compass_present ? 'yes' : 'no'} | ${c.note}`
    ),
    '',
    `Note: ${payload.note}`,
    '',
  ];
  fs.writeFileSync(OUT_MD, md.join('\n'), 'utf8');

  console.log(`Z web readiness check written: ${OUT_JSON}`);
  if (status !== 'green') {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`Z web readiness check failed: ${error.message}`);
  process.exit(1);
});
