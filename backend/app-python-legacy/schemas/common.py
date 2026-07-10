from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr, Field


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict[str, Any]


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str
    role: str = "Sales"


class OAuthStubRequest(BaseModel):
    provider: str
    redirect_uri: str | None = None


class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    department: str
    team: str
    status: str
    email_verified: bool
    mfa_enabled: bool

    class Config:
        from_attributes = True


class LeadIn(BaseModel):
    name: str
    company: str
    email: EmailStr
    phone: str = ""
    source: str = "Inbound"
    status: str = "New"
    score: int = 50
    timeline: list[str] = []


class LeadOut(LeadIn):
    id: str
    lastTouch: str = "Just now"
    created_at: datetime | None = None

    class Config:
        from_attributes = True


class DealIn(BaseModel):
    title: str
    companyName: str
    value: float
    currency: str = "USD"
    healthScore: str = "Warm"
    priority: str = "Medium"
    probability: int = 25
    ownerName: str
    ownerInitials: str = ""
    stage: str = "Lead"
    closeDate: str = ""
    tags: list[str] = []
    notes: str = ""


class DealOut(DealIn):
    id: str
    lastActivity: str = "Just now"
    createdAt: str | None = None
    updatedAt: str | None = None


class ContactIn(BaseModel):
    name: str
    company: str
    role: str = ""
    email: EmailStr
    phone: str = ""
    owner: str = ""


class ContactOut(ContactIn):
    id: str


class CompanyIn(BaseModel):
    name: str
    industry: str = ""
    employees: int = 0
    revenue: float = 0
    website: str = ""
    parent_company_id: str | None = None


class CompanyOut(CompanyIn):
    id: str


class TaskIn(BaseModel):
    title: str
    description: str = ""
    assignee: str = ""
    priority: str = "Medium"
    status: str = "Todo"
    due_date: str = ""


class TaskOut(TaskIn):
    id: str


class BulkDelete(BaseModel):
    ids: list[str]


class WorkspaceSettings(BaseModel):
    organizationName: str
    defaultCurrency: str = "USD"
    fiscalYearStart: str = "January"


class ModuleStatus(BaseModel):
    id: str
    name: str
    category: str
    status: str
    notes: str
    requires: list[str] = []
