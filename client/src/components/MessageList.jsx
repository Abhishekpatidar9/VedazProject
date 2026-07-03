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
  const firstLoad = useRef(true);


  useEffect(() => {

    // only first time open chat -> go bottom
    if (firstLoad.current) {
      endRef.current?.scrollIntoView();
      firstLoad.current = false;
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
    <section className="message-list">

      {messages.map((message)=>{

        const mine =
          message.username === username;

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


      <div ref={endRef}/>

    </section>
  );
}