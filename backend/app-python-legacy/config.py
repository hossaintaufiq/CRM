from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Nexus CRM"
    secret_key: str = "dev-secret-change-me-in-production-nexus-crm-2026"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    database_url: str = "sqlite:///./nexus_crm.db"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ]

    # External auth / integrations — leave empty until configured
    google_client_id: str = ""
    google_client_secret: str = ""
    microsoft_client_id: str = ""
    microsoft_client_secret: str = ""
    apple_client_id: str = ""
    apple_client_secret: str = ""
    github_client_id: str = ""
    github_client_secret: str = ""
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    smtp_host: str = ""
    smtp_user: str = ""
    smtp_password: str = ""
    ldap_server: str = ""
    sso_metadata_url: str = ""
    stripe_secret_key: str = ""
    openai_api_key: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
