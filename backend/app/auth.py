import os
from typing import Optional
from fastapi import HTTPException, Header
import jwt

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")


async def get_current_user(authorization: Optional[str] = Header(default=None)):
    """
    FastAPI dependency — validates a Supabase-issued JWT.
    Returns the decoded payload; the 'sub' field is the Supabase user UUID.
    Raises HTTP 401 if missing or invalid.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.split(" ", 1)[1]

    if not SUPABASE_JWT_SECRET:
        raise HTTPException(status_code=500, detail="Auth not configured on server")

    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as exc:
        raise HTTPException(status_code=401, detail=f"Invalid token: {exc}")


async def get_optional_user(authorization: Optional[str] = Header(default=None)):
    """
    Like get_current_user but returns None for unauthenticated requests
    instead of raising, allowing guest checkout.
    """
    if not authorization or not authorization.startswith("Bearer "):
        return None

    token = authorization.split(" ", 1)[1]

    if not SUPABASE_JWT_SECRET:
        return None

    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except jwt.InvalidTokenError:
        return None
