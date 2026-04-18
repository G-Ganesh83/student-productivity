# LEARN EASY

**LEARN EASY** is a full-stack MERN collaboration platform built to make learning, productivity, and team coding feel connected in one experience. It combines secure authentication, a modern SaaS-style dashboard, task management, and a real-time collaboration room with shared coding and chat.

---

## Preview

### Landing Page
`Add screenshot here`

### Dashboard
`Add screenshot here`

### Productivity
`Add screenshot here`

### Collaboration Room
`Add screenshot here`

---

## Features

### Authentication
- Secure user registration and login
- JWT-based authentication flow
- Protected routes for authenticated users
- Session-aware socket connection handling

### Dashboard
- Clean SaaS-style overview layout
- Centralized access to core modules
- User-focused navigation and productivity insights

### Productivity
- Create, update, delete, and manage tasks
- Priority-based task organization
- Task filtering and search support
- Smooth loading and error handling for API interactions

### Collaboration Room
- Real-time shared code editor
- Live chat between room participants
- Join room using a room code
- Host and member role awareness
- Participant list with live presence indicators
- Code execution support inside the collaboration workflow
- Reconnection-aware room sync for multi-user sessions

---

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Real-Time
- Socket.io

### Authentication & Security
- JWT Authentication
- Protected API routes

---

## Architecture Overview

The frontend is built with React + Vite and communicates with the Express backend through REST APIs for authentication, tasks, rooms, and code execution. MongoDB stores users, rooms, and task data. Socket.io handles real-time communication for collaboration rooms, including code sync, chat messages, presence updates, and reconnect-based room rejoining.

**Flow:**  
`React Frontend` ↔ `Express API` ↔ `MongoDB`  
`React Frontend` ↔ `Socket.io Client` ↔ `Socket.io Server`

---

## Getting Started

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

### 4. Create environment variables

Create a `backend/.env` file and add the required variables.

### 5. Run the backend

```bash
cd backend
npm run dev
```

### 6. Run the frontend

In a new terminal:

```bash
npm run dev
```

### 7. Open the app

Frontend: `http://localhost:5173`  
Backend: `http://localhost:8000`

---

## Environment Variables

Create a `backend/.env` file with values like:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=8000
```

---

## Folder Structure

```bash
LEARN EASY/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   └── utils/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── test/
│   └── utils/
└── README.md
```

### Main directories
- `src/` : Frontend application source
- `src/components/` : Reusable UI components
- `src/pages/` : Main application screens
- `backend/` : Backend server and APIs
- `backend/controllers/` : Business logic for routes
- `backend/models/` : MongoDB/Mongoose models

---

## Key Highlights

### Real-time collaboration logic
The collaboration room uses Socket.io to synchronize code changes, chat messages, presence, and output updates in real time. The client is designed to keep a single shared socket instance and rejoin rooms safely when sessions reconnect.

### Room membership + auth protection
Rooms are protected by JWT-authenticated APIs and socket authentication. Only valid members can access room data or join socket events, helping keep collaboration sessions scoped and secure.

### Handling 403 / 500 issues
The project includes improved room membership consistency, safer server-side error handling, and clearer frontend error messaging. This reduces broken room access scenarios and prevents raw backend errors from leaking to the UI.

### Stable multi-user system
The room experience is built to support real multi-user activity across refreshes, re-login flows, and reconnect scenarios. Join-by-code flow, membership validation, and reconnect-aware sync help keep participants aligned in the same session.

---

## Future Improvements

- Live cursor tracking in the editor
- Multi-file collaboration support
- Richer code execution environments
- Typing indicators in chat
- Production deployment with CI/CD

---

## Author

**G. Ganesh**  
GitHub: https://github.com/G-Ganesh83

---

## Notes

- This project is designed as a practical full-stack MERN showcase with authentication, productivity tooling, and real-time collaboration.
- Add actual UI screenshots in the preview section before publishing for the strongest GitHub presentation.
