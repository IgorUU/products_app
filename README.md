# 🛒 Products App

It features a Laravel backend and a React (TypeScript) frontend.
The app fetches and processes product data from an external API (Konovo).
Supports filtering and search, and it displays product details.

---

## 🚀 Features

✅ JWT-based authentication (secure cookie)
✅ Products listing with price & description transformation
✅ Filter & search by category and text
✅ Product details page
✅ Laravel + React + TypeScript + Axios + Vite + React Router
✅ RESTful, clean, idiomatic, and robust

---

## 🧰 Tech stack

- **Backend**: PHP (Laravel 11), SQLite, HTTP client, Cache
- **Frontend**: React + TypeScript + Vite, Axios, React Router, Context API
- **Auth**: JWT stored in HTTP-only cookie
- **Other**: Docker/DDEV ready (optional)

---

## 📝 Setup instructions

### 📄 Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 20 + npm
- SQLite
- (optional) DBeaver or SQLite viewer to inspect DB

---

### 🔷 Backend

```bash
cd backend

# Install dependencies
composer install

# Copy .env and adjust if needed
cp .env.example .env

# Generate app key (if not already)
php artisan key:generate

# Run migrations (optional if using SQLite for sessions)
php artisan migrate

# Start Laravel server
php artisan serve
```

By default the backend runs at:
http://localhost:8000

---

### 🔷 Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

By default the frontend runs at:
http://localhost:5173

---

### 🔗 Login credentials

Use the provided credentials in the task description to login.

---

## 🧹 Notes

- Filters & search are handled by the backend.
- Product details page fetches a single product from the backend.
- Categories are cached for performance.
- Proper error handling and secure auth flow implemented.

---

## 👨‍💻 Author

Built by Igor Ušumović as part of a job application task.
💼 Clean, robust, and production-ready architecture — feedback welcome!
