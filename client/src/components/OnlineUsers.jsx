export default function OnlineUsers({ users }) {
  return (
    <aside className="online-panel">
      <h2>Online</h2>
      <div className="online-count">{users.length} user{users.length === 1 ? '' : 's'}</div>
      <ul>
        {users.map((user) => (
          <li key={user}><span className="status-dot" />{user}</li>
        ))}
      </ul>
    </aside>
  );
}
