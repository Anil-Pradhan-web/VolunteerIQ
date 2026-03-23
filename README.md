# 🌍 VolunteerIQ — AI-Powered Volunteer Coordination

> **Solution Challenge 2026** | Team ClutchCode | Smart Resource Allocation for Social Impact

**VolunteerIQ** is an AI-powered platform that helps NGOs coordinate volunteers efficiently. Upload community data, let Gemini AI analyze urgent needs, and intelligently match the right volunteers to the right tasks.

---

## ✨ Features

| Feature | Status |
|---------|--------|
| 🔐 Google Login (Firebase Auth) | ✅ Done |
| 👤 Volunteer Registration + Profile (skills, availability, location) | ✅ Done |
| 🎯 Role Selection (Volunteer / NGO Admin) | ✅ Done |
| 📊 NGO Admin Dashboard | ✅ Backend ready |
| 📄 Community Survey Upload (CSV/PDF/DOCX) | ✅ Backend ready |
| 🤖 Gemini AI — Survey Analysis & Problem Detection | 🔧 In Progress |
| 🧲 AI-Powered Volunteer ↔ Task Matching | 🔧 In Progress |
| ✅ Task Creation & Assignment System | ✅ Backend ready |
| 💬 Gemini Chat — Ask about your community data | ⬜ Planned |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | **Next.js 14** (App Router) + Tailwind CSS + shadcn/ui |
| Backend | **FastAPI** (Python) |
| AI | **Google Gemini 1.5 Pro** API |
| Database | **SQLite + SQLAlchemy** (dev) → PostgreSQL (production) |
| Auth | **Firebase Authentication** (Google Login — free tier) |
| Storage | Backend local file storage |

---

## 🚀 Quick Start (Already Installed)

Double-click **`start.bat`** in the root folder — it launches both servers automatically.

Then open: **[http://localhost:3000](http://localhost:3000)**

---

## 🛠️ First-Time Setup

### Prerequisites
- **Node.js** v18+
- **Python** v3.10+

### 1. Clone the repo
```bash
git clone https://github.com/Anil-Pradhan-web/SPORTLEX-AI.git
cd SPORTLEX-AI
```

### 2. Setup Frontend
```powershell
cd frontend
npm install
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc
NEXT_PUBLIC_GEMINI_MODEL=gemini-1.5-pro
```

### 3. Setup Backend
```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:
```env
APP_NAME=VolunteerIQ API
APP_ENV=development
APP_HOST=127.0.0.1
APP_PORT=8000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

DATABASE_URL=sqlite:///./volunteeriq.db
FIREBASE_PROJECT_ID=your-project-id

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-pro
```

> 💡 Get your Gemini API key free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

---

## 🏃 Running the Servers

### Frontend (Terminal 1)
```powershell
cd frontend
npm run dev
```
→ Opens at **http://localhost:3000**

### Backend (Terminal 2)
```powershell
cd backend
.venv\Scripts\activate
uvicorn main:app --reload
```
→ API at **http://127.0.0.1:8000**
→ API Docs at **http://127.0.0.1:8000/docs**

---

## 📁 Project Structure

```
VOLUNTEER IQ/
├── frontend/               # Next.js 14 App
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── login/            # Google login page
│   │   ├── onboarding/       # Role selection (first login)
│   │   ├── dashboard/        # NGO admin dashboard
│   │   ├── tasks/            # Task management
│   │   ├── volunteers/       # Volunteer list
│   │   ├── upload/           # Survey upload
│   │   └── volunteer/profile # Volunteer profile editor
│   ├── components/
│   │   ├── layout/           # Sidebar, Header, AppShell
│   │   ├── auth/             # ProtectedRoute
│   │   └── ui/               # shadcn/ui components
│   └── lib/
│       ├── firebase.ts       # Firebase SDK init
│       └── auth-context.tsx  # AuthProvider + useAuth()
│
├── backend/                # FastAPI Python API
│   ├── app/
│   │   ├── config.py         # App settings
│   │   ├── models.py         # Pydantic request/response models
│   │   ├── database.py       # SQLAlchemy engine + session
│   │   └── db_models.py      # ORM models (User, Task, etc.)
│   ├── routes/
│   │   ├── auth.py           # POST /api/auth/verify
│   │   ├── volunteers.py     # CRUD /api/volunteers
│   │   ├── tasks.py          # CRUD /api/tasks
│   │   ├── assignments.py    # POST /api/assign
│   │   ├── dashboard.py      # GET /api/dashboard/{ngoId}
│   │   ├── upload.py         # POST /api/upload-survey
│   │   └── match.py          # POST /api/match-volunteers
│   ├── services/
│   │   ├── auth.py           # Firebase token verification
│   │   ├── db_service.py     # All DB CRUD operations
│   │   └── gemini.py         # Gemini AI integration
│   ├── main.py               # FastAPI app entry point
│   └── requirements.txt
│
└── execution_plan.md       # 15-day sprint plan
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/verify` | Verify Firebase token + create/fetch user |
| `GET` | `/api/volunteers` | List volunteers (filter by skill/location) |
| `POST` | `/api/volunteers` | Create volunteer profile |
| `PUT` | `/api/volunteers/{id}` | Update volunteer profile |
| `GET` | `/api/tasks` | List tasks (filter by ngoId) |
| `POST` | `/api/tasks` | Create task |
| `PUT` | `/api/tasks/{id}` | Update task status |
| `POST` | `/api/assign` | Assign volunteer to task |
| `GET` | `/api/assignments/{userId}` | Get user's assignments |
| `GET` | `/api/dashboard/{ngoId}` | Dashboard stats |
| `POST` | `/api/upload-survey` | Upload survey file |
| `POST` | `/api/match-volunteers` | AI volunteer matching |
| `GET` | `/health` | Health check |

---

## 👥 Team ClutchCode

| Developer | Role |
|-----------|------|
| **Dev 1** | Full-Stack Lead |
| **Dev 2** | Frontend Developer |
| **Dev 3** | Backend + AI |

---

> 🎉 **Built with ❤️ for Google Solution Challenge 2026**
