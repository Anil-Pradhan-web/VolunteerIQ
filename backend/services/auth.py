"""
Auth middleware — verifies Firebase ID tokens from the frontend.

Uses Firebase Admin SDK ONLY for token verification (free tier, no billing).
In DEV mode (no Admin SDK), decodes the JWT payload without verification
so the real user UID/email/name from Google login still flows through.

Usage:
    from services.auth import get_current_user

    @router.get("/protected")
    def protected(user: dict = Depends(get_current_user)):
        return {"uid": user["uid"]}
"""

import base64
import json
import os

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.config import settings

_bearer_scheme = HTTPBearer(auto_error=False)

# Try to initialise Firebase Admin SDK for token verification only
_firebase_auth = None

try:
    import firebase_admin
    from firebase_admin import auth as fb_auth, credentials

    project_id = os.getenv("FIREBASE_PROJECT_ID", "")
    client_email = os.getenv("FIREBASE_CLIENT_EMAIL", "")
    private_key = os.getenv("FIREBASE_PRIVATE_KEY", "")

    if project_id and client_email and private_key and not firebase_admin._apps:
        cred = credentials.Certificate(
            {
                "type": "service_account",
                "project_id": project_id,
                "client_email": client_email,
                "private_key": private_key.replace("\\n", "\n"),
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        )
        firebase_admin.initialize_app(cred)
        _firebase_auth = fb_auth
        print("✅ Firebase Auth initialised (token verification ready)")
    else:
        print("⚠️  Firebase service account incomplete — auth runs in DEV mode")
        print("   Tokens will be decoded (not verified) — okay for local dev")

except Exception as exc:
    print(f"⚠️  Firebase Admin SDK init failed: {exc}")
    print("   Auth will run in DEV mode (tokens decoded, not verified)")


def _decode_jwt_unverified(token: str) -> dict:
    """
    Decode a Firebase ID token WITHOUT verification.
    Used in DEV mode to extract real user info from Google login.
    NOT safe for production — use Firebase Admin SDK for that.
    """
    try:
        # JWT = header.payload.signature — we only need the payload
        parts = token.split(".")
        if len(parts) != 3:
            return {}

        # Base64url decode the payload (part 2)
        payload = parts[1]
        # Add padding if needed
        padding = 4 - len(payload) % 4
        if padding != 4:
            payload += "=" * padding

        decoded_bytes = base64.urlsafe_b64decode(payload)
        data = json.loads(decoded_bytes)

        return {
            "uid": data.get("user_id") or data.get("sub", ""),
            "email": data.get("email", ""),
            "name": data.get("name", ""),
            "picture": data.get("picture", ""),
        }
    except Exception:
        return {}


async def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> dict:
    """
    FastAPI dependency — extracts and verifies a Firebase ID token.
    Returns decoded token dict {uid, email, name, ...}.
    """
    # Production mode — verify token with Firebase Admin SDK
    if _firebase_auth is not None:
        if creds is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing Authorization header",
            )
        token = creds.credentials
        try:
            decoded = _firebase_auth.verify_id_token(token)
            return decoded
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token: {exc}",
            )

    if settings.is_production:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication is not configured on the server.",
        )

    # DEV mode — decode token without verification
    if creds and creds.credentials:
        decoded = _decode_jwt_unverified(creds.credentials)
        if decoded.get("uid"):
            return decoded

    # No token at all — fallback dev user (for API testing without frontend)
    return {"uid": "dev-user", "email": "dev@localhost", "name": "Dev User"}
