<!-- =============================================== -->

<!-- 🟡✨ ARTICLY README — BLACK & GOLD THEME ✨🟡 -->

<!-- =============================================== -->

<div align="center" style="background:#020617; padding:40px 20px; border-radius:16px; border:1px solid #eab308; margin-bottom:32px;">

  <h1 style="color:#facc15; font-size:2.6rem; margin-bottom:0.25rem;">🟡✨ ARTICLY ✨🟡</h1>
  <h2 style="color:#e5e7eb; font-size:1.35rem; font-weight:500; margin-top:0;">Personalized Article Feeds Web Application (MERN)</h2>

  <p style="max-width:780px; color:#d4d4d8; font-size:0.98rem; line-height:1.7; margin:18px auto 0;">
    A premium MERN platform that delivers <strong>personalized article feeds</strong>, <strong>role-based dashboards</strong>, 
    <strong>Cloudinary-powered media management</strong>, and a <strong>modern animated UI</strong>.  
    Users discover and manage content tailored to their interests; admins manage users, categories, banners,  
    and monitor platform health via an analytics-driven dashboard.
  </p>

  <br/>

  <img src="docs/banner.png" alt="Articly Banner" style="max-width:720px; width:100%; border-radius:12px; border:1px solid #27272a;"/>

</div>

---

## <span style="color:#facc15;">📚 Table of Contents</span>

<div style="background:#020617; border:1px solid #27272a; border-radius:12px; padding:16px 20px; margin-bottom:24px;">
  <ol style="line-height:1.7; margin-left:20px; color:#e5e7eb; font-size:0.98rem;">
    <li><a href="#live-demo--credentials" style="color:#fbbf24;">Live Demo &amp; Credentials</a></li>
    <li><a href="#features" style="color:#fbbf24;">Features</a>
      <ol style="margin-left:20px; margin-top:4px;">
        <li><a href="#end-user-features" style="color:#fde68a;">End-User Features</a></li>
        <li><a href="#admin-features" style="color:#fde68a;">Admin Features</a></li>
      </ol>
    </li>
    <li><a href="#tech-stack" style="color:#fbbf24;">Tech Stack</a></li>
    <li><a href="#architecture-overview" style="color:#fbbf24;">Architecture Overview</a></li>
    <li><a href="#folder-structure" style="color:#fbbf24;">Folder Structure</a></li>
    <li><a href="#environment-configuration" style="color:#fbbf24;">Environment Configuration</a>
      <ol style="margin-left:20px; margin-top:4px;">
        <li><a href="#backend-env-example" style="color:#fde68a;">Backend <code>.env</code> Example</a></li>
        <li><a href="#frontend-env-example" style="color:#fde68a;">Frontend <code>.env</code> Example</a></li>
      </ol>
    </li>
    <li><a href="#local-development-setup" style="color:#fbbf24;">Local Development Setup</a></li>
    <li><a href="#cloudinary-integration" style="color:#fbbf24;">Cloudinary Integration</a></li>
    <li><a href="#api-overview" style="color:#fbbf24;">API Overview</a>
      <ol style="margin-left:20px; margin-top:4px;">
        <li><a href="#health" style="color:#fde68a;">Health</a></li>
        <li><a href="#authentication" style="color:#fde68a;">Authentication</a></li>
        <li><a href="#user-management" style="color:#fde68a;">User Management</a></li>
        <li><a href="#categories" style="color:#fde68a;">Categories</a></li>
        <li><a href="#banners" style="color:#fde68a;">Banners</a></li>
        <li><a href="#articles" style="color:#fde68a;">Articles</a></li>
        <li><a href="#reactions" style="color:#fde68a;">Reactions</a></li>
        <li><a href="#admin-dashboard" style="color:#fde68a;">Admin Dashboard</a></li>
      </ol>
    </li>
    <li><a href="#role--access-control" style="color:#fbbf24;">Role &amp; Access Control</a></li>
    <li><a href="#screenshots" style="color:#fbbf24;">Screenshots</a></li>
    <li><a href="#deployment-notes" style="color:#fbbf24;">Deployment Notes</a></li>
    <li><a href="#future-enhancements" style="color:#fbbf24;">Future Enhancements</a></li>
  </ol>
</div>

---

<a id="live-demo--credentials"></a>

## <span style="color:#facc15;">🟡🚀 Live Demo & Credentials</span>

> Replace these placeholders with your actual hosted URLs and test credentials.

* 🌐 **Frontend (User/Admin Panel)**: `https://articly-frontend.vercel.app/`
* 🔗 **Backend API**: `https://articly-backend.onrender.com/api`

