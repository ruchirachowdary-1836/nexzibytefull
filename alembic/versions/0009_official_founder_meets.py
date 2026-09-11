"""Align founder meets with the official published schedule."""
from datetime import date, time
from alembic import op
import sqlalchemy as sa

revision = '0009_official_founder_meets'
down_revision = '0008_pass_requests'
branch_labels = None
depends_on = None

OFFICIAL_MEETS = [
    {
        'title': 'NexziByte Product Launch & Dignitary Meet with Sri KTR',
        'description': "The official product launch of NexziByte Solutions' AI platform 'The Future of Trusted & Verified Talent' by Sri K. T. Rama Rao (KTR), alongside Founder & MD Nagunoori Durga Prasad, Director Narasaiah Nagunoori, and technology leaders.",
        'banner': '/images/ktr-nexzibyte-launch.jpg',
        'date': date(2026, 6, 25),
        'time': time(10, 30),
        'location': 'Hyderabad, Telangana (NexziByte Tech Innovation Center)',
        'founder_information': 'OFFICIAL PRODUCT LAUNCH & DIGNITARY VISIT',
        'networking_info': 'Official NexziByte product launch and dignitary founder meet.',
    },
    {
        'title': 'Hyderabad Founders Circle: High-Growth B2B',
        'description': 'An intimate evening for technical founders, angels, and operators discussing runway management, enterprise pricing, and engineering hiring under resource constraints.',
        'banner': 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80',
        'date': date(2026, 9, 5),
        'time': time(18, 0),
        'location': 'Hyderabad (T-Hub Phase 2, Madhapur)',
        'founder_information': 'FOUNDER ROUNDTABLE',
        'networking_info': 'Closed-door founder roundtable.',
    },
    {
        'title': 'Builders & Investors Glass Matchmaking',
        'description': 'Curated 1-on-1 matchmaking between high-conviction pre-seed/seed technical founders and active micro-VCs and angel syndicates across India.',
        'banner': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
        'date': date(2026, 10, 3),
        'time': time(17, 0),
        'location': 'Bengaluru (Indiranagar Executive Space)',
        'founder_information': 'INVESTOR SYNDICATE',
        'networking_info': 'Founder and investor matchmaking.',
    },
    {
        'title': 'Deep Tech & Applied Systems Founders Meet',
        'description': 'Focused discussions on GPU compute clusters, patent defensibility, robotics interfaces, and foundation model fine-tuning.',
        'banner': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
        'date': date(2026, 11, 12),
        'time': time(18, 30),
        'location': 'Hyderabad (HITEC City Convention Center)',
        'founder_information': 'DEEPTECH FOCUS',
        'networking_info': 'Applied systems and deep-tech founder meet.',
    },
]


def upgrade():
    bind = op.get_bind()
    table = sa.table(
        'founder_meets',
        sa.column('id', sa.Integer),
        sa.column('title', sa.String),
        sa.column('description', sa.Text),
        sa.column('banner', sa.String),
        sa.column('date', sa.Date),
        sa.column('time', sa.Time),
        sa.column('location', sa.String),
        sa.column('founder_information', sa.Text),
        sa.column('networking_info', sa.Text),
        sa.column('status', sa.String),
        sa.column('is_published', sa.Boolean),
    )
    titles = [meet['title'] for meet in OFFICIAL_MEETS]
    bind.execute(table.update().where(table.c.title.not_in(titles)).values(status='past', is_published=False))
    for meet in OFFICIAL_MEETS:
        existing = bind.execute(sa.select(table.c.id).where(table.c.title == meet['title'])).first()
        values = {**meet, 'status': 'upcoming', 'is_published': True}
        if existing:
            bind.execute(table.update().where(table.c.id == existing.id).values(**values))
        else:
            bind.execute(table.insert().values(**values))


def downgrade():
    bind = op.get_bind()
    table = sa.table('founder_meets', sa.column('title', sa.String))
    bind.execute(table.delete().where(table.c.title.in_([meet['title'] for meet in OFFICIAL_MEETS])))
