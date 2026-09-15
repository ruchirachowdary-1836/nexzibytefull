"""Ensure the official Founder Meets schedule exists in production."""
from datetime import date, time
from alembic import op
import sqlalchemy as sa

revision = "0010_republish_official_founder_meets"
down_revision = "0009_official_founder_meets"
branch_labels = None
depends_on = None

EVENTS = [
    ("NexziByte Product Launch & Dignitary Meet with Sri KTR", "The official product launch of NexziByte Solutions' AI platform 'The Future of Trusted & Verified Talent' by Sri K. T. Rama Rao (KTR), alongside Founder & MD Nagunoori Durga Prasad, Director Narasaiah Nagunoori, and technology leaders.", "/images/ktr-nexzibyte-launch.jpg", date(2026, 6, 25), time(10, 30), "Hyderabad, Telangana (NexziByte Tech Innovation Center)", "OFFICIAL PRODUCT LAUNCH & DIGNITARY VISIT"),
    ("Hyderabad Founders Circle: High-Growth B2B", "An intimate evening for technical founders, angels, and operators discussing runway management, enterprise pricing, and engineering hiring under resource constraints.", "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80", date(2026, 9, 5), time(18, 0), "Hyderabad (T-Hub Phase 2, Madhapur)", "FOUNDER ROUNDTABLE"),
    ("Builders & Investors Glass Matchmaking", "Curated 1-on-1 matchmaking between high-conviction pre-seed/seed technical founders and active micro-VCs and angel syndicates across India.", "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80", date(2026, 10, 3), time(17, 0), "Bengaluru (Indiranagar Executive Space)", "INVESTOR SYNDICATE"),
    ("Deep Tech & Applied Systems Founders Meet", "Focused discussions on GPU compute clusters, patent defensibility, robotics interfaces, and foundation model fine-tuning.", "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80", date(2026, 11, 12), time(18, 30), "Hyderabad (HITEC City Convention Center)", "DEEPTECH FOCUS"),
]

def upgrade():
    table = sa.table(
        "founder_meets",
        sa.column("id", sa.Integer),
        sa.column("title", sa.String),
        sa.column("description", sa.Text),
        sa.column("banner", sa.String),
        sa.column("date", sa.Date),
        sa.column("time", sa.Time),
        sa.column("location", sa.String),
        sa.column("founder_information", sa.Text),
        sa.column("networking_info", sa.Text),
        sa.column("status", sa.String),
        sa.column("is_published", sa.Boolean),
    )
    bind = op.get_bind()
    for title, description, banner, event_date, event_time, location, founder_information in EVENTS:
        values = {
            "title": title, "description": description, "banner": banner,
            "date": event_date, "time": event_time, "location": location,
            "founder_information": founder_information,
            "networking_info": "Official NexziByte Founder Meet",
            "status": "upcoming", "is_published": True,
        }
        existing = bind.execute(sa.select(table.c.id).where(table.c.title == title)).first()
        if existing:
            bind.execute(table.update().where(table.c.id == existing.id).values(**values))
        else:
            bind.execute(table.insert().values(**values))

def downgrade():
    pass
