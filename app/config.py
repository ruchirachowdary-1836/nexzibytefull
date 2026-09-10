from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_url: str = "sqlite:///./techtalk.db"
    jwt_secret: str = "change-this-in-production"
    access_token_expire_minutes: int = 60
    # Comma-separated browser-client origins. Use specific production URLs when
    # the API is consumed by a browser-based client.
    cors_origins: str = "*"
    frontend_url: str = "https://techtalk-frontend-acvb.onrender.com"
    google_client_id: str | None = "871004671345-2belb4f6tdfn88t6d3q16ne1atjr02tn.apps.googleusercontent.com"
    google_client_secret: str | None = None
    google_redirect_uri: str = "https://techtalk-backend-shob.onrender.com/auth/google/callback"
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
