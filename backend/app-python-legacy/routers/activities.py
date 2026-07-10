from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database import get_db
from app.models import Activity, User

router = APIRouter()


def _ago(ts: datetime) -> str:
    minutes = max(1, int((datetime.utcnow() - ts).total_seconds() // 60))
    if minutes < 60:
        return f"{minutes}m ago"
    hours = minutes // 60
    if hours < 24:
        return f"{hours}h ago"
    return f"{hours // 24}d ago"


@router.get("")
def list_activities(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    rows = db.query(Activity).order_by(Activity.timestamp.desc()).limit(50).all()
    return [
        {
            "id": a.id,
            "actor": a.actor,
            "action": a.action,
            "target": a.target,
            "at": _ago(a.timestamp),
            "timestamp": int(a.timestamp.timestamp() * 1000),
        }
        for a in rows
    ]
