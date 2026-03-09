from __future__ import annotations

from typing import List, Optional, Union
from sqlalchemy.orm import Session

from app import models, schemas


# ---------------------------
# Perfume CRUD
# ---------------------------

def list_perfumes(db: Session) -> List[models.Perfume]:
    return (
        db.query(models.Perfume)
        .order_by(models.Perfume.brand, models.Perfume.name)
        .all()
    )


def get_perfume(db: Session, perfume_id: int) -> Optional[models.Perfume]:
    return db.query(models.Perfume).filter(models.Perfume.id == perfume_id).first()


def create_perfume(db: Session, data: schemas.PerfumeCreate) -> models.Perfume:
    perfume = models.Perfume(**data.model_dump())
    db.add(perfume)
    db.commit()
    db.refresh(perfume)
    return perfume


def update_perfume(
    db: Session,
    perfume_id: int,
    data: schemas.PerfumeUpdate,
) -> Optional[models.Perfume]:
    perfume = get_perfume(db, perfume_id)
    if not perfume:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(perfume, field, value)
    db.commit()
    db.refresh(perfume)
    return perfume


def delete_perfume(db: Session, perfume_id: int) -> bool:
    perfume = get_perfume(db, perfume_id)
    if not perfume:
        return False
    db.delete(perfume)
    db.commit()
    return True


# ---------------------------
# Business operations
# ---------------------------

def purchase_decant(
    db: Session,
    perfume_id: int,
    size_ml: float,
    quantity: int = 1,
) -> Union[models.Perfume, str, None]:
    perfume = get_perfume(db, perfume_id)
    if not perfume:
        return None
    if size_ml not in perfume.allowed_sizes:
        return "Invalid size"
    needed_ml = size_ml * quantity
    if perfume.total_ml_available < needed_ml:
        return "Not enough stock"
    perfume.total_ml_available -= needed_ml
    db.commit()
    db.refresh(perfume)
    return perfume


def create_order(
    db: Session,
    perfume_id: int,
    size_ml: float,
    quantity: int,
    amount_total: int,
    currency: str,
    stripe_session_id: str,
    user_id: Optional[str] = None,
) -> models.Order:
    order = models.Order(
        perfume_id=perfume_id,
        user_id=user_id,
        size_ml=size_ml,
        quantity=quantity,
        amount_total=amount_total,
        currency=currency,
        stripe_session_id=stripe_session_id,
        status="pending",
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def mark_order_paid_and_decrement_stock(
    db: Session,
    stripe_session_id: str,
) -> Optional[models.Order]:
    # Lock the order row to prevent concurrent webhook processing for the same session
    order = (
        db.query(models.Order)
        .filter(models.Order.stripe_session_id == stripe_session_id)
        .with_for_update()
        .first()
    )
    if not order:
        return None

    # Idempotency guard — already processed
    if order.status != "pending":
        return order

    # Lock the perfume row to prevent overselling across concurrent orders
    perfume = (
        db.query(models.Perfume)
        .filter(models.Perfume.id == order.perfume_id)
        .with_for_update()
        .first()
    )
    if not perfume:
        order.status = "failed_stock"
        db.commit()
        return order

    needed_ml = order.size_ml * order.quantity
    if perfume.total_ml_available < needed_ml:
        order.status = "failed_stock"
        db.commit()
        return order

    perfume.total_ml_available -= needed_ml
    order.status = "paid"
    db.commit()
    db.refresh(order)
    return order
