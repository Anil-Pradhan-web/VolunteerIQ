from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.models import HealthResponse
from routes.dashboard import router as dashboard_router
from routes.match import router as match_router
from routes.tasks import router as tasks_router
from routes.upload import router as upload_router
from routes.volunteers import router as volunteers_router

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="FastAPI backend for VolunteerIQ day 1 foundation.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=HealthResponse)
def root() -> HealthResponse:
    return HealthResponse()


@app.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    return HealthResponse()


app.include_router(upload_router)
app.include_router(tasks_router)
app.include_router(volunteers_router)
app.include_router(match_router)
app.include_router(dashboard_router)