### 🔑 Test Accounts

> Demo credentials are sample values; rotate or replace as needed for your deployment.

| Role     | Email               | Password   |
| -------- | ------------------- | ---------- |
| 👑 Admin | `admin@example.com` | `********` |
| 👤 User  | `user@example.com`  | `********` |

---

<a id="features"></a>

## <span style="color:#facc15;">🟡⭐ Features</span>

<a id="end-user-features"></a>

### 👤 End-User Features

* 🔐 **JWT-based Authentication**

  * Register, login, refresh tokens, logout.
  * Auth state stored using secure HTTP-only cookies + frontend store/local storage.
* 📰 **Personalized Article Feed**

  * Feed endpoint uses user preferences (categories, tags).
  * Excludes blocked articles from future feeds.
  * Search and filter by category from the user dashboard.
  * Paginated feed for scalable browsing.
* ✍️ **Article Management (User)**

  * Create, update, and delete own articles.
  * Upload up to **5 images per article** using Cloudinary.
  * Tag management and category mapping for each article.
  * Toggle publish status (`isPublished`) per article.
* 🎭 **Reactions**

  * Like / Dislike / Block content.
  * Reaction counts update in near real time.
  * Blocked articles are removed from the user’s feed and considered in personalization.
* 👤 **Profile & Preferences**

  * Update profile details and profile image.
  * Change password.
  * Configure content preferences (preferred categories) which drive personalized feeds.
* 💫 **Rich, Animated UI/UX**

  * Modern React UI with **Framer Motion** and **GSAP** animations.
  * Article cards with hover effects, tags, author details, and reaction buttons.
  * Full article view in an animated modal including reaction summary and metadata.

<a id="admin-features"></a>

### 👑 Admin Features

* 👥 **User Management**

  * View paginated list of users.
  * Toggle user `active / blocked` status.
  * View individual user details.
* 🗂️ **Category Management**

  * Create, update, and toggle categories.
  * Upload category icons via Cloudinary.
  * Separate public vs admin category listing.
* 🎏 **Banner Management**

  * Manage promotional banners (full CRUD + enable/disable).
  * Upload banner images via Cloudinary.
  * Public endpoint for active banners shown in the user dashboard carousel.
* 📊 **Analytics Dashboard**

  * Overview metrics (total users, total articles, etc.).
  * Top users, top categories, top articles based on engagement.
  * Recent users and recent articles.
  * User growth trend data.
* 🛡 **Security & Hardening**

  * Rate limiting, Helmet, CORS, XSS protection, and MongoDB injection protection.
  * Zod-based validation wired through a central `validate` middleware.
  * Authenticated admin-only access via role-based guards.

---

<a id="tech-stack"></a>

## <span style="color:#facc15;">🟡🧰 Tech Stack</span>

<table style="width:100%; border-collapse:collapse; font-size:0.96rem;">
  <thead>
    <tr>
      <th style="border:1px solid #27272a; padding:8px; background:#0b0b0f; color:#facc15; text-align:left;">Layer</th>
      <th style="border:1px solid #27272a; padding:8px; background:#0b0b0f; color:#facc15; text-align:left;">Technologies</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #27272a; padding:8px; color:#e5e7eb;"><strong>Frontend</strong></td>
      <td style="border:1px solid #27272a; padding:8px; color:#e5e7eb;">
        React 19, TypeScript, Vite, React Router, Tailwind CSS 4, Zustand, React Query,  
        React Hook Form, Zod, Axios, Sonner (toasts), GSAP, Framer Motion, Recharts
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #27272a; padding:8px; color:#e5e7eb;"><strong>Backend</strong></td>
      <td style="border:1px solid #27272a; padding:8px; color:#e5e7eb;">
        Node.js 18+, Express 5, MongoDB, Mongoose, Zod, Bcrypt, JSON Web Tokens,  
        Multer, Cloudinary SDK, Helmet, CORS, Express-Rate-Limit, xss-clean, mongo-sanitize
      </td>
    </tr>
    <tr>
      <td style="border:1px solid #27272a; padding:8px; color:#e5e7eb;"><strong>Infra</strong></td>
      <td style="border:1px solid #27272a; padding:8px; color:#e5e7eb;">
        MongoDB Atlas (cluster), Cloudinary (image storage),  
        Node-compatible hosting (Render, Railway, Vercel Functions, EC2, etc.)
      </td>
    </tr>
  </tbody>
</table>

---

