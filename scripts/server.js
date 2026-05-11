// Z: scripts/server.js
// server.js (ESM-safe, Node 18+)
// Z-Sanctuary API Server

import http from 'http';

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      status: 'ok',
      service: 'Z-Sanctuary API',
      time: new Date().toISOString(),
    })
  );
});

server.listen(PORT, () => {
  console.log('[Z-Sanctuary] API listening on port', PORT);
});
