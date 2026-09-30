from fastapi import Header, HTTPException
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import main as main_module
from app.auth import _sync_user, get_current_user
from app.config import settings
from app.database import Base, get_db
from app.models import User


def make_role_client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    session_factory = sessionmaker(bind=engine, expire_on_commit=False)
    with session_factory() as db:
        db.add_all(
            [
                User(name="Member", email="user@example.com", role="user", is_active=True, email_verified=True),
                User(name="Staff", email="staff@example.com", role="staff", is_active=True, email_verified=True),
                User(name="Administrator", email="admin@example.com", role="admin", is_active=True, email_verified=True),
            ]
        )
        db.commit()
        user_ids = {
            user.role: user.id
            for user in db.query(User).filter(User.email.in_([
                "user@example.com", "staff@example.com", "admin@example.com",
            ]))
        }

    def override_db():
        with session_factory() as db:
            yield db

    def override_current_user(x_test_role: str = Header(default="user")):
        with session_factory() as db:
            user = db.query(User).filter_by(email=f"{x_test_role}@example.com").one_or_none()
            if user is None:
                raise HTTPException(401, detail="Unknown test role")
            db.expunge(user)
            return user

    main_module.app.dependency_overrides[get_db] = override_db
    main_module.app.dependency_overrides[get_current_user] = override_current_user
    return TestClient(main_module.app), session_factory, engine, user_ids


def close_role_client(client, engine):
    client.close()
    main_module.app.dependency_overrides.pop(get_current_user, None)
    main_module.app.dependency_overrides.pop(get_db, None)
    engine.dispose()


def test_role_dashboards_are_enforced_by_backend():
    client, _session_factory, engine, _user_ids = make_role_client()
    try:
        for role in ("user", "staff", "admin"):
            response = client.get("/users/me", headers={"X-Test-Role": role})
            assert response.status_code == 200
            assert response.json()["role"] == role

        assert client.get("/dashboard/member", headers={"X-Test-Role": "user"}).status_code == 200
        assert client.get("/dashboard/member", headers={"X-Test-Role": "staff"}).status_code == 403
        assert client.get("/dashboard/member", headers={"X-Test-Role": "admin"}).status_code == 403

        assert client.get("/staff/dashboard", headers={"X-Test-Role": "user"}).status_code == 403
        staff_dashboard = client.get("/staff/dashboard", headers={"X-Test-Role": "staff"})
        assert staff_dashboard.status_code == 200
        assert staff_dashboard.json()["has_event_data"] is False
        assert client.get("/staff/dashboard", headers={"X-Test-Role": "admin"}).status_code == 200
        invalid_qr = {"token": "invalid-pass-token-value"}
        assert client.post("/qr/verify", json=invalid_qr, headers={"X-Test-Role": "user"}).status_code == 403
        assert client.post("/qr/verify", json=invalid_qr, headers={"X-Test-Role": "staff"}).status_code == 200
        assert client.post("/qr/verify", json=invalid_qr, headers={"X-Test-Role": "admin"}).status_code == 200
        invalid_check_in = {"qr_data": "invalid-pass-token-value"}
        assert client.post("/admin/check-ins", json=invalid_check_in, headers={"X-Test-Role": "user"}).status_code == 403
        assert client.post("/admin/check-ins", json=invalid_check_in, headers={"X-Test-Role": "staff"}).status_code == 400
        assert client.post("/admin/check-ins", json=invalid_check_in, headers={"X-Test-Role": "admin"}).status_code == 400

        assert client.get("/admin/dashboard", headers={"X-Test-Role": "user"}).status_code == 403
        assert client.get("/admin/dashboard", headers={"X-Test-Role": "staff"}).status_code == 403
        assert client.get("/admin/dashboard", headers={"X-Test-Role": "admin"}).status_code == 200
    finally:
        close_role_client(client, engine)


def test_only_admin_can_change_another_users_role_and_profiles_cannot_change_roles():
    client, session_factory, engine, user_ids = make_role_client()
    try:
        for role in ("user", "staff"):
            response = client.post(
                f"/admin/users/{user_ids['user']}/role",
                json={"role": "staff"},
                headers={"X-Test-Role": role},
            )
            assert response.status_code == 403

        self_change = client.post(
            f"/admin/users/{user_ids['admin']}/role",
            json={"role": "user"},
            headers={"X-Test-Role": "admin"},
        )
        assert self_change.status_code == 403

        for path in ("/users/me", "/auth/profile"):
            response = client.put(
                path,
                json={"name": "Still a member", "role": "admin"},
                headers={"X-Test-Role": "user"},
            )
            assert response.status_code == 200
            assert response.json()["role"] == "user"

        changed = client.post(
            f"/admin/users/{user_ids['user']}/role",
            json={"role": "staff"},
            headers={"X-Test-Role": "admin"},
        )
        assert changed.status_code == 200
        assert changed.json()["role"] == "staff"
        assert client.get("/staff/dashboard", headers={"X-Test-Role": "user"}).status_code == 200

        invalid = client.post(
            f"/admin/users/{user_ids['user']}/role",
            json={"role": "super_admin"},
            headers={"X-Test-Role": "admin"},
        )
        assert invalid.status_code == 422
        with session_factory() as db:
            assert db.get(User, user_ids["user"]).role == "staff"
            assert db.get(User, user_ids["admin"]).role == "admin"
    finally:
        close_role_client(client, engine)


def test_initial_admin_email_bootstraps_only_when_no_admin_exists(monkeypatch):
    engine = create_engine("sqlite://", poolclass=StaticPool)
    Base.metadata.create_all(engine)
    session_factory = sessionmaker(bind=engine, expire_on_commit=False)
    monkeypatch.setattr(settings, "initial_admin_email", "first-admin@example.com")
    try:
        with session_factory() as db:
            initial_admin = _sync_user(
                db,
                {
                    "sub": "neon-first-admin",
                    "email": "first-admin@example.com",
                    "emailVerified": True,
                },
            )
            assert initial_admin.role == "admin"
            next_user = _sync_user(
                db,
                {
                    "sub": "neon-next-user",
                    "email": "next-user@example.com",
                    "emailVerified": True,
                },
            )
            assert next_user.role == "user"
    finally:
        engine.dispose()