<a id="architecture-overview"></a>

## <span style="color:#facc15;">🟡🏛️ Architecture Overview</span>

* **MERN Monorepo** with separated `/backend` and `/frontend` applications.
* **Layered Backend Architecture**

  * `controllers` – HTTP layer & request handling.
  * `services` – core business logic.
  * `repositories` – database access per domain (User, Article, Category, Banner, Reaction).
  * `models` – Mongoose schemas.
  * `validators` – Zod schemas, wired via central `validate` middleware.
  * `middlewares` – auth, roles, file upload, error handling, security, etc.
* **Role-based Access Control (RBAC)**

  * JWT authentication for users and admins.
  * `requireAuth` ensures identity for protected routes.
  * `requireRole("admin")` gatekeeps admin-only functionality.
* **File Uploads**

  * Multer for multipart handling.
  * Cloudinary as image storage (profile, article images, category icons, banners).
  * Dedicated middlewares for:

    * Single image uploads (e.g., profile, category, banner).
    * Multiple image uploads (e.g., up to 5 article images).
* **Client State Management**

  * Zustand for auth and core UI state.
  * React Query for async data fetching, caching, and synchronization.
  * Strong typing across the frontend via TypeScript.

---

<a id="folder-structure"></a>

## <span style="color:#facc15;">🟡📁 Folder Structure</span>

```bash
ARTICLY/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── dtos/
│   │   ├── helpers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── animations/
    │   ├── app/
    │   ├── assets/
    │   ├── components/
    │   ├── config/
    │   ├── features/
    │   ├── hooks/
    │   ├── lib/
    │   ├── pages/
    │   ├── routes/
    │   ├── services/
    │   ├── store/
    │   ├── styles/
    │   ├── types/
    │   ├── App.tsx
    │   └── main.tsx
    ├── .env.example
    ├── package.json
    └── package-lock.json
```

---

<a id="environment-configuration"></a>

## <span style="color:#facc15;">🟡🔧 Environment Configuration</span>

<a id="backend-env-example"></a>

### 🟣 Backend `.env` Example

```bash
PORT=8080

MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/articlefeeds

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

ACCESS_TOKEN_TTL_MIN=15
REFRESH_TOKEN_TTL_DAYS=14

COOKIE_SECURE=false          # true in production when served over HTTPS
COOKIE_SAMESITE=strict

# For local dev, align with your Vite dev origin (usually http://localhost:5173)
CORS_ORIGIN=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NODE_ENV=development
```

> Copy `/backend/.env.example` to `/backend/.env` and set the values for your environment.

<a id="frontend-env-example"></a>

### 🔵 Frontend `.env` Example

```bash
VITE_API_BASE_URL="http://localhost:8080/api"
```

> Copy `/frontend/.env.example` to `/frontend/.env` and point it to your local or deployed backend base URL.

---

<a id="local-development-setup"></a>

## <span style="color:#facc15;">🟡⚙️ Local Development Setup</span>

### ✅ Prerequisites

* Node.js **>= 18.x** (tested with Node 20.x)
* npm **>= 10.x**
* MongoDB Atlas cluster (or local MongoDB instance)
* Cloudinary account for image hosting

### ▶️ Clone & Install

```bash
# 1. Clone repository
git clone <REPO_URL> articly
cd articly

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install
```

### ▶️ Running the Backend

From the `backend` directory:

```bash
# Development mode with nodemon (if configured)
npm run dev

# or production mode
npm start
# Backend will start on http://localhost:8080 (or the port configured in PORT).
```

### ▶️ Running the Frontend

From the `frontend` directory:

```bash
# Start Vite dev server
npm run dev
# Vite will start on http://localhost:5173 by default.
```

> Ensure `VITE_API_BASE_URL` (frontend) and `CORS_ORIGIN` (backend) are aligned with your actual dev URLs.

---

<a id="cloudinary-integration"></a>

## <span style="color:#facc15;">🟡☁️ Cloudinary Integration</span>

Images (profile images, article images, category icons, banners) are stored in **Cloudinary**.

**High-level flow:**

1. Client sends **multipart form-data** with image files.
2. **Multer middlewares**:

   * `uploadSingleImage("imageUrl")` for single-file forms (e.g., banner, category, profile).
   * `uploadMultipleImages("images", 5)` for article images.
3. Upload middleware pushes the file(s) to Cloudinary using configured credentials.
4. Stored URL(s) are persisted on the respective MongoDB documents.

> Ensure your Cloudinary credentials in `.env` are valid; otherwise, all create/update operations with file uploads will fail.

