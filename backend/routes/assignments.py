from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from services import db_service

router = APIRouter(prefix="/api", tags=["assignments"])


class AssignRequest(BaseModel):
    task_id: int
    volunteer_id: str


@router.post("/assign")
def assign_volunteer(
    payload: AssignRequest,
    db: Session = Depends(get_db),
) -> dict:
    return db_service.assign_volunteer(db, payload.task_id, payload.volunteer_id)


@router.get("/assignments/{user_id}")
def get_user_assignments(
    user_id: str,
    db: Session = Depends(get_db),
) -> list[dict]:
    return db_service.get_assignments(db, user_id)
