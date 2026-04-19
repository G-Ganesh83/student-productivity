# LEARN EASY

LEARN EASY is a full-stack student productivity and collaboration platform built with React, Express, MongoDB, and Socket.IO. It combines personal task management, room-based collaboration, a real-time shared code editor, live chat, and a lightweight study resources area in a single workspace.

## Overview

Students often split their workflow across multiple tools: one for tasks, one for chat, one for coding, and another for notes or links. LEARN EASY brings those flows together so users can:

- manage personal tasks and deadlines
- create or join collaboration rooms with a 6-character room code
- collaborate in real time through chat and synced code
- run Python code inside the room workflow
- store study resources in a simple library view

## Features

### Authentication

- Register with name, email, and password
- Log in with JWT-based authentication
- Persist auth state in local storage
- Protect app routes with `ProtectedRoute`
- Authenticate Socket.IO connections with the same JWT

### Task Management

- Create tasks with title, description, priority, and optional due date
- Edit and delete tasks
- Toggle task status between `pending` and `completed`
- Filter by status and priority
- Search tasks by title and description

### Collaboration Rooms

- Create a room with an auto-generated 6-character code
- Join a room using the code
- Restrict room access to authenticated members only
- Delete a room when the host leaves
- Track room participants and presence in real time

### Real-Time Collaboration

- Shared code editor with live code sync
- Room chat with real-time message delivery
- Output sync after running code
- Join, leave, disconnect, and room-deletion presence updates
- Reconnection-aware room join and code resync

### Resource Library

- Save links and PDF-style entries from the frontend
- Search by title and tag
- Track simple library stats

Note: the Resources module is currently frontend-only and persists through `localStorage`, not MongoDB.

## Tech Stack

### Frontend

- React 19
- Vite 7
- Tailwind CSS 3
- React Router DOM 7
- Axios
- Socket.IO Client
- Lottie React

### Backend

- Node.js
- Express 5
- Socket.IO
- JWT (`jsonwebtoken`)
- bcryptjs

### Database

- MongoDB
- Mongoose

### Tools

- ESLint
- PostCSS
- Nodemon
- `python3` for code execution

## Architecture Overview

LEARN EASY uses a split REST + Socket architecture:

1. The React frontend handles UI, routing, auth state, and room screens.
2. Axios calls the Express backend for authentication, tasks, rooms, and code execution.
3. MongoDB stores users, tasks, and collaboration rooms.
4. Socket.IO handles real-time collaboration inside rooms.

### Request / Data Flow

- `React UI` -> `Axios API` -> `Express routes/controllers` -> `MongoDB`
- `React Room page` -> `socket.io-client` -> `Socket.IO server` -> broadcasts to room members

### Room Flow

1. A user creates or joins a room using REST endpoints.
2. The frontend navigates to `/room/:roomId`.
3. The room page connects to Socket.IO with the JWT token.
4. The client emits `join-room` with the `roomId`.
5. The server validates JWT + room membership before allowing room events.
6. Chat, code sync, output sync, join/leave presence, and room deletion updates are emitted in real time.

## Folder Structure

```text
student-productivity/
├── src/
│   ├── api/              # Frontend API wrappers for auth, tasks, rooms, code
│   ├── assets/           # Images, animation JSON, branding assets
│   ├── components/       # Reusable UI components
│   ├── context/          # Auth context and global auth state
│   ├── data/             # Local dummy data used by Resources
│   ├── layouts/          # Landing layout and authenticated app shell
│   ├── pages/            # Feature pages (landing, dashboard, room, etc.)
│   ├── services/         # Axios instance, socket service, dashboard service
│   ├── socket/           # Socket wrapper exports used by the frontend
│   └── utils/            # Auth token helpers and utilities
├── backend/
│   ├── config/           # Database connection
│   ├── controllers/      # Route handlers for auth, tasks, rooms, code
│   ├── middleware/       # JWT auth middleware
│   ├── middlewares/      # Global Express error handler
│   ├── models/           # Mongoose models (User, Task, Room)
│   ├── routes/           # Express route definitions
│   ├── socket/           # Socket.IO room/event manager
│   ├── test/             # Socket test script
│   └── utils/            # Async handler utilities
├── public/               # Static favicon / logo assets
└── README.md
```

## Core Data Models

### User

- `name`
- `email` (unique, lowercase)
- `password` (hashed with bcrypt)

### Task

- `user` (owner reference)
- `title`
- `description`
- `priority` (`low | medium | high`)
- `dueDate`
- `status` (`pending | completed`)

### Room

- `name`
- `code` (6-character uppercase room code)
- `creator`
- `createdBy`
- `members`

## Getting Started

### Prerequisites

Before running the project, make sure you have:

- Node.js installed
  - This repo does not define an `engines` field, but Node 20+ is recommended because the frontend uses Vite 7.
- npm installed
- MongoDB available
  - local MongoDB or MongoDB Atlas both work
