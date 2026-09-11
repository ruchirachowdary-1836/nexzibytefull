"""Store event pass requests."""
from alembic import op
import sqlalchemy as sa

revision = '0008_pass_requests'
down_revision = '0007_social_profile_links'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'pass_requests',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True),
        sa.Column('first_name', sa.String(length=80), nullable=False),
        sa.Column('last_name', sa.String(length=80), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('pass_type', sa.String(length=40), nullable=False),
        sa.Column('amount', sa.String(length=40), nullable=False),
        sa.Column('company', sa.String(length=160), nullable=True),
        sa.Column('role', sa.String(length=160), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=30), nullable=False, server_default='submitted'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_pass_requests_user_id', 'pass_requests', ['user_id'])
    op.create_index('ix_pass_requests_email', 'pass_requests', ['email'])


def downgrade():
    op.drop_index('ix_pass_requests_email', table_name='pass_requests')
    op.drop_index('ix_pass_requests_user_id', table_name='pass_requests')
    op.drop_table('pass_requests')
