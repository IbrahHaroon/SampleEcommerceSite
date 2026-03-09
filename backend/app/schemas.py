from pydantic import BaseModel, Field
from typing import Optional, List


# -------- Perfume --------

class PerfumeBase(BaseModel):
    name: str
    brand: str
    description: Optional[str] = None
    notes: Optional[str] = None
    concentration: Optional[str] = None
    price_per_ml_cents: int = Field(default=700, ge=0)
    total_ml_available: float = Field(ge=0)
    allowed_sizes: List[float]
    image_url: Optional[str] = None


class PerfumeCreate(PerfumeBase):
    pass


class Perfume(PerfumeBase):
    id: int

    class Config:
        from_attributes = True


class PerfumeUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    concentration: Optional[str] = None
    price_per_ml_cents: Optional[int] = Field(default=None, ge=0)
    total_ml_available: Optional[float] = Field(default=None, ge=0)
    allowed_sizes: Optional[List[float]] = None
    image_url: Optional[str] = None


# -------- Checkout / Order --------

class CheckoutRequest(BaseModel):
    perfume_id: int
    size_ml: float = Field(gt=0, le=1000)
    quantity: int = Field(default=1, ge=1, le=10)


class OrderOut(BaseModel):
    id: int
    perfume_id: int
    user_id: Optional[str] = None
    size_ml: float
    quantity: int
    amount_total: int
    currency: str
    status: str
    stripe_session_id: str

    class Config:
        from_attributes = True
