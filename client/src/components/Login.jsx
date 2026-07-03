import { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const cleaned = username.trim();
    if (!cleaned) return setError('Please enter a username.');
    if (cleaned.length > 32) return setError('Username must be 32 characters or fewer.');
    localStorage.setItem('chat_username', cleaned);
    onLogin(cleaned);
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="brand-badge">💬</div>
        <h1>Join the chat</h1>
        <p>Choose a display name to start sending real-time messages.</p>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
            setError('');
          }}
          placeholder="e.g. Ananya"
          autoFocus
        />
        {error && <span className="form-error">{error}</span>}
        <button type="submit">Continue</button>
      </form>
    </main>
  );
}
