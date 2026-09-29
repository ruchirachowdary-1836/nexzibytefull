"""Add nullable contact numbers and admin report run tracking."""

import sqlalchemy as sa
from alembic import op

revision = "0029_contact_admin_reports"
down_revision = "0028_static_faqs"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("phone", sa.String(length=40), nullable=True))
    op.add_column("registrations", sa.Column("phone", sa.String(length=40), nullable=True))
    op.create_table(
        "admin_report_runs",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("cadence", sa.String(length=16), nullable=False),
        sa.Column("period_start", sa.Date(), nullable=False),
        sa.Column("period_end", sa.Date(), nullable=False),
        sa.Column("status", sa.String(length=20), nullable=False),
        sa.Column("attempted_at", sa.DateTime(), nullable=False),
        sa.Column("sent_at", sa.DateTime(), nullable=True),
        sa.Column("error_type", sa.String(length=60), nullable=True),
        sa.UniqueConstraint(
            "cadence", "period_start", "period_end", name="uq_admin_report_period"
        ),
    )


def downgrade():
    op.drop_table("admin_report_runs")
    op.drop_column("registrations", "phone")
    op.drop_column("users", "phone")
