@echo off
title VolunteerIQ Launcher
color 0A

echo ==========================================
echo     🚀 Starting VolunteerIQ Servers...
echo ==========================================

:: Build and Start Backend
echo.
echo [1/2] Starting FastAPI Backend...
start "VolunteerIQ Backend" cmd /k "cd backend && call .venv\Scripts\activate && uvicorn main:app --reload"

:: Start Frontend
echo.
echo [2/2] Starting Next.js Frontend...
start "VolunteerIQ Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ==========================================
echo ✅ Both servers running in separate windows!
echo 🌐 Frontend: http://localhost:3000
echo ⚙️  Backend Docs: http://127.0.0.1:8000/docs
echo ==========================================
echo You can close this particular window now.
pause
