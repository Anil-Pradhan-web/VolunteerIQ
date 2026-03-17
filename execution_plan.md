# 🏏 SportLex AI — 15-Din Ka Full Execution Plan (Hinglish)

## 📋 Project Info
| Field | Detail |
|-------|--------|
| **Project** | SportLex AI — AI-powered legal platform for sports organizations |
| **Team** | ClutchCode |
| **Challenge** | Solution Challenge 2026 — Build with AI |
| **Log kitne hai** | 3 Developers (Dev 1, Dev 2, Dev 3) |
| **Kitne din** | 15 Din (Day 1 → Day 15) |
| **Shuru** | 17 March 2026 |
| **Khatam** | 31 March 2026 |

---

## 👥 Kaun Kya Karega — Team Roles

| Dev | Kya karna hai mainly | Side mein kya karega |
|-----|----------------------|-----------|
| **Dev 1 (Frontend Wala)** | Pura UI banana hai — Next.js 14 + Tailwind + shadcn/ui. Saare pages, components, animations, dark mode — sab iska kaam hai | Firebase Auth frontend side lagana, responsive banana |
| **Dev 2 (Backend Wala)** | Pura server banana hai — FastAPI (Python). APIs likhega, Gemini se baat karega, PDF se text nikalega | Prompt engineering, error handling, API security |
| **Dev 3 (Firebase + Testing Wala)** | Firebase setup (Auth, Firestore, Storage), demo data banana, har cheez test karna, deployment, documentation | Integration testing, bug reporting, presentation banana |

---

## 🎯 5 Phases Mein Kaam Split Hai

| Phase | Kab | Kya hoga |
|-------|-----|----------|
| 🔵 **FOUNDATION** | Day 1–3 | Setup, Auth, Landing Page — neev dalna |
| 🟢 **CORE FEATURES** | Day 4–8 | Upload, Gemini Analysis, Dashboard — main features |
| 🟡 **ADVANCED FEATURES** | Day 9–11 | Detail Page, Chat, Search, Alerts — power features |
| 🟠 **POLISH** | Day 12–13 | Dark mode, animations, bug fixes — chamkana |
| 🔴 **SHIP IT** | Day 14–15 | Deployment, demo video, presentation — launch! |

---

---

# 🔵 PHASE 1: FOUNDATION (Day 1–3)

---

## 🗓️ DAY 1 — Project Setup (17 March)

**🎯 Aaj ka goal:** Teeno devs ka environment ready ho jaaye. GitHub repo ban jaaye. Firebase project create ho jaaye. Sabke paas credentials ho.

---

### 👨‍💻 Dev 1 (Frontend) — Aaj kya karega:

**Kaam 1: Next.js project create karo**
```bash
# Apne terminal mein yeh command run karo
npx create-next-app@latest frontend --typescript --tailwind --app --eslint

# Yeh poochega options — yeh select karo:
# ✅ TypeScript: Yes
# ✅ ESLint: Yes  
# ✅ Tailwind CSS: Yes
# ✅ src/ directory: No
# ✅ App Router: Yes
# ✅ Import alias: @/*
```
- Command chalane ke baad `frontend/` folder ban jaayega
- `cd frontend` karke andar jaao
- `npm run dev` se check karo ki localhost:3000 pe app chal raha hai

**Kaam 2: shadcn/ui install karo (UI component library)**
```bash
cd frontend
npx shadcn-ui@latest init

# Options select karo:
# Style: Default
# Base color: Slate
# CSS variables: Yes
```
- Isse `components/ui/` folder ban jaayega
- Iske baad kuch useful components add karo:
```bash
npx shadcn-ui@latest add button card input toast dialog dropdown-menu badge
```

**Kaam 3: Extra packages install karo**
```bash
npm install firebase recharts framer-motion lucide-react @radix-ui/react-icons
```
- `firebase` → Google Auth ke liye
- `recharts` → Dashboard pe pie chart / bar chart banane ke liye
- `framer-motion` → Smooth animations ke liye
- `lucide-react` → Beautiful icons ke liye

**Kaam 4: Folder structure banao**
```
frontend/
├── app/
│   ├── page.tsx              ← Landing page (yahan login button hoga)
│   ├── layout.tsx            ← Root layout (fonts, global stuff)
│   ├── globals.css           ← Global CSS + design tokens
│   ├── dashboard/
│   │   └── page.tsx          ← Dashboard page (baad mein banayenge)
│   ├── upload/
│   │   └── page.tsx          ← Upload page
│   ├── contracts/
│   │   └── [id]/
│   │       └── page.tsx      ← Contract detail page
│   └── alerts/
│       └── page.tsx          ← Alerts page
├── components/
│   ├── ui/                   ← shadcn components (auto-generated)
│   ├── Navbar.tsx            ← Navigation bar
│   ├── ContractCard.tsx      ← Ek contract ka card
│   ├── ChatWindow.tsx        ← Chat interface
│   ├── FileUpload.tsx        ← Drag-drop upload
│   ├── SearchBar.tsx         ← Search bar
│   ├── StatsCard.tsx         ← Dashboard stat card
│   └── RiskBadge.tsx         ← Risk level badge (Low/Medium/High)
├── hooks/
│   └── useAuth.ts            ← Auth custom hook
├── lib/
│   └── firebase.ts           ← Firebase config
└── utils/
    └── helpers.ts            ← Helper functions
```
- Abhi sirf empty folders aur placeholder files banao
- Har file mein basic export likh do taaki errors na aaye

**Kaam 5: Layout setup karo with Google Fonts**
- `app/layout.tsx` mein Inter font add karo (Google Fonts se)
- Global CSS mein color variables define karo (dark blue, accent green, etc.)
- Ek basic color palette decide karo team ke saath

**Kaam 6: GitHub pe push karo**
```bash
git add .
git commit -m "feat: initialize next.js frontend with tailwind and shadcn"
git push origin frontend
```

---

### 👨‍💻 Dev 2 (Backend) — Aaj kya karega:

