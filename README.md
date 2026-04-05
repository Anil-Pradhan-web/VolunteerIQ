
<div align="center">

<br/>

<img src="frontend/public/logo.png" alt="VolunteerIQ Logo" width="100" style="border-radius: 24px;" />

<h1>VolunteerIQ</h1>

<p><strong>AI-Powered Humanitarian Intelligence for NGOs</strong></p>

<p>
  <img src="https://img.shields.io/badge/Google_Solution_Challenge-2026-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Solution Challenge 2026" />
  <img src="https://img.shields.io/badge/Team-ClutchCode-6366F1?style=for-the-badge" alt="Team ClutchCode" />
  <img src="https://img.shields.io/badge/Status-Active-22C55E?style=for-the-badge" alt="Status Active" />
</p>

<p>
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Gemini-1.5_Pro-4285F4?style=flat-square&logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black" />
  <img src="https://img.shields.io/badge/SQLAlchemy-SQLite-D71F00?style=flat-square&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/Mapbox-GL-000000?style=flat-square&logo=mapbox&logoColor=white" />
</p>

<br/>

> *"From raw community signals to coordinated field operations — in minutes."*

<br/>

</div>

---

## 🌍 What is VolunteerIQ?

**VolunteerIQ** is an AI-powered coordination platform that **transforms how NGOs respond to community crises**. During disasters, health emergencies, or humanitarian crises, NGOs are drowning in unstructured survey data while volunteers wait without direction.

VolunteerIQ bridges this gap: upload raw field surveys → Gemini AI extracts urgent problems → auto-generates actionable tasks → matches the **right volunteers** with the **right skills** to the **right locations** — all within minutes, not days.

### 🎯 The Problem We Solve

| Without VolunteerIQ | With VolunteerIQ |
|---|---|
| Manual survey analysis (days) | AI analysis in seconds |
| Volunteers assigned by gut feeling | Data-driven skill-based matching |
| No visibility into field operations | Live operations map with real-time status |
| Survey data silos, no action | Every survey becomes a deployment plan |
| Chat over phone/email | Contextual AI assistant with live NGO data |

---

## ✨ Core Features

### 🤖 AI Intelligence Layer
- **Survey Analysis Engine** — Upload CSV, PDF, DOCX, or TXT field reports. Gemini 1.5 Pro extracts top 3 urgent community problems, urgency scores (High/Medium/Low), a concise executive summary, and recommended interventions.
- **Auto Task Generation** — Each survey automatically produces 3 ready-to-launch field tasks with required skill tags, location metadata, and descriptions.
- **Smart Volunteer Matching** — For any task, AI ranks available volunteers by skill match, location proximity, and availability — with a score (0–100) and a one-sentence explanation.
- **Contextual AI Chat** — Ask plain English questions about your NGO's data ("Who can handle medical tasks in Bhubaneswar?") and get intelligent answers pulled from live DB context.
- **Dual AI Provider** — Switch between **Gemini 1.5 Pro** (primary) and **Groq Llama 3** (fallback) for all AI operations. Rate-limit-aware with graceful degradation stubs.

### 📊 Operational Command Center
- **Live Dashboard** — Real-time stats: total volunteers, active/completed/open tasks, urgent problems from latest survey, recent survey scans, and a task health progress bar.
- **Live Operations Map** — Mapbox-powered geospatial map showing all tasks as colored pins (🔴 Open · 🔵 Active · 🟢 Completed), with a legend, click popups, and geocoding cache to minimize API calls.
- **Task Management** — Create, update, filter, and delete field tasks. Full lifecycle: `open → assigned → completed`.
- **Volunteer Assignment Flow** — One-click assign/unassign from any task detail page. Task status auto-transitions on changes.

### 👥 Personnel Intelligence
- **Volunteer Profiles** — Rich profiles with skills, availability slots, location, and profile photos (via Google Auth or DiceBear avatars).
- **Smart Filtering** — Search volunteers by name, skill, or location with instant live filtering on the Volunteers page.
- **Volunteer HQ** — Animated card grid with skill badges, availability tags, and a live count of the force.

