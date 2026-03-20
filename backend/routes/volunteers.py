from fastapi import APIRouter, Query

from app.models import VolunteerProfile
from services.firebase import firebase_service

router = APIRouter(prefix="/api/volunteers", tags=["volunteers"])


@router.post("")
def create_volunteer(volunteer: VolunteerProfile) -> dict:
    return firebase_service.save_user(volunteer)


@router.get("")
def list_volunteers(
    skill: str | None = Query(default=None),
    location: str | None = Query(default=None),
) -> list[dict]:
    volunteers = firebase_service.list_volunteers()

    if skill:
        volunteers = [item for item in volunteers if skill in item["skills"]]

    if location:
        volunteers = [item for item in volunteers if item["location"] == location]

    return volunteers


@router.get("/{volunteer_id}")
def get_volunteer(volunteer_id: str) -> dict:
    return firebase_service.get_user(volunteer_id)
