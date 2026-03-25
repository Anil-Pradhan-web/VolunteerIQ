# 🚀 ClutchCode — Execution Plan
## Solution Challenge 2026 | Smart Resource Allocation | Volunteer Coordination for Social Impact

---

## 📋 Project Overview

**Project Name:** VolunteerIQ  
**Team:** ClutchCode (3 Developers)  
**Challenge:** Smart Resource Allocation — Data-Driven Volunteer Coordination for Social Impact  
**Deadline:** 24th April 2026  
**Start Date:** 21st March 2026  
**Roadmap Duration:** 15 Days (MVP Ready by Day 15)

### Problem
NGOs and local social groups collect community data through paper surveys and field reports. This data is scattered, making it hard to identify biggest problems and match the right volunteers to the right tasks efficiently.

### Solution
An AI-powered volunteer coordination platform where:
- NGO admins upload community data (surveys, reports)
- Gemini AI analyzes needs and identifies priority problem areas
- Platform intelligently matches volunteers to tasks based on skills, availability, location
- Dashboard shows real-time volunteer deployment and community impact

---

## 👥 Team Roles

| Developer | Role | Primary Responsibilities |
|-----------|------|--------------------------|
| **Dev 1** | Full-Stack Lead | Project architecture, Next.js pages, FastAPI routes, integration, deployment |
| **Dev 2** | Frontend Developer | UI components, dashboard, forms, Tailwind styling, shadcn/ui |
| **Dev 3** | Backend + AI | FastAPI services, Gemini API integration, Firebase operations, data processing |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS + shadcn/ui |
| Backend | FastAPI (Python) |
| AI | Google Gemini 1.5 Pro API |
| Database | **SQLite + SQLAlchemy** (dev) → PostgreSQL (production) |
| File Storage | **Backend local storage** (uploads saved on server) |
| Authentication | Firebase Auth (Google Login) — **free tier, no billing** |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

> ⚠️ **Architecture Change (Day 2):** Firebase Firestore and Storage were replaced because they require billing. Now using SQLite (zero-config) for local dev, with SQLAlchemy ORM that can swap to PostgreSQL by changing one env var. Firebase is used **only** for Google Authentication (free tier).

---

## 🗂️ Feature List

### P0 — Must Have (Core MVP)
- [x] Google Login (Firebase Auth) ✅
- [x] Volunteer registration with skills + availability + location ✅
- [ ] NGO admin dashboard
- [ ] Community data upload (CSV/PDF surveys)
- [ ] Gemini AI — analyze uploaded data, identify top 3 problem areas
- [ ] Volunteer-task smart matching (Gemini powered)
- [ ] Task creation by NGO admin
- [ ] Task assignment to volunteers
- [ ] Basic dashboard — active tasks, volunteers deployed, problems identified

### P1 — Should Have
- [x] Volunteer profile page ✅
- [ ] Task status tracking (Pending / In Progress / Completed)
- [ ] Gemini chat — ask questions about community data
- [ ] Email/notification on task assignment
- [ ] Impact metrics — how many people helped, tasks completed

### P2 — Nice to Have
- [ ] Map view of volunteer locations vs task locations
- [ ] Export impact report as PDF
- [ ] Multi-NGO support

---

## 🗄️ Database Schema (SQLAlchemy ORM → SQLite / PostgreSQL)

