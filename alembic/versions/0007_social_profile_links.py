"""Add social profile links."""
from alembic import op
import sqlalchemy as sa

revision = '0007_social_profile_links'
down_revision = '0006_user_profile_links'
branch_labels = None
depends_on = None


def upgrade():
    inspector = sa.inspect(op.get_bind())
    columns = {column['name'] for column in inspector.get_columns('users')}
    for name in ('github_url', 'twitter_url', 'devto_url'):
        if name not in columns:
            op.add_column('users', sa.Column(name, sa.String(length=500), nullable=True))


def downgrade():
    inspector = sa.inspect(op.get_bind())
    columns = {column['name'] for column in inspector.get_columns('users')}
    for name in ('devto_url', 'twitter_url', 'github_url'):
        if name in columns:
            op.drop_column('users', name)
