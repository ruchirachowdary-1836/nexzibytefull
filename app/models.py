from datetime import datetime, date, time
from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, Text, Time, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .database import Base


summit_speakers = __import__('sqlalchemy').Table('summit_speakers', Base.metadata,
    __import__('sqlalchemy').Column('summit_id', ForeignKey('summits.id'), primary_key=True),
    __import__('sqlalchemy').Column('speaker_id', ForeignKey('speakers.id'), primary_key=True))
founder_meet_speakers = __import__('sqlalchemy').Table('founder_meet_speakers', Base.metadata,
    __import__('sqlalchemy').Column('founder_meet_id', ForeignKey('founder_meets.id'), primary_key=True),
    __import__('sqlalchemy').Column('speaker_id', ForeignKey('speakers.id'), primary_key=True))


class User(Base):
    __tablename__ = 'users'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    role: Mapped[str] = mapped_column(String(20), default='user')
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    profile_image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    professional_role: Mapped[str | None] = mapped_column(String(120), nullable=True)
    skills: Mapped[str | None] = mapped_column(Text, nullable=True)
    location: Mapped[str | None] = mapped_column(String(120), nullable=True)
    website: Mapped[str | None] = mapped_column(String(500), nullable=True)
    linkedin_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    github_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    twitter_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    devto_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    posts = relationship('Post', back_populates='author')
    settings = relationship('UserSettings', back_populates='user', uselist=False)
    notifications = relationship('Notification', back_populates='user')


class UserSkill(Base):
    __tablename__ = 'user_skills'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    skill: Mapped[str] = mapped_column(String(120))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class UserLink(Base):
    __tablename__ = 'user_links'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    label: Mapped[str] = mapped_column(String(80))
    url: Mapped[str] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class UserSettings(Base):
    __tablename__ = 'user_settings'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), unique=True)
    profile_settings: Mapped[str | None] = mapped_column(Text, nullable=True, default='{}')
    account_settings: Mapped[str | None] = mapped_column(Text, nullable=True, default='{}')
    notification_preferences: Mapped[str | None] = mapped_column(Text, nullable=True, default='{"comments": true, "reactions": true, "followers": true, "event_updates": true, "registration_updates": true}')
    privacy: Mapped[str | None] = mapped_column(Text, nullable=True, default='{}')
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user = relationship('User', back_populates='settings')


class PartnershipInquiry(Base):
    __tablename__ = 'partnership_inquiries'
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(80))
    last_name: Mapped[str] = mapped_column(String(80))
    email: Mapped[str] = mapped_column(String(255), index=True)
    partnership_type: Mapped[str] = mapped_column(String(80))
    details: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class CourseApplication(Base):
    __tablename__ = 'course_applications'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey('users.id'), nullable=True, index=True)
    course_id: Mapped[str] = mapped_column(String(120), index=True)
    course_title: Mapped[str] = mapped_column(String(200))
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(255), index=True)
    phone: Mapped[str] = mapped_column(String(40))
    interest_role: Mapped[str | None] = mapped_column(String(150), nullable=True)
    experience_level: Mapped[str | None] = mapped_column(String(120), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(30), default='submitted')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class PassRequest(Base):
    __tablename__ = 'pass_requests'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey('users.id'), nullable=True, index=True)
    first_name: Mapped[str] = mapped_column(String(80))
    last_name: Mapped[str] = mapped_column(String(80))
    email: Mapped[str] = mapped_column(String(255), index=True)
    pass_type: Mapped[str] = mapped_column(String(40))
    amount: Mapped[str] = mapped_column(String(40))
    company: Mapped[str | None] = mapped_column(String(160), nullable=True)
    role: Mapped[str | None] = mapped_column(String(160), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(30), default='submitted')
    pass_id: Mapped[str | None] = mapped_column(String(40), unique=True, nullable=True, index=True)
    qr_data: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    issued_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class NewsletterSubscriber(Base):
    __tablename__ = 'newsletter_subscribers'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Category(Base):
    __tablename__ = 'categories'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False)
    posts = relationship('Post', back_populates='category')


