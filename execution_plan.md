# VolunteerIQ Execution Plan
## Solution Challenge 2026 | Smart Resource Allocation | Team ClutchCode

Last updated: 30 March 2026
Deadline: 24 April 2026
Current phase: Stabilization, QA, deployment prep, and demo polish

---

## 1. Project Summary

VolunteerIQ is an AI-powered coordination platform for NGOs and volunteer networks. The product ingests community survey data, identifies urgent needs, creates actionable tasks, and helps teams match the right volunteers to the right field work.

### Current product direction
- Single shared NGO workspace using `default-ngo`
- Volunteer-first user flow with Google login
- AI-assisted operations powered by Gemini, with Groq support added for chat and matching fallback
- SQLite + SQLAlchemy for local development, with PostgreSQL planned for production

---

## 2. What Is Already Implemented

The execution plan has been updated to match the current codebase.

### Core platform
- [x] Next.js 14 frontend with App Router
- [x] FastAPI backend with modular route structure
- [x] SQLite + SQLAlchemy persistence layer
- [x] Firebase Authentication with Google login
- [x] Protected app shell and authenticated pages

### Volunteer management
- [x] Volunteer profile creation and editing
- [x] Skills, availability, location, and profile photo support
- [x] Volunteer listing and filtering endpoints

### Surveys and AI analysis
- [x] Survey upload flow
- [x] File parsing for `PDF`, `CSV`, `DOCX`, and `TXT`
- [x] Automatic AI analysis after upload
- [x] Structured analysis output: top problems, summary, recommended actions, response totals
- [x] Survey history endpoint and survey detail endpoint

### Tasks and assignments
- [x] Task create, list, detail, update, and delete endpoints
- [x] Task detail page in frontend
- [x] Volunteer assignment flow
- [x] Volunteer unassignment flow
- [x] Task status transitions through `open`, `assigned`, and `completed`

### Matching and operational intelligence
- [x] AI volunteer matching endpoint
- [x] Match results UI with score and explanation
- [x] Provider toggle for `gemini` and `groq`
- [x] Dashboard stats cards
- [x] Recent surveys panel
- [x] Top problem extraction from latest survey
- [x] Live operations map component

### Chat and demo readiness
- [x] Floating AI chat widget
- [x] Chat endpoint with NGO context built from tasks, volunteers, and surveys
- [x] Demo seed script with volunteers, surveys, tasks, and assignments

---

## 3. Current Architecture Snapshot

### Frontend
- Framework: Next.js 14
- Styling: Tailwind CSS + custom component layer
- Main pages:
  - `/`
  - `/login`
  - `/dashboard`
  - `/upload`
  - `/tasks`
  - `/tasks/[id]`
  - `/volunteers`
  - `/volunteer/profile`

### Backend
- Framework: FastAPI
- Routes:
  - `/api/auth/verify`
  - `/api/upload-survey`
  - `/api/surveys/{ngo_id}`
  - `/api/surveys/{ngo_id}/{survey_id}`
  - `/api/tasks`
  - `/api/tasks/{task_id}`
  - `/api/match-volunteers`
  - `/api/assign`
  - `/api/unassign`
  - `/api/assignments/{user_id}`
  - `/api/dashboard/{ngo_id}`
  - `/api/chat`
  - `/health`

### Data model
- `User`
- `Task`
- `Assignment`
- `Survey`

### AI providers
- Primary: Google Gemini
- Secondary/fallback: Groq

---

## 4. Feature Status

| Area | Status | Notes |
|------|--------|-------|
| Google login | Done | Firebase auth is integrated |
| Volunteer profile | Done | Editable skills, availability, location |
| Survey upload | Done | Local storage + extraction pipeline |
| Survey AI analysis | Done | Structured analysis returned and stored |
| Task CRUD | Done | Includes task detail and update flow |
| Volunteer matching | Done | Gemini and Groq provider support |
| Assignment flow | Done | Assign and unassign both exist |
| Dashboard metrics | Done | Stats, recent surveys, top problems |
| Live map | In progress | UI exists; production token/config still needs validation |
| AI chat | Done | Context-aware chat endpoint and widget exist |
| Demo data seeding | Done | `backend/seed_demo_data.py` |
| Automated testing | Pending | No reliable end-to-end verification documented yet |
| Deployment config | Pending | Final Vercel/Render production setup still needed |
| Submission docs | Pending | README and architecture docs need refresh |

---

## 5. Product Decisions Locked In

These decisions should be treated as the current baseline unless the team explicitly changes direction:

- We are no longer planning around Firestore or Firebase Storage.
- The current build is not using role-based NGO admin onboarding as the primary flow.
- The product currently operates as a shared NGO workspace centered on `default-ngo`.
- SQLite is the local source of truth for development and demos.
- AI output must be resilient to malformed model responses and should always degrade gracefully.

---

## 6. Remaining Plan Through Submission

### Phase A: Stabilize Core Experience
Target window: 30 March to 3 April

#### Priority outcomes
- Validate all primary flows end-to-end on fresh local setup
- Remove outdated assumptions from docs and setup instructions
- Confirm chat, matching, assignment, and upload flows work against seeded data
- Verify map behavior with and without Mapbox token

