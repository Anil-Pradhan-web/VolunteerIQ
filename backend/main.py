"""
VolunteerIQ API — Production-ready FastAPI backend.

Features:
  - Global exception handling with structured error responses
  - Request logging middleware for observability
  - CORS with configurable origins
  - Health check endpoints
  - File upload size limits (10 MB)
"""

import logging
import time
import traceback
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import engine
from app.db_models import Base
from app.models import HealthResponse
from routes.assignments import router as assignments_router
from routes.auth import router as auth_router
from routes.chat import router as chat_router
from routes.dashboard import router as dashboard_router
from routes.match import router as match_router
from routes.tasks import router as tasks_router
from routes.upload import router as upload_router
from routes.volunteers import router as volunteers_router

# ── Logging ────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("volunteeriq")


# ── Lifespan ───────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create DB tables on startup."""
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables created / verified")
    logger.info(f"🌍 Environment: {settings.app_env}")
    logger.info(f"🔗 CORS origins: {settings.cors_origins}")
    yield
    logger.info("🛑 Application shutting down")


# ── App ────────────────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="Production backend for VolunteerIQ — AI-powered NGO volunteer coordination.",
    lifespan=lifespan,
)

# ── CORS Middleware ────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request Logging Middleware ─────────────────────────────────────────────
@app.middleware("http")
async def request_logging_middleware(request: Request, call_next):
    """Log every request with timing for observability."""
    start = time.time()
    response = await call_next(request)
    duration_ms = (time.time() - start) * 1000

    # Only log non-health-check requests at INFO level
    path = request.url.path
    if path not in ("/", "/health"):
        logger.info(
            f"{request.method} {path} → {response.status_code} ({duration_ms:.0f}ms)"
        )

    return response


# ── Global Exception Handler ──────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch unhandled exceptions and return structured JSON error."""
    logger.error(
        f"Unhandled exception on {request.method} {request.url.path}: {exc}",
        exc_info=True,
    )
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_server_error",
            "message": "An unexpected error occurred. Please try again later.",
            "detail": str(exc) if settings.app_env == "development" else None,
        },
    )


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    """Handle value errors as 400 Bad Request."""
    return JSONResponse(
        status_code=400,
        content={
            "error": "bad_request",
            "message": str(exc),
        },
    )


# ── Health Checks ──────────────────────────────────────────────────────────
@app.get("/", response_model=HealthResponse)
def root() -> HealthResponse:
    return HealthResponse()


@app.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    return HealthResponse()


# ── Route Registration ────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(upload_router)
app.include_router(tasks_router)
app.include_router(volunteers_router)
app.include_router(match_router)
app.include_router(dashboard_router)
app.include_router(assignments_router)
app.include_router(chat_router)
