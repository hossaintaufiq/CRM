from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.security import get_current_user
from app.database import get_db
from app.models import Automation, Contact, Deal, Lead, Notification, User

router = APIRouter()


@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    deals = db.query(Deal).all()
    leads = db.query(Lead).all()
    contacts = db.query(Contact).all()
    automations = db.query(Automation).all()
    notifications = db.query(Notification).all()

    open_deals = [d for d in deals if d.stage not in ("Closed Won", "Closed Lost")]
    won = [d for d in deals if d.stage == "Closed Won"]
    lost = [d for d in deals if d.stage == "Closed Lost"]
    closed = len(won) + len(lost)
    open_value = sum(d.value for d in open_deals)
    weighted = sum(d.value * (d.probability / 100) for d in open_deals)

    return {
        "openPipelineValue": open_value,
        "weightedPipelineValue": round(weighted),
        "openDeals": len(open_deals),
        "wonDeals": len(won),
        "lostDeals": len(lost),
        "winRate": round((len(won) / closed) * 100) if closed else 0,
        "leadCount": len(leads),
        "avgLeadScore": round(sum(l.score for l in leads) / len(leads)) if leads else 0,
        "contactCount": len(contacts),
        "activeAutomations": len([a for a in automations if a.status == "Active"]),
        "automationRunsToday": sum(a.runs_today for a in automations),
        "unreadNotifications": len([n for n in notifications if not n.read]),
        "hotDeals": len([d for d in open_deals if d.health_score == "Hot"]),
        "closingThisMonth": len(open_deals),
        "kpis": [
            {
                "id": "mrr",
                "label": "MRR / ARR",
                "value": "$428K / $5.1M",
                "changeLabel": "+12.4% MoM",
                "trend": [52, 57, 61, 64, 66, 70, 76, 81, 83, 88],
            },
            {
                "id": "conversion",
                "label": "Conversion Rate",
                "value": "18.6%",
                "changeLabel": "+1.2 pts",
                "trend": [8, 11, 12, 13, 12, 14, 16, 17, 17, 19],
            },
            {
                "id": "activeDeals",
                "label": "Active Deals",
                "value": str(len(open_deals)),
                "changeLabel": "+9 this week",
                "trend": [102, 109, 111, 115, 120, 128, 131, 138, 140, len(open_deals) or 1],
            },
            {
                "id": "winLoss",
                "label": "Win / Loss Ratio",
                "value": f"{(len(won) / len(lost)):.1f}x" if lost else "n/a",
                "changeLabel": "+0.3x QoQ",
                "trend": [15, 16, 17, 18, 20, 21, 22, 24, 25, 28],
            },
        ],
    }
