from sqlalchemy.orm import Session
from app import models

# -------- Perfume --------
def create_perfume(db: Session, *, name: str, brand: str, total_ml_available: float, allowed_sizes: list[float]) -> models.Perfume:
    p = models.Perfume(
        name=name,
        brand=brand,
        total_ml_available=total_ml_available,
        allowed_sizes=allowed_sizes,
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

def get_perfumes(db: Session) -> list[models.Perfume]:
    return db.query(models.Perfume).all()

def get_perfume(db: Session, perfume_id: int) -> models.Perfume | None:
    return db.query(models.Perfume).filter(models.Perfume.id == perfume_id).first()

# -------- Orders --------
def create_order(
    db: Session,
    *,
    perfume_id: int,
    size_ml: float,
    quantity: int,
    amount_total: int,
    currency: str,
    stripe_session_id: str,
) -> models.Order:
    o = models.Order(
        perfume_id=perfume_id,
        size_ml=size_ml,
        quantity=quantity,
        amount_total=amount_total,
        currency=currency,
        status="pending",
        stripe_session_id=stripe_session_id,
    )
    db.add(o)
    db.commit()
    db.refresh(o)
    return o

def mark_order_paid_and_decrement_stock(db: Session, session_id: str) -> models.Order | None:
    order = db.query(models.Order).filter(models.Order.stripe_session_id == session_id).first()
    if not order:
        return None
    if order.status == "paid":
        return order  # idempotent

    perfume = db.query(models.Perfume).filter(models.Perfume.id == order.perfume_id).first()
    if not perfume:
        return None

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

