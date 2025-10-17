<!-- Copilot instructions for SampleEcommerceSite -->
# Quick guide for AI coding agents

Focus: small, low-risk edits that keep the frontend (Vite + React) and backend (FastAPI) working together.

- Project layout: `frontend/` (Vite, React, src/api.js, App.jsx) and `backend/app/` (FastAPI, SQLAlchemy, Stripe integration).
- Dev servers: frontend -> `npm run dev` in `frontend/`; backend -> `uvicorn app.main:app --reload` in `backend/`.

- Key files to inspect before changes:
  - Backend: `backend/app/main.py`, `backend/app/routes/*.py`, `backend/app/crud.py`, `backend/app/models.py`, `backend/app/schemas.py`, `backend/app/database.py`.
  - Frontend: `frontend/src/api.js`, `frontend/src/App.jsx`, `frontend/src/pages/Perfumes.jsx`, `frontend/src/components/Navigation.jsx`.

- API conventions:
  - Backend routes are mounted under `/api` (see `main.py`).
  - Frontend reads the backend base URL from `import.meta.env.VITE_API_URL` in `src/api.js`.
  - Stripe: secret key is read from environment (`.env` loaded in `main.py`). Webhooks live under `/webhook`.

- Data models & shapes:
  - `Perfume` ORM -> fields: `id`, `name`, `brand`, `total_ml_available` (float), `allowed_sizes` (JSON array of floats).
  - Schemas mirror ORM via Pydantic (`schemas.py`) — use these types for request/response shapes.

- Common tasks and patterns:
  - DB: app uses SQLite (`perfumes.db`) for dev. Tables are auto-created on startup via `Base.metadata.create_all(bind=engine)` in `main.py`.
  - CRUD functions live in `crud.py`; business logic such as `purchase_decant()` is centralized there.
  - Frontend fetch helpers in `src/api.js` use `fetch` and throw on non-OK responses — prefer to mirror this behavior for new API calls.

- Safety and helpful constraints for edits:
  - Do not change the API surface (route paths or JSON shapes) without updating `src/api.js` and relevant frontend pages.
  - Avoid hard-failing when Stripe keys are missing — `main.py` tolerates empty keys for local dev.
  - When changing DB schema: prefer adding nullable fields or defaults; migrations are not present.

- Testing & verification steps (local):
  1. Start backend: `cd backend; pip install -r requirements.txt; uvicorn app.main:app --reload`.
  2. Start frontend: `cd frontend; npm install; npm run dev`.
  3. Verify API: GET `/api/perfumes/` returns JSON; visit frontend at Vite URL (default http://localhost:5173).

- Examples to reference in code:
  - Use `crud.list_perfumes(db)` as example of DB queries (see `backend/app/crud.py`).
  - Reference `src/api.js` (see the `getPerfumes` export) when adding similar fetch helpers.

- If you need to add files:
  - Frontend: keep files under `frontend/src/` and update `frontend/package.json` only if adding build-time deps.
  - Backend: add modules under `backend/app/`; ensure imports are referenced in `main.py` if they register models or routes.

If anything is unclear or you want me to expand a section (e.g., examples for adding a new API route or component), tell me which area to expand.
