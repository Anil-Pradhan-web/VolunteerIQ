"""Match route — AI-powered volunteer matching with error handling."""

import logging

from fastapi import APIRouter, HTTPException

from app.models import MatchRequest
from services.gemini import gemini_service
from services.groq_service import groq_service

logger = logging.getLogger("volunteeriq.match")

router = APIRouter(prefix="/api", tags=["matching"])


@router.post("/match-volunteers")
def match_volunteers(payload: MatchRequest) -> list[dict]:
    """Rank volunteers for a task using AI (Gemini or Groq)."""
    if not payload.volunteers:
        return []

    if not payload.task or not payload.task.get("title"):
        raise HTTPException(
            status_code=400,
            detail="Task must include at least a title for matching.",
        )

    try:
        if payload.provider == "groq":
            results = groq_service.match_volunteers(payload.task, payload.volunteers)
        else:
            results = gemini_service.match_volunteers(payload.task, payload.volunteers)

        logger.info(
            f"Matched {len(results)} volunteers for task '{payload.task.get('title')}' (provider: {payload.provider})"
        )
        return results

    except Exception as e:
        logger.error(f"Volunteer matching failed: {e}")
        raise HTTPException(
            status_code=502,
            detail=f"AI matching service temporarily unavailable: {str(e)[:100]}",
        )
