# Sample Ecommerce Site

This is a full-stack sample ecommerce site for selling perfume decants by the milliliter.

## Project Structure

```
SampleEcommerceSite/
├── backend/
│   ├── requirements.txt
│   └── app/
│       ├── __init__.py
│       ├── crud.py
│       ├── database.py
│       ├── main.py
│       ├── models.py
│       ├── schemas.py
│       └── routes/
│           ├── __init__.py
│           ├── checkout.py
│           ├── perfume.py
│           └── webhook.py
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── api.js
│       ├── App.jsx
│       ├── pages/
│       │   └── Perfumes.jsx
│       └── ...
└── README.md
```

## Getting Started

### Prerequisites
- [Node.js & npm](https://nodejs.org/) (for frontend)
- [Python 3.8+](https://www.python.org/) (for backend)

---

## Frontend Setup

1. Open a terminal and navigate to the `frontend` directory:
	```
	cd frontend
	```
2. Install dependencies:
	```
	npm install
	```
3. Start the development server:
	```
	npm run dev
	```
4. Visit the URL shown in the terminal (usually http://localhost:5173).

---

## Backend Setup

1. Open a terminal and navigate to the `backend` directory:
	```
	cd backend
	```
2. (Optional) Create and activate a virtual environment:
	```
	python -m venv venv
	.\venv\Scripts\activate
	```
3. Install dependencies:
	```
	pip install -r requirements.txt
	```
4. Start the backend server:
	```
	uvicorn app.main:app --reload
	```
5. The backend will run at http://localhost:8000

---

## Features
- Browse available fragrances
- Add decants to cart by milliliter
- Checkout (integrated with backend API)
- Modern React frontend (Vite)
- FastAPI backend

---

## License
MIT

