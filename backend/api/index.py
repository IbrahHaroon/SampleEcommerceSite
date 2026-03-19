"""Vercel serverless entry point — re-exports the FastAPI app."""

from app.main import app  # noqa: F401

# Vercel's Python runtime looks for a variable named `app` (or `handler`)
# in this module. FastAPI/Starlette ASGI apps are supported natively.
