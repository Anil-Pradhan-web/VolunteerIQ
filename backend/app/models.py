from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "volunteeriq-api"


class SurveyUploadResponse(BaseModel):
    survey_id: str
    file_name: str
    extracted_preview: str
    status: str = "received"


class TaskCreate(BaseModel):
    ngo_id: str = Field(..., alias="ngoId")
    title: str
    description: str
    required_skills: list[str] = Field(default_factory=list, alias="requiredSkills")
    location: str
    deadline: datetime | None = None
    status: Literal["open", "assigned", "completed"] = "open"

    model_config = {"populate_by_name": True}


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    required_skills: list[str] | None = Field(default=None, alias="requiredSkills")
    location: str | None = None
    status: Literal["open", "assigned", "completed"] | None = None
    deadline: datetime | None = None

    model_config = {"populate_by_name": True, "extra": "ignore"}


class VolunteerProfile(BaseModel):
    name: str
    email: str | None = None
    role: Literal["volunteer", "ngo_admin"] = "volunteer"
    skills: list[str] = Field(default_factory=list)
    availability: list[str] = Field(default_factory=list)
    location: str


class MatchRequest(BaseModel):
    task: dict
    volunteers: list[dict]
    provider: Literal["gemini", "groq"] = "gemini"


class AssignmentResponse(BaseModel):
    volunteer_id: str
    match_score: int
    match_reason: str