**Kaam 1: FastAPI project setup karo**
```bash
# Project root mein backend folder banao
mkdir backend
cd backend

# Virtual environment banao (important! — isse packages isolated rehte hai)
python -m venv venv

# Activate karo:
# Windows pe:
.\venv\Scripts\activate
# Mac/Linux pe:
source venv/bin/activate

# Activate hone ke baad terminal mein (venv) dikhega
```

**Kaam 2: Saare packages install karo**
```bash
pip install fastapi uvicorn pdfplumber python-docx google-generativeai firebase-admin python-multipart python-dotenv

# Requirements file banao (deployment ke liye zaruri hai)
pip freeze > requirements.txt
```
- `fastapi` → API framework (Flask jaisa but faster)
- `uvicorn` → Server chalane ke liye
- `pdfplumber` → PDF se text nikalne ke liye
- `python-docx` → DOCX se text nikalne ke liye
- `google-generativeai` → Gemini API call karne ke liye
- `firebase-admin` → Firestore/Storage access karne ke liye (server side)
- `python-multipart` → File upload accept karne ke liye
- `python-dotenv` → .env file se variables load karne ke liye

**Kaam 3: Folder structure banao**
```
backend/
├── main.py                   ← Entry point — FastAPI app yahan banega
├── routes/
│   ├── __init__.py
│   ├── auth.py               ← Login/verify endpoints
│   ├── upload.py             ← File upload endpoint
│   ├── analyze.py            ← Gemini analysis endpoint
│   ├── chat.py               ← Contract Q&A endpoint
│   ├── search.py             ← Smart search endpoint
│   └── contracts.py          ← Contract list/detail endpoints
├── services/
│   ├── __init__.py
│   ├── gemini.py             ← Gemini API calls
│   ├── firebase.py           ← Firestore + Storage operations
│   └── file_processor.py     ← PDF/DOCX text extraction
├── models/
│   ├── __init__.py
│   └── schemas.py            ← Pydantic models (request/response shapes)
├── utils/
│   ├── __init__.py
│   └── helpers.py            ← Date formatting, validation, etc.
├── requirements.txt
└── .env                      ← API keys (NEVER commit this!)
```

**Kaam 4: Basic FastAPI server likho (`main.py`)**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SportLex AI API", version="1.0.0")

# CORS — frontend ko backend se baat karne do
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "message": "SportLex AI Backend is running!"}
```

**Kaam 5: Server test karo**
```bash
uvicorn main:app --reload --port 8000
# Browser mein jaao: http://localhost:8000/api/health
# Yeh dikhna chahiye: {"status": "healthy", "message": "SportLex AI Backend is running!"}
# Swagger docs: http://localhost:8000/docs
```

**Kaam 6: GitHub pe push karo**
```bash
# .gitignore mein add karo:
# venv/
# .env
# __pycache__/
# *.pyc

git add .
git commit -m "feat: initialize fastapi backend with health check"
git push origin backend
```

---

### 👨‍💻 Dev 3 (Firebase + GitHub) — Aaj kya karega:

**Kaam 1: Firebase project banao**
1. Jaao `console.firebase.google.com` pe
2. "Add Project" click karo → Name: `sportlex-ai`
3. Google Analytics enable karo (optional but recommended)
4. Project ban jaayega — iske baad:

**Kaam 2: Authentication enable karo**
1. Firebase Console → Authentication → Get Started
2. "Sign-in method" tab pe jaao
3. "Google" provider ko ENABLE karo
4. Support email daal do (apna Gmail)
5. Save karo

**Kaam 3: Firestore Database banao**
1. Firebase Console → Firestore Database → Create Database
2. **Production mode** select karo (we'll set rules manually)
3. Location: `asia-south1` (Mumbai — sabse fast India ke liye)
4. Create karo

**Kaam 4: Storage enable karo**
1. Firebase Console → Storage → Get Started
2. Production mode select karo
3. Location same: `asia-south1`

**Kaam 5: Credentials generate karo aur share karo**

*Backend ke liye (Service Account Key):*
1. Firebase Console → Project Settings (gear icon) → Service Accounts
2. "Generate new private key" click karo
3. Ek JSON file download hogi — YAHI hai service account key
4. Isko Dev 2 ko bhejo (PRIVATELY — WhatsApp/DM pe, GitHub pe KABHI mat daalo!)

*Frontend ke liye (Web Config):*
1. Firebase Console → Project Settings → General → scroll down
2. "Add App" → Web (</> icon) click karo
3. App nickname: `sportlex-frontend`
4. Register karo
5. Config object dikhega — kuch aisa:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "sportlex-ai.firebaseapp.com",
  projectId: "sportlex-ai",
  storageBucket: "sportlex-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```
6. Yeh config Dev 1 ko bhejo

**Kaam 6: GitHub repo create karo**
```bash
# GitHub pe new repo banao: "sportlex-ai"
# Clone karo:
git clone https://github.com/your-team/sportlex-ai.git
cd sportlex-ai

# Branches banao:
git checkout -b frontend    # Dev 1 ke liye
git checkout -b backend     # Dev 2 ke liye
git checkout -b dev         # Integration testing ke liye
git checkout main           # Production branch
```

**Kaam 7: .gitignore file banao (root level)**
```
# Dependencies
node_modules/
venv/
__pycache__/

# Environment
.env
.env.local
*.pyc

# Firebase
service-account-key.json
firebase-debug.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
```

**Kaam 8: Sab credentials ek jagah compile karo**
- Ek private Google Doc / Notion page banao
- Usme daal do: Firebase config, service account key location, Gemini API key (baad mein)
- Sirf team members ke saath share karo

---

**✅ Day 1 khatam hone pe yeh hona chahiye:**
- [x] Dev 1 ka Next.js app localhost:3000 pe chal raha hai
- [x] Dev 2 ka FastAPI server localhost:8000 pe chal raha hai
- [x] Firebase project live hai (Auth + Firestore + Storage)
- [x] GitHub repo ready hai with branches
- [x] Sabke paas credentials hai

---

---

## 🗓️ DAY 2 — Authentication Setup (18 March)

**🎯 Aaj ka goal:** Login page banana (Dev 1), backend pe token verify karna (Dev 2), Firestore ka structure decide karna (Dev 3).

---

### 👨‍💻 Dev 1 — Aaj kya karega:

