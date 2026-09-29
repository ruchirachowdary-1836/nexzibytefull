import html
import logging

from ..config import settings
from .registration_email import send_transactional_message

logger = logging.getLogger(__name__)


def send_contact_notifications(inquiry: dict, request_id: str) -> dict[str, str]:
    name = html.escape(inquiry["name"], quote=True)
    email = html.escape(inquiry["email"], quote=True)
    phone = html.escape(inquiry.get("phone") or "Not provided", quote=True)
    subject = html.escape(inquiry["subject"], quote=True)
    message = html.escape(inquiry["message"], quote=True).replace("\n", "<br>")
    text_body = (
        f"Hello {inquiry['name']},\n\n"
        "Thank you for contacting NexziByte TechTalk. We received your inquiry "
        "and our team will follow up.\n"
    )
    confirmation = {
        "recipient": inquiry["email"],
        "subject": "We received your TechTalk inquiry",
        "html_content": (
            f"<p>Hello {name},</p><p>Thank you for contacting NexziByte "
            "TechTalk. We received your inquiry and our team will follow up.</p>"
        ),
        "text_content": text_body,
    }
    admin_body = {
        "recipient": (
            settings.contact_notify_email or settings.admin_report_email or ""
        ).strip(),
        "subject": f"New TechTalk contact inquiry: {inquiry['subject']}",
        "html_content": (
            f"<h2>New contact inquiry</h2><p><strong>Name:</strong> {name}</p>"
            f"<p><strong>Email:</strong> {email}</p>"
            f"<p><strong>Phone:</strong> {phone}</p>"
            f"<p><strong>Subject:</strong> {subject}</p>"
            f"<p><strong>Message:</strong><br>{message}</p>"
        ),
        "text_content": (
            f"New contact inquiry\nName: {inquiry['name']}\n"
            f"Email: {inquiry['email']}\nPhone: {inquiry.get('phone') or 'Not provided'}\n"
            f"Subject: {inquiry['subject']}\n\n{inquiry['message']}"
        ),
    }

    results = {}
    for label, email_message in (
        ("submitter_confirmation", confirmation),
        ("admin_notification", admin_body),
    ):
        recipient = email_message["recipient"]
        if not recipient:
            results[label] = "not_configured"
            logger.error(
                "contact_email_not_configured request_id=%s email_kind=%s",
                request_id,
                label,
            )
            continue
        try:
            send_transactional_message(**email_message)
            results[label] = "sent"
            logger.info(
                "contact_email_submitted request_id=%s email_kind=%s",
                request_id,
                label,
            )
        except Exception as exc:
            results[label] = "failed"
            logger.error(
                "contact_email_submission_failed request_id=%s email_kind=%s error_type=%s",
                request_id,
                label,
                type(exc).__name__,
            )
    return results