---

<a id="api-overview"></a>

## <span style="color:#facc15;">🟡📡 API Overview</span>

All API endpoints are prefixed with:

```text
/api
```

<a id="health"></a>

### 🩺 Health

* `GET /api/health`
  Returns basic health status and timestamp.

<a id="authentication"></a>

### 🔐 Authentication

* `POST /api/auth/register` – Register a new user.
* `POST /api/auth/login` – Login and get tokens.
* `POST /api/auth/refresh` – Refresh access token.
* `POST /api/auth/logout` – Logout current session.
* `GET  /api/auth/me` – Get current authenticated user (requires `requireAuth`).

<a id="user-management"></a>

### 👤 User Management

**Authenticated user:**

* `GET    /api/users/me` – Get current user profile.
* `PATCH  /api/users/me` – Update profile details + optional profile image upload.
* `PATCH  /api/users/me/password` – Change password.
* `PATCH  /api/users/me/preferences` – Update preferred categories for personalized feed.

**Admin-only:**

* `GET    /api/users` – List users (paginated).
* `GET    /api/users/:id` – Get user by ID.
* `PATCH  /api/users/:id/toggle` – Toggle user active/blocked status.

<a id="categories"></a>

### 🗂 Categories

**Public:**

* `GET /api/categories` – List active categories (used on signup/preferences).

**Admin-only (requires `requireAuth` + `requireRole("admin")`):**

* `GET    /api/categories/admin` – List all categories for admin.
* `POST   /api/categories` – Create category (with `iconUrl` upload).
* `GET    /api/categories/:id` – Get category by ID.
* `PATCH  /api/categories/:id` – Update category (with optional icon upload).
* `PATCH  /api/categories/:id/toggle` – Toggle category active/inactive.

<a id="banners"></a>

### 🎏 Banners

**Public:**

* `GET /api/banners/active` – List active banners for public carousel.

**Admin-only:**

* `POST   /api/banners` – Create banner (with `imageUrl` upload).
* `GET    /api/banners` – List banners for admin.
* `GET    /api/banners/:id` – Get banner by ID.
* `PATCH  /api/banners/:id` – Update banner.
* `PATCH  /api/banners/:id/toggle` – Enable/disable banner.

<a id="articles"></a>

### 📰 Articles

**Authenticated user (requires `requireAuth`):**

* `GET    /api/articles` – Personalized feed (based on preferences & excluding blocked).
* `GET    /api/articles/mine` – List articles created by the current user.
* `POST   /api/articles` – Create article with up to 5 images (`images` field).
* `GET    /api/articles/:id` – Get single article.
* `PATCH  /api/articles/:id` – Update own article + optional images.
* `DELETE /api/articles/:id` – Delete own article.
* `PATCH  /api/articles/:id/toggle-publish` – Toggle article `isPublished` status.

<a id="reactions"></a>

### 🎭 Reactions

**Authenticated user:**

* `POST /api/reactions/:articleId/like` – Like an article.
* `POST /api/reactions/:articleId/dislike` – Dislike an article.
* `POST /api/reactions/:articleId/block` – Block an article (removes from feed).

Reactions update counters and inform feed personalization logic.

<a id="admin-dashboard"></a>

### 📊 Admin Dashboard

**Admin-only:**

* `GET /api/admin/dashboard/overview` – High-level metrics (users, articles, etc.).
* `GET /api/admin/dashboard/top-users` – Most active users.
* `GET /api/admin/dashboard/top-categories` – Most used categories.
* `GET /api/admin/dashboard/top-articles` – Most liked / engaged articles.
* `GET /api/admin/dashboard/recent-users` – Recently registered users.
* `GET /api/admin/dashboard/recent-articles` – Recently created articles.
* `GET /api/admin/dashboard/user-growth` – Aggregated user growth data.

---

<a id="role--access-control"></a>

## <span style="color:#facc15;">🟡🛡 Role & Access Control</span>

### 👤 User

* Manage own profile, password, and content preferences.
* Create, update, delete, and publish/unpublish their own articles.
* React (like/dislike/block) to feed articles.
* View active categories and banners.

### 👑 Admin

* Everything a **User** can do, plus:

  * Full **User Management** (list, inspect, block/unblock).
  * **Category Management** (CRUD, toggle, icons).
  * **Banner Management** (CRUD, toggle).
  * Access to **Analytics Dashboard** endpoints.

### 🔐 Middlewares

* `requireAuth` – Verifies JWT and attaches user to the request.
* `requireRole("admin")` – Ensures the authenticated user has the `admin` role for protected routes.

