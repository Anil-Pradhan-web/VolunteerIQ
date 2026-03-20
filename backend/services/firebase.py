from datetime import datetime, timezone

from app.models import TaskCreate, VolunteerProfile


class FirebaseService:
    """
    Day 1 placeholder service.

    Replace the in-memory responses with Firebase Admin SDK calls on Day 2.
    """

    def save_user(self, volunteer: VolunteerProfile) -> dict:
        return {
            "id": "volunteer-demo-1",
            "createdAt": datetime.now(timezone.utc).isoformat(),
            **volunteer.model_dump(),
        }

    def get_user(self, user_id: str) -> dict:
        return {
            "id": user_id,
            "name": "Priya Sharma",
            "role": "volunteer",
            "skills": ["Medical", "First Aid"],
            "availability": ["Weekends"],
            "location": "Bhubaneswar",
        }

    def update_user(self, user_id: str, payload: VolunteerProfile) -> dict:
        return {"id": user_id, **payload.model_dump()}

    def list_volunteers(self) -> list[dict]:
        return [
            {
                "id": "volunteer-demo-1",
                "name": "Priya Sharma",
                "skills": ["Medical", "First Aid"],
                "availability": ["Weekends"],
                "location": "Bhubaneswar",
            },
            {
                "id": "volunteer-demo-2",
                "name": "Rahul Das",
                "skills": ["Driving", "Logistics"],
                "availability": ["Full-time"],
                "location": "Cuttack",
            },
        ]

    def create_task(self, task: TaskCreate) -> dict:
        return {
            "id": "task-demo-1",
            "createdAt": datetime.now(timezone.utc).isoformat(),
            **task.model_dump(by_alias=True),
        }


firebase_service = FirebaseService()
