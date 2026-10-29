# Practical 7: Authentication and Middleware Pipeline

- **Student Name:** Max Patel
- **Roll Number:** 24IT070
- **Course:** Advanced Web Development Frameworks (ITUE301)
- **Institution:** Charotar University of Science and Technology (CHARUSAT)
- **Repository:** [https://github.com/max7199/SEM5WDF](https://github.com/max7199/SEM5WDF)
- **Technology Stack:** Node.js, Express 5, MongoDB, Mongoose 9, React 18, Vite 5, `bcryptjs`, `jsonwebtoken`
- **Screenshot Directory:** `screenshots/P7/`

---

## 1. Practical Objective

The objective of Practical 7 is to implement a secure, stateless **Authentication and Middleware Pipeline** for the existing college Task Management application. This entails:
1. User registration with normalized email and password hashing using **Bcrypt** (10 salt rounds).
2. User login with credential verification and signed **JSON Web Token (JWT)** generation (1-hour expiration).
3. Custom Express **Authentication Middleware (`authMiddleware`)** to inspect incoming requests for `Authorization: Bearer <token>` and verify signature and expiration.
4. Protecting all Task CRUD endpoints with the authentication middleware.
5. Strict **User Isolation & Ownership**: tasks are associated with `req.user.id`, ensuring users can view, update, and delete only their own tasks.
6. Server-side **Input Validation Middleware** for email format, password length, and task title validation.
7. Safe `/me` profile endpoint returning authenticated user details without ever exposing password hashes.
8. Frontend integration into the React portfolio with login/register tabs, session handling via `sessionStorage`, logout teardown, and 401 handling.

---

## 2. Architecture & Security Features

```text
Incoming HTTP Request
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ Express Global Middleware Pipeline                     │
│  ├── cors()                 (Cross-Origin Sharing)     │
│  ├── logger                 (Method, URL, Timestamp)   │
│  ├── checkContentType       (Requires application/json)│
│  └── express.json()         (Parses JSON payload)      │
└────────────────────────────────────────────────────────┘
       │
       ├──────────────────────────────┬──────────────────────────────┐
       ▼                              ▼                              ▼
┌───────────────────────────┐  ┌───────────────────────────┐  ┌───────────────────────────┐
│ Public Auth Endpoints     │  │ Protected Auth Endpoints  │  │ Protected Task Endpoints  │
│  - POST /register         │  │  - GET /me                │  │  - GET /tasks             │
│  - POST /login            │  │                           │  │  - GET /tasks/:id         │
│                           │  │                           │  │  - POST /tasks            │
│ Middleware:               │  │ Middleware:               │  │  - PUT /tasks/:id         │
│  - validateRegister/Login │  │  - authMiddleware         │  │  - DELETE /tasks/:id      │
└───────────────────────────┘  └───────────────────────────┘  │                           │
                                                               │ Middleware:               │
                                                               │  - authMiddleware         │
                                                               │  - validateTaskId         │
                                                               │  - validateTaskCreate/Upd │
                                                               └───────────────────────────┘
                                                                             │
                                                                             ▼
                                                               ┌───────────────────────────┐
                                                               │ User-Isolated Controller  │
                                                               │ Task.find({ user: id })   │
                                                               └───────────────────────────┘
```

### Key Security Decisions:
- **Bcrypt Hashing**: `bcrypt.hash(password, 10)` generates a 60-character salted hash. Plaintext passwords are never stored in MongoDB or sent in responses.
- **Stateless JWTs**: Tokens are cryptographically signed using HMAC-SHA256 with `process.env.JWT_SECRET` and expire in 1 hour (`{ expiresIn: '1h' }`).
- **Bearer Token Authentication**: The token is transmitted via the standard `Authorization: Bearer <token>` header.
- **Fail-Safe Token Verification**: Expired and invalid tokens are captured via `try/catch` and return HTTP 401 Unauthorized without crashing the server.
- **Multi-Tenancy & Data Isolation**: `req.user.id` is derived strictly from the verified JWT payload, not from frontend-supplied query or body parameters.
- **Secret Isolation**: `JWT_SECRET` is defined exclusively in `.env` and kept out of Git via `.gitignore`. An example template is provided in `.env.example`.

---

## 3. Dependencies Added

The following packages were installed for Practical 7:
```json
{
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "jsonwebtoken": "^9.0.3"
  }
}
```

---

## 4. Environment Variables Setup

Create a `.env` file in the project root (or verify existing `.env`):

```env
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
PORT=5000
JWT_SECRET=your_secure_development_secret_key_here
VITE_API_BASE_URL=http://localhost:5000
```

> **Security Note:** Never commit `.env` or share your actual `JWT_SECRET`. Use `.env.example` as a template for team members.

---

## 5. API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required | Validation |
|---|---|---|---|---|
| `POST` | `/register` (or `/auth/register`) | Creates new user account | No | Valid email, password min 6 chars |
| `POST` | `/login` (or `/auth/login`) | Verifies credentials & returns JWT | No | Valid email & password |
| `GET` | `/me` (or `/auth/me`) | Returns safe user profile | **Yes (Bearer)** | Token validity & expiry |

### Task Endpoints (All Protected)

| Method | Endpoint | Description | Auth Required | User Isolation |
|---|---|---|---|---|
| `GET` | `/tasks` | Fetches tasks of authenticated user | **Yes (Bearer)** | Matches `req.user.id` |
| `GET` | `/tasks/:id` | Fetches single task by ID | **Yes (Bearer)** | Returns 404 if not owned |
| `POST` | `/tasks` | Creates task associated with user | **Yes (Bearer)** | Sets `user: req.user.id` |
| `PUT` | `/tasks/:id` | Updates task owned by user | **Yes (Bearer)** | Prevents user field tampering |
| `DELETE`| `/tasks/:id` | Deletes task owned by user | **Yes (Bearer)** | Deletes only if owned |

---

## 6. How to Use Bearer Token in Postman

1. Open Postman and send a `POST` request to `http://localhost:5000/login` with:
   ```json
   {
     "email": "24it070@charusat.edu.in",
     "password": "YourPassword123"
   }
   ```
2. Copy the `token` string returned in the JSON response.
3. On any protected request (e.g. `GET http://localhost:5000/tasks` or `GET http://localhost:5000/me`):
   - Navigate to the **Authorization** tab.
   - Set **Type** to `Bearer Token`.
   - Paste the token into the **Token** field.
4. Send the request. The backend will return HTTP `200 OK`.
5. If the token is omitted or tampered, the server responds with HTTP `401 Unauthorized`.

---

## 7. Automated Testing & Verification

Run the dedicated Practical 7 test suite:
```powershell
npm run test:p7
```

### Verified Test Results (20/20 Passed):

| # | Test Scenario | Expected Status | Actual Result |
|---|---|---|---|
| 1 | POST /register - Register User 1 | 201 Created | ✅ PASS |
| 2 | MongoDB Document - Bcrypt hash stored, not plain text | $2b$10$... prefix | ✅ PASS |
| 3 | POST /register - Duplicate email rejected | 400 Bad Request | ✅ PASS |
| 4 | POST /register - Short password (<6 chars) rejected | 400 Bad Request | ✅ PASS |
| 5 | POST /login - Valid credentials return JWT | 200 OK | ✅ PASS |
| 6 | POST /login - Incorrect password rejected | 401 Unauthorized | ✅ PASS |
| 7 | GET /me - Retrieve safe profile with Bearer token | 200 OK | ✅ PASS |
| 8 | GET /me - Request without token rejected | 401 Unauthorized | ✅ PASS |
| 9 | GET /tasks - Request without token rejected | 401 Unauthorized | ✅ PASS |
| 10| GET /tasks - Tampered JWT handled safely without crash | 401 Unauthorized | ✅ PASS |
| 11| POST /tasks - Empty or whitespace-only title rejected | 400 Bad Request | ✅ PASS |
| 12| POST /tasks - Create task associated with User 1 | 201 Created | ✅ PASS |
| 13| GET /tasks - Read tasks belonging to User 1 | 200 OK | ✅ PASS |
| 14| PUT /tasks/:id - Update task belonging to User 1 | 200 OK | ✅ PASS |
| 15| Setup User 2 - Register and authenticate second user | 200/201 OK | ✅ PASS |
| 16| Isolation: User 2 cannot view User 1's task | 404 Not Found | ✅ PASS |
| 17| Isolation: User 2 cannot update User 1's task | 404 Not Found | ✅ PASS |
| 18| Isolation: User 2 cannot delete User 1's task | 404 Not Found | ✅ PASS |
| 19| DELETE /tasks/:id - User 1 deletes their own task | 200 OK | ✅ PASS |
| 20| GET / - Root API information route preserved | 200 OK | ✅ PASS |

---

## 8. Screenshot Index (`screenshots/P7/`)

All 12 screenshots are stored exclusively in `D:\5THSEM WDF\PRATICAL\screenshots\P7`:

1. `01-registration.png` — Browser view of the registration form with email and password confirmation.
2. `02-login-success.png` — Successful `POST /login` showing 200 OK, JWT generation, and safe user profile.
3. `03-authenticated-dashboard.png` — Browser view of the active session dashboard with user badge and task cards.
4. `04-task-crud.png` — Live task creation and editing with real-time MongoDB update confirmation.
5. `05-me-endpoint.png` — `GET /me` response returning safe user profile with password hash excluded.
6. `06-protected-route-success.png` — `GET /tasks` with valid Bearer token returning user-associated tasks.
7. `07-missing-token-401.png` — Rejection of unauthenticated request without token (HTTP 401).
8. `08-validation-error.png` — Server-side validation failure on empty title (HTTP 400 Bad Request).
9. `09-password-hash.png` — MongoDB document inspection showing 60-character Bcrypt hash (`$2b$10$...`).
10. `10-logout.png` — Session teardown with token cleared from `sessionStorage` and task dashboard hidden.
11. `11-user-isolation.png` — Cross-user data isolation test: User 2 receives 404 when querying User 1's task.
12. `12-auth-middleware-code.png` — Source code view of `middleware/authMiddleware.js` pipeline.

---

## 9. Viva Questions & Key Concepts

1. **Why do we use Bcrypt instead of SHA-256 or MD5 for passwords?**
   - Bcrypt is an adaptive hash function incorporating a work factor (salt rounds) that can be increased over time as hardware speeds increase. The salt prevents rainbow table attacks, and the computational cost slows down brute-force attacks.

2. **What does a JWT contain?**
   - A JWT contains three parts separated by dots: Header (algorithm & token type), Payload (claims such as user ID, email, expiry), and Signature (HMAC-SHA256 signature generated with the server's private secret).

3. **Why do we store the JWT in `sessionStorage` instead of `localStorage`?**
   - `sessionStorage` automatically purges the token when the browser tab is closed, mitigating persistent token theft risks while satisfying single-session single-page application requirements.

4. **How is user data isolation enforced?**
   - Every task document in MongoDB contains a `user` reference pointing to `User._id`. All task queries filter by `{ user: req.user.id }`. Even if a malicious user guesses another user's task ID, MongoDB queries return null, which Express returns as a 404 Not Found.
