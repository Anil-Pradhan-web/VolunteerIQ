from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

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
    try:
        return db_service.assign_volunteer(db, payload.task_id, payload.volunteer_id)
    except IntegrityError:
        raise HTTPException(status_code=404, detail="Task or Volunteer not found")


@router.post("/unassign")
def unassign_volunteer(
    payload: AssignRequest,
    db: Session = Depends(get_db),
) -> dict:
    try:
        success = db_service.unassign_volunteer(db, payload.task_id, payload.volunteer_id)
        if not success:
            raise HTTPException(status_code=404, detail="Assignment not found")
        return {"status": "ok", "success": success}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/assignments/{user_id}")
def get_user_assignments(
    user_id: str,
    db: Session = Depends(get_db),
) -> list[dict]:
    return db_service.get_assignments(db, user_id)
