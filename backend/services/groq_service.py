"""
Groq AI service — fast Llama 3 inference wrapper.
Matches Gemini API structure for seamless swapping in frontend.
"""

import json
import os
from groq import Groq
from app.config import settings

_groq_client = None

try:
    api_key = os.getenv("GROQ_API_KEY", "")
    if api_key:
        _groq_client = Groq(api_key=api_key)
        print(f"✅ Groq AI initialised (model: {settings.groq_model})")
    else:
        print("⚠️  GROQ_API_KEY not set — falling back to stubs if called")
except Exception as exc:
    print(f"⚠️  Groq init failed: {exc}")


def _parse_json_response(text: str) -> dict | list | None:
    text = text.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [l for l in lines if not l.strip().startswith("```")]
        text = "\n".join(lines).strip()
    try:
        return json.loads(text)
    except Exception:
        start = text.find("{")
        end = text.rfind("}") + 1
        if start >= 0 and end > start:
            try:
                return json.loads(text[start:end])
            except:
                pass
        start = text.find("[")
        end = text.rfind("]") + 1
        if start >= 0 and end > start:
            try:
                return json.loads(text[start:end])
            except:
                pass
    return None


def analyze_survey(text: str) -> dict:
    if not _groq_client:
        return {
            "topProblems": ["Lack of internet", "Poor sanitation", "Unemployment"],
            "urgencyScores": {"Lack of internet": "Medium", "Poor sanitation": "High", "Unemployment": "High"},
            "summary": "Fallback summary since Groq is not configured.",
            "recommendedActions": ["Build ISP networks", "Install dustbins", "Offer training programs"],
            "recommendedTasks": [],
            "totalResponses": 150,
        }

    prompt = f"""
    You are an expert social impact analyst reading a community survey.
    Analyze this survey data and output purely JSON, with NO other text or markdown whatsoever.
    
    Format:
    {{
        "topProblems": ["Problem 1", "Problem 2", "Problem 3"],
        "urgencyScores": {{"Problem 1": "High", "Problem 2": "Medium", "Problem 3": "Low"}},
        "summary": "2 sentence overview...",
        "recommendedActions": ["Action 1", "Action 2", "Action 3"],
        "recommendedTasks": [
            {{
                "title": "Short Task Title",
                "description": "Task details",
                "requiredSkills": ["Skill 1", "Skill 2"],
                "location": "Location"
            }}
        ],
        "totalResponses": 100
    }}
    
    Survey Text:
    {text}
    """
    try:
        completion = _groq_client.chat.completions.create(
            model=settings.groq_model or "llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
            max_tokens=1000,
        )
        resp_text = completion.choices[0].message.content or ""
        parsed = _parse_json_response(resp_text)
        if parsed and isinstance(parsed, dict) and "topProblems" in parsed:
            return parsed
    except Exception as e:
        print(f"Groq API error: {e}")

    return {
        "topProblems": ["Error analyzing survey (Groq)"],
        "urgencyScores": {},
        "summary": "AI Failed.",
        "recommendedActions": [],
        "recommendedTasks": [],
        "totalResponses": 0,
    }
