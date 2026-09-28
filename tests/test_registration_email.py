import os
from datetime import date, datetime, timedelta
from types import SimpleNamespace

os.environ["DB_URL"] = "sqlite:///./test_techtalk.db"

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import main as main_module
from app.auth import get_current_user, get_optional_user
from app.database import Base, get_db
from app.models import CourseApplication, PassRequest, Registration, Summit, User
from app.services.registration_email import build_registration_email


def test_registration_email_contains_issued_pass_and_escaped_values():
    email = build_registration_email(
        "registration",
        SimpleNamespace(name="<Asha & Co>", email="asha@example.com"),
        SimpleNamespace(
            email=None,
            status="registered",
            pass_id="PASS-123",
            qr_data="signed-qr-value",
        ),
        title="<AI Summit>",
        event_date=date(2030, 4, 5),
        event_time="10:30",
        venue="<Hall 1>",
        description="<script>alert('x')</script>",
    )

    assert email.recipient == "asha@example.com"
    assert email.subject == "You're registered: <AI Summit>"
    assert "PASS-123" in email.html_content
    assert "data:image/png;base64," in email.html_content
    assert "PASS-123" in email.text_content
    assert "&lt;Asha &amp; Co&gt;" in email.html_content
    assert "&lt;AI Summit&gt;" in email.html_content
    assert "&lt;script&gt;" in email.html_content
    assert "<script>" not in email.html_content


def test_registration_email_says_pass_is_pending():
    email = build_registration_email(
        "course_application",
        SimpleNamespace(name="Riya", email="riya@example.com"),
        SimpleNamespace(
            name="Riya",
            email="riya@example.com",
            status="submitted",
            pass_id=None,
            qr_data=None,
        ),
        title="FastAPI",
        event_date=None,
        event_time=None,
        venue="Online",
        description="Course application.",
    )

    assert "not been issued yet" in email.html_content
    assert "not been issued yet" in email.text_content
    assert "data:image/png;base64," not in email.html_content
    assert email.subject == "We received your application: FastAPI"


def test_issuing_a_pass_later_sends_new_pass_even_during_retry_window(
    monkeypatch, tmp_path
):
    _, test_session, _, engine = make_client(monkeypatch, tmp_path)
    send = []
    monkeypatch.setattr(main_module, "send_registration_email", lambda *args, **kwargs: send.append(args))
    try:
        with test_session() as db:
            user = User(
                name="Riya",
                email="riya@example.com",
                email_verified=True,
                is_active=True,
            )
            db.add(user)
            db.flush()
            request = PassRequest(
                user_id=user.id,
                first_name="Riya",
                last_name="",
                email=user.email,
                pass_type="founder-pass",
                amount="₹499",
                status="approved",
                pass_id="TT26-000099",
                qr_data="issued-qr-data",
                issued_at=datetime.utcnow(),
                email_last_attempt_at=datetime.utcnow(),
            )
            db.add(request)
            db.commit()
            request_id = request.id

        main_module.send_registration_email_background(
            "pass_request", request_id, "approval-request", pass_issued=True
        )
        assert len(send) == 1
        with test_session() as db:
            request = db.get(PassRequest, request_id)
            assert request.email_delivery_status == "sent"
            assert request.email_pass_id == "TT26-000099"
    finally:
        close_client(None, engine)


def make_client(monkeypatch, tmp_path):
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    test_session = sessionmaker(bind=engine, expire_on_commit=False)
    monkeypatch.setattr(main_module, "SessionLocal", test_session)
    active_user = {"value": None}

    def override_db():
        db = test_session()
        try:
            yield db
        finally:
            db.close()

    def override_user():
        return active_user["value"]

    main_module.app.dependency_overrides[get_db] = override_db
    main_module.app.dependency_overrides[get_current_user] = override_user
    main_module.app.dependency_overrides[get_optional_user] = override_user
    client = TestClient(main_module.app)
    return client, test_session, active_user, engine


def close_client(client, engine):
    if client is not None:
        client.close()
    main_module.app.dependency_overrides.pop(get_db, None)
    main_module.app.dependency_overrides.pop(get_current_user, None)
    main_module.app.dependency_overrides.pop(get_optional_user, None)
    engine.dispose()


def test_registration_email_is_sent_once(monkeypatch, tmp_path):
    client, test_session, active_user, engine = make_client(monkeypatch, tmp_path)
    send = []
    monkeypatch.setattr(main_module, "send_registration_email", lambda *args, **kwargs: send.append(args))
    try:
        with test_session() as db:
            user = User(
                name="Asha Rao",
                email="asha@example.com",
                email_verified=True,
                is_active=True,
            )
            event = Summit(
                title="AI Forum",
                date=date(2030, 4, 5),
                location="Hyderabad",
                status="upcoming",
                is_published=True,
            )
            db.add_all([user, event])
            db.commit()
            db.refresh(user)
            db.refresh(event)
            active_user["value"] = user
            event_id = event.id

        response = client.post(
            "/registrations",
            json={"event_type": "summit", "event_id": event_id},
        )
        assert response.status_code == 201
        registration_id = response.json()["id"]
        assert len(send) == 1

        main_module.send_registration_email_background(
            "registration", registration_id, "test-request"
        )
        assert len(send) == 1
        with test_session() as db:
            registration = db.get(Registration, registration_id)
            assert registration.email_delivery_status == "sent"
            assert registration.email_sent_at is not None
            assert registration.email_pass_id == registration.pass_id
    finally:
        close_client(client, engine)