**Kaam 1: Firebase config file banao — `lib/firebase.ts`**
```typescript
// frontend/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```
- `.env.local` file banao `frontend/` mein aur Dev 3 se mili values daal do

**Kaam 2: AuthContext banao — `hooks/useAuth.ts`**
- React Context banao jo track kare ki user logged in hai ya nahi
- `onAuthStateChanged` listener lagao — jab bhi auth state change ho, update karo
- `user`, `loading`, `login()`, `logout()` expose karo
- Pura app ko `AuthProvider` se wrap karo `layout.tsx` mein

**Kaam 3: Login Page banao — `app/page.tsx`**
- Ek beautiful page banao with:
  - SportLex AI ka naam bada mein (heading)
  - Tagline: "AI-Powered Legal Intelligence for Sports"
  - Google Sign In button (bada, prominent, colorful)
  - Background mein subtle gradient ya pattern
- Note: Abhi sirf login functionality — landing page Day 3 mein banayenge

**Kaam 4: ProtectedRoute wrapper banao**
- Ek component banao jo check kare: user logged in hai?
- Agar nahi → redirect to login page (`/`)
- Agar haan → children render karo
- Dashboard, Upload, aur baaki pages yeh wrapper use karenge

**Kaam 5: Basic dashboard placeholder banao**
- `app/dashboard/page.tsx` mein ek simple page banao: "Welcome to Dashboard"
- Login ke baad yahan redirect hona chahiye
- ProtectedRoute se wrap karo

---

### 👨‍💻 Dev 2 — Aaj kya karega:

**Kaam 1: Firebase Admin SDK setup — `services/firebase.py`**
```python
# backend/services/firebase.py
import firebase_admin
from firebase_admin import credentials, firestore, storage

cred = credentials.Certificate("service-account-key.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': 'sportlex-ai.appspot.com'
})

db = firestore.client()
bucket = storage.bucket()
```
- Dev 3 se mili service account key JSON file ko `backend/` mein rakho
- `.env` mein path daal do

**Kaam 2: Auth middleware banao**
- Frontend se har request mein `Authorization: Bearer <token>` header aayega
- Backend pe yeh token verify karna hai using Firebase Admin SDK
- Agar valid → request allow karo, user info extract karo
- Agar invalid → 401 Unauthorized return karo

**Kaam 3: Auth verify endpoint — `routes/auth.py`**
```python
# POST /api/auth/verify
# Frontend se token aayega → verify karke user info return karo
# Response: { uid, email, name, picture }
```

**Kaam 4: Pydantic models banao — `models/schemas.py`**
- Request aur Response ke shapes define karo:
  - `ContractUpload` — filename, category
  - `ContractResponse` — id, name, category, dates, risk_level
  - `ChatRequest` — contract_id, question
  - `ChatResponse` — answer, sources
  - `AnalysisResponse` — summary, parties, dates, risks
- Abhi sirf models define karo, use baad mein hoga

**Kaam 5: Postman se test karo**
- `/api/health` test karo — 200 OK aana chahiye
- `/api/auth/verify` test karo — valid token ke saath

---

### 👨‍💻 Dev 3 — Aaj kya karega:

**Kaam 1: Firestore security rules likho**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Sirf logged-in users read/write kar sakte hai
    match /contracts/{contractId} {
      allow read, write: if request.auth != null;
    }
    match /contracts/{contractId}/chats/{chatId} {
      allow read, write: if request.auth != null;
    }
  }
}
```
- Firebase Console → Firestore → Rules tab mein yeh paste karo

**Kaam 2: Storage security rules likho**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /contracts/{allPaths=**} {
      allow read, write: if request.auth != null;
      allow read, write: if request.resource.size < 10 * 1024 * 1024; // Max 10MB
    }
  }
}
```

**Kaam 3: Firestore collection structure design karo**

Yeh document likh ke team ke saath share karo:
```
📁 contracts (collection)
└── 📄 {contract_id} (document)
    ├── filename: "rohit_sharma_contract.pdf"
    ├── category: "player"              (player/sponsor/broadcaster/partner)
    ├── upload_date: Timestamp
    ├── uploader_id: "user_uid"
    ├── uploader_name: "Anil Kumar"
    ├── storage_url: "gs://sportlex-ai.../contracts/xyz.pdf"
    ├── extracted_text: "Full contract text..."
    ├── status: "analyzed"              (uploaded/analyzing/analyzed/error)
    ├── analysis: {                     (Gemini se aaya hua data)
    │   ├── summary: "This is a 3-year player..."
    │   ├── parties: ["Rohit Sharma", "Mumbai Indians"]
    │   ├── start_date: "2024-01-01"
    │   ├── end_date: "2027-12-31"
    │   ├── payment_terms: "₹16 Cr per year..."
    │   ├── penalty_clauses: ["Early termination: ₹5 Cr", ...]
    │   ├── risk_flags: ["No injury clause", "Vague IP terms", ...]
    │   └── risk_level: "medium"        (low/medium/high)
    │ }
    └── 📁 chats (sub-collection)
        └── 📄 {chat_id}
            ├── question: "What is the penalty?"
            ├── answer: "According to clause 7.2..."
            ├── timestamp: Timestamp
            └── user_id: "user_uid"
```

**Kaam 4: API documentation start karo**
- Google Doc ya Notion mein ek page banao
- Har endpoint likh do:

| Method | Endpoint | Kya karta hai | Kaun banayega |
|--------|----------|---------------|---------------|
| GET | `/api/health` | Server check | Dev 2 ✅ |
| POST | `/api/auth/verify` | Token verify | Dev 2 |
| POST | `/api/upload` | File upload | Dev 2 |
| POST | `/api/analyze/{id}` | Gemini analysis | Dev 2 |
| GET | `/api/contracts` | All contracts list | Dev 2 |
| GET | `/api/contracts/stats` | Dashboard stats | Dev 2 |
| GET | `/api/contracts/{id}` | Contract detail | Dev 2 |
| POST | `/api/chat` | Contract Q&A | Dev 2 |
| POST | `/api/search` | Smart search | Dev 2 |
| GET | `/api/alerts` | Expiring contracts | Dev 2 |

