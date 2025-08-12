from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import JSON  # works with SQLite as TEXT under the hood
from app.database import Base

class Perfume(Base):
    __tablename__ = "perfumes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    brand = Column(String, nullable=False)
    total_ml_available = Column(Float, nullable=False)  # total ml you’re willing to decant
    allowed_sizes = Column(JSON, nullable=False)        # e.g., [1.0, 2.0, 3.0]

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    perfume_id = Column(Integer, ForeignKey("perfumes.id"), nullable=False)
    size_ml = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    amount_total = Column(Integer, nullable=False)  # cents
    currency = Column(String, default="usd", nullable=False)
    status = Column(String, default="pending", nullable=False)  # pending|paid|failed_stock
    stripe_session_id = Column(String, unique=True, index=True, nullable=False)

    perfume = relationship("Perfume")

