"""Enterprise module stubs — every planned capability is addressable via API."""

from fastapi import APIRouter, Depends, HTTPException

from app.auth.security import get_current_user
from app.models import User
from app.services.feature_registry import FEATURES, features_by_status

router = APIRouter()

STUB_MODULES = [
    "calendar",
    "email",
    "communication",
    "marketing",
    "support",
    "ai",
    "documents",
    "quotes",
    "invoices",
    "products",
    "subscriptions",
    "analytics-advanced",
    "integrations",
    "webhooks",
    "import-export",
    "hr",
    "finance",
    "portal",
    "knowledge-base",
    "forms",
    "surveys",
    "inventory",
    "projects",
    "time-tracking",
    "collaboration",
    "bi",
    "ecommerce",
    "social",
    "events",
    "loyalty",
    "enterprise",
    "graphql",
    "mobile",
]


@router.get("/features")
def list_features(_: User = Depends(get_current_user)):
    grouped = features_by_status()
    return {
        "total": len(FEATURES),
        "counts": {k: len(v) for k, v in grouped.items()},
        "features": FEATURES,
    }


@router.get("/features/summary")
def features_summary(_: User = Depends(get_current_user)):
    grouped = features_by_status()
    return {
        "live": [f["name"] for f in grouped["live"]],
        "partial": [f["name"] for f in grouped["partial"]],
        "stub": [f["name"] for f in grouped["stub"]],
        "needs_external": [
            {"name": f["name"], "requires": f["requires"]} for f in grouped["needs_external"]
        ],
    }


@router.get("/features/{feature_id}")
def feature_detail(feature_id: str, _: User = Depends(get_current_user)):
    for feature in FEATURES:
        if feature["id"] == feature_id:
            return feature
    raise HTTPException(status_code=404, detail="Feature not found")


@router.get("/{module_name}")
def module_stub(module_name: str, _: User = Depends(get_current_user)):
    external_hints = {
        "calendar": ["GOOGLE_CLIENT_ID", "MICROSOFT_CLIENT_ID"],
        "email": ["SMTP_HOST", "GOOGLE_CLIENT_ID"],
        "communication": ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"],
        "ai": ["OPENAI_API_KEY"],
        "subscriptions": ["STRIPE_SECRET_KEY"],
        "integrations": [],
    }
    requires = external_hints.get(module_name, [])
    return {
        "module": module_name,
        "status": "needs_external" if requires else "stub",
        "message": f"Module '{module_name}' is scaffolded for the enterprise roadmap.",
        "requires": requires,
        "docs": "/api/v1/modules/features",
    }