---

**✅ Day 2 khatam hone pe:**
- [x] Login page ready hai (Dev 1)
- [x] Backend token verification kaam kar raha hai (Dev 2)
- [x] Firestore structure documented hai (Dev 3)
- [x] Security rules set hai (Dev 3)

---

---

## 🗓️ DAY 3 — Auth Integration + Landing Page (19 March)

**🎯 Aaj ka goal:** Login pura kaam kare end-to-end. Landing page sexy dikhe.

---

### 👨‍💻 Dev 1 — Aaj kya karega:

**Kaam 1: Frontend ↔ Backend auth connect karo**
- Login hone ke baad Firebase se `idToken` lo
- Yeh token backend ke `/api/auth/verify` pe bhejo
- Backend verify kare → user info return kare
- Frontend mein user info store karo (context mein)

**Kaam 2: Beautiful Landing Page banao**
- Hero Section:
  - Bada heading: "SportLex AI"
  - Subheading: "AI-Powered Legal Intelligence for Sports Organizations"
  - CTA Button: "Get Started with Google" (jo login trigger kare)
  - Background: Gradient (dark blue → purple) ya animated pattern
- Features Section (3-4 cards):
  - 🔍 "AI Contract Analysis" — Gemini analyzes your contracts
  - 💬 "Chat with Contracts" — Ask questions, get answers
  - 🔔 "Smart Alerts" — Never miss a deadline
  - 📊 "Dashboard" — All contracts in one place
- How It Works (3 steps):
  - Upload → AI Analyzes → Get Insights
- Team Section: Team ClutchCode ke members
- Footer: Links, copyright, "Built for Solution Challenge 2026"

**Kaam 3: Smooth animations daalo**
- Hero text fade-in from bottom (framer-motion)
- Feature cards stagger animation
- Smooth scroll between sections

**Kaam 4: Login ke baad `/dashboard` pe redirect karo**

---

### 👨‍💻 Dev 2 — Aaj kya karega:

**Kaam 1: Dev 1 ke saath auth flow test karo**
- Frontend se token aaye → backend verify kare → response jaaye back
- Console mein check karo: user email, name, UID

**Kaam 2: Utility functions banao — `utils/helpers.py`**
```python
# Date formatting
def format_date(date_string):
    # "2024-01-15" → "15 Jan 2024"

# File validation  
def is_valid_file(filename):
    # Check if PDF or DOCX

# Contract status check
def get_contract_status(end_date):
    # Return: "active" / "expiring" / "expired"
```

**Kaam 3: Error handling middleware banao**
- Har API error ka structured response hona chahiye:
```json
{
  "success": false,
  "error": "File too large",
  "detail": "Maximum file size is 10MB. Your file is 15MB."
}
```

**Kaam 4: Logging setup karo**
- Python `logging` module use karo
- Har request log karo: endpoint, method, user, response time

---

### 👨‍💻 Dev 3 — Aaj kya karega:

**Kaam 1: Auth flow end-to-end test karo**
- Apne Google account se login karo → verify karo ki dashboard dikhe
- Ek aur Google account se try karo (phone se ya incognito se)
- Network tab mein dekho ki token sahi ja raha hai

**Kaam 2: Edge cases test karo**
- Invalid token bhejo → 401 aana chahiye
- Expired token bhejo → proper error aana chahiye
- Bina token ke request bhejo → reject hona chahiye

**Kaam 3: Firestore mein user data verify karo**
- Login ke baad Firebase Console mein jaao
- Check karo ki user ka data Firestore mein save ho raha hai ya nahi

**Kaam 4: Bugs document karo**
- Jo bhi issues mile → GitHub Issues mein create karo
- Label lagao: `bug`, `auth`, `frontend`, `backend`

---

**✅ Day 3 khatam hone pe:**
- [x] Google Login KAAM KAR RAHA HAI end-to-end! 🎉
- [x] Landing page SEXY lag rahi hai
- [x] Login → Dashboard redirect ho raha hai
- [x] Firebase mein user data save ho raha hai

---

---

# 🟢 PHASE 2: CORE FEATURES (Day 4–8)

---

## 🗓️ DAY 4 — Contract Upload Backend (20 March)

**🎯 Aaj ka goal:** Backend file accept kare, text nikale, Firebase mein save kare.

---

### 👨‍💻 Dev 1 — Upload UI banao:

**Kaam 1: Upload page banao — `app/upload/page.tsx`**
- Beautiful page with:
  - Heading: "Upload Contract"
  - Drag & drop zone (bada box — "Drop your PDF/DOCX here")
  - Ya "Browse Files" button
  - Category dropdown: Player | Sponsor | Broadcaster | Partner
  - Upload button
  - Progress bar (file upload progress dikhane ke liye)

**Kaam 2: File validation frontend pe karo**
- Sirf PDF aur DOCX allow karo
- Max size: 10MB
- Agar wrong file type → red error message dikhao
- Agar too large → "File is too big (max 10MB)" dikhao

**Kaam 3: Drag & drop implement karo**
- `onDragOver`, `onDrop` events use karo
- File drop hone pe preview dikhao (filename + size + icon)
- PDF ka 📄 icon, DOCX ka 📝 icon

---

### 👨‍💻 Dev 2 — Upload API banao:

**Kaam 1: Upload endpoint — `routes/upload.py`**
```python
# POST /api/upload
# Input: file (PDF/DOCX), category (string), user_id (from auth token)
# Process:
#   1. File validate karo (type + size)
#   2. Text extract karo (pdfplumber / python-docx)
#   3. Firebase Storage mein file upload karo
#   4. Firestore mein metadata save karo
#   5. Contract ID return karo
```

**Kaam 2: Text extraction — `services/file_processor.py`**
```python
import pdfplumber
from docx import Document

def extract_text_from_pdf(file_bytes):
    # pdfplumber se har page ka text nikalo
    # Saare pages ka text join karo
    # Return: full text string

def extract_text_from_docx(file_bytes):
    # python-docx se paragraphs nikalo
    # Join karo
    # Return: full text string

def extract_text(file_bytes, filename):
    if filename.endswith('.pdf'):
        return extract_text_from_pdf(file_bytes)
    elif filename.endswith('.docx'):
        return extract_text_from_docx(file_bytes)
    else:
        raise ValueError("Unsupported file type")
```

