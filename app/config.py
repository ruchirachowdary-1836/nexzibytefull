from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_url: str = "sqlite:///./techtalk.db"
    jwt_secret: str = "change-this-in-production"
    access_token_expire_minutes: int = 60
    # Comma-separated browser-client origins. Use specific production URLs when
    # the API is consumed by a browser-based client.
    cors_origins: str = "*"
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None
    mail_from: str | None = None
    frontend_url: str = "https://techtalk-frontend-acvb.onrender.com"
    visitor_promotion_date: str | None = None
    neon_auth_jwks_url: str | None = None
    neon_auth_issuer: str | None = None
    neon_auth_audience: str | None = None
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()


def allowed_origins() -> list[str]:
    raw_origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
    if "*" in raw_origins:
        return ["*"]
    configured = raw_origins
    production_origin = "https://techtalk-frontend-acvb.onrender.com"
    if production_origin not in configured:
        configured.append(production_origin)
    return configured or ["*"]
