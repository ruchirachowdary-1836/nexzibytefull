from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text

from app.config import settings
from app import main as main_module
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


def test_alembic_state_diagnostic_is_authenticated_and_read_only(monkeypatch, tmp_path):
    engine = create_engine(
        f"sqlite:///{(tmp_path / 'diagnostic.sqlite').as_posix()}",
        connect_args={"check_same_thread": False},
    )
    with engine.begin() as connection:
        connection.execute(
            text(
                "CREATE TABLE alembic_version "
                "(version_num VARCHAR(32) NOT NULL PRIMARY KEY)"
            )
        )
        connection.execute(
            text("INSERT INTO alembic_version(version_num) VALUES ('0020_registration_emails')")
        )
    monkeypatch.setattr(main_module, "engine", engine)
    monkeypatch.setattr(settings, "alembic_repair_secret", "diagnostic-test-secret")
    monkeypatch.setattr(settings, "database_url", None)

    client = TestClient(app)
    try:
        assert client.get("/internal/alembic-state").status_code == 404
        response = client.get(
            "/internal/alembic-state",
            headers={"X-Alembic-Repair-Key": "diagnostic-test-secret"},
        )
        assert response.status_code == 200
        assert response.json() == {
            "database_host": None,
            "database_url_setting": "DB_URL",
            "alembic_version_exists": True,
            "alembic_versions": ["0020_registration_emails"],
        }
        with engine.connect() as connection:
            assert connection.execute(
                text("SELECT version_num FROM alembic_version")
            ).scalar_one() == "0020_registration_emails"
    finally:
        client.close()
        engine.dispose()


def test_alembic_state_diagnostic_is_disabled_without_secret(monkeypatch):
    monkeypatch.setattr(settings, "alembic_repair_secret", None)

    response = TestClient(app).get(
        "/internal/alembic-state",
        headers={"X-Alembic-Repair-Key": "any-secret"},
    )

    assert response.status_code == 503
