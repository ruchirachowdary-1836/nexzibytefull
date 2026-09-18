"""Add Google account identity fields."""
from alembic import op
import sqlalchemy as sa

revision = '0005_google_account_fields'
down_revision = '0004_course_applications'
branch_labels = None
depends_on = None


def upgrade():
    inspector = sa.inspect(op.get_bind())
    columns = {column['name'] for column in inspector.get_columns('users')}
    if 'google_id' in columns:
        return
    with op.batch_alter_table('users') as batch:
        batch.alter_column('password_hash', existing_type=sa.String(length=255), nullable=True)
        batch.add_column(sa.Column('google_id', sa.String(length=255), nullable=True))
        batch.create_index('ix_users_google_id', ['google_id'], unique=True)


def downgrade():
    with op.batch_alter_table('users') as batch:
        batch.drop_index('ix_users_google_id')
        batch.drop_column('google_id')
        batch.alter_column('password_hash', existing_type=sa.String(length=255), nullable=False)