```python
# app/db_models.py

class User(Base):                        # Table: users
    id: str (PK)                         # Firebase UID or UUID
    name: str
    email: str | None
    role: "volunteer" | "ngo_admin"
    skills: JSON list                    # ["Medical", "Teaching", "Driving"]
    availability: JSON list              # ["Weekdays", "Weekends", "Mornings"]
    location: str                        # "Bhubaneswar, Odisha"
    created_at: datetime

class Task(Base):                        # Table: tasks
    id: int (PK, auto)
    ngo_id: str
    title: str
    description: text
    required_skills: JSON list
    location: str
    deadline: datetime | None
    status: "open" | "assigned" | "completed"
    assigned_to: JSON list               # volunteer IDs
    created_at: datetime

class Assignment(Base):                  # Table: assignments
    id: int (PK, auto)
    task_id: FK → tasks.id
    volunteer_id: FK → users.id
    assigned_at: datetime
    status: "active" | "completed"

class Survey(Base):                      # Table: surveys
    id: int (PK, auto)
    ngo_id: str
    file_name: str
    file_path: str                       # Local server path
    uploaded_by: str
    extracted_text: text
    analysis_result: JSON | None         # Gemini output
    created_at: datetime
```

---

## 🔌 API Endpoints (FastAPI) — ✅ All Implemented

```
# Auth (Firebase token verification)
POST   /api/auth/verify             → Verify Firebase token, create/fetch user in DB ✅

# Surveys
POST   /api/upload-survey           → Upload CSV/PDF, extract text, save to local storage ✅ (stub)
GET    /api/surveys/{ngoId}         → Get all surveys for an NGO
GET    /api/analyze/{surveyId}      → Get Gemini analysis for a survey

# Tasks
POST   /api/tasks                   → Create a new task ✅
GET    /api/tasks?ngoId=X           → Get all tasks (optional NGO filter) ✅
GET    /api/tasks/{taskId}          → Get single task ✅
PUT    /api/tasks/{taskId}          → Update task status ✅

# Volunteers
POST   /api/volunteers              → Create volunteer profile ✅
GET    /api/volunteers?skill=X      → List volunteers (with filters) ✅
GET    /api/volunteers/{id}         → Get single volunteer ✅
PUT    /api/volunteers/{id}         → Update volunteer profile ✅

# Matching
POST   /api/match-volunteers        → Gemini powered matching ✅ (stub)

# Assignments
POST   /api/assign                  → Assign volunteer to task ✅
GET    /api/assignments/{userId}    → Get volunteer's assignments ✅

# Dashboard
GET    /api/dashboard/{ngoId}       → Dashboard stats ✅

# Health
GET    /                            → Health check ✅
GET    /health                      → Health check ✅
```

---

## 📅 15-Day Sprint Plan

---

### 📦 PHASE 1: Foundation (Days 1–3)
**Goal:** Project setup, auth working, basic structure ready

---

#### Day 1 — Project Setup & Architecture (✅ COMPLETED)

**Dev 1 (Lead):**
- [x] Create GitHub repo `volunteeriq`
- [x] Setup branch strategy: `main` → `dev` → `feature/xxx`
- [x] Create Next.js 14 project with App Router
- [x] Setup Tailwind CSS + shadcn/ui
- [x] Create folder structure:
  ```
  /app
    /dashboard
    /volunteers
    /tasks
    /upload
  /components
  /lib
    firebase.ts
    gemini.ts
  ```
- [x] Push base project to GitHub

**Dev 2 (Frontend):**
- [x] Setup Figma/rough wireframes for 4 main screens (Redesigned UI applied directly to code)
- [x] Install shadcn/ui components needed: Button, Card, Table, Badge, Input, Dialog
- [x] Create base layout component (Sidebar + Header) (Fully redesigned with Light Mode UI)
- [x] Design gorgeous high-conversion Landing Page
- [x] Create premium abstract NGO Logo

**Dev 3 (Backend):**
- [x] Create FastAPI project structure:
  ```
  /routes
    upload.py
    tasks.py
    volunteers.py
    match.py
    dashboard.py
  /services
    gemini.py
    groq_service.py
    firebase.py
  main.py
  requirements.txt
  .env
  ```
- [x] Setup virtual environment
- [x] Install: `fastapi uvicorn python-dotenv firebase-admin google-generativeai groq pdfplumber python-multipart pandas`
- [x] Test FastAPI running locally (Added `start.bat` for quick launch)

