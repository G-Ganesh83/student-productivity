# LEARN EASY — Real-Time WebSocket & Socket.IO Reference

Socket.IO powers the collaborative study rooms: live shared code editing, chat messaging, and presence updates.

---

## 1. Connection & Handshake Authentication

The server authenticates socket connections before the connection is established.

### Client Connection Setup
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000', {
  auth: {
    token: '<your_jwt_token>',
  },
  autoConnect: false,
});
```

### Handshake Authentication Lifecycle (`backend/socket/socketManager.js`)
1. Client passes `{ token }` in `handshake.auth`.
2. Server verifies token via `jwt.verify(token, process.env.JWT_SECRET)`.
3. Server queries `User.findById(decoded.id)`.
4. If invalid or missing, server returns `Error('Invalid token')` or `Error('Token expired')` and connection is rejected.
5. If valid, `socket.user` is attached and `connection` event is triggered.

---

## 2. Event Directory

| Event Name | Direction | Payload Description | Purpose |
| :--- | :--- | :--- | :--- |
| `join-room` | Client ➔ Server | `{ roomId: string }` | Joins user's socket to room channel |
| `user-joined` | Server ➔ Room | `{ userId: string, roomId: string }` | Broadcasts new participant entered room |
| `leave-room` | Client ➔ Server | `{ roomId: string }` | Leaves user's socket from room channel |
| `user-left` | Server ➔ Room | `{ userId: string, roomId: string }` | Broadcasts participant exited room |
| `send-message` | Client ➔ Server | `{ roomId: string, message: string }` | Sends a chat message to the room |
| `receive-message` | Server ➔ Room | `{ userId: string, message: string, timestamp: string }` | Relays chat message to all room members |
| `code-change` | Client ➔ Server | `{ roomId: string, code: string }` | Sends incremental code changes |
| `receive-code` | Server ➔ Room | `{ code: string, userId: string, isFullSync?: boolean }` | Broadcasts code to other room members |
| `sync-code` | Client ➔ Server | `{ roomId: string, code: string }` | Sends full code snapshot to new joiners |
| `code-output` | Client ➔ Server | `{ roomId: string, output: any }` | Shares Python execution output |
| `receive-output` | Server ➔ Room | `output: any` | Broadcasts execution results |
| `socket-error` | Server ➔ Client | `{ message: string, code: string }` | Error feedback for unauthorized or invalid actions |

---

## 3. Event Payloads & Contracts

### 3.1 `join-room`
* **Sent by Client:**
  ```javascript
  socket.emit('join-room', { roomId: '660c3f...' });
  ```
* **Validation:** Server verifies `roomId` is a valid ObjectId and the authenticated user is listed in `room.members`.
* **Broadcast to Room (`user-joined`):**
  ```javascript
  io.to(roomId).emit('user-joined', {
    userId: '660c1d...',
    roomId: '660c3f...'
  });
  ```

---

### 3.2 `send-message`
* **Sent by Client:**
  ```javascript
  socket.emit('send-message', {
    roomId: '660c3f...',
    message: 'Can someone explain step 2?'
  });
  ```
* **Broadcast to Room (`receive-message`):**
  ```javascript
  io.to(roomId).emit('receive-message', {
    userId: '660c1d...',
    message: 'Can someone explain step 2?',
    timestamp: '2026-09-17T00:10:00.000Z'
  });
  ```

---

### 3.3 `code-change` & `sync-code`
* **Sent by Client:**
  ```javascript
  socket.emit('code-change', {
    roomId: '660c3f...',
    code: 'def solve(n):\n    return n * 2'
  });
  ```
* **Broadcast to Room (`receive-code`):**
  ```javascript
  socket.to(roomId).emit('receive-code', {
    code: 'def solve(n):\n    return n * 2',
    userId: '660c1d...'
  });
  ```
  *(Note: Emitted with `socket.to(...)` so the author does not receive their own broadcast echo).*

---

### 3.4 Disconnection Handling
* When a socket disconnects (or navigates away), the server automatically iterates through all rooms the socket was in:
  ```javascript
  socket.to(roomId).emit('user-left', {
    userId: socket.user.id,
    roomId: roomId
  });
  ```
