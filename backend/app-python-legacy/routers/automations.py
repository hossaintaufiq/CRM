from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database import get_db
from app.models import Automation, User

router = APIRouter()


@router.get("")
def list_automations(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return [
        {
            "id": a.id,
            "name": a.name,
            "trigger": a.trigger,
            "status": a.status,
            "runsToday": a.runs_today,
        }
        for a in db.query(Automation).all()
    ]


@router.patch("/{automation_id}/status")
def toggle_status(
    automation_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    row = db.get(Automation, automation_id)
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    row.status = "Paused" if row.status == "Active" else "Active"
    db.commit()
    return {
        "id": row.id,
        "name": row.name,
        "trigger": row.trigger,
        "status": row.status,
        "runsToday": row.runs_today,
    }


@router.delete("/{automation_id}")
def delete_automation(
    automation_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    row = db.get(Automation, automation_id)
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(row)
    db.commit()
    return {"ok": True}
