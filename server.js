import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';

const PORT = process.env.PORT || 1234;
const wss = new WebSocketServer({ port: Number(PORT) });

wss.on('connection', (conn, req) => {
  console.log('New connection from', req.socket.remoteAddress);
  setupWSConnection(conn, req);
});

console.log(`Yjs WebSocket server running on ws://localhost:${PORT}`);
