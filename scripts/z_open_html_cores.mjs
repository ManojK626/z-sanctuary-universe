import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import http from 'node:http';

const ROOT = process.cwd();
const CONFIG_PATH = path.join(ROOT, 'config', 'z_html_links_hub.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function shouldExclude(relPath, excludeList) {
  const lower = relPath.toLowerCase();
  return excludeList.some((part) => lower.includes(String(part).toLowerCase()));
}

function walkHtmlFiles(dir, excludeList, collector) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = toPosix(path.relative(ROOT, full));
    if (shouldExclude(rel, excludeList)) continue;
    if (entry.isDirectory()) {
      walkHtmlFiles(full, excludeList, collector);
      continue;
    }
    if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      collector.push(rel);
    }
  }
}

function relPathToUrl(baseUrl, relPath) {
  const base = String(baseUrl || '').replace(/\/+$/, '');
  const encodedPath = relPath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
  return `${base}/${encodedPath}`;
}

function openUrl(url) {
  const child = spawn('cmd', ['/c', 'start', '', url], {
    detached: true,
    stdio: 'ignore'
  });
  child.unref();
}

function safeMkdirFor(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeCatalog(outputPath, payload) {
  const abs = path.join(ROOT, outputPath);
  safeMkdirFor(abs);
  fs.writeFileSync(abs, JSON.stringify(payload, null, 2));
}

function writeHubHtml(hubPath, generatedAt, links) {
  const abs = path.join(ROOT, hubPath);
  safeMkdirFor(abs);
  const linkHtml = links
    .map(
      (item) =>
        `<li><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.path}</a></li>`
    )
    .join('\n');
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Z HTML Links Hub</title>
    <style>
      body { font-family: Segoe UI, Arial, sans-serif; background:#081128; color:#cde8ff; margin:0; padding:16px; }
      h1 { margin:0 0 8px 0; font-size:20px; }
      .meta { opacity:0.8; margin-bottom:14px; font-size:12px; }
      ul { margin:0; padding-left:20px; display:grid; gap:6px; }
      a { color:#5ee7ff; text-decoration:none; }
      a:hover { text-decoration:underline; }
    </style>
  </head>
  <body>
    <h1>Z Sanctuary HTML Link Hub</h1>
    <div class="meta">Generated: ${generatedAt} | Total links: ${links.length}</div>
    <ul>
${linkHtml}
    </ul>
    <script src="/interface/z_auto_compass.js"></script>
  </body>
</html>
`;
  fs.writeFileSync(abs, html, 'utf8');
}

function isLocalHost(hostname) {
  return ['127.0.0.1', 'localhost', '0.0.0.0'].includes(hostname);
}

function pingUrl(url) {
  return new Promise((resolve) => {
    const req = http.get(
      url,
      {
        timeout: 1000
      },
      (res) => {
        res.resume();
        resolve(true);
      }
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function startDetachedLocalServer(host, port) {
  const scriptPath = path.join(ROOT, 'scripts', 'z_local_static_server.mjs');
  const child = spawn(
    process.execPath,
    [scriptPath, `--host=${host}`, `--port=${port}`, `--root=${ROOT}`],
    {
      detached: true,
      stdio: 'ignore'
    }
  );
  child.unref();
}

async function ensureBaseUrlAvailable(baseUrl) {
  let parsed;
  try {
    parsed = new URL(baseUrl);
  } catch {
    return { checked: false, ready: false, started: false };
  }

  if (parsed.protocol !== 'http:' || !isLocalHost(parsed.hostname)) {
    return { checked: false, ready: true, started: false };
  }

  const quickOk = await pingUrl(baseUrl);
  if (quickOk) return { checked: true, ready: true, started: false };

  startDetachedLocalServer(parsed.hostname, parsed.port || '80');
  for (let i = 0; i < 24; i += 1) {
    await sleep(250);
    if (await pingUrl(baseUrl)) {
      return { checked: true, ready: true, started: true };
    }
  }
  return { checked: true, ready: false, started: true };
}

async function main() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error('Missing config/z_html_links_hub.json');
    process.exit(1);
  }

  const cfg = readJson(CONFIG_PATH);
  const includeRoots = Array.isArray(cfg.includeRoots) ? cfg.includeRoots : [];
  const excludeList = Array.isArray(cfg.excludePathContains) ? cfg.excludePathContains : [];
  const profileOverrideArg = process.argv.find((arg) => arg.startsWith('--profile='));
  const profileOverride = profileOverrideArg ? profileOverrideArg.split('=')[1] : null;
  const selectedProfile =
    profileOverride || process.env.Z_HTML_PROFILE || cfg.activeProfile || 'core-only';

  const profileMap = cfg.profiles && typeof cfg.profiles === 'object' ? cfg.profiles : {};
  const startupPathsFromProfile = Array.isArray(profileMap[selectedProfile])
    ? profileMap[selectedProfile]
    : [];
  const legacyStartupPaths = Array.isArray(cfg.startupPaths) ? cfg.startupPaths : [];
  const startupPaths = startupPathsFromProfile.length ? startupPathsFromProfile : legacyStartupPaths;

  const files = [];
  for (const relRoot of includeRoots) {
    walkHtmlFiles(path.join(ROOT, relRoot), excludeList, files);
  }

  const unique = [...new Set(files)].sort((a, b) => a.localeCompare(b));
  const links = unique.map((rel) => ({ path: rel, url: relPathToUrl(cfg.baseUrl, rel) }));
  const generatedAt = new Date().toISOString();

  writeCatalog(cfg.catalogOutput, {
    generated_at: generatedAt,
    source: 'scripts/z_open_html_cores.mjs',
    base_url: cfg.baseUrl,
    total_links: links.length,
    links
  });
  writeHubHtml(cfg.hubOutput, generatedAt, links);

  const baseUrlState = await ensureBaseUrlAvailable(cfg.baseUrl);
  const openEnabled =
    (cfg.autoOpenOnTask ?? true) &&
    !process.argv.includes('--no-open') &&
    process.env.Z_HTML_AUTO_OPEN !== '0';

  const startupUrls = startupPaths.map((p) => relPathToUrl(cfg.baseUrl, p));
  if (openEnabled) {
    if (!baseUrlState.ready) {
      console.error(`Base URL is not available: ${cfg.baseUrl}`);
    }
    for (const url of startupUrls) openUrl(url);
  }

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        generated_at: generatedAt,
        links_discovered: links.length,
        startup_count: startupUrls.length,
        startup_profile: selectedProfile,
        open_performed: openEnabled,
        base_url_ready: baseUrlState.ready,
        base_url_started_local_server: baseUrlState.started,
        catalog: cfg.catalogOutput,
        hub: cfg.hubOutput
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
