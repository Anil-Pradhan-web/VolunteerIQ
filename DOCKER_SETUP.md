# 🚀 VolunteerIQ — Local Setup with Docker

> **Kisi bhi machine pe 2 minute mein project run karo — sirf Docker chahiye!**

---

## Prerequisites (Ek baar install karo)

### 1. Install Docker Desktop
- **Windows**: https://docs.docker.com/desktop/install/windows-install/
- **Mac**: https://docs.docker.com/desktop/install/mac-install/
- **Linux**: https://docs.docker.com/desktop/install/linux/

Install karne ke baad **Docker Desktop open karo** aur make sure green icon dikh raha ho (running state).

### 2. Install Git
- Download: https://git-scm.com/downloads

---

## Step-by-Step Setup

### Step 1: Clone the repo
```bash
git clone https://github.com/Anil-Pradhan-web/VolunteerIQ.git
cd VolunteerIQ
```

### Step 2: Backend ka `.env` file banao
```bash
# backend folder mein .env file create karo
cp backend/.env.example backend/.env
```

Ab `backend/.env` file open karo aur yeh values fill karo:

```env
APP_ENV=development
DATABASE_URL=sqlite:///./volunteeriq.db
FIREBASE_PROJECT_ID=volenteeriq
GEMINI_API_KEY=        # <-- Anil se maango
GROQ_API_KEY=          # <-- Anil se maango
```

> **Note:** API keys Anil se maango, `.env.example` mein intentionally empty hain security ke liye.

### Step 3: Frontend ka `.env.local` file banao
```bash
cp frontend/.env.example frontend/.env.local
```

Ab `frontend/.env.local` open karo aur yeh values fill karo:


### Step 4: Docker se project start karo 🐳
```bash
docker-compose up --build
```

**Bas! Yahi ek command hai!** Pehli baar 3-5 min lagega (images download + build), uske baad fast hoga.

### Step 5: Open karo browser mein
| Service | URL |
|---|---|
| **Frontend** | http://localhost:3000 |
| **Backend API** | http://localhost:8000 |
| **API Docs** | http://localhost:8000/docs |

### Step 6: Demo data load karo (Optional)
Agar fresh database hai toh dummy data seed karo:
```bash
docker exec -it volunteeriq-backend python seed_demo_data.py
```

---

## Daily Usage

```bash
# Start karo (background mein):
docker-compose up -d

# Stop karo:
docker-compose down

# Logs dekho:
docker-compose logs -f

# Rebuild karo (code change ke baad):
docker-compose up --build
```

---

## Without Docker (Manual Setup)

Agar Docker nahi chahiye toh:

### Backend:
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate       # Windows
source .venv/bin/activate    # Mac/Linux
pip install -r requirements.txt
python seed_demo_data.py     # Demo data
uvicorn main:app --reload    # Start server
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `docker-compose` not found | Docker Desktop install & open karo, ya `docker compose` (bina hyphen) try karo |
| Port 3000 already in use | Pehle wala server band karo ya `docker-compose.yml` mein port change karo |
| Build fail ho raha | `docker-compose down` karo, phir `docker-compose up --build` |
| Frontend blank dikh raha | Check karo ki `frontend/.env.local` mein sahi API URL hai |

---

> Built with ❤️ by Team ClutchCode | Google Solution Challenge 2026
