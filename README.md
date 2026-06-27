<div align="center">

<img src="https://img.shields.io/badge/MERN-Stack-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />

<br />
<br />

# 🔐 MERN Session Authentication

**A full-stack session-based authentication system built with the MERN stack.**  
No Redis. No JWT. Just clean, secure, MongoDB-backed sessions.

<br />

[✨ Features](#-features) · [🏗️ Architecture](#-architecture) · [🚀 Getting Started](#-getting-started) · [📁 Project Structure](#-project-structure) · [🔌 API Reference](#-api-reference) · [🛡️ Security](#-security)

</div>

---

## ✨ Features

- 🔐 **Session-based auth** — secure server-side sessions stored in MongoDB
- 🍪 **HttpOnly cookies** — inaccessible to JavaScript, blocks XSS attacks
- 🧂 **bcrypt password hashing** — salted & hashed, never stored plain
- 🛡️ **Protected routes** — middleware-guarded on both backend and frontend
- ♻️ **Persistent sessions** — survive page refreshes via `/auth/me`
- 🔒 **SameSite cookies** — built-in CSRF protection
- ⚡ **Auto session expiry** — TTL-based cleanup via `connect-mongo`
- 🌐 **CORS configured** — credential-safe cross-origin setup

---

## 🏗️ Architecture

```
Browser
  │
  │  POST /api/auth/login  { email, password }
  ▼
Express Server
  │── express-session middleware
  │── bcrypt verifies password against MongoDB users collection
  │── Session doc created in MongoDB sessions collection
  │── Set-Cookie: connect.sid=<sessionId> (HttpOnly)
  ▼
MongoDB
  ├── users        → stores hashed credentials
  └── sessions     → stores active session documents (auto-expires)
```

**On every subsequent request:**

```
Browser sends Cookie: connect.sid=<sessionId>
  → express-session looks up sessions collection
  → populates req.session.userId
  → your route handler reads it directly
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:

| Tool    | Version                |
| ------- | ---------------------- |
| Node.js | `v18+`                 |
| MongoDB | `v6+` (local or Atlas) |
| npm     | `v9+`                  |

### 1. Clone the repository

```bash
git clone https://github.com/your-username/mern-session-auth.git
cd mern-session-auth
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
MONGO_URI=mongodb://localhost:27017/mern-session
SESSION_SECRET=your_super_secret_long_random_string_here
PORT=5000
```

> 💡 **Tip:** Generate a strong secret with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

Start the backend:

```bash
npm run dev
```

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Open the app

```
Frontend → http://localhost:5173
Backend  → http://localhost:5000
```

---

## 📁 Project Structure

```
mern-session-auth/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   └── requireAuth.js        # Protect routes — checks req.session.userId
│   ├── models/
│   │   └── User.js               # User schema + bcrypt hooks
│   ├── routes/
│   │   ├── auth.js               # /register  /login  /logout  /me
│   │   └── user.js               # /profile (protected)
│   ├── .env                      # Environment variables (git-ignored)
│   └── index.js                  # Express app + session config
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js          # Axios instance with withCredentials: true
        ├── context/
        │   └── AuthContext.jsx   # Global auth state + login/logout/register
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Profile.jsx       # Protected page
        └── App.jsx               # Routes + ProtectedRoute wrapper
```

---

## 🔌 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint    | Body                        | Description                         |
| ------ | ----------- | --------------------------- | ----------------------------------- |
| `POST` | `/register` | `{ name, email, password }` | Create account + auto login         |
| `POST` | `/login`    | `{ email, password }`       | Verify credentials + create session |
| `POST` | `/logout`   | —                           | Destroy session + clear cookie      |
| `GET`  | `/me`       | —                           | Return current user (session check) |

### User Routes — `/api/user`

| Method | Endpoint   | Auth        | Description                         |
| ------ | ---------- | ----------- | ----------------------------------- |
| `GET`  | `/profile` | ✅ Required | Return authenticated user's profile |

### Response Examples

**`POST /api/auth/login` — Success**

```json
{
  "id": "64abc123...",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**`GET /api/user/profile` — Unauthenticated**

```json
{
  "message": "Not authenticated"
}
```

---

## 🛡️ Security

### Cookie Flags

```js
cookie: {
  httpOnly: true,    // JS cannot read it — blocks XSS cookie theft
  secure: false,     // Set true in production (HTTPS only)
  sameSite: 'lax',   // Blocks cross-site CSRF attacks
  maxAge: 86400000   // Expires in 24 hours
}
```

### Session Storage

Sessions are stored in MongoDB's `sessions` collection as documents:

```json
{
  "_id": "connect.sid-value",
  "session": {
    "cookie": { "expires": "2024-..." },
    "userId": "64abc123..."
  },
  "expires": "2024-..."
}
```

> ⚠️ The cookie sent to the browser contains **only the session ID** — never actual user data.

### Password Hashing

```js
// Passwords are hashed with bcrypt (12 salt rounds) before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
```


---

## ⚙️ Environment Variables

| Variable         | Description                    | Example                                  |
| ---------------- | ------------------------------ | ---------------------------------------- |
| `MONGO_URI`      | MongoDB connection string      | `mongodb://localhost:27017/mern-session` |
| `SESSION_SECRET` | Secret for signing session IDs | `long-random-string`                     |
| `PORT`           | Backend port (optional)        | `5000`                                   |

---

## 🔄 How `req.session` Works

One of the most confusing parts — here's the simple version:

```js
// 1. On login — you write to the session object
req.session.userId = user._id.toString();
// express-session automatically:
//   → saves this to MongoDB sessions collection
//   → sends Set-Cookie: connect.sid=<randomId> to browser

// 2. On next request — browser sends the cookie back
//    express-session automatically:
//   → reads the cookie
//   → looks up the session in MongoDB
//   → populates req.session for you

// 3. In your middleware/routes — it just works
if (!req.session.userId)
  return res.status(401).json({ message: "Not authenticated" });
```

---

## 🧪 Testing with Postman

1. **Register** — `POST http://localhost:5000/api/auth/register`
2. **Login** — `POST http://localhost:5000/api/auth/login` (cookie auto-saved)
3. **Profile** — `GET http://localhost:5000/api/user/profile` (cookie sent automatically)
4. **Logout** — `POST http://localhost:5000/api/auth/logout`

> Make sure **"Automatically follow redirects"** and **"Save cookies"** are enabled in Postman settings.

---

## 📦 Dependencies

### Backend

| Package           | Purpose                       |
| ----------------- | ----------------------------- |
| `express`         | Web framework                 |
| `mongoose`        | MongoDB ODM                   |
| `express-session` | Session middleware            |
| `connect-mongo`   | MongoDB session store         |
| `bcryptjs`        | Password hashing              |
| `cors`            | Cross-origin resource sharing |
| `dotenv`          | Environment variables         |

### Frontend

| Package            | Purpose                             |
| ------------------ | ----------------------------------- |
| `react`            | UI library                          |
| `react-router-dom` | Client-side routing                 |
| `axios`            | HTTP client with credential support |

---

## 🗺️ Roadmap

- [ ] Email verification on register
- [ ] Forgot password / reset flow
- [ ] Role-based access control (RBAC)
- [ ] Rate limiting on auth endpoints
- [ ] Refresh session on activity

---

## 📄 License


This project is licensed under the **MIT License** — feel free to use it in your own projects.

---

<div align="center">

Built while learning MERN session authentication 🚀

**If this helped you, give it a ⭐ on GitHub!**

</div>
