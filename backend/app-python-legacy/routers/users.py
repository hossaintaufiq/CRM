import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.auth.security import get_current_user, hash_password, require_roles
from app.database import get_db
from app.models import User
from app.schemas.common import UserOut

router = APIRouter()


class InviteIn(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "Sales"
    department: str = "Sales"
    team: str = "GTM"


class StatusIn(BaseModel):
    status: str


@router.get("", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return db.query(User).order_by(User.full_name).all()


@router.post("/invite", response_model=UserOut)
def invite_user(
    payload: InviteIn,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("Admin", "Manager")),
):
    if db.query(User).filter(User.email == payload.email.lower()).first():
        raise HTTPException(status_code=400, detail="User exists")
    user = User(
        id=str(uuid.uuid4()),
        email=payload.email.lower(),
        full_name=payload.full_name,
        hashed_password=hash_password(str(uuid.uuid4())),
        role=payload.role,
        department=payload.department,
        team=payload.team,
        status="invited",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.patch("/{user_id}/status", response_model=UserOut)
def set_status(
    user_id: str,
    payload: StatusIn,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("Admin")),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.status = payload.status
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}")
def remove_user(
    user_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("Admin")),
):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"ok": True}
