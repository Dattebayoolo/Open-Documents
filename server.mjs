import { Server } from '@hocuspocus/server';

const server = new Server({
  port: 1234,
  async onAuthenticate(data) {
    return { user: { id: 1, name: 'Anonymous' } };
  },
});

server.listen();
console.log('Hocuspocus Yjs Collaboration server running on ws://localhost:1234');
