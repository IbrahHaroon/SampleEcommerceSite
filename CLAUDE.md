# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Layout

```
SampleEcommerceSite/
├── backend/        # FastAPI + SQLAlchemy + Stripe + Supabase Auth
└── frontend/       # React 19 + Vite + Tailwind CSS + Supabase JS
```

## Commands

### Backend (run from `backend/`)

```bash
uvicorn app.main:app --reload   # dev server
pytest                          # tests
```

### Frontend (run from `frontend/`)

```bash
npm install        # install deps (includes @supabase/supabase-js)
npm run dev        # Vite dev server → http://localhost:5173
npm run build      # production build
npm run lint       # ESLint
```

## Hosting Stack

| Layer    | Service  | Notes |
|----------|----------|-------|
| Frontend | Vercel   | Auto-deploy from `main`; set `VITE_*` env vars in Vercel dashboard |
| Backend  | Railway  | Reads `backend/Procfile`; set all backend env vars in Railway dashboard |
| Database | Supabase | PostgreSQL — managed via Supabase dashboard; Auth also handled by Supabase |

## Architecture

### Backend

- **Entry point**: `app/main.py` — FastAPI app, CORS (localhost + `FRONTEND_URL` + `ALLOWED_ORIGINS`), Stripe init, DB table auto-create.
- **Database**: `app/database.py` — uses `DATABASE_URL` env var (PostgreSQL in production via Supabase, SQLite locally as fallback). Handles `postgres://` → `postgresql://` rewrite automatically.
- **Models** (`app/models.py`): `Perfume` (name, brand, description, notes, concentration, price_per_ml_cents, total_ml_available, allowed_sizes as JSON, image_url) and `Order` (ties to Perfume, tracks user_id, Stripe session ID, status: `pending | paid | failed_stock`).
- **Schemas** (`app/schemas.py`): Pydantic v2 models (`from_attributes = True`).
- **CRUD** (`app/crud.py`): All DB operations including `create_order` and `mark_order_paid_and_decrement_stock` (called by the webhook).
- **Auth** (`app/auth.py`): `get_current_user` / `get_optional_user` FastAPI dependencies — verify Supabase JWTs (HS256) using `SUPABASE_JWT_SECRET`.
- **Routes**:
  - `GET/POST/PATCH/DELETE /api/perfumes/` — inventory management
  - `GET /api/perfumes/{id}` — single perfume
  - `POST /api/checkout/session` — validates stock, creates Stripe Checkout Session, saves pending Order (accepts optional auth to attach user_id)
  - `POST /webhook/stripe` — verifies Stripe signature, marks order paid, decrements stock

### Backend Env Vars (`backend/.env`, see `.env.example`)

```
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
DATABASE_URL          # Supabase PostgreSQL connection string
SUPABASE_JWT_SECRET   # Supabase Dashboard → Project Settings → API → JWT Secret
FRONTEND_URL          # Your Vercel deployment URL (used for Stripe redirects + CORS)
ALLOWED_ORIGINS       # Optional comma-separated extra CORS origins
```

### Payment Flow

1. Frontend calls `POST /api/checkout/session` (with optional Bearer token for logged-in users).
2. Backend validates stock, creates Stripe Checkout Session, saves pending Order, returns checkout URL.
3. Stripe redirects user to `/success` or `/cancel`.
4. Stripe calls `POST /webhook/stripe`; backend verifies signature → marks order paid → decrements stock.

### Frontend

- **Routing** (`App.jsx`): React Router v7. Routes: `/`, `/perfumes`, `/perfumes/:id`, `/login`, `/faq`, `/about`, `/success`, `/cancel`.
- **Auth** (`src/context/AuthContext.jsx`): Supabase session stored in React context. `useAuth()` exposes `user`, `session`, `signOut`.
- **Supabase client** (`src/lib/supabase.js`): Initialized with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- **API layer** (`src/api.js`): Fetch wrappers — `getPerfumes()`, `getPerfume(id)`, `createCheckoutSession(payload, session)`. Base URL from `VITE_API_URL` (defaults to `http://localhost:8000`).
- **Image resolution** (`src/utils/perfumeImages.js`): Matches perfume `name`/`brand` to filenames in `src/assets/media/`. Fallback to `react.svg`. To add an image, drop a file named `<name>_<brand>` or `<brand>_<name>` (slugified) into `src/assets/media/`.
- **Pages**: Home (popular grid), Perfumes (full catalog, searchable), PerfumeDetail (image, description, size selector, quantity, Stripe checkout), Login (Supabase email/password auth), Success, Cancel, FAQ, About.
- **Styling**: Tailwind CSS v3, dark theme (`bg-black text-white`).

### Frontend Env Vars (`frontend/.env`, see `.env.example`)

```
VITE_API_URL            # Railway backend URL
VITE_SUPABASE_URL       # https://your-ref.supabase.co
VITE_SUPABASE_ANON_KEY  # Supabase anon/public key
```
