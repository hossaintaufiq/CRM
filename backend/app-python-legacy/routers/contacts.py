import uuid
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database import get_db
from app.models import Activity, Contact, User
from app.schemas.common import BulkDelete, ContactIn

router = APIRouter()


def _out(c: Contact) -> dict:
    return {
        "id": c.id,
        "name": c.name,
        "company": c.company,
        "role": c.role,
        "email": c.email,
        "phone": c.phone,
        "owner": c.owner,
    }


@router.get("")
def list_contacts(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return [_out(c) for c in db.query(Contact).order_by(Contact.name).all()]


@router.post("")
def create_contact(
    payload: ContactIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    contact = Contact(
        id=str(uuid.uuid4()),
        name=payload.name,
        company=payload.company,
        role=payload.role,
        email=str(payload.email),
        phone=payload.phone,
        owner=payload.owner or user.full_name,
    )
    db.add(contact)
    db.add(
        Activity(
            id=str(uuid.uuid4()),
            actor=user.full_name,
            action="created contact",
            target=contact.name,
            timestamp=datetime.utcnow(),
        )
    )
    db.commit()
    return _out(contact)


@router.delete("/{contact_id}")
def delete_contact(
    contact_id: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    contact = db.get(Contact, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.add(
        Activity(
            id=str(uuid.uuid4()),
            actor=user.full_name,
            action="deleted contact",
            target=contact.name,
            timestamp=datetime.utcnow(),
        )
    )
    db.delete(contact)
    db.commit()
    return {"ok": True}


@router.post("/bulk-delete")
def bulk_delete(
    payload: BulkDelete,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    for contact_id in payload.ids:
        contact = db.get(Contact, contact_id)
        if contact:
            db.delete(contact)
    db.commit()
    return {"ok": True, "deleted": len(payload.ids)}
