import base64
import csv
import html
import io
import logging
from dataclasses import dataclass
from datetime import date, datetime, time, timedelta, timezone

import sib_api_v3_sdk
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..config import settings
from ..database import SessionLocal
from ..models import (
    AdminReportRun,
    CourseApplication,
    NewsletterSubscriber,
    PassRequest,
    Registration,
    User,
)

logger = logging.getLogger(__name__)
CSV_FIELDS = (
    "record_type",
    "record_id",
    "created_at",
    "name",
    "email",
    "phone",
    "item",
    "status",
)


@dataclass(frozen=True)
class AdminReport:
    start_date: date
    end_date: date
    rows: list[dict]
    counts: dict[str, int]
    csv_content: str
    html_content: str


def previous_period(cadence: str, today: date) -> tuple[date, date]:
    if cadence == "weekly":
        end_date = today - timedelta(days=1)
        return end_date - timedelta(days=6), end_date
    if cadence == "monthly":
        first_this_month = today.replace(day=1)
        end_date = first_this_month - timedelta(days=1)
        return end_date.replace(day=1), end_date
    if cadence == "yearly":
        end_date = date(today.year - 1, 12, 31)
        return date(today.year - 1, 1, 1), end_date
    raise ValueError("Unsupported report cadence.")


def due_report_periods(now: datetime, report_hour_utc: int) -> list[tuple[str, date, date]]:
    current = now.astimezone(timezone.utc)
    if current.hour < report_hour_utc:
        return []
    today = current.date()
    due = []
    if today.weekday() == 0:
        start, end = previous_period("weekly", today)
        due.append(("weekly", start, end))
    if today.day == 1:
        start, end = previous_period("monthly", today)
        due.append(("monthly", start, end))
    if today.month == 1 and today.day == 1:
        start, end = previous_period("yearly", today)
        due.append(("yearly", start, end))
    return due


def _range_bounds(start_date: date, end_date: date):
    return (
        datetime.combine(start_date, time.min),
        datetime.combine(end_date + timedelta(days=1), time.min),
    )


def _name(user: User | None, fallback: str | None = None) -> str:
    return user.name if user else fallback or ""


def build_admin_report(db: Session, start_date: date, end_date: date) -> AdminReport:
    if end_date < start_date:
        raise ValueError("Report end date must be on or after start date.")
    start_at, end_at = _range_bounds(start_date, end_date)
    rows: list[dict] = []
    counts = {
        "new_signups": 0,
        "event_registrations": 0,
        "course_applications": 0,
        "community_joins": 0,
        "contact_numbers": 0,
    }

    users = (
        db.query(User)
        .filter(User.created_at >= start_at, User.created_at < end_at)
        .order_by(User.created_at.asc(), User.id.asc())
        .all()
    )
    for user in users:
        rows.append({
            "record_type": "new_signup",
            "record_id": user.id,
            "created_at": user.created_at,
            "name": user.name,
            "email": user.email,
            "phone": user.phone or "",
            "item": "Account signup",
            "status": "active" if user.is_active else "inactive",
        })
    counts["new_signups"] = len(users)

    registrations = (
        db.query(Registration, User)
        .join(User, User.id == Registration.user_id)
        .filter(Registration.registered_at >= start_at, Registration.registered_at < end_at)
        .order_by(Registration.registered_at.asc(), Registration.id.asc())
        .all()
    )
    for registration, user in registrations:
        rows.append({
            "record_type": "event_registration",
            "record_id": registration.id,
            "created_at": registration.registered_at,
            "name": user.name,
            "email": user.email,
            "phone": registration.phone or user.phone or "",
            "item": f"{registration.event_type}:{registration.event_id}",
            "status": registration.status,
        })
    counts["event_registrations"] = len(registrations)

    applications = (
        db.query(CourseApplication)
        .filter(CourseApplication.created_at >= start_at, CourseApplication.created_at < end_at)
        .order_by(CourseApplication.created_at.asc(), CourseApplication.id.asc())
        .all()
    )
    for application in applications:
        rows.append({
            "record_type": "course_application",
            "record_id": application.id,
            "created_at": application.created_at,
            "name": application.name,
            "email": application.email,
            "phone": application.phone or "",
            "item": application.course_title,
            "status": application.status,
        })
    counts["course_applications"] = len(applications)

    pass_requests = (
        db.query(PassRequest)
        .filter(PassRequest.created_at >= start_at, PassRequest.created_at < end_at)
        .order_by(PassRequest.created_at.asc(), PassRequest.id.asc())
        .all()
    )
    for request in pass_requests:
        is_community = "community" in request.pass_type.lower()
        record_type = "community_join" if is_community else "pass_request"
        if is_community:
            counts["community_joins"] += 1
        rows.append({
            "record_type": record_type,
            "record_id": request.id,
            "created_at": request.created_at,
            "name": f"{request.first_name} {request.last_name}".strip(),
            "email": request.email,
            "phone": request.phone or "",
            "item": request.pass_type,
            "status": request.status,
        })

    subscribers = (
        db.query(NewsletterSubscriber)
        .filter(
            NewsletterSubscriber.created_at >= start_at,
            NewsletterSubscriber.created_at < end_at,
        )
        .order_by(NewsletterSubscriber.created_at.asc(), NewsletterSubscriber.id.asc())
        .all()
    )
    counts["community_joins"] += len(subscribers)
    for subscriber in subscribers:
        rows.append({
            "record_type": "community_join",
            "record_id": subscriber.id,
            "created_at": subscriber.created_at,
            "name": "",
            "email": subscriber.email,
            "phone": "",
            "item": "Newsletter/community subscription",
            "status": "active" if subscriber.is_active else "inactive",
        })

    counts["contact_numbers"] = sum(bool(row["phone"]) for row in rows)
    output = io.StringIO(newline="")
    writer = csv.DictWriter(output, fieldnames=CSV_FIELDS, extrasaction="ignore")
    writer.writeheader()
    for row in rows:
        writer.writerow({
            **row,
            "created_at": row["created_at"].isoformat() if row["created_at"] else "",
        })
    summary_html = "".join(
        f"<li>{html.escape(label.replace('_', ' ').title())}: {count}</li>"
        for label, count in counts.items()
    )
    html_content = (
        "<html><body><h1>TechTalk activity report</h1>"
        f"<p>Period: {start_date.isoformat()} through {end_date.isoformat()}</p>"
        f"<ul>{summary_html}</ul>"
        "<p>The detailed signups, registrations, applications, community joins, "
        "and contact numbers are included in the attached CSV.</p>"
        "</body></html>"
    )
    return AdminReport(
        start_date=start_date,
        end_date=end_date,
        rows=rows,
        counts=counts,
        csv_content=output.getvalue(),
        html_content=html_content,
    )