class Post(Base):
    __tablename__ = 'posts'
    id: Mapped[int] = mapped_column(primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    category_id: Mapped[int] = mapped_column(ForeignKey('categories.id'))
    title: Mapped[str] = mapped_column(String(200))
    content: Mapped[str] = mapped_column(Text)
    tags: Mapped[str | None] = mapped_column(String(500), nullable=True)
    cover_image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default='draft')
    is_archived: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    author = relationship('User', back_populates='posts')
    category = relationship('Category', back_populates='posts')


class Tag(Base):
    __tablename__ = 'tags'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class PostTag(Base):
    __tablename__ = 'post_tags'
    id: Mapped[int] = mapped_column(primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey('posts.id'))
    tag_id: Mapped[int] = mapped_column(ForeignKey('tags.id'))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Comment(Base):
    __tablename__ = 'comments'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    post_id: Mapped[int] = mapped_column(ForeignKey('posts.id'))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Reaction(Base):
    __tablename__ = 'reactions'; __table_args__ = (UniqueConstraint('user_id', 'post_id'),)
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    post_id: Mapped[int] = mapped_column(ForeignKey('posts.id'))
    reaction_type: Mapped[str] = mapped_column(String(20), default='like')
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class SavedPost(Base):
    __tablename__ = 'saved_posts'; __table_args__ = (UniqueConstraint('user_id', 'post_id'),)
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    post_id: Mapped[int] = mapped_column(ForeignKey('posts.id'))
    saved_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Speaker(Base):
    __tablename__ = 'speakers'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))
    photo: Mapped[str | None] = mapped_column(String(500), nullable=True)
    designation: Mapped[str] = mapped_column(String(150))
    company: Mapped[str | None] = mapped_column(String(150), nullable=True)
    expertise: Mapped[str | None] = mapped_column(Text, nullable=True)
    biography: Mapped[str | None] = mapped_column(Text, nullable=True)
    professional_links: Mapped[str | None] = mapped_column(Text, nullable=True)
    summits = relationship('Summit', secondary=summit_speakers, back_populates='speakers')
    founder_meets = relationship('FounderMeet', secondary=founder_meet_speakers, back_populates='speakers')


class EventFields:
    title: Mapped[str] = mapped_column(String(200)); description: Mapped[str | None] = mapped_column(Text, nullable=True)
    banner: Mapped[str | None] = mapped_column(String(500), nullable=True); date: Mapped[date] = mapped_column(Date)
    time: Mapped[time | None] = mapped_column(Time, nullable=True); location: Mapped[str | None] = mapped_column(String(150), nullable=True)
    agenda: Mapped[str | None] = mapped_column(Text, nullable=True); status: Mapped[str] = mapped_column(String(20), default='upcoming')
    is_published: Mapped[bool] = mapped_column(Boolean, default=False)


class Summit(EventFields, Base):
    __tablename__ = 'summits'
    id: Mapped[int] = mapped_column(primary_key=True); venue: Mapped[str | None] = mapped_column(String(200), nullable=True)
    speakers = relationship('Speaker', secondary=summit_speakers, back_populates='summits')


class FounderMeet(EventFields, Base):
    __tablename__ = 'founder_meets'
    id: Mapped[int] = mapped_column(primary_key=True); founder_information: Mapped[str | None] = mapped_column(Text, nullable=True)
    networking_info: Mapped[str | None] = mapped_column(Text, nullable=True)
    speakers = relationship('Speaker', secondary=founder_meet_speakers, back_populates='founder_meets')


class Registration(Base):
    __tablename__ = 'registrations'; __table_args__ = (UniqueConstraint('user_id', 'event_type', 'event_id'),)
    id: Mapped[int] = mapped_column(primary_key=True); user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    event_type: Mapped[str] = mapped_column(String(20)); event_id: Mapped[int] = mapped_column(Integer)
    status: Mapped[str] = mapped_column(String(20), default='registered')
    registered_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = 'notifications'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
    type: Mapped[str] = mapped_column(String(40), default='general')
    title: Mapped[str] = mapped_column(String(200))
    message: Mapped[str] = mapped_column(Text)
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    user = relationship('User', back_populates='notifications')
