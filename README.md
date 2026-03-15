# TaskFlow — Full-Stack Todo Application

A production-quality, full-stack todo app built with **React + Vite**, **Node.js/Express**, and **MySQL**.

---

## 📁 Project Structure

```
todo-app/
├── backend/
│   ├── config/
│   │   └── database.js          # Sequelize + MySQL connection
│   ├── controllers/
│   │   ├── authController.js    # signup / login / profile
│   │   └── todoController.js    # CRUD + search/filter
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication guard
│   │   ├── errorHandler.js      # Global error & 404 handler
│   │   └── validate.js          # express-validator result handler
│   ├── models/
│   │   ├── User.js              # Sequelize User model
│   │   └── Todo.js              # Sequelize Todo model
│   ├── routes/
│   │   ├── auth.js              # /api/auth routes
│   │   └── todos.js             # /api/todos routes
│   ├── utils/
│   │   ├── jwt.js               # Token helpers
│   │   └── response.js          # Standardised JSON responses
│   ├── .env.example
│   ├── package.json
│   └── server.js                # Express entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FilterBar.jsx    # Search + status/priority filters
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProgressBar.jsx  # Completion progress bar
│   │   │   ├── SkeletonLoader.jsx
│   │   │   ├── TodoCard.jsx     # Single todo card
│   │   │   └── TodoModal.jsx    # Create / Edit modal
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Global auth state + helpers
│   │   │   └── ThemeContext.jsx # Dark / light mode toggle
│   │   ├── hooks/
│   │   │   └── useTodos.js      # Todo state + CRUD hook
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── services/
│   │   │   ├── api.js           # Axios instance + interceptors
│   │   │   ├── authService.js
│   │   │   └── todoService.js
│   │   ├── App.jsx
│   │   ├── index.css            # Tailwind + custom styles
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── schema.sql                   # Manual MySQL table creation script
└── README.md
```

---

## ✅ Prerequisites

| Tool | Min version |
|------|------------|
| Node.js | 18+ |
| npm | 9+ |
| MySQL | 8.0+ |

---

## ⚙️ Setup Instructions

### 1 — Clone / download the project

```bash
# If using git:
git clone <your-repo-url>
cd todo-app

# Or just navigate to the project folder
cd todo-app
```

---

### 2 — Create the MySQL database

Option A — Using the provided SQL script:
```sql
-- In MySQL Workbench or mysql CLI:
SOURCE /path/to/todo-app/schema.sql;
```

Option B — Manual (Sequelize auto-sync will create the tables):
```sql
CREATE DATABASE IF NOT EXISTS todo_app_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

---

### 3 — Configure the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=todo_app_db
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=change_this_to_a_long_random_string_in_production
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173
```

Install backend dependencies:
```bash
npm install
```

---

### 4 — Configure the frontend

```bash
cd ../frontend
cp .env.example .env
```

The default Vite proxy config already forwards `/api` → `http://localhost:5000`, so no changes are required for local development.

Install frontend dependencies:
```bash
npm install
```

---

## 🚀 Running the Application

### Start the backend

```bash
# From the backend/ directory
npm run dev       # development (nodemon — auto-restarts)
# or
npm start         # production
```

You should see:
```
✅ Database synchronized successfully.
🚀 Server running on http://localhost:5000
```

> Sequelize will automatically create (or update) the `users` and `todos` tables on first run.

---

### Start the frontend

```bash
# From the frontend/ directory (new terminal)
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🌐 API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/profile` | ✅ | Get current user |

### Todos

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/todos` | ✅ | List todos (search/filter) |
| POST | `/api/todos` | ✅ | Create todo |
| PUT | `/api/todos/:id` | ✅ | Update todo |
| DELETE | `/api/todos/:id` | ✅ | Delete todo |

#### GET /api/todos query parameters

| Param | Values | Example |
|-------|--------|---------|
| `search` | any string | `?search=buy` |
| `status` | `pending` \| `completed` | `?status=pending` |
| `priority` | `low` \| `medium` \| `high` | `?priority=high` |
| `category` | any string | `?category=work` |

---

## 🎨 Features

- 🔐 JWT Authentication — signup, login, protected routes
- ✅ Full Todo CRUD — create, read, update, delete
- 🔄 Toggle completion with optimistic UI updates
- 🔍 Real-time search with debounce
- 🎛️ Filter by status and priority
- 📅 Due dates with overdue detection
- 🏷️ Categories and tags
- 📊 Progress bar with completion percentage
- 🌙 Dark / light mode (persisted to localStorage)
- 💀 Loading skeletons
- 🔔 Toast notifications for all actions
- 📱 Fully responsive — mobile + desktop
- ⌨️ Keyboard navigation (Escape to close modal)
- ⚡ Optimistic UI updates for toggle

---

## 🛠️ Production Build

```bash
# Build frontend
cd frontend
npm run build
# Output in frontend/dist/

# Run backend in production
cd backend
NODE_ENV=production npm start
```

For production, serve the `frontend/dist` folder via a CDN or static file server, and point `FRONTEND_URL` in the backend `.env` to your frontend domain.

---

## 🔒 Security Notes

- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT tokens expire in 7 days (configurable)
- All todo routes validate `user_id` ownership — users can only access their own data
- Input validation on every route with **express-validator**
- CORS restricted to the configured `FRONTEND_URL`
- Change `JWT_SECRET` to a long random string in production
