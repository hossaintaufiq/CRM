import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database import get_db
from app.models import Activity, Lead, User
from app.schemas.common import BulkDelete, LeadIn

router = APIRouter()


def _lead_out(lead: Lead) -> dict:
    return {
        "id": lead.id,
        "name": lead.name,
        "company": lead.company,
        "email": lead.email,
        "phone": lead.phone,
        "source": lead.source,
        "status": lead.status,
        "score": lead.score,
        "lastTouch": "Just now",
        "timeline": lead.timeline or [],
    }


def _activity(db: Session, actor: str, action: str, target: str) -> None:
    db.add(
        Activity(
            id=str(uuid.uuid4()),
            actor=actor,
            action=action,
            target=target,
            timestamp=datetime.utcnow(),
        )
    )


@router.get("")
def list_leads(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return [_lead_out(l) for l in db.query(Lead).order_by(Lead.score.desc()).all()]


@router.post("")
def create_lead(
    payload: LeadIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    lead = Lead(
        id=str(uuid.uuid4()),
        name=payload.name,
        company=payload.company,
        email=str(payload.email),
        phone=payload.phone,
        source=payload.source,
        status=payload.status,
        score=payload.score,
        owner_id=user.id,
        timeline=payload.timeline or ["Lead created"],
    )
    db.add(lead)
    _activity(db, user.full_name, "created lead", lead.name)
    db.commit()
    return _lead_out(lead)


@router.patch("/{lead_id}")
def update_lead(
    lead_id: str,
    payload: LeadIn,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    for key, value in payload.model_dump().items():
        setattr(lead, key if key != "email" else "email", str(value) if key == "email" else value)
    lead.updated_at = datetime.utcnow()
    db.commit()
    return _lead_out(lead)


@router.patch("/{lead_id}/status")
def update_status(
    lead_id: str,
    status: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead.status = status
    _activity(db, user.full_name, "updated lead status", f"{lead.name} → {status}")
    db.commit()
    return _lead_out(lead)


@router.delete("/{lead_id}")
def delete_lead(
    lead_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    lead = db.get(Lead, lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    _activity(db, user.full_name, "deleted lead", lead.name)
    db.delete(lead)
    db.commit()
    return {"ok": True}


@router.post("/bulk-delete")
def bulk_delete(
    payload: BulkDelete,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    for lead_id in payload.ids:
        lead = db.get(Lead, lead_id)
        if lead:
            db.delete(lead)
    _activity(db, user.full_name, "bulk deleted", f"{len(payload.ids)} leads")
    db.commit()
    return {"ok": True, "deleted": len(payload.ids)}


@router.post("/import")
def import_leads(_: User = Depends(get_current_user)):
    return {"status": "stub", "message": "CSV/Excel import planned"}


@router.get("/export")
def export_leads(_: User = Depends(get_current_user)):
    return {"status": "stub", "message": "CSV/Excel export planned"}
