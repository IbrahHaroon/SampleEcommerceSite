from sqlalchemy import Column, Integer, String, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy import JSON
from app.database import Base


class Perfume(Base):
    __tablename__ = "perfumes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    brand = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    notes = Column(String, nullable=True)             # e.g. "bergamot, vetiver, musk"
    concentration = Column(String, nullable=True)     # EDP, EDT, Parfum, etc.
    price_per_ml_cents = Column(Integer, nullable=False, default=700)  # cents per ml
    total_ml_available = Column(Float, nullable=False)
    allowed_sizes = Column(JSON, nullable=False)      # e.g. [1.0, 2.0, 5.0]
    image_url = Column(String, nullable=True)         # externally hosted image URL


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    perfume_id = Column(Integer, ForeignKey("perfumes.id"), nullable=False)
    user_id = Column(String, nullable=True)           # Supabase user UUID (null = guest)
    size_ml = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    amount_total = Column(Integer, nullable=False)    # total in cents
    currency = Column(String, default="usd", nullable=False)
    status = Column(String, default="pending", nullable=False)  # pending|paid|failed_stock
    stripe_session_id = Column(String, unique=True, index=True, nullable=False)

    perfume = relationship("Perfume")
