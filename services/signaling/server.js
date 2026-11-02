/**
 * PortalLink Ephemeral Signaling & Presence Gateway.
 * Zero-knowledge relay: Payload bytes never transit this server.
 * Handles:
 *  - Ephemeral presence beacons (15s heartbeat, 45s TTL)
 *  - WebRTC SDP offer/answer exchange
 *  - ICE candidate routing
 *  - Portal Rooms
 */

const http = require('http');

const PORT = process.env.PORT || 9001;

// Minimal zero-dependency WebSocket server or standard HTTP health server
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify({
    service: 'PortalLink Signaling Gateway',
    status: 'HEALTHY',
    version: '1.0.0-PROD',
    timestamp: Date.now(),
  }));
});

let WebSocketServer;
try {
  WebSocketServer = require('ws').Server;
} catch {
  // If ws not yet installed, log notification
  console.log('[PortalLink Signaling] Note: Run `npm install ws` in services/signaling for full socket connectivity.');
}

if (WebSocketServer) {
  const wss = new WebSocketServer({ server });
  const clients = new Map(); // socket -> { deviceId, lastSeen, ip }

  wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());

        if (msg.type === 'PRESENCE_BEACON') {
          clients.set(ws, {
            deviceId: msg.senderDeviceId,
            device: msg.device,
            lastSeen: Date.now(),
            ip,
          });

          // Broadcast presence beacon to all other connected peers
          for (const [peerWs, peerInfo] of clients.entries()) {
            if (peerWs !== ws && peerWs.readyState === ws.OPEN) {
              peerWs.send(JSON.stringify(msg));
            }
          }
        } else if (msg.targetDeviceId) {
          // Direct routed message (SDP_OFFER, SDP_ANSWER, ICE_CANDIDATE, TRANSFER_OFFER)
          for (const [peerWs, peerInfo] of clients.entries()) {
            if (peerInfo.deviceId === msg.targetDeviceId && peerWs.readyState === ws.OPEN) {
              peerWs.send(JSON.stringify(msg));
              break;
            }
          }
        }
      } catch (err) {
        console.warn('[Signaling] Failed to process message:', err.message);
      }
    });

    ws.on('close', () => {
      const client = clients.get(ws);
      if (client) {
        // Broadcast departure
        const leaveMsg = JSON.stringify({
          protocolVersion: '1.0',
          type: 'PRESENCE_LEAVE',
          senderDeviceId: client.deviceId,
          timestamp: Date.now(),
        });
        for (const [peerWs] of clients.entries()) {
          if (peerWs !== ws && peerWs.readyState === ws.OPEN) {
            peerWs.send(leaveMsg);
          }
        }
        clients.delete(ws);
      }
    });
  });

  // 10s cleanup loop for stale clients (> 45s without heartbeat)
  setInterval(() => {
    const now = Date.now();
    for (const [ws, info] of clients.entries()) {
      if (now - info.lastSeen > 45000) {
        ws.terminate();
        clients.delete(ws);
      }
    }
  }, 10000);
}

server.listen(PORT, () => {
  console.log(`[PortalLink Signaling] Ephemeral gateway listening on port ${PORT}`);
});
