# Articly – Personalized Article Feeds Web Application (MERN)

Articly is a full-stack article feeds platform built with the MERN stack, featuring role-based access control, personalized feeds, content reactions, and an analytics-driven admin dashboard.  
Users can discover, react to, and manage articles tailored to their interests; admins can manage users, categories, banners, and monitor platform health through rich metrics.

---

## Table of Contents

- [Live Demo & Credentials](#live-demo--credentials)
- [Features](#features)
  - [End-User Features](#end-user-features)
  - [Admin Features](#admin-features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Folder Structure](#folder-structure)
- [Environment Configuration](#environment-configuration)
  - [Backend `.env` Example](#backend-env-example)
  - [Frontend `.env` Example](#frontend-env-example)
- [Local Development Setup](#local-development-setup)
  - [Clone & Install](#clone--install)
  - [Running the Backend](#running-the-backend)
  - [Running the Frontend](#running-the-frontend)
- [Cloudinary Integration](#cloudinary-integration)
- [API Overview](#api-overview)
  - [Health](#health)
  - [Authentication](#authentication)
  - [User Management](#user-management)
  - [Categories](#categories)
  - [Banners](#banners)
  - [Articles](#articles)
  - [Reactions](#reactions)
  - [Admin Dashboard](#admin-dashboard)
- [Role & Access Control](#role--access-control)
- [Screenshots](#screenshots)
- [Deployment Notes](#deployment-notes)
- [Future Enhancements](#future-enhancements)

---

## Live Demo & Credentials

> Replace these placeholders with your actual hosted URLs and test credentials.

- **Frontend (User/Admin Panel)**: `https://<your-frontend-url>`
- **Backend API**: `https://<your-backend-api-url>/api`

**Test Accounts** (Currently its been changed.)

- Admin: `admin@example.com` / `********`
- User: `user@example.com` / `********`

---

## Features

### End-User Features

- **JWT-based Authentication**
  - Register, login, refresh tokens, logout.
  - Auth state stored via secure cookies + local storage (handled in frontend store).

- **Personalized Article Feed**
  - Feed endpoint uses user preferences (categories, tags) and excludes blocked articles.
  - Search and filter by category from the user dashboard.
  - Paginated feed for scalable browsing.

- **Article Management (User)**
  - Create, update, and delete own articles.
  - Upload up to 5 images per article using Cloudinary.
  - Add tags and category mapping.
  - Toggle publish status of an article.

- **Reactions**
  - Like / Dislike / Block content.
  - Reactions update counts in real-time and influence the feed (blocked articles removed from feed).

- **Profile & Preferences**
  - Update profile details and profile image.
  - Change password.
  - Configure content preferences (categories) which drive feed personalization.

- **Rich UI/UX**
  - Modern animated React UI with Framer Motion.
  - Article cards with hover effects, tags, author details, and reaction buttons.
  - Full article view in an animated modal with reaction summary.

### Admin Features

- **User Management**
  - View paginated list of users.
  - Toggle user active/blocked status.
  - View individual user details.

- **Category Management**
  - Create, update, and toggle categories.
  - Upload category icons via Cloudinary.
  - Separate public vs. admin category listing.

- **Banner Management**
  - Manage promotional banners (CRUD + toggle).
  - Upload banner images via Cloudinary.
  - Public endpoint for active banners shown on the user dashboard carousel.

- **Analytics Dashboard**
  - Overview metrics (total users, total articles, etc.).
  - Top users, top categories, top articles (based on engagement).
  - Recent users and recent articles.
  - User growth trend data.

- **Security & Hardening**
  - Rate limiting, Helmet, CORS, XSS and MongoDB injection protection.
  - Zod-based validation through a central `validate` middleware.

---

## Tech Stack

| Layer     | Technologies                                                                                                 |
|----------|--------------------------------------------------------------------------------------------------------------|
| Frontend | React 19, TypeScript, Vite, React Router, React Query, Zustand, React Hook Form, Zod, Tailwind CSS 4, GSAP, Framer Motion, Recharts, Sonner (toasts), Axios |
| Backend  | Node.js 18+, Express 5, MongoDB + Mongoose, Zod, Bcrypt, JSON Web Tokens, Cloudinary, Multer, Helmet, CORS, Express-Rate-Limit, XSS-Clean, Mongo-Sanitize |
| Infra    | MongoDB Atlas (cluster), Cloudinary (image storage), any Node-compatible hosting (Railway/Render/Vercel Functions/EC2, etc.) |

---

## Architecture Overview

- **MERN Monorepo** with separated `/backend` and `/frontend` applications.
- **Layered Backend**
  - `controllers` – HTTP layer and request handling.
  - `services` – core business logic.
  - `repositories` – database access for each domain (User, Article, Category, Banner, Reaction).
  - `models` – Mongoose schemas.
  - `validators` – Zod schemas, wired via a central `validate` middleware.
  - `middlewares` – auth, roles, file upload, error handling, etc.
- **Role-based Access Control (RBAC)**
  - Users authenticate via JWT.
  - `requireAuth` ensures identity.
  - `requireRole("admin")` gatekeeps admin-only routes.
- **File Uploads**
  - Using Multer for multipart handling, Cloudinary as storage.
  - Separate middlewares for single (`uploadSingleImage`) and multiple (`uploadMultipleImages`) image uploads.
- **Client State Management**
  - Auth & user state in Zustand store.
  - React Query for async data fetching/caching.
  - Strong typing across the frontend via TypeScript.

---

## Folder Structure

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
## Environment Configuration

Backend .env Example
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
#Copy .env.example to .env under /backend and set the values for your environment.
```

## Frontend .env Example
```bash
VITE_API_BASE_URL="http://localhost:8080/api"
#Copy .env.example to .env under /frontend and point it to your local or deployed backend base URL.
```
## Local Development Setup

#Prerequisites
.Node.js >= 18.x (tested with Node 20.x)
.npm >= 10.x
.MongoDB Atlas cluster (or local MongoDB instance)
.Cloudinary account for image hosting

## Clone & Install
# 1. Clone repository
git clone <REPO_URL> articly
cd articly

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

## Running the Backend

From the backend directory:
```bash
# Development mode with nodemon
npm run dev

# or production mode
npm start
#Backend will start on http://localhost:8080 (or the port configured in PORT).
```

## Running the Frontend

From the frontend directory:
```bash
# Start Vite dev server
npm run dev
Vite will start on http://localhost:5173 by default.
Ensure VITE_API_BASE_URL and CORS_ORIGIN are aligned with your actual dev URLs.
```

## Cloudinary Integration

Images (profile images, article images, category icons, banners) are stored in Cloudinary.

High-level flow:
.Client sends multipart form data with image files.
.Multer middlewares:
uploadSingleImage("imageUrl") for single-file forms (e.g., banner, category, profile).
uploadMultipleImages("images", 5) for article images.
.Upload middleware pushes the file(s) to Cloudinary using the configured credentials.
.Stored URL(s) are persisted on the respective MongoDB documents.
 Ensure your Cloudinary credentials in .env are valid; otherwise, all create/update operations with file uploads will fail.

## API Overview

All API endpoints are prefixed with /api.

# Health

GET /api/health
Returns basic health status and timestamp.

# Authentication

POST /api/auth/register – Register a new user.

POST /api/auth/login – Login and get tokens.

POST /api/auth/refresh – Refresh access token.

POST /api/auth/logout – Logout current session.

GET /api/auth/me – Get current authenticated user (requires requireAuth).

# User Management

GET /api/users/me – Get current user profile.

PATCH /api/users/me – Update profile details + optional profile image upload.

PATCH /api/users/me/password – Change password.

PATCH /api/users/me/preferences – Update preferred categories for feed.

# Admin-only:

GET /api/users – List users.

GET /api/users/:id – Get user by ID.

PATCH /api/users/:id/toggle – Toggle user active/blocked status.

# Categories

. Public:

GET /api/categories – List active categories (used on signup/preferences).

. Admin-only (requires requireAuth + requireRole("admin")):

GET /api/categories/admin – List all categories for admin.

POST /api/categories – Create category (with iconUrl upload).

GET /api/categories/:id – Get category by ID.

PATCH /api/categories/:id – Update category (with optional icon upload).

PATCH /api/categories/:id/toggle – Toggle category active/inactive.

# Banners

. Public:

GET /api/banners/active – List active banners for public carousel.

. Admin-only:

POST /api/banners – Create banner (with imageUrl upload).

GET /api/banners – List banners for admin.

GET /api/banners/:id – Get banner by ID.

PATCH /api/banners/:id – Update banner.

PATCH /api/banners/:id/toggle – Enable/disable banner.

# Articles

. Authenticated user (requires requireAuth):

GET /api/articles – Personalized feed (based on preferences & excluding blocked).

GET /api/articles/mine – List articles created by the current user.

POST /api/articles – Create article with up to 5 images (images field).

GET /api/articles/:id – Get single article.

PATCH /api/articles/:id – Update article + optional images.

DELETE /api/articles/:id – Delete own article.

PATCH /api/articles/:id/toggle-publish – Toggle article isPublished status.

# Reactions

. Authenticated user:

POST /api/reactions/:articleId/like – Like an article.

POST /api/reactions/:articleId/dislike – Dislike an article.

POST /api/reactions/:articleId/block – Block an article (removes from feed).

Reactions update counters and inform feed logic.

# Admin Dashboard

. Admin-only:

GET /api/admin/dashboard/overview – High-level metrics (users, articles, etc.).

GET /api/admin/dashboard/top-users – Most active users.

GET /api/admin/dashboard/top-categories – Most used categories.

GET /api/admin/dashboard/top-articles – Most liked / engaged articles.

GET /api/admin/dashboard/recent-users – Recently registered users.

GET /api/admin/dashboard/recent-articles – Recently created articles.

GET /api/admin/dashboard/user-growth – Aggregated user growth data.

## Role & Access Control

. User

.Can manage own profile, password, preferences.
.Can create, update, delete, and publish/unpublish their own articles.
.Can react (like/dislike/block) to any feed article.
.Can view banners and active categories.

. Admin

.Everything a User can do.
.Plus full access to:
  .User management.
  .Category management.
  .Banner management.
  .Analytics dashboard endpoints.

# Middlewares:

. requireAuth – Verifies JWT & user.
. requireRole("admin") – Ensures user role is admin for protected routes.

# Screenshots

Add your actual screenshots under something like docs/screenshots/ and update the paths below.

Area / Feature	Screenshot Path
User Dashboard – Article Feed	docs/screenshots/user-dashboard-feed.png
Article View Modal	docs/screenshots/article-view-modal.png
Create Article Form	docs/screenshots/create-article.png
Admin Dashboard Overview	docs/screenshots/admin-dashboard-overview.png
Admin – Manage Users	docs/screenshots/admin-users.png
Admin – Manage Categories	docs/screenshots/admin-categories.png
Admin – Manage Banners	docs/screenshots/admin-banners.png

Example Markdown usage:

![User Dashboard – Article Feed](docs/screenshots/user-dashboard-feed.png)

## Deployment Notes

. Backend
Host on any Node-compatible platform (Render, Railway, EC2, etc.).
Set NODE_ENV=production, COOKIE_SECURE=true and update CORS_ORIGIN to your actual frontend domain (e.g., https://articly.yourdomain.com).
Ensure MongoDB and Cloudinary credentials are set via environment variables.

. Frontend
Build using npm run build in /frontend.
Deploy the dist output to Vercel / Netlify / Cloudflare Pages or any static host.
Set VITE_API_BASE_URL to point to your deployed backend API.

## Future Enhancements

.Rich text editor for article content.
.Comment system and threaded discussions.
.Notification center for reactions and admin actions.
.More advanced personalization using ML-based recommendations.
.Export analytics from admin dashboard (CSV/PDF).
