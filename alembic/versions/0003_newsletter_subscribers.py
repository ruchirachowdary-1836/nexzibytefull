"""Add newsletter subscribers."""
from alembic import op
import sqlalchemy as sa

revision = '0003_newsletter_subscribers'
down_revision = '0002_partnership_inquiries'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'newsletter_subscribers',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.UniqueConstraint('email'),
    )
    op.create_index('ix_newsletter_subscribers_email', 'newsletter_subscribers', ['email'])


def downgrade():
    op.drop_index('ix_newsletter_subscribers_email', table_name='newsletter_subscribers')
    op.drop_table('newsletter_subscribers')
