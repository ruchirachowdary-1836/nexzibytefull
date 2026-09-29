"""Add server-enforced visitor trial session timestamps."""

import sqlalchemy as sa
from alembic import op

revision = "0030_visitor_trial_session"
down_revision = "0029_contact_admin_reports"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column(
        "users",
        sa.Column(
            "visitor_access_only",
            sa.Boolean(),
            nullable=False,
            server_default=sa.false(),
        ),
    )
    op.add_column(
        "users", sa.Column("visitor_activated_at", sa.DateTime(), nullable=True)
    )
    op.add_column(
        "users", sa.Column("visitor_expires_at", sa.DateTime(), nullable=True)
    )


def downgrade():
    op.drop_column("users", "visitor_expires_at")
    op.drop_column("users", "visitor_activated_at")
    op.drop_column("users", "visitor_access_only")
