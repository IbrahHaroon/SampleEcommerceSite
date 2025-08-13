
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import crud, schemas

router = APIRouter()

# ---- READ ----
@router.get("/", response_model=List[schemas.Perfume])
def list_perfumes(db: Session = Depends(get_db)):
    return crud.list_perfumes(db)

@router.get("/{perfume_id}", response_model=schemas.Perfume)
def get_perfume(perfume_id: int, db: Session = Depends(get_db)):
    p = crud.get_perfume(db, perfume_id)
    if not p:
        raise HTTPException(status_code=404, detail="Perfume not found")
    return p

# ---- CREATE ----
@router.post("/", response_model=schemas.Perfume, status_code=201)
def create_perfume(perfume: schemas.PerfumeCreate, db: Session = Depends(get_db)):
    if not perfume.allowed_sizes:
        raise HTTPException(status_code=400, detail="allowed_sizes cannot be empty")
    return crud.create_perfume(db, perfume)

# ---- UPDATE (partial) ----
@router.patch("/{perfume_id}", response_model=schemas.Perfume)
def update_perfume(perfume_id: int, changes: schemas.PerfumeUpdate, db: Session = Depends(get_db)):
    p = crud.update_perfume(db, perfume_id, changes)
    if not p:
        raise HTTPException(status_code=404, detail="Perfume not found")
    return p

# ---- DELETE ----
@router.delete("/{perfume_id}", status_code=204)
def delete_perfume(perfume_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_perfume(db, perfume_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Perfume not found")
    return

# ---- Business op: purchase (decrement ml) ----
@router.post("/{perfume_id}/purchase", response_model=schemas.Perfume)
def purchase_decant(
    perfume_id: int,
    size_ml: float = Query(..., description="Decant size (e.g., 1, 2, 3)"),
    quantity: int = Query(1, ge=1, description="Number of vials to sell"),
    db: Session = Depends(get_db),
):
    result = crud.purchase_decant(db, perfume_id, size_ml=size_ml, quantity=quantity)
    if result is None:
        raise HTTPException(status_code=404, detail="Perfume not found")
    if isinstance(result, str):
        msg = "Invalid decant size" if result == "Invalid size" else "Not enough stock"
        raise HTTPException(status_code=400, detail=msg)
    return result

