from dataclasses import dataclass
import os

from dotenv import load_dotenv

load_dotenv()


@dataclass
class Settings:
    app_name: str = os.getenv("APP_NAME", "VolunteerIQ API")
    app_env: str = os.getenv("APP_ENV", "development")
    app_host: str = os.getenv("APP_HOST", "127.0.0.1")
    app_port: int = int(os.getenv("APP_PORT", "8000"))
    cors_origins: list[str] = None
    firebase_project_id: str = os.getenv("FIREBASE_PROJECT_ID", "")
    firebase_client_email: str = os.getenv("FIREBASE_CLIENT_EMAIL", "")
    firebase_private_key: str = os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_model: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    def __post_init__(self) -> None:
        origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
        self.cors_origins = [origin.strip() for origin in origins.split(",") if origin.strip()]


settings = Settings()
