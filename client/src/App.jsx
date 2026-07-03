import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Login from './components/Login.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import { fetchMessages } from './api/chatApi.js';
import { createChatSocket } from './socket.js';

export default function App() {
  const [username, setUsername] = useState(() => localStorage.getItem('chat_username') || '');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const socketRef = useRef(null);

  const sortedTypingUsers = useMemo(
    () => typingUsers.filter((user) => user !== username).sort((a, b) => a.localeCompare(b)),
    [typingUsers, username]
  );

  const upsertMessage = useCallback((incoming) => {
    setMessages((current) => {
      const exists = current.some((message) => message.id === incoming.id);
      if (exists) {
        return current.map((message) => message.id === incoming.id ? incoming : message);
      }
      return [...current, incoming];
    });
  }, []);

  useEffect(() => {
    if (!username) return;

    let cancelled = false;
    fetchMessages()
      .then((history) => {
        if (!cancelled) setMessages(history);
      })
      .catch(() => setError('Unable to fetch chat history. Please check the backend server.'));

    const socket = createChatSocket(username);
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setError('');
    });

    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', () => {
      setConnected(false);
      setError('Socket connection failed. Retrying...');
    });

    socket.on('message:new', upsertMessage);
    socket.on('message:updated', upsertMessage);
    socket.on('users:online', setOnlineUsers);
    socket.on('app:error', (payload) => setError(payload.message || payload.errors?.join(' ') || 'Socket error.'));
    socket.on('typing:update', ({ username: typingUsername, isTyping }) => {
      setTypingUsers((current) => {
        const users = new Set(current);
        if (isTyping) users.add(typingUsername);
        else users.delete(typingUsername);
        return [...users];
      });
    });

    return () => {
      cancelled = true;
      socket.disconnect();
      socketRef.current = null;
    };
  }, [username, upsertMessage]);

  async function handleSend(content) {
    const socket = socketRef.current;
    if (!socket?.connected) {
      setError('You are offline. Please wait for the socket to reconnect.');
      return;
    }

    socket.emit('message:send', { username, content }, (response) => {
      if (!response?.ok) {
        setError(response?.message || response?.errors?.join(' ') || 'Unable to send message.');
      }
    });
  }

  function handleLogout() {
    localStorage.removeItem('chat_username');
    setUsername('');
    setMessages([]);
    setOnlineUsers([]);
    setTypingUsers([]);
    setConnected(false);
    socketRef.current?.disconnect();
  }

  function emitTypingStart() {
    socketRef.current?.emit('typing:start');
  }

  function emitTypingStop() {
    socketRef.current?.emit('typing:stop');
  }

  function markRead(messageId) {
    socketRef.current?.emit('message:read', { messageId });
  }

  if (!username) return <Login onLogin={setUsername} />;

  return (
    <ChatWindow
      username={username}
      connected={connected}
      messages={messages}
      onlineUsers={onlineUsers}
      typingUsers={sortedTypingUsers}
      error={error}
      onLogout={handleLogout}
      onSend={handleSend}
      onTypingStart={emitTypingStart}
      onTypingStop={emitTypingStop}
      onRead={markRead}
    />
  );
}
