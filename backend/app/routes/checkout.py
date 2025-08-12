from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import os, stripe
from app.database import get_db
from app import crud, schemas

router = APIRouter()

@router.post("/session")
def create_checkout_session(payload: schemas.CheckoutRequest, db: Session = Depends(get_db)):
    perfume = crud.get_perfume(db, payload.perfume_id)
    if not perfume:
        raise HTTPException(status_code=404, detail="Perfume not found")

    # Validate size + quantity against stock
    if payload.size_ml not in perfume.allowed_sizes:
        raise HTTPException(status_code=400, detail="Invalid decant size")
    needed_ml = payload.size_ml * payload.quantity
    if perfume.total_ml_available < needed_ml:
        raise HTTPException(status_code=400, detail="Not enough stock")

    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    # create Stripe Checkout Session
    session = stripe.checkout.Session.create(
        mode="payment",
        success_url=f"{FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{FRONTEND_URL}/cancel",
        line_items=[{
            "price_data": {
                "currency": "usd",
                "product_data": {
                    "name": f"{perfume.brand} {perfume.name} — {payload.size_ml}ml decant",
                    "metadata": {
                        "perfume_id": str(perfume.id),
                        "size_ml": str(payload.size_ml),
                    },
                },
                "unit_amount": payload.unit_amount_cents,
            },
            "quantity": payload.quantity,
        }],
        shipping_address_collection={"allowed_countries": ["US"]},
        automatic_tax={"enabled": False},
        metadata={
            "perfume_id": str(perfume.id),
            "size_ml": str(payload.size_ml),
            "quantity": str(payload.quantity),
        },
    )

    # record pending order
    crud.create_order(
        db,
        perfume_id=perfume.id,
        size_ml=payload.size_ml,
        quantity=payload.quantity,
        amount_total=payload.unit_amount_cents * payload.quantity,
        currency="usd",
        stripe_session_id=session.id,
    )

    return {"url": session.url}

