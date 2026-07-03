# Real-Time Chat Application

A real-time chat app built with **React**, **Node.js**, **Express**, **Socket.io**, and **SQLite**.

## Features

- Dummy username-based login
- Send and receive chat messages instantly using Socket.io
- REST APIs to send messages and fetch chat history
- SQLite persistence, so messages remain after refresh/restart
- Message timestamps
- Online user list
- Typing indicator
- Basic read status updates
- Graceful API/socket error handling
- Clean folder organization for frontend and backend

## Tech Stack

### Frontend
- React + Vite
- Socket.io Client
- Plain CSS with responsive layout

### Backend
- Node.js
- Express
- Socket.io
- SQLite using `sqlite` + `sqlite3`

## Project Structure

```text
realtime-chat/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── sockets/
│   │   ├── app.js
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── package.json
└── README.md
```

## Environment Variables

### Backend: `server/.env`

Create `server/.env` from `server/.env.example`:

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
SQLITE_DB_PATH=./data/chat.sqlite
MESSAGE_FETCH_LIMIT=100
```

### Frontend: `client/.env`

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
```

## Setup Instructions

### 1. Install dependencies

From the project root:

```bash
npm run install:all
```

Or install separately:

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Configure environment files

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 3. Run the backend

```bash
cd server
npm run dev
```

Backend runs at:

```text
http://localhost:4000
```

Health check:

```text
GET http://localhost:4000/health
```

### 4. Run the frontend

In another terminal:

```bash
cd client
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Running Both Apps Together

Install the root dev dependency first:

```bash
npm install
npm run install:all
npm run dev
```

## REST API Documentation

### Fetch chat history

```http
GET /api/messages?limit=100
```

Response:

```json
{
  "data": [
    {
      "id": "uuid",
      "username": "Ananya",
      "content": "Hello!",
      "status": "sent",
      "createdAt": "2026-07-02 10:30:00"
    }
  ]
}
```

### Send message

```http
POST /api/messages
Content-Type: application/json

{
  "username": "Ananya",
  "content": "Hello everyone!"
}
```

The backend stores the message in SQLite and broadcasts it to connected Socket.io clients using `message:new`.

## Socket.io Events

### Client emits

| Event | Payload | Purpose |
|---|---|---|
| `message:send` | `{ username, content }` | Store and broadcast a new message |
| `typing:start` | none | Notify other clients that user is typing |
| `typing:stop` | none | Notify other clients that user stopped typing |
| `message:read` | `{ messageId }` | Mark message as read |

### Server emits

| Event | Payload | Purpose |
|---|---|---|
| `connection:ready` | `{ socketId, username }` | Confirms socket connection |
| `message:new` | message object | Broadcasts new message instantly |
| `message:updated` | message object | Broadcasts read status update |
| `users:online` | `string[]` | Broadcasts online users |
| `typing:update` | `{ username, isTyping }` | Broadcasts typing state |
| `app:error` | error object | Sends socket error details |

## Design Decisions

- **Socket.io is the primary messaging path** so users receive messages instantly without refreshing.
- **REST APIs are still included** for assignment requirements and for compatibility with non-socket clients.
- **SQLite is used for persistence** because it is simple to run locally and does not require a separate database server.
- **Repository/controller separation** keeps database logic away from route handlers.
- **Frontend components are reusable**: login, chat window, message list, message input, online users, and typing indicator are isolated.
- **LocalStorage is used for dummy authentication** because no real authentication service was requested.

## Assumptions

- This is a single-room public chat application.
- Usernames are display names only and are not password protected.
- Read status is global and simple, not per-recipient.
- Messages are limited to 1000 characters.
- Latest 100 messages are fetched by default, configurable through `MESSAGE_FETCH_LIMIT`.

## Production/Deployment Notes

For deployment:

1. Deploy the backend to Render/Railway/Fly.io.
2. Set `CLIENT_ORIGIN` to the deployed frontend URL.
3. Set the frontend `VITE_API_URL` and `VITE_SOCKET_URL` to the deployed backend URL.
4. Use a persistent disk/volume if you want the SQLite database file to survive backend restarts on platforms with ephemeral filesystems.

## Submission Notes

- GitHub repository link: push this `realtime-chat` folder to your GitHub account and share the repository URL.
- APK file: not applicable because this implementation uses React Web, not React Native.
- Screen recording: run the frontend and backend, open two browser windows with different usernames, send messages, and record the real-time behavior.
