import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { env } from '../config/env.js';

let db;

export async function initDatabase() {
  const dbDirectory = path.dirname(env.sqliteDbPath);
  if (dbDirectory && dbDirectory !== '.') {
    fs.mkdirSync(dbDirectory, { recursive: true });
  }

  db = await open({
    filename: env.sqliteDbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'sent',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
  `);

  return db;
}

export function getDatabase() {
  if (!db) {
    throw new Error('Database has not been initialized. Call initDatabase() first.');
  }
  return db;
}
