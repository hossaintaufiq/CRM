from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database import get_db
from app.models import Organization, User

router = APIRouter()


@router.get("")
def list_orgs(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    orgs = db.query(Organization).all()
    return [
        {
            "id": o.id,
            "name": o.name,
            "default_currency": o.default_currency,
            "fiscal_year_start": o.fiscal_year_start,
        }
        for o in orgs
    ]