**Kaam 3: Firebase Storage mein file save karo**
```python
# File ko storage mein upload karo:
# Path: contracts/{contract_id}/{filename}
# Download URL generate karo
```

**Kaam 4: Firestore mein metadata save karo**
```python
# contracts collection mein naya document:
# {
#   filename, category, upload_date, uploader_id,
#   storage_url, extracted_text, status: "uploaded"
# }
```

---

### 👨‍💻 Dev 3 — Demo contracts banao:

**Kaam 1: 3 sample contracts banao aaj (baaki kal)**

**Contract 1: Rohit Sharma Player Contract**
- Word/PDF mein ek fake contract likho (2-3 pages):
- Parties: Rohit Sharma & Mumbai Indians (IPL)
- Duration: 1 Jan 2024 → 31 Dec 2027 (3 years)
- Payment: ₹16 Crore per season
- Bonus: ₹2 Cr for winning IPL
- Penalty: ₹5 Cr if contract broken before term
- Risk clauses: No injury insurance clause, vague IP rights

**Contract 2: Dream11 Sponsorship Agreement**
- Parties: Dream11 & BCCI
- Duration: 1 Apr 2024 → 31 Mar 2026
- Payment: ₹350 Crore for title sponsorship
- Rights: Logo on jersey, boundary boards, digital ads
- Penalty: ₹50 Cr for early termination
- Risk: Exclusivity clause is very broad

**Contract 3: JioCinema Broadcasting Rights**
- Parties: JioCinema (Viacom18) & IPL/BCCI
- Duration: 2024 → 2028
- Payment: ₹23,575 Crore for digital rights
- Rights: Exclusive digital streaming
- Penalty: Quality standards not met → ₹100 Cr
- Risk: No clause for technical outages

**Kaam 2: Postman se upload API test karo**
- Dev 2 ka server chalu karo: `uvicorn main:app --reload`
- Postman mein POST `/api/upload` hit karo with file
- Check karo ki text extract ho raha hai

---

**✅ Day 4 khatam hone pe:**
- [x] Upload UI ready hai (frontend)
- [x] Backend file process kar raha hai (text extraction working)
- [x] 3 demo contracts ready hai

---

---

## 🗓️ DAY 5 — Upload Integration + Demo Data (21 March)

**🎯 Aaj ka goal:** Frontend se file upload ho, backend process kare, Firebase mein jaaye. Pura flow working.

---

### 👨‍💻 Dev 1:
- Frontend upload form ko backend API se connect karo
- Upload progress bar working banao (file upload percentage dikhao)
- Success hone pe green toast dikhao: "Contract uploaded successfully! ✅"
- Error hone pe red toast: "Upload failed. Please try again."
- Success ke baad dashboard pe redirect karo
- Edge cases handle karo: network error, timeout, server down

### 👨‍💻 Dev 2:
- `/api/contracts` endpoint banao — GET all contracts (list)
- Backend pe bhi file validation lagao (type + size)
- Text extraction ko test karo saare demo PDFs ke saath
- Edge cases: password-protected PDF, empty PDF, scanned image PDF
- CORS double-check karo — frontend se requests aa rahi hongi

### 👨‍💻 Dev 3:
- Baaki 3 demo contracts banao:
  - **Nike Kit Partnership Deal** — Nike & Indian Cricket Team, kit manufacturing rights, ₹85 Cr/year, 5 years
  - **Wankhede Stadium Ground Agreement** — MCA & Event Company, stadium rental, match-day revenue sharing
  - **BCCI Media Rights Agreement** — BCCI & Star Sports, TV broadcasting, ₹6,138 Cr for 5 years
- Seed script likho (Python) — saare 6 contracts API se upload karo
- Full flow test karo: Choose file → Select category → Upload → Check Firestore

---

**✅ Day 5 khatam hone pe:**
- [x] Upload pura kaam kar raha hai: Frontend → Backend → Firebase ✅
- [x] 6 demo contracts uploaded aur Firestore mein hai ✅

---

---

## 🗓️ DAY 6 — Gemini AI Analysis (22 March)

**🎯 Aaj ka goal:** Contract upload hone ke baad Gemini automatically analyze kare aur results Firestore mein save ho.

---

### 👨‍💻 Dev 1:
- Upload page pe "Analyzing with AI..." loading animation banao (spinner + text)
- `ContractCard` component banao jo dashboard pe use hoga:
  - Contract name (bold)
  - Category badge (color-coded): 🏏 Player (blue) | 💰 Sponsor (green) | 📺 Broadcaster (purple) | 🤝 Partner (orange)
  - Risk badge: 🟢 Low | 🟡 Medium | 🔴 High
  - Upload date
  - Expiry date
- Dashboard page ka basic layout shuru karo

### 👨‍💻 Dev 2:
**IMPORTANT — Yeh aaj ka MAIN kaam hai:**

**Kaam 1: Gemini client — `services/gemini.py`**
```python
import google.generativeai as genai
import os, json

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-pro')

def analyze_contract(contract_text):
    prompt = f"""You are a legal analyst specializing in sports contracts.
    Analyze this contract and return ONLY a valid JSON (no markdown, no explanation).
    
    JSON fields required:
    - summary: 2-3 sentence summary
    - parties: array of party names
    - start_date: YYYY-MM-DD format
    - end_date: YYYY-MM-DD format  
    - payment_terms: string describing payment
    - penalty_clauses: array of penalty strings
    - risk_flags: array of risk description strings
    - risk_level: "low" or "medium" or "high"

    Contract text:
    {contract_text}"""
    
    response = model.generate_content(prompt)
    # Parse JSON from response
    result = json.loads(response.text)
    return result
```

**Kaam 2: Analyze endpoint — `routes/analyze.py`**
- `POST /api/analyze/{contract_id}`
- Firestore se contract text fetch karo
- Gemini ko bhejo → JSON response aaye
- Response ko Firestore mein save karo (contract document mein `analysis` field)
- Contract status update karo: "uploaded" → "analyzing" → "analyzed"

