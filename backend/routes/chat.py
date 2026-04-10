"""
Chat route — Gemini-powered Q&A about NGO data.

POST /api/chat  →  { question, ngo_id }  →  { answer }
Fetches the NGO's surveys, tasks, and volunteer count from the DB,
builds a context string, and forwards it to Gemini for a concise answer.
"""

import logging

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from typing import Literal

from app.database import get_db
from app.db_models import Survey, Task, User
from services.gemini import gemini_service
from services.groq_service import groq_service

logger = logging.getLogger("volunteeriq.chat")

router = APIRouter(prefix="/api/chat", tags=["chat"])


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    ngo_id: str = "default-ngo"
    provider: Literal["gemini", "groq"] = "gemini"


class ChatResponse(BaseModel):
    answer: str


def _build_ngo_context(db: Session, ngo_id: str) -> str:
    """Build a context string from the NGO's data in the DB."""
    parts: list[str] = []

    # ── Volunteers ──
    volunteer_count = db.query(User).filter(User.role == "volunteer").count()
    volunteers = db.query(User).filter(User.role == "volunteer").limit(20).all()
    parts.append(f"Total Volunteers: {volunteer_count}")
    if volunteers:
        vol_lines = []
        for v in volunteers:
            skills = ", ".join(v.skills) if v.skills else "None listed"
            avail = ", ".join(v.availability) if v.availability else "Not specified"
            vol_lines.append(
                f"  - {v.name} | Skills: {skills} | Availability: {avail} | Location: {v.location or 'N/A'}"
            )
        parts.append("Volunteer Details:\n" + "\n".join(vol_lines))

    # ── Tasks ──
    tasks = db.query(Task).filter(Task.ngo_id == ngo_id).all()
    open_count = sum(1 for t in tasks if t.status == "open")
    assigned_count = sum(1 for t in tasks if t.status == "assigned")
    completed_count = sum(1 for t in tasks if t.status == "completed")
    parts.append(
        f"Tasks — Open: {open_count}, Assigned: {assigned_count}, Completed: {completed_count}, Total: {len(tasks)}"
    )
    if tasks:
        task_lines = []
        for t in tasks[:15]:
            skills = ", ".join(t.required_skills) if t.required_skills else "General"
            task_lines.append(
                f"  - [{t.status.upper()}] {t.title} | Skills: {skills} | Location: {t.location or 'N/A'}"
            )
        parts.append("Task Details:\n" + "\n".join(task_lines))

    # ── Surveys / Community Problems ──
    surveys = (
        db.query(Survey)
        .filter(Survey.ngo_id == ngo_id)
        .order_by(Survey.created_at.desc())
        .limit(3)
        .all()
    )
    if surveys:
        parts.append(f"Recent Surveys Uploaded: {len(surveys)}")
        for s in surveys:
            parts.append(f"  Survey: {s.file_name}")
            if s.analysis_result:
                problems = s.analysis_result.get("topProblems", [])
                if problems:
                    parts.append(f"    Top Problems: {', '.join(problems)}")
                summary = s.analysis_result.get("summary", "")
                if summary:
                    parts.append(f"    Summary: {summary[:300]}")
                actions = s.analysis_result.get("recommendedActions", [])
                if actions:
                    parts.append(f"    Recommended Actions: {', '.join(actions)}")

    return "\n".join(parts)


@router.post("", response_model=ChatResponse)
def chat(req: ChatRequest, db: Session = Depends(get_db)) -> ChatResponse:
    """Ask Gemini or Groq a question about the NGO's data."""
    question = req.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    try:
        context = _build_ngo_context(db, req.ngo_id)
    except Exception as e:
        logger.error(f"Failed to build NGO context: {e}")
        return ChatResponse(
            answer="I'm having trouble accessing the data right now. Please try again in a moment."
        )

    try:
        if req.provider == "groq":
            answer = groq_service.chat(question, context)
        else:
            answer = gemini_service.chat(question, context)
    except Exception as e:
        logger.error(f"Chat AI error ({req.provider}): {e}")
        answer = "I'm sorry, I'm experiencing a temporary issue. Please try again in a few seconds."

    logger.info(f"Chat answered (provider: {req.provider}): {question[:50]}...")
    return ChatResponse(answer=answer)
