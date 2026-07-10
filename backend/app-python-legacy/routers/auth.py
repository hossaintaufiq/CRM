import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.security import (
    create_access_token,
    get_current_user,
    hash_password,
    verify_password,
)
from app.config import settings
from app.database import get_db
from app.models import User
from app.schemas.common import (
    LoginRequest,
    OAuthStubRequest,
    RegisterRequest,
    TokenResponse,
    UserOut,
)

router = APIRouter()


def _user_dict(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "department": user.department,
        "team": user.team,
        "status": user.status,
        "email_verified": user.email_verified,
        "mfa_enabled": user.mfa_enabled,
    }


@router.post("/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        id=str(uuid.uuid4()),
        email=payload.email.lower(),
        full_name=payload.full_name,
        hashed_password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(user.id, {"role": user.role})
    return TokenResponse(access_token=token, user=_user_dict(user))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.status == "suspended":
        raise HTTPException(status_code=403, detail="User suspended")
    token = create_access_token(user.id, {"role": user.role})
    return TokenResponse(access_token=token, user=_user_dict(user))


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return user


@router.post("/password-reset/request")
def password_reset_request(email: str):
    return {
        "status": "accepted",
        "message": "If SMTP is configured, a reset email would be sent.",
        "email": email,
        "requires": ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD"],
        "configured": bool(settings.smtp_host),
    }


@router.post("/oauth/{provider}/start")
def oauth_start(provider: str, payload: OAuthStubRequest | None = None):
    provider = provider.lower()
    mapping = {
        "google": (settings.google_client_id, "GOOGLE_CLIENT_ID"),
        "microsoft": (settings.microsoft_client_id, "MICROSOFT_CLIENT_ID"),
        "apple": (settings.apple_client_id, "APPLE_CLIENT_ID"),
        "github": (settings.github_client_id, "GITHUB_CLIENT_ID"),
    }
    if provider not in mapping:
        raise HTTPException(status_code=404, detail="Unknown provider")
    client_id, env_name = mapping[provider]
    return {
        "status": "needs_external" if not client_id else "ready",
        "provider": provider,
        "configured": bool(client_id),
        "requires": [env_name, env_name.replace("CLIENT_ID", "CLIENT_SECRET")],
        "redirect_uri": payload.redirect_uri if payload else None,
        "message": f"{provider.title()} OAuth is scaffolded. Configure secrets to enable.",
    }


@router.post("/magic-link")
def magic_link(email: str):
    return {
        "status": "needs_external",
        "email": email,
        "requires": ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD"],
        "configured": bool(settings.smtp_host),
    }


@router.post("/otp/send")
def otp_send(phone: str):
    return {
        "status": "needs_external",
        "phone": phone,
        "requires": ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN"],
        "configured": bool(settings.twilio_account_sid),
    }


@router.post("/sso/start")
def sso_start():
    return {
        "status": "needs_external",
        "requires": ["SSO_METADATA_URL"],
        "configured": bool(settings.sso_metadata_url),
    }


@router.post("/ldap/login")
def ldap_login():
    return {
        "status": "needs_external",
        "requires": ["LDAP_SERVER"],
        "configured": bool(settings.ldap_server),
        "message": "LDAP/AD login scaffolded only.",
    }
