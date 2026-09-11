"""Add profile website and LinkedIn fields.

These fields were added to the ORM after the original production schema was
created. Keep the migration conditional so databases bootstrapped from the
current metadata remain compatible.
"""
from alembic import op
import sqlalchemy as sa

revision = '0006_user_profile_links'
down_revision = '0005_google_account_fields'
branch_labels = None
depends_on = None


def upgrade():
    inspector = sa.inspect(op.get_bind())
    columns = {column['name'] for column in inspector.get_columns('users')}

    if 'website' not in columns:
        op.add_column('users', sa.Column('website', sa.String(length=500), nullable=True))
    if 'linkedin_url' not in columns:
        op.add_column('users', sa.Column('linkedin_url', sa.String(length=500), nullable=True))


def downgrade():
    inspector = sa.inspect(op.get_bind())
    columns = {column['name'] for column in inspector.get_columns('users')}

    if 'linkedin_url' in columns:
        op.drop_column('users', 'linkedin_url')
    if 'website' in columns:
        op.drop_column('users', 'website')
