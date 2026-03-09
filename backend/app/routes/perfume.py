
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import crud, schemas
from app.auth import get_current_user

router = APIRouter()

# ---- READ (public) ----
@router.get("/", response_model=List[schemas.Perfume])
def list_perfumes(db: Session = Depends(get_db)):
    return crud.list_perfumes(db)

@router.get("/{perfume_id}", response_model=schemas.Perfume)
def get_perfume(perfume_id: int, db: Session = Depends(get_db)):
    p = crud.get_perfume(db, perfume_id)
    if not p:
        raise HTTPException(status_code=404, detail="Perfume not found")
    return p

# ---- CREATE (requires auth) ----
@router.post("/", response_model=schemas.Perfume, status_code=201)
def create_perfume(
    perfume: schemas.PerfumeCreate,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    if not perfume.allowed_sizes:
        raise HTTPException(status_code=400, detail="allowed_sizes cannot be empty")
    return crud.create_perfume(db, perfume)

# ---- UPDATE (requires auth) ----
@router.patch("/{perfume_id}", response_model=schemas.Perfume)
def update_perfume(
    perfume_id: int,
    changes: schemas.PerfumeUpdate,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    p = crud.update_perfume(db, perfume_id, changes)
    if not p:
        raise HTTPException(status_code=404, detail="Perfume not found")
    return p

# ---- DELETE (requires auth) ----
@router.delete("/{perfume_id}", status_code=204)
def delete_perfume(
    perfume_id: int,
    db: Session = Depends(get_db),
    _user=Depends(get_current_user),
):
    ok = crud.delete_perfume(db, perfume_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Perfume not found")
    return
