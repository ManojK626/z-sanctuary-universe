// Z: scripts\chronicle_server.js
import http from 'http';
import fs from 'fs';
import path from 'path';

const host = process.env.Z_CHRONICLE_HOST || '127.0.0.1';
const port = Number(process.env.Z_CHRONICLE_PORT || 3333);
const logPath =
  process.env.Z_CHRONICLE_PATH || path.join(process.cwd(), 'data', 'chronicle_events.json');

function readEvents(limit = 50) {
  if (!fs.existsSync(logPath)) return [];
  const raw = fs.readFileSync(logPath, 'utf8').trim();
  if (!raw) return [];
  const lines = raw.split('\n').slice(-limit);
  return lines
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch (err) {
        return null;
      }
    })
    .filter(Boolean);
}

function withCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const server = http.createServer((req, res) => {
  withCors(res);
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${host}:${port}`);
  if (url.pathname === '/chronicle') {
    const limit = Number(url.searchParams.get('limit') || 50);
    const events = readEvents(Number.isFinite(limit) ? limit : 50);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ count: events.length, events }));
    return;
  }

  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not_found' }));
});

server.listen(port, host, () => {
  console.log(`[Z-Chronicle] Server listening on http://${host}:${port}`);
  console.log(`[Z-Chronicle] Reading from ${logPath}`);
});
