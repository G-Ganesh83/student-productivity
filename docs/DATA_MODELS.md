# LEARN EASY — Data Models & Schemas

This document defines all persistent database collections (MongoDB) and client storage structures.

---

## 1. MongoDB Collections Overview

| Collection | Schema File | Description | Relations |
| :--- | :--- | :--- | :--- |
| `users` | `backend/models/User.js` | User accounts and credentials | One-to-Many with Tasks, Rooms, Sessions |
| `tasks` | `backend/models/Task.js` | User tasks and todos | References `User` (`user`) and optional `Room` |
| `rooms` | `backend/models/Room.js` | Collaboration rooms | References `User` (`creator`, `createdBy`, `members`) |
| `sessions` | `backend/models/Session.js` | Study / Pomodoro sessions | References `User` (`user`) and `Task` (`task`) |

---

## 2. Schema Definitions

### 2.1 User Schema (`User.js`)

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: Date,
  updatedAt: Date
}
```
* **Hooks:** `pre('save')` automatically salts and hashes the `password` using `bcryptjs` if modified.

---

### 2.2 Task Schema (`Task.js`)

```javascript
{
  user: {
    type: ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  category: {
    type: String,
    enum: ['study', 'coding', 'lab', 'assignment', 'exam'],
    default: 'study',
  },
  dueDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  completedAt: {
    type: Date,
  },
  roomId: {
    type: ObjectId,
    ref: 'Room',
    required: false,
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

### 2.3 Room Schema (`Room.js`)

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    length: 6,
  },
  creator: {
    type: ObjectId,
    ref: 'User',
    required: [true, 'Creator is required'],
  },
  createdBy: {
    type: ObjectId,
    ref: 'User',
  },
  members: [
    {
      type: ObjectId,
      ref: 'User',
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```
* **Hooks:** `pre('validate')` synchronizes `creator` and `createdBy` and ensures the creator is included in `members`.

---

### 2.4 Session Schema (`Session.js`)

```javascript
{
  user: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
  task: {
    type: ObjectId,
    ref: 'Task',
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number, // duration in seconds
    default: 0,
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 3. Client Storage Structures (`localStorage`)

| Key | Format | Example / Contents |
| :--- | :--- | :--- |
| `token` | String | JWT Bearer token string |
| `user` | JSON String | `{"id": "660c1d...", "name": "Jane", "email": "jane@example.com"}` |
| `learn_easy_resources` | JSON String | Array of study resources: `[{ id, title, type, url, tags, dateAdded }]` |
| `learn_easy_theme` | String | `"dark"` or `"light"` |
