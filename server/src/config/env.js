import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  sqliteDbPath: process.env.SQLITE_DB_PATH || './data/chat.sqlite',
  messageFetchLimit: Number(process.env.MESSAGE_FETCH_LIMIT || 100)
};
