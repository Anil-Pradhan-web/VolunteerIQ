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
| Database | Firebase Firestore |
| File Storage | Firebase Storage |
| Authentication | Firebase Auth (Google Login) |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## 🗂️ Feature List

### P0 — Must Have (Core MVP)
- [ ] Google Login (Firebase Auth)
- [ ] Volunteer registration with skills + availability + location
- [ ] NGO admin dashboard
- [ ] Community data upload (CSV/PDF surveys)
- [ ] Gemini AI — analyze uploaded data, identify top 3 problem areas
- [ ] Volunteer-task smart matching (Gemini powered)
- [ ] Task creation by NGO admin
- [ ] Task assignment to volunteers
- [ ] Basic dashboard — active tasks, volunteers deployed, problems identified

### P1 — Should Have
- [ ] Volunteer profile page
- [ ] Task status tracking (Pending / In Progress / Completed)
- [ ] Gemini chat — ask questions about community data
- [ ] Email/notification on task assignment
- [ ] Impact metrics — how many people helped, tasks completed

### P2 — Nice to Have
- [ ] Map view of volunteer locations vs task locations
- [ ] Export impact report as PDF
- [ ] Multi-NGO support

---

## 🗄️ Database Schema (Firestore)

```
/users/{userId}
  - name: string
  - email: string
  - role: "volunteer" | "ngo_admin"
  - skills: string[]           // ["medical", "teaching", "driving", "logistics"]
  - availability: string[]     // ["weekdays", "weekends", "mornings"]
  - location: string           // "Bhubaneswar, Odisha"
  - createdAt: timestamp

/ngos/{ngoId}
  - name: string
  - adminId: string
  - location: string
  - createdAt: timestamp

/surveys/{surveyId}
  - ngoId: string
  - fileName: string
  - fileUrl: string
  - uploadedBy: string
  - analysisResult: {
      topProblems: string[]    // Gemini output
      summary: string
      urgencyScore: number
    }
  - createdAt: timestamp

/tasks/{taskId}
  - ngoId: string
  - title: string
  - description: string
  - requiredSkills: string[]
  - location: string
  - deadline: timestamp
  - status: "open" | "assigned" | "completed"
  - assignedTo: string[]       // volunteer userIds
  - createdAt: timestamp

/assignments/{assignmentId}
  - taskId: string
  - volunteerId: string
  - assignedAt: timestamp
  - status: "active" | "completed"
```

---

## 🔌 API Endpoints (FastAPI)

```
POST   /api/upload-survey          → Upload CSV/PDF, extract text, send to Gemini
GET    /api/surveys/{ngoId}        → Get all surveys for an NGO
GET    /api/analyze/{surveyId}     → Get Gemini analysis for a survey

POST   /api/tasks                  → Create a new task
GET    /api/tasks/{ngoId}          → Get all tasks for an NGO
PUT    /api/tasks/{taskId}         → Update task status

POST   /api/match-volunteers       → Gemini powered matching: task → best volunteers
GET    /api/volunteers             → Get all volunteers with filters (skill, location)

POST   /api/assign                 → Assign volunteer to task
GET    /api/assignments/{userId}   → Get all assignments for a volunteer

GET    /api/dashboard/{ngoId}      → Dashboard stats (active tasks, volunteers, impact)
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
    firebase.py
  main.py
  requirements.txt
  .env
  ```
- [x] Setup virtual environment
- [x] Install: `fastapi uvicorn python-dotenv firebase-admin google-generativeai pdfplumber python-multipart pandas`
- [x] Test FastAPI running locally (Added `start.bat` for quick launch)

---

#### Day 2 — Firebase Setup + Google Auth

**Dev 1 (Lead):**
- Create Firebase project on console.firebase.google.com
- Enable: Firestore, Storage, Authentication (Google provider)
- Add Firebase config to Next.js `.env.local`
- Create `lib/firebase.ts` with init code
- Implement Google Login page (NextAuth or Firebase directly)
- Protected route middleware — redirect to login if not authenticated

**Dev 2 (Frontend):**
- Build Login page UI — clean, professional
- Build post-login redirect flow:
  - If `role === "ngo_admin"` → go to `/dashboard`
  - If `role === "volunteer"` → go to `/volunteer/profile`
- Create role selection screen (first time login)

**Dev 3 (Backend):**
- Setup Firebase Admin SDK in FastAPI
- Create `services/firebase.py`:
  - `save_user()` — save user to Firestore on first login
  - `get_user()` — fetch user by ID
  - `update_user()` — update user skills/availability
- Test Firebase connection from FastAPI

---

#### Day 3 — Volunteer Registration + Profile

**Dev 1 (Lead):**
- Connect frontend Google login to Firestore — save user on first login
- Create `/api/users` route in Next.js calling FastAPI
- Test end-to-end: Login → Save to Firestore → Redirect

**Dev 2 (Frontend):**
- Build Volunteer Registration Form:
  - Name, Location (city)
  - Skills: multi-select checkboxes (Medical, Teaching, Driving, Logistics, Cooking, Construction, IT Support)
  - Availability: (Weekdays / Weekends / Mornings / Evenings / Full-time)
- Build Volunteer Profile page showing their info + assigned tasks

**Dev 3 (Backend):**
- Create `routes/volunteers.py`:
  - `POST /api/volunteers` — save volunteer profile
  - `GET /api/volunteers` — list all volunteers (with optional skill/location filter)
  - `GET /api/volunteers/{id}` — get single volunteer
