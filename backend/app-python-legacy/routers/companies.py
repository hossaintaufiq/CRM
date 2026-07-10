import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database import get_db
from app.models import Company, User
from app.schemas.common import CompanyIn

router = APIRouter()


@router.get("")
def list_companies(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return [
        {
            "id": c.id,
            "name": c.name,
            "industry": c.industry,
            "employees": c.employees,
            "revenue": c.revenue,
            "website": c.website,
            "parent_company_id": c.parent_company_id,
        }
        for c in db.query(Company).all()
    ]


@router.post("")
def create_company(
    payload: CompanyIn,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    company = Company(id=str(uuid.uuid4()), **payload.model_dump())
    db.add(company)
    db.commit()
    db.refresh(company)
    return {
        "id": company.id,
        **payload.model_dump(),
    }


@router.delete("/{company_id}")
def delete_company(
    company_id: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    company = db.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(company)
    db.commit()
    return {"ok": True}
