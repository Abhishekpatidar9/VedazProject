import { io } from "socket.io-client";

const SOCKET_URL = "https://realtime-chat-backend-j1cz.onrender.com";

export function createChatSocket(username) {
  return io(SOCKET_URL, {
    auth: { username },
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 800,
    timeout: 10000
  });
}