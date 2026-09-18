# LEARN EASY — REST API Reference

All requests accept and return `application/json` unless otherwise noted.  
For protected routes, include the JWT token in the `Authorization` header:
```http
Authorization: Bearer <your_jwt_token>
```

---

## Table of Contents
1. [Base URL & Response Format](#base-url--response-format)
2. [Authentication Endpoints (`/api/auth`)](#authentication-endpoints)
3. [Task Management Endpoints (`/api/tasks`)](#task-management-endpoints)
4. [Study Room Endpoints (`/api/rooms`)](#study-room-endpoints)
5. [Focus & Study Session Endpoints (`/api/sessions`)](#focus--study-session-endpoints)
6. [Code Execution Endpoint (`/api/code`)](#code-execution-endpoint)
7. [Health Check Endpoint](#health-check-endpoint)

---

## Base URL & Response Format

- **Development URL:** `http://localhost:8000`
- **Standard Error Response:**
```json
{
  "message": "Error description here"
}
```

---

## Authentication Endpoints

Base path: `/api/auth` (Public)

### 1. Register User
- **Method:** `POST`
- **Path:** `/api/auth/register`
- **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Responses:**
  - `201 Created`: `{"message": "User registered successfully"}`
  - `400 Bad Request`: `{"message": "User already exists"}` or `{"message": "Please provide name, email, and password"}`

### 2. Login User
- **Method:** `POST`
- **Path:** `/api/auth/login`
- **Request Body:**
  ```json
  {
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }
  ```
- **Responses:**
  - `200 OK`:
    ```json
    {
      "message": "Login successful",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      "user": {
        "id": "660c1d...",
        "name": "Jane Doe",
        "email": "jane@example.com"
      }
    }
    ```
  - `400 Bad Request`: `{"message": "Invalid email or password"}`

---

## Task Management Endpoints

Base path: `/api/tasks`  
**Authentication:** Required (Bearer Token)

### 1. Get All Tasks
- **Method:** `GET`
- **Path:** `/api/tasks`
- **Query Parameters (Optional):**
  - `status`: `pending` | `completed`
  - `priority`: `low` | `medium` | `high`
  - `search`: string (matches title or description)
- **Responses:**
  - `200 OK`:
    ```json
    [
      {
        "_id": "660c2b...",
        "user": "660c1d...",
        "title": "Complete Database Assignment",
        "description": "Normalize schema to 3NF",
        "priority": "high",
        "category": "assignment",
        "status": "pending",
        "dueDate": "2026-09-20T18:30:00.000Z",
        "createdAt": "2026-09-17T00:00:00.000Z",
        "updatedAt": "2026-09-17T00:00:00.000Z"
      }
    ]
    ```

### 2. Create Task
- **Method:** `POST`
- **Path:** `/api/tasks`
- **Request Body:**
  ```json
  {
    "title": "Solve Graph Algorithms",
    "description": "BFS and DFS implementations",
    "priority": "medium",
    "category": "coding",
    "dueDate": "2026-09-22T00:00:00.000Z"
  }
  ```
- **Responses:**
  - `201 Created`: Returns the created task object.
  - `400 Bad Request`: If `title` is missing.

### 3. Get Task Statistics
- **Method:** `GET`
- **Path:** `/api/tasks/stats`
- **Responses:**
  - `200 OK`:
    ```json
    {
      "total": 12,
      "completed": 8,
      "pending": 4,
      "byPriority": {
        "high": 3,
        "medium": 6,
        "low": 3
      }
    }
    ```

### 4. Update Task
- **Method:** `PUT`
- **Path:** `/api/tasks/:id`
- **Request Body:** Partial or complete task fields to update.
- **Responses:**
  - `200 OK`: Returns updated task object.
  - `404 Not Found`: Task not found or not owned by user.

### 5. Toggle Task Status
- **Method:** `PATCH`
- **Path:** `/api/tasks/:id/status`
- **Responses:**
  - `200 OK`: Returns updated task object with flipped status (`pending` <-> `completed`).

### 6. Delete Task
- **Method:** `DELETE`
- **Path:** `/api/tasks/:id`
- **Responses:**
  - `200 OK`: `{"message": "Task deleted successfully"}`

---

## Study Room Endpoints

Base path: `/api/rooms`  
**Authentication:** Required (Bearer Token)

### 1. Create Room
- **Method:** `POST`
- **Path:** `/api/rooms`
- **Request Body:**
  ```json
  {
    "name": "OS Exam Prep"
  }
  ```
- **Responses:**
  - `201 Created`:
    ```json
    {
      "success": true,
      "data": {
        "_id": "660c3f...",
        "name": "OS Exam Prep",
        "code": "X9K2P1",
        "creator": { "_id": "660c1d...", "name": "Jane Doe" },
        "members": [{ "_id": "660c1d...", "name": "Jane Doe" }]
      }
    }
    ```

### 2. Join Room by Code
- **Method:** `POST`
- **Path:** `/api/rooms/join`
- **Request Body:**
  ```json
  {
    "code": "X9K2P1"
  }
  ```
- **Responses:**
  - `200 OK`: Returns populated room object.
  - `404 Not Found`: `{"success": false, "message": "Room not found"}`

### 3. Get Room Details
- **Method:** `GET`
- **Path:** `/api/rooms/:id`
- **Responses:**
  - `200 OK`: Returns populated room document.
  - `403 Forbidden`: If user is not a member.
  - `404 Not Found`: Room not found.

### 4. Leave Room
- **Method:** `POST`
- **Path:** `/api/rooms/:id/leave`
- **Responses:**
  - `200 OK`: `{"success": true, "message": "Left room successfully"}`

### 5. Delete Room
- **Method:** `DELETE`
- **Path:** `/api/rooms/:id`
- **Access:** Only room creator.
- **Responses:**
  - `200 OK`: `{"success": true, "message": "Room deleted successfully"}`
  - `403 Forbidden`: If requester is not the creator.

---

## Focus & Study Session Endpoints

Base path: `/api/sessions`  
**Authentication:** Required (Bearer Token)

### 1. Start Session
- **Method:** `POST`
- **Path:** `/api/sessions/start`
- **Request Body:**
  ```json
  {
    "taskId": "660c2b..."
  }
  ```
- **Responses:**
  - `201 Created`: Returns new session object with `startTime`.

### 2. End Session
- **Method:** `POST`
- **Path:** `/api/sessions/:id/end`
- **Responses:**
  - `200 OK`: Returns session object with computed `endTime` and `duration` (in seconds).

### 3. Get Session History
- **Method:** `GET`
- **Path:** `/api/sessions`
- **Responses:**
  - `200 OK`: List of completed sessions for the authenticated user.

---

## Code Execution Endpoint

Base path: `/api/code`  
**Authentication:** Public (recommended to protect before production)

### 1. Run Code
- **Method:** `POST`
- **Path:** `/api/code/run`
- **Request Body:**
  ```json
  {
    "language": "python",
    "code": "print('Hello from Learn Easy!')"
  }
  ```
- **Responses:**
  - `200 OK`:
    ```json
    {
      "success": true,
      "output": "Hello from Learn Easy!"
    }
    ```
  - `400 Bad Request`:
    ```json
    {
      "success": false,
      "error": "SyntaxError: invalid syntax"
    }
    ```
  - `408 Request Timeout`:
    ```json
    {
      "success": false,
      "error": "Code execution timed out"
    }
    ```

---

## Health Check Endpoint

- **Method:** `GET`
- **Path:** `/`
- **Response:** `200 OK` (Text: `"API is running"`)
