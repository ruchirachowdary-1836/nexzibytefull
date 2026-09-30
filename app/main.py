import asyncio
import datetime as datetime_module
import json
import logging
import secrets
from collections import Counter
from contextlib import asynccontextmanager
from datetime import date, datetime, time, timedelta
from typing import Literal

from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, PlainTextResponse
from pydantic import BaseModel, EmailStr, Field, HttpUrl, field_validator, model_validator
from sqlalchemy import func, inspect, or_, text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session

from .auth import (
    get_current_user,
    get_optional_user,
    hash_password,
    require_admin,
    require_member,
    require_staff,
    verify_password,
)
from .config import allowed_origins, settings
from .database import Base, SessionLocal, engine, get_db
from .models import (
    AuditLog,
    Category,
    CheckIn,
    Comment,
    ContactInquiry,
    CourseApplication,
    EmailLog,
    FounderMeet,
    NewsletterSubscriber,
    Notification,
    PartnershipInquiry,
    PassRequest,
    Post,
    Reaction,
    RefreshToken,
    Registration,
    SavedPost,
    Speaker,
    StaticArticle,
    StaticCourse,
    StaticEvent,
    StaticFaq,
    StaticFounderMeet,
    StaticInternship,
    StaticPricingTier,
    StaticSpeaker,
    StaticTestimonial,
    Summit,
    Tag,
    User,
    UserEducation,
    UserExperience,
    UserFollow,
    UserLink,
    UserSettings,
    UserSkill,
)
from .observability import (
    ObservabilityMiddleware,
    SecurityHeadersMiddleware,
    configure_logging,
    metrics_text,
    request_id_context,
    run_cleanup,
)
from .security import (
    rate_limit,
    sign_pass_payload,
    validate_pass_payload,
)
from .services.admin_reports import (
    build_admin_report,
    previous_period,
    send_admin_report_email,
    send_due_scheduled_reports,
)
from .services.contact_email import send_contact_notifications
from .services.events import (
    event_response,
    event_state,
    list_events,
    make_event,
    update_event,
)
from .services.registration_email import qr_data_uri, send_registration_email

configure_logging()
logger = logging.getLogger(__name__)

REGISTRATION_EMAIL_RETRY_SECONDS = 180


def send_registration_email_background(
    kind: str,
    registration_id: int,
    request_id: str,
    *,
    resend: bool = False,
    pass_issued: bool = False,
) -> str:
    models = {
        "course_application": CourseApplication,
        "pass_request": PassRequest,
        "registration": Registration,
    }
    model = models[kind]
    db = SessionLocal()
    try:
        registration = (
            db.query(model)
            .filter(model.id == registration_id)
            .with_for_update()
            .one_or_none()
        )
        if registration is None:
            logger.error(
                "registration_email_failed",
                extra={
                    "request_id": request_id,
                    "registration_id": registration_id,
                    "error_type": "RegistrationNotFound",
                },
            )
            return "not_found"

        user = db.get(User, registration.user_id) if registration.user_id else None
        if not user or not user.is_active or not user.email_verified:
            registration.email_delivery_status = "not_eligible"
            db.commit()
            return "not_eligible"

        stored_email = getattr(registration, "email", None)
        recipient = (stored_email or user.email).strip().lower()
        if recipient != user.email.strip().lower():
            registration.email_delivery_status = "not_eligible"
            db.commit()
            return "not_eligible"

        pass_id = getattr(registration, "pass_id", None)
        pass_was_sent = pass_id and registration.email_pass_id == pass_id
        needs_send = resend or pass_issued or not registration.email_sent_at or (
            pass_id and not pass_was_sent
        )
        if not needs_send:
            return registration.email_delivery_status or "pending"

        now = datetime.utcnow()
        last_attempt = registration.email_last_attempt_at
        recent_attempt = last_attempt and now - last_attempt < timedelta(
            seconds=REGISTRATION_EMAIL_RETRY_SECONDS
        )
        if recent_attempt and (not pass_issued or registration.email_delivery_status == "sending"):
            return registration.email_delivery_status or "pending"

        registration.email_last_attempt_at = now
        registration.email_delivery_status = "sending"
        db.commit()

        try:
            if kind == "registration":
                event = get_event(db, registration.event_type, registration.event_id)
                title = event.title
                event_date = event.date
                event_time = event.time
                venue = getattr(event, "venue", None) or event.location
                description = event.description or event.agenda
            elif kind == "course_application":
                title = registration.course_title
                event_date = event_time = None
                venue = "Online course"
                description = registration.notes or (
                    f"Course application for {registration.course_title}."
                )
            else:
                title = registration.pass_type
                event_date = event_time = None
                venue = registration.company or "TechTalk Community"
                description = registration.notes or (
                    f"{registration.pass_type} community access."
                )
            logger.info(
                "registration_email_submission_attempted",
                extra={
                    "request_id": request_id,
                    "registration_id": registration_id,
                },
            )
            send_registration_email(
                kind,
                user,
                registration,
                title=title,
                event_date=event_date,
                event_time=event_time,
                venue=venue,
                description=description,
            )
        except Exception as exc:
            db.rollback()
            failed_registration = (
                db.query(model)
                .filter(model.id == registration_id)
                .with_for_update()
                .one_or_none()
            )
            if failed_registration is not None:
                failed_registration.email_delivery_status = "failed"
                db.commit()
            logger.error(
                "registration_email_failed",
                extra={
                    "request_id": request_id,
                    "registration_id": registration_id,
                    "error_type": type(exc).__name__,
                },
            )
            return "failed"

        registration.email_sent_at = datetime.utcnow()
        registration.email_pass_id = pass_id
        registration.email_delivery_status = "sent"
        db.commit()
        logger.info(
            "registration_email_submission_succeeded",
            extra={
                "request_id": request_id,
                "registration_id": registration_id,
            },
        )
        return "sent"
    except Exception as exc:
        logger.error(
            "registration_email_failed",
            extra={
                "request_id": request_id,
                "registration_id": registration_id,
                "error_type": type(exc).__name__,
            },
        )
        return "failed"
    finally:
        db.close()


def audit(db: Session, actor: User | None, action: str, resource: str | None = None, metadata: dict | None = None):
    """Best-effort audit primitive for privileged handlers."""
    db.add(AuditLog(actor_user_id=actor.id if actor else None, action=action,
                    resource=resource, metadata_json=json.dumps(metadata or {})))

@asynccontextmanager
async def lifespan(_: FastAPI):
    database_url = str(engine.url)
    if not database_url.startswith("sqlite"):
        if settings.jwt_secret == "change-this-in-production" or len(settings.jwt_secret) < 32:
            raise RuntimeError("JWT_SECRET must be a random value of at least 32 characters in production.")
    else:
        # Local development and the test suite may bootstrap SQLite. Production
        # schema changes are owned exclusively by Alembic in the Render command.
        Base.metadata.create_all(bind=engine)
        ensure_user_profile_columns()
        ensure_registration_phone_column()
        ensure_pass_issue_columns()
        ensure_auth_columns()
        ensure_check_ins_table()
    stop_event = asyncio.Event()
    cleanup_task = asyncio.create_task(run_cleanup(stop_event, cleanup_expired_records, settings.cleanup_interval_seconds))
    report_task = asyncio.create_task(run_admin_report_scheduler(stop_event))
    try:
        yield
    finally:
        stop_event.set()
        await cleanup_task
        await report_task
        engine.dispose()


async def run_admin_report_scheduler(stop_event: asyncio.Event) -> None:
    if not settings.admin_report_email:
        logger.warning("scheduled_admin_reports_disabled reason=ADMIN_REPORT_EMAIL_unset")
        return
    while not stop_event.is_set():
        try:
            await asyncio.to_thread(send_due_scheduled_reports)
        except Exception as exc:
            logger.error(
                "scheduled_admin_report_failed error_type=%s",
                type(exc).__name__,
            )
        try:
            await asyncio.wait_for(stop_event.wait(), timeout=60)
        except asyncio.TimeoutError:
            continue


app = FastAPI(title='NexziByte TechTalk API', version='1.0.0', lifespan=lifespan)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(ObservabilityMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins(),
    allow_credentials=False,
    allow_methods=['*'],
    allow_headers=['*'],
)


def cleanup_expired_records() -> None:
    """Remove revocable credentials and mark only clearly expired records."""
    now = datetime.utcnow()
    db = SessionLocal()
    try:
        db.query(RefreshToken).filter(
            or_(RefreshToken.expires_at < now, RefreshToken.revoked_at.is_not(None))
        ).delete(synchronize_session=False)
        db.query(PassRequest).filter(
            PassRequest.expires_at.is_not(None),
            PassRequest.expires_at < now,
            PassRequest.status.in_(['approved', 'issued']),
        ).update({'status': 'expired'}, synchronize_session=False)
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def ensure_user_profile_columns():
    columns = {column['name'] for column in inspect(engine).get_columns('users')}
    additions = {
        'profile_image': 'VARCHAR(500)',
        'phone': 'VARCHAR(40)',
        'visitor_access_only': 'BOOLEAN DEFAULT FALSE',
        'visitor_activated_at': 'TIMESTAMP',
        'visitor_expires_at': 'TIMESTAMP',
        'professional_role': 'VARCHAR(120)',
        'website': 'VARCHAR(500)',
        'linkedin_url': 'VARCHAR(500)',
        'github_url': 'VARCHAR(500)',
        'twitter_url': 'VARCHAR(500)',
        'devto_url': 'VARCHAR(500)',
        'leetcode_url': 'VARCHAR(500)',
        'instagram_url': 'VARCHAR(500)',
    }
    missing = [(name, column_type) for name, column_type in additions.items() if name not in columns]
    if not missing:
        return
    with engine.begin() as connection:
        for name, column_type in missing:
            connection.execute(text(f'ALTER TABLE users ADD COLUMN {name} {column_type}'))

def ensure_check_ins_table():
    if 'check_ins' not in inspect(engine).get_table_names():
        CheckIn.__table__.create(bind=engine, checkfirst=True)

def ensure_pass_issue_columns():
    columns = {column['name'] for column in inspect(engine).get_columns('pass_requests')}
    additions = {
        'pass_id': 'VARCHAR(40)',
        'qr_data': 'VARCHAR(255)',
        'issued_at': 'TIMESTAMP',
        'expires_at': 'TIMESTAMP',
        'phone': 'VARCHAR(40)',
        'referral_contact': 'VARCHAR(40)',
    }
    missing = [(name, column_type) for name, column_type in additions.items() if name not in columns]
    if not missing:
        return
    with engine.begin() as connection:
        for name, column_type in missing:
            connection.execute(text(f'ALTER TABLE pass_requests ADD COLUMN {name} {column_type}'))


def ensure_registration_phone_column():
    columns = {column['name'] for column in inspect(engine).get_columns('registrations')}
    if 'phone' not in columns:
        with engine.begin() as connection:
            connection.execute(text('ALTER TABLE registrations ADD COLUMN phone VARCHAR(40)'))


def ensure_auth_columns():
    columns = {column['name'] for column in inspect(engine).get_columns('users')}
    additions = {
        'neon_auth_user_id': 'VARCHAR(128)',
        'referral_contact': 'VARCHAR(40)',
        'email_verified': 'BOOLEAN DEFAULT FALSE',
        'failed_login_attempts': 'INTEGER DEFAULT 0',
        'locked_until': 'TIMESTAMP',
    }
    with engine.begin() as connection:
        for name, column_type in additions.items():
            if name not in columns:
                connection.execute(text(f'ALTER TABLE users ADD COLUMN {name} {column_type}'))

@app.get('/', tags=['System'])
def root():
    return {'name': 'NexziByte TechTalk API', 'docs': '/docs', 'health': '/health'}


@app.get('/ready', tags=['System'])
def readiness(db: Session = Depends(get_db)):
    try:
        db.execute(text('SELECT 1'))
    except SQLAlchemyError as exc:
        logger.exception('readiness_check_failed')
        raise HTTPException(status_code=503, detail='database unavailable') from exc
    return {'status': 'ready'}