---

#### Day 2 — Auth + Database Setup + Google Login (✅ COMPLETED)

> ⚠️ **Architecture Change:** Firebase billing was required for Firestore/Storage, so we switched to:
> - **Database:** SQLite + SQLAlchemy (zero config dev, swap to PostgreSQL for production)
> - **Storage:** Backend local file storage
> - **Firebase:** Used ONLY for Google Authentication (free tier)

**Dev 1 (Lead):**
- [x] Created Firebase project `volenteeriq` on console.firebase.google.com
- [x] Enabled Authentication → Google provider (free tier, no billing needed)
- [x] Added Firebase config to Next.js `.env.local` (all 6 config values)
- [x] Created `lib/firebase.ts` with full Firebase SDK init + Auth exports
- [x] Created `lib/auth-context.tsx` — AuthProvider + `useAuth()` hook
- [x] Implemented Google Login page (`/login`) — beautiful split-screen UI
- [x] Created `components/auth/protected-route.tsx` — redirect to login if not auth
- [x] Created `POST /api/auth/verify` route — verifies Firebase token + creates user in DB

**Dev 2 (Frontend):**
- [x] Built Login page UI — clean, professional split-screen with Google Sign-In
- [x] Built post-login redirect flow:
  - If first login → `/onboarding` (role selection)
  - If `role === "ngo_admin"` → `/dashboard`
  - If `role === "volunteer"` → `/dashboard`
- [x] Created role selection screen (`/onboarding`) — Volunteer vs NGO Admin cards
- [x] Built Volunteer Profile page (`/volunteer/profile`) — editable skills, availability, location
- [x] Updated header to show logged-in user name + photo + logout button
- [x] Updated sidebar navigation — added Upload Survey, My Profile links

**Dev 3 (Backend):**
- [x] Created `app/database.py` — SQLAlchemy engine + session (SQLite for dev)
- [x] Created `app/db_models.py` — ORM models: User, Task, Assignment, Survey
- [x] Created `services/db_service.py` — full CRUD for all models:
  - `save_user()` — save user to SQLite DB
  - `get_user()` — fetch user by ID
  - `update_user()` — update user skills/availability/role
  - `list_volunteers()` — list all volunteers with role filter
  - `create_task()`, `get_task()`, `list_tasks()`, `update_task()`
  - `assign_volunteer()`, `get_assignments()`
  - `save_survey()`, `get_surveys()`, `update_survey_analysis()`
  - `get_dashboard_stats()` — aggregated stats from DB
- [x] Created `services/auth.py` — Firebase token verification middleware (free tier)
- [x] Created `routes/auth.py`, `routes/assignments.py` — new endpoints
- [x] Updated all routes to use SQLAlchemy sessions via `Depends(get_db)`
- [x] Tested all API endpoints — all working ✅
- [x] DB tables auto-create on server startup via `lifespan` event

---

#### Day 3 — Volunteer Registration + Profile (✅ PARTIALLY COMPLETED — merged into Day 2)

> **Note:** Most of Day 3 tasks were completed early as part of Day 2.

**Dev 1 (Lead):**
- [x] Connected frontend Google login to DB — saves user on first login via `/api/auth/verify`
- [x] Auth token sent to backend automatically on login
- [x] End-to-end tested: Login → Save to DB → Redirect based on role

**Dev 2 (Frontend):**
- [x] Built Volunteer Profile page (`/volunteer/profile`):
  - Skills: multi-select chips (Medical, Teaching, Driving, Logistics, Cooking, Construction, IT Support, Counseling, Translation, First Aid)
  - Availability: (Weekdays / Weekends / Mornings / Evenings / Full-time)
  - Location input
  - Save button with loading state + success feedback
- [x] Profile page shows user photo, name, email from Google account

