"""Auth route — verify Firebase token and save/fetch user from DB."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from services.auth import get_current_user
from services import db_service

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/verify")
async def verify_token(
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """
    Frontend calls after Google login:
    1. Verify Firebase ID token
    2. Create user in DB on first login
    3. Return user profile
    """
    uid = user.get("uid", "")
    email = user.get("email", "")
    name = user.get("name", user.get("display_name", ""))

    existing = db_service.get_user(db, uid)
    if existing:
        return {"status": "ok", "user": existing}

    # First login — create profile
    new_user = db_service.save_user(db, {
        "id": uid,
        "name": name or "New User",
        "email": email,
        "role": "volunteer",
        "skills": [],
        "availability": [],
        "location": "",
    })
    return {"status": "ok", "user": new_user, "firstLogin": True}
