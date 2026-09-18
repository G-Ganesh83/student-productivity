# AI Developer & Agent Guide (`AGENTS.md`)

> **Note for AI Assistants:**  
> Read this file first. It provides an immediate, high-density architectural and operational understanding of **LEARN EASY** without needing to re-scan the entire repository.

---

## 1. Project Quick Summary

**LEARN EASY** is a full-stack student productivity platform combining:
1. **Task & Deadline Management** (CRUD, prioritization, filtering)
2. **Focus Mode** (Pomodoro timer with session duration logging)
3. **Collaboration Rooms** (Multi-user study rooms with 6-character access codes)
4. **Real-Time Code Sync & Chat** (Socket.IO collaborative Python editor and room messaging)
5. **Python Code Runner** (`POST /api/code/run` executes code on the backend)
6. **Study Resource Library** (Frontend bookmarking and tagging)

---

## 2. Tech Stack & Environment

- **Frontend**: React 19, Vite 7, React Router 7, TailwindCSS 3, Axios, Socket.IO Client
- **Backend**: Node.js (ESM), Express 5, Mongoose 9, Socket.IO 4, JWT, BcryptJS
- **Database**: MongoDB Atlas / Local MongoDB (`mongodb://localhost:27017/student-productivity`)
- **Development URLs**:
  - Frontend: `http://localhost:5173`
  - Backend: `http://localhost:8000`

---

## 3. Detailed Documentation Index

Do not re-audit the whole project; consult these specialized documents:
- 🗺️ **[System Architecture & Directory Map](file:///docs/ARCHITECTURE.md)** (`docs/ARCHITECTURE.md`): End-to-end data flow, frontend page tree, and request sequence diagrams.
- 📡 **[REST API Reference](file:///docs/API_REFERENCE.md)** (`docs/API_REFERENCE.md`): Full list of endpoints, request bodies, status codes, and auth headers.
- ⚡ **[Socket.IO & Real-Time Protocol](file:///docs/SOCKET_EVENTS.md)** (`docs/SOCKET_EVENTS.md`): Socket handshake, room events (`join-room`, `code-change`, `send-message`), and broadcast payload shapes.
- 🗄️ **[Data Models & Schemas](file:///docs/DATA_MODELS.md)** (`docs/DATA_MODELS.md`): Mongoose models for User, Task, Room, Session, and client `localStorage`.
- ⚠️ **[Production Audit & Security Roadmap](file:///improvement.md)** (`improvement.md`): Critical security issues (RCE, TLS) and deployment blockers.

---

## 4. Key Architectural Patterns & Conventions

### 4.1 Frontend Code Patterns
- **API Client:** Always use `api` from `src/services/api.js` (or domain helpers in `src/api/*`). It automatically handles `Authorization: Bearer <token>` and session expiration (401 triggers logout).
- **Socket Client:** Always use `socket`, `connectSocket(token)`, and `disconnectSocket()` from `src/services/socket.js`.
- **Auth Context:** Use `useAuth()` from `src/context/AuthContext.jsx` to access `user`, `token`, `login`, `logout`, and `isAuthenticated`.
- **Styling:** Vanilla TailwindCSS utility classes. Brand colors configured in `tailwind.config.js` (`brand-primary`, `brand-secondary`, `dark-surface`, etc.).

### 4.2 Backend Code Patterns
- **Module System:** ES Modules (`"type": "module"` in `backend/package.json`). Always use `import` and `export` with explicit `.js` extensions.
- **Authentication:** All protected routes mount `authMiddleware` from `backend/middleware/authMiddleware.js`. It populates `req.user` with the MongoDB user document (excluding password).
- **Socket Authentication:** Managed in `backend/socket/socketManager.js`. The handshake requires `{ auth: { token } }`.
- **Database Access:** Mongoose models live in `backend/models/`. Always use `async/await` and handle errors via `try/catch` or next error middleware.

---

## 5. Common Commands

| Task | Working Directory | Command |
| :--- | :--- | :--- |
| **Run Frontend** | Root (`/`) | `npm run dev` |
| **Build Frontend** | Root (`/`) | `npm run build` |
| **Lint Frontend** | Root (`/`) | `npm run lint` |
| **Run Backend** | `backend/` | `npm run dev` (starts nodemon) |
| **Start MongoDB (if local)** | Any | `brew services start mongodb-community` |

---

## 6. Critical Security Warnings for AI Code Generations

1. **Do not expose raw Python execution to the host machine:**  
   `backend/controllers/codeController.js` currently uses `child_process.exec`. Any modifications to code execution should steer toward sandboxed runners (Piston, Judge0, or Docker containers).
2. **Environment Variables:**  
   Never hardcode `localhost:8000` in frontend files or `localhost:5173` in backend CORS. Use `import.meta.env.VITE_API_URL` and `process.env.CLIENT_URL`.
3. **Password Security:**  
   Passwords must never be returned in API responses. In `User.js`, password hashing is handled by the `pre('save')` hook.
