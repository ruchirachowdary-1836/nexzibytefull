import os
from datetime import date, datetime, timedelta, timezone
from types import SimpleNamespace

import pytest

os.environ["DB_URL"] = "sqlite:///./test_techtalk.db"

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app import main as main_module
from app.auth import get_current_user, get_optional_user
from app.config import settings
from app.database import Base, get_db
from app.models import CourseApplication, PassRequest, Registration, Summit, User
from app.security import sign_pass_payload, validate_pass_payload
from app.services.registration_email import (
    build_registration_email,
    send_registration_email,
)


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


def test_registration_email_submits_through_brevo_sdk(monkeypatch):
    captured = {}

    class FakeEmailsApi:
        def __init__(self, _client):
            pass

        def send_transac_email(self, message):
            captured["message"] = message

    monkeypatch.setattr(main_module.settings, "brevo_api_key", "test-api-key")
    monkeypatch.setattr(main_module.settings, "brevo_sender_email", "sender@example.com")
    monkeypatch.setattr(main_module.settings, "brevo_sender_name", "TechTalk")
    monkeypatch.setattr(
        "app.services.registration_email.sib_api_v3_sdk.TransactionalEmailsApi",
        FakeEmailsApi,
    )
    send_registration_email(
        "registration",
        SimpleNamespace(
            name="Asha",
            email="asha@example.com",
            is_active=True,
            email_verified=True,
        ),
        SimpleNamespace(
            email="asha@example.com",
            status="registered",
            pass_id="NEX-EVT-123456",
            qr_data=None,
        ),
        title="TechTalk Summit",
        event_date=None,
        event_time=None,
        venue="Online",
        description="Registration confirmation.",
    )
    assert captured["message"].to[0].email == "asha@example.com"
    assert captured["message"].subject == "You're registered: TechTalk Summit"


def test_pass_qr_expiry_is_utc_and_exact_to_timestamp_precision(monkeypatch):
    expires_at = datetime(2030, 1, 1, 12, 0, 0, 500000)
    qr_data = sign_pass_payload("NEX-EVT-123456", expires_at)
    monkeypatch.setattr(
        "app.security.time.time",
        lambda: expires_at.replace(tzinfo=timezone.utc).timestamp() - 0.0001,
    )
    payload = validate_pass_payload(qr_data)
    assert payload["exp"] == expires_at.replace(tzinfo=timezone.utc).timestamp()

    monkeypatch.setattr(
        "app.security.time.time",
        lambda: expires_at.replace(tzinfo=timezone.utc).timestamp(),
    )
    with pytest.raises(ValueError, match="Invalid pass payload"):
        validate_pass_payload(qr_data)


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


def test_event_registration_persists_server_generated_pass_and_email_state(
    monkeypatch, tmp_path
):
    client, test_session, active_user, engine = make_client(monkeypatch, tmp_path)
    submitted = []
    monkeypatch.setattr(
        main_module,
        "send_registration_email",
        lambda *args, **kwargs: submitted.append((args, kwargs)),
    )
    try:
        with test_session() as db:
            user = User(
                name="Event Attendee",
                email="attendee@example.com",
                email_verified=True,
                is_active=True,
            )
            event = Summit(
                title="Production Summit",
                date=date(2030, 6, 1),
                location="Hyderabad",
                venue="Tech Campus",
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
            json={
                "event_type": "summit",
                "event_id": event_id,
                "phone": "+1-555-0199",
            },
        )
        assert response.status_code == 201
        payload = response.json()
        assert payload["pass_id"].startswith("NEX-EVT-")
        assert len(payload["pass_id"].rsplit("-", 1)[-1]) == 6
        assert payload["email"] == "attendee@example.com"
        assert payload["event_name"] == "Production Summit"
        with test_session() as db:
            registrations = db.query(Registration).all()
            assert len(registrations) == 1
            saved = registrations[0]
            assert saved.user_id == user.id
            assert saved.event_type == "summit"
            assert saved.event_id == event_id
            assert saved.status == "registered"
            assert saved.registered_at is not None
            assert saved.phone == "+1-555-0199"
            assert saved.pass_id == payload["pass_id"]
            assert saved.qr_data
            assert saved.email_delivery_status == "sent"
            assert saved.email_sent_at is not None
            assert saved.email_last_attempt_at is not None
            assert saved.email_pass_id == saved.pass_id
            saved_user = db.get(User, saved.user_id)
            assert saved_user.phone == "+1-555-0199"
        assert len(submitted) == 1
        assert submitted[0][0][1].email == "attendee@example.com"
    finally:
        close_client(client, engine)