**Kaam 3: Auto-analyze trigger**
- Upload hone ke baad automatically analyze call karo
- Background mein chale (user ko wait nahi karana)

**Kaam 4: Error handling**
- Gemini API fail ho jaaye → retry 3 times (2 sec gap)
- JSON parse fail ho jaaye → re-prompt karo
- Token limit exceed → text truncate karo

### 👨‍💻 Dev 3:
- Gemini API key generate karo: `aistudio.google.com` → Get API Key
- Key Dev 2 ko do (`.env` mein daalega)
- Saare 6 demo contracts analyze karwao
- Gemini ka output check karo — JSON sahi hai? Dates correct hai? Risk flags make sense?
- Agar output galat aata hai → prompt tweak karo Dev 2 ke saath
- Final working prompt document karo

---

**✅ Day 6 khatam hone pe:**
- [x] Gemini analysis KAAM KAR RAHI HAI! 🤖
- [x] Upload → Auto-analyze → Results saved in Firestore
- [x] 6 demo contracts analyzed

---

---

## 🗓️ DAY 7 — Dashboard Build (23 March)

**🎯 Aaj ka goal:** Dashboard pe stats dikhein, contract cards dikhein, data real ho.

---

### 👨‍💻 Dev 1:
- **Stats cards banao** (4 cards, top of dashboard):
  - 📋 Total Contracts: `24` (number count-up animation)
  - ⚠️ Expiring Soon: `5` (next 30 days mein expire hone wale)
  - 🔴 High Risk: `3` (risk_level = "high" wale)
  - 📊 Categories: Pie chart (Player: 8, Sponsor: 6, Broadcaster: 5, Partner: 5)
- **Contract grid banao** (below stats):
  - ContractCard components grid layout mein
  - Har card clickable → contract detail page pe jaaye
- **Navbar/Sidebar banao**:
  - Logo: SportLex AI
  - Links: Dashboard, Upload, Alerts
  - User avatar + logout button
- Responsive banao: Mobile pe 1 column, tablet pe 2, desktop pe 3-4

### 👨‍💻 Dev 2:
- `GET /api/contracts/stats` banao:
```json
{
  "total": 24,
  "expiring_soon": 5,
  "high_risk": 3,
  "categories": {"player": 8, "sponsor": 6, "broadcaster": 5, "partner": 5}
}
```
- `GET /api/contracts?category=player&status=active&sort=date` banao:
  - Query params se filter karo
  - Status calculate karo: end_date > today → active, end_date < today → expired, end_date within 30 days → expiring
- `GET /api/contracts/expiring` banao — 30 din mein expire hone wale

### 👨‍💻 Dev 3:
- Postman se saare endpoints test karo
- Dashboard pe dikhaya data Firestore se match karta hai? Verify karo
- Stats accurate hai? Count karo manually bhi
- README.md shuru karo — project description, tech stack likh do

---

**✅ Day 7 khatam hone pe:**
- [x] Dashboard REAL data dikha raha hai
- [x] Stats cards, pie chart, contract grid — sab working

---

---

## 🗓️ DAY 8 — Dashboard Polish + Filters (24 March)

**🎯 Aaj ka goal:** Dashboard pe filters, sorting, search, loading states — sab kuch smooth.

---

### 👨‍💻 Dev 1:
- **Filter bar banao**: Category dropdown + Status toggle (Active/Expired/Expiring)
- **Sorting**: By date (newest first) | By risk (high first)
- **Search bar**: Contract name search (simple text match)
- **Loading skeletons**: Jab data fetch ho raha ho tab shimmer effect dikhao
- **Empty states**: "No contracts found" with illustration
- **Card hover effects**: Scale up + shadow increase on hover
- Pura dashboard responsive check karo (phone pe bhi accha dikhe)

### 👨‍💻 Dev 2:
- Firestore composite indexes banao (category + status + date ke liye)
- Pagination add karo: `?page=1&limit=10`
- Stats response cache karo (har request pe naya calculate mat karo)
- Input sanitization — SQL injection type cheezein rok do

### 👨‍💻 Dev 3:
- Har filter combination test karo: Player + Active, Sponsor + Expired, etc.
- Edge cases: 0 results, all expired, all high risk
- API response time measure karo (< 500ms hona chahiye)
- UI bugs report karo

---

**✅ Day 8 khatam hone pe:**
- [x] Dashboard production-ready hai — filters, sort, search, responsive, polished ✅

---

---

# 🟡 PHASE 3: ADVANCED FEATURES (Day 9–11)

---

## 🗓️ DAY 9 — Contract Detail Page (25 March)

**🎯 Aaj ka goal:** Kisi bhi contract pe click karo → puri AI analysis dikhao beautifully.

### 👨‍💻 Dev 1:
- `app/contracts/[id]/page.tsx` banao with sections:
  - **Breadcrumb**: Dashboard > Rohit Sharma Contract
  - **Summary card**: AI-generated summary (2-3 lines)
  - **Key Parties**: List with avatars/icons
  - **Timeline bar**: Start date ──────── End date (visual progress bar)
  - **Payment Terms**: Highlighted info box (blue background)
  - **Penalty Clauses**: Warning cards (yellow/orange background)
  - **Risk Flags**: Red badges with ⚠️ icon
  - **Risk Level meter**: Green → Yellow → Red visual indicator
  - **Download button**: "📥 Download Original PDF"

### 👨‍💻 Dev 2:
- `GET /api/contracts/{id}` — pura contract detail + analysis return karo
- `GET /api/contracts/{id}/download` — Firebase Storage signed URL generate karo (valid for 1 hour)
- `POST /api/contracts/{id}/reanalyze` — dobara Gemini se analyze karwao

### 👨‍💻 Dev 3:
- Saare 6 contracts ka detail page check karo
- Download button test karo — PDF download ho raha hai?
- Risk flags sahi dikh rahe hai? Colors correct hai?
- Chrome, Firefox, Edge mein test karo

---

## 🗓️ DAY 10 — Chat with Contract (26 March)

