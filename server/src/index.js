import http from 'http';
import { Server } from 'socket.io';
import { env } from './config/env.js';
import { createApp } from './app.js';
import { initDatabase } from './db/database.js';
import { registerChatSocket } from './sockets/chatSocket.js';

async function bootstrap() {
  await initDatabase();

  const app = createApp();
  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientOrigin,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  app.set('io', io);
  registerChatSocket(io);

  httpServer.listen(env.port, () => {
    console.log(`API server listening on http://localhost:${env.port}`);
    console.log(`Socket.io server ready. Allowed client origin: ${env.clientOrigin}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
