# 🌍 VolunteerIQ (Solution Challenge 2026)

**VolunteerIQ** is an AI-powered smart resource allocation platform designed for NGOs. It turns scattered field data and community reports into immediate, targeted action through intelligent volunteer coordination. 

**Focus:** Social Impact & Modern Tech for Good
**Tech Stack:** Next.js 14, Tailwind CSS, shadcn/ui, FastAPI (Python), Google Gemini, Firebase.

---

## 🚀 The Fastest Way to Start (If already installed)

If you have already installed the packages once, you don't need to do it again! 

Simply double-click the **`start.bat`** file in the main folder. 
- It will automatically launch two terminal windows (one for Next.js, one for FastAPI).
- Open your browser and go to: **[http://localhost:3000](http://localhost:3000)**

---

## 🛠️ First-Time Setup (For Teammates)

If you just cloned this project on your laptop for the first time, follow these steps to install the required dependencies.

### 1. Prerequisites
Make sure your laptop has:
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)

### 2. Install Frontend 🎨
Open a terminal in the root folder and run:
```powershell
cd frontend
npm install
```

### 3. Install Backend 🧠
Open a terminal in the root folder and run this to create a virtual environment and install Python packages:
```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

---

## 🏃 Running Manually (Without `start.bat`)

If you prefer starting servers manually in VS Code terminals:

**Frontend Terminal:**
```powershell
cd frontend
npm run dev
```

**Backend Terminal:**
```powershell
cd backend
.venv\Scripts\activate
uvicorn main:app --reload
```

---

## 📁 What's Inside?
- `/frontend` - The gorgeous Light-Mode UI built with Next.js App Router.
- `/backend` - Core API engine powered by FastAPI & Gemini.
- `execution_plan.md` - Our tracking document for project phases.

> 🎉 **Happy Coding! Let's build something amazing for the Solution Challenge!**