def test_registration_is_saved_when_brevo_fails(monkeypatch, tmp_path, caplog):
    client, test_session, active_user, engine = make_client(monkeypatch, tmp_path)

    def fail_send(*args, **kwargs):
        raise RuntimeError("provider error")

    monkeypatch.setattr(main_module, "send_registration_email", fail_send)
    try:
        with test_session() as db:
            user = User(
                name="Riya",
                email="riya@example.com",
                email_verified=True,
                is_active=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            active_user["value"] = user

        response = client.post(
            "/pass-requests",
            json={
                "name": "Riya",
                "email": "riya@example.com",
                "pass_type": "visitor-pass",
                "amount": "FREE",
            },
        )
        assert response.status_code == 201
        assert response.json()["pass_id"]
        with test_session() as db:
            saved = db.get(PassRequest, response.json()["id"])
            assert saved is not None
            assert saved.email_delivery_status == "failed"
        failure = next(
            record
            for record in caplog.records
            if record.getMessage() == "registration_email_failed"
            and getattr(record, "registration_id", None) == response.json()["id"]
        )
        assert failure.request_id
        assert failure.error_type == "RuntimeError"
        assert "provider error" not in caplog.text
    finally:
        close_client(client, engine)


def test_course_application_sends_to_verified_account_email(monkeypatch, tmp_path):
    client, test_session, active_user, engine = make_client(monkeypatch, tmp_path)
    send = []
    monkeypatch.setattr(main_module, "send_registration_email", lambda *args, **kwargs: send.append((args, kwargs)))
    try:
        with test_session() as db:
            user = User(
                name="Verified Name",
                email="verified@example.com",
                email_verified=True,
                is_active=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            active_user["value"] = user

        response = client.post(
            "/course-applications",
            json={
                "course_id": "fastapi",
                "course_title": "FastAPI",
                "name": "Applicant Name",
                "email": "unverified-destination@example.com",
                "phone": "555-0100",
            },
        )
        assert response.status_code == 201
        assert response.json()["email"] == "verified@example.com"
        assert len(send) == 1
        with test_session() as db:
            saved = db.get(CourseApplication, response.json()["id"])
            assert saved.email == "verified@example.com"
            assert saved.email_delivery_status == "sent"
    finally:
        close_client(client, engine)


def test_unverified_registration_is_saved_without_sending_email(
    monkeypatch, tmp_path
):
    client, test_session, active_user, engine = make_client(monkeypatch, tmp_path)
    send = []
    monkeypatch.setattr(main_module, "send_registration_email", lambda *args, **kwargs: send.append(args))
    try:
        with test_session() as db:
            user = User(
                name="Unverified",
                email="unverified@example.com",
                email_verified=False,
                is_active=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            active_user["value"] = user

        response = client.post(
            "/course-applications",
            json={
                "course_id": "fastapi",
                "course_title": "FastAPI",
                "name": "Unverified",
                "email": "unverified@example.com",
                "phone": "555-0100",
            },
        )
        assert response.status_code == 201
        assert response.json()["email_delivery_status"] == "not_eligible"
        with test_session() as db:
            application = db.get(CourseApplication, response.json()["id"])
            assert application is not None
            assert application.email == "unverified@example.com"
        assert send == []
    finally:
        close_client(client, engine)


def test_resend_is_allowed_for_owner_and_refused_for_another_user(
    monkeypatch, tmp_path
):
    client, test_session, active_user, engine = make_client(monkeypatch, tmp_path)
    send = []
    monkeypatch.setattr(main_module, "send_registration_email", lambda *args, **kwargs: send.append(args))
    try:
        with test_session() as db:
            owner = User(
                name="Owner",
                email="owner@example.com",
                email_verified=True,
                is_active=True,
            )
            other = User(
                name="Other",
                email="other@example.com",
                email_verified=True,
                is_active=True,
            )
            db.add_all([owner, other])
            db.flush()
            request = PassRequest(
                user_id=owner.id,
                first_name="Owner",
                last_name="",
                email=owner.email,
                pass_type="community-pass",
                amount="FREE",
                status="issued",
                pass_id="TT26-000001",
                qr_data="signed-qr",
                issued_at=datetime.utcnow(),
                email_sent_at=datetime.utcnow(),
                email_pass_id="TT26-000001",
                email_delivery_status="sent",
                email_last_attempt_at=datetime.utcnow() - timedelta(minutes=4),
            )
            db.add(request)
            db.commit()
            db.refresh(owner)
            db.refresh(other)
            db.refresh(request)
            request_id = request.id
            active_user["value"] = owner

        response = client.post(
            f"/users/me/registrations/pass_request/{request_id}/resend"
        )
        assert response.status_code == 200
        assert len(send) == 1
        rate_limited = client.post(
            f"/users/me/registrations/pass_request/{request_id}/resend"
        )
        assert rate_limited.status_code == 429

        active_user["value"] = other
        forbidden = client.post(
            f"/users/me/registrations/pass_request/{request_id}/resend"
        )
        assert forbidden.status_code == 403
        assert len(send) == 1
        with test_session() as db:
            assert db.get(PassRequest, request_id).email_delivery_status == "sent"
    finally:
        close_client(client, engine)
