"""
Database service layer for VolunteerIQ.

Uses SQLAlchemy (SQLite for dev, PostgreSQL for production).
Replaces the old Firestore-based service.
"""

from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.db_models import Assignment, Survey, Task, User


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ── User / Volunteer operations ──────────────────────────────────────────


def save_user(db: Session, user_data: dict) -> dict:
    """Create a new user document."""
    user = User(
        id=user_data.get("id", ""),
        name=user_data.get("name", ""),
        email=user_data.get("email"),
        role=user_data.get("role", "volunteer"),
        skills=user_data.get("skills", []),
        availability=user_data.get("availability", []),
        location=user_data.get("location", ""),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _user_to_dict(user)


def get_user(db: Session, user_id: str) -> dict | None:
    """Fetch a single user by ID."""
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        return _user_to_dict(user)
    return None


def update_user(db: Session, user_id: str, data: dict) -> dict | None:
    """Update an existing user (merge fields)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    for key, val in data.items():
        if hasattr(user, key) and key != "id":
            setattr(user, key, val)

    db.commit()
    db.refresh(user)
    return _user_to_dict(user)


def list_volunteers(db: Session) -> list[dict]:
    """Return all users with role == 'volunteer'."""
    users = db.query(User).filter(User.role == "volunteer").all()
    return [_user_to_dict(u) for u in users]


def list_all_users(db: Session) -> list[dict]:
    """Return every user."""
    users = db.query(User).all()
    return [_user_to_dict(u) for u in users]


def _user_to_dict(user: User) -> dict:
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "skills": user.skills or [],
        "availability": user.availability or [],
        "location": user.location,
        "createdAt": user.created_at.isoformat() if user.created_at else _now_iso(),
    }


# ── Task operations ──────────────────────────────────────────────────────


def create_task(db: Session, task_data: dict) -> dict:
    """Create a new task."""
    task = Task(
        ngo_id=task_data.get("ngoId", ""),
        title=task_data.get("title", ""),
        description=task_data.get("description", ""),
        required_skills=task_data.get("requiredSkills", []),
        location=task_data.get("location", ""),
        deadline=task_data.get("deadline"),
        status=task_data.get("status", "open"),
        assigned_to=[],
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return _task_to_dict(task)


def get_task(db: Session, task_id: int) -> dict | None:
    """Fetch a single task by ID."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if task:
        return _task_to_dict(task)
    return None


def list_tasks(db: Session, ngo_id: str | None = None) -> list[dict]:
    """Return tasks, optionally filtered by NGO."""
    query = db.query(Task)
    if ngo_id:
        query = query.filter(Task.ngo_id == ngo_id)
    tasks = query.order_by(Task.created_at.desc()).all()
    return [_task_to_dict(t) for t in tasks]


def update_task(db: Session, task_id: int, data: dict) -> dict | None:
    """Update fields on a task."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return None

    if "status" in data:
        task.status = data["status"]
    if "assignedTo" in data:
        task.assigned_to = data["assignedTo"]

    db.commit()
    db.refresh(task)
    return _task_to_dict(task)


def _task_to_dict(task: Task) -> dict:
    return {
        "id": str(task.id),
        "ngoId": task.ngo_id,
        "title": task.title,
        "description": task.description,
        "requiredSkills": task.required_skills or [],
        "location": task.location,
        "deadline": task.deadline.isoformat() if task.deadline else None,
        "status": task.status,
        "assignedTo": task.assigned_to or [],
        "createdAt": task.created_at.isoformat() if task.created_at else _now_iso(),
    }


# ── Assignment operations ────────────────────────────────────────────────


def assign_volunteer(db: Session, task_id: int, volunteer_id: str) -> dict:
    """Assign a volunteer to a task."""
    assignment = Assignment(
        task_id=task_id,
        volunteer_id=volunteer_id,
        status="active",
    )
    db.add(assignment)

    # Also update the task's assigned_to list
    task = db.query(Task).filter(Task.id == task_id).first()
    if task:
        current = task.assigned_to or []
        if volunteer_id not in current:
            task.assigned_to = current + [volunteer_id]
        if task.status == "open":
            task.status = "assigned"

    db.commit()
    db.refresh(assignment)
    return _assignment_to_dict(assignment)


def get_assignments(db: Session, user_id: str) -> list[dict]:
    """Return all assignments for a given volunteer."""
    assignments = (
        db.query(Assignment).filter(Assignment.volunteer_id == user_id).all()
    )
    return [_assignment_to_dict(a) for a in assignments]


def _assignment_to_dict(assignment: Assignment) -> dict:
    return {
        "id": str(assignment.id),
        "taskId": str(assignment.task_id),
        "volunteerId": assignment.volunteer_id,
        "assignedAt": assignment.assigned_at.isoformat()
        if assignment.assigned_at
        else _now_iso(),
        "status": assignment.status,
    }


# ── Survey operations ────────────────────────────────────────────────────


def save_survey(db: Session, data: dict) -> dict:
    """Save survey metadata after file upload."""
    survey = Survey(
        ngo_id=data.get("ngoId", ""),
        file_name=data.get("fileName", ""),
        file_path=data.get("filePath", ""),
        uploaded_by=data.get("uploadedBy", ""),
        extracted_text=data.get("extractedText", ""),
        analysis_result=data.get("analysisResult"),
    )
    db.add(survey)
    db.commit()
    db.refresh(survey)
    return _survey_to_dict(survey)


def get_surveys(db: Session, ngo_id: str) -> list[dict]:
    """Return all surveys for a given NGO."""
    surveys = (
        db.query(Survey)
        .filter(Survey.ngo_id == ngo_id)
        .order_by(Survey.created_at.desc())
        .all()
    )
    return [_survey_to_dict(s) for s in surveys]


def update_survey_analysis(db: Session, survey_id: int, analysis: dict) -> dict | None:
    """Store AI analysis result on a survey."""
    survey = db.query(Survey).filter(Survey.id == survey_id).first()
    if not survey:
        return None
    survey.analysis_result = analysis
    db.commit()
    db.refresh(survey)
    return _survey_to_dict(survey)


def _survey_to_dict(survey: Survey) -> dict:
    return {
        "id": str(survey.id),
        "ngoId": survey.ngo_id,
        "fileName": survey.file_name,
        "filePath": survey.file_path,
        "uploadedBy": survey.uploaded_by,
        "extractedText": survey.extracted_text[:200] if survey.extracted_text else "",
        "analysisResult": survey.analysis_result,
        "createdAt": survey.created_at.isoformat()
        if survey.created_at
        else _now_iso(),
    }


# ── Dashboard stats ──────────────────────────────────────────────────────


def get_dashboard_stats(db: Session, ngo_id: str) -> dict:
    """Aggregate dashboard metrics."""
    total_volunteers = db.query(User).filter(User.role == "volunteer").count()

    tasks = db.query(Task).filter(Task.ngo_id == ngo_id).all()
    active = sum(1 for t in tasks if t.status == "assigned")
    completed = sum(1 for t in tasks if t.status == "completed")
    open_count = sum(1 for t in tasks if t.status == "open")

    # Recent surveys
    surveys = (
        db.query(Survey)
        .filter(Survey.ngo_id == ngo_id)
        .order_by(Survey.created_at.desc())
        .limit(3)
        .all()
    )
    recent_surveys = [s.file_name for s in surveys]

    # Top problems from latest survey analysis
    top_problems: list[str] = []
    if surveys and surveys[0].analysis_result:
        top_problems = surveys[0].analysis_result.get("topProblems", [])

    return {
        "ngoId": ngo_id,
        "total_volunteers": total_volunteers,
        "active_tasks": active,
        "completed_tasks": completed,
        "open_tasks": open_count,
        "top_problems": top_problems,
        "recent_surveys": recent_surveys,
    }
