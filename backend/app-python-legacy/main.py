"""Nexus CRM Backend — FastAPI application entrypoint."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine, SessionLocal
from app.seed import seed_database
from app.routers import (
    auth,
    users,
    roles,
    organizations,
    dashboard,
    leads,
    deals,
    contacts,
    companies,
    activities,
    notifications,
    automations,
    tasks,
    pipeline,
    settings as settings_router,
    modules,
)


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="Nexus CRM API",
    description="Enterprise CRM backend. Core modules are live; remaining modules are scaffolded stubs.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api = "/api/v1"

app.include_router(auth.router, prefix=f"{api}/auth", tags=["Auth"])
app.include_router(users.router, prefix=f"{api}/users", tags=["Users"])
app.include_router(roles.router, prefix=f"{api}/roles", tags=["RBAC"])
app.include_router(organizations.router, prefix=f"{api}/organizations", tags=["Organizations"])
app.include_router(dashboard.router, prefix=f"{api}/dashboard", tags=["Dashboard"])
app.include_router(leads.router, prefix=f"{api}/leads", tags=["Leads"])
app.include_router(deals.router, prefix=f"{api}/deals", tags=["Deals"])
app.include_router(contacts.router, prefix=f"{api}/contacts", tags=["Contacts"])
app.include_router(companies.router, prefix=f"{api}/companies", tags=["Companies"])
app.include_router(activities.router, prefix=f"{api}/activities", tags=["Activities"])
app.include_router(notifications.router, prefix=f"{api}/notifications", tags=["Notifications"])
app.include_router(automations.router, prefix=f"{api}/automations", tags=["Automations"])
app.include_router(tasks.router, prefix=f"{api}/tasks", tags=["Tasks"])
app.include_router(pipeline.router, prefix=f"{api}/pipeline", tags=["Pipeline"])
app.include_router(settings_router.router, prefix=f"{api}/settings", tags=["Settings"])
app.include_router(modules.router, prefix=f"{api}/modules", tags=["Enterprise Modules"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "nexus-crm-backend", "version": "0.1.0"}
