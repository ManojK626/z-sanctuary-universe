// Z: scripts\sync_chronicle_to_localstorage.js
// Node.js script to serve chronicle_events.json for browser sync
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3333;
const LOG_PATH = path.resolve('./data/chronicle_events.json');

const server = http.createServer((req, res) => {
  if (req.url === '/chronicle') {
    fs.readFile(LOG_PATH, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Could not read chronicle log.' }));
        return;
      }
      const lines = data.trim().split('\n').slice(-20); // last 20 events
      const events = lines
        .map((l) => {
          try {
            return JSON.parse(l);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify(events));
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`[SYNC] Chronicle sync server running at http://localhost:${PORT}/chronicle`);
});
