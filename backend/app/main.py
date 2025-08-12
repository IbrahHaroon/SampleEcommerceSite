# app/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# --- env & Stripe ---
from dotenv import load_dotenv
load_dotenv()  # loads backend/.env at startup

import os
import stripe

STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")

# It's okay if keys are empty during early dev, but warn if missing
if not STRIPE_SECRET_KEY:
    # You can raise instead if you want to enforce presence:
    # raise RuntimeError("Missing STRIPE_SECRET_KEY in environment")
    pass

stripe.api_key = STRIPE_SECRET_KEY

# --- DB & models ---
from app.database import Base, engine
# IMPORTANT: import models so tables are registered before create_all
from app import models  # noqa: F401

# --- routes ---
from app.routes import perfume as perfume_routes
from app.routes import checkout as checkout_routes
from app.routes import webhook as webhook_routes

# Create DB tables on startup (dev convenience; use migrations in prod)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Perfume Decant API",
    version="0.1.0",
    description="Backend for selling perfume decants with Stripe Checkout.",
)

# CORS (adjust to your frontend dev server)
origins = [
    "http://localhost:3000", "http://127.0.0.1:3000",
    "http://localhost:5173", "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(perfume_routes.router,  prefix="/api/perfumes", tags=["Perfumes"])
app.include_router(checkout_routes.router, prefix="/api/checkout", tags=["Checkout"])
app.include_router(webhook_routes.router,  prefix="/webhook",      tags=["Webhooks"])

# Health & root
@app.get("/")
def root():
    return {"ok": True, "service": "Perfume Decant API"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# Optional: expose publishable key for your frontend to initialize Stripe.js
@app.get("/config/stripe-publishable-key")
def get_publishable_key():
    if not STRIPE_PUBLISHABLE_KEY:
        raise HTTPException(status_code=500, detail="Stripe publishable key not configured")
    return {"publishableKey": STRIPE_PUBLISHABLE_KEY}

