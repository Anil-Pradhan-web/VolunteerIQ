from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import TaskCreate, TaskUpdate
from services import db_service

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.post("")
def create_task(task: TaskCreate, db: Session = Depends(get_db)) -> dict:
    return db_service.create_task(db, task.model_dump(by_alias=True))


@router.get("")
def list_tasks(
    ngo_id: str | None = Query(default=None, alias="ngoId"),
    db: Session = Depends(get_db),
) -> list[dict]:
    return db_service.list_tasks(db, ngo_id)


@router.get("/{task_id}")
def get_task(task_id: int, db: Session = Depends(get_db)) -> dict:
    task = db_service.get_task(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}")
def update_task(
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
) -> dict:
    updated = db_service.update_task(db, task_id, payload.model_dump(exclude_unset=True))
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated
