from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import crud, schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Perfume])
def list_perfumes(db: Session = Depends(get_db)):
    return crud.get_perfumes(db)

@router.post("/", response_model=schemas.Perfume, status_code=201)
def create_perfume(perfume: schemas.PerfumeCreate, db: Session = Depends(get_db)):
    if perfume.total_ml_available < 0:
        raise HTTPException(status_code=400, detail="total_ml_available must be >= 0")
    if not perfume.allowed_sizes:
        raise HTTPException(status_code=400, detail="allowed_sizes cannot be empty")
    return crud.create_perfume(
        db,
        name=perfume.name,
        brand=perfume.brand,
        total_ml_available=perfume.total_ml_available,
        allowed_sizes=perfume.allowed_sizes,
    )