**🎯 Aaj ka goal:** Contract ke saath baat karo! Question poocho, AI jawab de.

### 👨‍💻 Dev 1:
- Contract detail page pe **chat panel** banao (right side ya bottom tab):
  - Chat bubbles: User (blue, right) | AI (gray, left)
  - Input field + Send button (Enter se bhi send ho)
  - Typing indicator: "..." animation jab AI soch raha ho
  - Auto-scroll: Naye messages pe automatically neeche scroll ho
  - **Suggested questions** (clickable chips):
    - "What is the penalty for early termination?"
    - "When does this contract expire?"
    - "What are the payment terms?"
    - "Who are the parties involved?"
    - "Are there any risk clauses?"

### 👨‍💻 Dev 2:
- `POST /api/chat` banao:
  - Input: `{ contract_id: "abc", question: "What is the penalty?" }`
  - Backend: Firestore se contract text lo → Gemini ko question + text bhejo
  - Gemini prompt: *"You are a legal assistant for sports contracts. Answer ONLY from this contract. Be specific, cite clause numbers. Question: {q}. Contract: {text}"*
  - Response: `{ answer: "According to clause 7.2, the penalty is..." }`
  - Chat history Firestore mein save karo

### 👨‍💻 Dev 3:
- Har contract pe 8-10 questions poocho:
  - "What is the total contract value?"
  - "What happens if the contract is terminated early?"
  - "Are there any performance bonuses?"
  - "What are the payment milestones?"
  - "Is there a non-compete clause?"
- Off-topic question poocho: "What is the weather today?" → AI should say "Not found in contract"
- Response time measure karo — 5 sec se kam hona chahiye

---

## 🗓️ DAY 11 — Smart Search + Alerts (27 March)

**🎯 Aaj ka goal:** Dashboard pe search bar se natural language mein search karo + expiring contracts alerts dikhao.

### 👨‍💻 Dev 1:
- Dashboard pe **bada search bar** banao (top center, prominent)
- Search results: Matching contracts with relevance reason
- **Alerts section** banao:
  - 🔴 7 din se kam mein expire: RED card
  - 🟠 15 din se kam: ORANGE card
  - 🟡 30 din se kam: YELLOW card
  - Har card pe "X days remaining" badge
- Navbar pe notification dot (alerts count)

### 👨‍💻 Dev 2:
- `POST /api/search` banao:
  - Input: `{ query: "Which contracts have penalty clauses?" }`
  - Process: Saare contracts ke summaries fetch karo → Gemini ko bhejo with query → matching contract IDs return karo
- `GET /api/alerts` banao: Expiring contracts sorted by urgency

### 👨‍💻 Dev 3:
- Search test karo with queries:
  - "Show all contracts expiring in June"
  - "Which player contracts have bonus clauses?"
  - "Find all Nike related agreements"
  - "What contracts have penalty risks?"
- Alerts test karo — dates sahi hai? Colors sahi hai?

---

---

# 🟠 PHASE 4: POLISH & PERFECTION (Day 12–13)

---

## 🗓️ DAY 12 — UI Polish + Animations (28 March)

### 👨‍💻 Dev 1:
- **Dark mode** toggle lagao (navbar mein sun/moon icon)
- **Animations** (framer-motion):
  - Page transitions: fade + slide
  - Cards: hover scale 1.02 + shadow increase
  - Stats numbers: count-up animation (0 → 24)
  - Chat messages: slide-in from bottom
  - Loading: skeleton shimmer effect
- **Landing page polish**: Gradient backgrounds, glassmorphism effects
- **Typography**: Sab jagah consistent fonts, sizes, spacing

### 👨‍💻 Dev 2:
- Rate limiting lagao (100 requests/minute per user)
- Input validation tighten karo
- Error messages user-friendly banao
- Gemini prompt optimize karo (kam tokens use ho)
- Swagger docs finalize karo (`/docs` pe sab dikhna chahiye)

### 👨‍💻 Dev 3:
- **Full E2E test**: Login → Upload → Analysis → Dashboard → Detail → Chat → Search → Alerts
- Har screen size pe test karo: Phone (320px), Tablet (768px), Laptop (1366px), Desktop (1920px)
- Dark mode har page pe test karo
- Accessibility check: Color contrast, font sizes readable hai?

---

## 🗓️ DAY 13 — Bug Fixes + Responsiveness (29 March)

### 👨‍💻 Dev 1:
- Mobile pe navigation fix karo (hamburger menu)
- Layout breaks fix karo (small screens)
- 404 page banao (beautiful, with "Go Home" button)
- Images lazy load karo
- Error boundary components lagao (crash hone pe graceful fallback)

### 👨‍💻 Dev 2:
- Edge cases handle karo: empty PDF, 50+ page PDF, Gemini timeout, concurrent uploads
- Stress test: 10 requests ek saath bhejo — server crash toh nahi hota?
- Health check endpoint finalize karo

### 👨‍💻 Dev 3:
- "New user" banke poora app use karo — kahan confusion hota hai?
- Slow internet pe test karo (Chrome DevTools → Network → Slow 3G)
- Logout → Login → data wapas aata hai? Check karo
- SCREENSHOTS le lo har page ke — README aur presentation ke liye

---

---

# 🔴 PHASE 5: SHIP IT! (Day 14–15)

---

## 🗓️ DAY 14 — Deployment (30 March)

### 👨‍💻 Dev 1 — Frontend Vercel pe deploy karo:
1. `vercel.com` pe jaao → GitHub se login karo
2. "Import Project" → apna GitHub repo select karo
3. Framework: Next.js (auto-detect hoga)
4. Root directory: `frontend/`
5. Environment variables add karo (saare `NEXT_PUBLIC_*` wale)
6. Deploy karo! → URL milega: `sportlex-ai.vercel.app`
7. Test karo production pe — login karo, pages check karo

### 👨‍💻 Dev 2 — Backend Render pe deploy karo:
1. `render.com` pe jaao → GitHub se connect karo
2. "New Web Service" → repo select karo
3. Root directory: `backend/`
4. Build command: `pip install -r requirements.txt`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Environment variables add karo: `GEMINI_API_KEY`, `FIREBASE_CREDENTIALS`, `ALLOWED_ORIGINS`
7. `ALLOWED_ORIGINS` mein Vercel URL daal do
8. Deploy! → URL milega: `sportlex-ai-api.onrender.com`

