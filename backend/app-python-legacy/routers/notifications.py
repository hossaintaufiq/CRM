from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database import get_db
from app.models import Notification, User

router = APIRouter()


@router.get("")
def list_notifications(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = (
        db.query(Notification)
        .order_by(Notification.timestamp.desc())
        .limit(50)
        .all()
    )
    return [
        {
            "id": n.id,
            "title": n.title,
            "description": n.description,
            "read": n.read,
            "timestamp": int(n.timestamp.timestamp() * 1000),
        }
        for n in rows
    ]


@router.patch("/{notification_id}/read")
def mark_read(
    notification_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    row = db.get(Notification, notification_id)
    if not row:
        raise HTTPException(status_code=404, detail="Not found")
    row.read = True
    db.commit()
    return {"ok": True}


@router.post("/read-all")
def read_all(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    db.query(Notification).update({Notification.read: True})
    db.commit()
    return {"ok": True}