#### Tasks
- [ ] Run full seeded demo flow locally from clean database
- [ ] Confirm task detail page works for assign and unassign without regressions
- [ ] Validate survey upload on all supported file types
- [ ] Review error handling and fallback messaging for Gemini and Groq failures
- [ ] Refresh README to match current repository structure and product behavior

### Phase B: QA and Demo Polish
Target window: 4 April to 10 April

#### Priority outcomes
- Make the demo reliable
- Improve confidence in UI behavior across pages
- Eliminate rough edges before deployment

#### Tasks
- [ ] Add or document regression checklist for:
  - login
  - profile save
  - upload and analysis
  - task creation
  - volunteer matching
  - assignment and unassignment
  - dashboard loading states
  - chat responses
- [ ] Verify responsive behavior on mobile and laptop widths
- [ ] Ensure empty states and error states are present on every data page
- [ ] Validate seeded data looks polished in screenshots and demo walkthrough
- [ ] Prepare final demo dataset and freeze it

### Phase C: Deployment and Production Readiness
Target window: 11 April to 17 April

#### Priority outcomes
- Ship a stable hosted version early enough to absorb issues
- Avoid last-minute auth, CORS, or storage surprises

#### Tasks
- [ ] Deploy frontend to Vercel
- [ ] Deploy backend to Render or equivalent
- [ ] Add production environment variables
- [ ] Validate Firebase auth in production
- [ ] Validate file upload in production
- [ ] Validate chat and matching in production
- [ ] Confirm database strategy for production:
  - keep SQLite temporarily for demo hosting, or
  - switch to PostgreSQL before final submission

### Phase D: Submission Pack
Target window: 18 April to 24 April

#### Priority outcomes
- Finalize the story, not just the code
- Make judging criteria obvious from the repo and demo

#### Tasks
- [ ] Record 3-5 minute demo video
- [ ] Update README with setup, architecture, screenshots, and team credits
- [ ] Add architecture diagram
- [ ] Prepare final project description and challenge write-up
- [ ] Verify public repo health and clean navigation
- [ ] Submit demo link, repo link, and hosted app link

---

## 7. Team Ownership

| Developer | Focus Area | Ownership |
|-----------|------------|-----------|
| Dev 1 | Full-stack lead | Architecture, integration, deployment, review |
| Dev 2 | Frontend | Dashboard polish, task UX, responsive behavior, screenshots |
| Dev 3 | Backend + AI | AI services, FastAPI routes, DB integrity, seeded demo data |

### Shared rule
- No one works in isolation on blockers for more than one standup cycle.

---

## 8. Definition of Done for Final Submission

The project is only considered done when all of the following are true:

- [ ] Local setup works from the README without hidden steps
- [ ] Hosted frontend and backend are both reachable
- [ ] Google login works in production
- [ ] Survey upload works in production
- [ ] AI analysis works in production
- [ ] Volunteer matching works in production
- [ ] Assignment flow works in production
- [ ] Dashboard reflects real data correctly
- [ ] Chat answers from live project data
- [ ] Demo seed script produces a polished showcase state
- [ ] No secrets are committed to the repo
- [ ] README, screenshots, and architecture explanation are complete

---

## 9. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI provider rate limits or malformed output | Medium | High | Cache outputs where possible and keep fallback parsing strict |
| Production auth/CORS mismatch | Medium | High | Deploy early and validate auth end-to-end |
| Live map missing token in production | High | Medium | Add fallback UI and verify env setup before demo recording |
| Upload pipeline breaks on real documents | Medium | High | Test every supported format using seeded and real samples |
| README drift causes teammate confusion | High | Medium | Update docs immediately after architecture or flow changes |
| Last-minute deployment issues | Medium | High | Finish hosted version at least one week before deadline |

---

## 10. Daily Operating Rhythm

### Daily standup
Each person answers:
1. What did I finish?
2. What am I doing next?
3. What is blocked?

### Working norms
- Merge to `dev` first, never directly to `main`
- Keep feature branches small and focused
- Review user-facing flows, not just code diff quality
- Update docs when architecture or product flow changes

---

## 11. Verified Progress Timeline

| Milestone | Status | Notes |
|-----------|--------|-------|
| Foundation build | Complete | App shell, auth, backend structure, DB |
| Volunteer profile system | Complete | Frontend and backend connected |
| Survey upload and analysis | Complete | File extraction and AI analysis present |
| Task system | Complete | CRUD plus task detail flow present |
| Matching flow | Complete | Score-based volunteer recommendations live |
| Assignment flow | Complete | Assign and unassign implemented |
| Dashboard v1 | Complete | Stats, recent surveys, top problems, map |
| Chat assistant | Complete | Floating widget and backend route exist |
| Demo data seeding | Complete | Seed script exists and appears current |
| QA pass | Pending | Needs formal walkthrough |
| Deployment | Pending | Needs hosted verification |
| Submission assets | Pending | README, screenshots, architecture diagram, demo video |

---

## 12. Immediate Next Actions

The next highest-value tasks are:

1. Update README so it matches the current architecture and user flow.
2. Run a full seeded demo walkthrough and record every bug found.
3. Validate live map configuration and production environment variables.
4. Deploy both apps before starting final video capture.
5. Freeze a polished demo dataset and use it consistently everywhere.

---

## 13. Notes for the Team

This file is now the source of truth for current execution status. If a feature lands, its status should be updated here the same day. If product direction changes again, update this document before the README drifts a second time.