### 🔐 Security & Infrastructure
- **Google Authentication** — Firebase-backed Google Login. Token verified server-side on every protected request.
- **Protected Routes** — Auth-guarded app shell. Unauthenticated users redirect cleanly to `/login`.
- **File Processing Pipeline** — Upload handler supports PDF (pdfplumber), CSV (pandas), DOCX (python-docx), and TXT — with graceful error messages per type.
- **Demo Seed Script** — `seed_demo_data.py` populates a rich showcase dataset (volunteers, surveys, tasks, assignments) for demos.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js 14)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────────┐ │
│  │ Landing  │  │Dashboard │  │  Tasks   │  │  Volunteers HQ  │ │
│  │  Page    │  │+ Live Map│  │  + [id]  │  │  + Profile Edit │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────────┘ │
│  ┌──────────┐  ┌─────────────────────────────────────────────┐  │
│  │  Upload  │  │         Floating AI Chat Widget             │  │
│  │ Survey   │  │    (Gemini / Groq — provider toggle)        │  │
│  └──────────┘  └─────────────────────────────────────────────┘  │
│          Firebase Auth  │  Mapbox GL  │  Tailwind CSS           │
└─────────────────────────┼───────────────────────────────────────┘
                          │  HTTP REST (JSON)
┌─────────────────────────┼───────────────────────────────────────┐
│                   BACKEND (FastAPI + Python)                      │
│  ┌────────────┐ ┌───────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ /api/auth  │ │/api/tasks │ │/api/chat │ │/api/volunteers │  │
│  │ /api/upload│ │/api/assign│ │/api/match│ │/api/dashboard  │  │
│  └────────────┘ └───────────┘ └──────────┘ └────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              AI Services Layer                            │   │
│  │   GeminiService (analyze/match/chat) + rate limiter       │   │
│  │   GroqService   (analyze/match/chat) — fallback           │   │
│  └──────────────────────────────────────────────────────────┘   │
│             SQLAlchemy ORM  │  SQLite (→ PostgreSQL prod)        │
└──────────────────────────────────────────────────────────────────┘
```

### Data Models

| Model | Key Fields |
|---|---|
| `User` | id, name, email, role, skills[], availability[], location, photo_url |
| `Task` | id, ngo_id, title, description, required_skills[], location, status, assigned_to[] |
| `Assignment` | id, task_id, volunteer_id, status, assigned_at |
| `Survey` | id, ngo_id, file_name, extracted_text, analysis_result (JSON) |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 14, App Router | Cinematic UI, SSR, routing |
| **Styling** | Tailwind CSS, shadcn/ui | Premium component system |
| **Backend** | FastAPI (Python 3.11+) | High-performance REST API |
| **Primary AI** | Google Gemini 1.5 Pro | Survey analysis, matching, chat |
| **Fallback AI** | Groq (Llama 3) | Ultra-fast inference fallback |
| **Auth** | Firebase Authentication | Google Login, JWT verification |
| **Database** | SQLite + SQLAlchemy | Local persistence, ORM layer |
| **Geo/Maps** | Mapbox GL, react-map-gl | Live operations visualization |
| **File Parsing** | pdfplumber, pandas, python-docx | Multi-format survey extraction |

---

## 🚀 Quick Start

### Option 1: One-Click Launch (Windows)

```powershell
# From project root — launches both servers
./start.bat
```

Then open: **[http://localhost:3000](http://localhost:3000)**

---

### Option 2: Manual Setup

#### Prerequisites
- Node.js v20+
- Python v3.11+
- A free [Gemini API Key](https://aistudio.google.com/apikey)
- A free [Firebase Project](https://console.firebase.google.com)
- A free [Mapbox Token](https://account.mapbox.com/) *(optional — map shows placeholder without it)*

#### 1. Clone the Repository

```bash
git clone https://github.com/Anil-Pradhan-web/SPORTLEX-AI.git
cd "VOLUNTEER IQ"
```

#### 2. Setup Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# Firebase (from Firebase Console → Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional — Live Operations Map (get free token at mapbox.com)
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_mapbox_token
```

#### 3. Setup Backend

