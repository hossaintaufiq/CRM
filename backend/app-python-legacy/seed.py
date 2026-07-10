from __future__ import annotations

import uuid
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.auth.security import hash_password
from app.models import (
    Activity,
    Automation,
    Company,
    Contact,
    Deal,
    Lead,
    Notification,
    Organization,
    PipelineStage,
    Task,
    User,
)


def _id() -> str:
    return str(uuid.uuid4())


def seed_database(db: Session) -> None:
    if db.query(User).first():
        return

    org_id = _id()
    org = Organization(
        id=org_id,
        name="Northstar Ventures",
        default_currency="USD",
        fiscal_year_start="January",
    )
    db.add(org)

    admin = User(
        id=_id(),
        email="admin@nexus.crm",
        full_name="Avery Blake",
        hashed_password=hash_password("Admin123!"),
        role="Admin",
        department="Operations",
        team="Leadership",
        status="active",
        organization_id=org_id,
        email_verified=True,
    )
    sales = User(
        id=_id(),
        email="sales@nexus.crm",
        full_name="Jules Tan",
        hashed_password=hash_password("Sales123!"),
        role="Sales",
        department="Sales",
        team="Enterprise",
        status="active",
        organization_id=org_id,
        email_verified=True,
    )
    db.add_all([admin, sales])

    stages = [
        ("Lead", "#64748b", 0),
        ("Qualified", "#0891b2", 1),
        ("Proposal", "#0d9488", 2),
        ("Negotiation", "#d97706", 3),
        ("Closed Won", "#059669", 4),
        ("Closed Lost", "#dc2626", 5),
    ]
    for stage_id, color, order in stages:
        db.add(
            PipelineStage(
                id=stage_id,
                label=stage_id,
                color=color,
                visible=True,
                order=order,
            )
        )

    deals = [
        Deal(
            id=_id(),
            title="Enterprise platform expansion",
            company_name="Northwind Labs",
            value=92000,
            health_score="Hot",
            priority="High",
            probability=75,
            owner_name="Avery Blake",
            owner_initials="AB",
            stage="Negotiation",
            close_date=(datetime.utcnow() + timedelta(days=18)).date().isoformat(),
            tags=["Enterprise", "Expansion"],
            notes="Legal review in progress.",
        ),
        Deal(
            id=_id(),
            title="RevOps suite rollout",
            company_name="Altair Cloud",
            value=48000,
            health_score="Warm",
            priority="Medium",
            probability=55,
            owner_name="Jules Tan",
            owner_initials="JT",
            stage="Proposal",
            close_date=(datetime.utcnow() + timedelta(days=36)).date().isoformat(),
            tags=["Mid-market"],
            notes="Proposal v2 sent.",
        ),
        Deal(
            id=_id(),
            title="AI copilots pilot",
            company_name="ForgePoint AI",
            value=64000,
            health_score="Warm",
            priority="Medium",
            probability=20,
            owner_name="Jules Tan",
            owner_initials="JT",
            stage="Lead",
            close_date=(datetime.utcnow() + timedelta(days=50)).date().isoformat(),
            tags=["Pilot", "AI"],
            notes="Inbound demo request.",
        ),
        Deal(
            id=_id(),
            title="Annual data platform renewal",
            company_name="Summit Dataworks",
            value=210000,
            health_score="Hot",
            priority="Critical",
            probability=100,
            owner_name="Avery Blake",
            owner_initials="AB",
            stage="Closed Won",
            close_date=datetime.utcnow().date().isoformat(),
            tags=["Renewal"],
            notes="Signed.",
        ),
    ]
    db.add_all(deals)

    leads = [
        Lead(
            id=_id(),
            name="Maya Patel",
            company="Nordic Forge",
            email="maya@nordicforge.io",
            phone="+1 415 555 0192",
            source="Inbound",
            status="Working",
            score=82,
            owner_id=admin.id,
            timeline=["Downloaded whitepaper", "Booked qualification call"],
        ),
        Lead(
            id=_id(),
            name="Rafael Kim",
            company="OrbitIQ",
            email="rafael@orbitiq.dev",
            phone="+1 415 555 0113",
            source="Outbound",
            status="New",
            score=64,
            owner_id=sales.id,
            timeline=["Clicked campaign CTA"],
        ),
    ]
    db.add_all(leads)

    contacts = [
        Contact(
            id=_id(),
            name="Alicia Moore",
            company="Northwind Labs",
            role="VP Operations",
            email="alicia@northwind.io",
            phone="+1 415 555 0170",
            owner="Avery Blake",
        ),
        Contact(
            id=_id(),
            name="Derek Lin",
            company="Altair Cloud",
            role="Head of RevOps",
            email="derek@altaircloud.com",
            phone="+1 415 555 0178",
            owner="Jules Tan",
        ),
    ]
    db.add_all(contacts)

    db.add_all(
        [
            Company(
                id=_id(),
                name="Northwind Labs",
                industry="SaaS",
                employees=420,
                revenue=48_000_000,
                website="https://northwind.io",
            ),
            Company(
                id=_id(),
                name="Altair Cloud",
                industry="Cloud Infrastructure",
                employees=180,
                revenue=22_000_000,
                website="https://altaircloud.com",
            ),
        ]
    )

    db.add_all(
        [
            Automation(
                id=_id(),
                name="Inbound lead routing",
                trigger="New inbound lead",
                status="Active",
                runs_today=17,
            ),
            Automation(
                id=_id(),
                name="Proposal follow-up",
                trigger="Proposal sent + 48h no reply",
                status="Active",
                runs_today=9,
            ),
            Automation(
                id=_id(),
                name="Dormant deal reminder",
                trigger="No activity for 7 days",
                status="Paused",
                runs_today=0,
            ),
        ]
    )

    db.add(
        Task(
            id=_id(),
            title="Send security packet to Northwind",
            description="Include SOC2 + DPA",
            assignee="Avery Blake",
            priority="High",
            status="Todo",
            due_date=(datetime.utcnow() + timedelta(days=2)).date().isoformat(),
        )
    )

    db.add(
        Activity(
            id=_id(),
            actor="Avery Blake",
            action="seeded workspace",
            target="Nexus CRM",
            timestamp=datetime.utcnow(),
        )
    )
    db.add(
        Notification(
            id=_id(),
            title="Welcome to Nexus",
            description="Backend is live with demo seed data.",
            read=False,
            user_id=admin.id,
        )
    )

    db.commit()
