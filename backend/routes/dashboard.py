from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from services import db_service

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/{ngo_id}")
def get_dashboard(ngo_id: str, db: Session = Depends(get_db)) -> dict:
    return db_service.get_dashboard_stats(db, ngo_id)
