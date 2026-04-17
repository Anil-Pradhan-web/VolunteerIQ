# 🚀 VolunteerIQ Deployment Guide

**Frontend → Vercel** | **Backend → Render.com**

---

## Overview

| Service | Platform | URL Pattern |
|---|---|---|
| **Frontend** (Next.js) | Vercel | `https://volunteeriq.vercel.app` |
| **Backend** (FastAPI) | Render.com | `https://volunteeriq-api.onrender.com` |
| **Database** (PostgreSQL) | Render.com (or Neon) | Auto-provisioned via `render.yaml` |

---

## Part 1: Deploy Backend to Render

### Option A — Blueprint (One-Click, Recommended)

1. Push this repo to GitHub.
2. Go to **[render.com/deploy](https://render.com/deploy)** → **New → Blueprint**
3. Connect your GitHub repo. Render will auto-detect `render.yaml` at the repo root.
4. Fill in the **sync: false** environment variables (shown below).
5. Click **Apply** — Render creates both the web service and the PostgreSQL database.

### Option B — Manual Service

1. **New → Web Service** → Connect GitHub repo
2. Set **Root Directory** → `backend`
3. **Runtime**: Python 3
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `./start.sh`
6. **Health Check Path**: `/health`
7. Add a **Disk** → Mount Path: `/var/data`, Size: 1 GB

### Required Environment Variables (Render Dashboard)

| Variable | Value | Notes |
|---|---|---|
| `APP_ENV` | `production` | Already in render.yaml |
| `DATABASE_URL` | *(auto-filled by blueprint)* | From linked Render PostgreSQL |
| `UPLOAD_DIR` | `/var/data/uploads` | Already in render.yaml |
| `FIREBASE_PROJECT_ID` | `volenteeriq` | From Firebase Console |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-...@volenteeriq.iam.gserviceaccount.com` | Service account email |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` | From Firebase JSON key |
| `GEMINI_API_KEY` | `AIzaSy...` | From [aistudio.google.com](https://aistudio.google.com) |
| `GROQ_API_KEY` | `gsk_...` | From [console.groq.com](https://console.groq.com) |
| `FRONTEND_URL` | `https://volunteeriq.vercel.app` | Set AFTER Vercel deploy |
| `CORS_ORIGIN_REGEX` | `https://.*\.vercel\.app` | Already in render.yaml |

> **Getting Firebase Service Account Key:**
> 1. Firebase Console → Project Settings → Service Accounts
> 2. Generate new private key → Download JSON
> 3. Copy `client_email` → `FIREBASE_CLIENT_EMAIL`
> 4. Copy `private_key` → `FIREBASE_PRIVATE_KEY` (paste with literal `\n` as shown in the downloaded JSON)

### Notes
- Render free tier **spins down after 15 min inactivity** — first request takes ~30s. Upgrade to Starter ($7/mo) for always-on.
- The `render.yaml` blueprint provisions a **basic-256mb** PostgreSQL instance.

---

## Part 2: Deploy Frontend to Vercel

### Option A — Vercel Dashboard (Recommended)

1. Go to **[vercel.com/new](https://vercel.com/new)** → Import GitHub repo
2. **Framework Preset**: Next.js (auto-detected)
3. **Root Directory**: `frontend`
4. **Build Command**: `npm run build` *(auto-detected)*
5. **Output Directory**: `.next` *(auto-detected)*

### Option B — Vercel CLI

```bash
npm i -g vercel
cd frontend
vercel --prod
```

### Required Environment Variables (Vercel Dashboard)

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://volunteeriq-api.onrender.com` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyCVV...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `volenteeriq.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `volenteeriq` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `volenteeriq.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `1003284858894` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:1003284858894:web:ff6fb2...` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | `pk.eyJ1IjoiYW5pbC...` |

> **All values come from your existing `frontend/.env.local`** — just paste them into Vercel dashboard.

### After Vercel Deploy
Once you have your Vercel URL (e.g. `https://volunteeriq.vercel.app`):
1. Add it to Render env: `FRONTEND_URL=https://volunteeriq.vercel.app`
2. Add your Firebase project → **Authorized Domains** → add the Vercel domain

---

## Part 3: Firebase Auth Setup

1. **Firebase Console** → Authentication → Sign-in method → Enable **Google**
2. **Authorized Domains** → Add:
   - `volunteeriq.vercel.app` (your Vercel domain)
   - `volunteeriq-api.onrender.com` (your Render domain, if needed)
   - `localhost` (for local dev)

---

## Part 4: Post-Deploy Verification

```bash
# 1. Check backend health
curl https://volunteeriq-api.onrender.com/health

# 2. Check CORS is working (replace with your Vercel URL)
curl -H "Origin: https://volunteeriq.vercel.app" \
     -I https://volunteeriq-api.onrender.com/health

# 3. Check API docs
open https://volunteeriq-api.onrender.com/docs
```

**Expected responses:**
- `/health` → `{"status": "ok", "service": "VolunteerIQ API"}`
- CORS header → `Access-Control-Allow-Origin: https://volunteeriq.vercel.app`

---

## Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| Frontend shows "NEXT_PUBLIC_API_URL not configured" | Missing env var on Vercel | Add `NEXT_PUBLIC_API_URL` in Vercel dashboard → Settings → Environment Variables |
| Backend 503 on login | Firebase Admin SDK not initialized | Check `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` are set correctly |
| CORS errors in browser | `FRONTEND_URL` not set on Render | Add `FRONTEND_URL=https://your-app.vercel.app` to Render env vars |
| Upload fails in production | `UPLOAD_DIR` not mounted | Ensure Render disk is mounted at `/var/data`, set `UPLOAD_DIR=/var/data/uploads` |
| Render DB connection fails | `DATABASE_URL` uses `postgres://` scheme | The backend auto-normalizes to `postgresql://` — no action needed |
| Render spins down | Free tier limitation | Upgrade to Starter plan or use an external cron to ping `/health` every 10 min |

---

## Environment Summary

```
VOLUNTEER IQ/
├── backend/.env.example       ← Copy to .env for local dev
├── frontend/.env.example      ← Copy to .env.local for local dev
├── render.yaml                ← Deploy backend to Render (Blueprint)
└── vercel.json                ← Deploy frontend to Vercel (root config)
```
