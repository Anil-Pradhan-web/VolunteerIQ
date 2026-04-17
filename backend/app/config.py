"""
VolunteerIQ application settings.

Reads from environment variables with sensible defaults.
Supports development and production modes.
"""

from dataclasses import dataclass, field
import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

DEFAULT_UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"


def _normalize_database_url(database_url: str) -> str:
    if database_url.startswith("postgres://"):
        return database_url.replace("postgres://", "postgresql://", 1)
    return database_url


@dataclass
class Settings:
    app_name: str = os.getenv("APP_NAME", "VolunteerIQ API")
    app_env: str = os.getenv("APP_ENV", "development").strip().lower()
    app_host: str = os.getenv("APP_HOST", "0.0.0.0")
    app_port: int = int(os.getenv("PORT", os.getenv("APP_PORT", "8000")))
    cors_origins: list[str] = None
    cors_origin_regex: str | None = None
    frontend_url: str = os.getenv("FRONTEND_URL", "").strip()
    firebase_project_id: str = os.getenv("FIREBASE_PROJECT_ID", "")
    firebase_client_email: str = os.getenv("FIREBASE_CLIENT_EMAIL", "")
    firebase_private_key: str = os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_model: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    max_upload_size_mb: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", "10"))
    database_url: str = _normalize_database_url(
        os.getenv("DATABASE_URL", "sqlite:///./volunteeriq.db").strip()
    )
    upload_dir: str = os.getenv("UPLOAD_DIR", str(DEFAULT_UPLOAD_DIR))

    def __post_init__(self) -> None:
        configured_origins = os.getenv("CORS_ORIGINS", "").strip()
        default_origins = (
            ["http://localhost:3000", "http://127.0.0.1:3000"]
            if self.app_env == "development"
            else []
        )
        self.cors_origins = [
            origin.strip()
            for origin in configured_origins.split(",")
            if origin.strip()
        ] or default_origins
        if self.frontend_url and self.frontend_url not in self.cors_origins:
            self.cors_origins.append(self.frontend_url.rstrip("/"))

        regex = os.getenv("CORS_ORIGIN_REGEX", "").strip()
        self.cors_origin_regex = regex or None

        self.upload_dir = str(Path(self.upload_dir).expanduser().resolve())
        os.makedirs(self.upload_dir, exist_ok=True)

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @property
    def max_upload_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024


settings = Settings()
