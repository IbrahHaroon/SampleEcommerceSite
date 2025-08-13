from pydantic import BaseModel, Field
from typing import Optional, List

# -------- Perfume --------
class PerfumeBase(BaseModel):
    name: str
    brand: str
    total_ml_available: float = Field(ge=0)
    allowed_sizes: List[float]  # e.g., [1.0, 2.0, 3.0]

class PerfumeCreate(PerfumeBase):
    pass

class Perfume(PerfumeBase):
    id: int
    class Config:
        orm_mode = True

class PerfumeUpdate(BaseModel):
    name: Optional[str] = None
    brand: Optional[str] = None
    total_ml_available: Optional[float] = Field(default=None, ge=0)
    allowed_sizes: Optional[List[float]] = None


# -------- Checkout / Order --------
class CheckoutRequest(BaseModel):
    perfume_id: int
    size_ml: float
    quantity: int = Field(default=1, ge=1)
    unit_amount_cents: int = Field(ge=0)  # e.g., 700 for $7.00

class OrderOut(BaseModel):
    id: int
    perfume_id: int
    size_ml: float
    quantity: int
    amount_total: int
    currency: str
    status: str
    stripe_session_id: str

    class Config:
        orm_mode = True

