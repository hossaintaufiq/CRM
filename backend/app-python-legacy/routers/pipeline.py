from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database import get_db
from app.models import PipelineStage, User

router = APIRouter()

_preferences = {
    "viewMode": "board",
    "compactCards": False,
    "showProbability": True,
    "showCloseDate": True,
    "showTags": True,
    "defaultSort": "value",
}


class StageUpdate(BaseModel):
    id: str
    label: str
    color: str
    visible: bool
    order: int


class PrefsUpdate(BaseModel):
    viewMode: str | None = None
    compactCards: bool | None = None
    showProbability: bool | None = None
    showCloseDate: bool | None = None
    showTags: bool | None = None
    defaultSort: str | None = None


@router.get("/stages")
def get_stages(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    stages = db.query(PipelineStage).order_by(PipelineStage.order).all()
    return [
        {
            "id": s.id,
            "label": s.label,
            "color": s.color,
            "visible": s.visible,
            "order": s.order,
        }
        for s in stages
    ]


@router.put("/stages")
def put_stages(
    payload: list[StageUpdate],
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    for item in payload:
        stage = db.get(PipelineStage, item.id)
        if stage:
            stage.label = item.label
            stage.color = item.color
            stage.visible = item.visible
            stage.order = item.order
    db.commit()
    stages = db.query(PipelineStage).order_by(PipelineStage.order).all()
    return [
        {
            "id": s.id,
            "label": s.label,
            "color": s.color,
            "visible": s.visible,
            "order": s.order,
        }
        for s in stages
    ]


@router.get("/preferences")
def get_preferences(_: User = Depends(get_current_user)):
    return _preferences


@router.put("/preferences")
def put_preferences(payload: PrefsUpdate, _: User = Depends(get_current_user)):
    data = payload.model_dump(exclude_none=True)
    _preferences.update(data)
    return _preferences
