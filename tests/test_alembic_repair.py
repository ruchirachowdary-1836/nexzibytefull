from fastapi.testclient import TestClient

from app.config import settings
from app.main import app


def test_alembic_repair_requires_secret(monkeypatch):
    monkeypatch.setattr(settings, "alembic_repair_secret", "configured-repair-secret")

    client = TestClient(app)
    assert client.post("/internal/fix-alembic").status_code == 404
    assert client.post(
        "/internal/fix-alembic",
        headers={"X-Alembic-Repair-Key": "incorrect-repair-secret"},
    ).status_code == 404


def test_alembic_repair_is_disabled_without_secret(monkeypatch):
    monkeypatch.setattr(settings, "alembic_repair_secret", None)

    response = TestClient(app).post(
        "/internal/fix-alembic",
        headers={"X-Alembic-Repair-Key": "any-secret"},
    )

    assert response.status_code == 503
    assert response.json()["detail"] == "Alembic repair is not enabled."
