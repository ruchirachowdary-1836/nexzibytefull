"""Add verification, referral, phone, and pass approval fields."""
from alembic import op
import sqlalchemy as sa

revision = "0012_auth_pass_policy"
down_revision = "0011_issue_pass_qr"
branch_labels = None
depends_on = None

def upgrade():
    op.add_column("users", sa.Column("referral_contact", sa.String(length=40), nullable=True))
    op.add_column("users", sa.Column("email_verified", sa.Boolean(), nullable=False, server_default=sa.true()))
    op.add_column("users", sa.Column("verification_token", sa.String(length=128), nullable=True))
    op.add_column("users", sa.Column("verification_expires_at", sa.DateTime(), nullable=True))
    op.add_column("pass_requests", sa.Column("phone", sa.String(length=40), nullable=True))
    op.add_column("pass_requests", sa.Column("referral_contact", sa.String(length=40), nullable=True))
    op.add_column("pass_requests", sa.Column("expires_at", sa.DateTime(), nullable=True))

def downgrade():
    op.drop_column("pass_requests", "expires_at")
    op.drop_column("pass_requests", "referral_contact")
    op.drop_column("pass_requests", "phone")
    op.drop_column("users", "verification_expires_at")
    op.drop_column("users", "verification_token")
    op.drop_column("users", "email_verified")
    op.drop_column("users", "referral_contact")