@app.get('/internal/db-info', include_in_schema=False)
def database_info(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    try:
        row = db.execute(
            text(
                'SELECT current_database() AS current_database, '
                'current_schema() AS current_schema, '
                'version() AS postgresql_server_version'
            )
        ).mappings().one()
    except SQLAlchemyError as exc:
        logger.error('database_info_query_failed error_type=%s', type(exc).__name__)
        raise HTTPException(
            status_code=503,
            detail='Database diagnostics are unavailable.',
        ) from exc
    return {
        'current_database': row['current_database'],
        'current_schema': row['current_schema'],
        'postgresql_server_version': row['postgresql_server_version'],
        'database_connected': True,
    }


@app.get('/metrics', tags=['System'], response_class=PlainTextResponse)
def metrics():
    return metrics_text()

@app.exception_handler(HTTPException)
async def http_error(_, exc): return JSONResponse(status_code=exc.status_code, content={'detail': exc.detail})

class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    professional_role: str | None = None
    referral_contact: str | None = Field(default=None, max_length=40)
    accept_terms: bool = False

class PassRejectionIn(BaseModel):
    reason: str = Field(min_length=3, max_length=1000)

class UserRoleUpdateIn(BaseModel):
    role: Literal["user", "staff", "admin"]

class CheckInIn(BaseModel):
    qr_data: str = Field(min_length=20, max_length=1000)


class VerificationCodeIn(BaseModel):
    code: str = Field(min_length=6, max_length=128)
    email: EmailStr | None = None

class VerificationResendIn(BaseModel):
    email: EmailStr


class ForgotPasswordIn(BaseModel):
    email: EmailStr


class ResetPasswordIn(BaseModel):
    token: str = Field(min_length=20, max_length=256)
    new_password: str = Field(min_length=8, max_length=128)


class RefreshTokenIn(BaseModel):
    refresh_token: str


class CategoryIn(BaseModel): name: str = Field(min_length=1, max_length=100); slug: str = Field(min_length=1, max_length=120); description: str | None = None
class PostIn(BaseModel): title: str = Field(min_length=1, max_length=200); content: str = Field(min_length=1); category_id: int; tags: str | None = None; cover_image: str | None = None
class CommentIn(BaseModel): content: str = Field(min_length=1, max_length=5000)
class SpeakerIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    designation: str = Field(min_length=1, max_length=150)
    photo: str | None = None
    company: str | None = None
    expertise: str | None = None
    biography: str | None = None
    professional_links: str | None = None

    @field_validator('photo', 'professional_links')
    @classmethod
    def validate_urls(cls, value: str | None):
        if value is None or not value.strip():
            return value
        for url in value.split(','):
            HttpUrl(url.strip())
        return value
class EventIn(BaseModel):
    title: str = Field(min_length=1, max_length=200); description: str | None = None; banner: str | None = None; date: date; time: datetime_module.time | None = None; location: str | None = None; agenda: str | None = None; speaker_ids: list[int] = []
    venue: str | None = None; founder_information: str | None = None; networking_info: str | None = None
class RegistrationIn(BaseModel):
    event_type: Literal['summit', 'founder_meet']
    event_id: int
    phone: str | None = Field(default=None, max_length=40)
class ProfileUpdateIn(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    email: EmailStr | None = None
    phone: str | None = Field(default=None, max_length=40)
    bio: str | None = None
    location: str | None = None
    profile_image: str | None = None
    professional_role: str | None = None
    current_company: str | None = Field(default=None, max_length=160)
    skills: str | None = None
    website: str | None = None
    linkedin_url: str | None = None
    github_url: str | None = None
    twitter_url: str | None = None
    devto_url: str | None = None
    leetcode_url: str | None = None
    instagram_url: str | None = None


class ExperienceIn(BaseModel):
    title: str = Field(min_length=1, max_length=160)
    company: str = Field(min_length=1, max_length=160)
    start_date: date
    end_date: date | None = None
    description: str | None = Field(default=None, max_length=5000)

    @field_validator('title', 'company')
    @classmethod
    def require_nonblank_text(cls, value: str):
        value = value.strip()
        if not value:
            raise ValueError('This field cannot be blank')
        return value

    @model_validator(mode="after")
    def validate_date_range(self):
        if self.end_date and self.end_date < self.start_date:
            raise ValueError("Experience end date cannot be before its start date")
        return self


class EducationIn(BaseModel):
    school: str = Field(min_length=1, max_length=180)
    degree: str = Field(min_length=1, max_length=160)
    field: str = Field(min_length=1, max_length=160)
    year: int = Field(ge=1900, le=2100)

    @field_validator('school', 'degree', 'field')
    @classmethod
    def require_nonblank_text(cls, value: str):
        value = value.strip()
        if not value:
            raise ValueError('This field cannot be blank')
        return value


class ProfessionalProfilePatchIn(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=120)
    headline: str | None = Field(default=None, max_length=120)
    current_company: str | None = Field(default=None, max_length=160)
    bio: str | None = None
    location: str | None = Field(default=None, max_length=120)
    profile_image: str | None = Field(default=None, max_length=500)
    website: str | None = Field(default=None, max_length=500)
    linkedin_url: str | None = Field(default=None, max_length=500)
    github_url: str | None = Field(default=None, max_length=500)
    twitter_url: str | None = Field(default=None, max_length=500)
    devto_url: str | None = Field(default=None, max_length=500)
    leetcode_url: str | None = Field(default=None, max_length=500)
    instagram_url: str | None = Field(default=None, max_length=500)
    experiences: list[ExperienceIn] | None = Field(default=None, max_length=100)
    education: list[EducationIn] | None = Field(default=None, max_length=100)


class ProfileLinkIn(BaseModel):
    label: str = Field(min_length=1, max_length=80)
    url: HttpUrl

class ChangePasswordIn(BaseModel):
    current_password: str = Field(min_length=1, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)

class TagIn(BaseModel):
    name: str = Field(min_length=1, max_length=80)

class UserSettingsIn(BaseModel):
    profile_settings: dict | None = None
    account_settings: dict | None = None
    notification_preferences: dict | None = None
    privacy: dict | None = None
class PartnershipInquiryIn(BaseModel):
    first_name: str = Field(min_length=1, max_length=80)
    last_name: str = Field(min_length=1, max_length=80)
    email: EmailStr
    partnership_type: str = Field(min_length=1, max_length=80)
    details: str = Field(min_length=1, max_length=3000)


class ContactInquiryIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=40)
    subject: str = Field(min_length=1, max_length=200)
    message: str = Field(min_length=1, max_length=5000)

    @field_validator("name", "subject", "message")
    @classmethod
    def trim_required_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be blank.")
        return value

    @field_validator("phone")
    @classmethod
    def trim_phone(cls, value: str | None) -> str | None:
        return (value.strip() or None) if value is not None else None


class NewsletterSubscribeIn(BaseModel):
    email: EmailStr
class CourseApplicationIn(BaseModel):
    course_id: str = Field(min_length=1, max_length=120)
    course_title: str = Field(min_length=1, max_length=200)
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: str = Field(min_length=1, max_length=40)
    interest_role: str | None = Field(default=None, max_length=150)
    experience_level: str | None = Field(default=None, max_length=120)
    notes: str | None = Field(default=None, max_length=3000)
class PassRequestIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    pass_type: str = Field(min_length=1, max_length=40)
    amount: str = Field(min_length=1, max_length=40)
    company: str | None = Field(default=None, max_length=160)
    role: str | None = Field(default=None, max_length=160)
    notes: str | None = Field(default=None, max_length=3000)
    phone: str | None = Field(default=None, max_length=40)
    referral_contact: str | None = Field(default=None, max_length=40)


class AdminReportRequest(BaseModel):
    cadence: Literal['weekly', 'monthly', 'yearly'] = 'weekly'
    start_date: date | None = None
    end_date: date | None = None


def item(obj):
    data = {c.name: getattr(obj, c.name) for c in obj.__table__.columns}
    return data

def pass_request_response(request):
    return {
        'id': request.id,
        'status': request.status,
        'pass_id': request.pass_id,
        'qr_data': request.qr_data,
        'issued_at': request.issued_at,
        'expires_at': request.expires_at,
        'holder': f'{request.first_name} {request.last_name}'.strip(),
        'email': request.email,
        'pass_type': request.pass_type,
        'amount': request.amount,
        'company': request.company,
        'role': request.role,
        'email_sent_at': request.email_sent_at,
        'email_delivery_status': request.email_delivery_status,
    }
def user_item(user):
    private_fields = {'password_hash'}
    return {c.name: getattr(user, c.name) for c in user.__table__.columns if c.name not in private_fields}
def one(db, cls, ident):
    obj = db.get(cls, ident)
    if not obj: raise HTTPException(404, detail=f'{cls.__name__} not found')
    return obj
def admin_or_owner(user, owner_id):
    if user.role != 'admin' and user.id != owner_id: raise HTTPException(403, detail='Not permitted')
def set_values(obj, values, allowed):
    for key, value in values.items():
        if key in allowed and value is not None: setattr(obj, key, value)
def attach_speakers(db, event, speaker_ids):
    speakers = [one(db, Speaker, sid) for sid in speaker_ids]
    event.speakers = speakers
def get_event(db, event_type, event_id): return one(db, Summit if event_type == 'summit' else FounderMeet, event_id)


def is_visitor_promotion_day() -> bool:
    return bool(
        settings.visitor_promotion_date
        and datetime.now(datetime_module.timezone.utc).date().isoformat()
        == settings.visitor_promotion_date
    )

def ensure_user_settings(db: Session, user: User):
    settings_record = db.query(UserSettings).filter_by(user_id=user.id).first()
    if not settings_record:
        settings_record = UserSettings(user_id=user.id)
        db.add(settings_record)
        db.commit()
        db.refresh(settings_record)
    return settings_record


def add_notification(db: Session, user_id: int, notification_type: str, title: str, message: str):
    notification = Notification(user_id=user_id, type=notification_type, title=title, message=message)
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return item(notification)


def user_profile_payload(user: User, db: Session):
    try:
        return _build_user_profile_payload(user, db)
    except SQLAlchemyError as exc:
        request_id = request_id_context.get()
        logger.exception(
            "user_profile_query_failed",
            extra={"request_id": request_id or "unavailable"},
        )
        raise HTTPException(
            status_code=503,
            detail="Member profile data is temporarily unavailable. Please try again shortly.",
        ) from exc


def _build_user_profile_payload(user: User, db: Session):
    skills = [row.skill for row in db.query(UserSkill).filter_by(user_id=user.id).all()]
    links = [item(row) for row in db.query(UserLink).filter_by(user_id=user.id).all()]
    posts = [make_post_payload(post, db, user) for post in db.query(Post).filter(Post.author_id == user.id, Post.is_archived.is_(False)).order_by(Post.created_at.desc()).all()]
    contribution_dates: Counter[str] = Counter()
    contribution_rows = (
        db.query(Post.created_at).filter(Post.author_id == user.id).all()
        + db.query(Comment.created_at).filter(Comment.user_id == user.id).all()
        + db.query(Reaction.created_at).filter(Reaction.user_id == user.id).all()
        + db.query(Registration.registered_at).filter(Registration.user_id == user.id).all()
    )
    for (created_at,) in contribution_rows:
        if created_at:
            contribution_dates[created_at.date().isoformat()] += 1
    sorted_dates = sorted(contribution_dates)
    current_streak = 0
    cursor = date.today()
    while cursor.isoformat() in contribution_dates:
        current_streak += 1
        cursor -= timedelta(days=1)
    longest_streak = 0
    streak = 0
    previous = None
    for value in sorted_dates:
        current = date.fromisoformat(value)
        streak = streak + 1 if previous and (current - previous).days == 1 else 1
        longest_streak = max(longest_streak, streak)
        previous = current
    activity = {
        'posts_count': len(posts),
        'comments_count': db.query(Comment).filter_by(user_id=user.id).count(),
        'reactions_count': db.query(Reaction).filter_by(user_id=user.id).count(),
        'saved_posts_count': db.query(SavedPost).filter_by(user_id=user.id).count(),
        'registrations_count': db.query(Registration).filter_by(user_id=user.id).count(),
        'contributions_total': sum(contribution_dates.values()),
        'current_streak': current_streak,
        'longest_streak': longest_streak,
        'contribution_days': [
            {'date': day, 'count': count} for day, count in sorted(contribution_dates.items())
        ],
    }
    pass_requests = [item(row) for row in db.query(PassRequest).filter_by(user_id=user.id).order_by(PassRequest.created_at.desc()).all()]
    course_applications = [item(row) for row in db.query(CourseApplication).filter_by(user_id=user.id).order_by(CourseApplication.created_at.desc()).all()]
    return {
        **user_item(user),
        'skills': skills or (user.skills.split(',') if user.skills else []),
        'links': links,
        'posts': posts,
        'activity': activity,
        'pass_requests': pass_requests,
        'course_applications': course_applications,
        'settings': item(ensure_user_settings(db, user)),
    }

@app.get('/health')
def health(): return {'status': 'ok'}


@app.get('/api/health')
def api_health(): return {'success': True, 'status': 'healthy'}

@app.post('/partnership-inquiries', status_code=201)
def create_partnership_inquiry(body: PartnershipInquiryIn, db: Session = Depends(get_db)):
    inquiry = PartnershipInquiry(**body.model_dump())
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return {'id': inquiry.id, 'detail': 'Partnership inquiry received'}


@app.post("/contact-inquiries", status_code=201)
def create_contact_inquiry(
    body: ContactInquiryIn,
    request: Request,
    db: Session = Depends(get_db),
):
    client_ip = request.client.host if request.client else "unknown"
    if not rate_limit(f"contact:{client_ip}", limit=5, window=3600):
        raise HTTPException(
            status_code=429,
            detail="Too many contact requests. Please try again in an hour.",
        )

    inquiry = ContactInquiry(
        name=body.name,
        email=str(body.email).lower().strip(),
        phone=body.phone,
        subject=body.subject,
        message=body.message,
    )
    db.add(inquiry)
    try:
        db.commit()
        db.refresh(inquiry)
    except SQLAlchemyError as exc:
        db.rollback()
        logger.error(
            "contact_inquiry_save_failed request_id=%s error_type=%s",
            request_id_context.get() or "unavailable",
            type(exc).__name__,
        )
        raise HTTPException(
            status_code=503,
            detail="Your message could not be saved. Please try again.",
        ) from exc

    try:
        email_notifications = send_contact_notifications(
            {
                "name": inquiry.name,
                "email": inquiry.email,
                "phone": inquiry.phone,
                "subject": inquiry.subject,
                "message": inquiry.message,
            },
            request_id_context.get() or "unavailable",
        )
    except Exception as exc:
        email_notifications = {
            "submitter_confirmation": "failed",
            "admin_notification": "failed",
        }
        logger.error(
            "contact_email_dispatch_failed request_id=%s error_type=%s",
            request_id_context.get() or "unavailable",
            type(exc).__name__,
        )
    return {
        "id": inquiry.id,
        "status": inquiry.status,
        "email_notifications": email_notifications,
        "detail": "Your inquiry was received.",
    }


@app.post('/newsletter/subscribe', status_code=201)
def subscribe_to_newsletter(body: NewsletterSubscribeIn, db: Session = Depends(get_db)):
    normalized_email = str(body.email).lower().strip()
    subscriber = db.query(NewsletterSubscriber).filter_by(email=normalized_email).first()
    if subscriber:
        if subscriber.is_active:
            raise HTTPException(409, detail='This email is already subscribed.')
        subscriber.is_active = True
    else:
        subscriber = NewsletterSubscriber(email=normalized_email)
        db.add(subscriber)
    db.commit()
    db.refresh(subscriber)
    return {'id': subscriber.id, 'detail': 'You are subscribed to Nexzibyte TechTalk.'}

@app.post('/course-applications', status_code=201)
def create_course_application(
    body: CourseApplicationIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
):
    application = CourseApplication(
        **{
            **body.model_dump(),
            "email": user.email if user else str(body.email).lower().strip(),
        },
        user_id=user.id if user else None,
        email_delivery_status="pending" if user and user.email_verified else "not_eligible",
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    if user and user.email_verified and user.is_active:
        background_tasks.add_task(
            send_registration_email_background,
            "course_application",
            application.id,
            request_id_context.get() or "unavailable",
        )
    return {
        'id': application.id,
        'status': application.status,
        'email': application.email,
        'email_delivery_status': application.email_delivery_status,
        'detail': 'Course application received',
    }

@app.post('/pass-requests', status_code=201)
def create_pass_request(
    body: PassRequestIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
):
    first_name, *last_name = body.name.strip().split()
    request = PassRequest(
        user_id=user.id if user else None,
        first_name=first_name,
        last_name=' '.join(last_name) or first_name,
        email=(user.email if user else body.email).lower().strip(),
        pass_type=body.pass_type,
        amount=body.amount,
        company=body.company,
        role=body.role,
        notes=body.notes,
        phone=body.phone,
        referral_contact=body.referral_contact,
    )
    db.add(request)
    db.flush()
    request.status = 'issued'
    request.pass_id = f"TT26-{request.id:06d}"
    request.issued_at = datetime.utcnow()
    request.qr_data = sign_pass_payload(request.pass_id, None)
    db.commit()
    db.refresh(request)
    if user and user.email_verified and user.is_active:
        background_tasks.add_task(
            send_registration_email_background,
            "pass_request",
            request.id,
            request_id_context.get() or "unavailable",
        )
    else:
        request.email_delivery_status = "not_eligible"
        db.commit()
    return {**pass_request_response(request), 'detail': 'Pass generated successfully'}

@app.patch('/admin/pass-requests/{request_id}/approve')
def approve_pass_request(
    request_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    request = one(db, PassRequest, request_id)
    pass_needs_email = not request.pass_id or request.email_pass_id != request.pass_id
    request.pass_id = request.pass_id or f"TT26-{request.id:06d}"
    request.issued_at = datetime.utcnow()
    if request.pass_type.lower() == 'visitor-pass':
        if not is_visitor_promotion_day():
            raise HTTPException(400, detail='Visitor passes can only be approved on the promotion date.')
        request.expires_at = None
    else:
        request.expires_at = None
    request.qr_data = sign_pass_payload(request.pass_id, request.expires_at)
    request.status = 'approved'
    db.commit()
    db.refresh(request)
    if request.user_id and pass_needs_email:
        background_tasks.add_task(
            send_registration_email_background,
            "pass_request",
            request.id,
            request_id_context.get() or "unavailable",
            pass_issued=True,
        )
    return pass_request_response(request)

@app.patch('/admin/pass-requests/{request_id}/reject')
def reject_pass_request(request_id: int, body: PassRejectionIn, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    request = one(db, PassRequest, request_id)
    request.status = 'rejected'
    request.pass_id = None
    request.qr_data = None
    request.issued_at = None
    request.expires_at = None
    db.commit()
    if request.user_id:
        add_notification(db, request.user_id, 'pass_rejected', 'Pass request rejected', body.reason)
    db.refresh(request)
    return pass_request_response(request)


@app.post('/admin/check-ins', status_code=201)
def check_in_pass(body: CheckInIn, db: Session = Depends(get_db), operator: User = Depends(require_staff)):
    try:
        payload = validate_pass_payload(body.qr_data)
    except ValueError as exc:
        raise HTTPException(400, detail=str(exc)) from exc
    request = db.query(PassRequest).filter_by(pass_id=payload['pid']).first()
    if not request or request.qr_data != body.qr_data:
        raise HTTPException(400, detail='Pass is invalid.')
    if request.status not in ('approved', 'issued'):
        raise HTTPException(400, detail='Pass is not active.')
    if request.pass_type.lower() == 'visitor-pass' and request.expires_at is None:
        raise HTTPException(400, detail='Visitor pass has not been activated.')
    if request.expires_at and request.expires_at <= datetime.utcnow():
        request.status = 'expired'
        db.commit()
        raise HTTPException(400, detail='Pass has expired.')
    if db.query(CheckIn).filter_by(pass_request_id=request.id).first():
        raise HTTPException(409, detail='Pass has already been checked in.')
    check_in = CheckIn(pass_request_id=request.id, pass_id=request.pass_id,
                       nonce=payload['nonce'], operator_user_id=operator.id)
    db.add(check_in)
    db.commit()
    db.refresh(check_in)
    return {'id': check_in.id, 'pass_id': check_in.pass_id, 'checked_in_at': check_in.checked_in_at}

@app.get('/users/me/pass-requests')
def my_pass_requests(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return [pass_request_response(request) for request in db.query(PassRequest).filter_by(user_id=user.id).order_by(PassRequest.created_at.desc()).all()]


@app.post('/users/me/pass-requests/{request_id}/activate-visitor')
def activate_visitor_pass(
    request_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not is_visitor_promotion_day():
        raise HTTPException(403, detail='Visitor passes can only be activated on the promotion date.')
    request = one(db, PassRequest, request_id)
    if request.user_id != user.id:
        raise HTTPException(404, detail='Visitor pass not found.')
    user_record = db.get(User, user.id)
    if user_record is None:
        raise HTTPException(401, detail='Authenticated user is no longer available.')
    if request.pass_type.lower() != 'visitor-pass':
        raise HTTPException(400, detail='This pass is not a visitor pass.')
    if request.status not in ('approved', 'issued') or not request.pass_id:
        raise HTTPException(409, detail='Visitor pass must be approved before activation.')
    if user_record.visitor_activated_at is not None or user_record.visitor_access_only:
        raise HTTPException(409, detail='The visitor pass has already been activated.')

    activated_at = datetime.utcnow()
    expires_at = activated_at + timedelta(minutes=10)
    user_record.visitor_access_only = True
    user_record.visitor_activated_at = activated_at
    user_record.visitor_expires_at = expires_at
    request.expires_at = expires_at
    request.qr_data = sign_pass_payload(request.pass_id, expires_at)
    try:
        db.commit()
    except SQLAlchemyError as exc:
        db.rollback()
        logger.error(
            "visitor_pass_activation_failed",
            extra={
                "request_id": request_id_context.get() or "unavailable",
                "user_id": user_record.id,
                "pass_request_id": request.id,
                "error_type": type(exc).__name__,
            },
        )
        raise HTTPException(
            500, detail="Visitor pass activation could not be completed"
        ) from exc
    db.refresh(user_record)
    db.refresh(request)
    logger.info(
        "visitor_pass_activated",
        extra={
            "request_id": request_id_context.get() or "unavailable",
            "user_id": user_record.id,
            "pass_request_id": request.id,
            "expires_at": expires_at.isoformat(),
        },
    )
    return {
        **pass_request_response(request),
        "qr_image_data_uri": qr_data_uri(request.qr_data),
        "visitor_activated_at": activated_at.isoformat() + "Z",
        "visitor_expires_at": expires_at.isoformat() + "Z",
    }


@app.get('/users/me/course-applications')
def my_course_applications(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return [
        item(application)
        for application in db.query(CourseApplication)
        .filter_by(user_id=user.id)
        .order_by(CourseApplication.created_at.desc())
        .all()
    ]

@app.get('/admin/pass-requests')
def admin_pass_requests(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return [item(request) for request in db.query(PassRequest).order_by(PassRequest.created_at.desc()).all()]

@app.get('/admin/email-logs')
def admin_email_logs(
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """Expose delivery state to administrators without exposing it publicly."""
    rows = db.query(EmailLog).order_by(EmailLog.created_at.desc()).limit(limit).all()
    return [
        {
            'id': row.id,
            'email': row.email,
            'email_type': row.email_type,
            'status': row.status,
            'error_message': row.error_message,
            'sent_at': row.sent_at,
            'created_at': row.created_at,
        }
        for row in rows
    ]

@app.get('/dashboard/member')
def member_dashboard(db: Session = Depends(get_db), user: User = Depends(require_member)):
    return {
        'user': user_item(user),
        'activity': user_profile_payload(user, db)['activity'],
        'pass_requests': [pass_request_response(row) for row in db.query(PassRequest).filter_by(user_id=user.id).order_by(PassRequest.created_at.desc()).all()],
    }

@app.get('/auth/me')
def auth_me(user: User = Depends(get_current_user), db: Session = Depends(get_db)): return user_profile_payload(user, db)

@app.get('/auth/session')
def auth_session(user: User = Depends(get_current_user)):
    return user_item(user)

@app.get('/users/me')
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)): return user_profile_payload(user, db)

def public_profile_payload(profile_user: User, db: Session, viewer: User | None = None):
    skills = [
        row.skill
        for row in db.query(UserSkill)
        .filter_by(user_id=profile_user.id)
        .order_by(UserSkill.created_at.asc())
        .all()
    ]
    links = [
        item(row)
        for row in db.query(UserLink)
        .filter_by(user_id=profile_user.id)
        .order_by(UserLink.created_at.asc())
        .all()
    ]
    experiences = [
        item(row)
        for row in db.query(UserExperience)
        .filter_by(user_id=profile_user.id)
        .order_by(UserExperience.start_date.desc(), UserExperience.id.desc())
        .all()
    ]
    education = [
        item(row)
        for row in db.query(UserEducation)
        .filter_by(user_id=profile_user.id)
        .order_by(UserEducation.year.desc(), UserEducation.id.desc())
        .all()
    ]
    is_following = bool(
        viewer
        and viewer.id != profile_user.id
        and db.query(UserFollow.id)
        .filter_by(follower_id=viewer.id, followed_id=profile_user.id)
        .first()
    )
    return {
        'id': profile_user.id,
        'name': profile_user.name,
        'profile_image': profile_user.profile_image,
        'headline': profile_user.professional_role,
        'professional_role': profile_user.professional_role,
        'current_company': profile_user.current_company,
        'bio': profile_user.bio,
        'location': profile_user.location,
        'website': profile_user.website,
        'linkedin_url': profile_user.linkedin_url,
        'github_url': profile_user.github_url,
        'twitter_url': profile_user.twitter_url,
        'devto_url': profile_user.devto_url,
        'leetcode_url': profile_user.leetcode_url,
        'instagram_url': profile_user.instagram_url,
        'skills': skills or (profile_user.skills.split(',') if profile_user.skills else []),
        'links': links,
        'experiences': experiences,
        'education': education,
        'followers_count': db.query(UserFollow.id).filter_by(followed_id=profile_user.id).count(),
        'following_count': db.query(UserFollow.id).filter_by(follower_id=profile_user.id).count(),
        'is_following': is_following,
    }


@app.get('/users/me/profile')
def my_professional_profile(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    return public_profile_payload(user, db, user)


@app.patch('/users/me/profile')
def update_professional_profile(
    body: ProfessionalProfilePatchIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    scalar_fields = {
        'name': body.name,
        'professional_role': body.headline,
        'current_company': body.current_company,
        'bio': body.bio,
        'location': body.location,
        'profile_image': body.profile_image,
        'website': body.website,
        'linkedin_url': body.linkedin_url,
        'github_url': body.github_url,
        'twitter_url': body.twitter_url,
        'devto_url': body.devto_url,
        'leetcode_url': body.leetcode_url,
        'instagram_url': body.instagram_url,
    }
    try:
        for field, value in scalar_fields.items():
            if value is not None:
                setattr(user, field, value.strip() if isinstance(value, str) else value)
        if body.experiences is not None:
            db.query(UserExperience).filter_by(user_id=user.id).delete(synchronize_session=False)
            db.add_all(
                UserExperience(user_id=user.id, **experience.model_dump())
                for experience in body.experiences
            )
        if body.education is not None:
            db.query(UserEducation).filter_by(user_id=user.id).delete(synchronize_session=False)
            db.add_all(
                UserEducation(user_id=user.id, **entry.model_dump())
                for entry in body.education
            )
        db.add(user)
        db.commit()
    except SQLAlchemyError as exc:
        db.rollback()
        logger.exception("professional_profile_update_failed")
        raise HTTPException(
            status_code=503,
            detail="Profile changes could not be saved. Please try again.",
        ) from exc
    db.refresh(user)
    return public_profile_payload(user, db, user)


@app.get('/users/{user_id}/profile')
def public_professional_profile(
    user_id: int,
    db: Session = Depends(get_db),
    viewer: User | None = Depends(get_optional_user),
):
    profile_user = one(db, User, user_id)
    return public_profile_payload(profile_user, db, viewer)


@app.get('/users/{user_id}/followers')
def user_followers(user_id: int, db: Session = Depends(get_db)):
    one(db, User, user_id)
    rows = (
        db.query(User)
        .join(UserFollow, User.id == UserFollow.follower_id)
        .filter(UserFollow.followed_id == user_id)
        .order_by(UserFollow.created_at.desc())
        .all()
    )
    return [
        {
            'id': profile_user.id,
            'name': profile_user.name,
            'profile_image': profile_user.profile_image,
            'headline': profile_user.professional_role,
        }
        for profile_user in rows
    ]


@app.get('/users/{user_id}/following')
def user_following(user_id: int, db: Session = Depends(get_db)):
    one(db, User, user_id)
    rows = (
        db.query(User)
        .join(UserFollow, User.id == UserFollow.followed_id)
        .filter(UserFollow.follower_id == user_id)
        .order_by(UserFollow.created_at.desc())
        .all()
    )
    return [
        {
            'id': profile_user.id,
            'name': profile_user.name,
            'profile_image': profile_user.profile_image,
            'headline': profile_user.professional_role,
        }
        for profile_user in rows
    ]


@app.post('/users/{user_id}/follow')
def follow_user(
    user_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    one(db, User, user_id)
    if user_id == user.id:
        raise HTTPException(status_code=400, detail="You cannot follow your own profile.")
    existing = db.query(UserFollow).filter_by(
        follower_id=user.id, followed_id=user_id
    ).first()
    if existing:
        return {'following': True, 'changed': False}
    db.add(UserFollow(follower_id=user.id, followed_id=user_id))
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        if db.query(UserFollow.id).filter_by(
            follower_id=user.id, followed_id=user_id
        ).first():
            return {'following': True, 'changed': False}
        raise
    return {'following': True, 'changed': True}


@app.delete('/users/{user_id}/follow')
def unfollow_user(
    user_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    one(db, User, user_id)
    removed = db.query(UserFollow).filter_by(
        follower_id=user.id, followed_id=user_id
    ).delete(synchronize_session=False)
    db.commit()
    return {'following': False, 'changed': bool(removed)}


@app.get('/profile/links')
def profile_links(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return [item(link) for link in db.query(UserLink).filter_by(user_id=user.id).order_by(UserLink.created_at.asc()).all()]

@app.post('/profile/links', status_code=201)
def create_profile_link(body: ProfileLinkIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    link = UserLink(user_id=user.id, label=body.label.strip(), url=str(body.url))
    db.add(link)
    db.commit()
    db.refresh(link)
    return item(link)

@app.put('/profile/links/{link_id}')
def update_profile_link(link_id: int, body: ProfileLinkIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    link = one(db, UserLink, link_id)
    if link.user_id != user.id:
        raise HTTPException(403, detail='You can only edit your own profile links.')
    link.label = body.label.strip()
    link.url = str(body.url)
    db.commit()
    db.refresh(link)
    return item(link)

@app.delete('/profile/links/{link_id}', status_code=204)
def delete_profile_link(link_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    link = one(db, UserLink, link_id)
    if link.user_id != user.id:
        raise HTTPException(403, detail='You can only delete your own profile links.')
    db.delete(link)
    db.commit()

@app.put('/auth/profile')
def update_profile(body: ProfileUpdateIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    normalized_email = body.email.lower().strip() if body.email else None
    if normalized_email and normalized_email != user.email:
        if db.query(User).filter(User.email == normalized_email, User.id != user.id).first():
            raise HTTPException(409, detail='Email already registered')
        user.email = normalized_email
    fields = {
        'name': body.name,
        'phone': body.phone,
        'bio': body.bio,
        'location': body.location,
        'profile_image': body.profile_image,
        'professional_role': body.professional_role,
        'current_company': body.current_company,
        'skills': body.skills,
        'website': body.website,
        'linkedin_url': body.linkedin_url,
        'github_url': body.github_url,
        'twitter_url': body.twitter_url,
        'devto_url': body.devto_url,
        'leetcode_url': body.leetcode_url,
        'instagram_url': body.instagram_url,
    }
    for key, value in fields.items():
        if value is not None:
            setattr(user, key, value.strip() if isinstance(value, str) else value)
    db.add(user); db.commit(); db.refresh(user);         return user_item(user)

@app.put('/auth/change-password')
def change_password(body: ChangePasswordIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not verify_password(body.current_password, user.password_hash):
        raise HTTPException(status_code=401, detail='Current password is incorrect')
    if body.new_password == body.current_password:
        raise HTTPException(status_code=400, detail='New password must be different from the current password')
    user.password_hash = hash_password(body.new_password)
    db.add(user); db.commit(); return {'detail': 'Password updated successfully'}

@app.get('/users/me/posts')
def my_posts(status: str | None = None, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    q = db.query(Post).filter(Post.author_id == user.id, Post.is_archived.is_(False))
    if status:
        if status not in {'published', 'draft'}:
            raise HTTPException(422, detail='status must be published or draft')
        q = q.filter(Post.status == status)
    return [make_post_payload(post, db, user) for post in q.order_by(Post.created_at.desc()).all()]

@app.get('/users/me/settings')
def my_settings(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return item(ensure_user_settings(db, user))

@app.put('/users/me/settings')
def update_settings(body: UserSettingsIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    settings_record = ensure_user_settings(db, user)
    if body.profile_settings is not None: settings_record.profile_settings = str(body.profile_settings)
    if body.account_settings is not None: settings_record.account_settings = str(body.account_settings)
    if body.notification_preferences is not None: settings_record.notification_preferences = str(body.notification_preferences)
    if body.privacy is not None: settings_record.privacy = str(body.privacy)
    db.add(settings_record)
    db.commit()
    db.refresh(settings_record)
    return item(settings_record)

@app.put('/users/me')
def update_user_profile(body: ProfileUpdateIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return update_profile(body, db, user)

@app.get('/users/{user_id}')
def user_detail(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = one(db, User, user_id)
    if current_user.role != 'admin' and current_user.id != user.id:
        raise HTTPException(403, detail='Not permitted')
    return user_profile_payload(user, db)

@app.get('/users/{user_id}/posts')
def user_posts(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = one(db, User, user_id)
    if current_user.role != 'admin' and current_user.id != user.id:
        raise HTTPException(403, detail='Not permitted')
    return [make_post_payload(post, db, user) for post in db.query(Post).filter(Post.author_id == user.id, Post.is_archived.is_(False)).order_by(Post.created_at.desc()).all()]

@app.get('/users/{user_id}/activity')
def user_activity(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user = one(db, User, user_id)
    if current_user.role != 'admin' and current_user.id != user.id:
        raise HTTPException(403, detail='Not permitted')
    return {
        'recent_posts': [make_post_payload(post, db, user) for post in db.query(Post).filter(Post.author_id == user.id, Post.is_archived.is_(False)).order_by(Post.created_at.desc()).limit(5).all()],
        'recent_comments': [item(comment) for comment in db.query(Comment).filter_by(user_id=user.id).order_by(Comment.created_at.desc()).limit(5).all()],
        'recent_registrations': [item(reg) for reg in db.query(Registration).filter_by(user_id=user.id).order_by(Registration.registered_at.desc()).limit(5).all()],
    }

@app.get('/users')
def users(search: str | None = None, limit: int = Query(20, ge=1, le=100), offset: int = Query(0, ge=0), db: Session = Depends(get_db), _: User = Depends(require_admin)):
    q = db.query(User)
    if search: q = q.filter(or_(User.name.ilike(f'%{search}%'), User.email.ilike(f'%{search}%')))
    return {'total': q.count(), 'items': [user_item(x) for x in q.offset(offset).limit(limit)]}
@app.patch('/users/{user_id}/status')
def user_status(user_id: int, active: bool, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    u = one(db, User, user_id); u.is_active = active; db.commit(); return user_item(u)

@app.post('/categories', status_code=201)
def create_category(body: CategoryIn, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    if db.query(Category).filter(or_(Category.name == body.name, Category.slug == body.slug)).first(): raise HTTPException(409, detail='Category name or slug exists')
    x = Category(**body.model_dump()); db.add(x); db.commit(); db.refresh(x); return item(x)
@app.get('/categories')
def list_categories(db: Session = Depends(get_db)): return [item(x) for x in db.query(Category).filter_by(is_archived=False)]

@app.get('/tags')
def list_tags(db: Session = Depends(get_db)):
    return [item(x) for x in db.query(Tag).order_by(Tag.name.asc())]

@app.post('/tags', status_code=201)
def create_tag(body: TagIn, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    body.name = body.name.strip()
    if not body.name:
        raise HTTPException(422, detail='Tag name is required')
    existing = db.query(Tag).filter_by(name=body.name).first()
    if existing:
        raise HTTPException(409, detail='Tag already exists')
    tag = Tag(name=body.name)
    db.add(tag)
    db.commit()
    db.refresh(tag)
    return item(tag)


def normalize_tags(raw):
    if not raw: return []
    if isinstance(raw, str):
        return [tag.strip() for tag in raw.split(',') if tag.strip()]
    return [str(tag).strip() for tag in raw if str(tag).strip()]


def serialize_post_summary(post, db: Session, user: User | None = None):
    reactions = db.query(Reaction).filter_by(post_id=post.id).count()
    comments = db.query(Comment).filter_by(post_id=post.id).count()
    return {
        'id': post.id,
        'title': post.title,
        'excerpt': (post.content[:160] + '...') if len(post.content or '') > 160 else (post.content or ''),
        'content': post.content,
        'category': post.category.name if post.category else 'General',
        'category_id': post.category_id,
        'tags': normalize_tags(post.tags),
        'author': post.author.name if post.author else 'Community member',
        'authorRole': getattr(post.author, 'professional_role', None) or 'TechTalk contributor',
        'publishedAt': post.created_at.strftime('%Y-%m-%d') if post.created_at else '2026-01-01',
        'readTime': str(max(3, min(12, len((post.content or '').split()) // 150 + 3))) + ' min read',
        'reactions': reactions,
        'comments': comments,
        'user_reacted': bool(user and db.query(Reaction).filter_by(post_id=post.id, user_id=user.id).first()),
        'image': post.cover_image or 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    }


def get_featured_posts(db: Session, limit: int = 4):
    posts = db.query(Post).filter(Post.status == 'published').order_by(Post.created_at.desc()).limit(limit).all()
    return [serialize_post_summary(post, db) for post in posts]


def get_trending_categories(db: Session, limit: int = 6):
    categories = db.query(Category, func.count(Post.id).label('post_count')).outerjoin(Post, Post.category_id == Category.id).filter(Category.is_archived.is_(False)).group_by(Category.id).order_by(func.count(Post.id).desc(), Category.name.asc()).limit(limit).all()
    return [{'id': category.id, 'name': category.name, 'slug': category.slug, 'description': category.description, 'post_count': post_count} for category, post_count in categories]


def get_upcoming_events(db: Session, limit: int = 6):
    summits = db.query(Summit).filter(Summit.is_published.is_(True), Summit.date >= date.today()).order_by(Summit.date.asc()).limit(limit).all()
    founder_meets = db.query(FounderMeet).filter(FounderMeet.is_published.is_(True), FounderMeet.date >= date.today()).order_by(FounderMeet.date.asc()).limit(limit).all()
    return {
        'summits': [event_response(event) for event in summits],
        'founder_meets': [event_response(event) for event in founder_meets],
    }


def get_featured_speakers(db: Session, limit: int = 4):
    speakers = db.query(Speaker).order_by(Speaker.id.asc()).limit(limit).all()
    return [item(speaker) for speaker in speakers]


@app.get('/posts/featured')
def featured_posts(limit: int = Query(4, ge=1, le=12), db: Session = Depends(get_db)):
    return get_featured_posts(db=db, limit=limit)


@app.get('/categories/trending')
def trending_categories(limit: int = Query(6, ge=1, le=12), db: Session = Depends(get_db)):
    return get_trending_categories(db=db, limit=limit)


@app.get('/events/upcoming')
def upcoming_events(limit: int = Query(6, ge=1, le=12), db: Session = Depends(get_db)):
    return get_upcoming_events(db=db, limit=limit)


@app.get('/speakers/featured')
def featured_speakers(limit: int = Query(4, ge=1, le=12), db: Session = Depends(get_db)):
    return get_featured_speakers(db=db, limit=limit)


@app.get('/home')
def home_data(db: Session = Depends(get_db)):
    return {
        'featured_posts': get_featured_posts(db=db),
        'trending_categories': get_trending_categories(db=db),
        'upcoming_events': get_upcoming_events(db=db),
        'featured_speakers': get_featured_speakers(db=db),
    }


STATIC_CONTENT_MODELS = {
    'courses': StaticCourse,
    'speakers': StaticSpeaker,
    'internships': StaticInternship,
    'founder-meets': StaticFounderMeet,
    'events': StaticEvent,
    'articles': StaticArticle,
    'testimonials': StaticTestimonial,
    'faqs': StaticFaq,
    'pricing': StaticPricingTier,
}


@app.get('/content/{catalog}')
def static_content_catalog(
    catalog: str,
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    model = STATIC_CONTENT_MODELS.get(catalog)
    if model is None:
        raise HTTPException(404, detail='Content catalog not found.')
    records = (
        db.query(model)
        .order_by(model.sort_order.asc(), model.id.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return [
        {
            **record.payload_json,
            'content_record_id': record.id,
            'source_key': record.source_key,
        }
        for record in records
    ]


@app.put('/categories/{category_id}')
def update_category(category_id: int, body: CategoryIn, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    x = one(db, Category, category_id); set_values(x, body.model_dump(), {'name','slug','description'}); db.commit(); return item(x)
@app.delete('/categories/{category_id}')
def archive_category(category_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    x = one(db, Category, category_id); x.is_archived=True; db.commit(); return {'detail':'Category archived'}

def make_post_payload(post, db: Session, user: User | None = None):
    reactions = db.query(Reaction).filter_by(post_id=post.id).count()
    comments = db.query(Comment).filter_by(post_id=post.id).count()
    return {
        'id': post.id,
        'title': post.title,
        'content': post.content,
        'excerpt': (post.content[:160] + '...') if post.content and len(post.content) > 160 else (post.content or ''),
        'category_id': post.category_id,
        'category': post.category.name if post.category else 'General',
        'tags': normalize_tags(post.tags),
        'cover_image': post.cover_image,
        'status': post.status,
        'author_id': post.author_id,
        'author': post.author.name if post.author else 'Community member',
        'authorRole': getattr(post.author, 'professional_role', None) or 'TechTalk contributor',
        'publishedAt': post.created_at.strftime('%Y-%m-%d') if post.created_at else '2026-01-01',
        'readTime': str(max(3, min(12, max(1, len((post.content or '').split()) // 150 + 3)))) + ' min read',
        'reactions': reactions,
        'comments': comments,
        'user_reacted': bool(user and db.query(Reaction).filter_by(post_id=post.id, user_id=user.id).first()),
        'image': post.cover_image or 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    }


@app.post('/posts', status_code=201)
def create_post(body: PostIn, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    one(db, Category, body.category_id)
    payload = body.model_dump()
    payload['tags'] = ', '.join(normalize_tags(payload.get('tags'))) if payload.get('tags') is not None else None
    x = Post(author_id=user.id, **payload)
    db.add(x); db.commit(); db.refresh(x);     return make_post_payload(x, db, user)


@app.get('/feed')
def personalized_feed(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    followed_user_ids = db.query(UserFollow.followed_id).filter(
        UserFollow.follower_id == user.id
    )
    posts = (
        db.query(Post)
        .filter(
            Post.is_archived.is_(False),
            Post.status == 'published',
            or_(Post.author_id == user.id, Post.author_id.in_(followed_user_ids)),
        )
        .order_by(Post.created_at.desc(), Post.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    return [make_post_payload(post, db, user) for post in posts]


@app.get('/posts')
def list_posts(category: int | None = None, status: str | None = None, author: int | None = None, search: str | None = None, sort: str | None = None, page: int = Query(1, ge=1), limit: int = Query(12, ge=1, le=50), db: Session = Depends(get_db), user: User | None = Depends(get_optional_user)):
    q = db.query(Post).filter_by(is_archived=False)
    if category: q = q.filter(Post.category_id == category)
    if status: q = q.filter(Post.status == status)
    if author: q = q.filter(Post.author_id == author)
    if search:
        term = f'%{search.lower()}%'
        q = q.filter(or_(func.lower(Post.title).like(term), func.lower(Post.content).like(term), func.lower(Post.tags).like(term)))
    if sort == 'latest' or sort == 'popular':
        q = q.order_by(Post.created_at.desc())
    else:
        q = q.order_by(Post.created_at.desc())
    items = q.offset((page - 1) * limit).limit(limit).all()
    return [make_post_payload(x, db, user) for x in items]


@app.get('/posts/search')
def search_posts(query: str = Query(..., min_length=1), category: int | None = None, sort: str | None = None, page: int = Query(1, ge=1), limit: int = Query(12, ge=1, le=50), db: Session = Depends(get_db), user: User | None = Depends(get_optional_user)):
    return list_posts(category=category, status=None, author=None, search=query, sort=sort, page=page, limit=limit, db=db, user=user)


@app.get('/posts/trending')
def trending_posts(limit: int = Query(6, ge=1, le=20), db: Session = Depends(get_db), user: User | None = Depends(get_optional_user)):
    posts = db.query(Post).filter(Post.is_archived.is_(False), Post.status == 'published').all()
    ranked = []
    for post in posts:
        reactions = db.query(Reaction).filter_by(post_id=post.id).count()
        comments = db.query(Comment).filter_by(post_id=post.id).count()
        rank = reactions * 2 + comments + (1 if post.status == 'published' else 0)
        ranked.append((rank, post))
    ranked.sort(key=lambda row: row[0], reverse=True)
    return [make_post_payload(post, db, user) for _, post in ranked[:limit]]


@app.get('/posts/{post_id}')
def post_detail(post_id:int, db:Session=Depends(get_db), user: User | None = Depends(get_optional_user)):
    post = one(db, Post, post_id)
    if post.is_archived:
        raise HTTPException(404, detail='Post not found')
    return make_post_payload(post, db, user)


@app.get('/posts/{post_id}/related')
def related_posts(post_id:int, limit: int = Query(3, ge=1, le=12), db:Session=Depends(get_db), user: User | None = Depends(get_optional_user)):
    post = one(db, Post, post_id)
    q = db.query(Post).filter(Post.is_archived.is_(False), Post.id != post_id, Post.status == 'published')
    if post.category_id:
        q = q.filter(Post.category_id == post.category_id)
    related = q.order_by(Post.created_at.desc()).limit(limit).all()
    if len(related) < limit:
        fallback = db.query(Post).filter(Post.is_archived.is_(False), Post.id != post_id, Post.status == 'published').order_by(Post.created_at.desc()).limit(limit).all()
        merged = []
        seen = {item.id for item in related}
        for item in fallback:
            if item.id not in seen:
                merged.append(item)
            if len(related) + len(merged) >= limit:
                break
        related.extend(merged)
    return [make_post_payload(item, db, user) for item in related[:limit]]


@app.put('/posts/{post_id}')
def update_post(post_id:int, body:PostIn, db:Session=Depends(get_db), user:User=Depends(get_current_user)):
    x=one(db,Post,post_id); admin_or_owner(user,x.author_id); one(db,Category,body.category_id)
    payload = body.model_dump()
    payload['tags'] = ', '.join(normalize_tags(payload.get('tags'))) if payload.get('tags') is not None else None
    for key in ('title','content','category_id','tags','cover_image'):
        if key in payload and payload[key] is not None:
            setattr(x, key, payload[key])
    db.commit(); db.refresh(x); return make_post_payload(x, db, user)


@app.post('/posts/{post_id}/publish')
def publish_post(post_id:int, db:Session=Depends(get_db), user:User=Depends(get_current_user)):
    x=one(db,Post,post_id); admin_or_owner(user,x.author_id); x.status='published'; db.commit(); return make_post_payload(x, db, user)


@app.post('/posts/{post_id}/draft')
def draft_post(post_id:int, db:Session=Depends(get_db), user:User=Depends(get_current_user)):
    x=one(db,Post,post_id); admin_or_owner(user,x.author_id); x.status='draft'; db.commit(); return make_post_payload(x, db, user)


@app.patch('/posts/{post_id}/{action}')
def post_action(post_id:int, action:Literal['publish','unpublish'], db:Session=Depends(get_db), user:User=Depends(get_current_user)):
    x=one(db,Post,post_id); admin_or_owner(user,x.author_id); x.status='published' if action=='publish' else 'draft'; db.commit(); return make_post_payload(x, db, user)


@app.delete('/posts/{post_id}')
def archive_post(post_id:int, db:Session=Depends(get_db), user:User=Depends(get_current_user)):
    x=one(db,Post,post_id); admin_or_owner(user,x.author_id); x.is_archived=True; db.commit(); return {'detail':'Post archived'}


@app.post('/posts/{post_id}/comments', status_code=201)
def comment(post_id:int, body:CommentIn, db:Session=Depends(get_db), user:User=Depends(get_current_user)):
    post = one(db,Post,post_id)
    x=Comment(post_id=post_id,user_id=user.id,content=body.content)
    db.add(x);db.commit();db.refresh(x)
    add_notification(db, post.author_id, 'comment', 'New comment', f'{user.name} commented on your post: {post.title}')
    return {**item(x), 'name': user.name, 'profile_image': user.profile_image}


@app.get('/posts/{post_id}/comments')
def comments(post_id:int,db:Session=Depends(get_db)):
    return [
        {**item(comment), 'name': comment_user.name if comment_user else 'Community member', 'profile_image': comment_user.profile_image if comment_user else None}
        for comment, comment_user in db.query(Comment, User).join(User, User.id == Comment.user_id).filter(Comment.post_id == post_id).order_by(Comment.created_at)
    ]


@app.put('/comments/{comment_id}')
def update_comment(comment_id:int, body:CommentIn, db:Session=Depends(get_db), user:User=Depends(get_current_user)):
    x=one(db,Comment,comment_id); admin_or_owner(user,x.user_id); x.content=body.content; db.commit(); return item(x)


@app.delete('/comments/{comment_id}')
def delete_comment(comment_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    x=one(db,Comment,comment_id); admin_or_owner(user,x.user_id);db.delete(x);db.commit();return {'detail':'Comment deleted'}


@app.post('/posts/{post_id}/reactions')
def toggle_reaction(post_id:int,reaction_type:Literal['like','upvote']='like',db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    post = one(db,Post,post_id)
    x=db.query(Reaction).filter_by(post_id=post_id,user_id=user.id).first()
    if x:
        db.delete(x);db.commit();return {'reacted':False}
    x=Reaction(post_id=post_id,user_id=user.id,reaction_type=reaction_type);db.add(x);db.commit()
    add_notification(db, post.author_id, 'reaction', 'New reaction', f'{user.name} reacted to your post: {post.title}')
    return {'reacted':True,'reaction':item(x)}
@app.post('/posts/{post_id}/save')
def save_post(post_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    one(db,Post,post_id)
    if db.query(SavedPost).filter_by(post_id=post_id,user_id=user.id).first(): raise HTTPException(409,detail='Post already saved')
    db.add(SavedPost(post_id=post_id,user_id=user.id));db.commit();
    add_notification(db, user.id, 'save', 'Post saved', 'Your post has been added to your saved collection.')
    return {'detail':'Post saved'}
@app.delete('/posts/{post_id}/save')
def unsave_post(post_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    x=db.query(SavedPost).filter_by(post_id=post_id,user_id=user.id).first()
    if not x: raise HTTPException(404,detail='Saved post not found')
    db.delete(x);db.commit();return {'detail':'Post unsaved'}
@app.get('/users/me/saved-posts')
def saved_posts(db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    ids=[x.post_id for x in db.query(SavedPost).filter_by(user_id=user.id)];return [item(x) for x in db.query(Post).filter(Post.id.in_(ids))] if ids else []

@app.get('/notifications')
def list_notifications(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return [item(notification) for notification in db.query(Notification).filter_by(user_id=user.id).order_by(Notification.created_at.desc()).all()]

@app.get('/notifications/unread-count')
def unread_notification_count(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return {'count': db.query(Notification).filter_by(user_id=user.id, is_read=False).count()}

@app.put('/notifications/{notification_id}/read')
def read_notification(notification_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    notification = one(db, Notification, notification_id)
    if notification.user_id != user.id:
        raise HTTPException(403, detail='Not permitted')
    notification.is_read = True
    db.commit()
    return item(notification)

@app.put('/notifications/read-all')
def read_all_notifications(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    db.query(Notification).filter_by(user_id=user.id, is_read=False).update({'is_read': True})
    db.commit()
    return {'detail': 'All notifications marked as read'}

@app.post('/speakers', status_code=201)
def create_speaker(body: SpeakerIn, db: Session=Depends(get_db), _:User=Depends(require_admin)):
    x=Speaker(**body.model_dump());db.add(x);db.commit();db.refresh(x);return item(x)
@app.get('/speakers')
def list_speakers(db:Session=Depends(get_db)): return [item(x) for x in db.query(Speaker)]
@app.get('/speakers/{speaker_id}')
def speaker_detail(speaker_id:int,db:Session=Depends(get_db)): return item(one(db,Speaker,speaker_id))
@app.put('/speakers/{speaker_id}')
def update_speaker(speaker_id:int,body:SpeakerIn,db:Session=Depends(get_db),_:User=Depends(require_admin)):
    x=one(db,Speaker,speaker_id);set_values(x,body.model_dump(),set(body.model_dump()));db.commit();return item(x)
@app.delete('/speakers/{speaker_id}')
def delete_speaker(speaker_id:int,db:Session=Depends(get_db),_:User=Depends(require_admin)):
    x=one(db,Speaker,speaker_id);db.delete(x);db.commit();return {'detail':'Speaker deleted'}
@app.get('/speakers/{speaker_id}/events')
def speaker_events(speaker_id:int,db:Session=Depends(get_db)):
    x=one(db,Speaker,speaker_id);return {'summits':[item(e) for e in x.summits], 'founder_meets':[item(e) for e in x.founder_meets]}

@app.post('/summits',status_code=201)
def create_summit(body:EventIn,db:Session=Depends(get_db),_:User=Depends(require_admin)): return make_event(db,Summit,body)
@app.get('/summits')
def list_summits(status:str|None=None,db:Session=Depends(get_db)): return list_events(db,Summit,status)
@app.get('/summits/{event_id}')
def summit_detail(event_id:int,db:Session=Depends(get_db)): return event_response(one(db,Summit,event_id))
@app.get('/summits/{event_id}/agenda')
def summit_agenda(event_id:int,db:Session=Depends(get_db)):
    event = one(db, Summit, event_id)
    return {'agenda': event.agenda or '', 'title': event.title}
@app.get('/summits/{event_id}/speakers')
def summit_speakers_detail(event_id:int,db:Session=Depends(get_db)):
    event = one(db, Summit, event_id)
    return {'speakers': [item(s) for s in event.speakers]}
@app.get('/summits/{event_id}/sponsors')
def summit_sponsors(event_id:int,db:Session=Depends(get_db)):
    return {'sponsors': []}
@app.get('/summits/{event_id}/related')
def summit_related(event_id:int,db:Session=Depends(get_db), limit: int = Query(3, ge=1, le=12)):
    one(db, Summit, event_id)
    items = db.query(Summit).filter(Summit.id != event_id, Summit.is_published.is_(True)).order_by(Summit.date.asc()).limit(limit).all()
    return [event_response(item) for item in items]
@app.put('/summits/{event_id}')
def update_summit(event_id:int,body:EventIn,db:Session=Depends(get_db),_:User=Depends(require_admin)): return update_event(db,Summit,event_id,body)
@app.patch('/summits/{event_id}/{action}')
def summit_action(event_id:int,action:Literal['publish','unpublish','archive'],db:Session=Depends(get_db),_:User=Depends(require_admin)): return event_state(db,Summit,event_id,action)
@app.delete('/summits/{event_id}')
def delete_summit(event_id:int,db:Session=Depends(get_db),_:User=Depends(require_admin)):
    x=one(db,Summit,event_id);db.delete(x);db.commit();return {'detail':'Summit deleted'}

@app.post('/founder-meets',status_code=201)
def create_founder_meet(body:EventIn,db:Session=Depends(get_db),_:User=Depends(require_admin)): return make_event(db,FounderMeet,body)
@app.get('/founder-meets')
def list_founder_meets(status: str | None = None, public: bool = False, db: Session = Depends(get_db)):
    query = db.query(FounderMeet)
    if public:
        query = query.filter(FounderMeet.is_published.is_(True))
    if status:
        if status not in ('upcoming', 'past'):
            raise HTTPException(422, detail='status must be upcoming or past')
        compare = FounderMeet.date >= date.today() if status == 'upcoming' else FounderMeet.date < date.today()
        query = query.filter(compare)
    return [event_response(event) for event in query.order_by(FounderMeet.date)]
@app.get('/founder-meets/{event_id}')
def founder_meet_detail(event_id:int,db:Session=Depends(get_db)): return event_response(one(db,FounderMeet,event_id))
@app.get('/founder-meets/{event_id}/agenda')
def founder_meet_agenda(event_id:int,db:Session=Depends(get_db)):
    event = one(db, FounderMeet, event_id)
    return {'agenda': event.agenda or '', 'title': event.title}
@app.get('/founder-meets/{event_id}/speakers')
def founder_meet_speakers_detail(event_id:int,db:Session=Depends(get_db)):
    event = one(db, FounderMeet, event_id)
    return {'speakers': [item(s) for s in event.speakers]}
@app.get('/founder-meets/{event_id}/related')
def founder_meet_related(event_id:int,db:Session=Depends(get_db), limit: int = Query(3, ge=1, le=12)):
    one(db, FounderMeet, event_id)
    items = db.query(FounderMeet).filter(FounderMeet.id != event_id, FounderMeet.is_published.is_(True)).order_by(FounderMeet.date.asc()).limit(limit).all()
    return [event_response(item) for item in items]
@app.put('/founder-meets/{event_id}')
def update_founder_meet(event_id:int,body:EventIn,db:Session=Depends(get_db),_:User=Depends(require_admin)): return update_event(db,FounderMeet,event_id,body)
@app.patch('/founder-meets/{event_id}/{action}')
def founder_meet_action(event_id:int,action:Literal['publish','unpublish','archive'],db:Session=Depends(get_db),_:User=Depends(require_admin)): return event_state(db,FounderMeet,event_id,action)
@app.delete('/founder-meets/{event_id}')
def delete_founder_meet(event_id:int,db:Session=Depends(get_db),_:User=Depends(require_admin)):
    x=one(db,FounderMeet,event_id);db.delete(x);db.commit();return {'detail':'Founder Meet deleted'}

@app.post('/registrations', status_code=201)
def create_registration(
    body: RegistrationIn,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    request_id = request_id_context.get() or "unavailable"
    logger.info(
        "event_registration_received",
        extra={
            "request_id": request_id,
            "user_id": user.id,
            "event_type": body.event_type,
            "event_id": body.event_id,
        },
    )
    event = get_event(db, body.event_type, body.event_id)
    if event.status != 'upcoming' or event.date < date.today():
        raise HTTPException(409, detail='Registration is not open for this event.')
    if db.query(Registration).filter_by(
        user_id=user.id,
        event_type=body.event_type,
        event_id=body.event_id,
    ).first():
        raise HTTPException(409, detail='Already registered for this event')

    temporary_pass_id = f"PENDING-{secrets.token_hex(12).upper()}"
    registration_data = body.model_dump()
    registration_data["phone"] = body.phone or user.phone
    registration = Registration(
        user_id=user.id,
        registration_number=f"REG-{secrets.token_hex(5).upper()}",
        pass_id=temporary_pass_id,
        qr_data=sign_pass_payload(temporary_pass_id, None),
        email_delivery_status=(
            "pending" if user.is_active and user.email_verified else "not_eligible"
        ),
        **registration_data,
    )
    db.add(registration)
    if body.phone and not user.phone:
        user_record = db.get(User, user.id)
        if user_record is not None and not user_record.phone:
            user_record.phone = body.phone
    try:
        db.flush()
        logger.info(
            "event_registration_created",
            extra={
                "request_id": request_id,
                "registration_id": registration.id,
                "user_id": user.id,
                "event_type": body.event_type,
                "event_id": body.event_id,
            },
        )
        for _ in range(5):
            pass_id = f"NEX-EVT-{secrets.randbelow(900000) + 100000}"
            if not db.query(Registration.id).filter_by(pass_id=pass_id).first():
                break
        else:
            raise RuntimeError("Could not allocate a unique event pass ID.")
        registration.pass_id = pass_id
        registration.qr_data = sign_pass_payload(pass_id, None)
        logger.info(
            "event_registration_pass_generated",
            extra={
                "request_id": request_id,
                "registration_id": registration.id,
                "pass_id": pass_id,
            },
        )
        db.add(
            Notification(
                user_id=user.id,
                type='event_update',
                title='Event registration confirmed',
                message=f'You are registered for {event.title}.',
            )
        )
        response = item(registration)
        response.update({
            "email": user.email,
            "event_name": event.title,
            "email_delivery_status": registration.email_delivery_status,
        })
        db.commit()
        logger.info(
            "event_registration_transaction_committed",
            extra={
                "request_id": request_id,
                "registration_id": registration.id,
                "user_id": user.id,
            },
        )
    except IntegrityError as exc:
        db.rollback()
        duplicate = db.query(Registration.id).filter_by(
            user_id=user.id,
            event_type=body.event_type,
            event_id=body.event_id,
        ).first()
        if duplicate:
            raise HTTPException(409, detail='Already registered for this event') from exc
        logger.error(
            "event_registration_database_failed",
            extra={
                "request_id": request_id,
                "user_id": user.id,
                "event_type": body.event_type,
                "event_id": body.event_id,
                "error_type": type(exc).__name__,
            },
        )
        raise HTTPException(
            500,
            detail='Registration could not be completed. Please try again.',
        ) from exc
    except SQLAlchemyError as exc:
        db.rollback()
        logger.error(
            "event_registration_database_failed",
            extra={
                "request_id": request_id,
                "user_id": user.id,
                "event_type": body.event_type,
                "event_id": body.event_id,
                "error_type": type(exc).__name__,
            },
        )
        raise HTTPException(
            500,
            detail='Registration could not be completed. Please try again.',
        ) from exc
    background_tasks.add_task(
        send_registration_email_background,
        "registration",
        registration.id,
        request_id,
    )
    return response

@app.post('/summits/{event_id}/register', status_code=201)
def register_for_summit(event_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return create_registration(RegistrationIn(event_type='summit', event_id=event_id), background_tasks, db, user)

@app.post('/founder-meets/{event_id}/register', status_code=201)
def register_for_founder_meet(event_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return create_registration(RegistrationIn(event_type='founder_meet', event_id=event_id), background_tasks, db, user)

@app.get('/users/me/registrations')
def my_registrations(db:Session=Depends(get_db), user:User=Depends(get_current_user)):
    return [item(reg) for reg in db.query(Registration).filter_by(user_id=user.id).order_by(Registration.registered_at.desc()).all()]


@app.get('/users/me/passes')
def my_passes(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    passes = []
    for request in db.query(PassRequest).filter_by(user_id=user.id).all():
        passes.append({
            "kind": "pass_request",
            "id": request.id,
            "title": request.pass_type,
            "pass_type": request.pass_type,
            "status": request.status,
            "pass_id": request.pass_id,
            "qr_data": request.qr_data,
            "qr_image_data_uri": qr_data_uri(request.qr_data),
            "expires_at": request.expires_at,
            "email": request.email,
            "email_delivery_status": request.email_delivery_status,
            "email_sent_at": request.email_sent_at,
            "created_at": request.created_at,
            "date": None,
            "time": None,
            "venue": request.company or "TechTalk Community",
        })
    for application in db.query(CourseApplication).filter_by(user_id=user.id).all():
        passes.append({
            "kind": "course_application",
            "id": application.id,
            "title": application.course_title,
            "pass_type": "course_application",
            "status": application.status,
            "pass_id": application.pass_id,
            "qr_data": application.qr_data,
            "qr_image_data_uri": qr_data_uri(application.qr_data),
            "email": application.email,
            "email_delivery_status": application.email_delivery_status,
            "email_sent_at": application.email_sent_at,
            "created_at": application.created_at,
            "date": None,
            "time": None,
            "venue": "Online course",
        })
    for registration in db.query(Registration).filter_by(user_id=user.id).all():
        event_model = Summit if registration.event_type == "summit" else FounderMeet
        event = db.get(event_model, registration.event_id)
        passes.append({
            "kind": "registration",
            "id": registration.id,
            "title": event.title if event else "Event no longer available",
            "pass_type": f"{registration.event_type.replace('_', ' ')} pass",
            "status": registration.status,
            "pass_id": registration.pass_id,
            "qr_data": registration.qr_data,
            "qr_image_data_uri": qr_data_uri(registration.qr_data),
            "email": user.email,
            "email_delivery_status": registration.email_delivery_status,
            "email_sent_at": registration.email_sent_at,
            "created_at": registration.registered_at,
            "date": event.date if event else None,
            "time": event.time if event else None,
            "venue": (
                (getattr(event, "venue", None) or event.location) if event else None
            ),
            "description": event.description if event else None,
        })
    return sorted(passes, key=lambda entry: entry["created_at"] or datetime.min, reverse=True)


@app.post('/users/me/registrations/{kind}/{registration_id}/resend')
def resend_registration_confirmation(
    kind: Literal["registration", "course_application", "pass_request"],
    registration_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    model = {
        "registration": Registration,
        "course_application": CourseApplication,
        "pass_request": PassRequest,
    }[kind]
    registration = db.query(model).filter_by(id=registration_id).one_or_none()
    if registration is None:
        raise HTTPException(404, detail="Registration not found.")
    if registration.user_id != user.id:
        raise HTTPException(403, detail="You can only resend your own registration email.")
    if not user.email_verified or not user.is_active:
        raise HTTPException(403, detail="A verified account is required to resend this email.")
    last_attempt = registration.email_last_attempt_at
    if last_attempt:
        seconds_since_attempt = (datetime.utcnow() - last_attempt).total_seconds()
        if seconds_since_attempt < REGISTRATION_EMAIL_RETRY_SECONDS:
            retry_after = max(1, int(REGISTRATION_EMAIL_RETRY_SECONDS - seconds_since_attempt))
            raise HTTPException(
                429,
                detail="Please wait a few minutes before requesting another confirmation email.",
                headers={"Retry-After": str(retry_after)},
            )
    background_tasks.add_task(
        send_registration_email_background,
        kind,
        registration.id,
        request_id_context.get() or "unavailable",
        resend=True,
    )
    return {
        "id": registration.id,
        "kind": kind,
        "email": getattr(registration, "email", None) or user.email,
        "email_delivery_status": "queued",
        "detail": "A confirmation email resend has been queued.",
    }

@app.get('/registrations/{registration_id}/pass')
def registration_pass(registration_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    registration = one(db, Registration, registration_id)
    admin_or_owner(user, registration.user_id)
    return item(registration)


@app.get('/registrations/{registration_id}/qr')
def registration_qr(registration_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    registration = one(db, Registration, registration_id)
    admin_or_owner(user, registration.user_id)
    return {'registration_id': registration.id, 'pass_id': registration.pass_id, 'qr_data': registration.qr_data}


class QRVerifyIn(BaseModel):
    token: str = Field(min_length=20, max_length=1000)


@app.post('/qr/verify')
def verify_registration_qr(body: QRVerifyIn, db: Session = Depends(get_db), _: User = Depends(require_staff)):
    try:
        payload = validate_pass_payload(body.token)
    except ValueError:
        return {'status': 'INVALID'}
    registration = db.query(Registration).filter_by(pass_id=payload['pid'], qr_data=body.token).first()
    if registration:
        attendee = db.get(User, registration.user_id)
        event = get_event(db, registration.event_type, registration.event_id)
        if registration.status == 'cancelled':
            return {
                'status': 'CANCELLED',
                'pass_id': registration.pass_id,
                'attendee': attendee.name if attendee else 'Unknown attendee',
                'event': event.title,
                'event_type': registration.event_type,
            }
        return {
            'status': 'VALID',
            'registration_id': registration.id,
            'pass_id': registration.pass_id,
            'attendee': attendee.name if attendee else 'Unknown attendee',
            'event': event.title,
            'event_type': registration.event_type,
            'pass_type': f'{registration.event_type.replace("_", " ").title()} pass',
        }
    pass_request = db.query(PassRequest).filter_by(pass_id=payload['pid'], qr_data=body.token).first()
    if not pass_request:
        return {'status': 'INVALID'}
    if pass_request.status in ('cancelled', 'rejected'):
        return {
            'status': 'CANCELLED',
            'pass_id': pass_request.pass_id,
            'attendee': f'{pass_request.first_name} {pass_request.last_name}'.strip(),
            'pass_type': pass_request.pass_type,
        }
    if pass_request.expires_at and pass_request.expires_at <= datetime.utcnow():
        return {
            'status': 'EXPIRED',
            'pass_id': pass_request.pass_id,
            'attendee': f'{pass_request.first_name} {pass_request.last_name}'.strip(),
            'pass_type': pass_request.pass_type,
        }
    return {
        'status': 'VALID',
        'pass_id': pass_request.pass_id,
        'attendee': f'{pass_request.first_name} {pass_request.last_name}'.strip(),
        'pass_type': pass_request.pass_type,
    }


@app.patch('/registrations/{registration_id}/cancel')
def cancel_registration(registration_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    x=one(db,Registration,registration_id);admin_or_owner(user,x.user_id);x.status='cancelled';db.commit();return item(x)

@app.delete('/registrations/{registration_id}')
def delete_registration(registration_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
    x=one(db,Registration,registration_id);admin_or_owner(user,x.user_id);db.delete(x);db.commit();return {'detail':'Registration deleted'}

@app.get('/registrations')
def list_registrations(event_type:str|None=None,event_id:int|None=None,status:str|None=None,db:Session=Depends(get_db),_:User=Depends(require_admin)):
    q=db.query(Registration)
    if event_type:q=q.filter_by(event_type=event_type)
    if event_id:q=q.filter_by(event_id=event_id)
    if status:q=q.filter_by(status=status)
    return [item(x) for x in q]
@app.get('/events/{event_type}/{event_id}/registrations')
def event_registrations(event_type:Literal['summit','founder_meet'],event_id:int,db:Session=Depends(get_db),_:User=Depends(require_admin)):
    get_event(db,event_type,event_id);return [item(x) for x in db.query(Registration).filter_by(event_type=event_type,event_id=event_id)]

@app.get('/dashboard/overview')
def overview(from_date:date|None=Query(None,alias='from'),to_date:date|None=Query(None,alias='to'),db:Session=Depends(get_db),_:User=Depends(require_admin)):
    rquery=db.query(Registration)
    if from_date:rquery=rquery.filter(Registration.registered_at>=datetime.combine(from_date,time.min))
    if to_date:rquery=rquery.filter(Registration.registered_at<=datetime.combine(to_date,time.max))
    return {'total_users':db.query(func.count(User.id)).scalar(),'total_posts':db.query(func.count(Post.id)).scalar(),'published_posts':db.query(func.count(Post.id)).filter(Post.status=='published').scalar(),'total_categories':db.query(func.count(Category.id)).scalar(),'upcoming_summits':db.query(func.count(Summit.id)).filter(Summit.date>=date.today()).scalar(),'upcoming_founder_meets':db.query(func.count(FounderMeet.id)).filter(FounderMeet.date>=date.today()).scalar(),'total_speakers':db.query(func.count(Speaker.id)).scalar(),'total_registrations':rquery.count(),'newsletter_subscribers':db.query(func.count(NewsletterSubscriber.id)).filter(NewsletterSubscriber.is_active.is_(True)).scalar()}
@app.get('/dashboard/recent-activity')
def activity(db:Session=Depends(get_db),_:User=Depends(require_admin)):
    events=sorted([*db.query(Summit).filter(Summit.date>=date.today()),*db.query(FounderMeet).filter(FounderMeet.date>=date.today())],key=lambda e:e.date)[:5]
    return {'posts':[item(x) for x in db.query(Post).order_by(Post.created_at.desc()).limit(5)],'upcoming_events':[event_response(x) for x in events],'registrations':[item(x) for x in db.query(Registration).order_by(Registration.registered_at.desc()).limit(5)]}
@app.get('/dashboard/posts-by-category')
def posts_by_category(db:Session=Depends(get_db),_:User=Depends(require_admin)):
    return [{'category':n,'count':c} for n,c in db.query(Category.name,func.count(Post.id)).outerjoin(Post).group_by(Category.id,Category.name)]
@app.get('/dashboard/registrations-by-event')
def registrations_by_event(db:Session=Depends(get_db),_:User=Depends(require_admin)):
    rows=db.query(Registration.event_type,Registration.event_id,func.count(Registration.id)).group_by(Registration.event_type,Registration.event_id).all();return [{'event_type':t,'event_id':i,'count':c} for t,i,c in rows]

@app.get('/admin/dashboard')
def admin_dashboard(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return {
        'Total Users': db.query(func.count(User.id)).scalar(),
        'Total Posts': db.query(func.count(Post.id)).scalar(),
        'Published Posts': db.query(func.count(Post.id)).filter(Post.status == 'published').scalar(),
        'Total Categories': db.query(func.count(Category.id)).scalar(),
        'Upcoming Summits': db.query(func.count(Summit.id)).filter(Summit.date >= date.today()).scalar(),
        'Upcoming Founder Meets': db.query(func.count(FounderMeet.id)).filter(FounderMeet.date >= date.today()).scalar(),
        'Total Speakers': db.query(func.count(Speaker.id)).scalar(),
        'Total Registrations': db.query(func.count(Registration.id)).scalar(),
        'Newsletter Subscribers': db.query(func.count(NewsletterSubscriber.id)).filter(NewsletterSubscriber.is_active.is_(True)).scalar(),
    }

@app.get('/staff/dashboard')
def staff_dashboard(db: Session = Depends(get_db), _: User = Depends(require_staff)):
    summits = db.query(Summit).order_by(Summit.date.asc()).all()
    founder_meets = db.query(FounderMeet).order_by(FounderMeet.date.asc()).all()
    registration_counts = {
        (event_type, event_id): count
        for event_type, event_id, count in db.query(
            Registration.event_type,
            Registration.event_id,
            func.count(Registration.id),
        ).group_by(Registration.event_type, Registration.event_id).all()
    }
    events = [
        {
            **event_response(event),
            "event_type": event_type,
            "registration_count": registration_counts.get((event_type, event.id), 0),
        }
        for event_type, rows in (("summit", summits), ("founder_meet", founder_meets))
        for event in rows
    ]
    return {
        "events": events,
        "total_registrations": sum(registration_counts.values()),
        "check_in_count": db.query(func.count(CheckIn.id)).scalar() or 0,
        "check_in_count_scope": "pass requests",
        "has_event_data": bool(events),
    }

@app.get('/admin/users')
def admin_users(search: str | None = None, limit: int = Query(20, ge=1, le=100), offset: int = Query(0, ge=0), db: Session = Depends(get_db), _: User = Depends(require_admin)):
    q = db.query(User)
    if search:
        q = q.filter(or_(User.name.ilike(f'%{search}%'), User.email.ilike(f'%{search}%')))
    return {'total': q.count(), 'items': [user_item(x) for x in q.offset(offset).limit(limit)]}

@app.post('/admin/users/{user_id}/role')
def update_user_role(
    user_id: int,
    body: UserRoleUpdateIn,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    if user_id == admin.id:
        raise HTTPException(403, detail="Admins cannot change their own role.")
    target = one(db, User, user_id)
    target.role = body.role
    db.commit()
    db.refresh(target)
    return user_item(target)

@app.put('/admin/users/{user_id}/status')
def admin_user_status(user_id: int, active: bool = Query(...), db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return user_status(user_id, active, db, _)

@app.get('/admin/posts')
def admin_posts(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return [make_post_payload(post, db, _) for post in db.query(Post).filter(Post.is_archived.is_(False)).order_by(Post.created_at.desc()).all()]

@app.get('/admin/newsletter-subscribers')
def admin_newsletter_subscribers(limit: int = Query(100, ge=1, le=500), offset: int = Query(0, ge=0), db: Session = Depends(get_db), _: User = Depends(require_admin)):
    query = db.query(NewsletterSubscriber).filter(NewsletterSubscriber.is_active.is_(True)).order_by(NewsletterSubscriber.created_at.desc())
    return {'total': query.count(), 'items': [item(subscriber) for subscriber in query.offset(offset).limit(limit)]}

@app.get('/admin/course-applications')
def admin_course_applications(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return [item(application) for application in db.query(CourseApplication).order_by(CourseApplication.created_at.desc()).all()]

@app.put('/admin/posts/{post_id}/publish')
def admin_publish_post(post_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    post = one(db, Post, post_id)
    post.status = 'published'
    db.commit()
    return make_post_payload(post, db, _)

@app.get('/admin/events')
def admin_events(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return {
        'summits': [event_response(x) for x in db.query(Summit).order_by(Summit.date.asc()).all()],
        'founder_meets': [event_response(x) for x in db.query(FounderMeet).order_by(FounderMeet.date.asc()).all()],
    }


@app.post('/admin/reports/send-now')
def admin_send_report_now(
    body: AdminReportRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    if bool(body.start_date) != bool(body.end_date):
        raise HTTPException(422, detail='Provide both start_date and end_date, or neither.')
    if body.start_date and body.end_date:
        start_date, end_date = body.start_date, body.end_date
    else:
        start_date, end_date = previous_period(
            body.cadence, datetime.now(datetime_module.timezone.utc).date()
        )
    try:
        report = build_admin_report(db, start_date, end_date)
    except ValueError as exc:
        raise HTTPException(422, detail=str(exc)) from exc
    except SQLAlchemyError as exc:
        logger.error(
            "admin_report_manual_query_failed",
            extra={
                "request_id": request_id_context.get() or "unavailable",
                "admin_user_id": admin.id,
                "error_type": type(exc).__name__,
            },
        )
        raise HTTPException(
            503, detail="Report data is temporarily unavailable."
        ) from exc
    try:
        send_admin_report_email(report)
    except Exception as exc:
        logger.error(
            "admin_report_manual_send_failed",
            extra={
                "request_id": request_id_context.get() or "unavailable",
                "admin_user_id": admin.id,
                "error_type": type(exc).__name__,
            },
        )
        raise HTTPException(
            502, detail='The report email could not be submitted. Please retry later.'
        ) from exc
    logger.info(
        "admin_report_manual_send_submitted",
        extra={
            "request_id": request_id_context.get() or "unavailable",
            "admin_user_id": admin.id,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
        },
    )
    return {
        'status': 'submitted',
        'start_date': start_date,
        'end_date': end_date,
        'counts': report.counts,
    }


@app.get('/admin/registrations')
def admin_registrations(
    event_type: Literal['summit', 'founder_meet'] | None = None,
    event_id: int | None = None,
    status: str | None = None,
    email_status: str | None = None,
    search: str | None = None,
    event: str | None = None,
    pass_id: str | None = None,
    registered_from: date | None = None,
    registered_to: date | None = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    query = db.query(Registration, User).join(User, User.id == Registration.user_id)
    if event_type:
        query = query.filter(Registration.event_type == event_type)
    if event_id is not None:
        query = query.filter(Registration.event_id == event_id)
    if status:
        query = query.filter(Registration.status == status)
    if email_status:
        query = query.filter(Registration.email_delivery_status == email_status)
    if pass_id:
        query = query.filter(Registration.pass_id.ilike(f'%{pass_id.strip()}%'))
    if search:
        term = f'%{search.strip()}%'
        query = query.filter(or_(User.name.ilike(term), User.email.ilike(term)))
    if event:
        term = f'%{event.strip()}%'
        summit_ids = db.query(Summit.id).filter(Summit.title.ilike(term))
        founder_meet_ids = db.query(FounderMeet.id).filter(FounderMeet.title.ilike(term))
        query = query.filter(or_(
            (Registration.event_type == 'summit') & Registration.event_id.in_(summit_ids),
            (Registration.event_type == 'founder_meet') & Registration.event_id.in_(founder_meet_ids),
        ))
    if registered_from:
        query = query.filter(
            Registration.registered_at >= datetime.combine(registered_from, time.min)
        )
    if registered_to:
        query = query.filter(
            Registration.registered_at <= datetime.combine(registered_to, time.max)
        )

    total = query.count()
    rows = query.order_by(Registration.registered_at.desc()).offset(offset).limit(limit).all()
    results = []
    for registration, user in rows:
        event_record = (
            db.get(Summit if registration.event_type == 'summit' else FounderMeet, registration.event_id)
        )
        results.append({
            'id': registration.id,
            'user_id': registration.user_id,
            'user_name': user.name,
            'email': user.email,
            'event_name': event_record.title if event_record else 'Event no longer available',
            'event_type': registration.event_type,
            'event_id': registration.event_id,
            'status': registration.status,
            'registered_at': registration.registered_at,
            'registration_number': registration.registration_number,
            'pass_id': registration.pass_id,
            'pass_issued': bool(registration.pass_id),
            'qr_available': bool(registration.qr_data),
            'email_delivery_status': registration.email_delivery_status,
            'email_sent_at': registration.email_sent_at,
            'email_last_attempt_at': registration.email_last_attempt_at,
        })
    return {'total': total, 'items': results}


@app.get('/admin/registrations/{registration_id}')
def admin_registration_detail(
    registration_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    row = (
        db.query(Registration, User)
        .join(User, User.id == Registration.user_id)
        .filter(Registration.id == registration_id)
        .one_or_none()
    )
    if row is None:
        raise HTTPException(404, detail='Registration not found.')
    registration, user = row
    event = db.get(
        Summit if registration.event_type == 'summit' else FounderMeet,
        registration.event_id,
    )
    return {
        'id': registration.id,
        'user_id': registration.user_id,
        'user_name': user.name,
        'email': user.email,
        'event_name': event.title if event else 'Event no longer available',
        'event_type': registration.event_type,
        'event_id': registration.event_id,
        'status': registration.status,
        'registered_at': registration.registered_at,
        'registration_number': registration.registration_number,
        'pass_id': registration.pass_id,
        'pass_issued': bool(registration.pass_id),
        'qr_available': bool(registration.qr_data),
        'email_delivery_status': registration.email_delivery_status,
        'email_sent_at': registration.email_sent_at,
        'email_last_attempt_at': registration.email_last_attempt_at,
    }


@app.post('/admin/registrations/{registration_id}/resend-email')
def admin_resend_registration_email(
    registration_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    registration = db.get(Registration, registration_id)
    if registration is None:
        raise HTTPException(404, detail='Registration not found.')
    if registration.email_last_attempt_at:
        seconds_since_attempt = (
            datetime.utcnow() - registration.email_last_attempt_at
        ).total_seconds()
        if seconds_since_attempt < REGISTRATION_EMAIL_RETRY_SECONDS:
            retry_after = max(
                1, int(REGISTRATION_EMAIL_RETRY_SECONDS - seconds_since_attempt)
            )
            raise HTTPException(
                429,
                detail='Please wait before requesting another confirmation email.',
                headers={'Retry-After': str(retry_after)},
            )
    request_id = request_id_context.get() or 'unavailable'
    logger.info(
        'admin_registration_email_resend_requested',
        extra={
            'request_id': request_id,
            'registration_id': registration.id,
            'admin_user_id': admin.id,
        },
    )
    result = send_registration_email_background(
        'registration',
        registration.id,
        request_id,
        resend=True,
    )
    return {
        'registration_id': registration.id,
        'email_delivery_status': result,
        'submitted_to_provider': result == 'sent',
        'detail': (
            'Brevo accepted the confirmation email submission.'
            if result == 'sent'
            else 'The confirmation email could not be submitted.'
        ),
    }
