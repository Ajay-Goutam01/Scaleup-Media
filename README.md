# ScaleUp Media — Full-Stack Agency Website & CMS

**Growth. Strategy. Impact.**

A production-ready digital agency website with a full admin CMS, built on React + Vite (frontend) and Node.js + Express (backend), with MongoDB, ImageKit, GSAP animations, and Lenis smooth scroll.

---

## Architecture

```
scaleup-media/
├── frontend/        # React + Vite + TypeScript + GSAP + Lenis
└── backend/         # Node.js + Express + TypeScript + MongoDB + ImageKit
```

Both are **separate Vercel projects** — frontend and backend deploy independently.

---

## Quick Start (Local Development)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see Environment Variables section)
npm run dev
# Backend runs at http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
# Frontend runs at http://localhost:5173
```

---

## Admin Setup (Development Only)

### Create Initial Admin

```bash
cd backend
npm run admin:create
```

This interactive CLI script:
1. Prompts for admin **name** and **email**
2. Validates inputs and checks that no admin already exists
3. Generates a **strong cryptographic temporary password**
4. Hashes the password with bcrypt and stores `mustChangePassword = true`
5. **Prints credentials to the terminal once**

> ⚠️ The temporary password is **never stored in plaintext** and never written to `.env` or any file.

On first login, the admin is redirected to `/admin/change-password` to set their permanent password before accessing the dashboard.

### Reset Admin Password (Development)

```bash
cd backend
npm run admin:reset
```

If the password is forgotten during development:
1. Prompts for the registered admin email
2. Generates a new temporary password and updates the bcrypt hash with `mustChangePassword = true`
3. Does not modify admin name or other settings
4. On next login, the admin is forced to change their password again

### Seed Demo Data (Optional)

```bash
cd backend
npm run seed
```

Populates MongoDB with sample services, projects, testimonials, and default website content.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | `development` or `production` | No |
| `MONGODB_URI` | MongoDB connection string | **Yes** |
| `JWT_SECRET` | Secret key for JWT signing (min 64 chars) | **Yes** |
| `JWT_EXPIRES_IN` | Token expiry (default: `7d`) | No |
| `CLIENT_URL` | Frontend URL for CORS | **Yes** |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public API key | **Yes** |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private API key | **Yes** |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit CDN endpoint URL | **Yes** |

Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend (`frontend/.env`)

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | **Yes** |

Local: `VITE_API_URL=http://localhost:5000/api`  
Production: `VITE_API_URL=https://your-backend.vercel.app/api`

---

## MongoDB Setup

