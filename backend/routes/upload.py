"""
Survey upload route — receive file, save locally, extract text,
run Gemini analysis, save results to DB.

Production hardening:
  - File size validation
  - Content type whitelisting
  - Structured error responses
"""

import logging
import os
import uuid

from fastapi import APIRouter, Depends, HTTPException, UploadFile, Query
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from services import db_service
from services.gemini import gemini_service

logger = logging.getLogger("volunteeriq.upload")

router = APIRouter(prefix="/api", tags=["upload"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {"pdf", "csv", "docx", "doc", "txt"}


def _get_extension(filename: str) -> str:
    """Extract file extension safely."""
    return filename.lower().rsplit(".", 1)[-1] if "." in filename else ""


def _extract_text(file_path: str, file_name: str) -> str:
    """Extract text from PDF, CSV, or DOCX files."""
    ext = _get_extension(file_name)

    if ext == "pdf":
        try:
            import pdfplumber

            text_parts = []
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
            return "\n".join(text_parts)
        except Exception as e:
            logger.error(f"PDF extraction failed for {file_name}: {e}")
            return f"[PDF extraction error: {e}]"

    elif ext == "csv":
        try:
            import pandas as pd

            df = pd.read_csv(file_path)
            return df.to_string(index=False, max_rows=200)
        except Exception as e:
            logger.error(f"CSV extraction failed for {file_name}: {e}")
            return f"[CSV extraction error: {e}]"

    elif ext in ("docx", "doc"):
        try:
            from docx import Document

            doc = Document(file_path)
            return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
        except Exception as e:
            logger.error(f"DOCX extraction failed for {file_name}: {e}")
            return f"[DOCX extraction error: {e}]"

    elif ext == "txt":
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    return f"[Unsupported file type: {ext}]"


@router.post("/upload-survey")
async def upload_survey(
    file: UploadFile,
    ngo_id: str = Query(default="default-ngo", alias="ngoId"),
    ai_provider: str = Query(default="gemini", alias="provider"),
    db: Session = Depends(get_db),
) -> dict:
    """Upload a survey file, extract text, analyze with chosen AI, save to DB."""

    # ── Validate file type ──
    filename = file.filename or "unknown.txt"
    ext = _get_extension(filename)
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: .{ext}. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # ── Read and validate file size ──
    content = await file.read()
    max_bytes = settings.max_upload_bytes
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({len(content) / (1024*1024):.1f} MB). Maximum: {settings.max_upload_size_mb} MB.",
        )

    if len(content) == 0:
        raise HTTPException(
            status_code=400,
            detail="Empty file uploaded. Please select a valid survey file.",
        )

    # ── Save file locally ──
    file_id = str(uuid.uuid4())[:8]
    safe_name = f"{file_id}_{filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_name)

    try:
        with open(file_path, "wb") as f:
            f.write(content)
    except OSError as e:
        logger.error(f"Failed to save file {safe_name}: {e}")
        raise HTTPException(status_code=500, detail="Failed to save uploaded file.")

    # ── Extract text ──
    extracted_text = _extract_text(file_path, filename)

    if not extracted_text or extracted_text.startswith("["):
        logger.warning(f"Text extraction produced no usable content for {filename}")

    # ── Run AI analysis ──
    analysis = None
    if extracted_text and not extracted_text.startswith("["):
        try:
            if ai_provider == "groq":
                from services.groq_service import groq_service
                analysis = groq_service.analyze_survey(extracted_text)
            else:
                analysis = gemini_service.analyze_survey(extracted_text)
        except Exception as e:
            logger.error(f"AI analysis failed for {filename}: {e}")
            analysis = {
                "topProblems": ["AI analysis temporarily unavailable"],
                "summary": f"The survey was uploaded but AI analysis encountered an error: {str(e)[:100]}",
                "urgencyScores": {},
                "recommendedActions": ["Retry the analysis once the AI service is available"],
                "recommendedTasks": [],
                "totalResponses": 0,
            }

    # ── Save to DB ──
    try:
        survey = db_service.save_survey(db, {
            "ngoId": ngo_id,
            "fileName": filename,
            "filePath": file_path,
            "uploadedBy": "",
            "extractedText": extracted_text,
            "analysisResult": analysis,
        })
    except Exception as e:
        logger.error(f"Failed to save survey to database: {e}")
        raise HTTPException(status_code=500, detail="Failed to save survey data.")

    logger.info(f"✅ Survey uploaded: {filename} (provider: {ai_provider})")

    return {
        "status": "ok",
        "survey": survey,
        "analysis": analysis,
        "extractedPreview": extracted_text[:500] if extracted_text else "",
    }


@router.get("/surveys/{ngo_id}")
def get_surveys(ngo_id: str, db: Session = Depends(get_db)) -> list[dict]:
    """Return all surveys for an NGO."""
    return db_service.get_surveys(db, ngo_id)


@router.get("/surveys/{ngo_id}/{survey_id}")
def get_survey_detail(ngo_id: str, survey_id: int, db: Session = Depends(get_db)) -> dict:
    """Return a single survey with full analysis."""
    from app.db_models import Survey

    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")

    return {
        "id": str(survey.id),
        "ngoId": survey.ngo_id,
        "fileName": survey.file_name,
        "extractedText": survey.extracted_text,
        "analysisResult": survey.analysis_result,
        "createdAt": survey.created_at.isoformat() if survey.created_at else "",
    }
