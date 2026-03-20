# VolunteerIQ

VolunteerIQ is an AI-powered volunteer coordination platform for NGOs working on disaster relief,
education, and community support. Day 1 is now scaffolded with a Next.js frontend foundation,
FastAPI backend structure, rough screen wireframes, and a local branch workflow.

## Day 1 Status

- Frontend App Router structure is ready in [frontend](/c:/Users/ANIL/Desktop/VOLUNTEER%20IQ/frontend)
- Tailwind and shadcn-style component setup is prepared in [frontend/package.json](/c:/Users/ANIL/Desktop/VOLUNTEER%20IQ/frontend/package.json)
- FastAPI routes and services are scaffolded in [backend](/c:/Users/ANIL/Desktop/VOLUNTEER%20IQ/backend)
- Rough wireframes live in [docs/day1-wireframes.md](/c:/Users/ANIL/Desktop/VOLUNTEER%20IQ/docs/day1-wireframes.md)
- Branch workflow notes live in [docs/day1-branch-strategy.md](/c:/Users/ANIL/Desktop/VOLUNTEER%20IQ/docs/day1-branch-strategy.md)

## Quick Start

Frontend:

```powershell
cd frontend
cmd /c npm install
cmd /c npm run dev
```

Backend:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python -m uvicorn main:app --reload
```