def test_duplicate_event_registration_is_rejected_without_second_row(
    monkeypatch, tmp_path
):
    client, test_session, active_user, engine = make_client(monkeypatch, tmp_path)
    submitted = []
    monkeypatch.setattr(
        main_module,
        "send_registration_email",
        lambda *args, **kwargs: submitted.append(args),
    )
    try:
        with test_session() as db:
            user = User(
                name="Duplicate Attendee",
                email="duplicate@example.com",
                email_verified=True,
                is_active=True,
            )
            event = Summit(
                title="Duplicate Test Summit",
                date=date(2030, 7, 1),
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

        body = {"event_type": "summit", "event_id": event_id}
        first = client.post("/registrations", json=body)
        duplicate = client.post("/registrations", json=body)
        assert first.status_code == 201
        assert duplicate.status_code == 409
        with test_session() as db:
            assert db.query(Registration).count() == 1
        assert len(submitted) == 1
    finally:
        close_client(client, engine)


def test_event_email_failure_keeps_committed_registration_and_marks_failure(
    monkeypatch, tmp_path
):
    client, test_session, active_user, engine = make_client(monkeypatch, tmp_path)

    def fail_send(*args, **kwargs):
        raise RuntimeError("provider rejected submission")

    monkeypatch.setattr(main_module, "send_registration_email", fail_send)
    try:
        with test_session() as db:
            user = User(
                name="Email Failure",
                email="email-failure@example.com",
                email_verified=True,
                is_active=True,
            )
            event = Summit(
                title="Email Failure Summit",
                date=date(2030, 8, 15),
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
        assert response.json()["pass_id"].startswith("NEX-EVT-")
        with test_session() as db:
            saved = db.get(Registration, registration_id)
            assert saved is not None
            assert saved.email_delivery_status == "failed"
            assert saved.email_last_attempt_at is not None
            assert saved.email_sent_at is None
            assert saved.email_pass_id is None
    finally:
        close_client(client, engine)


def test_failed_registration_commit_returns_error_without_pass_or_email(
    monkeypatch, tmp_path
):
    client, test_session, active_user, engine = make_client(monkeypatch, tmp_path)
    submitted = []
    monkeypatch.setattr(
        main_module,
        "send_registration_email",
        lambda *args, **kwargs: submitted.append(args),
    )
    try:
        with test_session() as db:
            user = User(
                name="Commit Failure",
                email="commit-failure@example.com",
                email_verified=True,
                is_active=True,
            )
            event = Summit(
                title="Commit Failure Summit",
                date=date(2030, 8, 1),
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

        class CommitFailureSession(Session):
            def commit(self):
                raise SQLAlchemyError("simulated commit failure")

        def failing_db():
            db = CommitFailureSession(bind=engine)
            try:
                yield db
            finally:
                db.close()

        main_module.app.dependency_overrides[get_db] = failing_db
        response = client.post(
            "/registrations",
            json={"event_type": "summit", "event_id": event_id},
        )
        assert response.status_code == 500
        assert "Registration could not be completed" in response.json()["detail"]
        with test_session() as db:
            assert db.query(Registration).count() == 0
        assert submitted == []
    finally:
        close_client(client, engine)


def test_admin_can_filter_view_and_resend_registration_email(
    monkeypatch, tmp_path
):
    client, test_session, active_user, engine = make_client(monkeypatch, tmp_path)
    submitted = []
    monkeypatch.setattr(
        main_module,
        "send_registration_email",
        lambda *args, **kwargs: submitted.append((args, kwargs)),
    )
    try:
        with test_session() as db:
            admin = User(
                name="Admin",
                email="admin-registration@example.com",
                role="admin",
                email_verified=True,
                is_active=True,
            )
            event = Summit(
                title="Admin Dashboard Summit",
                date=date(2030, 9, 1),
                location="Hyderabad",
                status="upcoming",
                is_published=True,
            )
            db.add_all([admin, event])
            db.flush()
            registration = Registration(
                user_id=admin.id,
                event_type="summit",
                event_id=event.id,
                status="registered",
                registration_number="REG-ADM1",
                pass_id="NEX-EVT-123456",
                qr_data="signed-existing-pass",
                email_delivery_status="failed",
                email_last_attempt_at=datetime.utcnow() - timedelta(minutes=4),
            )
            db.add(registration)
            db.commit()
            db.refresh(admin)
            registration_id = registration.id
            active_user["value"] = admin

        listed = client.get(
            "/admin/registrations",
            params={
                "event_type": "summit",
                "email_status": "failed",
                "search": "admin-registration@example.com",
                "event": "Admin Dashboard",
                "pass_id": "123456",
            },
        )
        assert listed.status_code == 200
        result = listed.json()
        assert result["total"] == 1
        assert result["items"][0]["user_name"] == "Admin"
        assert result["items"][0]["event_name"] == "Admin Dashboard Summit"
        assert result["items"][0]["pass_id"] == "NEX-EVT-123456"

        details = client.get(f"/admin/registrations/{registration_id}")
        assert details.status_code == 200
        assert details.json()["qr_available"] is True

        resent = client.post(f"/admin/registrations/{registration_id}/resend-email")
        assert resent.status_code == 200
        assert resent.json()["submitted_to_provider"] is True
        assert resent.json()["email_delivery_status"] == "sent"
        assert len(submitted) == 1
        with test_session() as db:
            saved = db.get(Registration, registration_id)
            assert saved.pass_id == "NEX-EVT-123456"
            assert saved.email_delivery_status == "sent"
            assert saved.email_sent_at is not None
            assert saved.email_pass_id == saved.pass_id
            assert db.query(Registration).count() == 1

        active_user["value"].role = "user"
        forbidden = client.get("/admin/registrations")
        assert forbidden.status_code == 403
    finally:
        close_client(client, engine)


def test_visitor_pass_activation_is_promotion_day_only_and_expires_in_ten_minutes(
    monkeypatch, tmp_path
):
    client, test_session, active_user, engine = make_client(monkeypatch, tmp_path)
    try:
        with test_session() as db:
            user = User(
                name="Visitor User",
                email="visitor-activation@example.com",
                is_active=True,
                email_verified=True,
            )
            db.add(user)
            db.flush()
            request = PassRequest(
                user_id=user.id,
                first_name="Visitor",
                last_name="User",
                email=user.email,
                pass_type="visitor-pass",
                amount="Free",
                status="approved",
                pass_id="TT26-000777",
                qr_data="pending-visitor-qr",
            )
            db.add(request)
            db.commit()
            db.refresh(user)
            db.refresh(request)
            active_user["value"] = user
            request_id = request.id

        today = datetime.now(timezone.utc).date().isoformat()
        monkeypatch.setattr(settings, "visitor_promotion_date", today)
        response = client.post(
            f"/users/me/pass-requests/{request_id}/activate-visitor"
        )
        assert response.status_code == 200
        result = response.json()
        assert result["visitor_expires_at"]
        with test_session() as db:
            saved_user = db.get(User, active_user["value"].id)
            saved_pass = db.get(PassRequest, request_id)
            assert saved_user.visitor_access_only is True
            assert (
                saved_user.visitor_expires_at - saved_user.visitor_activated_at
                == timedelta(minutes=10)
            )
            assert saved_pass.expires_at == saved_user.visitor_expires_at
            assert saved_pass.qr_data != "pending-visitor-qr"
        duplicate = client.post(
            f"/users/me/pass-requests/{request_id}/activate-visitor"
        )
        assert duplicate.status_code == 409
    finally:
        close_client(client, engine)


@pytest.mark.parametrize("day_offset", [-1, 1])
def test_visitor_pass_activation_rejected_outside_promotion_day(
    monkeypatch, tmp_path, day_offset
):
    client, test_session, active_user, engine = make_client(monkeypatch, tmp_path)
    try:
        with test_session() as db:
            user = User(
                name="Visitor User",
                email="visitor-outside@example.com",
                is_active=True,
                email_verified=True,
            )
            db.add(user)
            db.flush()
            request = PassRequest(
                user_id=user.id,
                first_name="Visitor",
                last_name="User",
                email=user.email,
                pass_type="visitor-pass",
                amount="Free",
                status="approved",
                pass_id="TT26-000778",
                qr_data="pending-visitor-qr",
            )
            db.add(request)
            db.commit()
            db.refresh(user)
            db.refresh(request)
            active_user["value"] = user
            request_id = request.id

        promotion_date = (
            datetime.now(timezone.utc).date() + timedelta(days=day_offset)
        ).isoformat()
        monkeypatch.setattr(settings, "visitor_promotion_date", promotion_date)
        response = client.post(
            f"/users/me/pass-requests/{request_id}/activate-visitor"
        )
        assert response.status_code == 403
        with test_session() as db:
            saved_user = db.get(User, active_user["value"].id)
            assert saved_user.visitor_activated_at is None
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
                "phone": "555-0111",
            },
        )
        assert response.status_code == 201
        assert response.json()["pass_id"]
        with test_session() as db:
            saved = db.get(PassRequest, response.json()["id"])
            assert saved is not None
            assert saved.email == "riya@example.com"
            assert saved.phone == "555-0111"
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
            assert saved.phone == "555-0100"
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