```bash
cd backend
python -m venv .venv

# Activate virtual environment
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Mac/Linux

pip install -r requirements.txt
```

Create `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_from_aistudio
GEMINI_MODEL=gemini-1.5-pro

DATABASE_URL=sqlite:///./volunteeriq.db
FIREBASE_PROJECT_ID=your-project-id

CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
APP_HOST=127.0.0.1
APP_PORT=8000
```

> 💡 **Groq is optional.** If you set `GROQ_API_KEY=your_groq_key`, the platform will use it as a fallback. All AI features degrade gracefully with stub responses if keys are missing.

#### 4. Seed Demo Data

```bash
# From the backend directory (with venv active)
python seed_demo_data.py
```

This populates your local database with realistic volunteers, surveys, tasks, and assignments — ready for a polished demo run.

#### 5. Run the Servers

**Terminal 1 — Frontend:**
```bash
cd frontend
npm run dev
```
> Opens at **http://localhost:3000**

**Terminal 2 — Backend:**
```bash
cd backend
.venv\Scripts\activate
uvicorn main:app --reload
```
> API at **http://127.0.0.1:8000**  
> Interactive Docs at **http://127.0.0.1:8000/docs**

---

## 📁 Project Structure

```
VOLUNTEER IQ/
│
├── frontend/                         # Next.js 14 Application
│   ├── app/
│   │   ├── page.tsx                  # Landing page (hero + features + CTA)
│   │   ├── login/                    # Google Sign-In page
│   │   ├── dashboard/                # NGO Command Center
│   │   ├── upload/                   # AI Survey Intelligence page
│   │   ├── tasks/                    # Task list + /[id] detail page
│   │   ├── volunteers/               # Volunteer HQ (search + filter grid)
│   │   └── volunteer/profile/        # Profile editor (skills, availability, photo)
│   ├── components/
│   │   ├── auth/ProtectedRoute.tsx   # Auth guard wrapper
│   │   ├── chat/gemini-chat.tsx      # Floating AI assistant widget
│   │   ├── common/
│   │   │   ├── live-map.tsx          # Mapbox operations map (with geo cache)
│   │   │   ├── stat-card.tsx         # Dashboard metric card
│   │   │   ├── empty-state.tsx       # Reusable empty state UI
│   │   │   └── page-header.tsx       # Standardized page headers
│   │   ├── layout/                   # Sidebar + AppShell
│   │   └── ui/                       # shadcn/ui component library
│   └── lib/
│       ├── firebase.ts               # Firebase SDK initialisation
│       └── auth-context.tsx          # AuthProvider + useAuth() hook
│
├── backend/                          # FastAPI Python Intelligence Server
│   ├── app/
│   │   ├── config.py                 # Settings from .env
│   │   ├── database.py               # SQLAlchemy engine + session
│   │   ├── db_models.py              # ORM: User, Task, Assignment, Survey
│   │   └── models.py                 # Pydantic request/response schemas
│   ├── routes/
│   │   ├── auth.py                   # POST /api/auth/verify
│   │   ├── volunteers.py             # CRUD /api/volunteers
│   │   ├── tasks.py                  # CRUD /api/tasks
│   │   ├── assignments.py            # POST /api/assign, /api/unassign
│   │   ├── dashboard.py              # GET /api/dashboard/{ngo_id}
│   │   ├── upload.py                 # POST /api/upload-survey + GET /api/surveys
│   │   ├── match.py                  # POST /api/match-volunteers
│   │   └── chat.py                   # POST /api/chat
│   ├── services/
│   │   ├── gemini.py                 # GeminiService: analyze/match/chat + rate limiter
│   │   ├── groq_service.py           # GroqService: fallback AI provider
│   │   ├── db_service.py             # All database CRUD operations
│   │   └── auth.py                   # Firebase token verification
│   ├── main.py                       # FastAPI app entry point
│   ├── seed_demo_data.py             # Demo data seeder
│   └── requirements.txt
│
├── start.bat                         # One-click launch script (Windows)
├── execution_plan.md                 # Sprint plan & feature tracker
└── README.md                         # This file
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/verify` | Verify Firebase JWT → create or fetch user |
| `GET` | `/api/volunteers` | List all volunteers (filter: `?skill=` `?location=`) |
| `POST` | `/api/volunteers` | Register a new volunteer profile |
| `PUT` | `/api/volunteers/{id}` | Update volunteer profile |
| `GET` | `/api/tasks` | List tasks (filter: `?ngoId=`) |
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks/{id}` | Fetch single task with full details |
| `PUT` | `/api/tasks/{id}` | Update task (status, skills, location) |
| `DELETE` | `/api/tasks/{id}` | Delete task and its assignments |
| `POST` | `/api/assign` | Assign volunteer to task |
| `POST` | `/api/unassign` | Remove volunteer from task |
| `GET` | `/api/assignments/{user_id}` | Get all assignments for a volunteer |
| `POST` | `/api/upload-survey` | Upload file + run AI analysis |
| `GET` | `/api/surveys/{ngo_id}` | Get all surveys for an NGO |
| `GET` | `/api/surveys/{ngo_id}/{survey_id}` | Get single survey with full analysis |
| `POST` | `/api/match-volunteers` | AI-rank volunteers for a task |
| `POST` | `/api/chat` | Contextual AI Q&A from NGO data |
| `GET` | `/api/dashboard/{ngo_id}` | Aggregate stats + map tasks |
| `GET` | `/health` | API health check |

---

## 🌐 Real-World Use Cases

### 🚨 Disaster Relief
During cyclones or floods, NGOs receive hundreds of chaotic SOS messages. VolunteerIQ structures these into urgent, geocoded tasks — mapping medical volunteers to affected zones within minutes.

### 🏥 Mobile Health Camps
Medical surveys take weeks to analyze manually. Our AI processes the data overnight to prioritize villages and match doctors with the right specializations to high-density areas.

### 📚 Education Drives
Identify community schooling gaps from survey data. Automatically match teachers proficient in local languages with temporary rural education centers.

---

## 📊 Feature Status

| Feature | Status |
|---|:---:|
| Google Login (Firebase Auth) | ✅ Complete |
| Volunteer Profile CRUD | ✅ Complete |
| Survey Upload (PDF/CSV/DOCX/TXT) | ✅ Complete |
| AI Survey Analysis (Gemini) | ✅ Complete |
| AI Survey Analysis (Groq fallback) | ✅ Complete |
| Task CRUD + Status Lifecycle | ✅ Complete |
| AI Volunteer Matching | ✅ Complete |
| Volunteer Assignment + Unassignment | ✅ Complete |
| Dashboard Stats + Problem Extract | ✅ Complete |
| Live Operations Map (Mapbox) | ✅ Complete |
| Floating AI Chat Widget | ✅ Complete |
| Demo Seed Script | ✅ Complete |
| End-to-End QA Pass | 🔄 In Progress |
| Production Deployment | ⏳ Pending |
| Demo Video Recording | ⏳ Pending |

---

## 👥 Team ClutchCode

| Member | Role |
|---|---|
| **Anil Pradhan** | Full-Stack Lead — Architecture, AI Integration, Deployment |
| **Sayak Paramanik** | Testing — End to End Test,Firebase Integration |
| **Sreejita Swain** | UI and UX  — Frontend lead, AI api keys, UI/UX |

---

## 🙏 Acknowledgements

- [Google Gemini](https://ai.google.dev/) — The AI brain powering our analysis and matching
- [Groq](https://groq.com/) — Ultra-fast inference for real-time fallback
- [Firebase](https://firebase.google.com/) — Seamless, secure authentication
- [Mapbox](https://www.mapbox.com/) — Beautiful geospatial visualization
- [Vercel](https://vercel.com/) — Frontend hosting and edge deployment

---

<div align="center">

<br/>

**Built with ❤️ for Google Solution Challenge 2026**

*Empowering NGOs with Intelligence. Coordinating Compassion at Scale.*

<br/>

<img src="https://img.shields.io/badge/Made_with-Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" />
&nbsp;
<img src="https://img.shields.io/badge/For-Social_Good-22C55E?style=for-the-badge&logo=heart&logoColor=white" />

<br/><br/>

</div>
