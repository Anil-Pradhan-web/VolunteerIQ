from fastapi import APIRouter

from app.models import MatchRequest
from services.gemini import gemini_service
from services.groq_service import groq_service

router = APIRouter(prefix="/api", tags=["matching"])


@router.post("/match-volunteers")
def match_volunteers(payload: MatchRequest) -> list[dict]:
    if payload.provider == "groq":
        return groq_service.match_volunteers(payload.task, payload.volunteers)
    return gemini_service.match_volunteers(payload.task, payload.volunteers)
