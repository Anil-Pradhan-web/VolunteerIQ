"""
Firebase service — DEPRECATED.

Firebase is now used ONLY for Google Authentication (token verification).
All database operations have moved to services/db_service.py (SQLAlchemy).

This file is kept for backward compatibility only.
"""

# All Firebase Firestore operations have been replaced with SQLAlchemy.
# See: services/db_service.py
# See: services/auth.py (for Firebase token verification)
