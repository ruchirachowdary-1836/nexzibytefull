"""Track registration confirmation email delivery."""

import sqlalchemy as sa
from alembic import op


revision = "0020_registration_emails"
down_revision = "0019_course_app_pass_fields"
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    for table_name in ("registrations", "course_applications", "pass_requests"):
        if not inspector.has_table(table_name):
            continue
        existing = {column["name"] for column in inspector.get_columns(table_name)}
        for column_name, column_type in (
            ("email_sent_at", sa.DateTime()),
            ("email_last_attempt_at", sa.DateTime()),
            ("email_pass_id", sa.String(length=40)),
            ("email_delivery_status", sa.String(length=20)),
        ):
            if column_name not in existing:
                op.add_column(
                    table_name,
                    sa.Column(
                        column_name,
                        column_type,
                        nullable=column_name != "email_delivery_status",
                        server_default="pending" if column_name == "email_delivery_status" else None,
                    ),
                )
        if "email_delivery_status" in existing:
            op.alter_column(
                table_name,
                "email_delivery_status",
                existing_type=sa.String(length=20),
                nullable=False,
                server_default="pending",
            )


def downgrade():
    bind = op.get_bind()
    inspector = sa.inspect(bind)
    for table_name in ("pass_requests", "course_applications", "registrations"):
        if not inspector.has_table(table_name):
            continue
        existing = {column["name"] for column in inspector.get_columns(table_name)}
        for column_name in (
            "email_delivery_status",
            "email_pass_id",
            "email_last_attempt_at",
            "email_sent_at",
        ):
            if column_name in existing:
                op.drop_column(table_name, column_name)
