"""Add LeetCode and Instagram profile fields."""
from alembic import op
import sqlalchemy as sa

revision = '0013_profile_social_links'
down_revision = '0012_auth_pass_policy'
branch_labels = None
depends_on = None


def upgrade():
    inspector = sa.inspect(op.get_bind())
    columns = {column['name'] for column in inspector.get_columns('users')}
    for name in ('leetcode_url', 'instagram_url'):
        if name not in columns:
            op.add_column('users', sa.Column(name, sa.String(length=500), nullable=True))


def downgrade():
    inspector = sa.inspect(op.get_bind())
    columns = {column['name'] for column in inspector.get_columns('users')}
    for name in ('instagram_url', 'leetcode_url'):
        if name in columns:
            op.drop_column('users', name)
