from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app import main as main_module
from app.database import Base, get_db
from app.models import ContactInquiry
from app.services import contact_email


def make_contact_client():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    session_factory = sessionmaker(bind=engine, expire_on_commit=False)

    def override_db():
        with session_factory() as session:
            yield session

    main_module.app.dependency_overrides[get_db] = override_db
    return TestClient(main_module.app), session_factory, engine


def close_contact_client(client, engine):
    client.close()
    main_module.app.dependency_overrides.pop(get_db, None)
    engine.dispose()


def test_contact_submission_saves_fields_and_sends_both_notifications(monkeypatch):
    client, session_factory, engine = make_contact_client()
    sent = []
    monkeypatch.setattr(main_module, "rate_limit", lambda *_args, **_kwargs: True)
    monkeypatch.setattr(
        main_module,
        "send_contact_notifications",
        lambda inquiry, request_id: (
            sent.append((inquiry, request_id))
            or {"submitter_confirmation": "sent", "admin_notification": "sent"}
        ),
    )
    try:
        response = client.post(
            "/contact-inquiries",
            json={
                "name": "  Riya Patel ",
                "email": "RIYA@example.com",
                "phone": " +91 98765 ",
                "subject": "  Event question ",
                "message": "  Please share the schedule. ",
            },
        )
        assert response.status_code == 201
        assert response.json()["status"] == "new"
        assert response.json()["email_notifications"] == {
            "submitter_confirmation": "sent",
            "admin_notification": "sent",
        }
        with session_factory() as session:
            inquiry = session.query(ContactInquiry).one()
            assert inquiry.name == "Riya Patel"
            assert inquiry.email == "riya@example.com"
            assert inquiry.phone == "+91 98765"
            assert inquiry.subject == "Event question"
            assert inquiry.message == "Please share the schedule."
            assert inquiry.status == "new"
            assert inquiry.submitted_at is not None
        assert sent[0][0]["email"] == "riya@example.com"
        assert sent[0][0]["phone"] == "+91 98765"
    finally:
        close_contact_client(client, engine)


def test_contact_submission_rejects_invalid_email_and_rate_limited_request(monkeypatch):
    client, session_factory, engine = make_contact_client()
    try:
        monkeypatch.setattr(main_module, "rate_limit", lambda *_args, **_kwargs: True)
        invalid = client.post(
            "/contact-inquiries",
            json={
                "name": "Riya",
                "email": "not-an-email",
                "subject": "Hello",
                "message": "Message",
            },
        )
        assert invalid.status_code == 422
        with session_factory() as session:
            assert session.query(ContactInquiry).count() == 0

        monkeypatch.setattr(main_module, "rate_limit", lambda *_args, **_kwargs: False)
        limited = client.post(
            "/contact-inquiries",
            json={
                "name": "Riya",
                "email": "riya@example.com",
                "subject": "Hello",
                "message": "Message",
            },
        )
        assert limited.status_code == 429
        with session_factory() as session:
            assert session.query(ContactInquiry).count() == 0
    finally:
        close_contact_client(client, engine)


def test_contact_email_uses_brevo_for_confirmation_and_admin_notice(monkeypatch):
    messages = []
    monkeypatch.setattr(contact_email.settings, "contact_notify_email", "admin@example.com")
    monkeypatch.setattr(contact_email.settings, "admin_report_email", None)
    monkeypatch.setattr(
        contact_email,
        "send_transactional_message",
        lambda **message: messages.append(message),
    )
    result = contact_email.send_contact_notifications(
        {
            "name": "<Asha>",
            "email": "asha@example.com",
            "phone": None,
            "subject": "<Need help>",
            "message": "<script>hello</script>",
        },
        "request-1",
    )
    assert result == {"submitter_confirmation": "sent", "admin_notification": "sent"}
    assert [message["recipient"] for message in messages] == [
        "asha@example.com",
        "admin@example.com",
    ]
    assert "&lt;script&gt;" in messages[1]["html_content"]


def test_contact_email_failure_does_not_raise_or_claim_success(monkeypatch):
    monkeypatch.setattr(contact_email.settings, "contact_notify_email", "admin@example.com")
    monkeypatch.setattr(
        contact_email,
        "send_transactional_message",
        lambda **_message: (_ for _ in ()).throw(RuntimeError("provider failure")),
    )
    result = contact_email.send_contact_notifications(
        {
            "name": "Asha",
            "email": "asha@example.com",
            "phone": None,
            "subject": "Question",
            "message": "Hello",
        },
        "request-2",
    )
    assert result == {"submitter_confirmation": "failed", "admin_notification": "failed"}