**Dev 3 (Backend):**
- [x] `routes/volunteers.py` fully implemented:
  - `POST /api/volunteers` — save volunteer profile ✅
  - `GET /api/volunteers?skill=X&location=Y` — list with filters ✅
  - `GET /api/volunteers/{id}` — get single volunteer ✅
  - `PUT /api/volunteers/{id}` — update profile ✅
- [x] All endpoints tested with curl/Invoke-RestMethod ✅

---

### 📦 PHASE 2: Core AI Features (Days 4–8)
**Goal:** Survey upload + Gemini analysis + Task system working

---

#### Day 4 — Survey Upload System (✅ COMPLETED)

**Dev 1 (Lead):**
- [x] Created `/upload` page in Next.js with full drag & drop UI
- [x] File upload component with file type validation (CSV, PDF, DOCX, TXT)
- [x] Connected to FastAPI `/api/upload-survey` endpoint
- [x] Upload progress + "AI analyzing..." spinner + success/error states

**Dev 2 (Frontend):**
- [x] Built beautiful survey upload UI:
  - Drag & drop zone with visual feedback
  - File type validation + file preview
  - Upload progress + AI analyzing spinner with animated brain icon
  - After analysis → shows result cards (top problems, summary, recommendations)
- [x] Built surveys list in dashboard — shows recent uploaded surveys

**Dev 3 (Backend):**
- [x] Rewrote `routes/upload.py`:
  - `POST /api/upload-survey` — receives file, saves to `backend/uploads/`, extracts text
  - `GET /api/surveys/{ngoId}` — list all surveys
  - `GET /api/surveys/{ngoId}/{surveyId}` — get survey detail with analysis
- [x] Text extraction logic:
  - PDF → pdfplumber ✅
  - CSV → pandas ✅
  - DOCX → python-docx ✅
  - TXT → raw file read ✅
- [x] Survey metadata saved to SQLite DB
- [x] Gemini analysis runs automatically after extraction

---

#### Day 5 — Gemini AI Analysis (✅ COMPLETED)

**Dev 1 (Lead):**
- [x] Connected survey upload to live analysis display
- [x] Analysis results show immediately after upload
- [x] Loading states + error states handled

**Dev 2 (Frontend):**
- [x] Built Analysis Result Card UI:
  - Top 3 Problems with urgency badges (High/Medium/Low) ✅
  - Summary paragraph ✅
  - Recommended action items ✅
  - Total responses analyzed count ✅
- [x] Visually impressive — animated spinner, color-coded urgency, clean cards

**Dev 3 (Backend):**
- [x] Rewrote `services/gemini.py` with real Gemini API integration:
  - `analyze_survey(text)` → calls Gemini 2.0 Flash, returns structured JSON
  - `match_volunteers(task, volunteers)` → AI-powered volunteer ranking
  - `chat(question, context)` → conversational AI over NGO data
  - Robust JSON parsing (handles markdown code blocks in Gemini responses)
  - Graceful fallback stubs when GEMINI_API_KEY not set
- [x] Analysis results saved to SQLite DB
- [x] Model: **Gemini 2.0 Flash** (free tier, no billing needed)

---

#### Day 6 — Task Creation System (✅ COMPLETED — merged into Day 4)

> **Note:** Task system was built alongside upload system on the same day.

**Dev 1 (Lead):**
- [x] Created `/tasks` page with full API integration
- [x] Create Task modal with form
- [x] Connected to FastAPI CRUD endpoints

**Dev 2 (Frontend):**
- [x] Built Task Creation Form (modal):
  - Title, Description ✅
  - Required Skills (multi-select chips) ✅
  - Location ✅
- [x] Built Task List with filters:
  - Filter by status (All/Open/Assigned/Completed) ✅
  - Search by title ✅
  - Status counters (open/assigned/completed) ✅
