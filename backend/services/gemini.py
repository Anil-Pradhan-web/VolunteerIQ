"""
Gemini AI service — survey analysis + volunteer matching.

Uses Google Generative AI (Gemini 1.5 Pro) for:
1. Analyzing uploaded community survey data → identifies top problems
2. Matching best volunteers to tasks based on skills/location/availability
"""

import json
import os
import time
import threading

from app.config import settings

# Try to initialise Gemini
_model = None

try:
    import google.generativeai as genai

    api_key = os.getenv("GEMINI_API_KEY", "")
    if api_key:
        genai.configure(api_key=api_key)
        _model = genai.GenerativeModel(settings.gemini_model or "gemini-1.5-pro")
        print(f"✅ Gemini AI initialised (model: {settings.gemini_model})")
    else:
        print("⚠️  GEMINI_API_KEY not set — AI features will use fallback stubs")
except Exception as exc:
    print(f"⚠️  Gemini init failed: {exc}")


def _parse_json_response(text: str) -> dict | list | None:
    """Extract JSON from Gemini response (handles markdown code blocks)."""
    text = text.strip()
    # Remove markdown code fences if present
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        text = "\n".join(lines).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to find JSON in the response
        start = text.find("{")
        end = text.rfind("}") + 1
        if start >= 0 and end > start:
            try:
                return json.loads(text[start:end])
            except json.JSONDecodeError:
                pass
        # Try array
        start = text.find("[")
        end = text.rfind("]") + 1
        if start >= 0 and end > start:
            try:
                return json.loads(text[start:end])
            except json.JSONDecodeError:
                pass
    return None


class GeminiService:
    """Gemini-powered AI analysis and matching."""
    
    def __init__(self):
        self._last_call_time = 0.0
        self._lock = threading.Lock()

    def _rate_limit(self):
        """Ensure we don't exceed free tier limits (usually ~15 requests/minute)."""
        with self._lock:
            now = time.time()
            elapsed = now - self._last_call_time
            # Keep at least 4.2 seconds between calls to comfortably stay under 15 Req/min
            if elapsed < 4.2:
                time.sleep(4.2 - elapsed)
            self._last_call_time = time.time()

    def analyze_survey(self, text: str) -> dict:
        """Analyze community survey data and identify top problems."""
        if _model is None:
            return self._stub_analysis(text)

        prompt = f"""You are an expert social impact analyst working with NGOs in India.
Analyze this community survey data and return a JSON object with:
- "topProblems": list of exactly 3 most urgent community problems (strings)
- "urgencyScores": object mapping each problem to "High", "Medium", or "Low"
- "summary": 2-3 sentence overview of the findings
- "recommendedActions": list of 3 suggested interventions (strings)
- "recommendedTasks": list of 3 specific actionable tasks. Each object must have:
    - "title": string (short actionable title)
    - "description": string (detailed explanation of what needs to be done)
    - "requiredSkills": list of strings (e.g. ["Medical", "Cooking", "Communication"])
    - "location": string (best guess of location or "Community Center")
- "totalResponses": estimated number of people/responses in the data

Survey Data:
{text[:3000]}

Return ONLY valid JSON with the exact keys above. No extra text."""

        self._rate_limit()

        try:
            response = _model.generate_content(prompt)
            parsed = _parse_json_response(response.text)
            if parsed and isinstance(parsed, dict):
                return parsed
            # Fallback if parsing failed
            return {
                "topProblems": ["Analysis completed but response format was unexpected"],
                "summary": response.text[:300],
                "urgencyScores": {},
                "recommendedActions": [],
                "recommendedTasks": [],
                "totalResponses": 0,
                "rawResponse": response.text[:500],
            }
        except Exception as exc:
            return {
                "topProblems": [f"AI analysis error: {str(exc)[:100]}"],
                "summary": "Could not analyze survey. Please check your Gemini API key.",
                "urgencyScores": {},
                "recommendedActions": [],
                "totalResponses": 0,
            }

    def match_volunteers(self, task: dict, volunteers: list[dict]) -> list[dict]:
        """Use Gemini to rank best volunteers for a task."""
        if _model is None:
            return self._stub_matching(task, volunteers)

        # Simplify volunteer data for the prompt
        vol_summary = []
        for v in volunteers[:15]:
            vol_summary.append({
                "id": v.get("id", ""),
                "name": v.get("name", ""),
                "skills": v.get("skills", []),
                "availability": v.get("availability", []),
                "location": v.get("location", ""),
            })

        prompt = f"""You are a smart volunteer coordinator for an NGO.
Given this task and list of available volunteers, rank the top 5 best matches.

Task:
- Title: {task.get('title', '')}
- Required Skills: {task.get('requiredSkills', [])}
- Location: {task.get('location', '')}
- Description: {task.get('description', '')}

Volunteers:
{json.dumps(vol_summary, indent=2)}

Return a JSON array with objects containing:
- "volunteer_id": the volunteer's id
- "name": volunteer name
- "match_score": score from 0-100
- "match_reason": 1 sentence explaining why they're a good fit

Rank by best fit. Return ONLY a valid JSON array, no extra text."""

        self._rate_limit()

        try:
            response = _model.generate_content(prompt)
            parsed = _parse_json_response(response.text)
            if parsed and isinstance(parsed, list):
                return parsed[:5]
            return self._stub_matching(task, volunteers)
        except Exception:
            return self._stub_matching(task, volunteers)

    def chat(self, question: str, context: str) -> str:
        """Answer questions about NGO data using Gemini."""
        if _model is None:
            return "AI chat is not available. Please set your GEMINI_API_KEY in the backend .env file."

        prompt = f"""You are an AI assistant for VolunteerIQ, an NGO coordination platform.
Answer the user's question based on the provided data context. Be helpful, concise (2-3 sentences).

Context Data:
{context[:2000]}

User Question: {question}

Answer:"""

        self._rate_limit()

        try:
            response = _model.generate_content(prompt)
            return response.text
        except Exception as exc:
            return f"I'm sorry, I couldn't process that question. Error: {str(exc)[:100]}"

    # ── Fallback stubs when Gemini is not configured ──

    def _stub_analysis(self, text: str) -> dict:
        return {
            "topProblems": [
                "Access to medical aid in rural areas",
                "Insufficient food distribution networks",
                "Temporary shelter shortage for displaced families",
            ],
            "urgencyScores": {
                "Access to medical aid in rural areas": "High",
                "Insufficient food distribution networks": "Medium",
                "Temporary shelter shortage for displaced families": "High",
            },
            "summary": f"Analysis based on survey data ({len(text)} chars). Key issues include healthcare access gaps, food supply chain disruptions, and shelter needs in affected communities.",
            "recommendedActions": [
                "Deploy mobile health camps to underserved areas",
                "Establish food distribution points with volunteer logistics teams",
                "Set up temporary shelters with construction volunteers",
            ],
            "totalResponses": max(50, len(text) // 20),
            "_note": "Stub data — set GEMINI_API_KEY for real AI analysis",
        }

    def _stub_matching(self, task: dict, volunteers: list[dict]) -> list[dict]:
        matches = []
        for i, vol in enumerate(volunteers[:5], start=1):
            matches.append({
                "volunteer_id": vol.get("id", f"v-{i}"),
                "name": vol.get("name", f"Volunteer {i}"),
                "match_score": max(65, 100 - (i * 7)),
                "match_reason": f"{vol.get('name', 'Volunteer')} has relevant skills and availability for this task.",
            })
        return matches


gemini_service = GeminiService()