### 👨‍💻 Dev 3 — Production testing:
- Production URL pe login karo (naye Google account se)
- Contract upload karo → analysis check karo
- Chat test karo, search test karo
- Phone pe test karo (real device pe)
- Demo data production Firestore mein upload karo

---

## 🗓️ DAY 15 — Demo + Presentation (31 March)

### 👨‍💻 Dev 1:
- Production pe final visual check karo
- Screen recording banao (OBS Studio ya Loom se)
- Key features ke animated GIFs banao (ScreenToGif)

### 👨‍💻 Dev 2:
- API final test karo production pe
- Architecture diagram banao (draw.io ya Excalidraw)
- Technical slides mein contribute karo

### 👨‍💻 Dev 3:
- **Presentation banao** (Google Slides — 10-11 slides):
  1. Title: SportLex AI — Team ClutchCode
  2. Problem: Sports orgs manage 100s of contracts scattered everywhere
  3. Solution: AI-powered central platform
  4. Features: Screenshots ke saath
  5. Tech Architecture: Diagram
  6. AI Integration: How Gemini analyzes + chats
  7. Demo: Video embed ya live demo
  8. Google Tech: Gemini API + Firebase (Auth + Firestore + Storage)
  9. Impact: Real problem for real organizations
  10. Future: Multi-language, blockchain verification, mobile app
  11. Team: ClutchCode members
- **Demo video record karo** (2-3 min)
- **README.md finalize karo** — live links, screenshots, setup instructions
- SUBMIT EVERYTHING! 🚀

---

---

## 🎯 Milestones Tracker

| # | Milestone | Date | Phase | Done? |
|:-:|-----------|:-:|:-:|:-:|
| 1 | Environment Ready | Day 1 (17 Mar) | 🔵 | ⬜ |
| 2 | Auth UI Ready | Day 2 (18 Mar) | 🔵 | ⬜ |
| 3 | Auth Working E2E | Day 3 (19 Mar) | 🔵 | ⬜ |
| 4 | Upload Backend | Day 4 (20 Mar) | 🟢 | ⬜ |
| 5 | Upload E2E | Day 5 (21 Mar) | 🟢 | ⬜ |
| 6 | Gemini Working | Day 6 (22 Mar) | 🟢 | ⬜ |
| 7 | Dashboard Basic | Day 7 (23 Mar) | 🟢 | ⬜ |
| 8 | Dashboard Complete | Day 8 (24 Mar) | 🟢 | ⬜ |
| 9 | Detail Page | Day 9 (25 Mar) | 🟡 | ⬜ |
| 10 | Chat Feature | Day 10 (26 Mar) | 🟡 | ⬜ |
| 11 | Search + Alerts | Day 11 (27 Mar) | 🟡 | ⬜ |
| 12 | UI Polished | Day 12 (28 Mar) | 🟠 | ⬜ |
| 13 | Bug-Free | Day 13 (29 Mar) | 🟠 | ⬜ |
| 14 | DEPLOYED! | Day 14 (30 Mar) | 🔴 | ⬜ |
| 15 | DEMO READY! | Day 15 (31 Mar) | 🔴 | ⬜ |

---

## 📋 Daily Standup — Roz Subah WhatsApp/Discord Pe

```
🟢 Kal kya kiya:
🔵 Aaj kya karunga:
🔴 Koi problem hai?:
```

---

## 🧑‍💻 Git Workflow

```
main          ← Production code (deploy hota hai yahan se)
├── frontend  ← Dev 1 yahan push karta hai
├── backend   ← Dev 2 yahan push karta hai
└── dev       ← Dev 3 yahan merge karke test karta hai

Daily Flow:
1. Dev 1 → commit & push to `frontend` branch
2. Dev 2 → commit & push to `backend` branch  
3. Dev 3 → dono ko `dev` mein merge karo → test karo
4. Sab kaam kare → `dev` → `main` mein merge karo
5. Vercel auto-deploy karega frontend
6. Render auto-deploy karega backend
```

---

## ⚠️ Agar Kuch Gadbad Ho Toh

| Problem | Kya karna hai |
|---------|--------------|
| Gemini API limit lag jaaye | Analysis results Firestore mein cache karo, retry with 2 sec delay |
| PDF ka text nahi nikla | Fallback: OCR use karo (pytesseract) ya manual text input option do |
| Firebase ka bill aa jaaye | Budget alert lagao ₹500 pe, efficient queries likho |
| Deployment mein issue | Day 12 se hi deploy try karo, last day pe mat chhodho |
| Team sync nahi ho raha | Daily 15-min call karo, WhatsApp group mein updates do |
| Gemini ka response galat aaye | Prompt refine karo, "return ONLY valid JSON" add karo |
| CORS error aaye | Backend mein `allow_origins` mein frontend URL check karo |
| Render server slow start ho | Loading state lagao frontend pe, "Server waking up..." message |

---

## 🏆 Demo Flow — 3 Min Mein Kya Dikhana Hai

```
⏱️ 0:00-0:20 → Landing Page dikhao (branding, features, tagline)
⏱️ 0:20-0:35 → Google Login karo (one click — simple!)
⏱️ 0:35-1:00 → Dashboard dikhao (stats, charts, contract cards, filters)
⏱️ 1:00-1:30 → Naya contract upload karo (drag-drop, AI analyzing...)
⏱️ 1:30-2:00 → Contract detail dikhao (summary, risks, parties)
⏱️ 2:00-2:20 → Chat mein 2 questions poocho (live AI answers!)
⏱️ 2:20-2:40 → Search karo: "Which contracts have penalties?"
⏱️ 2:40-2:50 → Alerts dikhao (expiring contracts)
⏱️ 2:50-3:00 → End slide: Tech stack + Team ClutchCode
```

---

> **Built with ❤️ by Team ClutchCode**
> **Powered by Google Gemini AI + Firebase**
> **Solution Challenge 2026 — Build with AI**

*Last Updated: 17 March 2026*