- [x] Volunteers page rebuilt with real API (search, skill filter, live data)
- [x] Dashboard rebuilt with real API stats (volunteers, tasks, surveys, quick actions)
- [x] **REMOVED NGO ADMIN ROLE**: Entire app is now volunteer-centric. Everyone logs in directly as a Volunteer without role-selection onboarding. All conditional UI and backend typing for admins was completely wiped cleanly.

**Dev 3 (Backend):**
- [x] `routes/tasks.py` fully implemented (done in Day 2):
  - `POST /api/tasks` — create task ✅
  - `GET /api/tasks` — list tasks (with filters) ✅
  - `GET /api/tasks/{id}` — get single task ✅
  - `PUT /api/tasks/{id}` — update status ✅
- [x] All endpoints tested ✅

---

#### Day 7 — Gemini Volunteer Matching (Core AI Feature)

**Dev 1 (Lead):**
- [x] Create "Find Best Volunteers" button on task detail page
- [x] Call `/api/match-volunteers` endpoint
- [x] Display matched volunteers with match score + reason

**Dev 2 (Frontend):**
- [x] Build Volunteer Match Result UI:
  - List of top 5 matched volunteers
  - Match score (e.g., 92% match)
  - Why they match — Gemini explanation
  - "Assign" button next to each volunteer
- [x] Make this the most impressive UI on the platform

**Dev 3 (Backend):**
- [x] Create `routes/match.py`:
  - `POST /api/match-volunteers` — takes task details, returns ranked volunteers
- [x] Create Gemini matching function:
  ```python
  def match_volunteers(task: dict, volunteers: list) -> list:
      prompt = f"""
      You are a smart volunteer coordinator.
      Given this task and list of volunteers, rank the top 5 best matches.
      
      Task: {task}
      Volunteers: {volunteers}
      
      Return JSON array with:
      - volunteer_id
      - match_score (0-100)
      - match_reason (1 sentence why they are a good fit)
      
      Rank by best fit. Return ONLY valid JSON.
      """
      # Call Gemini
      # Return ranked list
  ```
- [x] Test matching with sample data

---

#### Day 8 — Task Assignment + Dashboard Stats

**Dev 1 (Lead):**
- Implement assign volunteer to task flow (end-to-end)
- Create `/dashboard` page with real data from API
- Connect dashboard to FastAPI `/api/dashboard/{ngoId}`

**Dev 2 (Frontend):**
- Build NGO Dashboard UI:
  - Stats cards: Total Volunteers, Active Tasks, Completed Tasks, People Helped
  - Recent surveys uploaded
  - Tasks needing volunteers (urgent ones highlighted)
  - Top problem areas from latest survey
- Build Volunteer Dashboard (different view for volunteers):
  - My assigned tasks
  - Task status
  - My profile summary

**Dev 3 (Backend):**
- Create `GET /api/dashboard/{ngoId}` endpoint:
  ```python
  return {
    "total_volunteers": count,
    "active_tasks": count,
    "completed_tasks": count,
    "open_tasks": count,
    "top_problems": from_latest_survey,
    "recent_surveys": last_3_surveys
  }
  ```
- [x] Create `POST /api/assign` — assign volunteer to task, update DB ✅ (Done in Day 2)
- [x] Create `GET /api/assignments/{userId}` — get volunteer's tasks ✅ (Done in Day 2)

---

### 📦 PHASE 3: Polish + Demo Prep (Days 9–12)
**Goal:** UI polish, bug fixes, demo data, Gemini chat

---

#### Day 9 — Gemini Chat Feature

**Dev 1 (Lead):**
- Create chat UI component — floating chat button on dashboard
- Connect chat to FastAPI `/api/chat` endpoint
- Handle streaming response from Gemini (optional)

**Dev 2 (Frontend):**
- Build chat interface:
  - Clean chat bubble UI
  - Input box at bottom
  - Loading indicator while Gemini thinks
  - Sample questions as quick chips:
    - "What are the top problems in our community?"
    - "Which volunteers are available this weekend?"
    - "How many tasks are pending?"

