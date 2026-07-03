import { randomUUID } from 'crypto';
import { getDatabase } from '../db/database.js';

function mapMessage(row) {
  return {
    id: row.id,
    username: row.username,
    content: row.content,
    status: row.status,
    createdAt: row.created_at
  };
}

export async function createMessage({ username, content }) {
  const db = getDatabase();
  const id = randomUUID();
  const trimmedUsername = username.trim();
  const trimmedContent = content.trim();

  await db.run(
    `INSERT INTO messages (id, username, content, status) VALUES (?, ?, ?, 'sent')`,
    [id, trimmedUsername, trimmedContent]
  );

  const row = await db.get(`SELECT * FROM messages WHERE id = ?`, [id]);
  return mapMessage(row);
}

export async function listMessages({ limit = 100 } = {}) {
  const db = getDatabase();
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);

  const rows = await db.all(
    `SELECT * FROM messages ORDER BY datetime(created_at) DESC LIMIT ?`,
    [safeLimit]
  );

  return rows.reverse().map(mapMessage);
}

export async function markMessageRead(id) {
  const db = getDatabase();
  await db.run(`UPDATE messages SET status = 'read' WHERE id = ?`, [id]);
  const row = await db.get(`SELECT * FROM messages WHERE id = ?`, [id]);
  return row ? mapMessage(row) : null;
}