---

<a id="screenshots"></a>

## <span style="color:#facc15;">🟡🖼 Screenshots</span>

Add your actual screenshots under something like `docs/screenshots/` and update the paths as needed.

<table style="width:100%; border-collapse:collapse; font-size:0.95rem; margin-bottom:12px;">
  <thead>
    <tr>
      <th style="border:1px solid #27272a; padding:6px; background:#0b0b0f; color:#facc15; text-align:left;">Area / Feature</th>
      <th style="border:1px solid #27272a; padding:6px; background:#0b0b0f; color:#facc15; text-align:left;">Screenshot Path</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #27272a; padding:6px; color:#e5e7eb;">User Dashboard – Article Feed</td>
      <td style="border:1px solid #27272a; padding:6px; color:#e5e7eb;">docs/screenshots/user-dashboard-feed.png</td>
    </tr>
    <tr>
      <td style="border:1px solid #27272a; padding:6px; color:#e5e7eb;">Article View Modal</td>
      <td style="border:1px solid #27272a; padding:6px; color:#e5e7eb;">docs/screenshots/article-view-modal.png</td>
    </tr>
    <tr>
      <td style="border:1px solid #27272a; padding:6px; color:#e5e7eb;">Create Article Form</td>
      <td style="border:1px solid #27272a; padding:6px; color:#e5e7eb;">docs/screenshots/create-article.png</td>
    </tr>
    <tr>
      <td style="border:1px solid #27272a; padding:6px; color:#e5e7eb;">Admin Dashboard Overview</td>
      <td style="border:1px solid #27272a; padding:6px; color:#e5e7eb;">docs/screenshots/admin-dashboard-overview.png</td>
    </tr>
    <tr>
      <td style="border:1px solid #27272a; padding:6px; color:#e5e7eb;">Admin – Manage Users</td>
      <td style="border:1px solid #27272a; padding:6px; color:#e5e7eb;">docs/screenshots/admin-users.png</td>
    </tr>
    <tr>
      <td style="border:1px solid #27272a; padding:6px; color:#e5e7eb;">Admin – Manage Categories</td>
      <td style="border:1px solid #27272a; padding:6px; color:#e5e7eb;">docs/screenshots/admin-categories.png</td>
    </tr>
    <tr>
      <td style="border:1px solid #27272a; padding:6px; color:#e5e7eb;">Admin – Manage Banners</td>
      <td style="border:1px solid #27272a; padding:6px; color:#e5e7eb;">docs/screenshots/admin-banners.png</td>
    </tr>
  </tbody>
</table>

**Example Markdown usage:**

```md
![User Dashboard – Article Feed](docs/screenshots/user-dashboard-feed.png)
![Admin Dashboard – Overview](docs/screenshots/admin-dashboard-overview.png)
![Create Article Form](docs/screenshots/create-article.png)
```

---

<a id="deployment-notes"></a>

## <span style="color:#facc15;">🟡🚀 Deployment Notes</span>

### 🟣 Backend

* Host on any Node-compatible platform (Render, Railway, EC2, Vercel Functions, etc.).
* Set `NODE_ENV=production`.
* Set `COOKIE_SECURE=true` when served over HTTPS.
* Update `CORS_ORIGIN` to your actual frontend domain
  (e.g., `https://articly.yourdomain.com`).
* Ensure MongoDB and Cloudinary credentials are injected via environment variables.

### 🔵 Frontend

* Build using:

  ```bash
  cd frontend
  npm run build
  ```

* Deploy the `dist/` output to Vercel / Netlify / Cloudflare Pages or any static host.

* Set `VITE_API_BASE_URL` to point to your deployed backend API (e.g., `https://api.articly.yourdomain.com/api`).

---

<a id="future-enhancements"></a>

## <span style="color:#facc15;">🟡🔮 Future Enhancements</span>

* Rich text editor for article content.
* Comment system and threaded discussions.
* Notification center for reactions and admin actions.
* More advanced personalization using ML-based recommendations.
* Export analytics from admin dashboard (CSV/PDF).

---

<div align="center" style="margin-top:40px; padding:16px 12px; border-top:1px solid #27272a;">

  <p style="color:#e5e7eb; margin:4px 0;">
    🟡❤️ <strong>Made with passion by Roshan</strong>
  </p>
  <p style="color:#d4d4d8; margin:4px 0; font-size:0.95rem;">
    ⭐ If you like this project, consider giving it a star!
  </p>

</div>