**Dev 3 (Backend):**
- Create `POST /api/chat` endpoint:
  ```python
  def chat(question: str, ngo_id: str) -> str:
      # Fetch NGO's surveys + tasks + volunteer count from SQLite DB
      # Build context string
      prompt = f"""
      You are an AI assistant for an NGO coordination platform.
      Answer based on this NGO's data only.
      
      Context: {context}
      Question: {question}
      
      Answer helpfully in 2-3 sentences.
      """
      # Call Gemini, return answer
  ```

---

#### Day 10 — Demo Data + UI Polish

**Dev 1 (Lead):**
- Create demo data script — populate SQLite DB with realistic data:
  - NGO: "Odisha Relief Foundation"
  - 10 volunteers with different skills
  - 3 uploaded surveys (flood relief, education gap, health camp)
  - 6 tasks (some assigned, some open, some completed)
- Run script, verify all data looks good on dashboard

**Dev 2 (Frontend):**
- UI polish across all pages:
  - Consistent spacing, colors, typography
  - Loading skeletons on all data-fetching pages
  - Empty states (when no tasks, no volunteers)
  - Error states (when API fails)
  - Mobile responsiveness check
  - Dark/light mode (optional but impressive)

**Dev 3 (Backend):**
- API error handling — proper HTTP status codes, error messages
- Input validation on all endpoints
- Rate limiting on Gemini calls (avoid hitting free tier limit)
- Test all endpoints with demo data

---

#### Day 11 — Integration Testing

**All 3 Developers Together:**

Test these full user flows end-to-end:

- [ ] Flow 1: NGO Admin login → Upload survey → See AI analysis → Create task based on problems found
- [ ] Flow 2: Volunteer login → Fill profile → See assigned tasks → Mark task complete
- [ ] Flow 3: NGO Admin → Open task → Click "Find Best Volunteers" → See AI matches → Assign → Volunteer sees task
- [ ] Flow 4: NGO Admin → Open chat → Ask "What is the biggest problem in our area?" → Get Gemini answer
- [ ] Flow 5: Dashboard → Check all stats are accurate

Fix all bugs found during testing.

---

#### Day 12 — Deployment

**Dev 1 (Lead):**
- Deploy Next.js to Vercel:
  - Connect GitHub repo
  - Add all environment variables
  - Test production build
- Setup custom domain (optional — vercel gives free subdomain)

**Dev 2 (Frontend):**
- Final cross-browser testing (Chrome, Firefox, Safari)
- Final mobile testing
- Fix any production-specific UI issues
- Update README with screenshots

**Dev 3 (Backend):**
- Deploy FastAPI to Render:
  - Create `render.yaml` or manual setup
  - Add environment variables (GEMINI_API_KEY, DATABASE_URL, FIREBASE_PROJECT_ID)
  - Test all API endpoints on production URL
- Update Next.js env to point to production FastAPI URL

---

### 📦 PHASE 4: Submission Prep (Days 13–15)
**Goal:** Demo video, README, final submission

---

#### Day 13 — Demo Video Recording

**All 3 Developers:**

Record a 3-5 minute demo video showing:
1. (0:00–0:30) Problem statement — why volunteer coordination is broken
2. (0:30–1:00) Login as NGO Admin, show dashboard
3. (1:00–2:00) Upload a community survey → Show Gemini analysis → Top 3 problems identified
4. (2:00–2:45) Create a task → Click "Find Best Volunteers" → Show AI matching with scores
5. (2:45–3:15) Assign volunteer → Switch to volunteer view → See task assigned
6. (3:15–3:45) Show Gemini chat answering "What is the biggest problem in our community?"
7. (3:45–4:00) Impact dashboard — volunteers deployed, tasks completed, people helped

**Tips:**
- Use demo data (pre-loaded SQLite DB)
- Screen record at 1080p
- Add captions/text overlays on key moments
- Background music (soft, non-distracting)
- Tools: OBS Studio (free) for recording, DaVinci Resolve (free) for editing

