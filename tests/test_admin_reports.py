import csv
import base64
import io
from datetime import date, datetime, timezone

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app import main as main_module
from app.auth import get_current_user, get_optional_user
from app.config import settings
from app.database import Base, get_db
from app.models import CourseApplication, Registration, Summit, User
from app.services import admin_reports as report_service


def _client(monkeypatch):
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    test_session = sessionmaker(bind=engine, expire_on_commit=False)

    def override_db():
        db = test_session()
        try:
            yield db
        finally:
            db.close()

    admin = User(
        name="Report Admin",
        email="report-admin@example.com",
        role="admin",
        is_active=True,
        email_verified=True,
    )
    with test_session() as db:
        db.add(admin)
        db.commit()
        db.refresh(admin)

    main_module.app.dependency_overrides[get_db] = override_db
    main_module.app.dependency_overrides[get_current_user] = lambda: admin
    main_module.app.dependency_overrides[get_optional_user] = lambda: admin
    monkeypatch.setattr(report_service, "SessionLocal", test_session)
    monkeypatch.setattr(main_module, "SessionLocal", test_session)
    return TestClient(main_module.app), test_session, engine


def _close(client, engine):
    client.close()
    main_module.app.dependency_overrides.pop(get_db, None)
    main_module.app.dependency_overrides.pop(get_current_user, None)
    main_module.app.dependency_overrides.pop(get_optional_user, None)
    engine.dispose()


def test_report_includes_signup_registration_application_and_valid_csv(monkeypatch):
    client, test_session, engine = _client(monkeypatch)
    try:
        with test_session() as db:
            user = User(
                name="Report User",
                email="report-user@example.com",
                phone="+1-555-0100",
                is_active=True,
                email_verified=True,
                created_at=datetime(2025, 2, 3, 10),
            )
            event = Summit(
                title="Report Summit",
                date=date(2025, 5, 5),
                status="upcoming",
                is_published=True,
            )
            db.add_all([user, event])
            db.flush()
            db.add(
                Registration(
                    user_id=user.id,
                    event_type="summit",
                    event_id=event.id,
                    registration_number="REG-REPORT",
                    pass_id="NEX-EVT-123456",
                    qr_data="signed",
                    registered_at=datetime(2025, 2, 4, 11),
                )
            )
            db.add(
                CourseApplication(
                    course_id="course-1",
                    course_title="API Design",
                    name="Applicant",
                    email="applicant@example.com",
                    phone="555-0200",
                    status="submitted",
                    created_at=datetime(2025, 2, 5, 12),
                )
            )
            db.commit()
        with test_session() as db:
            report = report_service.build_admin_report(
                db, date(2025, 2, 1), date(2025, 2, 28)
            )
        assert report.counts["new_signups"] == 1
        assert report.counts["event_registrations"] == 1
        assert report.counts["course_applications"] == 1
        rows = list(csv.DictReader(io.StringIO(report.csv_content)))
        assert len(rows) == 3
        assert {row["record_type"] for row in rows} == {
            "new_signup",
            "event_registration",
            "course_application",
        }
        assert any(row["name"] == "Report User" for row in rows)
        assert any(row["phone"] == "+1-555-0100" for row in rows)
    finally:
        _close(client, engine)


def test_manual_admin_report_submits_through_brevo_helper(monkeypatch):
    client, test_session, engine = _client(monkeypatch)
    submitted = []
    monkeypatch.setattr(settings, "admin_report_email", "admin@example.com")
    monkeypatch.setattr(
        main_module,
        "send_admin_report_email",
        lambda report: submitted.append(report),
    )
    try:
        response = client.post(
            "/admin/reports/send-now",
            json={"start_date": "2025-02-01", "end_date": "2025-02-28"},
        )
        assert response.status_code == 200
        assert response.json()["status"] == "submitted"
        assert response.json()["counts"]["new_signups"] == 0
        assert len(submitted) == 1
    finally:
        _close(client, engine)


def test_non_admin_cannot_send_manual_report(monkeypatch):
    client, _, engine = _client(monkeypatch)
    try:
        main_module.app.dependency_overrides[get_current_user] = lambda: User(
            name="Regular User",
            email="regular@example.com",
            role="user",
        )
        response = client.post("/admin/reports/send-now", json={})
        assert response.status_code == 403
    finally:
        _close(client, engine)


def test_report_cadence_and_scheduled_send_idempotency(monkeypatch):
    client, test_session, engine = _client(monkeypatch)
    submitted = []
    monkeypatch.setattr(
        report_service, "send_admin_report_email", lambda report: submitted.append(report)
    )
    try:
        due = report_service.due_report_periods(
            datetime(2025, 3, 3, 9, 0, tzinfo=timezone.utc), report_hour_utc=9
        )
        assert due == [("weekly", date(2025, 2, 24), date(2025, 3, 2))]
        assert report_service.due_report_periods(
            datetime(2025, 2, 1, 8, 59, tzinfo=timezone.utc), report_hour_utc=9
        ) == []
        assert report_service.due_report_periods(
            datetime(2025, 2, 1, 9, 0, tzinfo=timezone.utc), report_hour_utc=9
        ) == [("monthly", date(2025, 1, 1), date(2025, 1, 31))]
        assert report_service.due_report_periods(
            datetime(2025, 1, 1, 9, 0, tzinfo=timezone.utc), report_hour_utc=9
        ) == [
            ("monthly", date(2024, 12, 1), date(2024, 12, 31)),
            ("yearly", date(2024, 1, 1), date(2024, 12, 31)),
        ]
        assert report_service.send_scheduled_report(
            "weekly", date(2025, 2, 24), date(2025, 3, 2)
        ) is True
        assert report_service.send_scheduled_report(
            "weekly", date(2025, 2, 24), date(2025, 3, 2)
        ) is False
        assert len(submitted) == 1
    finally:
        _close(client, engine)


def test_admin_report_email_uses_brevo_with_csv_attachment(monkeypatch):
    report = report_service.AdminReport(
        start_date=date(2025, 1, 1),
        end_date=date(2025, 1, 7),
        rows=[],
        counts={"new_signups": 0},
        csv_content="record_type,record_id\n",
        html_content="<html><body>Report</body></html>",
    )
    monkeypatch.setattr(settings, "admin_report_email", "admin@example.com")
    monkeypatch.setattr(settings, "brevo_api_key", "test-api-key")
    monkeypatch.setattr(settings, "brevo_sender_email", "sender@example.com")
    monkeypatch.setattr(settings, "brevo_sender_name", "TechTalk")
    captured = {}

    class FakeEmailsApi:
        def __init__(self, _client):
            pass

        def send_transac_email(self, message):
            captured["message"] = message

    monkeypatch.setattr(
        report_service.sib_api_v3_sdk,
        "TransactionalEmailsApi",
        FakeEmailsApi,
    )
    report_service.send_admin_report_email(report)
    message = captured["message"]
    attachment = message.attachment[0]
    assert message.to[0].email == "admin@example.com"
    assert base64.b64decode(attachment.content).decode() == report.csv_content
    assert message.html_content == report.html_content
