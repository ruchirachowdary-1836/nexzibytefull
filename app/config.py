from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    db_url: str = "sqlite:///./techtalk.db"
    jwt_secret: str = "change-this-in-production"
    access_token_expire_minutes: int = 60
    # Comma-separated origins let the separately deployed frontend call this API.
    # Use a specific production URL on Render rather than leaving this as "*".
    cors_origins: str = "*"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()


def allowed_origins() -> list[str]:
    return [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
