from fastapi import APIRouter

from app.models import TaskCreate, TaskUpdate
from services.firebase import firebase_service

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.post("")
def create_task(task: TaskCreate) -> dict:
    return firebase_service.create_task(task)


@router.get("")
def list_tasks() -> list[dict]:
    return [
        {
            "id": "task-demo-1",
            "title": "Mobile health camp setup",
            "status": "open",
            "requiredSkills": ["Medical", "Driving"],
            "location": "Bhubaneswar",
        }
    ]


@router.get("/{task_id}")
def get_task(task_id: str) -> dict:
    return {
        "id": task_id,
        "title": "Mobile health camp setup",
        "description": "Prepare transport, medicine desk, and triage station.",
        "status": "open",
        "requiredSkills": ["Medical", "Driving"],
        "location": "Bhubaneswar",
    }


@router.put("/{task_id}")
def update_task(task_id: str, payload: TaskUpdate) -> dict:
    return {"id": task_id, "status": payload.status}
