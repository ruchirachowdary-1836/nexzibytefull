"""Add public partnership inquiry submissions."""
from alembic import op
import sqlalchemy as sa

revision = '0002_partnership_inquiries'
down_revision = '0001_initial_schema'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'partnership_inquiries',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('first_name', sa.String(length=80), nullable=False),
        sa.Column('last_name', sa.String(length=80), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('partnership_type', sa.String(length=80), nullable=False),
        sa.Column('details', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False),
    )
    op.create_index('ix_partnership_inquiries_email', 'partnership_inquiries', ['email'])


def downgrade():
    op.drop_index('ix_partnership_inquiries_email', table_name='partnership_inquiries')
    op.drop_table('partnership_inquiries')
