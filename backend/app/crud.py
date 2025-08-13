from __future__ import annotations

from typing import List, Optional, Union
from sqlalchemy.orm import Session

from app import models, schemas


# ---------------------------
# Perfume CRUD
# ---------------------------

def list_perfumes(db: Session) -> List[models.Perfume]:
    """Return all perfumes ordered by brand then name."""
    return (
        db.query(models.Perfume)
        .order_by(models.Perfume.brand, models.Perfume.name)
        .all()
    )


def get_perfume(db: Session, perfume_id: int) -> Optional[models.Perfume]:
    """Return a single perfume by id, or None if not found."""
    return db.query(models.Perfume).filter(models.Perfume.id == perfume_id).first()


def create_perfume(db: Session, data: schemas.PerfumeCreate) -> models.Perfume:
    """
    Create a new perfume from a PerfumeCreate payload.
    Assumes validation already handled by Pydantic (non-empty allowed_sizes, etc).
    """
    perfume = models.Perfume(
        name=data.name,
        brand=data.brand,
        total_ml_available=data.total_ml_available,
        allowed_sizes=data.allowed_sizes,
    )
    db.add(perfume)
    db.commit()
    db.refresh(perfume)
    return perfume


def update_perfume(
    db: Session,
    perfume_id: int,
    data: schemas.PerfumeUpdate,
) -> Optional[models.Perfume]:
    """
    Partially update a perfume. Fields set to None are ignored.
    Returns the updated perfume or None if not found.
    """
    perfume = get_perfume(db, perfume_id)
    if not perfume:
        return None

    if data.name is not None:
        perfume.name = data.name
    if data.brand is not None:
        perfume.brand = data.brand
    if data.total_ml_available is not None:
        perfume.total_ml_available = data.total_ml_available
    if data.allowed_sizes is not None:
        perfume.allowed_sizes = data.allowed_sizes

    db.commit()
    db.refresh(perfume)
    return perfume


def delete_perfume(db: Session, perfume_id: int) -> bool:
    """Delete a perfume by id. Returns True if deleted, False if not found."""
    perfume = get_perfume(db, perfume_id)
    if not perfume:
        return False
    db.delete(perfume)
    db.commit()
    return True


# ---------------------------
# Business operation
# ---------------------------

def purchase_decant(
    db: Session,
    perfume_id: int,
    size_ml: float,
    quantity: int = 1,
) -> Union[models.Perfume, str, None]:
    """
    Decrement stock by (size_ml * quantity) if:
      - perfume exists
      - size_ml is allowed for that perfume
      - enough total_ml_available remains

    Returns:
      - updated models.Perfume on success
      - "Invalid size" if size_ml not allowed
      - "Not enough stock" if insufficient ml
      - None if perfume not found
    """
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