---

#### Day 14 — README + Documentation

**Dev 1 (Lead):**
- Write comprehensive README.md:
  ```markdown
  # VolunteerIQ — AI-Powered Volunteer Coordination
  
  ## Problem
  ## Solution  
  ## Features
  ## Tech Stack
  ## Architecture Diagram
  ## Setup Instructions (local)
  ## Environment Variables
  ## Team — ClutchCode
  ```
- Create architecture diagram (draw.io or Excalidraw — free)
- Add screenshots of all major pages to README

**Dev 2 (Frontend):**
- Final UI review — fix any last minute issues
- Add loading states anywhere missing
- Make sure demo data shows well on all pages
- Take clean screenshots for README/submission

**Dev 3 (Backend):**
- Write API documentation (FastAPI auto-generates at `/docs`)
- Add comments to all Gemini prompts explaining why they're structured that way
- Final security check — no API keys in code, all in .env

---

#### Day 15 — Final Submission

**All 3 Developers — Final Checklist:**

**Code:**
- [ ] All features working on production
- [ ] No console errors
- [ ] No hardcoded API keys
- [ ] README complete with setup instructions
- [ ] All team members listed in README

**Submission:**
- [ ] Demo video uploaded (YouTube unlisted or Google Drive)
- [ ] GitHub repo public + clean commit history
- [ ] Live deployment URL working (Vercel + Render)
- [ ] Hack2skill submission form filled completely
- [ ] Project description written (use the prompt from earlier)
- [ ] Team name: ClutchCode confirmed
- [ ] Challenge: Smart Resource Allocation selected

**Double Check:**
- [ ] Gemini API working on production
- [ ] Firebase Auth working on production
- [ ] File upload working on production (local storage)
- [ ] SQLite → PostgreSQL migration done for production
- [ ] All 4 Gemini features working: Analysis, Matching, Chat, (Dashboard insights)

---

## 🌿 Git Branching Strategy

```
main          ← production only, merge before submission
  └── dev     ← integration branch, all features merge here first
        ├── feature/auth           (Dev 1)
        ├── feature/volunteer-form (Dev 2)
        ├── feature/gemini-api     (Dev 3)
        ├── feature/dashboard      (Dev 2)
        ├── feature/task-system    (Dev 1)
        ├── feature/matching       (Dev 3)
        └── feature/chat           (Dev 3)
```

**Rules:**
- Never push directly to `main`
- Always create PR from `feature/xxx` → `dev`
- At least 1 teammate reviews before merge
- Merge `dev` → `main` only on Day 12 (deployment) and Day 15 (final)
- Commit messages format: `feat: add volunteer matching` / `fix: gemini timeout` / `ui: polish dashboard cards`

---

## 🎭 Demo Data

### NGO: Odisha Relief Foundation
### Location: Bhubaneswar, Odisha

**Volunteers (10):**
| Name | Skills | Availability | Location |
|------|--------|-------------|----------|
| Priya Sharma | Medical, First Aid | Weekends | Bhubaneswar |
| Rahul Das | Driving, Logistics | Full-time | Cuttack |
| Ananya Patel | Teaching, IT Support | Weekdays | Bhubaneswar |
| Vikram Singh | Construction, Logistics | Weekends | Puri |
| Sneha Roy | Cooking, Medical | Mornings | Bhubaneswar |
| Arjun Nair | IT Support, Teaching | Evenings | Bhubaneswar |
| Kavita Mishra | Medical, Counseling | Full-time | Khordha |
| Rohan Gupta | Driving, Construction | Weekdays | Cuttack |
| Deepa Verma | Teaching, Cooking | Weekends | Bhubaneswar |
| Amit Kumar | Logistics, IT Support | Full-time | Bhubaneswar |

