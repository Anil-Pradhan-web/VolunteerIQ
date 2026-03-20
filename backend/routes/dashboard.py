from fastapi import APIRouter

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/{ngo_id}")
def get_dashboard(ngo_id: str) -> dict:
    return {
        "ngoId": ngo_id,
        "total_volunteers": 10,
        "active_tasks": 3,
        "completed_tasks": 1,
        "open_tasks": 2,
        "top_problems": ["Flood relief supply gaps", "Healthcare access", "Education drop-off"],
        "recent_surveys": [
            "flood_relief_survey.csv",
            "education_gap_survey.pdf",
            "health_camp_report.pdf",
        ],
    }
