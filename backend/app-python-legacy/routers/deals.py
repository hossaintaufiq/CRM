import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database import get_db
from app.models import Activity, Deal, Notification, User
from app.schemas.common import BulkDelete, DealIn

router = APIRouter()


def _deal_out(deal: Deal) -> dict:
    return {
        "id": deal.id,
        "title": deal.title,
        "companyName": deal.company_name,
        "value": deal.value,
        "currency": deal.currency,
        "healthScore": deal.health_score,
        "priority": deal.priority,
        "probability": deal.probability,
        "ownerName": deal.owner_name,
        "ownerInitials": deal.owner_initials,
        "lastActivity": "Just now",
        "stage": deal.stage,
        "closeDate": deal.close_date,
        "tags": deal.tags or [],
        "notes": deal.notes or "",
        "createdAt": deal.created_at.isoformat() if deal.created_at else None,
        "updatedAt": deal.updated_at.isoformat() if deal.updated_at else None,
    }


def _initials(name: str) -> str:
    return "".join(part[0] for part in name.split() if part)[:2].upper()


@router.get("")
def list_deals(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return [_deal_out(d) for d in db.query(Deal).order_by(Deal.value.desc()).all()]


@router.post("")
def create_deal(
    payload: DealIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    deal = Deal(
        id=str(uuid.uuid4()),
        title=payload.title,
        company_name=payload.companyName,
        value=payload.value,
        currency=payload.currency,
        health_score=payload.healthScore,
        priority=payload.priority,
        probability=payload.probability,
        owner_name=payload.ownerName,
        owner_initials=payload.ownerInitials or _initials(payload.ownerName),
        stage=payload.stage,
        close_date=payload.closeDate,
        tags=payload.tags,
        notes=payload.notes,
    )
    db.add(deal)
    db.add(
        Activity(
            id=str(uuid.uuid4()),
            actor=user.full_name,
            action="created deal",
            target=deal.company_name,
            timestamp=datetime.utcnow(),
        )
    )
    db.commit()
    return _deal_out(deal)


@router.patch("/{deal_id}")
def update_deal(
    deal_id: str,
    payload: DealIn,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    deal = db.get(Deal, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    deal.title = payload.title
    deal.company_name = payload.companyName
    deal.value = payload.value
    deal.currency = payload.currency
    deal.health_score = payload.healthScore
    deal.priority = payload.priority
    deal.probability = payload.probability
    deal.owner_name = payload.ownerName
    deal.owner_initials = payload.ownerInitials or _initials(payload.ownerName)
    deal.stage = payload.stage
    deal.close_date = payload.closeDate
    deal.tags = payload.tags
    deal.notes = payload.notes
    deal.updated_at = datetime.utcnow()
    db.commit()
    return _deal_out(deal)


class StageIn(BaseModel):
    stage: str


@router.patch("/{deal_id}/stage")
def move_stage(
    deal_id: str,
    payload: StageIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    deal = db.get(Deal, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    deal.stage = payload.stage
    if payload.stage == "Closed Won":
        deal.probability = 100
    if payload.stage == "Closed Lost":
        deal.probability = 0
    deal.updated_at = datetime.utcnow()
    db.add(
        Activity(
            id=str(uuid.uuid4()),
            actor=user.full_name,
            action="moved deal to",
            target=f"{deal.company_name} ({payload.stage})",
            timestamp=datetime.utcnow(),
        )
    )
    db.add(
        Notification(
            id=str(uuid.uuid4()),
            title="Deal stage changed",
            description=f"{deal.company_name} moved to {payload.stage}.",
            read=False,
            user_id=user.id,
        )
    )
    db.commit()
    return _deal_out(deal)


@router.delete("/{deal_id}")
def delete_deal(
    deal_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    deal = db.get(Deal, deal_id)
    if not deal:
        raise HTTPException(status_code=404, detail="Deal not found")
    db.add(
        Activity(
            id=str(uuid.uuid4()),
            actor=user.full_name,
            action="deleted deal",
            target=deal.company_name,
            timestamp=datetime.utcnow(),
        )
    )
    db.delete(deal)
    db.commit()
    return {"ok": True}


@router.post("/bulk-delete")
def bulk_delete(
    payload: BulkDelete,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    for deal_id in payload.ids:
        deal = db.get(Deal, deal_id)
        if deal:
            db.delete(deal)
    db.commit()
    return {"ok": True, "deleted": len(payload.ids)}
