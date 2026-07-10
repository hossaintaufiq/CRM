from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database import get_db
from app.models import Organization, User
from app.schemas.common import WorkspaceSettings

router = APIRouter()


@router.get("/workspace", response_model=WorkspaceSettings)
def get_workspace(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    org = db.query(Organization).first()
    if not org:
        return WorkspaceSettings(organizationName="Nexus CRM")
    return WorkspaceSettings(
        organizationName=org.name,
        defaultCurrency=org.default_currency,
        fiscalYearStart=org.fiscal_year_start,
    )


@router.put("/workspace", response_model=WorkspaceSettings)
def put_workspace(
    payload: WorkspaceSettings,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    org = db.query(Organization).first()
    if org:
        org.name = payload.organizationName
        org.default_currency = payload.defaultCurrency
        org.fiscal_year_start = payload.fiscalYearStart
        db.commit()
    return payload
