from app.config import settings


class GeminiService:
    """
    Day 1 placeholder service.

    Wire this to the Gemini SDK on Day 5 and Day 7.
    """

    def analyze_survey(self, text: str) -> dict:
        return {
            "model": settings.gemini_model,
            "top_problems": [
                "Access to medical aid",
                "Insufficient food distribution",
                "Temporary shelter shortage"
            ],
            "summary": text[:180] or "Survey text will be analyzed here.",
            "urgency_score": 87
        }

    def match_volunteers(self, task: dict, volunteers: list[dict]) -> list[dict]:
        matches = []

        for index, volunteer in enumerate(volunteers[:5], start=1):
            matches.append(
                {
                    "volunteer_id": volunteer.get("id", f"volunteer-{index}"),
                    "match_score": max(70, 100 - (index * 4)),
                    "match_reason": f"{volunteer.get('name', 'Volunteer')} aligns with task needs and availability.",
                }
            )

        return matches


gemini_service = GeminiService()
