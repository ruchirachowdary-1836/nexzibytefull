from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_url: str = "sqlite:///./techtalk.db"
    database_url: str | None = None
    direct_database_url: str | None = None
    jwt_secret: str = "change-this-in-production"
    pass_qr_secret: str | None = None
    access_token_expire_minutes: int = 60
    # Comma-separated browser-client origins. Use specific production URLs when
    # the API is consumed by a browser-based client.
    cors_origins: str = (
        "https://techtalk-frontend-acvb.onrender.com,"
        "http://localhost:5173,http://127.0.0.1:5173"
    )
    frontend_url: str = "https://techtalk-frontend-acvb.onrender.com"
    visitor_promotion_date: str | None = None
    initial_admin_email: str | None = None
    admin_report_email: str | None = None
    contact_notify_email: str | None = None
    admin_report_hour_utc: int = Field(default=9, ge=0, le=23)
    neon_auth_jwks_url: str | None = None
    neon_auth_issuer: str | None = None
    neon_auth_audience: str | None = None
    bcrypt_rounds: int = 12
    password_min_length: int = 12
    hibp_enabled: bool = True
    hibp_timeout_seconds: float = 2.0
    refresh_token_expire_days: int = 30
    cleanup_interval_seconds: int = 3600
    stale_account_days: int = 30
    brevo_api_key: str | None = None
    brevo_sender_email: str | None = None
    brevo_sender_name: str | None = None
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        populate_by_name=True,
    )

settings = Settings()


def allowed_origins() -> list[str]:
    raw_origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
    if "*" in raw_origins:
        raw_origins = [
            "https://techtalk-frontend-acvb.onrender.com",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
    configured = raw_origins
    production_origin = "https://techtalk-frontend-acvb.onrender.com"
    if production_origin not in configured:
        configured.append(production_origin)
    return configured or ["*"]
