import { createMessage, markMessageRead } from '../repositories/messageRepository.js';
import { validateMessagePayload } from '../middleware/validateMessage.js';

const onlineUsers = new Map();

function addOnlineUser(username, socketId) {
  if (!username) return;
  const sockets = onlineUsers.get(username) || new Set();
  sockets.add(socketId);
  onlineUsers.set(username, sockets);
}

function removeOnlineUser(username, socketId) {
  if (!username || !onlineUsers.has(username)) return;
  const sockets = onlineUsers.get(username);
  sockets.delete(socketId);
  if (sockets.size === 0) onlineUsers.delete(username);
}

function getOnlineUsernames() {
  return [...onlineUsers.keys()].sort((a, b) => a.localeCompare(b));
}

export function registerChatSocket(io) {
  io.on('connection', (socket) => {
    const username = typeof socket.handshake.auth?.username === 'string'
      ? socket.handshake.auth.username.trim().slice(0, 32)
      : 'Anonymous';

    socket.data.username = username;
    addOnlineUser(username, socket.id);

    io.emit('users:online', getOnlineUsernames());
    socket.emit('connection:ready', { socketId: socket.id, username });

    socket.on('message:send', async (payload, ack) => {
      try {
        const validation = validateMessagePayload({ ...payload, username: payload?.username || username });
        if (!validation.isValid) {
          const response = { ok: false, errors: validation.errors };
          ack?.(response);
          return socket.emit('app:error', response);
        }

        const message = await createMessage(validation.value);
        io.emit('message:new', message);
        ack?.({ ok: true, data: message });
      } catch (error) {
        console.error('message:send failed', error);
        const response = { ok: false, message: 'Unable to send message right now.' };
        ack?.(response);
        socket.emit('app:error', response);
      }
    });

    socket.on('typing:start', () => {
      socket.broadcast.emit('typing:update', { username, isTyping: true });
    });

    socket.on('typing:stop', () => {
      socket.broadcast.emit('typing:update', { username, isTyping: false });
    });

    socket.on('message:read', async ({ messageId } = {}) => {
      try {
        if (!messageId) return;
        const updated = await markMessageRead(messageId);
        if (updated) io.emit('message:updated', updated);
      } catch (error) {
        console.error('message:read failed', error);
      }
    });

    socket.on('disconnect', (reason) => {
      removeOnlineUser(username, socket.id);
      io.emit('users:online', getOnlineUsernames());
      socket.broadcast.emit('typing:update', { username, isTyping: false });
      console.log(`Socket disconnected: ${socket.id} (${username}) - ${reason}`);
    });
  });
}
