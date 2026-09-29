import base64
import html
from dataclasses import dataclass
from datetime import date, time
from io import BytesIO

import qrcode
import sib_api_v3_sdk

from ..config import settings


@dataclass(frozen=True)
class RegistrationEmail:
    recipient: str
    subject: str
    html_content: str
    text_content: str


def qr_data_uri(qr_data: str | None) -> str | None:
    if not qr_data:
        return None
    image = qrcode.make(qr_data)
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    return f"data:image/png;base64,{encoded}"


def build_registration_email(
    kind: str,
    user,
    registration,
    *,
    title: str,
    event_date: date | str | None,
    event_time: time | str | None,
    venue: str | None,
    description: str | None,
) -> RegistrationEmail:
    recipient = (getattr(registration, "email", None) or user.email or "").strip()
    name = getattr(user, "name", None) or getattr(registration, "name", None)
    if kind == "pass_request":
        name = f"{registration.first_name} {registration.last_name}".strip()
    elif kind == "course_application":
        name = registration.name

    date_value = event_date.isoformat() if isinstance(event_date, date) else event_date
    time_value = event_time.isoformat() if isinstance(event_time, time) else event_time
    date_value = date_value or "To be announced"
    time_value = time_value or "To be announced"
    venue_value = venue or "To be announced"
    description_value = (description or "See your TechTalk account for the latest details.").strip()[:600]
    status = getattr(registration, "status", "registered")
    pass_id = getattr(registration, "pass_id", None)
    qr_data = getattr(registration, "qr_data", None)
    qr_image = qr_data_uri(qr_data) if pass_id and qr_data else None
    pass_text = (
        f"Pass ID: {pass_id}"
        if pass_id and qr_image
        else "Your pass has not been issued yet. We will email it when it is ready."
    )

    values = {
        "name": name or "TechTalk member",
        "title": title,
        "date": date_value,
        "time": time_value,
        "venue": venue_value,
        "description": description_value,
        "status": status,
        "pass_text": pass_text,
    }
    escaped = {key: html.escape(str(value), quote=True) for key, value in values.items()}
    qr_markup = (
        f'<p><img src="{qr_image}" alt="QR code for pass {escaped["pass_text"]}" '
        'width="220" height="220"></p>'
        if qr_image
        else ""
    )
    safe_subject_title = " ".join(str(title).splitlines()).strip()
    subject_prefix = "We received your application" if kind == "course_application" else "You're registered"
    subject = f"{subject_prefix}: {safe_subject_title}"
    confirmation = (
        f'Your application for <strong>{escaped["title"]}</strong> has been received.'
        if kind == "course_application"
        else f'Your registration for <strong>{escaped["title"]}</strong> is confirmed.'
    )
    text_confirmation = (
        f"Your application for {values['title']} has been received."
        if kind == "course_application"
        else f"Your registration for {values['title']} is confirmed."
    )
    html_content = (
        f'<p>Hello {escaped["name"]},</p>'
        f"<p>{confirmation}</p>"
        "<ul>"
        f'<li><strong>Date:</strong> {escaped["date"]}</li>'
        f'<li><strong>Time:</strong> {escaped["time"]}</li>'
        f'<li><strong>Venue or join link:</strong> {escaped["venue"]}</li>'
        f'<li><strong>Description:</strong> {escaped["description"]}</li>'
        f'<li><strong>Registration status:</strong> {escaped["status"]}</li>'
        f'<li><strong>{escaped["pass_text"]}</strong></li>'
        "</ul>"
        f"{qr_markup}"
        "<p>Keep this email for your records. Your pass is also available in My Passes.</p>"
    )
    text_content = (
        f"Hello {values['name']},\n\n"
        f"{text_confirmation}\n"
        f"Date: {values['date']}\n"
        f"Time: {values['time']}\n"
        f"Venue or join link: {values['venue']}\n"
        f"Description: {values['description']}\n"
        f"Registration status: {values['status']}\n"
        f"{values['pass_text']}\n\n"
        "Keep this email for your records. Your pass is also available in My Passes."
    )
    return RegistrationEmail(recipient, subject, html_content, text_content)


def send_registration_email(kind, user, registration, **details) -> None:
    if not user or not user.is_active or not user.email_verified:
        raise PermissionError("Only active users with verified email can receive registration mail.")
    stored_email = getattr(registration, "email", None)
    if stored_email and stored_email.strip().lower() != user.email.strip().lower():
        raise PermissionError("The registration address is not the user's verified address.")
    message_content = build_registration_email(
        kind, user, registration, **details
    )
    send_transactional_message(
        recipient=message_content.recipient,
        subject=message_content.subject,
        html_content=message_content.html_content,
        text_content=message_content.text_content,
    )


def send_transactional_message(
    *, recipient: str, subject: str, html_content: str, text_content: str
) -> None:
    api_key = (settings.brevo_api_key or "").strip()
    sender_email = (settings.brevo_sender_email or "").strip()
    sender_name = (settings.brevo_sender_name or "").strip()
    if not all((api_key, sender_email, sender_name, recipient)):
        raise RuntimeError("Brevo email configuration is incomplete.")

    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key["api-key"] = api_key
    message = sib_api_v3_sdk.SendSmtpEmail(
        sender=sib_api_v3_sdk.SendSmtpEmailSender(
            email=sender_email, name=sender_name
        ),
        to=[sib_api_v3_sdk.SendSmtpEmailTo(email=recipient)],
        subject=subject,
        html_content=html_content,
        text_content=text_content,
    )
    api_client = sib_api_v3_sdk.ApiClient(configuration)
    try:
        sib_api_v3_sdk.TransactionalEmailsApi(api_client).send_transac_email(message)
    finally:
        api_client.rest_client.pool_manager.clear()
