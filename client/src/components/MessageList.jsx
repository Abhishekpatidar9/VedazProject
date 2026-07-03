import { useEffect, useRef } from 'react';

function formatTime(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short'
  }).format(new Date(value));
}

export default function MessageList({ messages, username, onRead }) {
  const endRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const container = listRef.current;

    const isNearBottom =
      !container ||
      container.scrollHeight -
        container.scrollTop -
        container.clientHeight <
        100;

    if (isNearBottom) {
      endRef.current?.scrollIntoView({
        behavior: 'smooth'
      });
    }

    const last = messages[messages.length - 1];

    if (last && last.username !== username) {
      onRead?.(last.id);
    }

  }, [messages, username, onRead]);

  if (!messages.length) {
    return (
      <section className="empty-state">
        No messages yet. Start the conversation!
      </section>
    );
  }

  return (
    <section
      className="message-list"
      aria-live="polite"
      ref={listRef}
    >
      {messages.map((message) => {
        const mine = message.username === username;

        return (
          <article
            key={message.id}
            className={`message-row ${
              mine ? 'mine' : 'theirs'
            }`}
          >
            <div className="message-bubble">

              <div className="message-meta">
                <strong>
                  {mine ? 'You' : message.username}
                </strong>

                <span>
                  {formatTime(message.createdAt)}
                </span>
              </div>

              <p>{message.content}</p>

              {mine && (
                <small className="message-status">
                  {message.status}
                </small>
              )}

            </div>
          </article>
        );
      })}

      <div ref={endRef} />
    </section>
  );
}