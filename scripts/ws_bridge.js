// Z: scripts\ws_bridge.js
// Node.js WebSocket bridge for Z-Sanctuary Universe
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8765 });
console.log('[WS] WebSocket bridge running on ws://localhost:8765');

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    // Broadcast to all clients (browser, Python, etc.)
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});
