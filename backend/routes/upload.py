from fastapi import APIRouter, UploadFile

from app.models import SurveyUploadResponse

router = APIRouter(prefix="/api", tags=["upload"])


@router.post("/upload-survey", response_model=SurveyUploadResponse)
async def upload_survey(file: UploadFile) -> SurveyUploadResponse:
    preview = (
        f"Received {file.filename}. Storage upload and extraction will be connected next."
    )
    return SurveyUploadResponse(
        survey_id="survey-demo-1",
        file_name=file.filename,
        extracted_preview=preview,
    )
