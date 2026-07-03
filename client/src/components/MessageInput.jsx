import { useRef, useState } from 'react';

export default function MessageInput({ disabled, onSend, onTypingStart, onTypingStop }) {
  const [content, setContent] = useState('');
  const typingTimer = useRef(null);

  function handleChange(event) {
    setContent(event.target.value);
    onTypingStart?.();
    window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => onTypingStop?.(), 900);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const text = content.trim();
    if (!text) return;
    setContent('');
    onTypingStop?.();
    await onSend(text);
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        value={content}
        onChange={handleChange}
        disabled={disabled}
        maxLength={1000}
        placeholder={disabled ? 'Connecting...' : 'Type a message'}
      />
      <button disabled={disabled || !content.trim()} type="submit">Send</button>
    </form>
  );
}
