"""Add user profile URL and role fields.

These fields were added to the ORM after the original production schema was
created. Keep the migration conditional so older databases and databases
bootstrapped from current metadata remain compatible.
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

    additions = (
        ('profile_image', sa.String(length=500)),
        ('professional_role', sa.String(length=120)),
        ('website', sa.String(length=500)),
        ('linkedin_url', sa.String(length=500)),
    )
    for name, column_type in additions:
        if name not in columns:
            op.add_column('users', sa.Column(name, column_type, nullable=True))


def downgrade():
    inspector = sa.inspect(op.get_bind())
    columns = {column['name'] for column in inspector.get_columns('users')}

    for name in ('linkedin_url', 'website', 'professional_role', 'profile_image'):
        if name in columns:
            op.drop_column('users', name)
