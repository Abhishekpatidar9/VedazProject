export default function TypingIndicator({ users }) {
  if (!users.length) return <div className="typing-placeholder" />;
  const names = users.slice(0, 2).join(', ');
  const suffix = users.length > 2 ? ` and ${users.length - 2} more` : '';
  return <div className="typing-indicator">{names}{suffix} typing...</div>;
}
