import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ALLOWLIST_PATH = path.join(ROOT, 'config', 'z_research_allowlist.json');
const QUEUE_PATH = path.join(ROOT, 'data', 'research', 'z_research_queue.json');
const REPORT_PATH = path.join(ROOT, 'data', 'reports', 'z_research_intake.json');

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function toHost(urlString) {
  try {
    return new URL(urlString).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function isAllowedHost(host, domains) {
  return domains.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

function extractTitle(htmlText) {
  const match = htmlText.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!match) return null;
  return match[1].replace(/\s+/g, ' ').trim();
}

function summarizeText(htmlText) {
  const text = htmlText
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.slice(0, 420);
}

async function fetchSource(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'Z-Sanctuary-Research-Intake/1.0' },
    });
    const contentType = response.headers.get('content-type') || '';
    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      content_type: contentType,
      title: extractTitle(text),
      summary: summarizeText(text),
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      content_type: null,
      title: null,
      summary: null,
      error: String(error?.message || error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function run() {
  const allowlist = readJson(ALLOWLIST_PATH, { domains: [] });
  const queue = readJson(QUEUE_PATH, { requests: [] });
  const domains = Array.isArray(allowlist.domains) ? allowlist.domains : [];
  const requests = Array.isArray(queue.requests) ? queue.requests : [];

  const items = [];
  for (const entry of requests) {
    const url = String(entry?.url || '').trim();
    const host = toHost(url);
    if (!url || !host) {
      items.push({
        ...entry,
        state: 'blocked',
        reason: 'invalid_url',
      });
      continue;
    }
    if (!isAllowedHost(host, domains)) {
      items.push({
        ...entry,
        host,
        state: 'blocked',
        reason: 'domain_not_allowlisted',
      });
      continue;
    }

    const result = await fetchSource(url);
    items.push({
      ...entry,
      host,
      state: result.ok ? 'captured' : 'error',
      http_status: result.status,
      content_type: result.content_type,
      title: result.title,
      summary: result.summary,
      error: result.error || null,
      approved: false,
      adoption_note: 'Manual review required before any model/module change.',
    });
  }

  const report = {
    generated_at: new Date().toISOString(),
    mode: 'auto-intake-manual-adoption',
    queue_count: requests.length,
    captured_count: items.filter((x) => x.state === 'captured').length,
    blocked_count: items.filter((x) => x.state === 'blocked').length,
    error_count: items.filter((x) => x.state === 'error').length,
    items,
  };

  ensureDir(REPORT_PATH);
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`Research intake complete. captured=${report.captured_count}, blocked=${report.blocked_count}, error=${report.error_count}`);
  console.log(`Report: ${REPORT_PATH}`);
}

run();