- `python3` installed
  - required for the `/api/code/run` feature

### Installation

### 1. Clone the repository

```bash
git clone https://github.com/G-Ganesh83/student-productivity.git
cd student-productivity
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd backend
npm install
cd ..
```

### 4. Create backend environment variables

Create a file at:

```bash
backend/.env
```

Add the following values:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Running the Project

### Start the backend

```bash
cd backend
npm run dev
```

The backend starts on:

```text
http://localhost:8000
```

### Start the frontend

Open a second terminal in the project root:

```bash
npm run dev
```

The frontend starts on:

```text
http://localhost:5173
```

### Example Full Local Run

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
npm run dev
```

Then open:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8000
```

## Environment Variables

### Required

The application code currently requires these backend variables:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Optional for Socket Test Script

The script `backend/test/socketTest.js` also reads:

```env
SOCKET_URL=http://localhost:5000
TOKEN_A=jwt_for_test_user_a
TOKEN_B=jwt_for_test_user_b
ROOM_ID=existing_room_id
TEST_TIMEOUT_MS=15000
```

## Authentication Flow

1. A user registers via `POST /api/auth/register`.
2. A user logs in via `POST /api/auth/login`.
3. The backend returns a JWT plus user metadata.
4. The frontend stores the token and user in local storage.
5. Axios attaches the token as `Authorization: Bearer <token>`.
6. Protected routes require auth state.
7. Socket.IO also uses the token during the handshake.

## API Overview

### Auth

- `POST /api/auth/register` - create a new user
- `POST /api/auth/login` - authenticate and return JWT

### Tasks

- `GET /api/tasks` - fetch current user's tasks
- `POST /api/tasks` - create a task
- `PUT /api/tasks/:id` - update a task
- `DELETE /api/tasks/:id` - delete a task
- `PATCH /api/tasks/:id/status` - toggle task status

### Rooms

- `GET /api/rooms` - fetch rooms where the user is a member
- `POST /api/rooms/create` - create a new room
- `POST /api/rooms/join` - join a room using room code
- `GET /api/rooms/:id` - fetch room details for a member
- `POST /api/rooms/:id/leave` - leave a room, or delete it if the requester is the host
- `POST /api/rooms/leave` - alternate leave route using `roomId` in request body
- `DELETE /api/rooms/:id` - delete a room (creator only)

### Code Execution

- `POST /api/code/run` - execute Python code and return output

## Socket.IO Events

### Client -> Server

- `join-room`
  - payload: `{ roomId }`
  - joins a validated room after JWT + membership checks

- `leave-room`
  - payload: `{ roomId }`
  - removes the socket from the room and notifies others

- `send-message`
  - payload: `{ roomId, message }`
  - sends a chat message to the room

- `code-change`
  - payload: `{ roomId, code }`
  - broadcasts incremental/shared editor changes

- `sync-code`
  - payload: `{ roomId, code }`
  - sends a full code sync, mainly for reconnects or late joiners

- `code-output`
  - payload: `{ roomId, output }`
  - syncs execution output to other room members

### Server -> Client

- `user-joined`
  - payload: `{ userId, roomId }`

- `user-left`
  - payload: `{ userId, roomId }`

- `receive-message`
  - payload: `{ userId, message, timestamp }`

- `receive-code`
  - payload: `{ code, userId, isFullSync? }`

- `receive-output`
  - payload: `output`

- `room-deleted`
  - payload: `{ roomId, deletedBy }`

- `socket-error`
  - payload: `{ message, code }`

## Frontend Pages

- `/` - public landing page
- `/login` - login form
- `/register` - registration form
- `/dashboard` - authenticated workspace overview
- `/productivity` - task management
- `/collaboration` - create/join rooms
- `/room/:roomId` - real-time collaboration room
- `/resources` - frontend-only study resource library
- `/settings` - account/session information
- `/help` - quick guidance and FAQs

## Known Limitations

- Chat messages are not persisted in MongoDB.
- Shared code content is not persisted in MongoDB.
- Presence is socket-based and in-memory; it depends on active connections.
- The Resources module is currently frontend-only and stored in `localStorage`.
- Code execution only supports Python.
- Code execution writes temporary files and runs `python3` on the server.
- `/api/code/run` is not protected by `authMiddleware` in the current implementation.
- Collaboration currently supports a single shared code surface rather than multi-file project persistence.

## Future Improvements

- Persist chat history per room
- Persist room code snapshots and execution output
- Add richer room presence and typing indicators
- Add role-based collaboration controls
- Support more languages and sandboxed execution
- Move Resources to a real backend API
- Add notifications and activity feeds
- Improve automated test coverage

## Contributors

- G. Ganesh

## Notes

- The dashboard fetches tasks and rooms in parallel and caches the result in session storage for 30 seconds.
- Socket room access is validated on the server using both JWT auth and room membership checks.
- When the host leaves a room through the current flow, the room is deleted and other connected users are notified in real time.
