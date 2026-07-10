import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database import get_db
from app.models import Task, User
from app.schemas.common import TaskIn

router = APIRouter()


@router.get("")
def list_tasks(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return [
        {
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "assignee": t.assignee,
            "priority": t.priority,
            "status": t.status,
            "due_date": t.due_date,
        }
        for t in db.query(Task).all()
    ]


@router.post("")
def create_task(
    payload: TaskIn,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    task = Task(id=str(uuid.uuid4()), **payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return {"id": task.id, **payload.model_dump()}


@router.delete("/{task_id}")
def delete_task(
    task_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    task = db.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(task)
    db.commit()
    return {"ok": True}