**Sample Surveys:**
1. `flood_relief_survey.csv` — 150 responses about flood-affected families needing food, shelter, medical aid
2. `education_gap_survey.pdf` — 80 responses about children missing school due to poverty
3. `health_camp_report.pdf` — Field report about lack of basic healthcare in rural areas

**Tasks (6):**
| Task | Skills Needed | Status |
|------|--------------|--------|
| Mobile health camp setup | Medical, Driving | Open |
| Food distribution drive | Cooking, Logistics | Assigned |
| School supply distribution | Teaching, Driving | Open |
| Flood shelter construction | Construction, Logistics | Assigned |
| Community health awareness | Medical, Teaching | Completed |
| IT skills workshop | IT Support, Teaching | Open |

---

## 🏆 Judging Criteria Alignment

| Criteria | How We Address It |
|----------|------------------|
| **AI Usage** | 4 Gemini features: Survey Analysis, Volunteer Matching, Chat, Dashboard Insights |
| **Impact** | Real NGO problem, real social benefit, measurable outcomes |
| **Technical Complexity** | Full-stack: Next.js + FastAPI + SQLAlchemy + Firebase Auth + Gemini integrated end-to-end |
| **Completeness** | Working product with auth, upload, analysis, matching, assignment, dashboard |
| **Google Tech** | Gemini 1.5 Pro + Firebase Auth = core Google ecosystem |
| **Innovation** | AI-powered matching with explainability — volunteers know WHY they were matched |
| **Presentation** | Clean UI, compelling demo video, clear problem-solution narrative |

---

## ⚠️ Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Gemini API free tier limit hit | Medium | High | Cache analysis results in SQLite DB, don't re-analyze same survey |
| ~~Firebase free tier storage full~~ | ~~Low~~ | ~~Medium~~ | ❌ **Eliminated** — now using backend local storage |
| Render free tier sleep delay | High | Medium | Add loading screen, or upgrade to paid ($7/month) |
| Team member stuck on a feature | Medium | High | Daily 15-min standup, help each other, no one works in isolation |
| Last minute deployment issues | Medium | High | Deploy by Day 12, not Day 15 — leave 3 days buffer |
| Gemini returns invalid JSON | Medium | Medium | Add try/catch + fallback prompt asking Gemini to fix its JSON |
| Time running out | High | High | P0 features only if behind schedule — matching + analysis are must-haves |

---

## 📊 Daily Standup Format (15 min max)

Every day, each developer answers:
1. **Done:** What did I finish yesterday?
2. **Today:** What am I working on today?
3. **Blocked:** Is anything stopping me?

Keep it short — standup is not a status meeting, it's a blocker-clearing session.

---

## 📊 Progress Tracker

| Day | Date | Status |
|-----|------|--------|
| Day 1 | 21 March 2026 | ✅ Completed |
| Day 2 | 23 March 2026 | ✅ Completed (All 3 devs) |
| Day 3 | — | ✅ Merged into Day 2 |
| Day 4 | 24 March 2026 | ✅ Completed (Survey Upload + AI Analysis) |
| Day 5 | 24 March 2026 | ✅ Completed (Gemini 2.0 Flash integration) |
| Day 6 | 24 March 2026 | ✅ Completed (Task system + Dashboard + Volunteers) |
| Day 7 | 25 March 2026 | ✅ Completed (Volunteer Network + Match Reasoning) |
| Day 8 | 25 March 2026 | ✅ Completed (Personnel Intelligence + Admin Terminal) |
| Day 9 | — | ⬜ Pending |
| Day 10 | — | ⬜ Pending |
| Day 11 | — | ⬜ Pending |
| Day 12 | — | ⬜ Pending |
| Day 13 | — | ⬜ Pending |
| Day 14 | — | ⬜ Pending |
| Day 15 | — | ⬜ Pending |

---

*Last Updated: 25 March 2026*

*Built with 🔥 by ClutchCode — We deliver when it matters most.*