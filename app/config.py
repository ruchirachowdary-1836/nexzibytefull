from pydantic import AliasChoices, Field, field_validator
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
    smtp_host: str | None = Field(
        default=None,
        validation_alias=AliasChoices("SMTP_HOST", "smtp_host"),
    )
    smtp_port: int = Field(
        default=587,
        validation_alias=AliasChoices("SMTP_PORT", "smtp_port"),
    )
    smtp_user: str | None = Field(
        default=None,
        validation_alias=AliasChoices("SMTP_USER", "smtp_user"),
    )
    smtp_password: str | None = Field(
        default=None,
        validation_alias=AliasChoices("SMTP_PASSWORD", "smtp_password"),
    )
    mail_from: str | None = Field(
        default=None,
        validation_alias=AliasChoices("MAIL_FROM", "mail_from"),
    )
    frontend_url: str = "https://techtalk-frontend-acvb.onrender.com"
    visitor_promotion_date: str | None = None
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
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        populate_by_name=True,
    )

    @field_validator("smtp_host", "smtp_user", "smtp_password", "mail_from", mode="before")
    @classmethod
    def normalize_smtp_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = str(value).strip()
        return normalized or None


settings = Settings()


def smtp_sender() -> str | None:
    return settings.mail_from or settings.smtp_user


def smtp_missing_settings() -> list[str]:
    missing: list[str] = []
    if not settings.smtp_host:
        missing.append("SMTP_HOST")
    if not settings.smtp_port or not 1 <= settings.smtp_port <= 65535:
        missing.append("SMTP_PORT")
    if not settings.smtp_user:
        missing.append("SMTP_USER")
    if not settings.smtp_password:
        missing.append("SMTP_PASSWORD")
    if not smtp_sender():
        missing.append("MAIL_FROM")
    return missing


def smtp_configured() -> bool:
    return not smtp_missing_settings()


def smtp_runtime_diagnostic() -> dict[str, bool]:
    return {
        "SMTP_HOST": bool(settings.smtp_host),
        "SMTP_PORT": bool(settings.smtp_port and 1 <= settings.smtp_port <= 65535),
        "SMTP_USER": bool(settings.smtp_user),
        "SMTP_PASSWORD": bool(settings.smtp_password),
        "MAIL_FROM": bool(settings.mail_from),
        "smtp_configured": smtp_configured(),
    }


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