def send_admin_report_email(report: AdminReport) -> None:
    recipient = (settings.admin_report_email or "").strip()
    api_key = (settings.brevo_api_key or "").strip()
    sender_email = (settings.brevo_sender_email or "").strip()
    sender_name = (settings.brevo_sender_name or "").strip()
    if not all((recipient, api_key, sender_email, sender_name)):
        raise RuntimeError("Admin report or Brevo email configuration is incomplete.")

    configuration = sib_api_v3_sdk.Configuration()
    configuration.api_key["api-key"] = api_key
    filename = (
        f"techtalk-report-{report.start_date.isoformat()}-"
        f"{report.end_date.isoformat()}.csv"
    )
    attachment = sib_api_v3_sdk.SendSmtpEmailAttachment(
        content=base64.b64encode(report.csv_content.encode("utf-8")).decode("ascii"),
        name=filename,
    )
    message = sib_api_v3_sdk.SendSmtpEmail(
        sender=sib_api_v3_sdk.SendSmtpEmailSender(
            email=sender_email,
            name=sender_name,
        ),
        to=[sib_api_v3_sdk.SendSmtpEmailTo(email=recipient)],
        subject=f"TechTalk activity report: {report.start_date} to {report.end_date}",
        html_content=report.html_content,
        text_content=(
            f"TechTalk activity report for {report.start_date} through "
            f"{report.end_date}. Detailed records are attached as CSV."
        ),
        attachment=[attachment],
    )
    api_client = sib_api_v3_sdk.ApiClient(configuration)
    try:
        sib_api_v3_sdk.TransactionalEmailsApi(api_client).send_transac_email(message)
    finally:
        api_client.rest_client.pool_manager.clear()


def _claim_scheduled_report(
    cadence: str, start_date: date, end_date: date
) -> int | None:
    db = SessionLocal()
    try:
        report_run = (
            db.query(AdminReportRun)
            .filter_by(cadence=cadence, period_start=start_date, period_end=end_date)
            .with_for_update()
            .one_or_none()
        )
        now = datetime.utcnow()
        if report_run:
            stale_cutoff = now - timedelta(minutes=15)
            if report_run.status == "sent" or (
                report_run.status == "sending" and report_run.attempted_at >= stale_cutoff
            ):
                return None
            report_run.status = "sending"
            report_run.attempted_at = now
            report_run.error_type = None
        else:
            report_run = AdminReportRun(
                cadence=cadence,
                period_start=start_date,
                period_end=end_date,
                status="sending",
                attempted_at=now,
            )
            db.add(report_run)
        db.commit()
        db.refresh(report_run)
        return report_run.id
    except IntegrityError:
        db.rollback()
        return None
    finally:
        db.close()


def _finish_scheduled_report(
    report_run_id: int, *, sent: bool, error_type: str | None = None
) -> None:
    db = SessionLocal()
    try:
        report_run = db.get(AdminReportRun, report_run_id)
        if report_run is None:
            raise RuntimeError("Scheduled admin report run disappeared.")
        report_run.status = "sent" if sent else "failed"
        report_run.sent_at = datetime.utcnow() if sent else None
        report_run.error_type = error_type
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def send_scheduled_report(cadence: str, start_date: date, end_date: date) -> bool:
    run_id = _claim_scheduled_report(cadence, start_date, end_date)
    if run_id is None:
        return False
    db = SessionLocal()
    try:
        report = build_admin_report(db, start_date, end_date)
        send_admin_report_email(report)
        _finish_scheduled_report(run_id, sent=True)
        return True
    except Exception as exc:
        _finish_scheduled_report(run_id, sent=False, error_type=type(exc).__name__)
        raise
    finally:
        db.close()


def send_due_scheduled_reports(now: datetime | None = None) -> int:
    current = now or datetime.now(timezone.utc)
    due_reports = due_report_periods(current, settings.admin_report_hour_utc)
    sent_count = 0
    for cadence, start_date, end_date in due_reports:
        if send_scheduled_report(cadence, start_date, end_date):
            sent_count += 1
    return sent_count