- Test all endpoints with Postman/curl

---

### 📦 PHASE 2: Core AI Features (Days 4–8)
**Goal:** Survey upload + Gemini analysis + Task system working

---

#### Day 4 — Survey Upload System

**Dev 1 (Lead):**
- Create `/upload` page in Next.js
- File upload component (drag & drop using shadcn)
- Call FastAPI `/api/upload-survey` endpoint
- Show upload progress + success/error states

**Dev 2 (Frontend):**
- Build survey upload UI:
  - Drag & drop zone
  - File type validation (CSV, PDF, DOCX)
  - Upload progress bar
  - After upload → show "Analyzing with AI..." loader
  - After analysis → show results card
- Build surveys list page — show all uploaded surveys for NGO

**Dev 3 (Backend):**
- Create `routes/upload.py`:
  - `POST /api/upload-survey` — receive file, save to Firebase Storage, extract text
- Create text extraction logic:
  - PDF → pdfplumber
  - CSV → pandas
  - DOCX → python-docx
- Save survey metadata to Firestore
- Return extracted text to frontend temporarily

---

#### Day 5 — Gemini AI Analysis

**Dev 1 (Lead):**
- Connect survey upload response to analysis display
- Create survey detail page — show Gemini analysis results
- Handle loading states + error states

**Dev 2 (Frontend):**
- Build Analysis Result Card UI:
  - Top 3 Problems (with urgency badges: High/Medium/Low)
  - Summary paragraph
  - Recommended action items
  - Total responses analyzed
- Make it visually impactful — this is the "wow" feature for judges

**Dev 3 (Backend):**
- Create `services/gemini.py` with analysis function:
  ```python
  def analyze_survey(text: str) -> dict:
      prompt = f"""
      You are an expert social impact analyst working with NGOs.
      Analyze this community survey data and return a JSON with:
      - top_problems: list of 3 most urgent community problems
      - urgency_scores: urgency level for each (High/Medium/Low)  
      - summary: 2-3 sentence overview
      - recommended_actions: list of 3 suggested interventions
      - total_responses: estimated number of people affected
      
      Survey Data:
      {text}
      
      Return ONLY valid JSON, no extra text.
      """
      # Call Gemini 1.5 Pro
      # Parse response
      # Return structured dict
  ```
- Save analysis result back to Firestore survey document
- Test with sample survey data

---

#### Day 6 — Task Creation System

**Dev 1 (Lead):**
- Create `/tasks/new` page — task creation form
- Create `/tasks` page — list all tasks
- Create `/tasks/[id]` page — task detail view
- Connect all pages to FastAPI

**Dev 2 (Frontend):**
- Build Task Creation Form:
  - Title, Description
  - Required Skills (multi-select)
  - Location, Deadline
  - Priority (High/Medium/Low)
- Build Task List with filters:
  - Filter by status (Open/Assigned/Completed)
  - Filter by skill required
  - Search by title
- Build Task Detail page:
  - Show task info
  - Show assigned volunteers
  - Status update button

**Dev 3 (Backend):**
- Create `routes/tasks.py`:
  - `POST /api/tasks` — create task
  - `GET /api/tasks` — list tasks (with filters)
  - `GET /api/tasks/{id}` — get single task
  - `PUT /api/tasks/{id}` — update status
- Test all endpoints

---

#### Day 7 — Gemini Volunteer Matching (Core AI Feature)

**Dev 1 (Lead):**
- Create "Find Best Volunteers" button on task detail page
- Call `/api/match-volunteers` endpoint
- Display matched volunteers with match score + reason

**Dev 2 (Frontend):**
- Build Volunteer Match Result UI:
  - List of top 5 matched volunteers
  - Match score (e.g., 92% match)
  - Why they match — Gemini explanation
  - "Assign" button next to each volunteer
- Make this the most impressive UI on the platform

**Dev 3 (Backend):**
- Create `routes/match.py`:
  - `POST /api/match-volunteers` — takes task details, returns ranked volunteers
- Create Gemini matching function:
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
- Test matching with sample data

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
- Create `POST /api/assign` — assign volunteer to task, update Firestore
- Create `GET /api/assignments/{userId}` — get volunteer's tasks

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
      # Fetch NGO's surveys + tasks + volunteer count from Firestore
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
- Create demo data script — populate Firestore with realistic data:
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
  - Add environment variables (GEMINI_API_KEY, Firebase credentials)
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
- Use demo data (pre-loaded Firestore)
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
- [ ] File upload working on production
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
| **Technical Complexity** | Full-stack: Next.js + FastAPI + Firebase + Gemini integrated end-to-end |
| **Completeness** | Working product with auth, upload, analysis, matching, assignment, dashboard |
| **Google Tech** | Gemini 1.5 Pro + Firebase Auth + Firestore + Firebase Storage = full Google ecosystem |
| **Innovation** | AI-powered matching with explainability — volunteers know WHY they were matched |
| **Presentation** | Clean UI, compelling demo video, clear problem-solution narrative |

---

## ⚠️ Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Gemini API free tier limit hit | Medium | High | Cache analysis results in Firestore, don't re-analyze same survey |
| Firebase free tier storage full | Low | Medium | Compress files before upload, limit file size to 5MB |
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

*Built with 🔥 by ClutchCode — We deliver when it matters most.*