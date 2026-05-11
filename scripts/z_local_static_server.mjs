import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { URL } from 'node:url';

function parseArg(name, fallback) {
  const match = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  if (!match) return fallback;
  return match.slice(name.length + 3);
}

function mimeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.js':
    case '.mjs':
      return 'application/javascript; charset=utf-8';
    case '.json':
      return 'application/json; charset=utf-8';
    case '.svg':
      return 'image/svg+xml';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.ico':
      return 'image/x-icon';
    case '.woff':
      return 'font/woff';
    case '.woff2':
      return 'font/woff2';
    default:
      return 'application/octet-stream';
  }
}

function safeResolve(rootDir, requestPath) {
  const cleanPath = requestPath.split('?')[0].split('#')[0];
  const decoded = decodeURIComponent(cleanPath);
  const resolved = path.resolve(rootDir, `.${decoded}`);
  const normalizedRoot = path.resolve(rootDir);
  if (!resolved.startsWith(normalizedRoot)) {
    return null;
  }
  return resolved;
}

function injectAutoCompass(htmlText) {
  const html = String(htmlText || '');
  if (!html) return html;
  if (html.includes('/interface/z_auto_compass.js')) return html;
  if (/data-disable-auto-compass/i.test(html)) return html;

  const tag = '\n    <script src="/interface/z_auto_compass.js"></script>\n';
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${tag}</body>`);
  }
  if (/<\/html>/i.test(html)) {
    return html.replace(/<\/html>/i, `${tag}</html>`);
  }
  return `${html}${tag}`;
}

function serveFile(filePath, req, res) {
  const contentType = mimeFor(filePath);
  if (contentType.startsWith('text/html')) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const enhanced = injectAutoCompass(raw);
    const body = Buffer.from(enhanced, 'utf8');
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', body.length);
    res.setHeader('Cache-Control', 'no-cache');
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    res.end(body);
    return;
  }

  const stat = fs.statSync(filePath);
  res.statusCode = 200;
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Length', stat.size);
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  const stream = fs.createReadStream(filePath);
  stream.on('error', () => {
    if (!res.headersSent) res.statusCode = 500;
    res.end('File stream error');
  });
  stream.pipe(res);
}

let host = parseArg('host', '');
let port = process.argv.some((a) => a.startsWith('--port=')) ? Number.parseInt(parseArg('port', '5502'), 10) : null;
const root = path.resolve(parseArg('root', process.cwd()));

if (!host || port == null) {
  const configPath = path.join(root, 'config', 'z_html_links_hub.json');
  if (fs.existsSync(configPath)) {
    try {
      const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (cfg.baseUrl) {
        const u = new URL(cfg.baseUrl);
        if (!host) host = u.hostname || '127.0.0.1';
        if (port == null) port = Number.parseInt(u.port || '5502', 10);
      }
      if (port == null && cfg.serverPort != null) port = Number.parseInt(String(cfg.serverPort), 10);
    } catch (_) {
      void 0;
    }
  }
}
if (!host) host = '127.0.0.1';
if (port == null || Number.isNaN(port)) port = 5502;

console.log(`Starting Z local static server on ${host}:${port} (root=${root})`);

const server = http.createServer((req, res) => {
  try {
    if (!req.url) {
      res.statusCode = 400;
      res.end('Bad request');
      return;
    }
    const requestUrl = new URL(req.url, `http://${host}:${port}`);
    let filePath = safeResolve(root, requestUrl.pathname);
    if (!filePath) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    serveFile(filePath, req, res);
  } catch (error) {
    res.statusCode = 500;
    res.end(`Server error: ${error.message}`);
  }
});

server.listen(port, host, () => {
  console.log(`Z static server ready at http://${host}:${port}`);
});

server.on('error', (error) => {
  console.error(`Z static server error: ${error.message}`);
  process.exit(1);
});
