from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import VolunteerProfile
from services import db_service

router = APIRouter(prefix="/api/volunteers", tags=["volunteers"])


@router.post("")
def create_volunteer(
    volunteer: VolunteerProfile,
    db: Session = Depends(get_db),
) -> dict:
    import uuid

    user_data = volunteer.model_dump()
    user_data["id"] = user_data.get("id") or str(uuid.uuid4())
    return db_service.save_user(db, user_data)


@router.get("")
def list_volunteers(
    skill: str | None = Query(default=None),
    location: str | None = Query(default=None),
    db: Session = Depends(get_db),
) -> list[dict]:
    volunteers = db_service.list_volunteers(db)

    if skill:
        volunteers = [v for v in volunteers if skill in v.get("skills", [])]
    if location:
        volunteers = [v for v in volunteers if v.get("location") == location]

    return volunteers


@router.get("/{volunteer_id}")
def get_volunteer(volunteer_id: str, db: Session = Depends(get_db)) -> dict:
    user = db_service.get_user(db, volunteer_id)
    if not user:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    return user


@router.put("/{volunteer_id}")
def update_volunteer(
    volunteer_id: str,
    payload: VolunteerProfile,
    db: Session = Depends(get_db),
) -> dict:
    updated = db_service.update_user(db, volunteer_id, payload.model_dump())
    if not updated:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    return updated
