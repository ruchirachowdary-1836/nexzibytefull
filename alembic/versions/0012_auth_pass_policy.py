"""Add verification, referral, phone, and pass approval fields."""
from alembic import op
import sqlalchemy as sa

revision = "0012_auth_pass_policy"
down_revision = "0011_issue_pass_qr"
branch_labels = None
depends_on = None

def upgrade():
    inspector = sa.inspect(op.get_bind())
    user_columns = {column["name"] for column in inspector.get_columns("users")}
    pass_columns = {column["name"] for column in inspector.get_columns("pass_requests")}
    additions = (
        ("users", user_columns, "referral_contact", sa.String(length=40), None),
        ("users", user_columns, "email_verified", sa.Boolean(), sa.true()),
        ("users", user_columns, "verification_token", sa.String(length=128), None),
        ("users", user_columns, "verification_expires_at", sa.DateTime(), None),
        ("pass_requests", pass_columns, "phone", sa.String(length=40), None),
        ("pass_requests", pass_columns, "referral_contact", sa.String(length=40), None),
        ("pass_requests", pass_columns, "expires_at", sa.DateTime(), None),
    )
    for table, columns, name, column_type, default in additions:
        if name not in columns:
            kwargs = {"server_default": default} if default is not None else {}
            op.add_column(table, sa.Column(name, column_type, nullable=default is None, **kwargs))

def downgrade():
    op.drop_column("pass_requests", "expires_at")
    op.drop_column("pass_requests", "referral_contact")
    op.drop_column("pass_requests", "phone")
    op.drop_column("users", "verification_expires_at")
    op.drop_column("users", "verification_token")
    op.drop_column("users", "email_verified")
    op.drop_column("users", "referral_contact")
