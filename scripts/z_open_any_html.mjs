#!/usr/bin/env node
// Z: scripts/z_open_any_html.mjs
// Open any workspace HTML file in the default browser via the Z static server (5502).
// Use from Cursor/VS Code tasks: "Z: Open current HTML" or "Z: Open any HTML (path input)".

import path from 'node:path';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const ROOT = process.cwd();
const DEFAULT_BASE = 'http://127.0.0.1:5502';

function toPosix(p) {
  return String(p).split(path.sep).join('/');
}

function getBaseUrl() {
  const configPath = path.join(ROOT, 'config', 'z_html_links_hub.json');
  if (fs.existsSync(configPath)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (cfg.baseUrl) return cfg.baseUrl.replace(/\/+$/, '');
    } catch (_) {
      void 0;
    }
  }
  return process.env.Z_HTML_BASE_URL || DEFAULT_BASE;
}

function openUrl(url) {
  const child = spawn('cmd', ['/c', 'start', '', url], {
    detached: true,
    stdio: 'ignore'
  });
  child.unref();
}

function main() {
  let relPath = process.env.Z_HTML_OPEN_PATH || process.env.fileRelativePath || '';
  const pathArg = process.argv.find((a) => a.startsWith('--path='));
  if (pathArg) relPath = pathArg.slice(7).trim();
  else if (process.argv[2] && !process.argv[2].startsWith('--')) relPath = process.argv[2];

  relPath = toPosix(relPath).replace(/^\//, '').trim();
  if (!relPath) {
    console.error('Usage: node z_open_any_html.mjs [--path=]<relative-path>');
    console.error('  or set env Z_HTML_OPEN_PATH or fileRelativePath (from task ${relativeFile})');
    process.exit(1);
  }

  const baseUrl = getBaseUrl();
  const encoded = relPath
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');
  const url = `${baseUrl}/${encoded}`;
  openUrl(url);
  console.log('Opened:', url);
}

main();
