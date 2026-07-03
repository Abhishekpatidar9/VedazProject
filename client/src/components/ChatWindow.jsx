import MessageInput from './MessageInput.jsx';
import MessageList from './MessageList.jsx';
import OnlineUsers from './OnlineUsers.jsx';
import TypingIndicator from './TypingIndicator.jsx';

export default function ChatWindow({
  username,
  connected,
  messages,
  onlineUsers,
  typingUsers,
  error,
  onLogout,
  onSend,
  onTypingStart,
  onTypingStop,
  onRead
}) {
  return (
    <main className="chat-shell">
      <section className="chat-card">
        <header className="chat-header">
          <div>
            <h1>Real-Time Chat</h1>
            <p>Signed in as <strong>{username}</strong></p>
          </div>
          <div className="header-actions">
            <span className={`connection-pill ${connected ? 'connected' : 'offline'}`}>
              {connected ? 'Live' : 'Offline'}
            </span>
            <button className="ghost-button" onClick={onLogout}>Logout</button>
          </div>
        </header>

        {error && <div className="error-banner">{error}</div>}
        <MessageList messages={messages} username={username} onRead={onRead} />
        <TypingIndicator users={typingUsers} />
        <MessageInput
          disabled={!connected}
          onSend={onSend}
          onTypingStart={onTypingStart}
          onTypingStop={onTypingStop}
        />
      </section>
      <OnlineUsers users={onlineUsers} />
    </main>
  );
}