1. Create a free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a database user with read/write permissions
3. Whitelist `0.0.0.0/0` for Vercel serverless (or use Vercel's IP ranges)
4. Copy the connection string to `MONGODB_URI`

The app uses **connection caching** — safe for Vercel serverless execution (no new connection per request).

---

## ImageKit Setup

1. Create account at [ImageKit.io](https://imagekit.io)
2. Go to **Developer** → **API Keys**
3. Copy Public Key, Private Key, and URL Endpoint
4. Set in `backend/.env`

ImageKit handles: logo, favicon, project thumbnails, gallery images, review profile photos.

> Private credentials remain **server-side only** — never exposed to the frontend.

---

## Vercel Deployment

### Backend (Vercel Project 1)

1. Create a new Vercel project, connect your `backend/` directory
2. Framework: **Other**
3. Set all environment variables (see table above)
4. The entry point is `api/index.ts` — configured in `backend/vercel.json`

```json
// backend/vercel.json
{
  "version": 2,
  "builds": [{ "src": "api/index.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/api/index.ts" }]
}
```

### Frontend (Vercel Project 2)

1. Create a new Vercel project, connect your `frontend/` directory
2. Framework: **Vite**
3. Set `VITE_API_URL` to your deployed backend URL
4. SPA routing is handled by `frontend/vercel.json`

```json
// frontend/vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### After Both Deploy

Update `CLIENT_URL` in backend Vercel env vars to your frontend URL, then **redeploy the backend** to apply the CORS update.

---

## API Reference

### Public Endpoints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/projects` | All active projects |
| `GET` | `/api/projects/:id` | Project by ID or slug |
| `GET` | `/api/services` | All active services |
| `GET` | `/api/reviews/public` | Approved reviews only |
| `GET` | `/api/testimonials` | CMS testimonials |
| `GET` | `/api/content` | Website content settings |
| `GET` | `/api/sections` | Section visibility settings |
| `GET` | `/api/contact` | Contact & WhatsApp settings |
| `GET` | `/api/branding` | Brand name, logo, favicon |
| `GET` | `/api/theme` | Active theme preset |
| `POST` | `/api/reviews` | Submit a review (public) |

### Admin Endpoints (Bearer Token required)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Admin login |
| `GET` | `/api/auth/me` | Get current admin |
| `POST` | `/api/auth/logout` | Logout |
| `POST` | `/api/auth/change-password` | Change admin password |
| `PUT` | `/api/auth/change-email` | Change admin email |
| `POST` | `/api/projects` | Create project |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |
| `POST` | `/api/services` | Create service |
| `PUT` | `/api/services/:id` | Update service |
| `DELETE` | `/api/services/:id` | Delete service |
| `GET` | `/api/reviews/admin` | All reviews (admin) |
| `PUT` | `/api/reviews/admin/:id/approve` | Approve review |
| `PUT` | `/api/reviews/admin/:id/reject` | Reject review |
| `PUT` | `/api/reviews/admin/:id/unpublish` | Unpublish review |
| `DELETE` | `/api/reviews/admin/:id` | Delete review |
| `PUT` | `/api/branding` | Update brand name/tagline |
| `POST` | `/api/branding/logo` | Upload logo |
| `DELETE` | `/api/branding/logo` | Remove logo |
| `POST` | `/api/branding/favicon` | Upload favicon |
| `DELETE` | `/api/branding/favicon` | Remove favicon |
| `PUT` | `/api/theme` | Apply theme preset |
| `PUT` | `/api/content` | Update hero/CTA copy |
| `PUT` | `/api/sections` | Toggle section visibility |
| `PUT` | `/api/contact` | Update contact & WhatsApp |

---

## Tech Stack

### Frontend
- **React 18** + **Vite** + **TypeScript**
- **React Router v6** — SPA routing with Vercel rewrites
- **GSAP** + **ScrollTrigger** — scroll animations, service card 3D stack
- **Lenis** — smooth scroll (desktop), native touch (mobile)
- **CSS Variables** — dynamic theme system (3 presets: Light, ScaleUp Navy, Midnight)
- **Lucide React** — icon set

### Backend
- **Node.js** + **Express** + **TypeScript**
- **MongoDB** + **Mongoose** — data persistence with connection caching
- **JWT** — stateless admin authentication
- **bcryptjs** — password hashing (salt rounds: 10-12)
- **ImageKit** — media CDN (server-side only)
- **Helmet** — security headers
- **CORS** — configurable origin allowlist
- **express-rate-limit** — API and login rate limiting
- **Multer** — multipart file handling before ImageKit upload

---

## Security Notes

- JWT secret must be set via environment variable in production
- Admin passwords are bcrypt-hashed — never stored in plaintext
- Private ImageKit credentials are server-side only
- CORS is configured to specific origins (no wildcard `*` in production)
- Review status enforcement is server-side — frontend cannot bypass approval
- Admin IP-based review submission rate limiting (5 per 15 min per IP)
- Error responses do not expose stack traces or internal error messages in production

---

## Themes

Three built-in themes (switchable by visitors, admin sets default):

| Theme | Description |
|---|---|
| **Light** | Clean white agency look |
| **ScaleUp Navy** | Signature deep navy brand identity |
| **Midnight** | Cinematic charcoal & violet |

Admin sets the global default via the Appearance page. Visitors can override locally (localStorage).
