from fastapi import APIRouter

from app.models import MatchRequest
from services.gemini import gemini_service

router = APIRouter(prefix="/api", tags=["matching"])


@router.post("/match-volunteers")
def match_volunteers(payload: MatchRequest) -> list[dict]:
    return gemini_service.match_volunteers(payload.task, payload.volunteers)
